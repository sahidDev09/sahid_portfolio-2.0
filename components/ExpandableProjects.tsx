/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { Highlighter } from "./ui/highlighter";
import { createClient } from "@/utils/supabase/client";

export type Project = {
  id: number | string;
  title: string;
  type?: string;
  image: string;
  content: string;
  techStack: string[];
  liveUrl?: string;
  codeUrl?: string;
};

const fallbackProjects: Project[] = [
  {
    id: 1,
    title: "Learnica",
    type: "Online Learning Platform",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1200&auto=format&fit=crop",
    content: "Comprehensive online learning management platform with course catalogs, interactive lessons, progress tracking, and student assessments.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"],
    liveUrl: "https://github.com",
    codeUrl: "https://github.com",
  },
  {
    id: 2,
    title: "CareerLinker",
    type: "Job Portal with Admin Control",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1200&auto=format&fit=crop",
    content: "Advanced job portal featuring candidate resume matching, multi-tier admin management, employer dashboards, and applicant tracking pipelines.",
    techStack: ["React", "TypeScript", "Node.js", "Express", "MongoDB"],
    liveUrl: "https://github.com",
    codeUrl: "https://github.com",
  },
  {
    id: 3,
    title: "Meet-up Restaurant",
    type: "Full Functional Restaurant Management System",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
    content: "Full functional restaurant management system with digital menus, table reservation workflows, kitchen order routing, and billing integration.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Stripe"],
    liveUrl: "https://github.com",
    codeUrl: "https://github.com",
  },
  {
    id: 4,
    title: "The Palace Luxury Resort",
    type: "5 Star Hotel Management",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    content: "5-star luxury hotel and resort management suite facilitating online bookings, guest concierge, real-time room inventories, and staff dispatch.",
    techStack: ["Next.js", "React", "Tailwind CSS", "Supabase", "Zustand"],
    liveUrl: "https://github.com",
    codeUrl: "https://github.com",
  },
];

const resolveProjectMeta = (rawTitle: string, index: number, rawType?: string) => {
  const lower = (rawTitle || "").toLowerCase();

  if (lower.includes("learnica") || index === 0) {
    return {
      title: "Learnica",
      type: "Online Learning Platform",
    };
  }
  if (lower.includes("career") || lower.includes("job") || index === 1) {
    return {
      title: "CareerLinker",
      type: "Job Portal with Admin Control",
    };
  }
  if (lower.includes("meetup") || lower.includes("restaurant") || index === 2) {
    return {
      title: "Meet-up Restaurant",
      type: "Full Functional Restaurant Management System",
    };
  }
  if (lower.includes("palace") || lower.includes("resort") || lower.includes("hotel") || index === 3) {
    return {
      title: "The Palace Luxury Resort",
      type: "5 Star Hotel Management",
    };
  }

  return {
    title: rawTitle,
    type: rawType || "Web Application",
  };
};

