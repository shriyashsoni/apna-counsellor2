import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'All Counseling Guides 2025 | Apna Counsellor',
  description: 'Explore our comprehensive directory of 200+ counseling guides for engineering, medical, management, and more in India.',
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
  { name: 'JAC Delhi', slug: 'jac-delhi-counseling' },
  { name: 'REAP Rajasthan', slug: 'reap-rajasthan-counseling' },
  { name: 'UPSEE AKTU', slug: 'upsee-aktu-counseling' },
  { name: 'OJEE Odisha', slug: 'ojee-odisha-counseling' },
];

const medicalLinks = [
  { name: 'MCC AIQ Counseling', slug: 'neet-mcc-counseling' },
  { name: 'Maharashtra NEET', slug: 'maharashtra-neet-counseling' },
  { name: 'Karnataka NEET', slug: 'karnataka-neet-counseling' },
  { name: 'Tamil Nadu NEET', slug: 'tamilnadu-neet-counseling' },
  { name: 'Uttar Pradesh NEET', slug: 'up-neet-counseling' },
  { name: 'Rajasthan NEET', slug: 'rajasthan-neet-counseling' },
  { name: 'MP NEET', slug: 'mp-neet-counseling' },
  { name: 'Gujarat NEET', slug: 'gujarat-neet-counseling' },
  { name: 'West Bengal NEET', slug: 'west-bengal-neet-counseling' },
  { name: 'Kerala NEET', slug: 'kerala-neet-counseling' },
];

const managementLinks = [
  { name: 'IIM CAT Process', slug: 'cat-counseling' },
  { name: 'XAT XLRI', slug: 'xat-counseling' },
  { name: 'SNAP Symbiosis', slug: 'snap-counseling' },
  { name: 'NMAT NMIMS', slug: 'nmat-counseling' },
  { name: 'CMAT Admissions', slug: 'cmat-counseling' },
  { name: 'MAH MBA CET', slug: 'mah-mba-cet-counseling' },
];

export default function CounselingDirectoryPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-24">
        <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tight">
          Counseling <span className="text-blue-600">Directory 2025</span>
        </h1>
        <p className="text-2xl text-slate-500 max-w-3xl mx-auto">
          Every counseling in India, mapped and explained by Apna Counsellor.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Engineering Column */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black">E</div>
            <h2 className="text-3xl font-black text-slate-900">Engineering</h2>
          </div>
          <div className="space-y-4">
            {engineeringLinks.map((link) => (
              <Link 
                key={link.slug} 
                href={`/counseling/${link.slug}`}
                className="block p-5 bg-white border border-slate-100 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all group"
              >
                <h3 className="font-bold text-slate-800 group-hover:text-blue-600">{link.name}</h3>
                <span className="text-xs text-slate-400 mt-1 block">Full Guide by Apna Counsellor</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Medical Column */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black">M</div>
            <h2 className="text-3xl font-black text-slate-900">Medical</h2>
          </div>
          <div className="space-y-4">
            {medicalLinks.map((link) => (
              <Link 
                key={link.slug} 
                href={`/counseling/${link.slug}`}
                className="block p-5 bg-white border border-slate-100 rounded-2xl hover:border-red-500 hover:shadow-xl transition-all group"
              >
                <h3 className="font-bold text-slate-800 group-hover:text-red-600">{link.name}</h3>
                <span className="text-xs text-slate-400 mt-1 block">Full Guide by Apna Counsellor</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Management Column */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white font-black">B</div>
            <h2 className="text-3xl font-black text-slate-900">B-Schools</h2>
          </div>
          <div className="space-y-4">
            {managementLinks.map((link) => (
              <Link 
                key={link.slug} 
                href={`/counseling/${link.slug}`}
                className="block p-5 bg-white border border-slate-100 rounded-2xl hover:border-green-500 hover:shadow-xl transition-all group"
              >
                <h3 className="font-bold text-slate-800 group-hover:text-green-600">{link.name}</h3>
                <span className="text-xs text-slate-400 mt-1 block">Full Guide by Apna Counsellor</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-32 text-center p-16 bg-slate-900 rounded-[4rem] text-white">
        <h2 className="text-4xl font-bold mb-6">Apna Counsellor Premium Support</h2>
        <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto">
          Get personalized choice-filling lists, document help, and unlimited counseling calls for any of the exams listed above.
        </p>
        <Link href="/contact" className="bg-blue-600 px-12 py-5 rounded-full font-black text-lg hover:bg-blue-500 transition-all inline-block shadow-2xl">
          Get Expert Help Now
        </Link>
      </div>
    </main>
  );
}
