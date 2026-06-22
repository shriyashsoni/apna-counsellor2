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

import { nextSeoToMetadata } from "@/lib/seo/next-seo"

export const metadata: Metadata = nextSeoToMetadata({});


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
    "url": "https://www.apnacounsellor.in",
    "logo": "https://www.apnacounsellor.in/images/apna-counsellor-logo.png",
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
      "telephone": "+91-9340059530",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi"]
    }
  };

  const searchSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://www.apnacounsellor.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.apnacounsellor.in/search?q={search_term_string}",
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
        <Script
          id="adsense"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5711051199759574"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-H0WWTDSP51"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H0WWTDSP51');
          `}
        </Script>
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
