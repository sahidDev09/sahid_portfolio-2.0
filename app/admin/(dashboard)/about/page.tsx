"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { FormInput, FormTextarea } from "@/components/admin/FormElements";
import { Loader2, Save } from "lucide-react";

interface ProfileData {
  id: any;
  name: string;
  title: string;
  location: string;
  email: string;
  avatar_url: string;
  bio: string;
}

export default function AdminAbout() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: profileData, error } = await supabase
        .from("about_profile")
        .select("*")
        .single();
      
      if (profileData) setData(profileData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    
    const { error } = await supabase
      .from("about_profile")
      .update(data)
      .eq("id", data.id);

    if (!error) {
      alert("About Me updated successfully!");
    } else {
      alert("Error updating About Me: " + error.message);
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
        <h1 className="text-3xl font-bold font-heading mb-2">About Me</h1>
        <p className="text-zinc-400">Manage your profile information and bio.</p>
      </div>

      <form onSubmit={handleSave} className="bg-zinc-900/40 border border-white/5 p-8 rounded-3xl backdrop-blur-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput 
            label="Name" 
            value={data?.name} 
            onChange={(e) => setData({ ...data!, name: e.target.value })} 
          />
          <FormInput 
            label="Title" 
            value={data?.title} 
            onChange={(e) => setData({ ...data!, title: e.target.value })} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput 
            label="Location" 
            value={data?.location} 
            onChange={(e) => setData({ ...data!, location: e.target.value })} 
          />
          <FormInput 
            label="Email" 
            value={data?.email} 
            onChange={(e) => setData({ ...data!, email: e.target.value })} 
          />
        </div>

        <FormInput 
          label="Avatar URL" 
          value={data?.avatar_url} 
          onChange={(e) => setData({ ...data!, avatar_url: e.target.value })} 
        />

        <FormTextarea 
          label="Bio" 
          value={data?.bio} 
          onChange={(e) => setData({ ...data!, bio: e.target.value })} 
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
