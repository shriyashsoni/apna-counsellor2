import { getCounsellingData, getAllCounsellingIds } from "@/lib/counselling"
import { notFound } from "next/navigation"
import CounsellingDetailClient from "./CounsellingDetailClient"
import type { Metadata } from "next"

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getCounsellingData(params.id)
  if (!data) return { title: "Counselling Not Found" }

  return {
    title: `${data.name} 2026 – AI-Optimized Counselling | Apna Counsellor`,
    description: `Get real-time updates, college lists, and personalized strategy for ${data.name} counselling 2026. Join 1200+ successful students.`,
  }
}

export async function generateStaticParams() {
  const ids = await getAllCounsellingIds()
  return ids.map((id) => ({ id }))
}

export default async function CounsellingDetailPage({ params }: Props) {
  const data = await getCounsellingData(params.id)

  if (!data) {
    notFound()
  }

  return <CounsellingDetailClient data={data} />
}
