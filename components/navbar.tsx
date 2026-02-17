"use client";

import { useState } from "react";
import { Github, Download, CheckCircle2, ExternalLink, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { createClient } from "@/utils/supabase/client";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("Home");
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showStatus, setShowStatus] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  const handleDownloadCV = async () => {
    try {
      setDownloading(true);
      setDownloadProgress(0);
      setShowStatus(true);
      
      const supabase = createClient();
      const fileName = 'resume.pdf';
      
      // Get the public URL to use with fetch for progress tracking
      const { data: { publicUrl } } = supabase.storage.from('resume').getPublicUrl(fileName);

      const response = await fetch(publicUrl);
      if (!response.ok) {
        // Fallback to standard download if fetch fails
        const { data, error } = await supabase.storage.from('resume').download(fileName);
        if (error) throw error;
        if (data) {
          const url = window.URL.createObjectURL(data);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'resume.pdf');
          document.body.appendChild(link);
          link.click();
          link.remove();
          setBlobUrl(url);
          setDownloadProgress(100);
          setTimeout(() => {
            setShowStatus(false);
            setShowSuccessDialog(true);
          }, 500);
        }
        return;
      }

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('ReadableStream not supported');
      
      let loaded = 0;
      const chunks = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        if (total) {
          setDownloadProgress(Math.round((loaded / total) * 100));
        } else {
          // Simulation for unknown size
          setDownloadProgress(prev => Math.min(prev + 10, 90));
        }
      }
      
      const blob = new Blob(chunks, { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setBlobUrl(url);

      // Trigger automatic download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setDownloadProgress(100);
      
      // Short delay to show 100% completion
      setTimeout(() => {
        setShowStatus(false);
        setShowSuccessDialog(true);
      }, 800);

    } catch (error) {
      console.error("Error downloading CV:", error);
      alert("Failed to download CV. Please check your connection.");
      setShowStatus(false);
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
    <>
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

      {/* Download Progress Overlay */}
      <AnimatePresence>
        {showStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] min-w-[300px]"
          >
            <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl overflow-hidden relative">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#8001ff]/20 flex items-center justify-center text-[#8001ff]">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Downloading CV...</h4>
                  <p className="text-xs text-zinc-400">{downloadProgress}% complete</p>
                </div>
              </div>
              
              {/* Progress Bar Container */}
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[#8001ff]"
                  initial={{ width: 0 }}
                  animate={{ width: `${downloadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Subtle glow effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8001ff]/50 to-transparent" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Dialog */}
      <AnimatePresence>
        {showSuccessDialog && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessDialog(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#1a1a2e]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              {/* Header / Decorations */}
              <div className="h-24 bg-gradient-to-br from-[#8001ff] to-[#9832ff] relative flex items-center justify-center">
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={() => setShowSuccessDialog(false)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-[#8001ff] translate-y-8">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              </div>

              <div className="px-8 pt-12 pb-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Download Complete!</h3>
                <p className="text-zinc-400 text-sm mb-8">
                  Your resume has been downloaded successfully to your device.
                </p>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => {
                      if (blobUrl) {
                        window.open(blobUrl, '_blank');
                      }
                      setShowSuccessDialog(false);
                    }}
                    className="w-full bg-[#8001ff] hover:bg-[#9832ff] text-white rounded-xl py-6 flex items-center justify-center gap-2 font-bold group"
                  >
                    <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    View in New Tab
                  </Button>
                  
                  <button
                    onClick={() => setShowSuccessDialog(false)}
                    className="w-full py-3 text-zinc-500 hover:text-white transition-colors text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Bottom Accent */}
              <div className="h-1 bg-gradient-to-r from-transparent via-[#8001ff]/50 to-transparent" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
