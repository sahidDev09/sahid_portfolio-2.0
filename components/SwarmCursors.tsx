"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const AGENTS = [
  ["Ada", "#f472b6"],
  ["Lux", "#60a5fa"],
  ["Cyd", "#c084fc"],
  ["Dex", "#34d399"],
  ["Gus", "#38bdf8"],
  ["Ivy", "#a78bfa"],
  ["Hal", "#fb7185"],
  ["Kit", "#fbbf24"],
  ["Max", "#fb923c"],
  ["Zoe", "#4ade80"],
] as const;

const SELECTOR = "h1, h2, h3, p, a, button, img, [role=button], div";

const clear = (c: string) => c === "transparent" || c.endsWith(", 0)");
// Divs only count as "cards": rounded, with a visible border, fill or shadow.
function isCard(el: Element) {
  const cs = getComputedStyle(el);
  if (!(parseFloat(cs.borderTopLeftRadius) > 0)) return false;
  // Skip decorative glows/blobs: blurred, click-through, or circular shapes.
  if (cs.filter.includes("blur") || cs.pointerEvents === "none") return false;
  const r = el.getBoundingClientRect();
  const circle =
    Math.abs(r.width - r.height) < Math.max(r.width, r.height) * 0.15 &&
    parseFloat(cs.borderTopLeftRadius) >= Math.min(r.width, r.height) / 2 - 1;
  if (circle) return false;
  return (
    (parseFloat(cs.borderTopWidth) > 0 && !clear(cs.borderTopColor)) ||
    !clear(cs.backgroundColor) ||
    cs.boxShadow !== "none"
  );
}
const RING_R = 38;
const BOX = "#4f7cff";
const visible = (el: Element) => el.checkVisibility?.({ visibilityProperty: true }) ?? true;


const FLOCK_BACK = 10; // frames of mouse history the flock centre trails behind
const STOP_MS = 180; // mouse idle this long = stopped, form the ring
const DRAW_MS = 650;
const FLY_MAX_MS = 600; // start drawing even if the target keeps moving (marquees, floating cards)
const HOLD_MS = 450;

type Task = { el: Element; phase: "fly" | "draw" | "type" | "hold"; t: number; dur: number };
type Part = { node: Text; full: string; last: string };
type Typing = { el: HTMLElement; parts: Part[]; total: number; minW: string; minH: string };

const claimed = new WeakSet<Text>();

// Blank an element's text (keeping its size so layout doesn't jump) so it can be typed back in.
function claim(el: Element): Typing | null {
  if (!(el instanceof HTMLElement) || el instanceof HTMLImageElement) return null;
  const parts: Part[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const node = n as Text;
    if (claimed.has(node)) return null; // an ancestor/descendant is already typing it
    if (node.data.trim()) parts.push({ node, full: node.data, last: "" });
  }
  if (!parts.length) return null;
  const r = el.getBoundingClientRect();
  const t: Typing = { el, parts, total: 0, minW: el.style.minWidth, minH: el.style.minHeight };
  el.style.minWidth = `${r.width}px`;
  el.style.minHeight = `${r.height}px`;
  for (const p of parts) {
    claimed.add(p.node);
    p.node.data = "";
    t.total += p.full.length;
  }
  return t;
}

// Parts whose text was changed by React in the meantime are left alone.
function setTyped(t: Typing, n: number) {
  for (const p of t.parts) {
    const s = p.full.slice(0, Math.max(0, n));
    n -= p.full.length;
    if (p.node.data !== p.last) continue;
    p.node.data = s;
    p.last = s;
  }
}

function restore(t: Typing) {
  for (const p of t.parts) {
    if (p.node.data === p.last) p.node.data = p.full;
    claimed.delete(p.node);
  }
  t.el.style.minWidth = t.minW;
  t.el.style.minHeight = t.minH;
}

