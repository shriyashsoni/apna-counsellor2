"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, ArrowRight, PlayCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function CoursesSection() {
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadCourses() {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(3)
          
        if (data) {
          setCourses(data)
        }
      } catch (err) {
        console.error("Error loading courses:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadCourses()
  }, [])

  if (isLoading) {
    return (
      <section className="py-24 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="animate-spin h-10 w-10 text-purple-600" />
        </div>
      </section>
    )
  }

  if (courses.length === 0) return null

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
            Premium Programs
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Admission <span className="text-purple-600">Courses</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Step-by-step guidance programs to help you secure the best college seat with your rank.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full flex flex-col border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-xl overflow-hidden bg-white dark:bg-slate-900 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                {/* Banner Image */}
                {course.thumbnail_url ? (
                  <div className="relative w-full aspect-video border-b border-slate-100 dark:border-slate-800">
                    <Image
                      src={course.thumbnail_url}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    {course.is_free && (
                      <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        Free
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 flex items-center justify-center border-b border-slate-100 dark:border-slate-800">
                    <Award className="h-16 w-16 text-purple-200 dark:text-purple-800/50" />
                  </div>
                )}

                <CardHeader className="p-6 pb-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-black text-[10px] uppercase px-2 py-1 rounded-md">
                      {course.category || 'Counselling'}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-black text-slate-900 dark:text-white leading-tight line-clamp-2">
                    {course.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 flex-grow">
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 font-medium mb-4">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <PlayCircle className="h-4 w-4 text-purple-500" />
                    <span>{course.total_lessons || '15+'} Lessons Included</span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-auto">
                  <div>
                    {course.is_free ? (
                      <p className="text-xl font-black text-emerald-500">FREE</p>
                    ) : (
                      <p className="text-xl font-black text-slate-900 dark:text-white">₹{Number(course.price).toLocaleString()}</p>
                    )}
                  </div>
                  <Link href={`/courses/${course.slug}`}>
                    <Button variant="ghost" className="rounded-xl font-black text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      Details <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/courses">
            <Button size="lg" className="rounded-2xl px-10 h-14 font-black text-lg shadow-xl shadow-purple-500/20 bg-purple-600 hover:bg-purple-700 text-white">
              View All Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
