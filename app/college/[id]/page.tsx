import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import RelatedLinks from '@/components/seo/RelatedLinks';
import Script from 'next/script';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface CollegePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: CollegePageProps): Promise<Metadata> {
  const supabase = await createClient();
  const { data: college } = await supabase.from('colleges').select('*').eq('college_id', params.id).single();

  if (!college) {
    return {
      title: 'College Not Found | Apna Counsellor',
      description: 'The requested college could not be found. Explore other top institutions in India at Apna Counsellor.'
    };
  }
  
  const displayName = college.name;
  
  const title = `${displayName} | Admissions, Cutoffs & Fees 2026`;
  const description = `Get complete details of ${college.name}, ${college.city}. Check latest MHT-CET/JEE cutoffs, placement stats, and campus insights for 2026 admissions.`;

  return {
    title,
    description,
    keywords: [displayName, 'college admission', 'cutoff 2026', 'placement stats', college.state || 'India'],
    openGraph: {
      title,
      description,
      type: 'website',
      images: college.image_url ? [college.image_url] : ['/images/college-preview-v1.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: college.image_url ? [college.image_url] : ['/images/college-preview-v1.png'],
    },
    alternates: {
      canonical: `https://www.apnacounsellor.in/college/${params.id}`,
    },
  };
}

export default async function CollegeDetailPage({ params }: CollegePageProps) {
  const supabase = await createClient();
  const { data: college } = await supabase.from('colleges').select('*').eq('college_id', params.id).single();

  if (!college) {
    notFound();
  }

  const WHATSAPP_GROUP_LINK = "https://www.whatsapp.com/channel/0029VabjCVD5PO11jeEupQ44";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Script
        id="college-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": college.name,
          "alternateName": college.short_name,
          "description": college.description || `Leading ${college.type} institute located in ${college.city}, ${college.state}.`,
          "url": college.website !== '#' ? college.website : `https://www.apnacounsellor.in/college/${params.id}`,
          "logo": college.image_url || `https://www.apnacounsellor.in/images/college-preview-v1.png`,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": college.city,
            "addressRegion": college.state,
            "addressCountry": "IN"
          }
        }) }}
      />

      <div className="relative h-[65vh] min-h-[550px] w-full overflow-hidden">
        <Image 
          src={college.image_url || '/images/college-placeholder.jpg'} 
          alt={college.name}
          fill
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        <div className="absolute inset-0 flex items-end pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl">
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="px-5 py-2 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest shadow-lg">
                  RANK {college.nirf_rank || 'N/A'}
                </div>
                <div className="px-5 py-2 rounded-2xl bg-white/10 text-white text-xs font-black uppercase tracking-widest backdrop-blur-md border border-white/20">
                  {college.type}
                </div>
                <div className="px-5 py-2 rounded-2xl bg-emerald-500 text-white text-xs font-black uppercase tracking-widest shadow-lg">
                  {college.tier || 'Standard'}
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
          <div className="lg:col-span-8 space-y-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Avg Package', value: college.avg_package, color: 'text-emerald-600' },
                { label: 'Annual Fee', value: college.annual_fee, color: 'text-blue-600' },
                { label: 'AI Score', value: `${college.ai_score || 0}/100`, color: 'text-purple-600' },
                { label: 'Placement', value: '85%+', color: 'text-orange-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <section id="about">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Institutional Profile</h2>
              <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                  {college.description || `${college.name} represents a standard of excellence in ${college.type} within ${college.state}. As a ${college.tier} institution, it offers a blend of traditional academic rigor and modern industry-aligned training. The campus in ${college.city} is equipped with modern infrastructure including smart labs, extensive digital libraries, and innovation centers.`}
                </p>
              </div>
            </section>

            <section id="admission" className="p-8 sm:p-12 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">2026 Admission Strategy</h2>
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
                      <p className="text-sm text-slate-500 text-balance">10+2 with minimum 45% aggregate in PCM subjects.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4">Pro-Tip</h4>
                  <p className="text-sm text-slate-500 leading-loose">
                    Participating in early rounds of counseling is critical. Seats in top branches like CSE and IT usually fill up by Round 2.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
              <h3 className="text-2xl font-black mb-4 relative z-10">Join 2026 Community</h3>
              <p className="text-emerald-50/90 mb-8 leading-relaxed relative z-10 text-sm">
                Get real-time admission updates, PDF brochures, and category-wise cutoffs directly on WhatsApp.
              </p>
              <Link href={WHATSAPP_GROUP_LINK} target="_blank">
                <button className="w-full py-4 bg-white text-emerald-700 text-center rounded-2xl font-black text-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-3">
                  Join WhatsApp Group
                </button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <h3 className="text-2xl font-black mb-4 relative z-10">Expert Guidance</h3>
              <p className="text-blue-100/90 mb-8 leading-relaxed relative z-10 text-sm">
                Book a VIP session with mentors from top IITs/NITs to secure your seat.
              </p>
              <Link href="/book-call">
                <button className="w-full py-5 bg-white/10 hover:bg-white/20 text-white text-center rounded-2xl font-black text-lg backdrop-blur-md transition-all border border-white/20">
                  Talk to Mentor
                </button>
              </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Resources</h3>
              <div className="space-y-4">
                {[
                  { label: 'Download Brochure', value: 'WhatsApp Link', link: WHATSAPP_GROUP_LINK },
                  { label: 'Admission Form', value: '2026 Apply', link: college.website },
                ].map((item, i) => (
                  <Link key={i} href={item.link} target="_blank">
                    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-100">
                      <span className="text-sm font-bold text-slate-500">{item.label}</span>
                      <span className="text-sm font-black text-blue-600">{item.value}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 mt-20 pt-20 pb-32">
        <div className="container mx-auto px-4">
          <RelatedLinks 
            pageSlug="college-detail" 
            currentCollege={{
              name: college.name,
              state: college.state,
              city: college.city,
              type: college.type
            }}
          />
        </div>
      </div>

    </div>
  );
}
