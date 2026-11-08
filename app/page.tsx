"use client";

import { useState } from "react";
import { HeroJourney } from "@/components/hero-journey/HeroJourney";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Preloader from "@/components/preloader";
import IconMarque from "@/components/IconMarque";
import AboutMe from "@/components/AboutMe";
import { Footer } from "@/components/Footer/Footer";
import WorkProcess from "@/components/Process/WorkProcess";
import ExpandableProjects from "@/components/ExpandableProjects";
import Experience from "@/components/Experience";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);

  return (
    <div>
      {/* Background warm-up during loading state so preloader completes reliably */}
      <div
        className={
          isLoading
            ? "invisible fixed inset-0 pointer-events-none z-0"
            : "hidden"
        }>
        <Hero onLoad={() => setIsHeroLoaded(true)} />
      </div>

      <Preloader
        onComplete={() => setIsLoading(false)}
        isHeroLoaded={isHeroLoaded}
      />

      {!isLoading && (
        <main>
          {/* 1. Logo Zoom Reveal Hero Section */}
          <HeroJourney
            portalContent={
              <div className="relative w-full h-full min-h-screen bg-black overflow-hidden pointer-events-none">
                <Navbar />
                <Hero isInPortal={true} />
              </div>
            }
            lede="Think like a designer. Build like an engineer. Lead like a founder."
            primaryActionText="Explore work"
            primaryActionHref="#projects"
            secondaryActionText="About me"
            secondaryActionHref="#about"
            metaItems={[
              "Design Engineer",
              "Full-Stack",
              "Open Source",
              "Creative Tech",
              "Next.js · React · GSAP · WebGL",
            ]}
          />

          {/* 2. Continuation Landing Hero that smoothly takes over interactive state */}
          <div className="landing-hero-continuation relative z-10">
            <Navbar className="landing-hero-nav" />
            <Hero onLoad={() => setIsHeroLoaded(true)} />
          </div>

          {/* 3. Icon Marquee */}
          <IconMarque />

          {/* 4. About Section */}
          <section id="about" className="scroll-mt-28">
            <AboutMe />
          </section>

          {/* 5. Experience Section */}
          <Experience />

          {/* 6. Work Process */}
          <WorkProcess />

          {/* 7. Projects */}
          <section id="projects" className="scroll-mt-28">
            <ExpandableProjects />
          </section>

          {/* 8. Footer */}
          <Footer />
        </main>
      )}
    </div>
  );
}
