import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import RelatedLinks from '@/components/seo/RelatedLinks';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface ComparePageProps {
  params: {
    college1: string;
    college2: string;
  };
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: c1 } = await supabase.from('colleges').select('*').eq('id', params.college1).single();
  const { data: c2 } = await supabase.from('colleges').select('*').eq('id', params.college2).single();
  
  if (!c1 || !c2) return { title: 'Comparison Not Found' };

  const title = `${c1.short_name || c1.name} vs ${c2.short_name || c2.name} Comparison | Placements, Fees & Cutoffs 2025`;
  const description = `Detailed comparison between ${c1.name} and ${c2.name}. Compare NIRF ranks, average packages, fees structure, and admission cutoffs to make the right choice.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://apnacounsellor.in/compare/${params.college1}/${params.college2}`,
    },
  };
}

export default async function CollegeComparePage({ params }: ComparePageProps) {
  const supabase = createClient();
  const { data: c1 } = await supabase.from('colleges').select('*').eq('id', params.college1).single();
  const { data: c2 } = await supabase.from('colleges').select('*').eq('id', params.college2).single();

  if (!c1 || !c2) notFound();

  const comparisonData = [
    { label: 'NIRF Rank', val1: c1.nirf_rank || 'N/A', val2: c2.nirf_rank || 'N/A' },
    { label: 'City', val1: c1.city, val2: c2.city },
    { label: 'Type', val1: c1.type, val2: c2.type },
    { label: 'Average Package', val1: c1.avg_package || 'N/A', val2: c2.avg_package || 'N/A' },
    { label: 'Annual Fee', val1: c1.annual_fee || 'N/A', val2: c2.annual_fee || 'N/A' },
    { label: 'Tier', val1: c1.tier || 'N/A', val2: c2.tier || 'N/A' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-4xl md:text-6xl font-black text-center mb-16 text-slate-900 leading-tight">
        {c1.short_name || 'College 1'} <span className="text-blue-600">vs</span> {c2.short_name || 'College 2'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {[c1, c2].map((college, idx) => (
          <div key={idx} className="bg-white border rounded-[3rem] p-8 shadow-sm hover:shadow-xl transition-all">
            <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-6">
              <Image src={college.image_url || '/images/college-placeholder.jpg'} alt={college.name} fill className="object-cover" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{college.name}</h2>
            <p className="text-slate-500 mb-4">{college.city}, {college.state}</p>
            <div className="flex gap-2">
               <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">{college.type}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-inner">
        <h3 className="text-3xl font-black mb-12 text-center text-slate-800">Head-to-Head Comparison</h3>
        <div className="space-y-4">
          {comparisonData.map((row, idx) => (
            <div key={idx} className="grid grid-cols-3 p-6 bg-white rounded-2xl border border-slate-100 items-center">
              <div className="text-lg font-bold text-slate-900">{row.val1}</div>
              <div className="text-center text-slate-400 font-medium uppercase text-xs tracking-widest">{row.label}</div>
              <div className="text-right text-lg font-bold text-slate-900">{row.val2}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="mt-24">
        <div className="bg-slate-900 text-white rounded-[3rem] p-16 text-center">
          <h2 className="text-4xl font-bold mb-6">Still confused between these two?</h2>
          <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto">
            Our expert mentors are alumni of these colleges. Get first-hand information about placements, faculty, and campus life.
          </p>
          <a href="/contact" className="inline-block bg-white text-slate-900 px-12 py-5 rounded-full font-black text-lg hover:scale-105 transition-transform">
            Talk to a Mentor
          </a>
        </div>
      </section>

      <div className="mt-20">
        <RelatedLinks pageSlug="college-comparison" />
      </div>
    </main>
  );
}
