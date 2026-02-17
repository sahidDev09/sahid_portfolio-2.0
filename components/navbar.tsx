"use client";

import { useState } from "react";
import { Github, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { createClient } from "@/utils/supabase/client";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("Home");
  const [downloading, setDownloading] = useState(false);

  const handleDownloadCV = async () => {
    try {
      setDownloading(true);
      const supabase = createClient();
      
      const fileName = 'resume.pdf';
      
      // Use download instead of getPublicUrl for better reliability and error reporting
      const { data, error } = await supabase
        .storage
        .from('cv')
        .download(fileName);

      if (error) {
        console.error("Supabase Storage Error:", error);
        if (error.message.includes("Bucket not found")) {
          alert("Error: The 'cv' bucket was not found. Please double-check your Supabase bucket name and ensure it's spelled correctly (case-sensitive).");
        } else if (error.message.includes("Object not found")) {
          alert("Error: 'resume.pdf' not found in the 'cv' bucket. Please ensure the file is uploaded.");
        } else {
          alert(`Error: ${error.message}`);
        }
        return;
      }

      if (data) {
        // Create a blob URL and trigger download
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'resume.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading CV:", error);
      alert("Failed to download CV. Please check your Supabase dashboard.");
    } finally {
      setDownloading(false);
    }
  };

  const navLinks = [
    { label: "Home", href: "#" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in w-[90%] md:w-auto">
      <div className="flex items-center justify-between w-full gap-2 px-2 py-2 rounded-full bg-gray-600/20 backdrop-blur-xl border border-border/20">
        {/* Logo */}
        <a
          href="#"
          onClick={() => setActiveLink("Home")}
          className="px-4 py-2 text-lg 2xl:text-2xl font-bold text-white hover:opacity-90 transition-all">
          <Image src="/sahid_nav.png" alt="Logo" width={32} height={32} />
        </a>

        {/* Nav Links */}
        <div className="hidden text-white md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeLink === link.label;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setActiveLink(link.label)}
                className={`px-4 py-2 text-sm 2xl:text-lg font-medium transition-all duration-300 rounded-full ${
                  isActive
                    ? "text-white bg-linear-to-r from-[#8001ff] to-[#9832ff]"
                    : "text-muted-foreground hover:text-white"
                }`}>
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-2">
          <Button
            variant="secondary"
            size="lg"
            className="rounded-full bg-gray-800 backdrop-blur-xl border border-purple-400/20 hover:bg-gray-700 hover:border-purple-400/70"
            asChild>
            <a
              href="https://github.com/sahidDev09"
              target="_blank"
              rel="noopener noreferrer">
              <Github className="w-4 h-4 2xl:w-5 2xl:h-5" />
              <span className="hidden sm:inline 2xl:text-lg">GitHub</span>

            </a>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={handleDownloadCV}
            disabled={downloading}
            className="rounded-full gradient-glow text-white hover:opacity-90 border-0 disabled:opacity-50">

            <Download className={`w-4 h-4 2xl:w-5 2xl:h-5 ${downloading ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline 2xl:text-lg">
              {downloading ? 'Opening...' : 'Download CV'}
            </span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
