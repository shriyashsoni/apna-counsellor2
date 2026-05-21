import React from 'react';
import { Target, Trophy } from 'lucide-react';

export default function InstagramSquarePost() {
  return (
    <div className="relative flex w-[1080px] h-[1080px] flex-col items-center justify-center overflow-hidden bg-[#0B0F19] text-white p-16 text-center" style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }}>
      {/* Note: the transform scale is for rendering in browser, remove if exporting */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-screen" style={{ backgroundImage: "url('/branding/bg-abstract-square.png')" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(11,15,25,0.9)_100%)]" />
      </div>

      <div className="relative z-10 flex w-full flex-col items-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl mb-8">
           <Trophy className="h-12 w-12 text-white" />
        </div>
        
        <div className="text-2xl font-black uppercase tracking-[0.3em] text-indigo-400 mb-6">
          Apna Counsellor Presents
        </div>

        <h1 className="text-[120px] font-black leading-[1.1] mb-8">
          MHT CET <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            2026
          </span>
        </h1>
        
        <p className="text-[40px] font-medium text-slate-300 max-w-[800px] mb-16 leading-relaxed">
          Unlock the ultimate choice-filling algorithm designed by IIT & VJTI alumni.
        </p>

        <div className="flex flex-col gap-6 w-full max-w-2xl">
          <div className="flex items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400">
               <Target className="h-8 w-8" />
             </div>
             <div className="text-left">
               <h3 className="text-3xl font-bold">100% Data-Driven</h3>
               <p className="text-xl text-slate-400 mt-2">Historical cutoffs mapped to your rank.</p>
             </div>
          </div>
        </div>

        <div className="absolute bottom-16 text-2xl font-bold text-slate-500 tracking-widest">
          WWW.APNACOUNSELLOR.IN
        </div>
      </div>
    </div>
  );
}
