export function generateMeta(data: {
  title: string
  description: string
  keywords: string[]
  slug: string
  image?: string
}) {
  let ogImage = `https://www.apnacounsellor.in/images/counseling-preview-v3.png`;
  
  if (data.image) {
    ogImage = data.image.startsWith('http') ? data.image : `https://www.apnacounsellor.in${data.image.startsWith('/') ? '' : '/'}${data.image}`;
  } else if (data.title.toLowerCase().includes('josaa') || data.title.toLowerCase().includes('jee')) {
    ogImage = `https://www.apnacounsellor.in/images/josaa-counselling.png`;
  } else if (data.title.toLowerCase().includes('mht') || data.title.toLowerCase().includes('cet')) {
    ogImage = `https://www.apnacounsellor.in/images/mht-cet-counselling.png`;
  } else if (data.title.toLowerCase().includes('comedk')) {
    ogImage = `https://www.apnacounsellor.in/images/comedk-counselling.png`;
  } else if (data.title.toLowerCase().includes('mp dte') || data.title.toLowerCase().includes('mpdte')) {
    ogImage = `https://www.apnacounsellor.in/images/mp-dte-counselling.png`;
  }

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
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${data.title} 2025`,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} 2025 | Apna Counsellor`,
      description: data.description.slice(0, 155),
      images: [ogImage]
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
