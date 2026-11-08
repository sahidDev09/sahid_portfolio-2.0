"use client";

import React, { useEffect, useRef } from "react";
import { GLYPH_DATA } from "@/constants/logoData";
import { GlyphLogo } from "./GlyphLogo";
import { MorphingHeadline } from "./MorphingHeadline";
import { InteractivePoints } from "./InteractivePoints";
import "./hero-journey.css";

const TAU = 2 * Math.PI;
const DEG2RAD = Math.PI / 180;

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const formatFixed = (v: number, digits = 3) => v.toFixed(digits);

interface HeroJourneyProps {
  portalContent?: React.ReactNode;
  title1?: string;
  title2?: string;
  lede?: string;
  primaryActionText?: string;
  primaryActionHref?: string;
  secondaryActionText?: string;
  secondaryActionHref?: string;
  metaItems?: string[];
}

export const HeroJourney: React.FC<HeroJourneyProps> = ({
  portalContent,
  lede = "Unlimited vibe coding. Free. With any AI.",
  primaryActionText = "Explore work",
  primaryActionHref = "#projects",
  secondaryActionText = "About me",
  secondaryActionHref = "#about",
  metaItems = [
    "Design Engineer",
    "Full-Stack",
    "Open Source",
    "Creative Tech",
    "Next.js · React · GSAP · WebGL",
  ],
}) => {
  const journeyRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const shroudRef = useRef<HTMLCanvasElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const portalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const journey = journeyRef.current;
    const hero = heroRef.current;
    const mark = markRef.current;
    const shroud = shroudRef.current;
    const portal = portalRef.current;
    const content = portalContentRef.current;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!journey || !hero || !mark || !shroud || !portal || !content || prefersReducedMotion.matches) {
      return;
    }

    const nextSection = journey.nextElementSibling as HTMLElement | null;

    const elements: Record<string, HTMLElement | null> = {
      mark,
      halo: haloRef.current,
      headline: journey.querySelector(".headline"),
      points: journey.querySelector(".points"),
      meta: journey.querySelector(".hero__meta"),
      portal,
      content,
      body: journey.querySelector(".glyph__body"),
      vignette: journey.querySelector(".hero__vignette"),
      grain: journey.querySelector(".hero__grain"),
      floor: journey.querySelector(".hero__floor"),
    };

    const elementKeys = Object.keys(elements).filter((k) => elements[k] !== null);
    const glyphPath = new Path2D(GLYPH_DATA.path);
    const ctx = shroud.getContext("2d");
    if (!ctx) return;

    const bgColor =
      getComputedStyle(document.documentElement).getPropertyValue("--color-background").trim() || "#000000";

    let metrics: {
      top: number;
      k0: number;
      px: number;
      py: number;
      travel: number;
      end: number;
      w: number;
      h: number;
      density: number;
    } | null = null;

    let lastProgress = -1;
    let rafId = 0;
    const attrState: Record<string, boolean> = {};

    const computeMetrics = () => {
      let offsetLeft = 0;
      let offsetTop = 0;
      for (let el: HTMLElement | null = mark; el && el !== hero; el = el.offsetParent as HTMLElement | null) {
        offsetLeft += el.offsetLeft;
        offsetTop += el.offsetTop;
      }

      const markW = mark.offsetWidth;
      const markH = mark.offsetHeight;
      const heroW = hero.offsetWidth;
      const heroH = hero.offsetHeight;

      const scaleK0 = Math.min(markW / GLYPH_DATA.viewBox[2], markH / GLYPH_DATA.viewBox[3]);
      const centerPxX =
        offsetLeft + (markW - GLYPH_DATA.viewBox[2] * scaleK0) / 2 + (GLYPH_DATA.center.x - GLYPH_DATA.viewBox[0]) * scaleK0;
      const centerPxY =
        offsetTop + (markH - GLYPH_DATA.viewBox[3] * scaleK0) / 2 + (GLYPH_DATA.center.y - GLYPH_DATA.viewBox[1]) * scaleK0;

      let maxEndScale = 0;
      for (let angleDeg = 0; angleDeg < 360; angleDeg += 1) {
        const quadrant = (angleDeg / 360) * 4;
        const qFloor = Math.floor(quadrant);
        const qFrac = quadrant - qFloor;

        const cornerX =
          (qFloor === 0 ? qFrac * heroW : qFloor === 1 ? heroW : qFloor === 2 ? (1 - qFrac) * heroW : 0) - centerPxX;
        const cornerY =
          (qFloor === 0 ? 0 : qFloor === 1 ? qFrac * heroH : qFloor === 2 ? heroH : (1 - qFrac) * heroH) - centerPxY;

        const rayAngle = Math.atan2(cornerY, cornerX);
        const rayAngleNorm = ((rayAngle % TAU) + TAU) % TAU;
        const tIndex = (rayAngleNorm / TAU) * GLYPH_DATA.outline.length;
        const idxA = Math.floor(tIndex) % GLYPH_DATA.outline.length;
        const idxB = (idxA + 1) % GLYPH_DATA.outline.length;
        const outlineRadius =
          (GLYPH_DATA.outline[idxA] +
            (GLYPH_DATA.outline[idxB] - GLYPH_DATA.outline[idxA]) * (tIndex - Math.floor(tIndex))) *
          scaleK0;

        maxEndScale = Math.max(maxEndScale, Math.hypot(cornerX, cornerY) / outlineRadius);
      }

      const travelDist = 1.35 * window.innerHeight;
      const heroTop = journey.getBoundingClientRect().top + window.scrollY;
      const pixelDensity = Math.min(window.devicePixelRatio || 1, Math.sqrt(4200000 / (heroW * heroH)));

      metrics = {
        top: heroTop,
        k0: scaleK0,
        px: centerPxX,
        py: centerPxY,
        travel: travelDist,
        end: Math.max(1.05 * maxEndScale, 3),
        w: heroW,
        h: heroH,
        density: pixelDensity,
      };

      journey.style.height = `${heroH + travelDist}px`;
      if (nextSection) {
        nextSection.style.marginTop = `-${heroH}px`;
      }
      mark.style.transformOrigin = `${centerPxX - offsetLeft}px ${centerPxY - offsetTop}px`;
      shroud.width = Math.round(heroW * pixelDensity);
      shroud.height = Math.round(heroH * pixelDensity);
    };

    const renderHole = (tiltDeg: number, currentScale: number) => {
      if (!metrics) return;
      const { w, h, density, px, py } = metrics;
      ctx.setTransform(density, 0, 0, density, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "destination-out";
      ctx.translate(px, py);
      ctx.rotate(tiltDeg * DEG2RAD);
      ctx.scale(currentScale, currentScale);
      ctx.translate(-GLYPH_DATA.center.x, -GLYPH_DATA.center.y);
      ctx.fill(glyphPath);
    };

    const calculateStyles = (progress: number) => {
      if (!metrics) return null;
      // Complete zoom cleanly without late deceleration
      const p = clamp(progress / 0.92);
      const t = Math.pow(p, 1.3);
      const scaleMultiplier = Math.exp(Math.log(metrics.end) * t);
      const tiltAngle = 30 * Math.sin(Math.PI * t);

      const copyFade = clamp(p / 0.25);
      const portalFade = clamp((p - 0.1) / 0.35);
      const portalZoom = 1 + 0.12 * (1 - Math.pow(p, 0.8));
      const headlineScale = 1 + 0.2 * copyFade;
      const envOpacity = formatFixed(1 - clamp((p - 0.15) / 0.45), 4);

      return {
        tilt: tiltAngle,
        k: metrics.k0 * scaleMultiplier,
        mark: {
          transform: `rotate(${formatFixed(tiltAngle)}deg) scale(${formatFixed(scaleMultiplier, 4)})`,
        },
        halo: {
          transform: `scale(${formatFixed(1 + 2.4 * t, 4)}) translate(-50%, -50%)`,
          opacity: formatFixed(1 - clamp((p - 0.3) / 0.45), 4),
        },
        headline: {
          transform: `translate(${formatFixed(-110 * copyFade, 2)}px, 0px) scale(${formatFixed(headlineScale, 4)})`,
          opacity: formatFixed(1 - copyFade, 4),
        },
        points: {
          transform: `translate(${formatFixed(110 * copyFade, 2)}px, 0px) scale(${formatFixed(headlineScale, 4)})`,
          opacity: formatFixed(1 - copyFade, 4),
        },
        meta: {
          transform: `translate(0px, ${formatFixed(48 * copyFade, 2)}px)`,
          opacity: formatFixed(1 - copyFade, 4),
        },
        portal: {
          opacity: formatFixed(portalFade, 4),
        },
        content: {
          transform: `scale(${formatFixed(portalZoom, 5)})`,
        },
        body: {
          opacity: formatFixed(1 - portalFade, 4),
        },
        vignette: { opacity: envOpacity },
        grain: { opacity: formatFixed(0.045 * Number(envOpacity), 4) },
        floor: { opacity: envOpacity },
      };
    };

    const setAttr = (name: string, val: boolean) => {
      if (attrState[name] !== val) {
        attrState[name] = val;
        journey.toggleAttribute(name, val);
      }
    };

    const updateFrame = (progress: number) => {
      const styles = calculateStyles(progress);
      if (!styles) return;

      elementKeys.forEach((key) => {
        const el = elements[key];
        const s = styles[key as keyof typeof styles];
        if (el && typeof s === "object" && s !== null) {
          if ("transform" in s && s.transform !== undefined) el.style.transform = s.transform;
          if ("opacity" in s && s.opacity !== undefined) el.style.opacity = s.opacity;
        }
      });

      renderHole(styles.tilt, styles.k);
    };

    const onScrollTick = () => {
      rafId = 0;
      if (!metrics) return;
      const progress = clamp((window.scrollY - metrics.top) / metrics.travel);
      if (Math.abs(progress - lastProgress) < 0.0002) return;
      lastProgress = progress;

      const isDone = progress >= 0.94;
      const p = clamp(progress / 0.92);
      setAttr("data-done", isDone);
      setAttr("data-flying", progress > 0 && !isDone);
      setAttr("data-copy-gone", p >= 0.25);

      updateFrame(progress);
    };

    const requestFrame = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(onScrollTick);
      }
    };

    const refresh = () => {
      computeMetrics();
      lastProgress = -1;
      requestFrame();
    };

    journey.toggleAttribute("data-live", true);
    refresh();

    window.addEventListener("scroll", requestFrame, { passive: true });
    window.addEventListener("resize", refresh);
    const resizeObserver = new ResizeObserver(refresh);
    resizeObserver.observe(hero);

    if (document.fonts) {
      document.fonts.ready.then(refresh);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", requestFrame);
      window.removeEventListener("resize", refresh);
      resizeObserver.disconnect();
      elementKeys.forEach((key) => {
        const el = elements[key];
        if (el) {
          el.style.transform = "";
          el.style.opacity = "";
        }
      });
      ["data-live", "data-done", "data-flying", "data-copy-gone"].forEach((attr) =>
        journey.removeAttribute(attr)
      );
      journey.style.height = "";
      if (nextSection) nextSection.style.marginTop = "";
    };
  }, []);

  return (
    <div ref={journeyRef} className="journey">
      <section ref={heroRef} className="hero">
        {/* Background Atmosphere */}
        <div className="hero__vignette" />
        <div className="hero__grain" />
        <div className="hero__floor" />

        {/* Central Logo Art & Dynamic Halo */}
        <div className="hero__art" aria-hidden="true">
          <div ref={haloRef} className="hero__halo" />
          <div ref={markRef} className="hero__mark">
            <GlyphLogo />
          </div>
        </div>

        {/* 3-Column Hero Stage */}
        <div className="hero__stage">
          {/* Column 1: Morphing headline & action buttons */}
          <div className="headline">
            <MorphingHeadline />
            <p className="headline__lede">{lede}</p>
            <div className="headline__actions">
              <a href={primaryActionHref} className="btn btn--solid">
                {primaryActionText}
              </a>
              <a href={secondaryActionHref} className="btn btn--muted">
                {secondaryActionText}
              </a>
            </div>
          </div>

          {/* Column 3: Interactive Points */}
          <InteractivePoints />
        </div>

        {/* Hero Footer Meta Badges */}
        <footer className="hero__meta">
          <ul className="meta__list">
            {metaItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </footer>

        {/* Portal revealed through zooming logo hole */}
        <div ref={portalRef} className="portal" data-journey-portal="" aria-hidden="true">
          <div ref={portalContentRef} className="portal__content" data-journey-content="">
            {portalContent || (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-black">
                <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
                  Welcome to my Portfolio
                </h2>
                <p className="mt-4 text-base sm:text-lg text-neutral-400 max-w-md">
                  Keep scrolling to explore projects, case studies, and engineering workflows.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Shroud Canvas punching out flower glyph */}
        <canvas ref={shroudRef} className="shroud" data-journey-shroud="" aria-hidden="true" />
      </section>
    </div>
  );
};

