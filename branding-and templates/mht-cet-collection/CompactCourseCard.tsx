import React from 'react';
import { Users, Clock } from 'lucide-react';

export default function CompactCourseCard() {
  return (
    <div className="relative flex w-[400px] flex-col overflow-hidden rounded-2xl bg-[#0f172a] text-white shadow-xl border border-slate-800 transition-all hover:border-indigo-500/50 hover:-translate-y-1 hover:shadow-indigo-500/20 cursor-pointer">
      
      {/* Top Image Area */}
      <div className="relative h-[200px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-screen" style={{ backgroundImage: "url('/branding/bg-abstract-square.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
        
        <div className="absolute bottom-4 left-4 rounded bg-indigo-600 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">
          MHT CET 2026
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col p-5">
        <h3 className="text-xl font-bold mb-2">Complete Counseling Package</h3>
        <p className="text-sm text-slate-400 line-clamp-2 mb-4">
          Everything you need for Maharashtra state engineering admissions. Choice filling, document verification & expert mentorship.
        </p>

        {/* Meta Stats */}
        <div className="flex items-center gap-4 border-t border-slate-800 pt-4 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Users className="h-3.5 w-3.5 text-indigo-400" />
            <span>5.2k Enrolled</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
             <Clock className="h-3.5 w-3.5 text-yellow-400" />
             <span>Seats filling fast</span>
          </div>
        </div>
      </div>

    </div>
  );
}
