import React from 'react';
import { Target, Star } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="relative flex w-full max-w-[1400px] h-[500px] flex-col justify-center overflow-hidden rounded-[32px] bg-[#0B0F19] text-white shadow-2xl p-12 border border-white/10">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen" style={{ backgroundImage: "url('/branding/bg-abstract-dark.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent" />
      </div>

      <div className="relative z-10 flex w-full max-w-3xl flex-col">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-indigo-400">
             MHT CET 2026
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
             <Star className="h-4 w-4 text-yellow-400" fill="currentColor"/>
             <span className="text-sm font-bold text-slate-200">Apna Counsellor</span>
          </div>
        </div>

        <h1 className="text-5xl font-extrabold leading-[1.1] md:text-6xl lg:text-[72px] mb-6">
          Dominate <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            CAP Rounds
          </span>
        </h1>
        
        <p className="text-xl font-medium text-slate-300 max-w-[500px] mb-8">
          The ultimate AI-powered strategy and 1-on-1 mentorship to secure your seat in VJTI, COEP, and SPIT.
        </p>

        <div className="flex gap-4">
          <button className="rounded-full bg-white px-8 py-4 font-bold text-[#0B0F19] transition-transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            Join the Masterclass
          </button>
        </div>
      </div>
    </div>
  );
}
