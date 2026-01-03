"use client";

import { useState } from "react";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Preloader from "@/components/preloader";
import About from "@/components/introduction";
import IconMarque from "@/components/IconMarque";
import BentoGrid from "@/components/about/BentoGrid";
import AboutMe from "@/components/AboutMe";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);

  return (
    <div>
      {/* Hero section loading behind preloader */}
      <div
        className={
          isLoading
            ? "invisible fixed inset-0 pointer-events-none z-0"
            : "relative z-0"
        }>
        <Hero onLoad={() => setIsHeroLoaded(true)} />
      </div>

      <Preloader
        onComplete={() => setIsLoading(false)}
        isHeroLoaded={isHeroLoaded}
      />

      {!isLoading && (
        <>
          <Navbar />

          {/* Icon Marque */}
          <IconMarque />

          {/* About Section */}
          <AboutMe />
        </>
      )}
    </div>
  );
}
