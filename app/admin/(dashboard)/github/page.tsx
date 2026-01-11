"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { FormInput } from "@/components/admin/FormElements";
import { Loader2, Plus, Trash2, Save, MoveUp, MoveDown } from "lucide-react";

interface GithubStat {
  id?: number;
  label: string;
  percentage: number;
  color: string;
  secondary_color: string;
  size: number;
  current_value: number;
  target_value: number;
  display_order: number;
}

export default function AdminGithub() {
  const [stats, setStats] = useState<GithubStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("about_github_stats")
      .select("*")
      .order("display_order", { ascending: true });
    
    if (data) setStats(data);
    setLoading(false);
  };

  const handleUpdate = (index: number, field: keyof GithubStat, value: any) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    
    // Automatically calculate percentage if current or target changes
    if (field === "current_value" || field === "target_value") {
      const current = field === "current_value" ? Number(value) : newStats[index].current_value;
      const target = field === "target_value" ? Number(value) : newStats[index].target_value;
      if (target > 0) {
        newStats[index].percentage = Math.min(Math.round((current / target) * 100), 100);
      }
    }
    
    setStats(newStats);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("about_github_stats").upsert(stats);

    if (!error) {
      alert("GitHub stats updated successfully!");
      fetchStats();
    } else {
      alert("Error updating stats: " + error.message);
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-[#8001ff]" size={40} />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-2">GitHub Activity</h1>
          <p className="text-zinc-400">Manage the activity rings shown on your profile.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-[#8001ff] hover:bg-[#9832ff] text-white rounded-xl font-bold transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save Stats
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={stat.id || index} className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-white">{stat.label}</span>
              <div 
                className="w-4 h-4 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.3)]" 
                style={{ backgroundColor: stat.color }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormInput 
                label="Current Value" 
                type="number"
                value={stat.current_value} 
                onChange={(e) => handleUpdate(index, "current_value", e.target.value)} 
              />
              <FormInput 
                label="Target Value" 
                type="number"
                value={stat.target_value} 
                onChange={(e) => handleUpdate(index, "target_value", e.target.value)} 
              />
            </div>

            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Progress</span>
              <span className="text-sm font-bold text-white">{stat.percentage}%</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
               <div 
                className="h-full transition-all duration-500 ease-out" 
                style={{ width: `${stat.percentage}%`, backgroundColor: stat.color }}
               />
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput 
                  label="Primary Color" 
                  value={stat.color} 
                  onChange={(e) => handleUpdate(index, "color", e.target.value)} 
                />
                <FormInput 
                  label="Secondary Color" 
                  value={stat.secondary_color} 
                  onChange={(e) => handleUpdate(index, "secondary_color", e.target.value)} 
                />
              </div>
              <FormInput 
                label="Ring Size (px)" 
                type="number"
                value={stat.size} 
                onChange={(e) => handleUpdate(index, "size", e.target.value)} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
