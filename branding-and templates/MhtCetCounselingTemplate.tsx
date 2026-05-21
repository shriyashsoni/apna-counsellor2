import React from 'react';
import Image from 'next/image';
import { CheckCircle, Award, Target, BookOpen, Star } from 'lucide-react';

export default function MhtCetCounselingTemplate() {
  return (
    <div className="relative flex min-h-[600px] w-full max-w-[1200px] flex-col items-center justify-center overflow-hidden rounded-3xl bg-[#0B0F19] text-white shadow-2xl p-8 md:p-16 border border-white/10">
      
      {/* Background Layer: Generated Dark Abstract Tech Background */}
      <div className="absolute inset-0 z-0">
        {/* Note: This requires copying bg-abstract-dark.png into the public folder for Next.js Image component to work natively, or importing it directly */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
          style={{ backgroundImage: "url('/branding/bg-abstract-dark.png')" }} 
        />
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(11,15,25,1)_80%)]" />
      </div>

      <div className="relative z-10 flex w-full flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left Side: Content & Branding */}
        <div className="flex w-full flex-col md:w-1/2">
          
          {/* Header & Logos */}
          <div className="flex items-center gap-6 mb-8">
            <div className="flex flex-col">
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-400">
                Official Counseling Program
              </span>
              <h2 className="mt-2 flex items-center gap-3 text-2xl font-black text-white">
                {/* Apna Counsellor Logo Placeholder (Replace with actual SVG/Image) */}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                  <Star className="h-5 w-5 text-white" />
                </div>
                Apna Counsellor
              </h2>
            </div>
            
            <div className="h-12 w-[1px] bg-white/20"></div>

            {/* MHT CET / Govt of Maharashtra Logo Scraped from Wikimedia */}
            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl backdrop-blur-sm border border-white/10">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/d/d4/Emblem_of_Maharashtra.svg" 
                alt="Maharashtra State Logo" 
                className="h-10 w-10 object-contain drop-shadow-md"
              />
              <span className="text-sm font-bold leading-tight">MHT CET<br/>2026</span>
            </div>
          </div>

          {/* Title Area */}
          <div className="mb-10">
            <h1 className="text-5xl font-extrabold leading-[1.1] md:text-6xl lg:text-[72px]">
              Master <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                CAP Rounds
              </span>
            </h1>
            <p className="mt-6 text-lg font-medium text-slate-300 md:text-xl max-w-[450px]">
              The most advanced choice-filling AI and expert mentorship for Maharashtra Engineering & Pharmacy Admissions.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="rounded-full bg-white px-8 py-4 font-bold text-[#0B0F19] transition-transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Enroll Now
            </button>
            <button className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 font-bold text-white backdrop-blur-md transition-colors hover:bg-white/10">
              <Target className="h-5 w-5" />
              View Syllabus
            </button>
          </div>
        </div>

        {/* Right Side: Features List & Trust Badges */}
        <div className="flex w-full flex-col gap-4 md:w-5/12">
          
          {/* Glassmorphic Feature Cards */}
          {[
            { icon: <Award className="h-6 w-6 text-yellow-400" />, title: "Precision Choice Filling", desc: "AI-generated preference list based on historical cutoff data" },
            { icon: <CheckCircle className="h-6 w-6 text-green-400" />, title: "Document Verification", desc: "Expert check for all caste & category certificates before upload" },
            { icon: <BookOpen className="h-6 w-6 text-blue-400" />, title: "College Comparison", desc: "Compare placements, fees, and location for top CET colleges" }
          ].map((feature, idx) => (
            <div 
              key={idx} 
              className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-1 shadow-2xl"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 shadow-inner">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="mt-1 text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}

          {/* Trust Banner at bottom of right col */}
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-4 border border-indigo-500/30">
             <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                 <div key={i} className={`h-10 w-10 rounded-full border-2 border-[#0B0F19] bg-slate-700 bg-cover bg-center`} style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i+10})` }} />
               ))}
             </div>
             <div className="text-right">
               <div className="flex items-center justify-end text-yellow-400 text-sm">
                 <Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" />
               </div>
               <p className="text-xs font-bold text-indigo-200 mt-1">Trusted by 50K+ Students</p>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
