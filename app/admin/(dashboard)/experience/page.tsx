/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { FormInput, FormTextarea } from "@/components/admin/FormElements";
import { Loader2, Plus, Trash2, Save, MoveUp, MoveDown } from "lucide-react";

interface ExperienceData {
  id: number;
  company: string;
  role: string;
  designation?: string;
  duration: string;
  type: string;
  type_extra?: string;
  description: string[];
  logo: string;
  logo_color: string;
  priority: number;
}

export default function AdminExperience() {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchExperiences = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("priority", { ascending: true });
    
    if (data) setExperiences(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleAdd = () => {
    const newExp: ExperienceData = {
      id: Date.now(), // Temporary ID for client-side
      company: "New Company",
      role: "Role Name",
      duration: "Present",
      type: "Full-time",
      description: ["Job description point"],
      logo: "",
      logo_color: "bg-zinc-800",
      priority: experiences.length
    };
    setExperiences([...experiences, newExp]);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    
    // If it's a real record (integer from DB typically doesn't look like Date.now())
    if (id < 1000000000000) {
      const { error } = await supabase.from("experiences").delete().eq("id", id);
      if (error) {
        alert("Error deleting from DB: " + error.message);
        return;
      }
    }
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const handleUpdate = (id: number, field: keyof ExperienceData, value: any) => {
    setExperiences(experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const existing = experiences.filter(exp => exp.id < 1000000000000);
      const newItems = experiences.filter(exp => exp.id >= 1000000000000);

      // Update existing
      await Promise.all(existing.map(async (exp) => {
        const { id, ...rest } = exp;
        const index = experiences.findIndex(e => e.id === id);
        const { error } = await supabase
          .from("experiences")
          .update({ ...rest, priority: index })
          .eq("id", id);
        if (error) throw error;
      }));

      // Insert new
      if (newItems.length > 0) {
        const toInsert = newItems.map((exp) => {
          const { id, ...rest } = exp;
          const index = experiences.findIndex(e => e.id === exp.id);
          return { ...rest, priority: index };
        });
        const { error } = await supabase.from("experiences").insert(toInsert);
        if (error) throw error;
      }

      alert("Experiences updated successfully!");
      fetchExperiences();
    } catch (error: any) {
      alert("Error updating experiences: " + error.message);
    }
    setSaving(false);
  };

  const move = (index: number, direction: -1 | 1) => {
    const newExps = [...experiences];
    const target = index + direction;
    if (target < 0 || target >= newExps.length) return;
    [newExps[index], newExps[target]] = [newExps[target], newExps[index]];
    setExperiences(newExps);
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
          <h1 className="text-3xl font-bold font-heading mb-2">Experience</h1>
          <p className="text-zinc-400">Manage your professional journey timeline.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
          >
            <Plus size={18} />
            Add New
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-[#8001ff] hover:bg-[#9832ff] text-white rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save All
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="relative group bg-zinc-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-sm">
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => move(index, -1)} 
                className="p-1 hover:text-[#8001ff] transition-colors disabled:opacity-30" 
                disabled={index === 0}
              >
                <MoveUp size={20} />
              </button>
              <button 
                onClick={() => move(index, 1)} 
                className="p-1 hover:text-[#8001ff] transition-colors disabled:opacity-30"
                disabled={index === experiences.length - 1}
              >
                <MoveDown size={20} />
              </button>
            </div>

            <div className="absolute top-6 right-6">
              <button onClick={() => handleDelete(exp.id)} className="text-zinc-500 hover:text-red-500 transition-colors">
                <Trash2 size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput 
                label="Company" 
                value={exp.company} 
                onChange={(e) => handleUpdate(exp.id, "company", e.target.value)} 
              />
              <FormInput 
                label="Role" 
                value={exp.role} 
                onChange={(e) => handleUpdate(exp.id, "role", e.target.value)} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <FormInput 
                label="Designation (Optional)" 
                value={exp.designation || ""} 
                onChange={(e) => handleUpdate(exp.id, "designation", e.target.value)} 
              />
              <FormInput 
                label="Type Extra (Optional, e.g. Remote)" 
                value={exp.type_extra || ""} 
                onChange={(e) => handleUpdate(exp.id, "type_extra", e.target.value)} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <FormInput 
                label="Duration" 
                value={exp.duration} 
                onChange={(e) => handleUpdate(exp.id, "duration", e.target.value)} 
              />
              <FormInput 
                label="Type" 
                value={exp.type} 
                onChange={(e) => handleUpdate(exp.id, "type", e.target.value)} 
              />
              <FormInput 
                label="Logo URL" 
                value={exp.logo} 
                onChange={(e) => handleUpdate(exp.id, "logo", e.target.value)} 
              />
            </div>

            <div className="mt-4">
              <FormInput 
                label="Logo Color Class (if no logo, e.g. bg-blue-600)" 
                value={exp.logo_color} 
                onChange={(e) => handleUpdate(exp.id, "logo_color", e.target.value)} 
              />
            </div>

            <div className="mt-4">
               <label className="text-sm font-medium text-zinc-400 ml-1">Description (One point per line)</label>
               <textarea
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8001ff]/50 focus:border-[#8001ff]/50 transition-all min-h-[100px]"
                value={exp.description.join("\n")}
                onChange={(e) => handleUpdate(exp.id, "description", e.target.value.split("\n"))}
              />
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <div className="text-center py-20 bg-zinc-900/20 border border-dashed border-white/10 rounded-3xl">
            <p className="text-zinc-400">No experience records found. Click &quot;Add New&quot; to start.</p>
          </div>
        )}
      </div>
    </div>
  );
}
