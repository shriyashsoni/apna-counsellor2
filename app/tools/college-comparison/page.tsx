import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'College Comparison | Apna Counsellor',
  description: 'Use our advanced College Comparison to find the best colleges and branches for your rank in 2025.',
};

export default function CollegeComparisonPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "College Comparison",
    "operatingSystem": "Web",
    "applicationCategory": "EducationalApplication",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to use College Comparison",
    "step": [
      { "@type": "HowToStep", "text": "Enter your entrance exam details." },
      { "@type": "HowToStep", "text": "Input your rank or score." },
      { "@type": "HowToStep", "text": "Select your category and preferences." },
      { "@type": "HowToStep", "text": "Click on predict to see results." }
    ]
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <Script id="software-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <Script id="howto-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <h1 className="text-4xl font-bold mb-8">College Comparison 2025</h1>
      <p className="text-xl text-slate-600 mb-12">Coming soon: Our data-driven College Comparison will help you make the right choice.</p>
      
      <div className="bg-slate-100 h-96 flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-300">
        <p className="text-slate-500 font-medium">Interactive College Comparison Component UI</p>
      </div>
    </main>
  );
}
