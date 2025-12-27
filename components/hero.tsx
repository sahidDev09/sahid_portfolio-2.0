"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRightIcon, Circle } from "lucide-react";
import { AnimatedShinyText } from "./ui/animated-shiny-text";
import { cn } from "@/lib/utils";

interface HeroProps {
  onLoad?: () => void;
}

const Hero = ({ onLoad }: HeroProps) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Check if both iframe and image are loaded
    if (iframeLoaded && imageLoaded) {
      onLoad?.();
    }
  }, [iframeLoaded, imageLoaded, onLoad]);

  return (
    <div
      className="relative flex h-screen w-full flex-col items-center justify-center 
                 overflow-hidden text-white gap-3">
      {/* Spline Background */}
      <iframe
        ref={iframeRef}
        src="https://my.spline.design/orb-hxyvwWjdVKI7t0zgYYXGwTFs/"
        frameBorder="0"
        width="100%"
        height="100%"
        className="absolute inset-0 z-0 h-full w-full"
        style={{ pointerEvents: "none", transform: "scale(1.2)" }}
        onLoad={() => {
          // Give Spline scene time to initialize (Spline 3D scenes need extra time)
          setTimeout(() => setIframeLoaded(true), 1500);
        }}
      />

      {/* Content Overlay */}
      <div className="relative z-10 flex h-full w-full flex-col items-center gap-3">
        {/* Greetings - Behind Image */}
        <div className="mt-36">
          <h1 className="absolute left-65 z-0 flex text-[8rem] font-thin italic text-white/70">
            Hey,
          </h1>
          <h1 className="absolute right-55 z-0 flex text-[8rem] font-thin italic text-white/70">
            There
          </h1>
        </div>

        <Image
          fill
          src="/person_portfolio.png"
          alt="personHero"
          className="relative z-10 object-contain"
          onLoad={() => setImageLoaded(true)}
          onLoadingComplete={() => setImageLoaded(true)}
        />

        <div className="container relative z-20 mx-auto my-10 h-full w-full">
          {/* Left side - Availability badge */}
          <div className="absolute left-0 md:left-0 top-2/5 -translate-y-1/2 z-30">
            <div
        className={cn(
          "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        )}
      >
        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span>Available for new opportunities</span>
          <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedShinyText>
      </div>
          </div>

          {/* Right side - Specialization text */}
          <div className="absolute right04 md:right-0 top-2/5 -translate-y-1/2 z-30 text-right">
            <p className="text-lg md:text-lg text-muted-foreground max-w-[260px] md:max-w-[210px] leading-relaxed">
              Specialized in Web Design, UI/UX and MERN stack development.
            </p>
          </div>

          {/* Name */}
          <div className="absolute bottom-0 left-0">
            <h1 className="flex flex-col text-9xl font-extrabold">
              I&apos;M{" "}
              <span
                className="bg-linear-to-r from-[#8001ff] to-[#9832ff] 
            bg-clip-text text-transparent stroke-orange-100">
                SAHID
              </span>
            </h1>
          </div>

          {/* Designation */}
          <div className="absolute bottom-0 right-0">
            <span className="flex flex-col text-5xl font-bold uppercase">
              <h2>Creative</h2>
              <h2>
                Developer{" "}
                <span
                  className="bg-linear-to-r from-[#8001ff] to-[#9832ff] 
                  bg-clip-text text-transparent">
                  &
                </span>
              </h2>
              <h1>UI Designer</h1>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
