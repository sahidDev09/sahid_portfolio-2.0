"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import {
  MoveRight,
  MapPin,
  Github,
  Linkedin,
  Instagram,
  Twitter,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "@/lib/lenis";
import GlassIcons, { type GlassIconsItem } from "./ui/GlassIcons";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const lenis = useLenis();
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);

  const dockItems: GlassIconsItem[] = [
    {
      icon: <Github className="w-6 h-6" />,
      color: "graphite",
      label: "GitHub",
      href: "https://github.com/sahidDev09",
      target: "_blank",
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      color: "blue",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/sahidofficial09",
      target: "_blank",
    },
    {
      icon: <Instagram className="w-6 h-6" />,
      color: "pink",
      label: "Instagram",
      href: "https://www.instagram.com/0sahid_99",
      target: "_blank",
    },
    {
      icon: <Twitter className="w-6 h-6" />,
      color: "teal",
      label: "Twitter / X",
      href: "https://twitter.com",
      target: "_blank",
    },
    
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
      lenis?.start();
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
      lenis?.start();
    };
  }, [isModalOpen, lenis]);

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
          <h1 className="font-thomas text-4xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4.25rem] 2xl:text-[5.25rem] font-bold tracking-tight uppercase leading-[1.08] text-white">
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
              onClick={() => setIsModalOpen(true)}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#8001ff]/60 bg-[#161024]/60 backdrop-blur-md px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-white hover:bg-[#8001ff]/20 hover:border-[#8001ff] active:scale-[0.98] transition-all cursor-pointer">
              <span>Let&apos;s Talk</span>
            </button>
          </div>

        </div>
      </div>

      {/* MacBook Dock Connection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            data-lenis-prevent
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Dialog Card (MacBook Window + Dock) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 35 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 360, damping: 26 }}
              className="relative w-full max-w-lg sm:max-w-xl overflow-hidden rounded-[32px] bg-[#141022]/90 border border-white/10 p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.7),0_0_60px_rgba(128,1,255,0.22)] z-10 my-auto text-center backdrop-blur-2xl"
            >
              {/* Subtle top ambient glow */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-28 bg-[#8001ff]/25 rounded-full blur-3xl pointer-events-none" />

              {/* macOS Window Controls (Traffic Lights) */}
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="group relative w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                    aria-label="Close"
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-[9px] font-bold text-black/80 leading-none">
                      ×
                    </span>
                  </button>
                  <span className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29]" />
                </div>
                <span className="text-[11px] font-mono tracking-widest text-white/40 uppercase">
                  macOS • Connect Dock
                </span>
              </div>

              {/* User Identity: Name & Address */}
              <div className="flex flex-col items-center mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Sahid Ahmed
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#a855f7] mt-1">
                  MERN Stack Developer & UI/UX Designer
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-neutral-300">
                  <MapPin className="w-3.5 h-3.5 text-[#8001ff]" />
                  <span>Dhaka, Bangladesh</span>
                </div>
              </div>

              {/* MacBook Dock with GlassIcons */}
              <div className="relative pt-1">
                {/* Floating Glass Dock Shelf */}
                <div className="relative mx-auto rounded-3xl bg-white/[0.06] border border-white/15 backdrop-blur-2xl pt-5 pb-9 px-5 sm:px-8 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] flex justify-center items-center">
                  <GlassIcons
                    items={dockItems}
                    size={52}
                    gap={26}
                    columns={5}
                    roundness={0.45}
                    plate="tilt"
                    tilt={18}
                    hover="lift"
                    labels="hover"
                    theme="dark"
                    shine={0.9}
                    frost={0.25}
                    refraction={0.8}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
