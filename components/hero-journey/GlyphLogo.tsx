"use client";

import React, { useEffect, useRef } from "react";
import { GLYPH_DATA, LIGHT_CONFIG, GLYPH_SHEETS } from "@/constants/logoData";

const BREAKPOINTS = { mobile: 640, tablet: 1080 };
const QUALITY = {
  desktop: { oversample: 2, sheetPixels: 1100000 },
  tablet: { oversample: 1.75, sheetPixels: 800000 },
  mobile: { oversample: 1.5, sheetPixels: 550000 },
};

const TAU = 2 * Math.PI;
const INITIAL_ANGLE = (-125 * Math.PI) / 180;

const clamp = (e: number) => (e < 0 ? 0 : e > 1 ? 1 : e);
const ease = (e: number) => e * e * (3 - 2 * e);
const wrapAngle = (e: number) => ((e % TAU) + TAU) % TAU;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function getOutlinePoint(
  center: { x: number; y: number },
  outline: number[],
  angle: number,
  baseRadius = 0
) {
  let dist = baseRadius;
  if (outline?.length) {
    const t = (wrapAngle(angle) / TAU) * outline.length;
    const n = Math.floor(t) % outline.length;
    const s = (n + 1) % outline.length;
    dist = outline[n] + (outline[s] - outline[n]) * (t - Math.floor(t));
  }
  return {
    x: center.x + Math.cos(angle) * dist,
    y: center.y + Math.sin(angle) * dist,
  };
}

interface GlyphLogoProps {
  className?: string;
}

