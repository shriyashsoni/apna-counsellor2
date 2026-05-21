import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function SidebarWidgetBanner() {
  return (
    <div className="relative flex w-[300px] h-[600px] flex-col overflow-hidden rounded-2xl bg-[#0B0F19] text-white p-6 shadow-xl border border-white/10 group cursor-pointer">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/branding/bg-abstract-vertical.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/80 to-transparent" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-end">
        <div className="mb-auto mt-4 inline-block rounded border border-indigo-500/30 bg-indigo-500/20 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-300 backdrop-blur-md self-start">
          Featured Course
        </div>

        <h3 className="text-3xl font-black leading-tight mb-3">
          MHT CET <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            CAP Mastery
          </span>
        </h3>
        
        <p className="text-sm font-medium text-slate-300 mb-6 line-clamp-3">
          Get 100% personalized preference lists based on your precise percentile and category.
        </p>

        <button className="flex w-full items-center justify-between rounded-xl bg-white px-5 py-3 font-bold text-[#0B0F19] transition-colors group-hover:bg-slate-200">
          <span>Start Now</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
