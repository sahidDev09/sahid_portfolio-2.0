import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { Mail, MapPin, Sparkles, Github, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";

interface ProfileCardProps {
  avatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  location?: string;
  email?: string;
}

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub", color: "#f1f5f9" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn", color: "#0077b5" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter", color: "#1da1f2" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook", color: "#1877f2" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram", color: "#e4405f" },
];

const ProfileCard = ({
  avatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  name = "Your Name",
  title = "Full Stack Developer",
  handle = "yourhandle",
  location = "Sylhet, Bangladesh",
  email = "hello@example.com",
}: ProfileCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

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

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative h-full"
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute -inset-4 rounded-3xl opacity-0 transition-opacity duration-500 -z-10 blur-[30px]"
        style={{
          background: "radial-gradient(circle at center, rgba(139,92,246,0.25), transparent 70%)",
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />

      {/* Card */}
      <div
        className="h-full flex flex-col overflow-hidden bg-[#1a1a2e]/60 backdrop-blur-xl border border-[#2a2a4a]/50 rounded-2xl shadow-lg p-6 transition-all duration-500 hover:shadow-2xl hover:border-[#8b5cf6]/30 hover:-translate-y-1"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6] via-transparent to-[#22d3ee]" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #8b5cf6 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        {/* Avatar Section */}
        <motion.div
          className="relative z-10 flex justify-center pt-4"
          style={{ transform: "translateZ(50px)" }}
        >
          <div className="relative">
            <motion.div
              className="absolute -inset-2 rounded-full bg-gradient-to-br from-[#8b5cf6] via-[#22d3ee] to-[#d946ef]"
              animate={{
                rotate: isHovered ? 360 : 0,
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#1a1a2e]">
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div
              className="absolute -bottom-1 -right-1 p-2 rounded-full bg-[#22d3ee] text-[#0a0a14] shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          className="relative z-10 flex-1 flex flex-col items-center text-center px-6 pt-6 pb-4"
          style={{ transform: "translateZ(30px)" }}
        >
          <motion.span
            className="px-3 py-1 text-xs font-medium rounded-full bg-[#8b5cf6]/10 text-[#a78bfa] border border-[#8b5cf6]/20 mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Available for hire
          </motion.span>

          <h2 className="text-2xl md:text-3xl font-bold text-[#f1f5f9] mb-1">
            {name}
          </h2>
          <p className="text-[#a78bfa] font-medium mb-1">{title}</p>
          <p className="text-[#64748b] text-sm mb-4">@{handle}</p>

          <div className="flex flex-col gap-2 w-full text-sm text-[#94a3b8]">
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-[#8b5cf6]" />
              <span>{location}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4 text-[#8b5cf6]" />
              <span>{email}</span>
            </div>
          </div>

          {/* Social Links */}
          <motion.div 
            className="flex items-center justify-center gap-3 mt-5"
            style={{ transform: "translateZ(35px)" }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#2a2a4a]/50 border border-[#3a3a5a]/50 text-[#94a3b8] transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
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
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Contact Button */}
        <motion.div
          className="relative z-10 px-6 pb-6"
          style={{ transform: "translateZ(40px)" }}
        >
          <button className="w-full py-3 px-6 rounded-xl bg-[#8b5cf6] text-[#0a0a14] font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#8b5cf6]/25 hover:scale-[1.02] active:scale-[0.98]">
            Get in Touch
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;