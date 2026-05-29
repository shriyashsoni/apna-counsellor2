import { Metadata } from 'next';

export interface OpenGraphImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  type?: string;
}

export interface OpenGraph {
  url?: string;
  type?: string;
  title?: string;
  description?: string;
  images?: OpenGraphImage[];
  siteName?: string;
  locale?: string;
}

export interface Twitter {
  handle?: string;
  site?: string;
  cardType?: string;
}

export interface NextSeoProps {
  title?: string;
  titleTemplate?: string;
  defaultTitle?: string;
  noindex?: boolean;
  nofollow?: boolean;
  description?: string;
  canonical?: string;
  keywords?: string[];
  openGraph?: OpenGraph;
  twitter?: Twitter;
  additionalMetaTags?: Array<{ name?: string; property?: string; content: string }>;
}

// 1. Define the Global Default SEO settings inspired by next-seo's default config
export const defaultSeoConfig: NextSeoProps = {
  defaultTitle: "Apna Counsellor 2026 | India's #1 College Admission & Counseling Platform",
  titleTemplate: "%s | Apna Counsellor 2026",
  description: "Empowering students to secure seats in India's top colleges. India's top expert guidance for JoSAA Counselling 2026, NEET UG Counselling 2026, and MHT CET Counselling CAP Rounds. Get rank predictors and dynamic alerts. #JoSAA2026 #NEETUG2026 #MHTCET2026",
  canonical: "https://www.apnacounsellor.in",
  keywords: [
    "Apna Counsellor", 
    "JoSAA Counselling 2026", 
    "NEET UG Counselling 2026", 
    "MHT CET Counselling 2026", 
    "Maharashtra CAP Rounds 2026",
    "college admission guide India", 
    "JoSAA cutoff", 
    "NEET UG admission", 
    "MBA college predictor", 
    "engineering admission expert", 
    "CAP rounds help", 
    "top colleges in India",
    "college comparison", 
    "rank predictor",
    "#JoSAA2026",
    "#NEETUG2026",
    "#MHTCET2026",
    "#ApnaCounsellor"
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.apnacounsellor.in',
    siteName: 'Apna Counsellor',
    title: "Apna Counsellor 2026 | India's #1 Admission Partner (JoSAA, NEET UG, MHT CET)",
    description: "Join 50,000+ students navigating their dream college admissions with AI precision for JoSAA, NEET UG, and MHT CET. #JoSAA2026 #NEETUG2026 #MHTCET2026",
    images: [
      {
        url: 'https://www.apnacounsellor.in/images/landing-preview-v3.png',
        width: 1200,
        height: 630,
        alt: 'Apna Counsellor - India\'s #1 Admission Partner',
      },
    ],
  },
  twitter: {
    handle: '@apnacounsellor',
    site: '@apnacounsellor',
    cardType: 'summary_large_image',
  },
};

// 2. Core Converter that maps next-seo structure directly into Next.js App Router Metadata
export function nextSeoToMetadata(props: NextSeoProps): Metadata {
  const merged = {
    ...defaultSeoConfig,
    ...props,
    keywords: Array.from(new Set([
      ...(defaultSeoConfig.keywords || []),
      ...(props.keywords || [])
    ])).filter(Boolean),
    openGraph: {
      ...defaultSeoConfig.openGraph,
      ...props.openGraph,
      images: props.openGraph?.images || defaultSeoConfig.openGraph?.images
    },
    twitter: {
      ...defaultSeoConfig.twitter,
      ...props.twitter
    }
  };

  const title = merged.title 
    ? (merged.titleTemplate ? merged.titleTemplate.replace('%s', merged.title) : merged.title)
    : (merged.defaultTitle || '');

  const isRobotsIndexed = !merged.noindex;
  const isRobotsFollowed = !merged.nofollow;

  return {
    title,
    description: merged.description,
    keywords: merged.keywords,
    metadataBase: new URL('https://www.apnacounsellor.in'),
    alternates: {
      canonical: merged.canonical,
    },
    icons: {
      icon: '/icon.png',
      shortcut: '/icon.png',
      apple: '/icon.png',
    },
    openGraph: {
      title,
      description: merged.openGraph?.description || merged.description,
      url: merged.openGraph?.url || merged.canonical,
      siteName: merged.openGraph?.siteName,
      locale: merged.openGraph?.locale,
      type: 'website',
      images: merged.openGraph?.images?.map(img => ({
        url: img.url,
        width: img.width,
        height: img.height,
        alt: img.alt || title,
      }))
    },
    twitter: {
      card: merged.twitter?.cardType === 'summary_large_image' ? 'summary_large_image' : 'summary',
      site: merged.twitter?.site,
      creator: merged.twitter?.handle,
      title,
      description: merged.openGraph?.description || merged.description,
      images: merged.openGraph?.images?.map(img => img.url) || []
    },
    robots: {
      index: isRobotsIndexed,
      follow: isRobotsFollowed,
      googleBot: {
        index: isRobotsIndexed,
        follow: isRobotsFollowed,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
