"use client";

import { useState } from "react";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Preloader from "@/components/preloader";
import About from "@/components/introduction";
import IconMarque from "@/components/IconMarque";
import BentoGrid from "@/components/about/BentoGrid";
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
          <section id="about" className="scroll-mt-28">
            <AboutMe />
          </section>

          {/* Experience Section */}
          <Experience />

        {/* work process */}
        <WorkProcess/>

        {/* projects */}
        
        <section id="projects" className="scroll-mt-28">
          <ExpandableProjects/>
        </section>

        <Footer/>

        </>
      )}
    </div>
  );
}
