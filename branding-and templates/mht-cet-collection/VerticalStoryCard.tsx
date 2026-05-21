import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function VerticalStoryCard() {
  return (
    <div className="relative flex w-[1080px] h-[1920px] flex-col overflow-hidden bg-[#0B0F19] text-white p-16" style={{ transform: 'scale(0.3)', transformOrigin: 'top left' }}>
      
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-screen" style={{ backgroundImage: "url('/branding/bg-abstract-vertical.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/40 via-transparent to-[#0B0F19] opacity-90" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between">
        
        {/* Top Header */}
        <div className="flex justify-between items-center w-full">
          <div className="text-4xl font-black tracking-tight text-white">ApnaCounsellor</div>
          <div className="rounded-full bg-white/10 px-8 py-3 text-2xl font-bold backdrop-blur-md border border-white/20">
            MHT CET 2026
          </div>
        </div>

        {/* Center Content */}
        <div className="flex flex-col items-center text-center mt-auto mb-auto">
          <div className="rounded-full border border-indigo-500/50 bg-indigo-500/20 px-8 py-4 text-3xl font-bold text-indigo-300 mb-12 backdrop-blur-md">
            Registrations Open
          </div>
          
          <h1 className="text-[140px] font-black leading-[0.9] tracking-tight mb-12">
            YOUR <br/>
            DREAM <br/>
            <span className="text-transparent" style={{ WebkitTextStroke: '4px #fff' }}>COLLEGE</span>
          </h1>
          
          <p className="text-4xl font-medium text-slate-300 max-w-[800px] leading-relaxed">
            Stop guessing your CAP rounds. Let AI do the heavy lifting.
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col gap-8 w-full items-center mb-16">
          <div className="flex w-full max-w-3xl items-center justify-between rounded-full bg-white p-4 pl-12 shadow-[0_0_80px_rgba(255,255,255,0.3)]">
            <span className="text-5xl font-black text-[#0B0F19]">Swipe Up to Enroll</span>
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#0B0F19]">
               <ArrowUpRight className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
