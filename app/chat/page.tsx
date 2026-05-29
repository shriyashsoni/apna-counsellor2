import { Metadata } from "next"
import ChatClientPage from "./ChatClientPage"
import { nextSeoToMetadata } from "@/lib/seo/next-seo"

export const metadata: Metadata = nextSeoToMetadata({
  title: "AI Counseling Assistant 2026 | Free JoSAA, NEET & MHT CET Help",
  description: "Ask our advanced AI admissions expert anything! Free instant advice for JoSAA cutoff predictions, NEET UG college predictor, and MHT CET CAP Rounds 2026. #JoSAA2026 #NEETUG2026 #MHTCET2026",
  canonical: "https://www.apnacounsellor.in/chat",
  keywords: [
    "AI college counselor",
    "JoSAA cutoff query",
    "NEET UG rank analysis",
    "MHT CET choice filling advisor",
    "admission chatbot",
    "#JoSAA2026",
    "#NEETUG2026",
    "#MHTCET2026"
  ],
  openGraph: {
    url: "https://www.apnacounsellor.in/chat",
    title: "AI Admission Counselor Assistant 2026 – JoSAA, NEET & MHT CET Help",
    description: "Get real-time, data-backed answers on seat matrix, choice filling strategy, and expected cutoffs. Covers JoSAA, NEET UG, and MHT CET CAP Rounds. #JoSAA2026 #NEETUG2026 #MHTCET2026",
    images: [
      {
        url: "https://www.apnacounsellor.in/images/counseling-preview-v3.png",
        width: 1200,
        height: 630,
        alt: "Apna Counsellor AI Assistant",
      }
    ]
  }
});

export default function ChatPage() {
  return <ChatClientPage />
}
