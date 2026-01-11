"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, User } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Credentials provided by the user
    const VALID_USERNAME = "sahiddev09";
    const VALID_PASSWORD = "sahid#72443";

    setTimeout(() => {
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        localStorage.setItem("admin_auth", "true");
        router.push("/admin");
      } else {
        setError("Invalid username or password");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8001ff]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#9832ff]/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md bg-zinc-900/40 border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8001ff] to-[#9832ff] flex items-center justify-center mb-6 shadow-lg shadow-[#8001ff]/20">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold font-heading mb-2">Admin Access</h1>
          <p className="text-zinc-400">Please enter your credentials to continue.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#8001ff]/50 focus:border-[#8001ff]/50 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#8001ff]/50 focus:border-[#8001ff]/50 transition-all font-medium"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm py-3 px-4 rounded-xl text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#8001ff] hover:bg-[#9832ff] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#8001ff]/20 flex items-center justify-center gap-2 group"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Sign In
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-zinc-500 text-sm">
          Forgot password? Contact support.
        </p>
      </div>
    </div>
  );
}
