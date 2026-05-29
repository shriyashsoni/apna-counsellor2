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

  const title = `${data.name} Counselling 2026 | Admission Process & Guide`;
  const description = `Get real-time updates, cutoffs, seat matrices, and expert choice filling strategy for ${data.name} counselling 2026. Deep guidance for JoSAA, NEET UG, and MHT CET. #JoSAA2026 #NEETUG2026 #MHTCET2026`;
  const canonicalUrl = `https://www.apnacounsellor.in/counselling/${params.id}`;

  const trendingCounselings = [
    "JoSAA Counselling 2026",
    "NEET UG Counselling 2026",
    "MHT CET Counselling 2026",
    "Maharashtra CAP Rounds 2026",
    "College Admissions 2026"
  ];
  
  const trendingHashtags = [
    "#JoSAA2026",
    "#NEETUG2026",
    "#MHTCET2026",
    "#MaharashtraCAPRounds",
    "#ApnaCounsellor"
  ];

  return {
    title: `${title} | Apna Counsellor`,
    description: description.slice(0, 155),
    keywords: Array.from(new Set([
      data.name,
      `${data.name} 2026`,
      `${data.name} admission`,
      `${data.name} cutoff`,
      ...trendingCounselings,
      ...trendingHashtags,
      "college predictor",
      "admission guidance"
    ])).filter(Boolean),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | Apna Counsellor`,
      description: description.slice(0, 155),
      url: canonicalUrl,
      siteName: "Apna Counsellor",
      type: "website",
      images: [
        {
          url: "https://www.apnacounsellor.in/images/counseling-preview-v3.png",
          width: 1200,
          height: 630,
          alt: `${data.name} Counselling 2026`,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Apna Counsellor`,
      description: description.slice(0, 155),
      images: ["https://www.apnacounsellor.in/images/counseling-preview-v3.png"],
      site: "@apnacounsellor",
      creator: "@apnacounsellor"
    },
    robots: {
      index: true,
      follow: true,
    }
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
