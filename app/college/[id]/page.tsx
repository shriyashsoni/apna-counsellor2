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
  if (!college) return { title: 'College Not Found' };

  const title = `${college.name} | Admissions, Cutoffs, Fees & Placements 2025`;
  const description = `Detailed information about ${college.name} ${college.city ? `in ${college.city}` : ''}. Check latest cutoffs, NIRF rank ${college.nirfRank || ''}, fees structure, and placement statistics. Get free expert guidance at ApnaCounsellor.in`;

  return {
    title,
    description,
    keywords: [college.name, college.shortName || '', college.state || '', 'college admission', 'cutoff 2025', 'placement stats'],
    openGraph: {
      title,
      description,
      images: college.imageUrl ? [college.imageUrl] : ['https://apnacounsellor.in/images/og-college.png'],
    },
    alternates: {
      canonical: `https://apnacounsellor.in/college/${params.id}`,
    },
  };
}

export default async function CollegeDetailPage({ params }: CollegePageProps) {
  const college = await fetchQuery(api.colleges.getById, { id: params.id });

  if (!college) notFound();

  const collegeSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": college.name,
    "alternateName": college.shortName,
    "description": college.description || `Leading ${college.type || 'educational'} institute located in ${college.city}, ${college.state}.`,
    "url": college.website,
    "logo": college.imageUrl,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": college.city,
      "addressRegion": college.state,
      "addressCountry": "IN"
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <Script
        id="college-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collegeSchema) }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="relative h-96 w-full rounded-3xl overflow-hidden mb-8 shadow-2xl">
            <Image 
              src={college.imageUrl || '/images/college-placeholder.jpg'} 
              alt={college.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-10">
              <div className="flex gap-3 mb-4">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                  NIRF Rank: {college.nirfRank || 'N/A'}
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1 rounded-full text-sm font-medium">
                  {college.type}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white">{college.name}</h1>
              <p className="text-white/80 text-xl mt-2">{college.city}, {college.state}</p>
            </div>
          </div>

          <section className="prose prose-slate max-w-none mb-16">
            <h2 className="text-3xl font-bold">About the Institute</h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              {college.description || `${college.name} is one of the premier ${college.type || 'educational'} institutions in India. Established in ${college.established || 'the past'}, it has consistently maintained high standards in academic excellence and research. The campus provides state-of-the-art facilities and a vibrant environment for students to excel in their chosen fields. With a focus on holistic development, ${college.name} offers various undergraduate and postgraduate programs that are highly sought after during counseling rounds.`}
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Cutoff & Admission Details</h2>
            <div className="bg-slate-50 border rounded-3xl p-8">
              <p className="text-slate-600 mb-6">
                Admission to {college.name} is primarily based on entrance exams like {college.state === 'Maharashtra' ? 'MHT-CET / JEE Main' : 'National Level Exams'}. The cutoffs vary each year based on the difficulty of the exam and the number of applicants.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-2xl shadow-sm border">
                  <h3 className="font-bold text-slate-800 mb-2">Estimated Fees</h3>
                  <p className="text-2xl font-black text-blue-600">{college.annualFee || 'Contact for Details'}</p>
                  <p className="text-xs text-slate-400 mt-1">Per annum (approx.)</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border">
                  <h3 className="font-bold text-slate-800 mb-2">Average Package</h3>
                  <p className="text-2xl font-black text-green-600">{college.avgPackage || 'Data Pending'}</p>
                  <p className="text-xs text-slate-400 mt-1">LPA (Placements 2024)</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-4">Want to get into {college.shortName || 'this college'}?</h3>
              <p className="text-blue-100 mb-8">Our expert counselors will help you with rank analysis, choice filling, and category optimization.</p>
              <a href="/contact" className="block w-full py-4 bg-white text-blue-600 text-center rounded-2xl font-black hover:scale-105 transition-transform">
                Get Expert Guidance
              </a>
            </div>

            <div className="bg-slate-100 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6 text-slate-900">Key Information</h3>
              <ul className="space-y-4">
                <li className="flex justify-between border-b border-slate-200 pb-3">
                  <span className="text-slate-500">Established</span>
                  <span className="font-semibold">{college.established || 'N/A'}</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-3">
                  <span className="text-slate-500">Tier</span>
                  <span className="font-semibold text-blue-600 uppercase">{college.tier || 'N/A'}</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-3">
                  <span className="text-slate-500">AI Score</span>
                  <span className="font-semibold">{college.aiScore || 'N/A'}</span>
                </li>
                <li className="flex flex-col gap-2 pt-2">
                  <span className="text-slate-500">Official Website</span>
                  <a href={college.website} target="_blank" className="text-blue-600 font-medium truncate hover:underline">
                    {college.website}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-20">
        <RelatedLinks pageSlug="college-detail" />
      </div>
    </main>
  );
}
