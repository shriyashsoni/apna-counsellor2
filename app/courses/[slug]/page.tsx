import { createClient } from "@/lib/supabase/server"
import { Metadata } from "next"
import CourseDetailClient from "./CourseDetailClient"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic";

interface CoursePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  try {
    const supabase = createClient()
    const { data: course, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (error || !course) {
      return {
        title: "Course Not Found | Apna Counsellor",
        description: "The requested course could not be found."
      }
    }

    // Ensure absolute URL for social preview
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://apnacounsellor.in';
    
    let ogImageUrl = `${baseUrl}/images/default-course-og.png`;
    if (course.thumbnail_url) {
      ogImageUrl = course.thumbnail_url.startsWith('http') 
        ? course.thumbnail_url 
        : `${baseUrl}${course.thumbnail_url.startsWith('/') ? '' : '/'}${course.thumbnail_url}`;
    }
    
    const courseUrl = `${baseUrl}/courses/${course.slug}`;

    // Strip HTML tags from description for clean social preview text
    const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()
    const cleanDescription = course.tagline 
      || (course.description ? stripHtml(course.description).substring(0, 160) : null)
      || `Complete counselling guidance for ${course.category || 'students'} by Apna Counsellor.`

    // Dynamic High-Value SEO Keywords based on course title
    const keywords = [
      course.title,
      course.category,
      "Counselling Batch 2026",
      "JEE Mains Counselling",
      "JoSAA Choice Filling",
      "MHT CET Admission Process",
      "COMEDK Guidance",
      "Engineering Admissions",
      "Top Engineering Colleges",
      "Apna Counsellor Premium",
      course.title.split(' ').map((w: string) => `#${w.replace(/[^a-zA-Z0-9]/g, '')}`).join(' ') // Dynamic Hashtags
    ].filter(Boolean).join(", ");

    return {
      title: `${course.title} | Apna Counsellor - Top Admissions Prep`,
      description: cleanDescription,
      keywords: keywords,
      openGraph: {
        title: course.title,
        description: cleanDescription,
        url: courseUrl,
        siteName: 'Apna Counsellor',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: course.title,
          }
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: course.title,
        description: cleanDescription,
        images: [ogImageUrl],
      },
      alternates: {
        canonical: courseUrl
      }
    }
  } catch (err) {
    console.error("Error generating course metadata:", err)
    return {
      title: "Course Details | Apna Counsellor",
      description: "Explore our premium counselling support courses."
    }
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  let course = null;

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (error) {
      console.error("Supabase query error on course details:", error)
    } else {
      course = data
    }
  } catch (err) {
    console.error("Failed to fetch course details from Supabase:", err)
  }

  if (!course) {
    notFound()
  }

  // Generate highly optimized JSON-LD Structured Data for Google Indexing
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://apnacounsellor.in';
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.tagline || course.title,
    "provider": {
      "@type": "Organization",
      "name": "Apna Counsellor",
      "sameAs": baseUrl
    },
    "offers": {
      "@type": "Offer",
      "price": course.price || 0,
      "priceCurrency": "INR"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CourseDetailClient slug={params.slug} initialCourse={course} />
    </>
  )
}

