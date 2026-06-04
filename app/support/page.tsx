import { Metadata } from "next"
import { SupportClientPage } from "./support-client-page"
import { nextSeoToMetadata } from "@/lib/seo/next-seo"

export const metadata: Metadata = nextSeoToMetadata({
  title: "Help & Support | Apna Counsellor",
  description: "Get 24/7 assistance with your engineering and medical college admissions. Contact the Apna Counsellor support team for mentorship, counseling, and technical queries.",
  canonical: "https://www.apnacounsellor.in/support",
  openGraph: {
    url: "https://www.apnacounsellor.in/support",
    title: "Help & Support | Apna Counsellor",
    description: "Contact the Apna Counsellor support team for mentorship, counseling, and technical queries.",
    images: [
      {
        url: "https://www.apnacounsellor.in/images/counseling-preview-v3.png",
        width: 1200,
        height: 630,
        alt: "Apna Counsellor Support",
      }
    ]
  }
});

export default function SupportPage() {
  return <SupportClientPage />
}
