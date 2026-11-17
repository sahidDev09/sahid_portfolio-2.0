"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Lanyard, { type LanyardBackData } from "./Lanyard";

interface SocialLink {
  icon: string;
  href: string;
  label: string;
  color: string;
}

interface ProfileData {
  name: string;
  title: string;
  handle: string;
  location: string;
  email: string;
  avatar_url: string;
  social_links: SocialLink[];
}

const fallbackProfile: ProfileData = {
  name: "Sahid",
  title: "Full Stack Developer",
  handle: "@sahid",
  location: "Sylhet, Bangladesh",
  email: "iamsahidofficial99@gmail.com",
  avatar_url: "/sahid_bento.jpg",
  social_links: [
    { icon: "Github", href: "https://github.com", label: "GitHub", color: "#f1f5f9" },
    { icon: "Linkedin", href: "https://linkedin.com", label: "LinkedIn", color: "#0a66c2" },
    { icon: "Twitter", href: "https://twitter.com", label: "Twitter", color: "#1da1f2" },
  ],
};

const ProfileCard = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("about_profile")
          .select("*")
          .single();

        if (error) throw error;
        if (data) setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const displayProfile = profile || fallbackProfile;
  const avatarUrl =
    displayProfile.avatar_url &&
    (displayProfile.avatar_url.startsWith("http") || displayProfile.avatar_url.startsWith("/"))
      ? displayProfile.avatar_url
      : "/sahid_bento.jpg";

  const backData: LanyardBackData = {
    name: displayProfile.name,
    title: displayProfile.title,
    handle: displayProfile.handle || "@sahid",
    location: displayProfile.location,
    email: displayProfile.email,
    socials:
      displayProfile.social_links?.map((s) => ({
        label: s.label,
        handle: s.href.replace(/^https?:\/\/(www\.)?/, ""),
      })) || [],
  };

  if (loading) {
    return (
      <div className="h-full min-h-[500px] rounded-2xl bg-[#1a1a2e]/60 animate-pulse border border-[#2a2a4a]/50 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-white/5" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[520px] md:min-h-[580px] overflow-hidden bg-[#1a1a2e]/60 backdrop-blur-xl border border-[#2a2a4a]/50 rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:border-[#8001ff]/30">
      {/* Background Gradient & Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8001ff] via-transparent to-[#9832ff]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #8001ff 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Floating hints */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/60 text-xs font-medium flex items-center gap-2 pointer-events-none select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#8001ff] animate-pulse" />
        Interactive 3D Badge
      </div>

      <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/50 text-xs font-medium flex items-center gap-1.5 pointer-events-none select-none">
        Click to flip ⟲
      </div>

      {/* Full box Lanyard */}
      <Lanyard
        frontImage={avatarUrl}
        backData={backData}
        cardColor="#14121f"
        strapColor="#8001ff"
        strapText="CREVOSYS"
        finish="holographic"
        metal="silver"
        size={0.62}
        strapLength={0.38}
        strapWidth={0.65}
        gravity={1}
        damping={0.5}
        elasticity={0.5}
        breeze={0.4}
        interactive={true}
        intro={true}
        className="w-full h-full"
      />
    </div>
  );
};

export default ProfileCard;
