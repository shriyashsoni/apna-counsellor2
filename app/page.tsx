import { Metadata } from "next"
import HomeClientPage from "./HomeClientPage"
import { nextSeoToMetadata } from "@/lib/seo/next-seo"

export const metadata: Metadata = nextSeoToMetadata({
  title: "Apna Counsellor 2026 | India's #1 JoSAA, NEET UG & MHT CET Counseling Platform",
  description: "India's leading platform for college admissions. Get expert guidance, AI predictors, and real-time alerts for JoSAA Counselling 2026, NEET UG Counselling 2026, and MHT CET / Maharashtra CAP Rounds. #JoSAA2026 #NEETUG2026 #MHTCET2026",
  canonical: "https://www.apnacounsellor.in",
  keywords: [
    "JoSAA Counselling 2026",
    "NEET UG Counselling 2026",
    "MHT CET Counselling 2026",
    "Maharashtra CAP Rounds 2026",
    "MHT CET choice filling",
    "JoSAA cutoff 2026",
    "NEET UG seat allotment",
    "engineering admission expert",
    "medical admission expert",
    "rank predictor 2026",
    "#JoSAA2026",
    "#NEETUG2026",
    "#MHTCET2026"
  ],
  openGraph: {
    url: "https://www.apnacounsellor.in",
    title: "Apna Counsellor 2026 | India's #1 JoSAA, NEET UG & MHT CET Counseling Platform",
    description: "Join 50,000+ students navigating their dream college admissions with AI precision for JoSAA 2026, NEET UG, and MHT CET. Get cutoff alerts and dynamic college predictors. #JoSAA2026 #NEETUG2026 #MHTCET2026",
    images: [
      {
        url: "https://www.apnacounsellor.in/images/landing-preview-v3.png",
        width: 1200,
        height: 630,
        alt: "Apna Counsellor - India's #1 Admissions Partner",
      }
    ]
  }
});

export default function HomePage() {
  return <HomeClientPage />
}