function caret(t: Typing, range: Range) {
  for (let i = t.parts.length - 1; i >= 0; i--) {
    const p = t.parts[i];
    if (!p.last || !p.node.isConnected) continue;
    range.setStart(p.node, p.last.length);
    range.collapse(true);
    const r = range.getClientRects()[0];
    if (r) return { x: r.right, y: r.top + r.height * 0.15 };
  }
  return null;
}

// Colourful cursor agents: they frame page elements as they scroll into view,
// and idle agents circle the real cursor in a ring that follows it.
export default function SwarmCursors() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (
      !matchMedia("(pointer: fine)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      root.style.display = "none";
      return;
    }

    const cursors = Array.from(root.querySelectorAll<HTMLElement>("[data-cursor]"));
    const boxes = Array.from(root.querySelectorAll<HTMLElement>("[data-box]"));
    const agents = cursors.map(() => ({
      x: Math.random() * innerWidth,
      y: innerHeight + 40,
      rot: 0,
      // Fixed spot in a loose flock behind the mouse, and a personal follow speed.
      ox: (Math.random() - 0.5) * 110,
      oy: (Math.random() - 0.5) * 60,
      speed: 0.1 + Math.random() * 0.1,
      task: null as Task | null,
    }));
    const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
    const queue: Element[] = [];
    const seen = new WeakSet<Element>();
    const typing = new Map<Element, Typing>();
    const range = document.createRange();
    // Elements stay hidden (visibility, so layout holds) until their cursor finishes the box.
    // Meanwhile a placeholder sits in their place: gray shape for cards, blue outline for the rest.
    const layer = root.querySelector<HTMLElement>("[data-ph]")!;
    const hidden = new Map<HTMLElement, { prev: string; ph: HTMLElement }>();
    const hide = (el: Element) => {
      if (!(el instanceof HTMLElement) || hidden.has(el)) return;
      const ph = document.createElement("div");
      ph.style.cssText = "position:absolute;left:0;top:0";
      if (el.tagName === "DIV") {
        ph.style.background = "rgba(255,255,255,0.07)";
        ph.style.borderRadius = getComputedStyle(el).borderRadius;
      } else {
        ph.style.border = `1px solid ${BOX}99`;
        ph.style.borderRadius = "3px";
      }
      layer.appendChild(ph);
      hidden.set(el, { prev: el.style.visibility, ph });
      el.style.visibility = "hidden";
    };
    const show = (el: Element) => {
      const h = hidden.get(el as HTMLElement);
      if (!h) return;
      (el as HTMLElement).style.visibility = h.prev;
      h.ph.remove();
      hidden.delete(el as HTMLElement);
    };
    // Build parents before children: a child inside a still-hidden parent would be invisible.
    const insideHidden = (el: Element) => {
      for (const h of hidden.keys()) if (h !== el && h.contains(el)) return true;
      return false;
    };
    const release = (el: Element) => {
      const t = typing.get(el);
      if (t) restore(t);
      typing.delete(el);
      show(el);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          const r = e.boundingClientRect;
          if (r.width < 12 || r.height < 8 || r.height >= innerHeight) continue;
          if (e.target.tagName === "DIV" && (r.width < 60 || r.height < 40 || r.width > innerWidth * 0.9)) continue;
          // Our own hiding of a parent doesn't count as invisible.
          if (!insideHidden(e.target) && !visible(e.target)) continue;
          queue.push(e.target);
          const t = claim(e.target);
          if (t) typing.set(e.target, t);
          hide(e.target);
        }
      },
      { threshold: 0, rootMargin: "0px 0px 15% 0px" }
    );
    // Rescan so content that mounts later (intro animations, lazy sections) gets built too.
    // Swarm waits until the hero journey is 70% through (it sets data-swarm); no journey = always on.
    const isActive = () => {
      const j = document.querySelector(".journey");
      return !j || j.hasAttribute("data-swarm");
    };
    // While the hero journey runs, the hero + navbar on screen are the copy inside its portal
    // (the real ones are visibility:hidden until data-done), so build the portal copy and skip
    // the journey's own content. The real hero/navbar are only built if the portal copy never
    // was, e.g. the page loaded already scrolled past the journey.
    let builtPortal = false;
    const allowed = (el: Element) => {
      const j = document.querySelector(".journey");
      if (!j) return true;
      const done = j.hasAttribute("data-done");
      if (el.closest(".journey")) return !done && !!el.closest(".portal__content");
      if (el.closest(".landing-hero-continuation")) return done && !builtPortal;
      return true;
    };
    let active = isActive();
    root.style.opacity = active ? "1" : "0";
    const scan = () => {
      if (!active) return;
      const j = document.querySelector(".journey");
      if (j && !j.hasAttribute("data-done")) builtPortal = true;
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (seen.has(el) || root.contains(el) || !allowed(el)) return;
        seen.add(el);
        if (el.tagName === "DIV" && !isCard(el)) return;
        io.observe(el);
      });
    };
    scan();
    const scanTimer = setInterval(scan, 1500);

    const hist: { x: number; y: number }[] = [];
    let lastMove = -Infinity;
    let heading = Math.PI; // radians; flock faces left until the mouse moves
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      lastMove = performance.now();
    };
    addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const loop = (now: number) => {
      const nowActive = isActive();
      if (nowActive !== active) {
        active = nowActive;
        root.style.opacity = active ? "1" : "0";
        scan();
      }
      hidden.forEach(({ ph }, el) => {
        const r = el.getBoundingClientRect();
        ph.style.transform = `translate(${r.left}px, ${r.top}px)`;
        ph.style.width = `${r.width}px`;
        ph.style.height = `${r.height}px`;
      });
      hist.push({ x: mouse.x, y: mouse.y });
      if (hist.length > 200) hist.shift();
      const moving = now - lastMove < STOP_MS;
      const at = (back: number) => hist[Math.max(0, hist.length - 1 - back)];
      // Shared heading so the whole flock points the same way.
      const back = at(6);
      if (Math.hypot(mouse.x - back.x, mouse.y - back.y) > 2) {
        heading = Math.atan2(mouse.y - back.y, mouse.x - back.x);
      }
      agents.forEach((a, i) => {
        const cursor = cursors[i];
        const box = boxes[i];
        const label = cursor.lastElementChild as HTMLElement;
        const arrow = cursor.firstElementChild as HTMLElement;
        const ibeam = arrow.nextElementSibling as HTMLElement;
        if (!a.task && queue.length) {
          const idx = queue.findIndex((el) => !insideHidden(el));
          if (idx >= 0) {
            a.task = { el: queue.splice(idx, 1)[0], phase: "fly", t: now, dur: 0 };
            label.style.opacity = "1";
          }
        }

        let tx: number, ty: number;
        let trot = 0;
        let k = 0.12;
        const task = a.task;

        if (task) {
          const r = task.el.getBoundingClientRect();
          if (task.phase === "fly") {
            tx = r.left;
            ty = r.top;
            if (
              r.bottom < 0 ||
              r.top > innerHeight * 1.5 ||
              !task.el.isConnected ||
              task.el.closest(".journey[data-done]")
            ) {
              release(task.el);
              a.task = null;
              label.style.opacity = "0";
            } else if (Math.hypot(tx - a.x, ty - a.y) < 8 || now - task.t > FLY_MAX_MS) {
              task.phase = "draw";
              task.t = now;
              (box.firstElementChild as HTMLElement).textContent =
                `${Math.round(r.width)} × ${Math.round(r.height)}`;
              box.style.opacity = "1";
            }
          } else {
            const p = Math.min(1, (now - task.t) / DRAW_MS);
            const ease = task.phase === "draw" ? 1 - (1 - p) ** 3 : 1;
            const w = r.width * ease;
            const h = r.height * ease;
            box.style.transform = `translate(${r.left}px, ${r.top}px)`;
            box.style.width = `${w}px`;
            box.style.height = `${h}px`;
            tx = r.left + w;
            ty = r.top + h;
            k = 0.35;
            const typed = typing.get(task.el);
            if (task.phase === "draw" && p >= 1) {
              show(task.el);
              task.phase = typed ? "type" : "hold";
              task.t = now;
              if (typed) task.dur = Math.min(2200, Math.max(300, typed.total * 22));
            } else if (task.phase === "type" && typed) {
              const tp = Math.min(1, (now - task.t) / task.dur);
              setTyped(typed, Math.round(typed.total * tp));
              const c = caret(typed, range);
              if (c) {
                tx = c.x;
                ty = c.y;
              }
              k = 0.5;
              arrow.style.opacity = "0";
              ibeam.style.opacity = "1";
              if (tp >= 1) {
                arrow.style.opacity = "1";
                ibeam.style.opacity = "0";
                release(task.el);
                task.phase = "hold";
                task.t = now;
              }
            } else if (task.phase === "hold" && now - task.t > HOLD_MS) {
              box.style.opacity = "0";
              label.style.opacity = "0";
              a.task = null;
            }
          }
        } else if (moving) {
          // Follow as a loose flock behind the mouse, all pointing the way it's heading.
          const c = at(FLOCK_BACK);
          const cos = Math.cos(heading);
          const sin = Math.sin(heading);
          // Offsets are rotated so the flock stretches along the direction of travel.
          tx = c.x - 40 * cos + a.ox * cos - a.oy * sin;
          ty = c.y - 40 * sin + a.ox * sin + a.oy * cos;
          trot = (heading * 180) / Math.PI + 135;
          k = a.speed;
        } else {
          const ang = (i / agents.length) * Math.PI * 2 + now * 0.0005;
          tx = mouse.x + Math.cos(ang) * RING_R;
          ty = mouse.y + Math.sin(ang) * RING_R;
          // Arrow tip points up-left (-135°); rotate it to face the ring centre.
          trot = ((ang + Math.PI) * 180) / Math.PI + 135;
        }

        a.x += (tx - a.x) * k;
        a.y += (ty - a.y) * k;
        a.rot += ((((trot - a.rot + 540) % 360) + 360) % 360 - 180) * 0.15;
        cursor.style.transform = `translate(${a.x}px, ${a.y}px)`;
        arrow.style.transform = `rotate(${a.rot}deg)`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(scanTimer);
      io.disconnect();
      typing.forEach(restore);
      typing.clear();
      hidden.forEach(({ prev, ph }, el) => {
        el.style.visibility = prev;
        ph.remove();
      });
      hidden.clear();
      removeEventListener("pointermove", onMove);
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div ref={rootRef} aria-hidden className="pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300">
      <div data-ph />
      {AGENTS.map(([name]) => (
        <div
          key={`box-${name}`}
          data-box
          className="absolute left-0 top-0 opacity-0 transition-opacity duration-300"
          style={{ border: `1px solid ${BOX}`, background: `${BOX}0d` }}
        >
          <span
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white"
            style={{ background: BOX }}
          />
          {["-left-1 -top-1", "-right-1 -top-1", "-left-1 -bottom-1", "-right-1 -bottom-1"].map((pos) => (
            <i
              key={pos}
              className={`absolute ${pos} h-2 w-2 bg-white`}
              style={{ border: `1px solid ${BOX}` }}
            />
          ))}
        </div>
      ))}
      {AGENTS.map(([name, color]) => (
        <div key={name} data-cursor className="absolute left-0 top-0 will-change-transform">
          <svg width="18" height="20" viewBox="0 0 18 20" style={{ transformOrigin: "0 0" }}>
            <path
              d="M1 1 L1 16 L5 12 L8 19 L11 18 L8 11 L14 11 Z"
              fill={color}
              stroke="#fff"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            width="10"
            height="18"
            viewBox="0 0 10 18"
            className="absolute -left-[5px] top-0 opacity-0"
          >
            <path
              d="M2 1 H8 M5 1 V17 M2 17 H8"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span
            className="absolute left-4 top-5 rounded-full px-2 py-0.5 text-[10px] font-medium text-black opacity-0 transition-opacity duration-200"
            style={{ background: color }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>,
    document.body
  );
}
