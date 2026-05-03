import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Outfit } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { getCategorizedCounselling, type CategorizedCounselling } from "@/lib/counselling"
import LayoutWrapper from "@/components/layout-wrapper"
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' })
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' })

export const viewport: Viewport = {
  themeColor: "#6d28d9",
  colorScheme: "light dark",
}

export const metadata: Metadata = {
  title: {
    default: "Apna Counsellor | India's #1 College Admission & Counseling Platform",
    template: "%s | Apna Counsellor"
  },
  description:
    "Empowering students to secure seats in India's top colleges. Expert guidance for MHT-CET, JEE, NEET, and MBA admissions with AI-driven predictors and personalized mentorship.",
  keywords: [
    "Apna Counsellor", "college admission guide India", "MHT CET counseling 2025", 
    "JoSAA cutoff 2025", "NEET UG admission", "MBA college predictor", 
    "engineering admission expert", "CAP rounds help", "top colleges in India",
    "college comparison", "rank predictor 2025"
  ],
  metadataBase: new URL('https://apnacounsellor.in'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://apnacounsellor.in',
    siteName: 'Apna Counsellor',
    title: "Apna Counsellor | India's #1 Admission Partner",
    description: "Join 50,000+ students navigating their dream college admissions with AI precision.",
    images: [
      {
        url: '/images/landing-preview-v3.png',
        width: 1200,
        height: 630,
        alt: 'Apna Counsellor - India\'s #1 Admission Partner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@apnacounsellor',
    creator: '@apnacounsellor',
    images: ['/images/landing-preview-v3.png'],
  },
  verification: {
    google: "XiIvcBHSzEY9KT6NPb2TYpfz-KEgACNLUk_mb6qsd94",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let categorizedCounselling: CategorizedCounselling = { national: [], state: [], international: [] };
  try {
    categorizedCounselling = await getCategorizedCounselling()
  } catch (error) {
    console.error("Failed to fetch counselling data:", error);
  }

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Apna Counsellor",
    "url": "https://apnacounsellor.in",
    "logo": "https://apnacounsellor.in/images/apna-counsellor-logo.png",
    "description": "Leading Indian platform for college admissions and counseling guidance. We provide data-driven insights for engineering, medical, and management courses.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Jabalpur",
      "addressRegion": "Madhya Pradesh",
      "postalCode": "482001",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://twitter.com/apnacounsellor",
      "https://www.linkedin.com/company/apnacounsellor",
      "https://www.instagram.com/apnacounsellor",
      "https://www.facebook.com/apnacounsellor"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-XXXXXXXXXX",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi"]
    }
  };

  const searchSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://apnacounsellor.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://apnacounsellor.in/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en-IN" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <Script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <Script
          id="search-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(searchSchema) }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5711051199759574"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LayoutWrapper categorizedCounselling={categorizedCounselling}>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
