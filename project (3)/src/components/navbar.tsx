
"use client";

import Link from "next/link";
import { ShieldCheck, UserCircle, LayoutDashboard } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <ShieldCheck size={28} />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-primary leading-none">SmartVote AI</span>
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Face recognition System</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary transition-colors">
              <LayoutDashboard size={18} />
              Admin
            </Link>
            <Link href="/login" className="flex items-center gap-2 text-sm font-bold px-6 py-2.5 rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95">
              <UserCircle size={20} />
              Voter Booth
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
