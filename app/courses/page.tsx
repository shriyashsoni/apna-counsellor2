import type { Metadata } from "next"
import CoursesClientPage from "./CoursesClientPage"

export const metadata: Metadata = {
  title: "Engineering Counselling Batches (MHT CET, JoSAA, COMEDK) | Apna Counsellor",
  description:
    "Join India's top counselling batches for MHT CET, JoSAA, COMEDK, and MP DTE. Get expert guidance, college predictors, and premium study materials.",
  keywords:
    "MHT CET course, counselling batch COMEDK, JoSAA choice filling, MP DTE counselling, engineering admissions, best college predictor, #MHTCET, #JoSAA, #COMEDK, Apna Counsellor batches",
  openGraph: {
    title: "Engineering Counselling Batches (MHT CET, JoSAA, COMEDK)",
    description: "Discover affordable, expert-led courses to master college admissions – MHT CET, JEE, MP DTE, COMEDK and more.",
    url: "https://www.apnacounsellor.in/courses",
    siteName: "Apna Counsellor",
    images: [
      {
        url: "https://www.apnacounsellor.in/images/counseling-preview-v3.png",
        width: 1200,
        height: 630,
        alt: "Apna Counsellor Counselling Courses",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Counselling Batches (MHT CET, JoSAA, COMEDK)",
    description: "Discover affordable, expert-led courses to master college admissions.",
    images: ["https://www.apnacounsellor.in/images/counseling-preview-v3.png"],
  }
}

export default function CoursesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Course",
          "name": "MHT CET Counselling Batch",
          "url": "https://www.apnacounsellor.in/courses"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Course",
          "name": "JoSAA Choice Filling Course",
          "url": "https://www.apnacounsellor.in/courses"
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "Course",
          "name": "COMEDK Guidance Program",
          "url": "https://www.apnacounsellor.in/courses"
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CoursesClientPage />
    </>
  )
}
