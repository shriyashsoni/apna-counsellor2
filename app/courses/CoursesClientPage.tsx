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
          ) : courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border border-slate-100 dark:border-slate-800 rounded-[3rem] shadow-xl overflow-hidden bg-white dark:bg-slate-900/40 backdrop-blur-md">
                <CardHeader className="p-8 md:p-12 pb-6 border-b border-slate-50 dark:border-slate-800">
                  <div className="flex flex-col md:flex-row md:items-center gap-8">
                    <div className="h-24 w-24 rounded-[2rem] bg-purple-50 dark:bg-purple-900/10 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0 mx-auto md:mx-0 shadow-inner">
                      <Award className="h-12 w-12" />
                    </div>
                    <div className="text-center md:text-left space-y-2">
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <Badge className="bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border-none font-black text-[10px] uppercase">{course.category || 'Counselling'}</Badge>
                        <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none font-black text-[10px] uppercase">{course.level || 'Beginner'}</Badge>
                      </div>
                      <CardTitle className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{course.title}</CardTitle>
                      <p className="text-slate-500 dark:text-slate-400 font-semibold leading-relaxed max-w-2xl">{course.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                        Core Highlights
                      </h3>
                      <ul className="space-y-4">
                        {(course.highlights || [
                          "Live Interactive Choice-Filling Sessions",
                          "Full Access to College Predictors & Cutoffs",
                          "Personalized Mentor Q&A Backing",
                          "100% Accurate Admission Success Map"
                        ]).map((highlight: string, idx: number) => (
                          <li key={idx} className="flex items-start text-slate-600 dark:text-slate-400 font-bold text-sm">
                            <span className="h-2 w-2 rounded-full bg-purple-600 mt-2 mr-3 flex-shrink-0" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-6">
                      <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <PlayCircle className="h-5 w-5 text-purple-600" />
                        Curriculum Structure
                      </h3>
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                        {Array.isArray(course.curriculum) && course.curriculum.length > 0 ? (
                          course.curriculum.map((module: any, idx: number) => (
                            <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                              <span className="text-xs font-black text-slate-800 dark:text-slate-300">{module.title || `Module ${idx + 1}`}</span>
                              <Badge className="bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none font-bold text-[9px]">{module.lessons?.length || 0} Lessons</Badge>
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-400 text-xs font-bold py-4">Detailed modules available inside.</div>
                        )}
                      </div>
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fee</p>
                          <p className="text-4xl font-black text-slate-900 dark:text-white">₹{Number(course.price).toLocaleString()}</p>
                        </div>
                        <div className="text-right text-xs font-bold text-slate-400">
                          {course.duration_hours || '10+'} hours · {course.total_lessons || '15+'} lessons
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/20 p-8 border-t border-slate-50 dark:border-slate-800">
                  <div className="w-full max-w-sm text-center">
                    <Link href={`/courses/${course.slug}`} className="w-full">
                      <Button className="w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-md shadow-xl shadow-purple-100 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all">
                        View Course Details
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <p className="text-slate-400 text-xs font-bold mt-3">Secure checkout backed by Razorpay</p>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
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

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {children}
    </span>
  )
}
