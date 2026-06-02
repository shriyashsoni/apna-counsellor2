"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle, Gift, Phone, Mail, MapPin, Instagram, Loader2, Sparkles, Award, PlayCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function CoursesClientPage() {
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

  return (
    <div className="container mx-auto px-4 py-20 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:to-slate-950 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="h-4 w-4" /> Live Admission Courses
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
            Counselling & <br/><span className="text-purple-600">Admission Programs</span>
          </h1>
          <p className="text-lg max-w-3xl mx-auto text-slate-500 dark:text-slate-400 font-medium">
            Personalized, data-driven programs to guide you step-by-step through engineering, MBA, and NEET counselling.
            Secure your dream college seats with absolute confidence.
          </p>
        </motion.div>

        <div className="space-y-16">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin h-10 w-10 text-purple-600" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900/50 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm p-10">
              <h2 className="text-2xl font-black text-slate-300">New Courses Releasing Soon</h2>
              <p className="text-slate-500 mt-2 font-medium">Our admission specialists are busy assembling this year's batch programs. Stay tuned!</p>
            </div>
          ) : (
            <>
              {/* Section 1: Live & Top Courses */}
              {courses.filter(c => c.mode !== 'Data Course').length > 0 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                      Top Live Counselling Programs
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Real-time live interaction, personal choice-filling reviews, and mentor-led sessions.</p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.filter(c => c.mode !== 'Data Course').map((course, idx) => (
                      <CourseCard key={course.id} course={course} index={idx} />
                    ))}
                  </div>
                </div>
              )}

              {/* Section 2: Data Courses */}
              {courses.filter(c => c.mode === 'Data Course').length > 0 && (
                <div className="space-y-6 pt-6">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full bg-blue-500" />
                      Self-Paced & Data-Driven Courses
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Access our proprietary admission cutoff spreadsheets, algorithms, and video vaults.</p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.filter(c => c.mode === 'Data Course').map((course, idx) => (
                      <CourseCard key={course.id} course={course} index={idx} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-20 bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
             <div>
                <h2 className="text-3xl font-black mb-4">Counselling Help Desk</h2>
                <p className="text-slate-400 font-semibold mb-6">Need help picking the right support course or have customized admission requirements?</p>
                <div className="flex gap-4">
                   <Link href="https://wa.link/cld3hu" target="_blank">
                      <Button className="rounded-xl h-12 px-6 bg-white text-black font-black hover:bg-slate-100">WhatsApp Us</Button>
                   </Link>
                   <Link href="/contact">
                      <Button variant="ghost" className="rounded-xl h-12 px-6 text-white border border-white/20 font-black hover:bg-white/5">Contact form</Button>
                   </Link>
                 </div>
              </div>
              <div className="space-y-4 md:pl-10 border-l border-white/10">
                 <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-purple-400" />
                    <div>
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Call/WhatsApp</p>
                       <p className="text-sm font-black">+91 9109881906</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-purple-400" />
                    <div>
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Email Address</p>
                       <p className="text-sm font-black">apnacounsellor@gmail.com</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <Instagram className="h-5 w-5 text-purple-400" />
                    <div>
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Follow</p>
                       <p className="text-sm font-black">@counsellorapna</p>
                    </div>
                 </div>
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  )
}

function CourseCard({ course, index }: { course: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-xl overflow-hidden bg-white dark:bg-slate-900 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        {/* Banner Image */}
        {course.thumbnail_url ? (
          <div className="relative w-full aspect-video border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-contain"
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
            {course.is_featured && (
              <span className="bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-black text-[10px] uppercase px-2 py-1 rounded-md">
                ★ FEATURED
              </span>
            )}
            {course.discount_badge && (
              <span className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase px-2 py-1 rounded-md">
                {course.discount_badge}
              </span>
            )}
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
        <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-auto pt-6">
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
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {children}
    </span>
  )
}
