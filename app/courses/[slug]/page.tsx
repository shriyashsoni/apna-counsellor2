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
      title: "Course Not Found",
      description: "The requested course could not be found."
    }
  }

  return {
    title: `${course.title} | Apna Counsellor`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: course.thumbnail_url ? [course.thumbnail_url] : ['/images/default-course-og.png'],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: course.title,
      description: course.description,
      images: course.thumbnail_url ? [course.thumbnail_url] : ['/images/default-course-og.png'],
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
