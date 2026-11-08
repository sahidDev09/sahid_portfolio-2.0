"use client";

import React, { useEffect, useRef } from "react";

const easeInOutCubic = (e: number) => (e < 0.5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2);

function applyMorphState(el: HTMLElement, val: number) {
  const at = Math.min(Math.max(val, 0), 1);
  if (Math.abs(at - Number(el.dataset.at)) < 0.002) return;
  el.dataset.at = String(at);

  if (at < 0.008) {
    el.style.visibility = "hidden";
    el.style.filter = "none";
    el.classList.remove("headline__phrase--live");
    return;
  }

  el.style.visibility = "";
  const n = Math.max(at, 1e-4);
  el.style.opacity = String(Math.pow(n, 0.28));
  if (n >= 1) {
    el.style.filter = "none";
    el.classList.remove("headline__phrase--live");
  } else {
    el.classList.add("headline__phrase--live");
    el.style.filter = `blur(${Math.min(8 / n - 8, 16).toFixed(2)}px)`;
  }
}

export const MorphingHeadline: React.FC = () => {
  const rootRef = useRef<HTMLHeadingElement>(null);
  const phrase1Ref = useRef<HTMLSpanElement>(null);
  const phrase2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const p1 = phrase1Ref.current;
    const p2 = phrase2Ref.current;
    if (!root || !p1 || !p2) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let rafId = 0;
    let startTime = 0;
    let isIntersecting = true;
    const journey = root.closest(".journey");
    let lastTime = 0;

    const tick = (now: number) => {
      const isFlying = journey?.hasAttribute("data-flying");
      if (isFlying && startTime) {
        startTime += now - lastTime;
      }
      lastTime = now;
      if (isFlying) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (document.documentElement.classList.contains("intro")) {
        startTime = 0;
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (!startTime) startTime = now;
      const elapsed = (now - startTime) % 7000;

      let t = 0;
      if (elapsed < 2600) {
        t = 0;
      } else if (elapsed < 3500) {
        t = easeInOutCubic((elapsed - 2600) / 900);
      } else if (elapsed < 6100) {
        t = 1;
      } else {
        t = 1 - easeInOutCubic((elapsed - 6100) / 900);
      }

      applyMorphState(p2, t);
      applyMorphState(p1, 1 - t);

      rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const start = () => {
      stop();
      startTime = 0;
      if (prefersReducedMotion.matches) {
        applyMorphState(p1, 1);
        applyMorphState(p2, 0);
        return;
      }
      if (isIntersecting && !document.hidden) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        start();
      },
      { threshold: 0 }
    );
    observer.observe(root);

    start();
    prefersReducedMotion.addEventListener("change", start);
    document.addEventListener("visibilitychange", start);

    return () => {
      stop();
      observer.disconnect();
      prefersReducedMotion.removeEventListener("change", start);
      document.removeEventListener("visibilitychange", start);
    };
  }, []);

  return (
    <h1 className="headline__title" ref={rootRef}>
      <span className="headline__morph" aria-hidden="true">
        <span className="headline__phrase" ref={phrase1Ref} data-at="1">
          <span>Product</span>
          <span>Builder</span>
        </span>
        <span
          className="headline__phrase"
          ref={phrase2Ref}
          data-at="0"
          style={{ visibility: "hidden", opacity: 0 }}
        >
          <span>Code, Design,</span>
          <span>Vision</span>
        </span>
      </span>
      <span className="headline__plain">
        Product Builder: Code, Design, Vision
      </span>
      <svg className="headline__filter" aria-hidden="true" focusable="false">
        <defs>
          <filter id="brud-goo">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 60 -20"
            />
          </filter>
        </defs>
      </svg>
    </h1>
  );
};

