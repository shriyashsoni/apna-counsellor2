import type { Metadata } from "next"
import CoursesClientPage from "./CoursesClientPage"

export const metadata: Metadata = {
  title: "JoSAA 2026 | COMEDK 2026 | MPDTE 2026 Choice Filling List – Apna Counsellor",
  description:
    "Get your personalized Choice Filling List for JoSAA 2026, COMEDK 2026, and MPDTE 2026. Expert counselling guidance with Dream, Target & Safe college recommendations. Starting ₹499.",
  keywords:
    "JoSAA 2026 choice filling list, COMEDK 2026 choice filling list, MPDTE 2026 choice filling list, JoSAA counselling 2026, COMEDK counselling 2026, MP DTE counselling 2026, JEE Main college list, IIT NIT IIIT GFTI preference order, engineering admission 2026, college counselling India, Apna Counsellor, personalized college preference order, Dream Target Safe college list",
  alternates: {
    canonical: "https://www.apnacounsellor.in/courses",
  },
  openGraph: {
    title: "JoSAA 2026 | COMEDK 2026 | MPDTE 2026 – Choice Filling List | Apna Counsellor",
    description:
      "Personalized Choice Filling Lists for JoSAA, COMEDK, and MPDTE 2026. Get Dream, Target & Safe college recommendations based on your rank. Starting at ₹499.",
    url: "https://www.apnacounsellor.in/courses",
    siteName: "Apna Counsellor",
    images: [
      {
        url: "https://www.apnacounsellor.in/images/counseling-preview-v3.png",
        width: 1200,
        height: 630,
        alt: "Apna Counsellor – JoSAA COMEDK MPDTE Choice Filling List 2026",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JoSAA 2026 | COMEDK 2026 | MPDTE 2026 – Choice Filling Lists",
    description: "Personalized college preference lists starting ₹499. Dream, Target & Safe colleges.",
    images: ["https://www.apnacounsellor.in/images/counseling-preview-v3.png"],
    site: "@apnacounsellor",
    creator: "@apnacounsellor",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
}

const BASE_URL = "https://www.apnacounsellor.in";

export default function CoursesPage() {
  // ── 1. ItemList schema listing the 3 featured courses ─────────────────────
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Apna Counsellor – Choice Filling Lists 2026",
    "description": "Personalized counselling guidance for JoSAA, COMEDK, and MPDTE 2026",
    "url": `${BASE_URL}/courses`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Course",
          "name": "JoSAA 2026 Choice Filling List",
          "description": "Personalized JoSAA 2026 choice filling PDF with IIT, NIT, IIIT, GFTI recommendations based on your JEE Main/Advanced rank.",
          "url": `${BASE_URL}/courses/josaa-choice-filling-list-2026`,
          "provider": { "@type": "Organization", "name": "Apna Counsellor", "url": BASE_URL },
          "offers": { "@type": "Offer", "price": "799", "priceCurrency": "INR", "availability": "https://schema.org/InStock" }
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Course",
          "name": "COMEDK 2026 Choice Filling List",
          "description": "Personalized COMEDK 2026 choice filling PDF with Dream, Target & Safe college recommendations based on your rank.",
          "url": `${BASE_URL}/courses/comedk-2026-choice-filling-list`,
          "provider": { "@type": "Organization", "name": "Apna Counsellor", "url": BASE_URL },
          "offers": { "@type": "Offer", "price": "799", "priceCurrency": "INR", "availability": "https://schema.org/InStock" }
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "Course",
          "name": "MPDTE 2026 Choice Filling List",
          "description": "Personalized MPDTE 2026 choice filling PDF using 5-year cutoff analysis, rank trends & seat matrix for Madhya Pradesh engineering admissions.",
          "url": `${BASE_URL}/courses/mpdte-2026-choice-filling-list`,
          "provider": { "@type": "Organization", "name": "Apna Counsellor", "url": BASE_URL },
          "offers": { "@type": "Offer", "price": "499", "priceCurrency": "INR", "availability": "https://schema.org/InStock" }
        }
      }
    ]
  };

  // ── 2. FAQ schema covering cross-course questions ─────────────────────────
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a Choice Filling List for counselling?",
        "acceptedAnswer": { "@type": "Answer", "text": "A Choice Filling List is a personalized, data-driven PDF report that gives you Dream, Target, and Safe college recommendations arranged in the optimal preference order for your counselling process (JoSAA, COMEDK, or MPDTE)." }
      },
      {
        "@type": "Question",
        "name": "What is the price of JoSAA 2026 Choice Filling List?",
        "acceptedAnswer": { "@type": "Answer", "text": "The JoSAA 2026 Choice Filling List by Apna Counsellor is priced at ₹799 only." }
      },
      {
        "@type": "Question",
        "name": "What is the price of COMEDK 2026 Choice Filling List?",
        "acceptedAnswer": { "@type": "Answer", "text": "The COMEDK 2026 Choice Filling List by Apna Counsellor is priced at ₹799 only." }
      },
      {
        "@type": "Question",
        "name": "What is the price of MPDTE 2026 Choice Filling List?",
        "acceptedAnswer": { "@type": "Answer", "text": "The MPDTE 2026 Choice Filling List by Apna Counsellor is priced at ₹499 only." }
      },
      {
        "@type": "Question",
        "name": "How is the choice filling list prepared by Apna Counsellor?",
        "acceptedAnswer": { "@type": "Answer", "text": "Apna Counsellor prepares the list using 5-year cutoff analysis, seat matrix data, rank trends, and expert counselling insights tailored to your rank, category, quota, and branch preferences." }
      },
      {
        "@type": "Question",
        "name": "Who should buy the JoSAA 2026 Choice Filling List?",
        "acceptedAnswer": { "@type": "Answer", "text": "Any student who has qualified JEE Main 2026 or JEE Advanced 2026 and wants to participate in JoSAA counselling should buy this list to maximize their chances of getting into an IIT, NIT, IIIT, or GFTI." }
      }
    ]
  };

  // ── 3. BreadcrumbList schema ───────────────────────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Courses & Choice Filling Lists", "item": `${BASE_URL}/courses` }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <CoursesClientPage />
    </>
  )
}
