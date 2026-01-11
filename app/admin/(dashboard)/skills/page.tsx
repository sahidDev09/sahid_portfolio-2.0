"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { FormInput } from "@/components/admin/FormElements";
import { Loader2, Plus, Trash2, Save, MoveUp, MoveDown } from "lucide-react";

interface Skill {
  id?: number;
  name: string;
  category: string;
  display_order: number;
}

const CATEGORIES = ["frontend", "backend", "language", "database", "tools", "design"];

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("about_skills")
      .select("*")
      .order("display_order", { ascending: true });
    
    if (data) setSkills(data);
    setLoading(false);
  };

  const handleAdd = () => {
    const newSkill: Skill = {
      name: "New Skill",
      category: "frontend",
      display_order: skills.length
    };
    setSkills([...skills, newSkill]);
  };

  const handleDelete = async (index: number) => {
    const skill = skills[index];
    if (skill.id) {
       if (!confirm("Are you sure?")) return;
       const { error } = await supabase.from("about_skills").delete().eq("id", skill.id);
       if (error) {
         alert("Error deleting: " + error.message);
         return;
       }
    }
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, field: keyof Skill, value: any) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setSkills(newSkills);
  };

  const handleSave = async () => {
    setSaving(true);
    const toUpsert = skills.map((skill, index) => ({
      ...skill,
      display_order: index
    }));

    const { error } = await supabase.from("about_skills").upsert(toUpsert);

    if (!error) {
      alert("Skills updated successfully!");
      fetchSkills();
    } else {
      alert("Error updating skills: " + error.message);
    }
    setSaving(false);
  };

  const move = (index: number, direction: -1 | 1) => {
    const newSkills = [...skills];
    const target = index + direction;
    if (target < 0 || target >= newSkills.length) return;
    [newSkills[index], newSkills[target]] = [newSkills[target], newSkills[index]];
    setSkills(newSkills);
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
          <h1 className="text-3xl font-bold font-heading mb-2">Modern Skills</h1>
          <p className="text-zinc-400">Manage the skills displayed on your about section.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
          >
            <Plus size={18} />
            Add Skill
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

      <div className="bg-zinc-900/40 border border-white/5 rounded-3xl backdrop-blur-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">Order</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">Skill Name</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">Category</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white">
            {skills.map((skill, index) => (
              <tr key={skill.id || `new-${index}`} className="group hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => move(index, -1)} disabled={index === 0} className="text-zinc-500 hover:text-white disabled:opacity-30">
                      <MoveUp size={16} />
                    </button>
                    <button onClick={() => move(index, 1)} disabled={index === skills.length - 1} className="text-zinc-500 hover:text-white disabled:opacity-30">
                      <MoveDown size={16} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => handleUpdate(index, "name", e.target.value)}
                    className="bg-transparent border-none focus:ring-0 w-full font-medium"
                  />
                </td>
                <td className="px-6 py-4">
                  <select
                    value={skill.category}
                    onChange={(e) => handleUpdate(index, "category", e.target.value)}
                    className="bg-zinc-800 border-none rounded-lg text-sm px-3 py-1.5 focus:ring-2 focus:ring-[#8001ff]/50"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {skills.length === 0 && (
          <div className="py-20 text-center text-zinc-500">
            No skills added yet.
          </div>
        )}
      </div>
    </div>
  );
}