export const GlyphLogo: React.FC<GlyphLogoProps> = ({ className = "" }) => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const [vx, vy, vw, vh] = GLYPH_DATA.viewBox;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const orbitSpeed = prefersReducedMotion ? 0 : LIGHT_CONFIG.orbitSpeed;

    const state = {
      angle: INITIAL_ANGLE,
      influence: 0,
      pointer: null as { x: number; y: number } | null,
    };

    let rafId = 0;
    let lastTime = 0;
    let isIntersecting = true;
    let isLive = true;

    const sheets = GLYPH_SHEETS.map((spec) => ({
      spec,
      canvas: host.querySelector(`[data-rim-sheet="${spec.key}"]`) as HTMLCanvasElement | null,
      ctx: null as CanvasRenderingContext2D | null,
      images: null as HTMLImageElement[] | null,
      map: null as HTMLCanvasElement | null,
    }));

    let hostRect = host.getBoundingClientRect();
    let scrollDirty = false;
    let dims = { w: host.offsetWidth, h: host.offsetHeight };
    let scale = 1;

    const getDeviceTier = () => {
      const width = window.innerWidth;
      if (width <= BREAKPOINTS.mobile) return "mobile";
      if (width <= BREAKPOINTS.tablet) return "tablet";
      return "desktop";
    };

    const updateScale = () => {
      hostRect = host.getBoundingClientRect();
      dims = { w: host.offsetWidth, h: host.offsetHeight };
      const area = dims.w * dims.h;
      const { oversample, sheetPixels } = QUALITY[getDeviceTier()];
      const density = area ? Math.sqrt(sheetPixels / area) : 1;
      scale = Math.min((window.devicePixelRatio || 1) * oversample, density);
    };

    const prepareSheets = () => {
      if (!dims.w || !dims.h) return;
      const pixelW = Math.round(dims.w * scale);
      const pixelH = Math.round(dims.h * scale);

      for (const sheet of sheets) {
        if (!sheet.images || !sheet.canvas) continue;
        sheet.canvas.width = pixelW;
        sheet.canvas.height = pixelH;

        const offscreen = sheet.map ?? document.createElement("canvas");
        offscreen.width = pixelW;
        offscreen.height = pixelH;
        const offCtx = offscreen.getContext("2d");
        if (offCtx) {
          offCtx.clearRect(0, 0, pixelW, pixelH);
          for (const img of sheet.images) {
            offCtx.drawImage(img, 0, 0, pixelW, pixelH);
          }
        }
        sheet.map = offscreen;
        sheet.ctx = sheet.canvas.getContext("2d");
      }
    };

    const drawFrame = () => {
      if (!dims.w || !dims.h) return;

      const pt = getOutlinePoint(GLYPH_DATA.center, GLYPH_DATA.outline, state.angle, GLYPH_DATA.radius);
      const screenX = ((pt.x - vx) / vw) * dims.w;
      const screenY = ((pt.y - vy) / vh) * dims.h;
      const radius = ((LIGHT_CONFIG.size * dims.w) / 2) * (1 + LIGHT_CONFIG.swell * state.influence);

      for (const sheet of sheets) {
        if (!sheet.ctx || !sheet.map) continue;
        const { ctx } = sheet;

        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, dims.w, dims.h);

        const grad = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, radius);
        for (const [stop, col] of LIGHT_CONFIG.stops) {
          grad.addColorStop(stop, col);
        }

        ctx.fillStyle = grad;
        ctx.fillRect(screenX - radius, screenY - radius, 2 * radius, 2 * radius);

        ctx.globalCompositeOperation = "destination-in";
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(sheet.map, 0, 0);
      }
    };

    const animate = (time: number) => {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;

      let targetInfluence = 0;
      let targetAngle = state.angle;

      if (state.pointer) {
        const dx = state.pointer.x - GLYPH_DATA.center.x;
        const dy = state.pointer.y - GLYPH_DATA.center.y;
        const dist = Math.hypot(dx, dy);
        targetInfluence = ease(clamp(1 - dist / (GLYPH_DATA.radius * LIGHT_CONFIG.attractRadius)));
        if (dist > 0.01) {
          targetAngle = Math.atan2(dy, dx);
        }
      }

      state.influence += (targetInfluence - state.influence) * Math.min(1, LIGHT_CONFIG.blendSpeed * dt);
      state.angle += orbitSpeed * (1 - state.influence) * dt;

      let diff = (targetAngle - state.angle) % TAU;
      if (diff > Math.PI) diff -= TAU;
      if (diff < -Math.PI) diff += TAU;
      state.angle += diff * Math.min(1, state.influence * LIGHT_CONFIG.followSpeed * dt);
      state.angle = wrapAngle(state.angle);

      drawFrame();

      if (!orbitSpeed && !state.pointer && state.influence < 0.002) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(animate);
    };

    const startLoop = () => {
      if (!rafId && isIntersecting && !document.hidden) {
        lastTime = 0;
        rafId = requestAnimationFrame(animate);
      }
    };

    const stopLoop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (scrollDirty) {
        scrollDirty = false;
        hostRect = host.getBoundingClientRect();
      }
      if (hostRect.width && hostRect.height) {
        state.pointer = {
          x: vx + ((e.clientX - hostRect.left) / hostRect.width) * vw,
          y: vy + ((e.clientY - hostRect.top) / hostRect.height) * vh,
        };
        startLoop();
      }
    };

    const onPointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) {
        state.pointer = null;
        startLoop();
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) stopLoop();
      else startLoop();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) startLoop();
        else stopLoop();
      },
      { threshold: 0 }
    );
    observer.observe(host);

    const resizeObserver = new ResizeObserver(() => {
      const prevKey = `${dims.w}x${dims.h}@${scale}`;
      updateScale();
      if (`${dims.w}x${dims.h}@${scale}` !== prevKey) {
        prepareSheets();
      }
      drawFrame();
    });
    resizeObserver.observe(host);

    if (!window.matchMedia("(pointer: coarse)").matches) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerout", onPointerOut);
    }

    const onScroll = () => {
      scrollDirty = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    updateScale();

    // Load sheet image assets
    Promise.all(
      sheets.map(async (sheet) => {
        sheet.images = await Promise.all(sheet.spec.bands.map(loadImage));
      })
    )
      .then(() => {
        if (isLive) {
          prepareSheets();
          drawFrame();
          startLoop();
        }
      })
      .catch((err) => {
        console.error("Failed to load glyph rim sheets", err);
      });

    return () => {
      isLive = false;
      stopLoop();
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div ref={hostRef} className={className ? `glyph ${className}` : "glyph"} aria-hidden="true">
      <canvas className="glyph__glow glyph__glow--under" data-rim-sheet="under" />
      <svg className="glyph__body" viewBox={GLYPH_DATA.viewBoxStr} width="100%" height="100%">
        <defs>
          <radialGradient id="brudBody" cx="50%" cy="58%" r="66%">
            <stop offset="0%" stopColor="#1e1430" />
            <stop offset="55%" stopColor="#0f091a" />
            <stop offset="100%" stopColor="#040207" />
          </radialGradient>
        </defs>
        <path d={GLYPH_DATA.path} fill="url(#brudBody)" />
      </svg>
      <canvas className="glyph__glow glyph__glow--over" data-rim-sheet="over" />
    </div>
  );
};
