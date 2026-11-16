"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, KeyRound, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { sendLoginCode, verifyLoginCode } from "@/app/actions/admin-auth";

export default function AdminLogin() {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("sahidofficial.dev@gmail.com");
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await sendLoginCode(email);
      if (res.success) {
        setSuccessMsg(res.message || "Verification code sent to your email.");
        setStep("code");
      } else {
        setError(res.error || "Failed to send code.");
      }
    } catch {
      setError("Failed to send verification code. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await verifyLoginCode(code);
      if (res.success) {
        localStorage.setItem("admin_auth", "true");
        router.push("/admin");
      } else {
        setError(res.error || "Invalid or expired code.");
        setLoading(false);
      }
    } catch {
      setError("An error occurred during verification.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8001ff]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#9832ff]/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md bg-zinc-900/40 border border-white/5 p-8 sm:p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8001ff] to-[#9832ff] flex items-center justify-center mb-6 shadow-lg shadow-[#8001ff]/20">
            {step === "email" ? (
              <Mail className="text-white" size={30} />
            ) : (
              <ShieldCheck className="text-white" size={30} />
            )}
          </div>
          <h1 className="text-3xl font-bold font-heading mb-2">
            {step === "email" ? "Admin Access" : "Verification Code"}
          </h1>
          <p className="text-zinc-400 text-sm">
            {step === "email"
              ? "Enter your email to receive a one-time verification code."
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm py-3 px-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 bg-[#8001ff]/15 border border-[#8001ff]/30 text-purple-300 text-sm py-3 px-4 rounded-xl text-center flex items-center justify-center gap-2">
            <CheckCircle2 size={16} className="text-[#8001ff] shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: ENTER EMAIL */}
        {step === "email" && (
          <form onSubmit={handleSendCode} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 ml-1">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@email.com"
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-[#8001ff]/50 focus:border-[#8001ff]/50 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#8001ff] hover:bg-[#9832ff] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#8001ff]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Send Login Code
                  <span>→</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: ENTER CODE */}
        {step === "code" && (
          <form onSubmit={handleVerifyCode} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 ml-1">6-Digit Code</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  autoFocus
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white text-center font-mono tracking-widest text-xl focus:outline-none focus:ring-2 focus:ring-[#8001ff]/50 focus:border-[#8001ff]/50 transition-all font-bold"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full py-3.5 bg-[#8001ff] hover:bg-[#9832ff] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#8001ff]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Verify & Enter Dashboard"
              )}
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleSendCode}
                disabled={loading}
                className="text-zinc-400 hover:text-purple-300 text-sm transition-colors cursor-pointer"
              >
                Resend code
              </button>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setSuccessMsg("");
                  setCode("");
                  setStep("email");
                }}
                className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors cursor-pointer"
              >
                <ArrowLeft size={15} />
                Change Email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
