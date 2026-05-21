import type { Metadata } from "next"
import ContactClientPage from "./ContactClientPage"

export const metadata: Metadata = {
  title: "Contact Apna Counsellor – 24/7 Priority Support",
  description: "Have questions about your rank, college choices, or courses? Contact Apna Counsellor for expert admission guidance.",
  openGraph: {
    title: "Contact Apna Counsellor – 24/7 Priority Support",
    description: "Have questions about your rank, college choices, or courses? Contact Apna Counsellor for expert admission guidance.",
    url: "https://www.apnacounsellor.in/contact",
    siteName: "Apna Counsellor",
    images: [
      {
        url: "https://www.apnacounsellor.in/images/counseling-preview-v3.png",
        width: 1200,
        height: 630,
        alt: "Contact Apna Counsellor",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Apna Counsellor – 24/7 Priority Support",
    description: "Contact Apna Counsellor for expert admission guidance.",
    images: ["https://www.apnacounsellor.in/images/counseling-preview-v3.png"],
  }
}

export default function ContactPage() {
  return <ContactClientPage />
}
