"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { FormInput } from "@/components/admin/FormElements";
import { Loader2, Plus, Trash2, Save, MoveUp, MoveDown } from "lucide-react";

interface Education {
  id?: string;
  degree: string;
  institution: string;
  subject: string;
  year: string;
  credits?: string;
  status: "completed" | "current";
  display_order: number;
}

export default function AdminEducation() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchEducation = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("about_education")
      .select("*")
      .order("display_order", { ascending: true });
    
    if (data) setEducation(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleAdd = () => {
    const newEdu: Education = {
      degree: "Degree Name",
      institution: "Institution Name",
      subject: "Major/Subject",
      year: "20XX - 20XX",
      status: "completed",
      display_order: education.length
    };
    setEducation([...education, newEdu]);
  };

  const handleDelete = async (index: number) => {
    const item = education[index];
    if (item.id) {
       if (!confirm("Are you sure?")) return;
       const { error } = await supabase.from("about_education").delete().eq("id", item.id);
       if (error) {
         alert("Error deleting: " + error.message);
         return;
       }
    }
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, field: keyof Education, value: any) => {
    const newEdu = [...education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    setEducation(newEdu);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const existing = education.filter(e => e.id);
      const newItems = education.filter(e => !e.id);

      // Update existing
      await Promise.all(existing.map(async (edu) => {
        const { id, ...rest } = edu;
        const index = education.findIndex(e => e.id === id);
        const { error } = await supabase
          .from("about_education")
          .update({ ...rest, display_order: index })
          .eq("id", id);
        if (error) throw error;
      }));

      // Insert new
      if (newItems.length > 0) {
        const toInsert = newItems.map((edu) => {
          const { id, ...rest } = edu;
          const index = education.indexOf(edu);
          return { ...rest, display_order: index };
        });
        const { error } = await supabase.from("about_education").insert(toInsert);
        if (error) throw error;
      }

      alert("Education updated successfully!");
      fetchEducation();
    } catch (error: any) {
      alert("Error updating education: " + error.message);
    }
    setSaving(false);
  };

  const move = (index: number, direction: -1 | 1) => {
    const newEdu = [...education];
    const target = index + direction;
    if (target < 0 || target >= newEdu.length) return;
    [newEdu[index], newEdu[target]] = [newEdu[target], newEdu[index]];
    setEducation(newEdu);
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
          <h1 className="text-3xl font-bold font-heading mb-2">Education</h1>
          <p className="text-zinc-400">Manage your educational qualifications.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
          >
            <Plus size={18} />
            Add Education
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
        {education.map((edu, index) => (
          <div key={edu.id || `new-${index}`} className="relative group bg-zinc-900/40 border border-white/5 p-8 rounded-3xl backdrop-blur-sm">
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
                disabled={index === education.length - 1}
              >
                <MoveDown size={20} />
              </button>
            </div>

            <div className="absolute top-8 right-8 text-right space-y-4">
              <button onClick={() => handleDelete(index)} className="text-zinc-500 hover:text-red-500 transition-colors">
                <Trash2 size={22} />
              </button>
              <div>
                 <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest block mb-1">Status</span>
                 <select
                    value={edu.status}
                    onChange={(e) => handleUpdate(index, "status", e.target.value)}
                    className="bg-zinc-800 border-none rounded-lg text-sm px-3 py-1.5 focus:ring-2 focus:ring-[#8001ff]/50"
                  >
                    <option value="completed">Completed</option>
                    <option value="current">Current</option>
                  </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput 
                label="Degree" 
                value={edu.degree} 
                onChange={(e) => handleUpdate(index, "degree", e.target.value)} 
              />
              <FormInput 
                label="Institution" 
                value={edu.institution} 
                onChange={(e) => handleUpdate(index, "institution", e.target.value)} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <FormInput 
                label="Subject" 
                value={edu.subject} 
                onChange={(e) => handleUpdate(index, "subject", e.target.value)} 
              />
              <FormInput 
                label="Year Range" 
                value={edu.year} 
                onChange={(e) => handleUpdate(index, "year", e.target.value)} 
              />
              <FormInput 
                label="Credits/Award (Optional)" 
                value={edu.credits || ""} 
                onChange={(e) => handleUpdate(index, "credits", e.target.value)} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
