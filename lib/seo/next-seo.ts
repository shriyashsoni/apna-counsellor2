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
  description: "India's #1 expert counselling platform. Get personalized JoSAA 2026 Choice Filling List, COMEDK 2026 Choice Filling List, MPDTE 2026 Choice Filling List, and guidance for NEET UG, MHT CET & more. Dream, Target & Safe college recommendations. Starting ₹499.",
  canonical: "https://www.apnacounsellor.in",
  keywords: [
    "Apna Counsellor",
    // JoSAA
    "JoSAA Counselling 2026",
    "JoSAA 2026 choice filling list",
    "JoSAA cutoff 2026",
    "JEE Main counselling 2026",
    "IIT NIT IIIT GFTI college list 2026",
    // COMEDK
    "COMEDK counselling 2026",
    "COMEDK 2026 choice filling list",
    "COMEDK cutoff 2026",
    "Karnataka engineering admission 2026",
    // MPDTE
    "MPDTE counselling 2026",
    "MPDTE 2026 choice filling list",
    "MP DTE college preference list",
    "Madhya Pradesh engineering counselling 2026",
    // General
    "NEET UG Counselling 2026",
    "MHT CET Counselling 2026",
    "Maharashtra CAP Rounds 2026",
    "college admission guide India",
    "personalized college preference order",
    "Dream Target Safe college list",
    "engineering admission expert",
    "rank predictor",
    "choice filling guidance",
    "top colleges in India",
    "#JoSAA2026",
    "#COMEDK2026",
    "#MPDTE2026",
    "#NEETUG2026",
    "#ApnaCounsellor"
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.apnacounsellor.in',
    siteName: 'Apna Counsellor',
    title: "Apna Counsellor 2026 | JoSAA, COMEDK, MPDTE Choice Filling Lists & Expert Guidance",
    description: "Get personalized JoSAA 2026, COMEDK 2026 & MPDTE 2026 choice filling lists. Dream, Target & Safe colleges. Join 50,000+ students. Starting ₹499.",
    images: [
      {
        url: 'https://www.apnacounsellor.in/images/landing-preview-v3.png',
        width: 1200,
        height: 630,
        alt: 'Apna Counsellor - JoSAA COMEDK MPDTE Choice Filling List 2026',
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
