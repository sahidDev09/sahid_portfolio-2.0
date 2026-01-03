import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useRef } from "react";
import { 
  FileCode, Palette, Coffee, Braces, Atom, Hexagon, 
  Triangle, Wind, FileType, Zap, Leaf, Database, 
  GitBranch, Github, Figma, Server, Code2, MousePointer2
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface IconItem {
  icon: LucideIcon;
  label: string;
}

const icons: IconItem[] = [
  { icon: FileCode, label: "HTML" },
  { icon: Palette, label: "CSS" },
  { icon: Coffee, label: "Java" },
  { icon: Braces, label: "JavaScript" },
  { icon: Atom, label: "React" },
  { icon: Hexagon, label: "Node.js" },
  { icon: Triangle, label: "Next.js" },
  { icon: Wind, label: "Tailwind CSS" },
  { icon: FileType, label: "TypeScript" },
  { icon: Zap, label: "Express.js" },
  { icon: Leaf, label: "MongoDB" },
  { icon: Database, label: "Supabase" },
  { icon: GitBranch, label: "Git" },
  { icon: Github, label: "GitHub" },
  { icon: Figma, label: "Figma" },
  { icon: Server, label: "MySQL" },
  { icon: Code2, label: "VS Code" },
  { icon: MousePointer2, label: "Cursor" },
];

const FloatingIconItem = ({ icon: Icon, label, index }: { icon: LucideIcon; label: string; index: number }) => {
  const floatDuration = 2.5 + (index % 5) * 0.4;
  const floatDelay = (index % 7) * 0.15;
  const floatAmount = 16 + (index % 4) * 4;

  return (
    <motion.div
      className="relative group cursor-pointer flex-shrink-0 mx-4 md:mx-5"
      animate={{ 
        y: [0, -floatAmount, 0],
      }}
      transition={{
        y: {
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatDelay,
        },
      }}
    >
      <motion.div
        className="icon-circle gradient-glow-hover w-18 h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center bg-gray-600/20 backdrop-blur-xl border border-purple-400/20 rounded-full"

        whileHover={{ scale: 1.15 }}
        transition={{ duration: 0.2 }}
      >
        <Icon 
          className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white transition-colors duration-300" 
          strokeWidth={1.5}
        />
      </motion.div>
      
      {/* Tooltip */}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs md:text-sm font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        {label}
      </span>
    </motion.div>
  );
};

const IconWave = () => {
  const [scrollDirection, setScrollDirection] = useState<"forward" | "reverse">("forward");
  const lastScrollY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll();
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    const direction = latest > lastScrollY.current ? "forward" : "reverse";
    if (direction !== scrollDirection) {
      setScrollDirection(direction);
    }
    lastScrollY.current = latest;
  });

  // Duplicate icons for seamless loop
  const duplicatedIcons = [...icons, ...icons];

  return (
    <div ref={containerRef} className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden py-10">
      {/* Gradient masks for smooth fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      {/* Marquee container */}
      <motion.div
        className="flex items-center"
        animate={{
          x: scrollDirection === "forward" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          x: {
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {duplicatedIcons.map((item, index) => (
          <FloatingIconItem
            key={`${item.label}-${index}`}
            icon={item.icon}
            label={item.label}
            index={index}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default IconWave;
