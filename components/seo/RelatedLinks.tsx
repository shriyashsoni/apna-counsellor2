import Link from 'next/link';

interface RelatedLink {
  title: string;
  description: string;
  href: string;
}

interface RelatedLinksProps {
  pageSlug: string;
}

const relationshipMap: Record<string, RelatedLink[]> = {
  'mht-cet': [
    { title: 'MHT-CET Counseling Guide', description: 'Step-by-step guide to Maharashtra engineering admissions.', href: '/counseling/mht-cet-counseling' },
    { title: 'College Predictor', description: 'Predict your college based on MHT-CET rank.', href: '/counseling/mht-cet-college-predictor' },
    { title: 'Cutoff 2025', description: 'Latest cutoffs for top engineering colleges.', href: '/counseling/mht-cet-cutoff-2025' },
    { title: 'CAP Rounds Explained', description: 'Detailed process of centralized admission process.', href: '/counseling/mht-cet-cap-rounds' },
    { title: 'Seat Allotment', description: 'Check seat allotment status and procedures.', href: '/counseling/mht-cet-seat-allotment' },
    { title: 'Choice Filling Guide', description: 'Expert advice on filling your preferences.', href: '/counseling/mht-cet-choice-filling-guide' },
  ],
  'jee': [
    { title: 'JoSAA Counseling 2025', description: 'Comprehensive guide to JoSAA counseling.', href: '/counseling/josaa-counseling' },
    { title: 'JEE Main College Predictor', description: 'Find NITs/IIITs based on your rank.', href: '/counseling/jee-main-college-predictor' },
    { title: 'JEE Advanced Predictor', description: 'IIT admission predictor for rank holders.', href: '/counseling/jee-advanced-college-predictor' },
    { title: 'CSAB Special Rounds', description: 'Guide to CSAB counseling for vacant seats.', href: '/counseling/csab-counseling' },
    { title: 'NIT Seat Matrix', description: 'Explore available seats across all NITs.', href: '/counseling/josaa-seat-matrix' },
    { title: 'JoSAA Cutoff 2025', description: 'Expected and previous year JoSAA cutoffs.', href: '/counseling/josaa-cutoff-2025' },
  ],
  'neet': [
    { title: 'NEET UG Counseling', description: 'Guide for medical admissions across India.', href: '/counseling/neet-ug-counseling' },
    { title: 'NEET College Predictor', description: 'Predict MBBS/BDS colleges based on score.', href: '/counseling/neet-college-predictor' },
    { title: 'State Quota Counseling', description: '85% state quota counseling details.', href: '/counseling/neet-state-quota-counseling' },
    { title: 'All India Quota (AIQ)', description: 'Details on 15% AIQ counseling by MCC.', href: '/counseling/neet-all-india-quota' },
    { title: 'NEET Cutoff 2025', description: 'Expected cutoffs for AIIMS and Govt colleges.', href: '/counseling/neet-cutoff-2025' },
    { title: 'Choice Filling Tips', description: 'Strategic choice filling for medical seats.', href: '/counseling/neet-choice-filling-guide' },
  ],
  'college-detail': [
    { title: 'Engineering College Predictor', description: 'Find colleges based on your entrance rank.', href: '/tools/college-predictor' },
    { title: 'Cutoff Analysis 2025', description: 'Compare previous year opening and closing ranks.', href: '/tools/cutoff-predictor' },
    { title: 'Top 100 NIRF Colleges', description: 'List of top-ranked institutes in India.', href: '/blog/top-10-engineering-colleges-in-maharashtra' },
    { title: 'Scholarship Finder', description: 'Discover financial aid and state scholarships.', href: '/tools/scholarship-finder' },
    { title: 'Document Verification', description: 'Checklist for physical and online reporting.', href: '/counseling/mht-cet-document-verification' },
    { title: 'Hostel Guidance', description: 'Tips for choosing and settling in college hostels.', href: '/blog/hostel-life-what-to-expect-and-how-to-prepare' },
  ]
};

export default function RelatedLinks({ pageSlug }: RelatedLinksProps) {
  let links: RelatedLink[] = [];

  const lowerSlug = pageSlug.toLowerCase();

  if (lowerSlug.includes('mht-cet')) links = relationshipMap['mht-cet'];
  else if (lowerSlug.includes('jee') || lowerSlug.includes('josaa') || lowerSlug.includes('nit') || lowerSlug.includes('iit') || lowerSlug.includes('csab')) links = relationshipMap['jee'];
  else if (lowerSlug.includes('neet') || lowerSlug.includes('aiims') || lowerSlug.includes('jipmer')) links = relationshipMap['neet'];
  else if (lowerSlug.includes('college')) links = relationshipMap['college-detail'];
  else {
    links = relationshipMap['college-detail'];
  }

  return (
    <section className="mt-20 border-t border-slate-100 pt-12">
      <h2 className="text-3xl font-black mb-8 text-slate-900 tracking-tight">Expert Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {links.map((link) => (
          <Link 
            key={link.href} 
            href={link.href}
            className="group block p-8 bg-slate-50 border border-transparent rounded-[2rem] hover:bg-white hover:border-blue-500 hover:shadow-2xl transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 mb-3">
              {link.title}
            </h3>
            <p className="text-slate-500 leading-relaxed">
              {link.description}
            </p>
            <div className="mt-6 text-blue-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              Explore Guide →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
