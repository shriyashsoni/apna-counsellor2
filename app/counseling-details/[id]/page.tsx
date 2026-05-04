import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import RelatedLinks from '@/components/seo/RelatedLinks';
import Script from 'next/script';
import { notFound } from 'next/navigation';

interface CounselingPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: CounselingPageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: counseling } = await supabase
    .from('counselings')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!counseling) return { title: 'Counseling Not Found' };

  const title = `${counseling.name} 2025 | Registration, Dates & Step-by-Step Guide`;
  const description = `Complete guide to ${counseling.name} 2025. Check registration steps, eligibility for ${counseling.exam || ''}, document verification, and seat allotment rounds. Get free expert guidance at ApnaCounsellor.in`;

  return {
    title,
    description,
    keywords: [counseling.name, counseling.exam || '', 'counseling process', 'admission guide 2025'],
    alternates: {
      canonical: `https://www.apnacounsellor.in/counseling-details/${params.id}`,
    },
  };
}

export default async function CounselingDetailPage({ params }: CounselingPageProps) {
  const supabase = createClient();
  const { data: counseling } = await supabase
    .from('counselings')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!counseling) notFound();

  return (
    <main className="max-w-5xl mx-auto px-4 py-20">
      <div className="mb-16">
        <span className="inline-block bg-blue-100 text-blue-700 px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest mb-6">
          {counseling.category} | {counseling.region}
        </span>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-8">
          {counseling.name} <span className="text-blue-600">2025</span>
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed max-w-4xl">
          {counseling.description || `The ${counseling.name} is the official admission gateway for students aspiring to secure seats through ${counseling.exam || 'the respective entrance exams'}. This comprehensive guide covers every aspect of the counseling journey, from the initial registration to the final reporting at your dream college.`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-16">
          <section>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
              <span className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-xl text-lg">1</span>
              Quick Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-3xl border">
                <p className="text-slate-400 text-sm mb-1 uppercase font-bold tracking-tighter">Exam Covered</p>
                <p className="text-2xl font-black text-slate-800">{counseling.exam || 'Institutional'}</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border">
                <p className="text-slate-400 text-sm mb-1 uppercase font-bold tracking-tighter">Region</p>
                <p className="text-2xl font-black text-slate-800">{counseling.region}</p>
              </div>
            </div>
          </section>

          {counseling.links && counseling.links.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8">Official Resources</h2>
              <div className="grid gap-4">
                {counseling.links.map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link.url} 
                    target="_blank"
                    className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-3xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                  >
                    <span className="text-lg font-bold text-slate-800 group-hover:text-blue-700">{link.label}</span>
                    <span className="text-slate-400">Visit Site ↗</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          <section className="bg-slate-900 text-white rounded-[3rem] p-12">
            <h2 className="text-3xl font-bold mb-6">Need Personalized Guidance?</h2>
            <p className="text-slate-400 text-lg mb-10">
              Our counselors have years of experience with {counseling.name}. We help with preference lists, category claims, and document prep.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-blue-600 text-white px-10 py-5 rounded-full font-black text-lg hover:bg-blue-500 transition-colors"
            >
              Consult an Expert Free
            </a>
          </section>
        </div>

        <aside>
          <div className="sticky top-24 space-y-8">
             <div className="p-8 bg-white border-2 border-blue-100 rounded-[2.5rem] shadow-sm">
                <h3 className="text-xl font-bold mb-6">Process Timeline</h3>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                    <div>
                      <p className="font-bold">Online Registration</p>
                      <p className="text-sm text-slate-500">Fill details and upload docs</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-8 h-8 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                    <div>
                      <p className="font-bold">Document Verification</p>
                      <p className="text-sm text-slate-500">Online/Offline e-verification</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-8 h-8 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                    <div>
                      <p className="font-bold">Choice Filling</p>
                      <p className="text-sm text-slate-500">Select colleges and branches</p>
                    </div>
                  </li>
                </ul>
             </div>
          </div>
        </aside>
      </div>

      <div className="mt-24">
        <RelatedLinks pageSlug="counseling-detail" />
      </div>
    </main>
  );
}
