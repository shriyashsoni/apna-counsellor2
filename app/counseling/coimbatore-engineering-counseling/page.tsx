import { Metadata } from 'next';
import { generateCounselingMeta } from '@/lib/seo/generateMeta';
import RelatedLinks from '@/components/seo/RelatedLinks';
import Script from 'next/script';

export const metadata: Metadata = generateCounselingMeta({
  examName: 'Coimbatore Engineering',
  pageType: 'Counseling',
  slug: 'counseling/coimbatore-engineering-counseling',
  city: 'Coimbatore',
});

export default function CoimbatoreEngineeringPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-slate-900">Engineering Counseling in Coimbatore 2025</h1>
      
      <section className="prose prose-slate max-w-none mb-12">
        <p className="text-lg leading-relaxed text-slate-700">
          Coimbatore is a major hub for engineering education, hosting some of the most prestigious institutes in the region. If you are looking for engineering admissions in Coimbatore, understanding the local counseling process and the top colleges is essential. The city offers a diverse range of specializations from Computer Science to Mechanical Engineering. Students from across the country flock to Coimbatore for its academic excellence and placement opportunities. This guide covers the top engineering colleges in Coimbatore, their admission criteria, and the counseling rounds you need to participate in.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Top Engineering Colleges in Coimbatore</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li className="p-4 bg-blue-50 rounded border border-blue-100">Institute of Technology, Coimbatore</li>
          <li className="p-4 bg-blue-50 rounded border border-blue-100">Government Engineering College, Coimbatore</li>
          <li className="p-4 bg-blue-50 rounded border border-blue-100">Private Excellence University, Coimbatore</li>
          <li className="p-4 bg-blue-50 rounded border border-blue-100">Coimbatore City Engineering Institute</li>
        </ul>
      </section>

      <div className="my-12 text-center">
        <a href="/contact" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full font-bold">
          Get Coimbatore Admission Support
        </a>
      </div>

      <RelatedLinks pageSlug="coimbatore-engineering-counseling" />
    </main>
  );
}
