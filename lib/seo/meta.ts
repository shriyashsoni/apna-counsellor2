import { Metadata } from 'next';
import { nextSeoToMetadata } from './next-seo';

export interface MetaInput {
  title: string;
  description: string;
  keywords: string[];
  slug: string;
  image?: string;
  year?: string;
}

export function generateMeta(data: MetaInput): Metadata {
  const currentYear = data.year || '2026';
  
  // Set default preview images based on page content
  let ogImage = `https://www.apnacounsellor.in/images/counseling-preview-v3.png`;
  
  const titleLower = data.title.toLowerCase();
  if (data.image) {
    ogImage = data.image.startsWith('http') ? data.image : `https://www.apnacounsellor.in${data.image.startsWith('/') ? '' : '/'}${data.image}`;
  } else if (titleLower.includes('josaa') || titleLower.includes('jee')) {
    ogImage = `https://www.apnacounsellor.in/images/josaa-counselling.png`;
  } else if (titleLower.includes('mht') || titleLower.includes('cet') || titleLower.includes('maharashtra')) {
    ogImage = `https://www.apnacounsellor.in/images/mht-cet-counselling.png`;
  } else if (titleLower.includes('comedk')) {
    ogImage = `https://www.apnacounsellor.in/images/comedk-counselling.png`;
  } else if (titleLower.includes('mp dte') || titleLower.includes('mpdte') || titleLower.includes('mp-dte')) {
    ogImage = `https://www.apnacounsellor.in/images/mp-dte-counselling.png`;
  }

  const finalTitle = `${data.title} ${currentYear}`;
  const url = `https://www.apnacounsellor.in/${data.slug.startsWith('/') ? data.slug.slice(1) : data.slug}`;

  // Direct conversion to next-seo parameters
  return nextSeoToMetadata({
    title: finalTitle,
    description: data.description,
    canonical: url,
    keywords: data.keywords,
    openGraph: {
      url: url,
      title: `${finalTitle} | India's #1 Admissions Portal`,
      description: data.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${data.title} ${currentYear}`,
        }
      ]
    }
  });
}
