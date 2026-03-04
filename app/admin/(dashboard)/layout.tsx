/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  Layers, 
  Home,
  LogOut,
  Wrench,
  GraduationCap,
  Github,
  FileText
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    } else {
      setAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  if (!authenticated) return null;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col pt-8 bg-black/40 backdrop-blur-md">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8001ff] to-[#9832ff] flex items-center justify-center font-bold">
            A
          </div>
          <span className="font-heading font-bold text-xl tracking-tight">Admin Panel</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SidebarLink href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarLink href="/admin/hero" icon={<Home size={20} />} label="Hero Section" />
          <SidebarLink href="/admin/about" icon={<User size={20} />} label="About Profile" />
          <SidebarLink href="/admin/skills" icon={<Wrench size={20} />} label="Skills" />
          <SidebarLink href="/admin/education" icon={<GraduationCap size={20} />} label="Education" />
          <SidebarLink href="/admin/github" icon={<Github size={20} />} label="GitHub Activity" />
          <SidebarLink href="/admin/experience" icon={<Briefcase size={20} />} label="Experience" />
          <SidebarLink href="/admin/projects" icon={<Layers size={20} />} label="Projects" />
          <SidebarLink href="/admin/cv" icon={<FileText size={20} />} label="CV Management" />
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <Home size={18} />
            <span className="text-sm">View Website</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-400/80 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative" data-lenis-prevent>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8001ff]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
        isActive 
          ? "bg-[#8001ff]/10 text-white border border-[#8001ff]/20" 
          : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
      }`}
    >
      <span className={`${isActive ? "text-[#9832ff]" : "group-hover:text-[#9832ff]"} transition-colors`}>{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
