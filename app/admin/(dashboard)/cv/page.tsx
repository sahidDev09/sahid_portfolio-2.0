"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Trash2, Upload, FileText, Download, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminCV() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cvFile, setCvFile] = useState<{ name: string; url: string; size: number | undefined } | null>(null);
  const supabase = createClient();

  const fetchCV = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from("resume").list();
      
      if (error) {
        console.error("Error fetching CV:", error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        // Find the first file that isn't a placeholder
        const fileData = data.find((f: any) => f.name !== ".emptyFolderPlaceholder");
        if (fileData) {
          const { data: publicUrlData } = supabase.storage.from("resume").getPublicUrl(fileData.name);
          setCvFile({ 
            name: fileData.name, 
            url: publicUrlData.publicUrl,
            size: fileData.metadata?.size
          });
        } else {
          setCvFile(null);
        }
      } else {
        setCvFile(null);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchCV();
  }, [fetchCV]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    
    // Use the original filename or a standard one
    // To make it easy for the download link, we could use a fixed name like 'resume.pdf'
    // but the user might want to keep the original name.
    // Let's use 'resume.pdf' for consistency with previous tasks.
    const fileName = "resume.pdf";

    const { error } = await supabase.storage
      .from("resume")
      .upload(fileName, file, { 
        upsert: true,
        contentType: 'application/pdf'
      });

    if (error) {
      alert("Error uploading CV: " + error.message);
    } else {
      alert("CV uploaded successfully!");
      fetchCV();
      setFile(null);
    }
    setUploading(false);
  };

  const handleDelete = async () => {
    if (!cvFile) return;
    if (!confirm("Are you sure you want to delete the current CV?")) return;

    setUploading(true);
    const { error } = await supabase.storage.from("resume").remove([cvFile.name]);

    if (error) {
      alert("Error deleting CV: " + error.message);
    } else {
      alert("CV deleted successfully!");
      setCvFile(null);
    }
    setUploading(false);
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(2) + " KB";
    return (kb / 1024).toFixed(2) + " MB";
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-[#8001ff]" size={40} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">CV Management</h1>
        <p className="text-zinc-400">Upload and manage your professional resume available for visitors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-3xl backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-[#8001ff]" size={20} />
              Current Status
            </h2>

            {cvFile ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl group hover:border-[#8001ff]/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#8001ff]/10 flex items-center justify-center text-[#8001ff] group-hover:scale-110 transition-transform">
                      <FileText size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-[#9832ff] transition-colors">{cvFile.name}</h3>
                      <p className="text-sm text-zinc-400">{formatSize(cvFile.size)} • PDF Document</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <a 
                      href={cvFile.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-zinc-800 hover:bg-[#8001ff] text-zinc-300 hover:text-white rounded-xl transition-all shadow-lg"
                      title="Download CV"
                    >
                      <Download size={20} />
                    </a>
                    <button 
                      onClick={handleDelete}
                      disabled={uploading}
                      className="p-3 bg-zinc-800 hover:bg-red-500/20 text-zinc-300 hover:text-red-500 rounded-xl transition-all shadow-lg disabled:opacity-50"
                      title="Delete CV"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-5 bg-[#8001ff]/5 border border-[#8001ff]/10 rounded-2xl text-zinc-300 text-sm">
                  <AlertCircle size={20} className="text-[#8001ff] shrink-0" />
                  <p>
                    Visitors can download this file from your portfolio about section. 
                    Adding a new file will automatically replace the existing <span className="text-white font-mono">resume.pdf</span>.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                <div className="w-20 h-20 rounded-3xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-6 text-zinc-600">
                  <FileText size={40} />
                </div>
                <h3 className="font-bold text-2xl mb-2 text-white">No CV Found</h3>
                <p className="text-zinc-500 max-w-xs mx-auto mb-8">
                  Upload your professional resume so potential employers can download it directly from your site.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-3xl backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Upload className="text-[#8001ff]" size={20} />
              {cvFile ? "Update CV" : "Upload New"}
            </h2>

            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={uploading}
                  />
                  <div className={`
                    flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-2xl transition-all
                    ${file 
                      ? "border-[#8001ff] bg-[#8001ff]/5" 
                      : "border-white/10 bg-zinc-800/30 group-hover:border-white/20 group-hover:bg-zinc-800/50"}
                  `}>
                    <div className={`p-4 rounded-xl ${file ? "bg-[#8001ff] text-white" : "bg-zinc-700 text-zinc-400"}`}>
                      <Upload size={24} />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm text-zinc-200">
                        {file ? file.name : "Click or drag to upload"}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">PDF file only (Max 5MB)</p>
                    </div>
                  </div>
                </div>

                {file && (
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs text-zinc-400">File size: {formatSize(file.size)}</span>
                    <button 
                      type="button" 
                      onClick={() => setFile(null)}
                      className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!file || uploading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#8001ff] hover:bg-[#9832ff] text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-[#8001ff]/20 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {uploading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Upload size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                )}
                {cvFile ? "Replace Existing CV" : "Upload Resume"}
              </button>
            </form>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-3xl">
            <h4 className="text-amber-500 font-bold mb-2 flex items-center gap-2 text-sm">
              <AlertCircle size={16} />
              Important Note
            </h4>
            <p className="text-xs text-amber-500/80 leading-relaxed">
              For the best experience, please upload your CV in <b>PDF format</b>. This ensures that the formatting remains consistent across all devices and browsers when visitors view or print it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
