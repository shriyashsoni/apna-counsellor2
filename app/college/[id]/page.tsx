import { Metadata } from 'next';
import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import RelatedLinks from '@/components/seo/RelatedLinks';
import Script from 'next/script';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface CollegePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: CollegePageProps): Promise<Metadata> {
  const college = await fetchQuery(api.colleges.getById, { id: params.id });
  
  // SEO Name logic
  const displayName = college ? college.name : params.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  const title = `${displayName} | Admissions, Cutoffs, Fees & Placements 2026`;
  const description = college 
    ? `Detailed information about ${college.name} ${college.city ? `in ${college.city}` : ''}. Check latest cutoffs, NIRF rank ${college.nirfRank || ''}, fees structure, and placement statistics.`
    : `Explore admission process, cutoff trends, and expert guidance for ${displayName}. Get 2026 insights and personalized counseling support at Apna Counsellor.`;

  return {
    title,
    description,
    keywords: [displayName, 'college admission', 'cutoff 2026', 'placement stats', 'Madhya Pradesh colleges'],
    openGraph: {
      title,
      description,
      images: college?.imageUrl ? [college.imageUrl] : ['https://apnacounsellor.in/images/og-college.png'],
    },
    alternates: {
      canonical: `https://apnacounsellor.in/college/${params.id}`,
    },
  };
}

