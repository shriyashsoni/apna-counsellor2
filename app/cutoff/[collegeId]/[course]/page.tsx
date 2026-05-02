import { Metadata } from 'next';
import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { notFound } from 'next/navigation';

interface CutoffPageProps {
  params: {
    collegeId: string;
    course: string;
  };
}

export async function generateMetadata({ params }: CutoffPageProps): Promise<Metadata> {
  const college = await fetchQuery(api.colleges.getById, { id: params.collegeId as any });
  if (!college) return { title: 'College Not Found' };

  const courseName = decodeURIComponent(params.course);
  const title = `${college.shortName || college.name} ${courseName} Cutoff 2025 | Previous Year Opening & Closing Ranks`;
  const description = `Check detailed cutoff ranks for ${courseName} at ${college.name}. Compare opening and closing ranks for General, OBC, SC, ST, and EWS categories. Plan your ${college.state} counseling strategy.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://apnacounsellor.in/cutoff/${params.collegeId}/${params.course}`,
    },
  };
}

export default async function CutoffDetailPage({ params }: CutoffPageProps) {
  const college = await fetchQuery(api.colleges.getById, { id: params.collegeId as any });
  if (!college) notFound();

  const courseName = decodeURIComponent(params.course);

  return (
    <main className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
        {college.name} <span className="text-blue-600">{courseName}</span> Cutoffs
      </h1>

      <section className="prose prose-slate max-w-none mb-12">
        <p className="text-xl text-slate-600 leading-relaxed">
          The {courseName} department at {college.name} is one of the most competitive branches. Admission is strictly based on the merit rank obtained in entrance exams. Understanding the previous year's trends is vital for predicting your chances in 2025.
        </p>
      </section>

      <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm mb-16">
        <div className="bg-slate-900 text-white p-8">
          <h2 className="text-2xl font-bold">2024 Cutoff Trends (Sample)</h2>
          <p className="text-slate-400">Opening and Closing Ranks (State Quota)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-6 font-black text-slate-900">Category</th>
                <th className="p-6 font-black text-slate-900">Opening Rank</th>
                <th className="p-6 font-black text-slate-900">Closing Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-6 font-bold">General / Open</td>
                <td className="p-6 text-blue-600 font-medium">1,245</td>
                <td className="p-6 text-slate-900 font-black">2,890</td>
              </tr>
              <tr>
                <td className="p-6 font-bold text-slate-500">OBC-NCL</td>
                <td className="p-6 text-blue-600 font-medium">3,560</td>
                <td className="p-6 text-slate-900 font-black">4,210</td>
              </tr>
              <tr>
                <td className="p-6 font-bold text-slate-500">SC</td>
                <td className="p-6 text-blue-600 font-medium">8,900</td>
                <td className="p-6 text-slate-900 font-black">10,500</td>
              </tr>
              <tr>
                <td className="p-6 font-bold text-slate-500">ST</td>
                <td className="p-6 text-blue-600 font-medium">12,400</td>
                <td className="p-6 text-slate-900 font-black">15,600</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border-2 border-blue-100 p-10 rounded-[2.5rem] mb-20 text-center">
        <h3 className="text-2xl font-bold text-blue-900 mb-4">Want a precise prediction for your rank?</h3>
        <p className="text-blue-700 mb-8 max-w-xl mx-auto">
          Our AI-powered college predictor uses 10+ years of data to tell you exactly which college and branch you can get.
        </p>
        <a href="/predictor" className="inline-block bg-blue-600 text-white px-12 py-5 rounded-full font-black text-lg shadow-lg hover:bg-blue-700 transition-colors">
          Open College Predictor
        </a>
      </div>

      <RelatedLinks pageSlug="cutoff-detail" />
    </main>
  );
}
