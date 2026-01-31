"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRightIcon, Loader2 } from "lucide-react";
import { AnimatedShinyText } from "./ui/animated-shiny-text";
import { cn } from "@/lib/utils";
import { Highlighter } from "./ui/highlighter";
import { createClient } from "@/utils/supabase/client";

/**
 * Hero Component - Main landing section with 3D background and portrait image.
 * Data is fetched from Supabase 'hero_section' table.
 */

interface HeroData {
  name: string;
  specialization: string;
  designation_titles: string[];
  hero_image_url: string;
}

interface HeroProps {
  onLoad?: () => void;
}

// Reusable Status Badge Component
const StatusBadge = () => (
  <div
    className={cn(
      "group rounded-full border border-black/5 bg-neutral-100 text-base 2xl:text-xl text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800 mt-5"
    )}>
    <AnimatedShinyText className="inline-flex items-center justify-center mx-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
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
const SpecializationText = ({ text }: { text: string }) => (
  <p className="max-w-65 leading-relaxed text-muted-foreground sm:max-w-52.5 sm:text-lg text-lg 2xl:text-2xl 2xl:max-w-87.5 font-primary">
    {text}
  </p>
);

// Name Component
const NameTitle = ({ name }: { name: string }) => (
  <h1 className="text-7xl sm:text-9xl 2xl:text-[12rem] italic sm:not-italic font-bold sm:font-extrabold font-heading sm:tracking-wider sm:flex sm:flex-col leading-none  md:px-4 py-2 rounded-lg">
    I&apos;M{" "}
    <span className="bg-linear-to-r from-[#8001ff] to-[#9832ff] bg-clip-text text-transparent stroke-orange-100 pr-5">
      {name.toUpperCase()}
    </span>
  </h1>
);

// Designation Component
const DesignationTitle = ({ titles }: { titles: string[] }) => (
  <div className="flex flex-col text-5xl sm:text-6xl 2xl:text-8xl font-bold font-heading uppercase tracking-wider md:px-4 py-2 rounded-lg">
    {titles.map((title, index) => {
      if (index === 0) {
        return (
          <h2 key={index}>
            <Highlighter action="underline" color="#FF9800">
              {title}
            </Highlighter>
          </h2>
        );
      }
      if (index === titles.length - 1 && titles.length > 1) {
        return (
          <h2 key={index}>
            <Highlighter action="highlight" color="#9730FF">
              {title}
            </Highlighter>
          </h2>
        );
      }
      return <h2 key={index}>{title}</h2>;
    })}
  </div>
);

const Hero = ({ onLoad }: HeroProps) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("hero_section")
          .select("name, specialization, designation_titles, hero_image_url")
          .eq("is_active", true)
          .single();

        if (error) throw error;
        setHeroData(data);
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  useEffect(() => {
    if (iframeLoaded && imageLoaded && !loading) {
      onLoad?.();
    }
  }, [iframeLoaded, imageLoaded, loading, onLoad]);

  const SPLINE_URL = "https://my.spline.design/orb-hxyvwWjdVKI7t0zgYYXGwTFs/";

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!heroData) return null;

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
            <NameTitle name={heroData.name} />

            {/* Mobile Designation */}
            <div className="mt-5">
              <DesignationTitle titles={heroData.designation_titles} />
            </div>

            {/* Mobile Specialization */}
            <SpecializationText text={heroData.specialization} />
          </div>
        </div>

        {/* Hero Image - Full Screen Portrait */}
        <div className="absolute inset-0 z-0">
          <Image
            fill
            src={(heroData.hero_image_url && (heroData.hero_image_url.startsWith('http') || heroData.hero_image_url.startsWith('/'))) ? heroData.hero_image_url : "/placeholder.svg"}
            alt={`${heroData.name} - Portfolio Portrait`}
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
              <SpecializationText text={heroData.specialization} />
            </div>

            {/* Name Title (Bottom Left) */}
            <div className="absolute bottom-12 left-6 md:left-12">
              <NameTitle name={heroData.name} />
            </div>

            {/* Designation Title (Bottom Right) */}
            <div className="absolute bottom-12 right-6 md:right-12">
              <DesignationTitle titles={heroData.designation_titles} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

