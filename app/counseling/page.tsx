import { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, Briefcase, Heart, Stethoscope, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Counseling Guides 2026 | Apna Counsellor',
  description: 'Explore our comprehensive directory of 200+ counseling guides for engineering, medical, and management in India.',
  openGraph: {
    title: 'Apna Counsellor - Global Counseling Directory',
    description: 'Every major counseling portal in India explained with data-driven insights.',
    images: ['/images/counseling-preview-v3.png']
  }
};

const engineeringLinks = [
  { name: 'JoSAA Counseling', slug: 'josaa-counseling' },
  { name: 'CSAB Special Round', slug: 'csab-counseling' },
  { name: 'MHT-CET Counseling', slug: 'mht-cet-counseling' },
  { name: 'KCET Karnataka', slug: 'kcet-counseling' },
  { name: 'COMEDK UGET', slug: 'comedk-counseling' },
  { name: 'WBJEE West Bengal', slug: 'wbjee-counseling' },
  { name: 'TNEA Tamil Nadu', slug: 'tnea-counseling' },
  { name: 'GUJCET Gujarat', slug: 'gujcet-counseling' },
  { name: 'KEAM Kerala', slug: 'keam-counseling' },
  { name: 'TS EAMCET Telangana', slug: 'tseamcet-counseling' },
  { name: 'AP EAMCET Andhra', slug: 'apeamcet-counseling' },
  { name: 'MPDTE MP Engineering', slug: 'mpdte-counseling' },
];

const medicalLinks = [
  { name: 'MCC AIQ Counseling', slug: 'neet-mcc-counseling' },
  { name: 'Maharashtra NEET', slug: 'maharashtra-neet-counseling' },
  { name: 'Karnataka NEET', slug: 'karnataka-neet-counseling' },
  { name: 'Tamil Nadu NEET', slug: 'tamilnadu-neet-counseling' },
  { name: 'Uttar Pradesh NEET', slug: 'up-neet-counseling' },
  { name: 'Rajasthan NEET', slug: 'rajasthan-neet-counseling' },
  { name: 'MP NEET', slug: 'mp-neet-counseling' },
];

const managementLinks = [
  { name: 'IIM CAT Process', slug: 'cat-counseling' },
  { name: 'XAT XLRI', slug: 'xat-counseling' },
  { name: 'SNAP Symbiosis', slug: 'snap-counseling' },
  { name: 'NMAT NMIMS', slug: 'nmat-counseling' },
  { name: 'MAH MBA CET', slug: 'mah-mba-cet-counseling' },
];

export default function CounselingDirectoryPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 text-purple-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-purple-100">
             <GraduationCap className="h-4 w-4" /> Global Admission Hub
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-950 mb-8 tracking-tighter leading-[0.9]">
            Admission <span className="text-purple-600">Portals.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium">
            200+ counseling guides across India, simplified and explained.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Engineering */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
                 <Briefcase className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Engineering</h2>
            </div>
            <div className="space-y-3">
              {engineeringLinks.map((link) => (
                <Link 
                  key={link.slug} 
                  href={`/counseling/${link.slug}`}
                  className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl hover:border-purple-600 hover:shadow-xl transition-all group"
                >
                  <h3 className="font-bold text-slate-800 group-hover:text-purple-600">{link.name}</h3>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </section>

          {/* Medical */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                 <Stethoscope className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Medical</h2>
            </div>
            <div className="space-y-3">
              {medicalLinks.map((link) => (
                <Link 
                  key={link.slug} 
                  href={`/counseling/${link.slug}`}
                  className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl hover:border-emerald-600 hover:shadow-xl transition-all group"
                >
                  <h3 className="font-bold text-slate-800 group-hover:text-emerald-600">{link.name}</h3>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </section>

          {/* Management */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                 <GraduationCap className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">B-Schools</h2>
            </div>
            <div className="space-y-3">
              {managementLinks.map((link) => (
                <Link 
                  key={link.slug} 
                  href={`/counseling/${link.slug}`}
                  className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl hover:border-blue-600 hover:shadow-xl transition-all group"
                >
                  <h3 className="font-bold text-slate-800 group-hover:text-blue-600">{link.name}</h3>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Premium Banner */}
        <section className="mt-32">
          <div className="bg-slate-950 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full -mt-48 -mr-48 group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">Need a <span className="text-purple-500">Master Strategy?</span></h2>
              <p className="text-xl text-slate-400 mb-12 font-medium leading-relaxed">
                Get personalized choice-filling lists, document verification, and unlimited counseling calls for any of the 200+ exams we track.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <Link href="/book-call">
                    <button className="bg-purple-600 px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-purple-700 transition-all shadow-2xl shadow-purple-900/20 active:scale-95">
                      Book Premium Support
                    </button>
                 </Link>
                 <Link href="https://wa.link/cld3hu">
                    <button className="bg-white/10 backdrop-blur-md border border-white/10 px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-white/20 transition-all active:scale-95">
                      Chat with Expert
                    </button>
                 </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
