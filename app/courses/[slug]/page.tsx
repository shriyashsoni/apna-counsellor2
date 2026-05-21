import { createClient } from "@/lib/supabase/server"
import { Metadata } from "next"
import CourseDetailClient from "./CourseDetailClient"
import { notFound } from "next/navigation"

interface CoursePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const supabase = createClient()
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!course) {
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
}

export default async function CoursePage({ params }: CoursePageProps) {
  const supabase = createClient()
  
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !course) {
    notFound()
  }

  return <CourseDetailClient slug={params.slug} initialCourse={course} />
}
