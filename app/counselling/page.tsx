import type { Metadata } from "next"
import CounsellingClientPage from "./CounsellingClientPage"
import { getAllCounsellingData } from "@/lib/counselling"

export const metadata: Metadata = {
  title: "All Counselling Platforms 2026 – Apna Counsellor",
  description:
    "Explore 200+ national and international counselling platforms for engineering, medical, and global admissions. AI-optimized guidance for students.",
  openGraph: {
    title: "All Counselling Platforms 2026 – Apna Counsellor",
    description: "Explore 200+ national and international counselling platforms for engineering, medical, and global admissions.",
    url: "https://www.apnacounsellor.in/counselling",
    siteName: "Apna Counsellor",
    images: [
      {
        url: "https://www.apnacounsellor.in/images/counseling-preview-v3.png",
        width: 1200,
        height: 630,
        alt: "Apna Counsellor Counselling Platforms",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Counselling Platforms 2026 – Apna Counsellor",
    description: "Explore 200+ national and international counselling platforms.",
    images: ["https://www.apnacounsellor.in/images/counseling-preview-v3.png"],
  }
}

export default async function CounsellingPage() {
  const counsellingData = await getAllCounsellingData()
  return <CounsellingClientPage platforms={counsellingData} />
}
