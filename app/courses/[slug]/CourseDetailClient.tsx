"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { useRazorpay } from "@/hooks/use-razorpay"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Loader2, ArrowRight, ShieldCheck, CheckCircle2, Star, Sparkles, BookOpen, 
  MessageSquare, Calendar, Award, GraduationCap, Video, FileText, Download, Users, Lock, Unlock, Users2, Ticket, Quote
} from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import Marquee from "react-fast-marquee"

export default function CourseDetailClient({ slug, initialCourse }: { slug: string, initialCourse: any }) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { initiatePayment, isLoading: isPaying } = useRazorpay()
  
  const [course, setCourse] = useState<any>(initialCourse)
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false)
  const [loading, setLoading] = useState(!initialCourse)
  const supabase = createClient()

  useEffect(() => {
    async function loadCourseDetails() {
      if (!slug) return
      try {
        let currentCourse = initialCourse
        if (!currentCourse) {
          const { data: courseData, error } = await supabase
            .from('courses')
            .select('*')
            .eq('slug', slug)
            .single()
          
          if (courseData) {
            setCourse(courseData)
            currentCourse = courseData
          }
        }

        // Verify enrollment if user is logged in
        if (user?.id && currentCourse) {
          const { data: enrollData } = await supabase
            .from('course_enrollments')
            .select('id')
            .eq('course_id', currentCourse.id)
            .eq('student_id', user.id)
            .eq('status', 'active')
            .maybeSingle()
          
          if (enrollData) {
            setIsEnrolled(true)
          }
        }
      } catch (err) {
        console.error("Error loading course details:", err)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      loadCourseDetails()
    }
  }, [slug, user, authLoading, initialCourse])

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/courses/${slug}`)
      return
    }

    // If course is free, bypass Razorpay and enroll directly
    if (course.is_free || Number(course.price) === 0) {
      try {
        const enrollRes = await fetch('/api/courses/enroll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId: course.id,
            studentId: user?.id,
            paymentId: 'free_enrollment'
          })
        })
        const data = await enrollRes.json()
        if (data.success) {
          setIsEnrolled(true)
          router.push('/dashboard')
        }
      } catch (err) {
        console.error("Free enrollment failed", err)
      }
      return
    }

    try {
      // Initiate Razorpay payment
      await initiatePayment({
        amount: Number(course.price),
        name: "Apna Counsellor",
        description: course.title,
        prefill: {
          name: user?.name || "Student",
          email: user?.email || "",
        },
        metadata: {
          courseId: course.id,
          studentId: (user?.id ?? '') as string
        },
        onSuccess: async (response) => {
          const enrollRes = await fetch('/api/courses/enroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              courseId: course.id,
              studentId: user?.id,
              paymentId: response.razorpay_payment_id
            })
          })

          const data = await enrollRes.json()
          if (data.success) {
            setIsEnrolled(true)
            router.push('/dashboard')
          }
        }
      })
    } catch (err) {
      console.error("Checkout process aborted/failed:", err)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin h-10 w-10 text-purple-600 mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Program Details...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
          <BookOpen className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-black mb-2">Program Not Found</h1>
        <p className="text-slate-400 text-sm mb-6">The requested counselling course slug does not exist.</p>
        <Link href="/courses">
          <Button className="rounded-xl h-12 bg-white text-black font-black hover:bg-slate-100">Browse Active Courses</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white font-sans overflow-hidden">
      
      {/* CONTINUOUS SCROLLING BANNER */}
      <div className="bg-purple-600 py-3 border-y border-purple-500/50">
        <Marquee speed={60} gradient={false} className="overflow-hidden">
          <div className="flex items-center gap-12 text-sm font-black uppercase tracking-widest text-white px-8">
            <span className="flex items-center gap-2"><Sparkles className="h-4 w-4"/> Admissions Open 2025</span>
            <span className="flex items-center gap-2"><Award className="h-4 w-4"/> Limited Seats Available</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/> 100% Satisfaction</span>
            <span className="flex items-center gap-2"><Users className="h-4 w-4"/> Join 50,000+ Students</span>
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4"/> Verified Choice Filling</span>
          </div>
        </Marquee>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative py-16 lg:py-24 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="flex gap-2">
                <Badge className="bg-purple-900/40 text-purple-400 border border-purple-500/20 font-black text-[9px] uppercase tracking-wider px-3 py-1">{course.category || 'Counselling'}</Badge>
                {course.is_free ? (
                  <Badge className="bg-emerald-900/40 text-emerald-400 border border-emerald-500/20 font-black text-[9px] uppercase tracking-wider px-3 py-1">100% Free</Badge>
                ) : (
                  <Badge className="bg-slate-900 text-slate-400 border border-white/5 font-black text-[9px] uppercase tracking-wider px-3 py-1">{course.level || 'Expert Plan'}</Badge>
                )}
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">
                {course.title}
              </h1>
              <p className="text-lg text-slate-400 font-semibold leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex flex-wrap gap-6 pt-4 text-xs font-bold text-slate-400">
                <div className="flex items-center gap-2">
                  <Users2 className="h-5 w-5 text-purple-500" />
                  <span>{course.total_students || '1,200'}+ Enrolled</span>
                </div>
                {course.available_seats && (
                  <div className="flex items-center gap-2 text-amber-400">
                    <Ticket className="h-5 w-5" />
                    <span>Only {course.available_seats} Seats Left</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  <span>Interactive Worksheets</span>
                </div>
              </div>
            </div>

            {/* Price & Thumbnail Box */}
            <div className="lg:col-span-5">
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                  
                  {course.thumbnail_url && (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden relative border border-white/10 shadow-lg">
                      <Image 
                        src={course.thumbnail_url} 
                        alt={course.title} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Program Fee</p>
                      {course.is_free ? (
                        <p className="text-5xl font-black text-emerald-400 mt-1">FREE</p>
                      ) : (
                        <p className="text-5xl font-black text-white mt-1">₹{Number(course.price).toLocaleString()}</p>
                      )}
                    </div>
                    {!course.is_free && (
                      <div className="text-right text-xs font-bold text-slate-400">
                        Inclusive of GST
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <span>Live 1-on-1 Expert Backing</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <span>Smart choice lists & predict access</span>
                    </div>
                  </div>

                  {isEnrolled ? (
                    <Link href="/dashboard" className="w-full block">
                      <Button className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-md transition-all">
                        Already Enrolled — Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      onClick={handleEnroll} 
                      disabled={isPaying}
                      className={`w-full h-14 rounded-2xl text-white font-black text-md shadow-xl transition-all ${
                        course.is_free 
                          ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/30 hover:scale-[1.02]" 
                          : "bg-purple-600 hover:bg-purple-700 shadow-purple-900/30 hover:scale-[1.02]"
                      }`}
                    >
                      {isPaying ? <Loader2 className="animate-spin h-5 w-5" /> : (course.is_free ? "Enroll Now for Free" : "Subscribe & Enroll via Razorpay")}
                    </Button>
                  )}
                  
                  {!course.is_free && (
                    <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Instant activation on successful checkout</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURRICULUM & SYLLABUS */}
      <section className="py-24 container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-black text-center mb-16">Explore Course Curriculum</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-xl font-black text-purple-400 flex items-center gap-2">
              <BookOpen className="h-6 w-6" /> Modules & Action Steps
            </h3>
            <div className="space-y-4">
              {Array.isArray(course.curriculum) && course.curriculum.length > 0 ? (
                course.curriculum.map((mod: any, idx: number) => (
                  <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-md text-white">{mod.title || `Module ${idx + 1}`}</h4>
                        <p className="text-xs text-slate-400 mt-1 font-semibold">Step-by-step master lessons.</p>
                      </div>
                      <Badge className="bg-purple-900/40 text-purple-400 border-none font-bold text-[9px]">{mod.lessons?.length || 0} Lessons</Badge>
                    </div>
                    
                    {/* Render Lesson Level Permissions if available */}
                    {mod.lessons && mod.lessons.length > 0 && (
                      <div className="mt-2 space-y-2 pt-4 border-t border-white/5">
                        {mod.lessons.map((lesson: any, lIdx: number) => (
                           <div key={lIdx} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                              <span className="text-xs font-bold text-slate-300">{lesson.title || `Lesson ${lIdx + 1}`}</span>
                              {lesson.isFree || course.is_free ? (
                                <Badge className="bg-emerald-900/40 text-emerald-400 border-none font-black text-[9px] flex gap-1 items-center">
                                  <Unlock className="h-3 w-3" /> Preview
                                </Badge>
                              ) : (
                                <Badge className="bg-slate-900 text-slate-500 border-none font-black text-[9px] flex gap-1 items-center">
                                  <Lock className="h-3 w-3" /> Paid Material
                                </Badge>
                              )}
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-slate-500 italic">No structured modules defined. Contact helpdesk for updates.</div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-black text-purple-400 flex items-center gap-2">
              <Award className="h-6 w-6" /> Premium Benefits Included
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Personal Mentor', desc: '1-on-1 private WhatsApp connection' },
                { title: 'Syllabus/Rounds', desc: 'Detailed walkthrough of choice-filling list' },
                { title: 'Smart Predictor', desc: 'Advanced college prediction matrices' },
                { title: 'Resource Hub', desc: 'Curated PDFs, lists, cutoffs at one tap' },
              ].map((b, i) => (
                <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <CheckCircle2 className="h-6 w-6 text-purple-500 mx-auto mb-3" />
                  <h4 className="font-black text-sm text-white mb-1">{b.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. LAST YEAR & THIS YEAR MULTIPLE IMAGE GALLERY (HTML OUTCOME DISPLAY) */}
      <section className="py-24 bg-white/5 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-6xl space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">Our Legendary Outcomes</h2>
            <p className="text-slate-400 font-semibold max-w-2xl mx-auto">
              Real success stories of students who trusted Apna Counsellor and secured seats in premium IITs, NITs, and Government Engineering Colleges.
            </p>
          </div>

          {/* HTML gallery showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "IIT Bombay CSE Selection",
                batch: "Batch 2024 Outcome",
                description: "Student ranks elevated using AI preference choice filing lists, securing computer science seat at IIT Bombay.",
                bg: "from-blue-600 to-indigo-600"
              },
              {
                title: "VJTI Mumbai IT Allocation",
                batch: "Batch 2024 Outcome",
                description: "100% accurate cutoff prediction secured this prime seat in VJTI during CAP Round 2.",
                bg: "from-purple-600 to-pink-600"
              },
              {
                title: "COEP Pune Admission",
                batch: "Early Launch Batch",
                description: "Successful student verification map and round tracking unlocked institutional allocation smoothly.",
                bg: "from-emerald-600 to-teal-600"
              }
            ].map((out, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/60 p-8 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[300px]">
                <div className={`absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl opacity-10 bg-gradient-to-r ${out.bg}`} />
                <div className="relative z-10 space-y-4">
                  <Badge className="bg-purple-900/40 text-purple-400 border border-purple-500/20 font-black text-[9px] uppercase tracking-wider">{out.batch}</Badge>
                  <h3 className="text-xl font-black text-white">{out.title}</h3>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">{out.description}</p>
                </div>
                <div className="pt-6 relative z-10 border-t border-white/5 flex items-center justify-between text-xs font-bold text-purple-400">
                  <span>Choice List Verified</span>
                  <Award className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. USER REVIEWS GRID (PAST YEAR & CURRENT YEAR REVIEWS) */}
      <section className="py-24 container mx-auto px-4 max-w-6xl space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-black">Trusted by Parents & Students</h2>
            <p className="text-slate-400 font-semibold">100% verified student feedbacks of our dynamic mentorship programs.</p>
          </div>
          <div className="flex items-center gap-6 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 shadow-sm">
             <div className="text-center border-r border-white/10 pr-6">
                <p className="text-2xl font-black text-white leading-none">4.9</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Google Rating</p>
             </div>
             <div className="flex flex-col gap-1">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[10px] font-black text-slate-500">200+ Verified Reviews</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              author: "Halima Sayyad",
              rating: 5,
              text: "Very good counseling it was very useful helped me a lot any time sir was available to answer thank you sir I got my dream college 😊"
            },
            {
              author: "Nutunj Kamdi",
              rating: 5,
              text: "The journey with this guy was great he helped me a lot during my engineering process so thank you for all this 🙏"
            },
            {
              author: "Ayush Tegas",
              rating: 5,
              text: "Very nice counsellor and thank you so much for supporting us ☺️......"
            }
          ].map((review, index) => (
            <Card key={index} className="border-none shadow-sm rounded-[1.5rem] bg-white/5 border border-white/5 overflow-hidden flex flex-col p-6 relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center font-black text-purple-400 text-sm">
                    {review.author[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white leading-tight">{review.author}</h3>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-2.5 w-2.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Quote className="absolute -top-1 -left-1 h-6 w-6 text-white/5 -z-1" />
                  <p className="text-slate-400 text-xs leading-relaxed font-medium whitespace-normal">
                    &quot;{review.text}&quot;
                  </p>
                </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center pt-8">
          <Link href="/testimonials">
            <Button className="rounded-xl h-12 px-8 bg-transparent border border-white/20 text-white font-black hover:bg-white/5 flex items-center gap-2">
              View All 200+ Student Reviews <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  )
}
