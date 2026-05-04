import { Metadata } from 'next';

interface CounselingMetaParams {
  examName: string;
  pageType: string;
  slug: string;
  city?: string;
  year?: string;
}

export function generateCounselingMeta({
  examName,
  pageType,
  slug,
  city,
  year = '2025',
}: CounselingMetaParams): Metadata {
  const title = `${examName} ${pageType} ${year}${city ? ` in ${city}` : ''} | Apna Counsellor`;
  
  let description = `Complete guide for ${examName} ${pageType} ${year}${city ? ` in ${city}` : ''}. Dates, eligibility, process, and expert tips. Get free expert guidance at ApnaCounsellor.in`;
  
  // Ensure description is within 155 characters
  if (description.length > 155) {
    const suffix = " Get free expert guidance at ApnaCounsellor.in";
    description = description.substring(0, 155 - suffix.length) + suffix;
  }

  const url = `https://www.apnacounsellor.in/${slug}`;
  const ogImage = `https://www.apnacounsellor.in/og/${slug}.png`;

  return {
    title,
    description,
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
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Apna Counsellor',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
