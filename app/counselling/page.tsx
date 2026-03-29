import type { Metadata } from "next"
import CounsellingClientPage from "./CounsellingClientPage"

export const metadata: Metadata = {
  title: "Counselling Platforms – MHT CET, JEE, MP DTE, COMEDK",
  description:
    "Get complete counselling support for top exams like MHT CET, JEE, MP DTE & COMEDK. Join WhatsApp groups, get updates, documents list & top college advice.",
  keywords:
    "MHT CET counselling 2025, JoSAA counselling 2025, MP DTE admission 2025, COMEDK guidance, entrance exam counselling, college list, counselling help",
}

export default function CounsellingPage() {
  return <CounsellingClientPage />
}