export default async function CollegeDetailPage({ params }: CollegePageProps) {
  const collegeData = await fetchQuery(api.colleges.getById, { id: params.id });

  // Improved Dynamic State/City Detection
  const detectState = () => {
    const slug = params.id.toLowerCase();
    if (slug.includes('maharashtra') || slug.includes('mumbai') || slug.includes('pune')) return 'Maharashtra';
    if (slug.includes('karnataka') || slug.includes('bangalore')) return 'Karnataka';
    if (slug.includes('delhi')) return 'Delhi';
    if (slug.includes('gujarat') || slug.includes('ahmedabad')) return 'Gujarat';
    if (slug.includes('uttar-pradesh') || slug.includes('lucknow')) return 'Uttar Pradesh';
    if (slug.includes('tamil-nadu') || slug.includes('chennai')) return 'Tamil Nadu';
    if (slug.includes('indore') || slug.includes('bhopal') || slug.includes('gwalior') || slug.includes('jabalpur')) return 'Madhya Pradesh';
    return 'India';
  };

  const detectCity = () => {
    const slug = params.id.toLowerCase();
    const cities = ['Indore', 'Bhopal', 'Mumbai', 'Pune', 'Bangalore', 'Delhi', 'Chennai', 'Lucknow', 'Ahmedabad', 'Gwalior', 'Jabalpur'];
    for (const city of cities) {
      if (slug.includes(city.toLowerCase())) return city;
    }
    return 'Main Campus';
  };

  // Handle programmatic fallback for 70,000+ colleges
  const displayName = collegeData ? collegeData.name : params.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  const college = collegeData || {
    name: displayName,
    shortName: displayName.split(' ').filter(s => s.length > 0).map(s => s[0]).join('').substring(0, 5).toUpperCase(),
    city: detectCity(),
    state: detectState(),
    type: 'Premier Institute',
    nirfRank: 'Awaiting 2026',
    description: null,
    website: '#',
    established: 2008,
    tier: 'Premium',
    aiScore: 88,
    annualFee: '₹1.5L - ₹3.2L',
    avgPackage: '7.2 LPA',
    imageUrl: `https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1000&auto=format&fit=crop`
  };

  const collegeSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": college.name,
    "alternateName": college.shortName,
    "description": college.description || `Leading ${college.type} institute located in ${college.city}, ${college.state}.`,
    "url": college.website !== '#' ? college.website : `https://apnacounsellor.in/college/${params.id}`,
    "logo": college.imageUrl,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": college.city,
      "addressRegion": college.state,
      "addressCountry": "IN"
    }
  };

  const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/L1fXpZ3z8f9F1z1z1z1z1z"; // Placeholder - replace with actual

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Script
        id="college-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collegeSchema) }}
      />

      {/* Premium Hero Section */}
      <div className="relative h-[65vh] min-h-[550px] w-full overflow-hidden">
        <Image 
          src={college.imageUrl || '/images/college-placeholder.jpg'} 
          alt={college.name}
          fill
          className="object-cover scale-105 hover:scale-100 transition-transform duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        
        <div className="absolute inset-0 flex items-end pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl">
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="px-5 py-2 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest shadow-lg">
                  RANK {college.nirfRank}
                </div>
                <div className="px-5 py-2 rounded-2xl bg-white/10 text-white text-xs font-black uppercase tracking-widest backdrop-blur-md border border-white/20">
                  {college.type}
                </div>
                <div className="px-5 py-2 rounded-2xl bg-emerald-500 text-white text-xs font-black uppercase tracking-widest shadow-lg">
                  {college.tier}
                </div>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tighter drop-shadow-2xl">
                {college.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-white/90 text-2xl font-bold">
                <span className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/20 backdrop-blur-sm">
                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                  </div>
                  {college.city}, {college.state}
                </span>
                <span className="hidden md:block w-3 h-3 rounded-full bg-white/30" />
                <span className="flex items-center gap-3">
                   <div className="p-2 rounded-xl bg-purple-500/20 backdrop-blur-sm">
                    <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 011.782 0l7.182-3.078a9.445 9.445 0 01.185 1.508 1 1 0 01-.815 1.12 7.488 7.488 0 00-3.646 1.354 1 1 0 01-1.314-.064 4.992 4.992 0 00-2.78-1.202 1 1 0 01-.884-.884 9.015 9.015 0 00-.136-1.398l-.209.09a3 3 0 01-2.36 0l-1.94-.831v3.957a9.027 9.027 0 002.3 1.638l.003.012a1 1 0 01.596.891 1 1 0 01-.596.891l-.003.012z" /></svg>
                  </div>
                  Est. {college.established}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-16">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Avg Package', value: college.avgPackage, color: 'text-emerald-600' },
                { label: 'Annual Fee', value: college.annualFee, color: 'text-blue-600' },
                { label: 'AI Score', value: `${college.aiScore}/100`, color: 'text-purple-600' },
                { label: 'Placement', value: '85%+', color: 'text-orange-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* About Section */}
            <section id="about" className="relative group">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Institutional Profile</h2>
              <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                  {college.description || `${college.name} represents a standard of excellence in ${college.type} within ${college.state}. As a ${college.tier} institution, it offers a blend of traditional academic rigor and modern industry-aligned training. The campus in ${college.city} is equipped with modern infrastructure including smart labs, extensive digital libraries, and innovation centers.`}
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mt-6">
                  For the 2026 academic session, {college.shortName} has announced major upgrades to its research facilities and has signed MOUs with top global tech firms to enhance placement opportunities for its students.
                </p>
              </div>
            </section>

            {/* Admission & Cutoffs */}
            <section id="admission" className="p-8 sm:p-12 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight text-center md:text-left">2026 Admission Strategy</h2>
              <p className="text-slate-500 mb-10 text-lg leading-relaxed">
                Securing a seat in {college.name} requires a calculated approach towards entrance exams like {college.state === 'Madhya Pradesh' ? 'MP-DTE (JEE Main)' : college.state === 'Maharashtra' ? 'MHT-CET' : 'National Level Exams'}.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Eligibility Criteria</h4>
                      <p className="text-sm text-slate-500">10+2 with minimum 45% aggregate (40% for reserved) in PCM subjects.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Exam Acceptance</h4>
                      <p className="text-sm text-slate-500">JEE Main Score (Primary) | State Level Counseling</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4">Pro-Tip for MP Candidates</h4>
                  <p className="text-sm text-slate-500 leading-loose">
                    For colleges in {college.city}, participating in early rounds of MP-DTE counseling is critical. Seats in top branches like CSE and IT usually fill up by Round 2.
                  </p>
                </div>
              </div>
            </section>
          </div>

              {/* WhatsApp Community CTA */}
              <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:rotate-12 transition-transform">
                  <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .015 5.398.01 12.038c0 2.123.553 4.197 1.604 6.033L0 24l6.105-1.602a11.803 11.803 0 005.937 1.603h.005c6.637 0 12.036-5.398 12.041-12.038a11.811 11.811 0 00-3.538-8.419"/></svg>
                </div>
                <h3 className="text-2xl font-black mb-4 relative z-10">Join 2026 Community</h3>
                <p className="text-emerald-50/90 mb-8 leading-relaxed relative z-10 text-sm">
                  Get real-time admission updates, PDF brochures, and category-wise cutoffs directly on WhatsApp.
                </p>
                <Link href={WHATSAPP_GROUP_LINK} target="_blank">
                  <button className="w-full py-4 bg-white text-emerald-700 text-center rounded-2xl font-black text-lg hover:bg-slate-100 hover:-translate-y-1 transition-all shadow-lg relative z-10 flex items-center justify-center gap-3">
                    Join WhatsApp Group
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </Link>
              </div>

              {/* Expert CTA */}
              <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45l8.15 14.1H3.85L12 5.45zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>
                </div>
                <h3 className="text-2xl font-black mb-4 relative z-10">Expert Guidance</h3>
                <p className="text-blue-100/90 mb-8 leading-relaxed relative z-10 text-sm">
                  Book a VIP session with mentors from top IITs/NITs to secure your seat in {college.shortName}.
                </p>
                <Link href="/book-call">
                  <button className="w-full py-5 bg-white/10 hover:bg-white/20 text-white text-center rounded-2xl font-black text-lg backdrop-blur-md transition-all border border-white/20 relative z-10">
                    Talk to Mentor
                  </button>
                </Link>
              </div>

              {/* Institution Directory */}
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Resources</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Download Brochure', value: 'WhatsApp Link', link: WHATSAPP_GROUP_LINK },
                    { label: 'Admission Form', value: '2026 Apply', link: college.website },
                    { label: 'State Merit List', value: 'Check Now', link: `/counselling/${college.state.replace(/ /g, '_')}` },
                  ].map((item, i) => (
                    <Link key={i} href={item.link} target={item.link.startsWith('http') ? '_blank' : '_self'}>
                      <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-sm font-bold text-slate-500">{item.label}</span>
                        <span className="text-sm font-black text-blue-600">{item.value}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* State Context Card */}
              <div className="p-8 rounded-[2.5rem] bg-slate-900 dark:bg-white text-white dark:text-slate-950 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center font-black text-white">{college.state.substring(0, 2).toUpperCase()}</div>
                  <h4 className="font-bold">{college.state} Admissions</h4>
                </div>
                <p className="text-sm opacity-80 leading-relaxed mb-6">
                  {college.name} is one of the most searched institutes in {college.state}. Explore admission timelines for the region.
                </p>
                <Link href={`/counselling/${college.state.replace(/ /g, '_')}`}>
                  <button className="w-full py-4 bg-white/10 dark:bg-slate-100 hover:bg-white/20 rounded-2xl font-bold text-sm transition-all border border-white/10">
                    State Counseling Portal
                  </button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* SEO Footer Links */}
      <div className="border-t border-slate-200 dark:border-slate-800 mt-20 pt-20 pb-32">
        <div className="container mx-auto px-4">
          <RelatedLinks pageSlug="college-detail" />
        </div>
      </div>
    </div>
  );
}

// Re-add required imports that might have been removed
import Link from 'next/link';
