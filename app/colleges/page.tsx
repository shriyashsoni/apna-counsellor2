import { Metadata } from "next"
import CollegesClientPage from "./CollegesClientPage"
import { nextSeoToMetadata } from "@/lib/seo/next-seo"

export const metadata: Metadata = nextSeoToMetadata({
  title: "Explore 70,000+ Colleges | JoSAA, NEET & MHT CET Cutoffs 2026",
  description: "Find your dream college! Explore cutoffs, fee structures, reviews, placement packages, and seat allocation trends for IITs, NITs, and medical colleges. Includes JoSAA, NEET, and MHT CET CAP Rounds 2026. #JoSAA2026 #NEETUG2026 #MHTCET2026",
  canonical: "https://www.apnacounsellor.in/colleges",
  keywords: [
    "top engineering colleges India",
    "top medical colleges India",
    "IIT fees structure",
    "NIT average placement packages",
    "NIRF ranking 2026",
    "JoSAA choice filling college list",
    "NEET UG seat matrix",
    "MHT CET engineering colleges",
    "#JoSAA2026",
    "#NEETUG2026",
    "#MHTCET2026"
  ],
  openGraph: {
    url: "https://www.apnacounsellor.in/colleges",
    title: "Explore 70,000+ Colleges | JoSAA, NEET & MHT CET Cutoffs 2026",
    description: "Compare fees, average packages, and check dynamic seat matrix predictions for 2026 college admissions. Secure your seat in India's premier institutions. #JoSAA2026 #NEETUG2026 #MHTCET2026",
    images: [
      {
        url: "https://www.apnacounsellor.in/images/landing-preview-v3.png",
        width: 1200,
        height: 630,
        alt: "Explore 70,000+ Colleges - Apna Counsellor",
      }
    ]
  }
});

export default function CollegesPage() {
  return <CollegesClientPage />
}
