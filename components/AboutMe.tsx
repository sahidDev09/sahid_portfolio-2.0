"use client";

import { useEffect, useRef, useState } from 'react'
import Introduction from './introduction'
import BentoGrid from './about/BentoGrid'
import { Highlighter } from './ui/highlighter'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'

const easeInOutCubic = (e: number) => (e < 0.5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2);

function applyMorphState(el: HTMLElement, val: number) {
  const at = Math.min(Math.max(val, 0), 1);
  if (Math.abs(at - Number(el.dataset.at ?? -1)) < 0.002) return;
  el.dataset.at = String(at);

  if (at < 0.008) {
    el.style.visibility = "hidden";
    el.style.opacity = "0";
    el.style.filter = "none";
    return;
  }

  el.style.visibility = "";
  const n = Math.max(at, 1e-4);
  el.style.opacity = String(Math.pow(n, 0.28));
  if (n >= 1) {
    el.style.filter = "none";
  } else {
    el.style.filter = `blur(${Math.min(8 / n - 8, 16).toFixed(2)}px)`;
  }
}

const AboutMe = () => {
  const [bio, setBio] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const titleWrapRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const el = textRef.current;
    const wrap = titleWrapRef.current;
    if (!el || !wrap) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const stop = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };

    const reset = () => {
      stop();
      applyMorphState(el, 0);
      wrap.style.filter = "url(#about-morph-goo) blur(0.35px)";
    };

    const triggerReveal = () => {
      stop();
      if (prefersReducedMotion.matches) {
        applyMorphState(el, 1);
        wrap.style.filter = "none";
        return;
      }

      wrap.style.filter = "url(#about-morph-goo) blur(0.35px)";
      const duration = 750;
      let startTime = 0;

      const tick = (now: number) => {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        const p = Math.min(Math.max(elapsed / duration, 0), 1);
        applyMorphState(el, easeInOutCubic(p));

        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          wrap.style.filter = "none";
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
      { threshold: 0.25 }
    );

    observer.observe(wrap);

    return () => {
      stop();
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchBio = async () => {
      const supabase = createClient()
      try {
        const { data, error } = await supabase
          .from("about_profile")
          .select("bio")
          .single()

        if (error) throw error
        if (data?.bio) setBio(data.bio)
      } catch (error) {
        console.error("Error fetching bio:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBio()
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" }
  } as const;

  return (
    <div className="overflow-hidden">
      <motion.div {...fadeInUp}>
        <Introduction />
      </motion.div>

      <motion.div 
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.2 }}
        className='w-full mx-auto justify-center flex flex-col items-center gap-4 my-10 px-6 md:px-0'
      >
           <div
             ref={titleWrapRef}
             className='font-heading tracking-wide text-3xl md:text-4xl lg:text-5xl text-[#f1f5f9]'>
             <span
               ref={textRef}
               className="inline-block will-change-[opacity,filter]">
               <Highlighter action='underline' isView={true}>
                 About Me
               </Highlighter>
             </span>
           </div>
          {loading ? (
            <div className="h-6 w-64 bg-white/5 animate-pulse rounded" />
          ) : (
            <p className="text-[#94a3b8] md:text-lg text-base text-center max-w-2xl px-4">
              {bio || "Passionate developer crafting digital experiences with modern technologies"}
            </p>
          )}
      </motion.div>

      <motion.div 
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.3 }}
      >
        <BentoGrid />
      </motion.div>

      {/* SVG Goo Filter for About Me Morph Reveal */}
      <svg
        className="pointer-events-none absolute h-0 w-0"
        aria-hidden="true"
        focusable="false">
        <defs>
          <filter id="about-morph-goo">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 60 -20"
            />
          </filter>
        </defs>
      </svg>
    </div>
  )
}


export default AboutMe