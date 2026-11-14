"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { MoveRight } from "lucide-react";

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

export interface HeroProps {
  onLoad?: () => void;
  isInPortal?: boolean;
}

const Hero = ({ onLoad, isInPortal = false }: HeroProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    const wrap = wrapperRef.current;
    if (!l1 || !l2 || !wrap) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const stop = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };

    const reset = () => {
      stop();
      applyMorphState(l1, 0);
      applyMorphState(l2, 0);
      wrap.style.filter = "url(#hero-morph-goo) blur(0.35px)";
    };

    const triggerReveal = () => {
      stop();
      if (prefersReducedMotion.matches) {
        applyMorphState(l1, 1);
        applyMorphState(l2, 1);
        wrap.style.filter = "none";
        return;
      }

      wrap.style.filter = "url(#hero-morph-goo) blur(0.35px)";
      const duration = 1400;
      const stagger = 220;
      let startTime = 0;

      const tick = (now: number) => {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;

        const p1 = Math.min(Math.max(elapsed / duration, 0), 1);
        applyMorphState(l1, easeInOutCubic(p1));

        const p2 = Math.min(Math.max((elapsed - stagger) / duration, 0), 1);
        applyMorphState(l2, easeInOutCubic(p2));

        if (p2 < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          wrap.style.filter = "none";
          rafRef.current = 0;
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    const journey = document.querySelector(".journey");

    if (journey) {
      const isDone = journey.hasAttribute("data-done");
      const isReveal = journey.hasAttribute("data-hero-reveal");
      let wasActive = isDone || isReveal;
      let hasTriggered = isDone || isReveal;

      if (isDone) {
        applyMorphState(l1, 1);
        applyMorphState(l2, 1);
        wrap.style.filter = "none";
      } else if (isReveal) {
        triggerReveal();
      } else {
        reset();
      }

      const mutObserver = new MutationObserver(() => {
        const nowDone = journey.hasAttribute("data-done");
        const nowReveal = journey.hasAttribute("data-hero-reveal");
        const nowActive = nowDone || nowReveal;

        if (nowReveal && !hasTriggered) {
          hasTriggered = true;
          triggerReveal();
        } else if (nowDone && !hasTriggered) {
          hasTriggered = true;
          triggerReveal();
        } else if (!nowActive && wasActive) {
          hasTriggered = false;
          reset();
        }
        wasActive = nowActive;
      });

      mutObserver.observe(journey, {
        attributes: true,
        attributeFilter: ["data-done", "data-hero-reveal"],
      });

      return () => {
        stop();
        mutObserver.disconnect();
      };
    } else {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            triggerReveal();
          }
        },
        { threshold: 0.1 }
      );

      if (sectionRef.current) {
        io.observe(sectionRef.current);
      }

      return () => {
        stop();
        io.disconnect();
      };
    }
  }, [isInPortal]);

  const handleDownloadCV = async () => {
    try {
      const supabase = createClient();
      const fileName = "resume.pdf";
      const {
        data: { publicUrl },
      } = supabase.storage.from("resume").getPublicUrl(fileName);

      const response = await fetch(publicUrl);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "resume.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
        return;
      }

      const { data, error } = await supabase.storage
        .from("resume")
        .download(fileName);
      if (error) throw error;
      if (data) {
        const url = window.URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "resume.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.error("Error downloading CV:", error);
      window.open("/resume.pdf", "_blank");
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-black text-white"
      aria-hidden={isInPortal ? true : undefined}
      inert={isInPortal ? true : undefined}>
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <Image
          fill
          src="/hero-version2.webp"
          alt="Sahid Ahmed - Portfolio"
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] sm:object-center select-none pointer-events-none"
          onLoad={() => onLoad?.()}
        />
        {/* Subtle bottom fade transition into subsequent sections */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black via-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-12 lg:px-16 pt-24 sm:pt-20 lg:pt-0">
        <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl">
          {/* Eyebrow / Tagline */}
          <p className="text-xs sm:text-sm md:text-base font-medium tracking-[0.2em] text-neutral-300 uppercase mb-4 sm:mb-6">
            MERN STACK DEVELOPER . UI/UX DESIGNER . AI PROMPT ENGINEER
          </p>

          {/* Main Title */}
          <h1 className="font-thomas text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4.25rem] 2xl:text-[5.25rem] font-bold tracking-tight uppercase leading-[1.08] text-white">
            <span ref={wrapperRef} className="inline-block w-full">
              <span
                ref={line1Ref}
                className="block lg:whitespace-nowrap will-change-[opacity,filter]">
                BUILDING <span className="text-[#8001ff]">INTELLIGENT</span>
              </span>
              <span
                ref={line2Ref}
                className="block lg:whitespace-nowrap will-change-[opacity,filter]">
                DIGITAL PRODUCTS
              </span>
            </span>
          </h1>

          {/* Action Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8001ff] px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg shadow-[#8001ff]/25 hover:bg-[#6c00d9] active:scale-[0.98] transition-all">
              <span>View My Work</span>
              <MoveRight />
            </a>

            <button
              onClick={handleDownloadCV}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#8001ff]/60 bg-[#161024]/60 backdrop-blur-md px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-white hover:bg-[#8001ff]/20 hover:border-[#8001ff] active:scale-[0.98] transition-all cursor-pointer">
              <span>Let&apos;s Talk</span>
            </button>
          </div>

        </div>
      </div>

      {/* SVG Goo Filter for Hero Title Morph Reveal */}
      <svg
        className="pointer-events-none absolute h-0 w-0"
        aria-hidden="true"
        focusable="false">
        <defs>
          <filter id="hero-morph-goo">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 60 -20"
            />
          </filter>
        </defs>
      </svg>
    </section>
  );
};

export default Hero;
