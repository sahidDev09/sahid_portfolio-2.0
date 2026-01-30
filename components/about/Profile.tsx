"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef, useId, useEffect } from "react";
import { Mail, MapPin, Sparkles, Github, Linkedin, Twitter, Facebook, Instagram, type LucideIcon } from "lucide-react";
import { ExpandableScreen, ExpandableScreenContent, ExpandableScreenTrigger } from "../ui/expandable-screen";
import WaitlistForm from "../Process/WaitlistForm";
import { createClient } from "@/utils/supabase/client";

interface SocialLink {
  icon: string | LucideIcon;
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

const iconMap: Record<string, LucideIcon> = {
  Github,
  GitHub: Github,
  github: Github,
  Linkedin,
  LinkedIn: Linkedin,
  linkedin: Linkedin,
  Twitter,
  twitter: Twitter,
  Facebook,
  facebook: Facebook,
  Instagram,
  instagram: Instagram,
};

const ProfileCard = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const uniqueId = useId();
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1000);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  if (loading) {
    return (
      <div className="h-full min-h-[400px] rounded-2xl bg-[#1a1a2e]/60 animate-pulse border border-[#2a2a4a]/50 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-white/5" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative h-full cursor-pointer md:min-h-[460px]"
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute -inset-4 rounded-3xl opacity-0 transition-opacity duration-500 -z-10 blur-[30px]"
        style={{
          background: "radial-gradient(circle at center, rgba(128,1,255,0.25), transparent 70%)",
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />

      {/* Ripple Effects Container */}
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden rounded-2xl">
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: ripple.x - 50,
              top: ripple.y - 50,
              width: 100,
              height: 100,
              backgroundColor: "rgba(128, 1, 255, 0.4)",
              borderRadius: "50%",
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div
        className="h-full relative flex flex-col overflow-hidden bg-[#1a1a2e]/60 backdrop-blur-xl border border-[#2a2a4a]/50 rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:border-[#8001ff]/30"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Background Pattern */}
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
        
        {/* Hover Hint */}
        <motion.div
          animate={{ 
            opacity: isHovered ? 0 : 1,
            y: isHovered ? -20 : 0
          }}
          className="absolute top-6 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/50 text-xs font-medium flex items-center gap-2 pointer-events-none"
        >
          <div className="w-1 h-1 rounded-full bg-[#8001ff] shadow-[0_0_8px_#8001ff]" />
          Hover me
        </motion.div>

        {/* Full frame image / Avatar Section */}
        <motion.div
          className="absolute inset-0 z-20 flex justify-center w-full overflow-hidden"
          animate={{
            height: isHovered ? "210px" : "100%",
            paddingTop: isHovered ? "32px" : "0px",
          }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <motion.div 
            className="relative"
            animate={{
              width: isHovered ? "150px" : "100%",
              height: isHovered ? "150px" : "100%",
              scale: isHovered ? 1 : 1.1,
            }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.div
              className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#8001ff] to-[#9832ff] opacity-0"
              animate={{
                rotate: isHovered ? 360 : 0,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                opacity: { duration: 0.4 }
              }}
            />
            <motion.div 
              className="relative w-full h-full overflow-hidden border-[#1a1a2e]"
              animate={{
                borderRadius: isHovered ? "9999px" : "0px",
                borderWidth: isHovered ? "2px" : "0px",
              }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            </motion.div>
            <motion.div
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#8001ff] text-[#f1f5f9] shadow-lg z-30"
              initial={{ scale: 0 }}
              animate={{ scale: isHovered ? 1 : 0 }}
              transition={{ delay: isHovered ? 0.3 : 0 }}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Info Section Container */}
        <motion.div
          animate={{
            y: isHovered ? 210 : 460,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="absolute left-0 right-0 top-0 h-[calc(100%-210px)] z-10 flex flex-col pointer-events-none"
        >
          <div className="pointer-events-auto flex-1 flex flex-col justify-between">
            {/* Info Section */}
            <div
              className="relative z-10 flex flex-col items-center text-center px-6 pt-4 gap-1.5"
              style={{ transform: "translateZ(30px)" }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#f1f5f9]">
                {profile.name}
              </h2>
              <p className="text-[#9832ff] font-semibold text-base mb-2">{profile.title}</p>

              <div className="flex flex-col gap-2 w-full text-sm text-[#94a3b8]">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8001ff]" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4 text-[#8001ff]" />
                  <span>{profile.email}</span>
                </div>
              </div>
            </div>

            {/* Bottom Section: Socials and Button */}
            <div className="flex flex-col gap-6 pb-10">
              {/* Social Links */}
              <div 
                className="flex items-center justify-between px-6"
                style={{ transform: "translateZ(35px)" }}
              >
                {profile.social_links.map((social) => {
                  const Icon = (typeof social.icon === 'string' ? iconMap[social.icon] : social.icon) || iconMap[social.label] || Github;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-[#2a2a4a]/50 border border-[#3a3a5a]/50 text-[#94a3b8] transition-all duration-300"
                      whileHover={{ 
                        scale: 1.15, 
                        y: -4,
                        backgroundColor: `${social.color}20`,
                        borderColor: social.color,
                      }}
                      whileTap={{ scale: 0.95 }}
                      style={{ color: "#94a3b8" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = social.color;
                        e.currentTarget.style.boxShadow = `0 8px 25px -5px ${social.color}40`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#94a3b8";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.a>
                  );
                })}
              </div>

              {/* Contact Button */}
              <div
                className="px-6"
                style={{ transform: "translateZ(40px)" }}
              >
                <ExpandableScreen layoutId={`cta-card-${uniqueId}`} triggerRadius="100px" contentRadius="24px">
                  <ExpandableScreenTrigger className="w-full">
                    <button type="button" className="w-full py-2.5 px-6 rounded-xl gradient-glow text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#8001ff]/25 hover:scale-[1.02] active:scale-[0.98]">
                      Get in Touch
                    </button>
                  </ExpandableScreenTrigger>
                  <ExpandableScreenContent className="bg-[#16131F]">
                    <WaitlistForm />
                  </ExpandableScreenContent>
                </ExpandableScreen>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;