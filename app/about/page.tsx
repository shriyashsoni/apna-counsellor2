import type { Metadata } from "next"
import AboutClientPage from "./AboutClientPage"

export const metadata: Metadata = {
  title: "About Apna Counsellor – Your Admission Mentorship Partner",
  description:
    "Learn about Apna Counsellor – India's leading personalized counselling platform helping 1000+ students with college admissions, predictors, and choice filling.",
  keywords:
    "about Apna Counsellor, admission mentor, student guidance, college counselling platform, founder Shriyash Soni, best counselling India",
}

export default function AboutPage() {
  return <AboutClientPage />
}