const ExpandableProjects = () => {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(0);

  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);
  const lastX = useRef<number>(0);

  // Initialize GSAP mouse follow and physics
  useEffect(() => {
    if (!previewRef.current) return;

    gsap.set(previewRef.current, {
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      opacity: 0,
      rotation: 0,
    });

    xTo.current = gsap.quickTo(previewRef.current, "x", {
      duration: 0.55,
      ease: "power3.out",
    });

    yTo.current = gsap.quickTo(previewRef.current, "y", {
      duration: 0.55,
      ease: "power3.out",
    });

    const previewEl = previewRef.current;
    const sliderEl = sliderRef.current;

    return () => {
      if (previewEl) gsap.killTweensOf(previewEl);
      if (sliderEl) gsap.killTweensOf(sliderEl);
    };
  }, []);

  // Smooth vertical sliding of portrait preview images via GSAP
  useEffect(() => {
    if (sliderRef.current && projects.length > 0) {
      gsap.to(sliderRef.current, {
        yPercent: -(activeProjectIndex * 100) / projects.length,
        duration: 0.45,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  }, [activeProjectIndex, projects.length]);

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("display_order", { ascending: true })
          .limit(6);

        if (error) {
          console.error("Error fetching projects from Supabase:", error);
        } else if (data && data.length > 0) {
          const mappedProjects: Project[] = data.map((project: any, index: number) => {
            const meta = resolveProjectMeta(project.title, index, project.type || project.category);
            return {
              id: project.id ?? index + 1,
              title: meta.title,
              type: meta.type,
              image: project.image_url || fallbackProjects[index % fallbackProjects.length]?.image || fallbackProjects[0].image,
              content: project.content || project.description || "Comprehensive software project crafted with modern technologies and scalable architecture.",
              techStack: project.tech_stack || project.tags || ["Next.js", "TypeScript", "Tailwind CSS"],
              liveUrl: project.live_url,
              codeUrl: project.code_url,
            };
          });
          setProjects(mappedProjects);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (xTo.current && yTo.current) {
      xTo.current(x);
      yTo.current(y);
    }

    // Dynamic tilt based on horizontal velocity
    if (previewRef.current) {
      const diffX = x - lastX.current;
      lastX.current = x;
      const tilt = Math.max(Math.min(diffX * 0.12, 8), -8);
      gsap.to(previewRef.current, {
        rotation: tilt,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    handleMouseMove(e);
    if (previewRef.current) {
      gsap.to(previewRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  };

  const handleMouseLeave = () => {
    if (previewRef.current) {
      gsap.to(previewRef.current, {
        scale: 0.7,
        opacity: 0,
        rotation: 0,
        duration: 0.35,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    }
    setHoveredIndex(null);
  };

  return (
    <section
      ref={sectionRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-visible"
    >
      {/* Background ambient lighting matching application theme */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Floating Mouse Trail Portrait Preview Image (Desktop) */}
      <div
        ref={previewRef}
        className="pointer-events-none absolute top-0 left-0 z-40 hidden md:block w-[240px] h-[340px] lg:w-[270px] lg:h-[380px] rounded-3xl overflow-hidden border border-violet-400/40 shadow-2xl shadow-violet-950/80 bg-zinc-950/95 backdrop-blur-md will-change-transform"
      >
        {/* Animated image slider */}
        <div
          ref={sliderRef}
          style={{ height: `${projects.length * 100}%` }}
          className="relative w-full flex flex-col will-change-transform"
        >
          {projects.map((project, idx) => (
            <div
              key={project.id}
              className="relative w-full h-[340px] lg:h-[380px] shrink-0"
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 240px, 270px"
                priority={idx === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1.5 text-white pointer-events-none">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-600/90 text-white font-medium shadow-sm truncate max-w-[78%]">
                    {project.type || `0${idx + 1} PROJECT`}
                  </span>
                  <span className="text-xs font-mono text-zinc-300 shrink-0">0{idx + 1}</span>
                </div>
                <span className="text-sm font-semibold truncate drop-shadow">
                  {project.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading tracking-wide text-white mb-4">
          <Highlighter action="underline">Featured Projects</Highlighter>
        </h2>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Hover to explore recent architectural work and engineering solutions
        </p>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="flex flex-col gap-5 sm:gap-6 md:gap-7">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 sm:h-22 w-full rounded-2xl md:rounded-3xl bg-zinc-900/40 border border-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-5 sm:gap-6 md:gap-7">
          {projects.map((project, index) => {
            const isHovered = hoveredIndex === index;
            const projectNumber = String(index + 1).padStart(1, "0");
            const targetUrl = project.liveUrl || project.codeUrl || "#";

            return (
              <a
                key={project.id}
                href={targetUrl}
                target={targetUrl !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  setActiveProjectIndex(index);
                }}
                className={`group relative block rounded-2xl md:rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                  isHovered
                    ? "border-violet-500/60 shadow-2xl shadow-violet-950/40 -translate-y-0.5"
                    : "border-violet-500/20 hover:border-violet-400/40 shadow-lg shadow-violet-950/15"
                }`}
                style={{
                  background: isHovered
                    ? "linear-gradient(90deg, rgba(124, 58, 237, 0.45) 0%, rgba(76, 29, 149, 0.25) 45%, rgba(12, 12, 18, 0.95) 100%)"
                    : "linear-gradient(90deg, rgba(109, 40, 217, 0.35) 0%, rgba(59, 23, 120, 0.18) 45%, rgba(9, 9, 14, 0.85) 100%)",
                }}
              >
                {/* Horizontal Bar Content */}
                <div className="w-full py-4 sm:py-5 px-6 sm:px-8 md:px-9 flex items-center justify-between gap-3 sm:gap-6">
                  {/* Left & Middle content container */}
                  <div className="flex items-center gap-4 sm:gap-6 md:gap-8 min-w-0 flex-1">
                    {/* Module / Project Label in English */}
                    <div className="shrink-0 flex items-center gap-2">
                      <span className="font-heading font-medium text-base sm:text-lg md:text-xl text-white tracking-wider uppercase group-hover:text-violet-200 transition-colors">
                        {projectNumber} PROJECT
                      </span>
                    </div>

                    {/* Project Title */}
                    <div className="flex items-center min-w-0 flex-1">
                      <span className="text-sm sm:text-base md:text-lg text-zinc-200 font-normal truncate tracking-normal group-hover:text-white transition-colors">
                        {project.title}
                      </span>
                    </div>

                    {/* Project Type Badge */}
                    {project.type && (
                      <div className="hidden sm:flex items-center shrink-0">
                        <span className="px-3.5 py-1 rounded-full text-xs font-medium tracking-wide bg-violet-950/60 border border-violet-500/30 text-violet-300 group-hover:border-violet-400/50 group-hover:text-violet-200 transition-colors">
                          {project.type}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right side interactive button (arrow link) */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 bg-white/5 border border-white/10 group-hover:bg-gradient-to-br group-hover:from-violet-600 group-hover:to-indigo-600 group-hover:border-violet-500/50 group-hover:scale-105 shadow-md group-hover:shadow-violet-600/30">
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 group-hover:text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ExpandableProjects;
