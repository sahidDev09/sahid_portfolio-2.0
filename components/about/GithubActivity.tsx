import { motion } from "framer-motion";
import { Github, GitCommit, FolderGit2, Star } from "lucide-react";

interface ActivityRingProps {
  progress: number;
  color: string;
  size: number;
  strokeWidth: number;
  delay?: number;
}

const ActivityRing = ({
  progress,
  color,
  size,
  strokeWidth,
  delay = 0,
}: ActivityRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ transform: "translate(-50%, -50%) rotate(-90deg)" }}
    >
      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#2a2a4a"
        strokeWidth={strokeWidth}
        opacity={0.3}
      />
      {/* Progress ring */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 1.5, delay, ease: "easeOut" }}
      />
    </svg>
  );
};

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
}

const StatItem = ({ icon, label, value, subValue, color }: StatItemProps) => (
  <motion.div
    className="flex items-center gap-3"
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div
      className="w-3 h-3 rounded-full shrink-0"
      style={{ backgroundColor: color }}
    />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-medium text-[#64748b] uppercase tracking-wide">
          {label}
        </span>
      </div>
    </div>
    <div className="text-right shrink-0">
      <span className="text-lg font-bold text-[#f1f5f9]">{value}</span>
      {subValue && (
        <span className="text-xs text-[#64748b] ml-1">{subValue}</span>
      )}
    </div>
  </motion.div>
);

const GitHubActivityCard = () => {
  const stats = {
    commits: { value: 847, goal: 1000, progress: 85 },
    repos: { value: 24, goal: 30, progress: 80 },
    stars: { value: 156, goal: 200, progress: 78 },
  };

  const ringColors = {
    commits: "#d946ef",
    repos: "#22d3ee",
    stars: "#8b5cf6",
  };

  return (
    <div className="h-full bg-gray-600/20 backdrop-blur-xl border border-[#2a2a4a]/50 rounded-2xl shadow-lg p-6 transition-all duration-500 hover:shadow-2xl hover:border-[#8b5cf6]/30 hover:-translate-y-1">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-xl bg-[#f1f5f9]/5">
          <Github className="w-5 h-5 text-[#f1f5f9]" />
        </div>
        <h3 className="text-lg font-semibold text-[#f1f5f9]">
          GitHub Activity
        </h3>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Activity Rings */}
        <div className="relative w-36 h-36 shrink-0">
          <ActivityRing
            progress={stats.commits.progress}
            color={ringColors.commits}
            size={144}
            strokeWidth={12}
            delay={0}
          />
          <ActivityRing
            progress={stats.repos.progress}
            color={ringColors.repos}
            size={116}
            strokeWidth={12}
            delay={0.2}
          />
          <ActivityRing
            progress={stats.stars.progress}
            color={ringColors.stars}
            size={88}
            strokeWidth={12}
            delay={0.4}
          />

          {/* Center icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="w-12 h-12 rounded-full bg-[#1a1a2e] flex items-center justify-center shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <Github className="w-6 h-6 text-[#f1f5f9]" />
            </motion.div>
          </div>
        </div>

        {/* Stats List */}
        <div className="flex-1 space-y-4 w-full">
          <StatItem
            icon={<GitCommit className="w-3.5 h-3.5 text-[#64748b]" />}
            label="Commits"
            value={stats.commits.value}
            subValue={`/${stats.commits.goal}`}
            color={ringColors.commits}
          />
          <StatItem
            icon={<FolderGit2 className="w-3.5 h-3.5 text-[#64748b]" />}
            label="Repos"
            value={stats.repos.value}
            subValue={`/${stats.repos.goal}`}
            color={ringColors.repos}
          />
          <StatItem
            icon={<Star className="w-3.5 h-3.5 text-[#64748b]" />}
            label="Stars"
            value={stats.stars.value}
            subValue={`/${stats.stars.goal}`}
            color={ringColors.stars}
          />
        </div>
      </div>
    </div>
  );
};

export default GitHubActivityCard;