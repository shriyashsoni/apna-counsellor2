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

    return {
      title: `${course.title} | Apna Counsellor`,
      description: course.description || `Complete counselling guidance for ${course.category || 'students'}`,
      openGraph: {
        title: course.title,
        description: course.description || `Complete counselling guidance for ${course.category || 'students'}`,
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
        description: course.description || `Complete counselling guidance for ${course.category || 'students'}`,
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

  return <CourseDetailClient slug={params.slug} initialCourse={course} />
}

