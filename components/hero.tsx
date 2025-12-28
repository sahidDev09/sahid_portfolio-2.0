"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import { AnimatedShinyText } from "./ui/animated-shiny-text";
import { cn } from "@/lib/utils";
import { Highlighter } from "./ui/highlighter";

interface HeroProps {
  onLoad?: () => void;
}

// Reusable Status Badge Component
const StatusBadge = () => (
  <div
    className={cn(
      "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
    )}
  >
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
  <p className="max-w-[260px] leading-relaxed text-muted-foreground md:max-w-[210px] md:text-lg text-lg font-primary">
    Specialized in Web Design, UI/UX and MERN stack development.
  </p>
);

// Name Component
const NameTitle = () => (
  <h1 className="text-7xl md:text-9xl italic md:not-italic font-bold md:font-extrabold font-heading md:tracking-wider md:flex md:flex-col">
    I&apos;M{" "}
    <span className="bg-linear-to-r from-[#8001ff] to-[#9832ff] bg-clip-text text-transparent stroke-orange-100">
      SAHID
    </span>
  </h1>
);

// Designation Component
const DesignationTitle = () => (
  <div className="flex flex-col text-5xl md:text-6xl font-bold font-heading uppercase tracking-wider">
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
      <div className="relative z-10 flex h-full w-full flex-col items-center">
        {/* Desktop Background Text */}
        <div className="mt-36 hidden md:block select-none pointer-events-none">
          <h1 className="absolute left-65 z-0 text-[8rem] font-thin italic text-white/70 font-primary">
            Hey,
          </h1>
          <h1 className="absolute right-55 z-0 text-[8rem] font-thin italic text-white/70 font-primary">
            There
          </h1>
        </div>

        {/* Mobile Layout */}
        <div className="flex flex-col gap-5 justify-center items-center min-h-screen md:hidden">
          {/* Mobile Overlay */}
          <div className="absolute  z-[-1] h-full w-full bg-black/70 pointer-events-none" />

          {/* Mobile Status Badge */}
          <div className="w-full px-4 select-none pointer-events-none flex justify-start">
            <StatusBadge />
          </div>

          {/* Mobile Greeting */}
          <div className="w-full px-4 select-none pointer-events-none flex justify-start">
            <h1 className="text-4xl font-thin italic text-white/70 font-primary">
              Hey, There
            </h1>
          </div>

          {/* Mobile Name */}
          <div className="w-full px-4 select-none pointer-events-none flex justify-start">
            <NameTitle />
          </div>

          {/* Mobile Designation */}
          <div className="w-full px-4 select-none pointer-events-none flex justify-start mt-5">
            <DesignationTitle />
          </div>

          {/* Mobile Specialization */}
          <div className="w-full px-4 select-none pointer-events-none flex justify-start">
            <SpecializationText />
          </div>
        </div>

        {/* Hero Image */}
        <Image
          fill
          src="/person_portfolio.png"
          alt="Sahid - Portfolio Portrait"
          className="relative z-[-2] md:z-10 object-cover object-bottom md:object-contain"
          onLoad={() => setImageLoaded(true)}
          priority
        />

        {/* Desktop Floating UI Elements */}
        <div className="container relative z-20 mx-auto my-10 h-full w-full hidden md:block">
          {/* Desktop Status Badge (Top Left) */}
          <div className="absolute left-0 top-2/5 z-30 -translate-y-1/2">
            <StatusBadge />
          </div>

          {/* Desktop Specialization Text (Top Right) */}
          <div className="absolute right-0 top-2/5 z-30 -translate-y-1/2 text-right">
            <SpecializationText />
          </div>

          {/* Desktop Name Title (Bottom Left) */}
          <div className="absolute bottom-0 left-0">
            <div className="flex flex-col">
              <NameTitle />
            </div>
          </div>

          {/* Desktop Designation Title (Bottom Right) */}
          <div className="absolute bottom-0 right-0">
            <DesignationTitle />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
