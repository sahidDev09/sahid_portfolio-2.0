"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Github, GitCommit, FolderGit2, Star, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface ActivityData {
    label: string;
    value: number;
    color: string;
    secondaryColor: string;
    size: number;
    current: number;
    target: number;
    unit: string;
    icon: LucideIcon;
}

const iconMap: Record<string, LucideIcon> = {
    Commits: GitCommit,
    Repositories: FolderGit2,
    Stars: Star,
};

const CircleProgress = ({ data, index }: { data: ActivityData; index: number }) => {
    const strokeWidth = 16;
    const radius = (data.size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = ((100 - data.value) / 100) * circumference;

    const gradientId = `gradient-${data.label.toLowerCase()}`;
    const gradientUrl = `url(#${gradientId})`;

    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
        >
            <div className="relative">
                <svg
                    width={data.size}
                    height={data.size}
                    viewBox={`0 0 ${data.size} ${data.size}`}
                    className="transform -rotate-90"
                    aria-label={`${data.label} Activity Progress - ${data.value}%`}
                >
                    <title>{`${data.label} Activity Progress - ${data.value}%`}</title>

                    <defs>
                        <linearGradient
                            id={gradientId}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                        >
                            <stop
                                offset="0%"
                                style={{
                                    stopColor: data.color,
                                    stopOpacity: 1,
                                }}
                            />
                            <stop
                                offset="100%"
                                style={{
                                    stopColor: data.secondaryColor,
                                    stopOpacity: 1,
                                }}
                            />
                        </linearGradient>
                    </defs>

                    <circle
                        cx={data.size / 2}
                        cy={data.size / 2}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        className="text-zinc-200/50 dark:text-zinc-800/50"
                    />

                    <motion.circle
                        cx={data.size / 2}
                        cy={data.size / 2}
                        r={radius}
                        fill="none"
                        stroke={gradientUrl}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        whileInView={{ strokeDashoffset: progress }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 1.8,
                            delay: index * 0.2,
                            ease: "easeInOut",
                        }}
                        strokeLinecap="round"
                        style={{
                            filter: "drop-shadow(0 0 6px rgba(0,0,0,0.15))",
                        }}
                    />
                </svg>
            </div>
        </motion.div>
    );
};

const DetailedActivityInfo = ({ activities }: { activities: ActivityData[] }) => {
    return (
        <motion.div
            className="hidden md:flex flex-col gap-6 ml-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            {activities.map((activity) => (
                <motion.div key={activity.label} className="flex flex-col">
                    <div className="flex items-center gap-2 mb-0.5">
                        <activity.icon className="w-3.5 h-3.5" style={{ color: activity.color }} />
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            {activity.label}
                        </span>
                    </div>
                    <span
                        className="text-2xl font-semibold"
                        style={{ color: activity.color }}
                    >
                        {activity.current}
                        <span className="mx-1 text-zinc-400 dark:text-zinc-600 font-normal">/</span>
                        <span className="text-sm text-zinc-500">{activity.target}</span>
                        {activity.unit && (
                            <span className="text-base ml-1 text-zinc-600 dark:text-zinc-400">
                                {activity.unit}
                            </span>
                        )}
                    </span>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default function AppleActivityCard({
    title = "Activity Rings",
    className,
}: {
    title?: string;
    className?: string;
}) {
    const [activities, setActivities] = useState<ActivityData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const supabase = createClient();
            try {
                const { data, error } = await supabase
                    .from("about_github_stats")
                    .select("*")
                    .order("display_order", { ascending: true });

                if (error) throw error;
                if (data) {
                    const mappedData: ActivityData[] = data.map((item: any) => ({
                        label: item.label,
                        value: item.percentage,
                        color: item.color,
                        secondaryColor: item.secondary_color,
                        size: item.size,
                        current: item.current_value,
                        target: item.target_value,
                        unit: "",
                        icon: iconMap[item.label] || Github,
                    }));
                    setActivities(mappedData);
                }
            } catch (error) {
                console.error("Error fetching GitHub stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[200px]">
                <div className="w-20 h-20 rounded-full border-4 border-[#8B5CF6]/20 border-t-[#8B5CF6] animate-spin" />
            </div>
        );
    }

    return (
        <div
            className={cn(
                "relative w-full max-w-3xl mx-auto p-4 md:p-8 rounded-3xl",
                "text-zinc-900 dark:text-white",
                className
            )}
        >
            <div className="flex flex-col items-center gap-8">
                <div className="flex items-center">
                    <div className="relative w-[180px] h-[180px] md:w-[200px] md:h-[200px] flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="absolute z-10"
                        >
                            <Github className="w-8 h-8 text-zinc-400 dark:text-zinc-500 opacity-50" />
                        </motion.div>
                        {activities.map((activity, index) => (
                            <CircleProgress
                                key={activity.label}
                                data={activity}
                                index={index}
                            />
                        ))}
                    </div>
                    <DetailedActivityInfo activities={activities} />
                </div>
            </div>
        </div>
    );
}

