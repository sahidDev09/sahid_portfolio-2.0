"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight, Github, ExternalLink } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const EASING_X1 = 0.4;
const EASING_Y1 = 0.0;
const EASING_X2 = 0.2;
const EASING_Y2 = 1;

export type Card = {
  id: number;
  title: string;
  image: string;
  content: string;
  techStack: string[];
  liveUrl: string;
  codeUrl: string;
};

const smoothEasing = [EASING_X1, EASING_Y1, EASING_X2, EASING_Y2] as const;

export type ExpandableCardsProps = {
  cards: Card[];
  selectedCard?: number | null;
  onSelect?: (id: number | null) => void;
  className?: string;
  cardClassName?: string;
};

export default function ExpandableCards({
  cards,
  selectedCard: controlledSelected,
  onSelect,
  className = "",
  cardClassName = "",
}: ExpandableCardsProps) {
  const [internalSelected, setInternalSelected] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const collapsedWidth = isMobile ? "300px" : "350px";
  const expandedWidth = isMobile ? "90vw" : isTablet ? "700px" : "800px";
  const imageWidth = isMobile ? "100%" : isTablet ? "300px" : "350px";
  const detailsWidth = isMobile ? "100%" : isTablet ? "400px" : "450px";

  const [isOverflowing, setIsOverflowing] = useState(false);

  const selectedCard =
    controlledSelected !== undefined ? controlledSelected : internalSelected;

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current) {
        setIsOverflowing(scrollRef.current.scrollWidth > scrollRef.current.clientWidth);
      }
    };
    
    const timer = setTimeout(checkOverflow, 100);
    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
      clearTimeout(timer);
    };
  }, [cards, windowWidth, selectedCard]);

  const handleCardClick = (id: number) => {
    if (selectedCard === id) {
      if (onSelect) {
        onSelect(null);
      } else {
        setInternalSelected(null);
      }
    } else {
      if (onSelect) {
        onSelect(id);
      } else {
        setInternalSelected(id);
      }
      // Center the clicked card in view
      const cardElement = document.querySelector(`[data-card-id="${id}"]`);
      if (cardElement) {
        cardElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`relative flex w-full flex-col gap-4 overflow-hidden px-4 md:px-6 ${className}`}
    >
      <div className="flex items-center justify-end px-4">
       
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-gray-600/40 backdrop-blur-sm transition-colors hover:bg-white/10 gradient-glow-hover"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={scrollRight}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-gray-600/40 backdrop-blur-sm transition-colors gradient-glow-hover"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
      <div
        className={`scrollbar-hide flex w-full gap-4 md:gap-6 overflow-x-auto py-8 [&::-webkit-scrollbar]:hidden px-6 ${!isOverflowing ? 'justify-center' : 'justify-start'}`}
        ref={scrollRef}
        style={{
          scrollSnapType: "x mandatory",
        }}
      >
        {cards.map((card) => (
          <motion.div
            animate={{
              width: selectedCard === card.id ? expandedWidth : collapsedWidth,
            }}
            className={`relative h-[500px] shrink-0 cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-2xl ${cardClassName}`}
            data-card-id={card.id}
            key={card.id}
            layout
            onClick={() => handleCardClick(card.id)}
            style={{
              scrollSnapAlign: "center",
            }}
            transition={{
              duration: 0.5,
              ease: smoothEasing,
            }}
          >
            <motion.div 
               animate={{ width: selectedCard === card.id && isMobile ? "0px" : imageWidth }}
               className="relative h-full"
            >
              <Image
                src={(card.image && (card.image.startsWith('http') || card.image.startsWith('/'))) ? card.image : "/placeholder.svg"}
                alt={card.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 text-white">
                <h2 className="font-bold text-2xl md:text-3xl w-full bg-zinc-400/10 backdrop-blur-md rounded-md p-2">{card.title}</h2>
                <div className="flex items-center gap-3 group">
                  <button
                    aria-label="View Project"
                    className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/10 transition-all duration-300 group-hover:scale-110 gradient-glow-hover text-white group-hover:text-white"
                    type="button"
                  >
                    <ArrowUpRight className="h-6 w-6" />
                  </button>
                  <span className="font-medium text-base md:text-lg">View Project</span>
                </div>
              </div>
            </motion.div>
            <AnimatePresence mode="popLayout">
              {selectedCard === card.id && (
                <motion.div
                  animate={{ width: detailsWidth, opacity: 1, filter: "blur(0px)" }}
                  className={`${isMobile ? "relative w-full" : "absolute top-0 right-0"} h-full bg-neutral-900/95 backdrop-blur-sm border-l border-white/10`}
                  exit={{ width: 0, opacity: 0, filter: "blur(5px)" }}
                  initial={{ width: 0, opacity: 0, filter: "blur(5px)" }}
                  transition={{
                    duration: 0.5,
                    ease: smoothEasing,
                    opacity: { duration: 0.3, delay: 0.2 },
                  }}
                >
                  <motion.div
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    className="flex h-full flex-col justify-between p-6 md:p-8"
                    exit={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                    initial={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-white">Project Details</h3>
                        <p className="text-neutral-300 text-base leading-relaxed">
                        {card.content}
                        </p>
                    </div>
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold text-white mb-2">Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {card.techStack.map((tech, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 text-sm bg-white/10 text-neutral-300 rounded-full border border-white/5"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                    </div>
                      <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-6">
                        <a
                          href={card.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg gradient-glow text-white font-medium hover:bg-neutral-200 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Demo
                        </a>
                        <a
                          href={card.codeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white font-medium border border-white/10 hover:bg-white/20 transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          Source Code
                        </a>
                      </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
