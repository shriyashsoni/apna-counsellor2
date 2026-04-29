import type { Metadata } from "next"
import CounsellingClientPage from "./CounsellingClientPage"
import { getAllCounsellingData } from "@/lib/counselling"

export const metadata: Metadata = {
  title: "All Counselling Platforms 2026 – Apna Counsellor",
  description:
    "Explore 200+ national and international counselling platforms for engineering, medical, and global admissions. AI-optimized guidance for students.",
}

export default async function CounsellingPage() {
  const counsellingData = await getAllCounsellingData()
  return <CounsellingClientPage platforms={counsellingData} />
}
