import { Metadata } from 'next';
import { generateCounselingMeta } from '@/lib/seo/generateMeta';
import RelatedLinks from '@/components/seo/RelatedLinks';
import Script from 'next/script';

export const metadata: Metadata = generateCounselingMeta({
  examName: 'NEET',
  pageType: 'Choice Filling Guide',
  slug: 'counseling/neet-choice-filling-guide',
});

export default function NEETChoiceFillingGuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is NEET Choice Filling Guide?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "NEET Choice Filling Guide is an essential part of the admission process for students seeking seats in top colleges in India. It involves multiple stages including registration and allotment."
        }
      },
      {
        "@type": "Question",
        "name": "How to participate in NEET 2025 counseling?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Candidates must register on the official portal, upload necessary documents, and fill their choices of colleges and branches during the specified window."
        }
      },
      {
        "@type": "Question",
        "name": "When will NEET Choice Filling Guide start?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Choice Filling Guide process for NEET 2025 is expected to commence shortly after the declaration of results. Stay tuned for official updates."
        }
      },
      {
        "@type": "Question",
        "name": "What are the documents required for NEET?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Commonly required documents include the NEET scorecard, admit card, 10th & 12th certificates, and identity proof."
        }
      },
      {
        "@type": "Question",
        "name": "Can I change my choices after submission?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Usually, choices can be modified until the final lock date. After locking, no further changes are permitted for that round."
        }
      }
    ]
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.apnacounsellor.in" },
      { "@type": "ListItem", "position": 2, "name": "Counseling", "item": "https://www.apnacounsellor.in/counseling" },
      { "@type": "ListItem", "position": 3, "name": "NEET Choice Filling Guide", "item": "https://www.apnacounsellor.in/counseling/neet-choice-filling-guide" }
    ]
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <h1 className="text-4xl font-bold mb-8 text-slate-900">NEET Choice Filling Guide 2025: Expert Guide</h1>
      
      <section className="prose prose-slate max-w-none mb-12">
        <p className="text-lg leading-relaxed text-slate-700">
          Navigating the NEET Choice Filling Guide process can be challenging for many students and parents. This comprehensive guide aims to simplify the journey by providing detailed information about the NEET 2025 schedule, eligibility, and step-by-step procedures. NEET remains one of the most competitive platforms for higher education in India, and the Choice Filling Guide phase is where strategic decisions are made. Our team at Apna Counsellor has analyzed years of data to help you understand the cutoff trends and seat allotment patterns. Whether you are looking for top-tier institutes or specialized branches, having the right information at the right time is paramount. We cover everything from the initial registration to the final seat acceptance fee payment. Ensure you have all your documents ready and follow the official timelines strictly to secure your dream college seat.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Important Dates & Schedule</h2>
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
          <p>The official schedule for NEET Choice Filling Guide 2025 will be announced soon. Generally, the process follows these stages:</p>
          <ul className="mt-4 space-y-2 list-disc list-inside">
            <li>Online Registration & Document Upload</li>
            <li>Verification of Documents</li>
            <li>Display of Merit List</li>
            <li>Choice Filling and Locking</li>
            <li>Seat Allotment Rounds</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Eligibility Requirements</h2>
        <div className="p-6 border rounded-lg bg-white shadow-sm">
          <p>To participate in the NEET Choice Filling Guide 2025, candidates must fulfill the following criteria:</p>
          <ul className="mt-4 space-y-2 list-disc list-inside text-slate-600">
            <li>Qualified NEET 2025 with a valid rank/score.</li>
            <li>Completed 10+2 or equivalent with required percentage.</li>
            <li>Meet the domicile requirements of the respective state (if applicable).</li>
            <li>Possess all original documents for verification.</li>
          </ul>
        </div>
      </section>

      <div className="my-12 text-center">
        <a href="/contact" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-md">
          Consult an Expert for Free
        </a>
      </div>

      <RelatedLinks pageSlug="neet-choice-filling-guide" />
    </main>
  );
}
