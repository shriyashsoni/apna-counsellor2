import { Metadata } from 'next';
import { nextSeoToMetadata } from './next-seo';

interface CounselingMetaParams {
  examName: string;
  pageType: string;
  slug: string;
  city?: string;
  year?: string;
  customImage?: string;
}

export function generateCounselingMeta({
  examName,
  pageType,
  slug,
  city,
  year = '2026',
  customImage,
}: CounselingMetaParams): Metadata {
  const title = `${examName} ${pageType} ${year}${city ? ` in ${city}` : ''}`;
  const description = `Complete guide for ${examName} ${pageType} ${year}${city ? ` in ${city}` : ''}. Dates, eligibility, process, and expert tips. Get free expert guidance at ApnaCounsellor.in. Cover JoSAA, NEET, MHT CET.`;
  const url = `https://www.apnacounsellor.in/${slug.startsWith('/') ? slug.slice(1) : slug}`;
  
  // Determine appropriate preview image based on exam name
  let ogImage = `https://www.apnacounsellor.in/images/counseling-preview-v3.png`;
  const examLower = examName.toLowerCase();
  
  if (customImage) {
    ogImage = customImage.startsWith('http') ? customImage : `https://www.apnacounsellor.in${customImage.startsWith('/') ? '' : '/'}${customImage}`;
  } else if (examLower.includes('josaa') || examLower.includes('jee')) {
    ogImage = `https://www.apnacounsellor.in/images/josaa-counselling.png`;
  } else if (examLower.includes('mht') || examLower.includes('cet') || examLower.includes('maharashtra')) {
    ogImage = `https://www.apnacounsellor.in/images/mht-cet-counselling.png`;
  } else if (examLower.includes('comedk')) {
    ogImage = `https://www.apnacounsellor.in/images/comedk-counselling.png`;
  } else if (examLower.includes('mp dte') || examLower.includes('mpdte') || examLower.includes('mp-dte')) {
    ogImage = `https://www.apnacounsellor.in/images/mp-dte-counselling.png`;
  }

  // Delegate directly to our unified next-seo converter
  return nextSeoToMetadata({
    title,
    description,
    canonical: url,
    keywords: [
      examName,
      pageType,
      year,
      city || '',
      'college counseling',
      'admission guidance',
      'India engineering admission',
      'medical counseling',
    ].filter(Boolean),
    openGraph: {
      url,
      title: `${title} | India's #1 Admissions Portal`,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    }
  });
}
