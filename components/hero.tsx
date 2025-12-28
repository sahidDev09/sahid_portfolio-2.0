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
    <section className="relative flex h-screen w-full flex-col items-center justify-center gap-3 overflow-hidden text-white">
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
          // Give Spline scene time to initialize (Spline 3D scenes need extra time)
          setTimeout(() => setIframeLoaded(true), 1500);
        }}
      />

      {/* Main Content Overlay */}
      <div className="relative z-10 flex h-full w-full flex-col items-center gap-3">
        
        {/* Background Text (Hey There) */}
        <div className="mt-36 select-none pointer-events-none">
          <h1 className="absolute left-65 z-0 flex text-[8rem] font-thin italic text-white/70">
            Hey,
          </h1>
          <h1 className="absolute right-55 z-0 flex text-[8rem] font-thin italic text-white/70">
            There
          </h1>
        </div>

        {/* Hero Image */}
        <Image
          fill
          src="/person_portfolio.png"
          alt="Sahid - Portfolio Portrait"
          className="relative z-10 object-contain"
          onLoad={() => setImageLoaded(true)}
          priority
        />

        {/* Floating UI Elements Container */}
        <div className="container relative z-20 mx-auto my-10 h-full w-full">
          
          {/* Status Badge (Top Left) */}
          <div className="absolute left-0 top-2/5 z-30 -translate-y-1/2 md:left-0">
            <div
              className={cn(
                "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              )}
            >
              <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                <span className="relative mr-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <span>Available for new opportunities</span>
                <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </AnimatedShinyText>
            </div>
          </div>

          {/* Specialization Text (Top Right) */}
          <div className="absolute right-4 top-2/5 z-30 -translate-y-1/2 text-right md:right-0">
            <p className="max-w-[260px] leading-relaxed text-muted-foreground md:max-w-[210px] md:text-lg text-lg">
              Specialized in Web Design, UI/UX and MERN stack development.
            </p>
          </div>

          {/* Name Title (Bottom Left) */}
          <div className="absolute bottom-0 left-0">
            <h1 className="flex flex-col text-9xl font-extrabold">
              I&apos;M{" "}
              <span className="bg-linear-to-r from-[#8001ff] to-[#9832ff] bg-clip-text text-transparent stroke-orange-100">
                SAHID
              </span>
            </h1>
          </div>

          {/* Designation Title (Bottom Right) */}
          <div className="absolute bottom-0 right-0">
            <div className="flex flex-col text-5xl font-bold uppercase">
              <h2> <Highlighter action="underline" color="orange">Creative</Highlighter></h2>
              <h2>
                Developer{" "}
                <span className="bg-linear-to-r from-[#8001ff] to-[#9832ff] bg-clip-text text-transparent">
                  &
                </span>
              </h2>
              <Highlighter action="highlight" color="#9730FF">UI Designer</Highlighter>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
