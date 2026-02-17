/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getImageKitUrl } from "./smoothui/data";
import { useEffect, useState } from "react";
import ExpandableCards, { type Card } from "./smoothui/expandable-cards";
import { Highlighter } from "./ui/highlighter";
import { createClient } from "@/utils/supabase/client";

const ExpandableProjects = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [projects, setProjects] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true })
        .limit(5);

      if (error) {
        console.error("Error fetching projects:", error);
      } else if (data) {
        const mappedProjects: Card[] = data.map((project: any) => ({
          id: project.id,
          title: project.title,
          image: project.image_url || getImageKitUrl(project.slug, { width: 800 }),
          content: project.content,
          techStack: project.tech_stack,
          liveUrl: project.live_url,
          codeUrl: project.code_url,
        }));
        setProjects(mappedProjects);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

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
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          </div>
        ) : (
          <ExpandableCards
            cards={projects}
            onSelect={setSelected}
            selectedCard={selected}
          />
        )}
      </div>
    </div>
  );
};

export default ExpandableProjects;
