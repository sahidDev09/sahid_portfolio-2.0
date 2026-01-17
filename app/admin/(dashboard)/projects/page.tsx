"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { FormInput, FormTextarea } from "@/components/admin/FormElements";
import { Loader2, Plus, Trash2, Save, MoveUp, MoveDown, ExternalLink, Code } from "lucide-react";

interface ProjectData {
  id: any;
  title: string;
  slug: string;
  image_url: string;
  content: string;
  tech_stack: string[];
  live_url: string;
  code_url: string;
  display_order: number;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true });
    
    if (data) setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAdd = () => {
    const newProj: ProjectData = {
      id: "temp-" + Date.now(),
      title: "New Project",
      slug: "project-slug",
      image_url: "",
      content: "Explain your project here...",
      tech_stack: ["Next.js", "Tailwind"],
      live_url: "",
      code_url: "",
      display_order: projects.length
    };
    setProjects([...projects, newProj]);
  };

  const handleDelete = async (id: any) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    if (typeof id === "number" || (typeof id === "string" && !id.startsWith("temp-"))) {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) {
        alert("Error deleting from DB: " + error.message);
        return;
      }
    }
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleUpdate = (id: any, field: keyof ProjectData, value: any) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const existingProjects = projects.filter(p => typeof p.id === 'number' || (typeof p.id === 'string' && !p.id.startsWith('temp-')));
      const newProjects = projects.filter(p => typeof p.id === 'string' && p.id.startsWith('temp-'));

      // Update existing
      await Promise.all(existingProjects.map(async (proj) => {
        const { id, ...rest } = proj;
        const index = projects.findIndex(p => p.id === id);
        const { error } = await supabase
          .from("projects")
          .update({ ...rest, display_order: index })
          .eq("id", id);
        if (error) throw error;
      }));

      // Insert new records in a single batch
      if (newProjects.length > 0) {
        const toInsert = newProjects.map((p) => {
          const { id: _id, ...rest } = p;
          const index = projects.findIndex(proj => proj.id === p.id);
          return { ...rest, display_order: index };
        });
        const { error } = await supabase.from("projects").insert(toInsert);
        if (error) throw error;
      }

      alert("Projects updated successfully!");
      fetchProjects();
    } catch (error: any) {
      alert("Error updating projects: " + error.message);
    }
    setSaving(false);
  };

  const move = (index: number, direction: -1 | 1) => {
    const newProjs = [...projects];
    const target = index + direction;
    if (target < 0 || target >= newProjs.length) return;
    [newProjs[index], newProjs[target]] = [newProjs[target], newProjs[index]];
    setProjects(newProjs);
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
          <h1 className="text-3xl font-bold font-heading mb-2">Projects</h1>
          <p className="text-zinc-400">Manage your featured work.</p>
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

      <div className="space-y-8">
        {projects.map((proj, index) => (
          <div key={proj.id} className="relative group bg-zinc-900/40 border border-white/5 p-8 rounded-3xl backdrop-blur-sm">
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
                disabled={index === projects.length - 1}
              >
                <MoveDown size={20} />
              </button>
            </div>

            <div className="absolute top-8 right-8">
              <button onClick={() => handleDelete(proj.id)} className="text-zinc-500 hover:text-red-500 transition-colors">
                <Trash2 size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput 
                label="Project Title" 
                value={proj.title} 
                onChange={(e) => handleUpdate(proj.id, "title", e.target.value)} 
              />
              <FormInput 
                label="Identifier / Slug" 
                value={proj.slug} 
                onChange={(e) => handleUpdate(proj.id, "slug", e.target.value)} 
              />
            </div>

            <div className="mt-4">
              <FormInput 
                label="Thumbnail Image URL" 
                value={proj.image_url} 
                onChange={(e) => handleUpdate(proj.id, "image_url", e.target.value)} 
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <FormInput 
                label="Live Demo URL" 
                icon={<ExternalLink size={16} />}
                value={proj.live_url} 
                onChange={(e) => handleUpdate(proj.id, "live_url", e.target.value)} 
              />
              <FormInput 
                label="Code Source URL" 
                icon={<Code size={16} />}
                value={proj.code_url} 
                onChange={(e) => handleUpdate(proj.id, "code_url", e.target.value)} 
              />
            </div>

            <div className="mt-4">
               <label className="text-sm font-medium text-zinc-400 ml-1">Tech Stack (Comma separated)</label>
               <input
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8001ff]/50 focus:border-[#8001ff]/50 transition-all"
                value={proj.tech_stack.join(", ")}
                onChange={(e) => handleUpdate(proj.id, "tech_stack", e.target.value.split(",").map(t => t.trim()))}
              />
            </div>

            <div className="mt-4">
              <FormTextarea 
                label="Description / Content" 
                value={proj.content} 
                onChange={(e) => handleUpdate(proj.id, "content", e.target.value)} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
