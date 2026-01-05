import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef, useId } from "react";
import { Mail, MapPin, Sparkles, Github, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import { ExpandableScreen, ExpandableScreenContent, ExpandableScreenTrigger } from "../ui/expandable-screen";
import WaitlistForm from "../Process/WaitlistForm";

interface ProfileCardProps {
  avatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  location?: string;
  email?: string;
}

const socialLinks = [
  { icon: Github, href: "https://github.com/sahidDev09", label: "GitHub", color: "#f1f5f9" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/sahidofficial09", label: "LinkedIn", color: "#0077b5" },
  { icon: Twitter, href: "https://x.com/SahidAh009", label: "Twitter", color: "#1da1f2" },
  { icon: Facebook, href: "https://www.facebook.com/Sm.sahid99", label: "Facebook", color: "#1877f2" },
  { icon: Instagram, href: "https://www.instagram.com/0sahid_99", label: "Instagram", color: "#e4405f" },
];

const ProfileCard = ({
  avatarUrl = "./sahid_bento.jpg",
  name = "ABU SAHID",
  title = "MERN Stack Developer",
  handle = "sahidDev09",
  location = "Sylhet, Bangladesh",
  email = "sahidDev09@gmail.com",
}: ProfileCardProps) => {
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
      className="relative h-full cursor-pointer md:min-h-[400px]"
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
            height: isHovered ? "180px" : "100%",
            paddingTop: isHovered ? "24px" : "0px",
          }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <motion.div 
            className="relative"
            animate={{
              width: isHovered ? "128px" : "100%",
              height: isHovered ? "128px" : "100%",
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
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            </motion.div>
            <motion.div
              className="absolute -bottom-1 -right-1 p-2 rounded-full bg-[#8001ff] text-[#f1f5f9] shadow-lg z-30"
              initial={{ scale: 0 }}
              animate={{ scale: isHovered ? 1 : 0 }}
              transition={{ delay: isHovered ? 0.3 : 0 }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Info Section Container */}
        <motion.div
          animate={{
            y: isHovered ? 180 : 400,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="absolute left-0 right-0 top-0 h-[calc(100%-180px)] z-10 flex flex-col pointer-events-none"
        >
          <div className="pointer-events-auto flex-1 flex flex-col justify-between">
            {/* Info Section */}
            <div
              className="relative z-10 flex flex-col items-center text-center px-6 pt-2"
              style={{ transform: "translateZ(30px)" }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#f1f5f9] mb-1">
                {name}
              </h2>
              <p className="text-[#9832ff] font-medium mb-3">{title}</p>

              <div className="flex flex-col gap-1 w-full text-sm text-[#94a3b8]">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8001ff]" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4 text-[#8001ff]" />
                  <span>{email}</span>
                </div>
              </div>
            </div>

            {/* Bottom Section: Socials and Button */}
            <div className="flex flex-col gap-6 pb-16">
              {/* Social Links */}
              <div 
                className="flex items-center justify-between px-6"
                style={{ transform: "translateZ(35px)" }}
              >
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#2a2a4a]/50 border border-[#3a3a5a]/50 text-[#94a3b8] transition-all duration-300"
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
                    <social.icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>

              {/* Contact Button */}
              <div
                className="px-6"
                style={{ transform: "translateZ(40px)" }}
              >
                <ExpandableScreen layoutId={`cta-card-${uniqueId}`} triggerRadius="100px" contentRadius="24px">
                  <ExpandableScreenTrigger className="w-full">
                    <button type="button" className="w-full py-3 px-6 rounded-xl gradient-glow text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#8001ff]/25 hover:scale-[1.02] active:scale-[0.98]">
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