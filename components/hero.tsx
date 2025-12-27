"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

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
          {/* Name */}
          <div className="absolute bottom-0 left-0">
            <h1 className="flex flex-col text-9xl font-extrabold">
              I&apos;M{" "}
              <span
                className="bg-gradient-to-r from-[#8001ff] to-[#9832ff] 
                               bg-clip-text text-transparent stroke-orange-100">
                SAHID
              </span>
            </h1>
          </div>

          {/* Designation */}
          <div className="absolute bottom-0 right-0">
            <h1 className="flex flex-col text-5xl font-bold uppercase">
              mern stack <br />
              developer.
              <br />
              UI/UX Designer
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
