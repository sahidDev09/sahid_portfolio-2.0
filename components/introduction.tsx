"use client";

import { useEffect, useRef } from "react";
import { InteractiveHoverButton } from "./ui/interactive-hover-button";

const INTRO_TEXT =
  "Welcome to my digital portfolio! I'm Sahid, a passionate MERN stack developer dedicated to crafting beautiful and functional websites. Dive in to explore my work and journey";

const WORDS = INTRO_TEXT.split(" ");

const easeInOutCubic = (e: number) => (e < 0.5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2);

function applyMorphState(el: HTMLElement, val: number) {
  const at = Math.min(Math.max(val, 0), 1);
  if (Math.abs(at - Number(el.dataset.at ?? -1)) < 0.001) return;
  el.dataset.at = String(at);

  if (at < 0.008) {
    el.style.visibility = "hidden";
    el.style.opacity = "0";
    el.style.filter = "none";
    return;
  }

  el.style.visibility = "";
  const n = Math.max(at, 1e-4);
  el.style.opacity = String(Math.min(Math.pow(n, 0.45), 1));
  if (n >= 1) {
    el.style.filter = "none";
  } else {
    const blurPx = Math.pow(1 - n, 1.6) * 16;
    el.style.filter = `blur(${blurPx.toFixed(2)}px)`;
  }
}

const Introduction = () => {
  const textWrapRef = useRef<HTMLHeadingElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const btnWrapRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const wrap = textWrapRef.current;
    const btn = btnWrapRef.current;
    if (!wrap) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const stop = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };

    const reset = () => {
      stop();
      WORDS.forEach((_, i) => {
        const el = wordRefs.current[i];
        if (el) applyMorphState(el, 0);
      });
      wrap.style.filter = "url(#intro-morph-goo) blur(0.35px)";
      if (btn) {
        btn.style.opacity = "0";
        btn.style.transform = "translateY(10px)";
      }
    };

    const triggerReveal = () => {
      stop();
      if (prefersReducedMotion.matches) {
        WORDS.forEach((_, i) => {
          const el = wordRefs.current[i];
          if (el) applyMorphState(el, 1);
        });
        wrap.style.filter = "none";
        if (btn) {
          btn.style.opacity = "1";
          btn.style.transform = "none";
        }
        return;
      }

      wrap.style.filter = "url(#intro-morph-goo) blur(0.35px)";
      const wordDuration = 700;
      const wordStagger = 40;
      const totalDuration = (WORDS.length - 1) * wordStagger + wordDuration;
      let startTime = 0;

      const tick = (now: number) => {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;

        WORDS.forEach((_, i) => {
          const el = wordRefs.current[i];
          if (!el) return;
          const wordElapsed = elapsed - i * wordStagger;
          const p = Math.min(Math.max(wordElapsed / wordDuration, 0), 1);
          applyMorphState(el, easeInOutCubic(p));
        });

        if (btn) {
          const btnStart = (WORDS.length - 4) * wordStagger;
          const btnProgress = Math.min(Math.max((elapsed - btnStart) / 500, 0), 1);
          const btnEase = easeInOutCubic(btnProgress);
          btn.style.opacity = String(btnEase);
          btn.style.transform = `translateY(${(1 - btnEase) * 10}px)`;
        }

        if (elapsed < totalDuration + 100) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          wrap.style.filter = "none";
          if (btn) {
            btn.style.opacity = "1";
            btn.style.transform = "none";
          }
          rafRef.current = 0;
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    reset();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          triggerReveal();
        } else {
          reset();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(wrap);

    return () => {
      stop();
      observer.disconnect();
    };
  }, []);

  return (
    <div className="container mx-auto md:my-10 relative z-0">
      <h1
        ref={textWrapRef}
        className="text-2xl px-6 md:px-0 md:text-[3.6vw] md:leading-[4.4vw] tracking-normal">
        {WORDS.map((word, index) => (
          <span
            key={index}
            ref={(el) => {
              wordRefs.current[index] = el;
            }}
            className="inline-block mr-[0.28em] will-change-[opacity,filter]">
            {word}
          </span>
        ))}
        <span
          ref={btnWrapRef}
          className="inline-block align-middle will-change-[opacity,transform]">
          <InteractiveHoverButton className="md:text-2xl text-base bg-gray-600/20 backdrop-blur-xl border border-purple-400/20 text-[#bc7dff] mt-2 md:mt-0">
            Latest Projects
          </InteractiveHoverButton>
        </span>
      </h1>

      {/* SVG Goo Filter for Introduction Text Morph Reveal */}
      <svg
        className="pointer-events-none absolute h-0 w-0"
        aria-hidden="true"
        focusable="false">
        <defs>
          <filter id="intro-morph-goo">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 60 -20"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default Introduction;
