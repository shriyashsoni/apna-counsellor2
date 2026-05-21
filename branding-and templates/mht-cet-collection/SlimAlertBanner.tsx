import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function SlimAlertBanner() {
  return (
    <div className="relative flex w-full max-w-[1200px] items-center justify-between overflow-hidden rounded-full bg-gradient-to-r from-indigo-900 to-purple-900 px-6 py-3 text-white shadow-lg border border-indigo-500/30 cursor-pointer group">
      
      {/* Animated Shine Effect */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-0 -left-[100%] h-full w-[50%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-1000 group-hover:left-[100%]" />
      </div>

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <Sparkles className="h-4 w-4 text-yellow-300" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
          <span className="font-bold">MHT CET 2026 Batch is Live!</span>
          <span className="hidden md:block h-1 w-1 rounded-full bg-indigo-300"></span>
          <span className="text-sm text-indigo-200">Only 45 seats remaining for 1-on-1 mentorship.</span>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold backdrop-blur-md transition-colors group-hover:bg-white/20">
        Claim Spot <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  );
}
