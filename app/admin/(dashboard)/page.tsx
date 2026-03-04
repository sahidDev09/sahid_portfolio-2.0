import React from "react";
import { 
  Eye, 
  MousePointer2, 
  MessageSquare, 
  BarChart3 
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-heading mb-2">Welcome Back, Sahid</h1>
        <p className="text-zinc-400">Here&apos;s an overview of your portfolio performance and sections.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Eye className="text-blue-400" />} 
          label="Total Views" 
          value="1,284" 
          change="+12.5%" 
        />
        <StatCard 
          icon={<MousePointer2 className="text-purple-400" />} 
          label="Project Clicks" 
          value="432" 
          change="+5.2%" 
        />
        <StatCard 
          icon={<MessageSquare className="text-green-400" />} 
          label="Inquiries" 
          value="12" 
          change="+2" 
        />
        <StatCard 
          icon={<BarChart3 className="text-orange-400" />} 
          label="Conversion" 
          value="3.2%" 
          change="+0.4%" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4">Quick Edit Sections</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
            <QuickAction label="Update Hero Content" href="/admin/hero" />
            <QuickAction label="Add New Project" href="/admin/projects" />
            <QuickAction label="Update Experience" href="/admin/experience" />
            <QuickAction label="Edit About Bio" href="/admin/about" />
            <QuickAction label="Manage Skills" href="/admin/skills" />
            <QuickAction label="Update Education" href="/admin/education" />
            <QuickAction label="GitHub Activity" href="/admin/github" />
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4">Recent Inquiries</h3>
          <div className="text-zinc-400 text-center py-10">
            No new messages yet.
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change }: { icon: React.ReactNode, label: string, value: string, change: string }) {
  return (
    <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white/5 rounded-xl">{icon}</div>
        <span className="text-zinc-400 text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold">{value}</span>
        <span className="text-green-400 text-xs font-semibold px-2 py-1 bg-green-400/10 rounded-full">{change}</span>
      </div>
    </div>
  );
}

function QuickAction({ label, href }: { label: string, href: string }) {
  return (
    <a 
      href={href} 
      className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group"
    >
      <span className="font-medium group-hover:translate-x-1 transition-transform">{label}</span>
      <BarChart3 size={18} className="text-zinc-500" />
    </a>
  );
}
