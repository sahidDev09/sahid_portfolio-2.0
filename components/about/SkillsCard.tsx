import { motion } from "framer-motion";
import { Wrench } from "lucide-react";

const skills = [
  { name: "HTML", category: "frontend" },
  { name: "CSS", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "Bootstrap", category: "frontend" },
  { name: "JavaScript", category: "language" },
  { name: "React.js", category: "frontend" },
  { name: "Node.js", category: "backend" },
  { name: "Express.js", category: "backend" },
  { name: "MongoDB", category: "database" },
  { name: "Java", category: "language" },
  { name: "Firebase", category: "backend" },
  { name: "GitHub", category: "tools" },
  { name: "Figma", category: "design" },
  { name: "Adobe XD", category: "design" },
];

const categoryColors: Record<string, string> = {
  frontend: "hover:bg-[#8b5cf6] hover:text-[#0a0a14] hover:border-[#8b5cf6]",
  backend: "hover:bg-[#22d3ee] hover:text-[#0a0a14] hover:border-[#22d3ee]",
  language: "hover:bg-[#d946ef] hover:text-[#0a0a14] hover:border-[#d946ef]",
  database: "hover:bg-[#f97316] hover:text-[#0a0a14] hover:border-[#f97316]",
  tools: "hover:bg-[#3b82f6] hover:text-[#0a0a14] hover:border-[#3b82f6]",
  design: "hover:bg-[#10b981] hover:text-[#0a0a14] hover:border-[#10b981]",
};

const SkillsCard = () => {
  return (
    <div className="h-full bg-gray-600/20 backdrop-blur-xl border border-[#2a2a4a]/50 rounded-2xl shadow-lg p-6 transition-all duration-500 hover:shadow-2xl hover:border-[#8b5cf6]/30 hover:-translate-y-1">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-[#8b5cf6]/10">
          <Wrench className="w-5 h-5 text-[#8b5cf6]" />
        </div>
        <h3 className="text-lg font-semibold text-[#f1f5f9]">
          Modern Skills
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <motion.span
            key={skill.name}
            className={`px-3 py-1.5 text-sm font-medium rounded-xl bg-[#2a2a4a] text-[#94a3b8] border border-[#3a3a5a]/50 transition-all duration-300 cursor-default ${categoryColors[skill.category]}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: index * 0.05,
              duration: 0.3,
              ease: "easeOut",
            }}
            whileHover={{ scale: 1.08, y: -2 }}
          >
            {skill.name}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default SkillsCard;