export function generateMeta(data: {
  title: string
  description: string
  keywords: string[]
  slug: string
}) {
  return {
    title: `${data.title} 2025 | Apna Counsellor`,
    description: data.description.slice(0, 155),
    keywords: data.keywords,
    alternates: {
      canonical: `https://www.apnacounsellor.in/${data.slug}`,
    },
    openGraph: {
      title: `${data.title} 2025 | Apna Counsellor`,
      description: data.description.slice(0, 155),
      url: `https://www.apnacounsellor.in/${data.slug}`,
      siteName: "Apna Counsellor",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} 2025 | Apna Counsellor`,
      description: data.description.slice(0, 155),
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
