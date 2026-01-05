"use client";

import { getImageKitUrl } from "./smoothui/data";
import { useState } from "react";
import ExpandableCards, { type Card } from "./smoothui/expandable-cards";

const ExpandableProjects = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const projectsDetails: Card[] = [
    {
      id: 1,
      title: "Event Horizon",
      image: getImageKitUrl("event-horizon", { width: 800 }),
      content:
        "A dynamic event booking platform offering immersive virtual tours and seamless ticket management for global festivals. Built with Next.js and Three.js.",
      author: {
        name: "Sahid",
        role: "Product Designer",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sahid1",
      },
    },
    {
      id: 2,
      title: "Vogue Trends",
      image: getImageKitUrl("vogue-trends", { width: 800 }),
      content:
        "An avant-garde fashion marketplace connecting independent designers with global consumers through AR try-on experiences.",
      author: {
        name: "Sahid",
        role: "Frontend Developer",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sahid2",
      },
    },
    {
      id: 3,
      title: "Canvas AI",
      image: getImageKitUrl("canvas-ai", { width: 800 }),
      content:
        "A digital art gallery powered by AI curation, allowing collectors to discover and purchase NFT-backed digital masterpieces.",
      author: {
        name: "Sahid",
        role: "Tech Lead",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sahid3",
      },
    },
    {
      id: 4,
      title: "Lucidity",
      image: getImageKitUrl("lucidity", { width: 800 }),
      content:
        "A dream journaling and analysis application using natural language processing to uncover patterns in your subconscious.",
      author: {
        name: "Sahid",
        role: "Mobile Developer",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sahid4",
      },
    },
   
  ];

  return (
    <div className="flex min-h-[600px] w-full items-center justify-center py-10">
      <ExpandableCards
        cards={projectsDetails}
        onSelect={setSelected}
        selectedCard={selected}
      />
    </div>
  );
};

export default ExpandableProjects;
