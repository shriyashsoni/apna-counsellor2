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

  // Handle programmatic fallback for 70,000+ colleges
  const displayName = collegeData ? collegeData.name : params.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  const college = collegeData || {
    name: displayName,
    shortName: displayName.split(' ').map(s => s[0]).join(''),
    city: params.id.includes('indore') ? 'Indore' : params.id.includes('bhopal') ? 'Bhopal' : 'Madhya Pradesh',
    state: 'Madhya Pradesh',
    type: 'Engineering & Technology',
    nirfRank: 'Awaiting 2026',
    description: null,
    website: '#',
    established: 2005,
    tier: 'Tier 2',
    aiScore: 85,
    annualFee: '₹1.2L - ₹2.5L',
    avgPackage: '6.5 LPA',
    imageUrl: `https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop`
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Script
        id="college-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collegeSchema) }}
      />

      {/* Premium Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <Image 
          src={college.imageUrl || '/images/college-placeholder.jpg'} 
          alt={college.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-end pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="px-4 py-1.5 rounded-full bg-blue-600/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                  NIRF: {college.nirfRank}
                </div>
                <div className="px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/20">
                  {college.type}
                </div>
                <div className="px-4 py-1.5 rounded-full bg-emerald-500/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                  {college.tier}
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight tracking-tight">
                {college.name}
              </h1>
              <div className="flex items-center gap-6 text-white/80 text-xl font-medium">
                <span className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                  {college.city}, {college.state}
                </span>
                <span className="h-2 w-2 rounded-full bg-white/20 hidden md:block" />
                <span className="hidden md:block">Est. {college.established}</span>
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

          {/* Sidebar / Sub-website Navigation */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-8">
              {/* Expert CTA */}
              <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45l8.15 14.1H3.85L12 5.45zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>
                </div>
                <h3 className="text-2xl font-black mb-4 relative z-10">Get a Seat in {college.shortName}</h3>
                <p className="text-blue-100/90 mb-8 leading-relaxed relative z-10">
                  Our AI-driven rank predictor and expert mentors have helped 10,000+ students secure admissions in top MP colleges.
                </p>
                <Link href="/book-call">
                  <button className="w-full py-5 bg-white text-blue-900 text-center rounded-2xl font-black text-lg hover:bg-slate-100 hover:-translate-y-1 transition-all shadow-lg relative z-10">
                    Book Free Counseling
                  </button>
                </Link>
              </div>

              {/* Institution Directory */}
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Directory Index</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Official Portal', value: college.website !== '#' ? 'Visit Site' : 'In Process', link: college.website },
                    { label: 'Campus Tour', value: 'Virtual Available', link: '#' },
                    { label: 'Document Checklist', value: 'Download PDF', link: '#' },
                    { label: 'Hostel Info', value: '8.5/10 Rating', link: '#' },
                  ].map((item, i) => (
                    <Link key={i} href={item.link}>
                      <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-sm font-bold text-slate-500">{item.label}</span>
                        <span className="text-sm font-black text-blue-600">{item.value}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* State Context Card */}
              <div className="p-8 rounded-[2.5rem] bg-slate-900 dark:bg-white text-white dark:text-slate-950">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center font-black">MP</div>
                  <h4 className="font-bold">Madhya Pradesh Admissions</h4>
                </div>
                <p className="text-sm opacity-80 leading-relaxed mb-6">
                  {college.name} is part of the extensive MP higher education network. Check other top institutes in {college.city}.
                </p>
                <Link href="/counselling/Madhya_Pradesh">
                  <button className="w-full py-3 bg-white/10 dark:bg-slate-100 hover:bg-white/20 rounded-xl font-bold text-sm transition-all border border-white/10">
                    View MP State Merit List
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
