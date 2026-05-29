import type { Metadata } from "next"
import ContactClientPage from "./ContactClientPage"
import { nextSeoToMetadata } from "@/lib/seo/next-seo"

export const metadata: Metadata = nextSeoToMetadata({
  title: "Contact Apna Counsellor – 24/7 Priority Support",
  description: "Have questions about your rank, college choices, or courses? Contact Apna Counsellor for expert admission guidance. Covers JoSAA, NEET, and MHT CET counselling support. #JoSAA2026 #NEETUG2026 #MHTCET2026",
  canonical: "https://www.apnacounsellor.in/contact",
  keywords: [
    "counseling helpline",
    "JoSAA priority help",
    "NEET advisor contact",
    "MHT CET counseling contact",
    "#JoSAA2026",
    "#NEETUG2026",
    "#MHTCET2026"
  ],
  openGraph: {
    url: "https://www.apnacounsellor.in/contact",
    title: "Contact Apna Counsellor – 24/7 Priority Support",
    description: "Have questions about your rank, college choices, or courses? Contact Apna Counsellor for expert admission guidance.",
    images: [
      {
        url: "https://www.apnacounsellor.in/images/counseling-preview-v3.png",
        width: 1200,
        height: 630,
        alt: "Contact Apna Counsellor Support",
      }
    ]
  }
});

export default function ContactPage() {
  return <ContactClientPage />
}
