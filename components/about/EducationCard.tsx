"use client";

import { motion } from "framer-motion";
import { GraduationCap, Building2, Calendar, BookOpen, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Education {
  id: string;
  degree: string;
  institution: string;
  subject: string;
  year: string;
  credits?: string;
  status: "completed" | "current";
}

const EducationCard = () => {
  const [educationData, setEducationData] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("about_education")
          .select("*")
          .order("display_order", { ascending: true });

        if (error) throw error;
        if (data) setEducationData(data);
      } catch (error) {
        console.error("Error fetching education:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  return (
    <div className="h-full bg-gray-600/20 backdrop-blur-xl border border-[#2a2a4a]/50 rounded-2xl shadow-lg p-6 transition-all duration-500 hover:shadow-2xl hover:border-[#8b5cf6]/30 hover:-translate-y-1 min-h-[300px]">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-xl bg-[#22d3ee]/10">
          <GraduationCap className="w-5 h-5 text-[#22d3ee]" />
        </div>
        <h3 className="text-lg font-semibold text-[#f1f5f9]">
          Educational Qualification
        </h3>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-3/4 bg-white/5 animate-pulse rounded" />
              <div className="h-3 w-1/2 bg-white/5 animate-pulse rounded" />
              <div className="h-3 w-1/4 bg-white/5 animate-pulse rounded" />
            </div>
          ))
        ) : (
          educationData.map((edu, index) => (
            <motion.div
              key={edu.id}
              className="relative pl-6 pb-4 last:pb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15, duration: 0.4 }}
            >
              {/* Timeline line */}
              {index !== educationData.length - 1 && (
                <div className="absolute left-[9px] top-6 w-0.5 h-[calc(100%-8px)] bg-[#3a3a5a]" />
              )}

              {/* Timeline dot */}
              <div
                className={`absolute left-0 top-1.5 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${
                  edu.status === "current"
                    ? "border-[#8b5cf6] bg-[#8b5cf6]/20"
                    : "border-[#64748b]/30 bg-[#2a2a4a]"
                }`}
              >
                {edu.status === "current" && (
                  <div className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse" />
                )}
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-[#f1f5f9] text-sm leading-tight">
                    {edu.degree}
                  </h4>
                  {edu.status === "current" && (
                    <span className="shrink-0 px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#8b5cf6]/10 text-[#a78bfa] border border-[#8b5cf6]/20">
                      Current
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
                  <Building2 className="w-3 h-3" />
                  <span>{edu.institution}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3" />
                    <span>{edu.subject}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
                  <Calendar className="w-3 h-3" />
                  <span>{edu.year}</span>
                </div>

                {edu.credits && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#22d3ee]/5 border border-[#22d3ee]/10 text-[#22d3ee] text-[10px] font-medium uppercase tracking-wider">
                    <Award className="w-3 h-3" />
                    <span>{edu.credits}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default EducationCard;