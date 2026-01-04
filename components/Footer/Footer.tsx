"use client";

import React, { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { Card } from "./Card";

export const Footer = () => {
  const links = [
    { id: 1, label: "Github", hoverLabel: "My Projects", href: "https://github.com/sahidDev09" },
    { id: 2, label: "Instagram", hoverLabel: "Showing off", href: "https://www.instagram.com/0sahid_99" },
    { id: 3, label: "Linkedin", hoverLabel: "Professional", href: "https://www.linkedin.com/in/sahidofficial09" },
    { id: 4, label: "Facebook", hoverLabel: "Time waste", href: "https://www.facebook.com/Sm.sahid99" },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("iamsahidofficial99@gmail.com");
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  return (
    <div id="contact" className="container mx-auto mt-20 mb-5">
      <SectionHeader title="Get in Touch" description="Feel free to reach out to discuss projects, ideas, or collaboration opportunities. I&apos;d love to hear from you!"/>
      <Card className="mt-8 p-0 bg-gray-600/20 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
        {/* Mac-style Top Bar (Header - Keeping as is but making it glass-friendly) */}
        <div className="flex items-center px-4 py-4 bg-white/10 border-b border-white/10">
          <span className="w-3 h-3 bg-red-500/80 rounded-full mr-2 shadow-[0_0_10px_rgba(239,68,68,0.4)]"></span>
          <span className="w-3 h-3 bg-yellow-400/80 rounded-full mr-2 shadow-[0_0_10px_rgba(250,204,21,0.4)]"></span>
          <span className="w-3 h-3 bg-green-500/80 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]"></span>
        </div>
        
        <footer className="text-gray-200 py-12">
          <div className="px-8 flex flex-col md:flex-row md:items-start justify-around gap-12 md:gap-4 w-full">
            {/* Connect Section */}
            <div className="flex flex-col">
              <h3 className="text-xs font-bold uppercase mb-6 tracking-[0.3em] text-white/50">Connect</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {links.map((link, index) => (
                  <a 
                    key={link.id} 
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="relative group flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 overflow-hidden transition-all duration-500 hover:border-[#8001ff]/50 hover:shadow-[0_0_30px_rgba(128,1,255,0.2)] md:w-64"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Animated Gradient Background */}
                    <div className="absolute inset-0 bg-linear-to-r from-[#8001ff] to-[#9832ff] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    
                    {/* Text Container */}
                    <div className="relative z-10 text-center">
                      <div className="relative h-8 flex items-center justify-center">
                        <span className={`absolute text-xl font-bold tracking-tight transition-all duration-500 ${hoveredIndex === index ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"}`}>
                          {link.label}
                        </span>
                        <span className={`absolute text-xl font-bold tracking-tight text-white transition-all duration-500 ${hoveredIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                          {link.hoverLabel}
                        </span>
                      </div>
                    </div>

                    {/* Subtle Corner Glow */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 group-hover:bg-white/10 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="flex flex-col">
              <h3 className="text-xs font-bold uppercase mb-6 tracking-[0.3em] text-white/50">Contact</h3>          
              <div className="flex flex-col gap-4">
                <div className="relative group overflow-hidden p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#8001ff]/30 transition-all duration-500">
                  <div className="relative z-10">
                    <p className="text-sm text-gray-400 mb-1">Email Me</p>
                    <p className="text-xl md:text-2xl font-bold text-white group-hover:text-[#9832ff] transition-colors duration-300">
                      iamsahidofficial99@gmail.com
                    </p>
                  </div>
                  <a 
                    href="mailto:iamsahidofficial99@gmail.com" 
                    className="absolute inset-0 z-20 flex items-center justify-center bg-linear-to-r from-[#8001ff] to-[#9832ff] opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white font-bold p-4 text-center"
                  >
                    Click to send an email! <br /> I normally reply within 24h.
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#8001ff]/50 transition-all duration-300 group"
                    aria-label="Copy email"
                  >
                    {hasCopied ? (
                      <CheckIcon size={18} className="text-green-400" />
                    ) : (
                      <CopyIcon size={18} className="text-gray-400 group-hover:text-white" />
                    )}
                    <span className="text-sm font-medium">
                      {hasCopied ? "Copied!" : "Copy Email"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </Card>
    </div>

  );
};