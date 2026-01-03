import { motion } from "framer-motion";
import { Github, GitCommit, FolderGit2, Star } from "lucide-react";
import AppleActivityCard from "../kokonutui/apple-activity-card";

const GitHubActivityCard = () => {
  
  return (
    <div className="h-full bg-gray-600/20 backdrop-blur-xl border border-[#2a2a4a]/50 rounded-2xl shadow-lg p-6 transition-all duration-500 hover:shadow-2xl hover:border-[#8b5cf6]/30 hover:-translate-y-1">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-xl bg-[#f1f5f9]/5">
          <Github className="w-5 h-5 text-[#f1f5f9]" />
        </div>
        <h3 className="text-lg font-semibold text-[#f1f5f9]">
          GitHub Activity 2023-2026
        </h3>
      </div>

      <AppleActivityCard/>
      
    </div>
  );
};

export default GitHubActivityCard;