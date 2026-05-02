import { Metadata } from 'next';
import { generateCounselingMeta } from '@/lib/seo/generateMeta';
import RelatedLinks from '@/components/seo/RelatedLinks';
import Script from 'next/script';

export const metadata: Metadata = generateCounselingMeta({
  examName: 'NATA',
  pageType: 'Counseling',
  slug: 'counseling/nata-counseling',
});

export default function NataCounselingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is NATA B.Arch Counseling?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "NATA B.Arch Counseling is the official process for admission to colleges under NATA. It involves registration, document verification, and seat allotment."
        }
      },
      {
        "@type": "Question",
        "name": "How to apply for NATA 2025 counseling?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Candidates can apply through the official portal of the counseling authority by filling out the registration form and paying the fee."
        }
      }
    ]
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">NATA B.Arch Counseling 2025 | Apna Counsellor</h1>
        <div className="h-1.5 w-24 bg-blue-600 rounded-full"></div>
      </div>
      
      <section className="prose prose-slate max-w-none mb-12">
        <p className="text-lg leading-relaxed text-slate-700">
          Welcome to the definitive guide for <strong>NATA B.Arch Counseling 2025</strong>. At Apna Counsellor, we provide end-to-end support for students navigating the complex landscape of college admissions in India. The NATA B.Arch Counseling is a critical phase where your rank is transformed into a career-defining seat at a top-tier institution. Whether you are aiming for NATA top colleges or looking for the best possible options within your rank, our expert insights and data-driven approach ensure you stay ahead of the competition. 
        </p>
        <p className="text-lg leading-relaxed text-slate-700 mt-4">
          The 2025 session of NATA B.Arch Counseling is expected to be highly competitive. It is essential to understand the CAP rounds, seat matrix, and category-wise cutoffs. Our platform offers free tools like college predictors and rank analysis to help you make informed choices. Join thousands of successful students who have used Apna Counsellor to secure their dream college seats.
        </p>
      </section>

      <section className="bg-slate-50 border rounded-3xl p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Counseling Process Steps</h2>
        <div className="space-y-4">
          <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <span className="font-black text-blue-600">01</span>
            <p><strong>Registration:</strong> Create your profile on the official portal and pay the counseling fee.</p>
          </div>
          <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <span className="font-black text-blue-600">02</span>
            <p><strong>Verification:</strong> Upload documents for e-verification or visit an FC for physical verification.</p>
          </div>
          <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <span className="font-black text-blue-600">03</span>
            <p><strong>Choice Filling:</strong> Submit your preferences of colleges and courses in order of priority.</p>
          </div>
          <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <span className="font-black text-blue-600">04</span>
            <p><strong>Allotment:</strong> Check seat allotment results and freeze/float/slide based on your preference.</p>
          </div>
        </div>
      </section>

      <div className="text-center bg-blue-600 rounded-[2rem] p-12 text-white shadow-xl">
        <h3 className="text-3xl font-bold mb-4">Confused about Choice Filling?</h3>
        <p className="text-blue-100 mb-8">Our experts can create a personalized preference list based on your rank and category.</p>
        <a href="/contact" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full font-black text-lg">
          Connect with Apna Counsellor
        </a>
      </div>

      <RelatedLinks pageSlug="nata-counseling" />
    </main>
  );
}
