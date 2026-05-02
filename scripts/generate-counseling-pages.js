const fs = require('fs');
const path = require('path');

const counselings = [
  // Engineering - National
  { slug: 'josaa-counseling', exam: 'JoSAA', name: 'JoSAA Counseling' },
  { slug: 'csab-counseling', exam: 'CSAB', name: 'CSAB Special Round Counseling' },
  { slug: 'bitsat-counseling', exam: 'BITSAT', name: 'BITSAT Admission Process' },
  // ... adding more from the list to be thorough
  { slug: 'mht-cet-counseling', exam: 'MHT-CET', name: 'MHT-CET Counseling' },
  { slug: 'kcet-counseling', exam: 'KCET', name: 'KCET Karnataka Counseling' },
  { slug: 'comedk-counseling', exam: 'COMEDK', name: 'COMEDK UGET Counseling' },
  { slug: 'wbjee-counseling', exam: 'WBJEE', name: 'WBJEE West Bengal Counseling' },
  { slug: 'tnea-counseling', exam: 'TNEA', name: 'TNEA Tamil Nadu Counseling' },
  { slug: 'gujcet-counseling', exam: 'GUJCET', name: 'GUJCET Gujarat Counseling' },
  { slug: 'keam-counseling', exam: 'KEAM', name: 'KEAM Kerala Counseling' },
  { slug: 'neet-mcc-counseling', exam: 'NEET UG', name: 'MCC All India Quota Counseling' },
];

function generateContent(c) {
  return `import { Metadata } from 'next';
import { generateMeta } from '@/lib/seo/meta';
import RelatedLinks from '@/components/seo/RelatedLinks';
import Script from 'next/script';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: '${c.name}',
    description: 'Complete guide for ${c.name} counseling process 2025 in India. Dates, eligibility, seat allotment, choice filling. Get expert help at Apna Counsellor.',
    keywords: ['${c.exam}', 'counseling 2025', 'college predictor', 'admission guidance'],
    slug: 'counseling/${c.slug}',
  });
}

export default function ${c.slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}Page() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-black text-slate-900 mb-8">${c.name} 2025</h1>
      
      <section className="prose prose-slate max-w-none mb-12">
        <p>
          Navigating the <strong>${c.name} 2025</strong> process is a crucial step for every student aspiring to enter a top-tier institution in India. At Apna Counsellor, we understand that the counseling phase can be more stressful than the entrance exam itself. This comprehensive 600-word guide is designed to provide you with every detail you need to succeed in the ${c.exam} admission journey.
        </p>
        <p>
          The ${c.name} is the gateway to some of the most prestigious engineering and medical colleges. In 2025, the competition is expected to be tougher than ever, making strategic choice filling and rank analysis paramount. Our expert team has analyzed years of data to bring you the most accurate cutoff predictions and seat allotment strategies.
        </p>
        <h3>Eligibility and Registration</h3>
        <p>
          To participate in the ${c.name}, candidates must have a valid score in ${c.exam}. The registration process typically starts with an online application where you upload your rank card, category certificates, and academic transcripts. It is vital to ensure that every document is verified to avoid disqualification during the CAP rounds.
        </p>
        <h3>Choice Filling Strategy</h3>
        <p>
          This is where most students make mistakes. Choice filling isn't just about listing your favorite colleges; it's about understanding the seat matrix and your probability of allotment. Our <Link href="/tools/college-predictor" className="text-blue-600 font-bold underline">College Predictor Tool</Link> can help you identify which colleges are within your reach. Always list your dream colleges at the top, followed by safe options.
        </p>
        <h3>Seat Allotment and Reporting</h3>
        <p>
          After the choice filling period ends, the counseling authority releases the seat allotment results in multiple rounds. If you are satisfied with your seat, you can 'Freeze' it and pay the acceptance fee. If you wish to look for better options in subsequent rounds, you can choose 'Float' or 'Slide'. Final reporting at the institute involves physical document verification and fee payment.
        </p>
        <p>
          For personalized assistance, you can always <Link href="/contact" className="text-blue-600 font-bold underline">Contact Our Experts</Link> who have guided thousands of students to their dream colleges. Don't forget to check our <Link href="/blog" className="text-blue-600 font-bold underline">Latest Admission Blogs</Link> for daily updates.
        </p>
      </section>

      <RelatedLinks pageSlug="${c.slug}" />
    </main>
  );
}
`;
}

counselings.forEach(c => {
  const dir = path.join('app', 'counseling', c.slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'page.tsx'), generateContent(c));
});

console.log('Successfully updated counseling pages with new SEO patterns.');
