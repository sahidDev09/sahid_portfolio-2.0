"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import { AnimatedShinyText } from "./ui/animated-shiny-text";
import { cn } from "@/lib/utils";
import { Highlighter } from "./ui/highlighter";

/**
 * Hero Component - Main landing section with 3D background and portrait image.
 */

interface HeroProps {
  onLoad?: () => void;
}

// Reusable Status Badge Component
const StatusBadge = () => (
  <div
    className={cn(
      "group rounded-full border border-black/5 bg-neutral-100 text-base 2xl:text-xl text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
    )}>
    <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
      <span className="relative mr-2 flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      <span>Available for new opportunities</span>
      <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
    </AnimatedShinyText>
  </div>
);

// Reusable Specialization Text Component
const SpecializationText = () => (
  <p className="max-w-65 leading-relaxed text-muted-foreground sm:max-w-52.5 sm:text-lg text-lg 2xl:text-2xl 2xl:max-w-87.5 font-primary">
    Specialized in Web Design, UI/UX and MERN stack development.
  </p>
);

// Name Component
const NameTitle = () => (
  <h1 className="text-7xl sm:text-9xl 2xl:text-[12rem] italic sm:not-italic font-bold sm:font-extrabold font-heading sm:tracking-wider sm:flex sm:flex-col leading-none  px-4 py-2 rounded-lg">
    I&apos;M{" "}
    <span className="bg-linear-to-r from-[#8001ff] to-[#9832ff] bg-clip-text text-transparent stroke-orange-100 pr-5">
      SAHID
    </span>
  </h1>
);

// Designation Component
const DesignationTitle = () => (
  <div className="flex flex-col text-5xl sm:text-6xl 2xl:text-8xl font-bold font-heading uppercase tracking-wider px-4 py-2 rounded-lg">
    <h2>
      <Highlighter action="underline" color="#FF9800">
        Creative
      </Highlighter>
    </h2>
    <h2>Developer</h2>
    <h2>
      <Highlighter action="highlight" color="#9730FF">
        UI Designer
      </Highlighter>
    </h2>
  </div>
);

const Hero = ({ onLoad }: HeroProps) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (iframeLoaded && imageLoaded) {
      onLoad?.();
    }
  }, [iframeLoaded, imageLoaded, onLoad]);

  const SPLINE_URL = "https://my.spline.design/orb-hxyvwWjdVKI7t0zgYYXGwTFs/";

  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden text-white">

      {/* Background: Spline 3D Scene */}
      <iframe
        src={SPLINE_URL}
        className="absolute inset-0 z-0 h-full w-full"
        style={{
          pointerEvents: "none",
          transform: "scale(1.2)",
          border: "none",
        }}
        onLoad={() => {
          setTimeout(() => setIframeLoaded(true), 1500);
        }}
      />

      {/* Main Content Overlay */}
      <div className="relative z-20 flex h-full w-full flex-col items-center">
        {/* Desktop Background Text */}
        <div className="mt-36 hidden sm:block select-none pointer-events-none">
          <h1 className="absolute left-65 z-0 text-[8rem] 2xl:text-[12rem] font-thin italic text-white/70 font-primary">
            Hey,
          </h1>
          <h1 className="absolute right-55 z-0 text-[8rem] 2xl:text-[12rem] font-thin italic text-white/70 font-primary">
            There
          </h1>
        </div>

        {/* Mobile Layout */}
        <div className="relative z-20 flex w-full flex-col min-h-screen sm:hidden">
          {/* Mobile Overlay Background (Full Width) */}
          <div className="absolute inset-0 z-0 bg-black/70 pointer-events-none" />

          {/* Mobile Content (Padded) */}
          <div className="relative z-10 flex flex-col gap-5 justify-center items-start flex-1 px-6 py-12 select-none pointer-events-none">
            {/* Mobile Status Badge */}
            <StatusBadge />

            {/* Mobile Greeting */}
            <h1 className="text-4xl font-thin italic text-white/70 font-primary">
              Hey, There
            </h1>

            {/* Mobile Name */}
            <NameTitle />

            {/* Mobile Designation */}
            <div className="mt-5">
              <DesignationTitle />
            </div>

            {/* Mobile Specialization */}
            <SpecializationText />
          </div>
        </div>

        {/* Hero Image - Full Screen Portrait */}
        <div className="absolute inset-0 z-0">
          <Image
            fill
            src="/person_portfolio.png"
            alt="Sahid - Portfolio Portrait"
            className="object-cover object-bottom pointer-events-none select-none"
            onLoad={() => setImageLoaded(true)}
            priority
          />
        </div>


        {/* Smooth Fade Gradient - Bottom Edge */}
        <div className="absolute bottom-0 left-0 right-0 h-40 z-10 bg-linear-to-b from-transparent to-black pointer-events-none" />

        {/* Floating UI Elements - Matching Desktop Experience */}
        <div className="absolute inset-0 z-20 hidden sm:block">
          <div className="relative h-full w-full px-6 py-12 md:px-12">
            {/* Status Badge (Top Left) */}
            <div className="absolute left-6 top-[70%] lg:top-[50%] md:left-12 -translate-y-1/2">
              <StatusBadge />
            </div>

            {/* Specialization Text (Top Right) */}
            <div className="absolute right-6 top-[70%] lg:top-[50%] md:right-12 -translate-y-1/2 text-right">
              <SpecializationText />
            </div>

            {/* Name Title (Bottom Left) */}
            <div className="absolute bottom-12 left-6 md:left-12">
              <NameTitle />
            </div>

            {/* Designation Title (Bottom Right) */}
            <div className="absolute bottom-12 right-6 md:right-12">
              <DesignationTitle />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
