"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { FormInput } from "@/components/admin/FormElements";
import { Loader2, Save } from "lucide-react";

interface HeroData {
  name: string;
  specialization: string;
  designation_titles: string[];
  hero_image_url: string;
}

export default function AdminHero() {
  const [data, setData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: heroData, error } = await supabase
        .from("hero_section")
        .select("*")
        .eq("is_active", true)
        .single();
      
      if (heroData) setData(heroData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    
    const { error } = await supabase
      .from("hero_section")
      .update({
        name: data.name,
        specialization: data.specialization,
        designation_titles: data.designation_titles,
        hero_image_url: data.hero_image_url
      })
      .eq("is_active", true);

    if (!error) {
      alert("Hero section updated successfully!");
    } else {
      alert("Error updating hero section: " + error.message);
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
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Hero Section</h1>
        <p className="text-zinc-400">Manage your main landing page content.</p>
      </div>

      <form onSubmit={handleSave} className="bg-zinc-900/40 border border-white/5 p-8 rounded-3xl backdrop-blur-sm space-y-6">
        <FormInput 
          label="Name" 
          value={data?.name} 
          onChange={(e) => setData({ ...data!, name: e.target.value })} 
        />
        
        <FormInput 
          label="Specialization" 
          value={data?.specialization} 
          onChange={(e) => setData({ ...data!, specialization: e.target.value })} 
        />

        <div className="space-y-4">
          <label className="text-sm font-medium text-zinc-400 ml-1">Designation Titles (One per line)</label>
          <textarea
            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8001ff]/50 focus:border-[#8001ff]/50 transition-all min-h-[100px]"
            value={data?.designation_titles.join("\n")}
            onChange={(e) => setData({ ...data!, designation_titles: e.target.value.split("\n") })}
          />
        </div>

        <FormInput 
          label="Hero Image URL" 
          value={data?.hero_image_url} 
          onChange={(e) => setData({ ...data!, hero_image_url: e.target.value })} 
        />

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-[#8001ff] hover:bg-[#9832ff] text-white rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
