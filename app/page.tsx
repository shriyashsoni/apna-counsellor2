import ClientPage from "./ClientPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Apna Counsellor – India's #1 Admission Guidance Platform",
  description:
    "Get expert guidance for MHT CET, JEE (JoSAA), MP DTE & COMEDK counselling. Use free tools like college predictors, cutoff analysis & more.",
  keywords:
    "Apna Counsellor, college admission help, MHT CET counselling, JEE JoSAA 2025, MP DTE 2025, COMEDK counselling, college predictor, admission expert, CAP rounds guidance",
}

export default function Home() {
  return <ClientPage />
}
