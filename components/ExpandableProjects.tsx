"use client";

import { getImageKitUrl } from "./smoothui/data";
import { useState } from "react";
import ExpandableCards, { type Card } from "./smoothui/expandable-cards";
import { Highlighter } from "./ui/highlighter";

const ExpandableProjects = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const projectsDetails: Card[] = [
    {
      id: 1,
      title: "Medinova",
      image: getImageKitUrl("medinova", { width: 800 }),
      content:
        "A comprehensive platform for a medical diagnostic center featuring online appointment scheduling, test result access, and department information.",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "Postgres"],
      liveUrl: "#",
      codeUrl: "#",
    },
    {
      id: 2,
      title: "CareerLinker",
      image: getImageKitUrl("career-linker", { width: 800 }),
      content:
        "A modern job portal connecting job seekers with employers, featuring advanced search filters, resume building tools, and application tracking.",
      techStack: ["React", "Node.js", "Express", "MongoDB", "Redux"],
      liveUrl: "#",
      codeUrl: "#",
    },
    {
      id: 3,
      title: "RongTona",
      image: getImageKitUrl("rong-tona", { width: 800 }),
      content:
        "An innovative AI-powered tool for generating and editing images, utilizing deep learning models to create unique visual content.",
      techStack: ["Python", "FastAPI", "React", "TensorFlow", "Tailwind CSS"],
      liveUrl: "#",
      codeUrl: "#",
    },
    {
      id: 4,
      title: "Larnica",
      image: getImageKitUrl("larnica", { width: 800 }),
      content:
        "An engaging online educational platform offering diverse courses, interactive learning materials, and progress tracking for students.",
      techStack: ["React.js", "Framer Motion", "Redux", "Tailwind CSS", "Shadcn UI", "TypeScript"],
      liveUrl: "#",
      codeUrl: "#",
    },
  ];
 
  return (
    <div>

      <div className="text-center pt-5">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading tracking-wide text-white mb-6">
                  <Highlighter action="underline">Latest Projects</Highlighter>
                </h2>
                <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Check out some of my recent work
            </p>
              </div>

      <div className="flex min-h-[600px] w-full items-center justify-center py-10">

      <ExpandableCards
        cards={projectsDetails}
        onSelect={setSelected}
        selectedCard={selected}
      />
    </div>
    </div>
  );
};

export default ExpandableProjects;
