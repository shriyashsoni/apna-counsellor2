import type { Metadata } from "next"
import CounsellingClientPage from "./CounsellingClientPage"
import { getAllCounsellingData } from "@/lib/counselling"
import { nextSeoToMetadata } from "@/lib/seo/next-seo"

export const metadata: Metadata = nextSeoToMetadata({
  title: "All Admission Counselling Platforms 2026 – Apna Counsellor",
  description: "Explore 200+ national, state, and international counselling platforms for engineering, medical, and global B-school admissions. AI-optimized guidance for JoSAA, NEET UG, and MHT CET CAP Rounds 2026. #JoSAA2026 #NEETUG2026 #MHTCET2026",
  canonical: "https://www.apnacounsellor.in/counselling",
  keywords: [
    "counseling admission directory",
    "national counseling systems",
    "state admission portals",
    "JoSAA Counselling 2026",
    "NEET UG Counselling 2026",
    "MHT CET Counselling 2026",
    "#JoSAA2026",
    "#NEETUG2026",
    "#MHTCET2026"
  ],
  openGraph: {
    url: "https://www.apnacounsellor.in/counselling",
    title: "All Admission Counselling Platforms 2026 – Apna Counsellor",
    description: "Explore 200+ national, state, and international counselling platforms for engineering, medical, and global B-school admissions.",
    images: [
      {
        url: "https://www.apnacounsellor.in/images/counseling-preview-v3.png",
        width: 1200,
        height: 630,
        alt: "Apna Counsellor Counselling Platforms",
      }
    ]
  }
});

export default async function CounsellingPage() {
  const counsellingData = await getAllCounsellingData()
  return <CounsellingClientPage platforms={counsellingData} />
}
