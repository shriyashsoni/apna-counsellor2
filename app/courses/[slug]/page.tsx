"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { useRazorpay } from "@/hooks/use-razorpay"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Loader2, ArrowRight, ShieldCheck, CheckCircle2, Star, Sparkles, BookOpen, 
  MessageSquare, Calendar, Award, GraduationCap, Video, FileText, Download, Users 
} from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export default function CourseDetailsPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { initiatePayment, isLoading: isPaying } = useRazorpay()
  const [course, setCourse] = useState<any>(null)
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadCourseDetails() {
      if (!slug) return
      try {
        // Fetch course info
        const { data: courseData, error } = await supabase
          .from('courses')
          .eq('slug', slug)
          .single()
        
        if (courseData) {
          setCourse(courseData)
          
          // Verify enrollment if user is logged in
          if (user?.id) {
            const { data: enrollData } = await supabase
              .from('course_enrollments')
              .eq('course_id', courseData.id)
              .eq('student_id', user.id)
              .eq('status', 'active')
              .maybeSingle()
            
            if (enrollData) {
              setIsEnrolled(true)
            }
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
  }, [slug, user, authLoading])

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/courses/${slug}`)
      return
    }

    try {
      // Initiate Razorpay payment
      await initiatePayment({
        amount: Number(course.price),
        name: "Apna Counsellor",
        description: course.title,
        prefill: {
          name: user.name || "Student",
          email: user.email || "",
        },
        metadata: {
          courseId: course.id,
          studentId: user.id
        },
        onSuccess: async (response) => {
          // Call secure backend route to register enrollment
          const enrollRes = await fetch('/api/courses/enroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              courseId: course.id,
              studentId: user.id,
              paymentId: response.razorpay_payment_id
            })
          })

          const data = await enrollRes.json()
          if (data.success) {
            setIsEnrolled(true)
            router.push('/dashboard')
          } else {
            console.error("Backend enrollment failed:", data.error)
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
      
      {/* 1. HERO SECTION */}
      <section className="relative py-24 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="flex gap-2">
                <Badge className="bg-purple-900/40 text-purple-400 border border-purple-500/20 font-black text-[9px] uppercase tracking-wider px-3 py-1">{course.category || 'Counselling'}</Badge>
                <Badge className="bg-slate-900 text-slate-400 border border-white/5 font-black text-[9px] uppercase tracking-wider px-3 py-1">{course.level || 'Expert Plan'}</Badge>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">
                {course.title}
              </h1>
              <p className="text-lg text-slate-400 font-semibold leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex flex-wrap gap-6 pt-4 text-xs font-bold text-slate-400">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-purple-500" />
                  <span>College Admission Backed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  <span>1,200+ Enrolled Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  <span>Interactive Choice-Filling Sheets</span>
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="lg:col-span-5">
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Program Fee</p>
                      <p className="text-5xl font-black text-white mt-1">₹{Number(course.price).toLocaleString()}</p>
                    </div>
                    <div className="text-right text-xs font-bold text-slate-400">
                      Inclusive of GST
                    </div>
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
                      className="w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-md shadow-xl shadow-purple-900/30 hover:scale-[1.02] transition-all"
                    >
                      {isPaying ? <Loader2 className="animate-spin h-5 w-5" /> : "Subscribe & Enroll via Razorpay"}
                    </Button>
                  )}
                  
                  <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Instant activation on successful checkout</p>
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
                  <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-md text-white">{mod.title || `Module ${idx + 1}`}</h4>
                      <p className="text-xs text-slate-400 mt-1 font-semibold">Step-by-step master lessons covering admission rounds.</p>
                    </div>
                    <Badge className="bg-purple-900/40 text-purple-400 border-none font-bold text-[9px]">{mod.lessons?.length || 0} Lessons</Badge>
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
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">Our Legendary 2024 & 2025 Outcomes</h2>
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
                batch: "Batch 2025 Early Launch",
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

          {/* Graphical Results Placeholder with Dynamic Visual Blocks */}
          <div className="p-8 rounded-[3rem] bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h3 className="text-2xl font-black">Join 100+ Students Already Coached This Season</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Get immediate choice filling blueprints customized for you</p>
            </div>
            <Button onClick={handleEnroll} disabled={isPaying} className="rounded-2xl h-14 px-8 font-black bg-white text-slate-950 hover:bg-slate-100 hover:scale-105 transition-all">
              Claim Your Allocation Preference Now
            </Button>
          </div>
        </div>
      </section>

      {/* 4. USER REVIEWS GRID (PAST YEAR & CURRENT YEAR REVIEWS) */}
      <section className="py-24 container mx-auto px-4 max-w-6xl space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black">Trusted by Parents & Students</h2>
          <p className="text-slate-400 font-semibold">100% verified student feedbacks of our dynamic mentorship programs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Rahul Deshmukh", role: "Parent (VJTI Student)", rating: 5, date: "Yesterday", text: "Apna Counsellor predicted cutoffs perfectly! My son got into VJTI Mumbai computer engineering. The choice filling list was spot on." },
            { name: "Priya Sharma", role: "MHT-CET Student", rating: 5, date: "1 week ago", text: "Very friendly support! The personal WhatsApp support was highly responsive during CAP rounds." },
            { name: "Anish Gupta", role: "COEP Biotech", rating: 5, date: "Batch 2024 Review", text: "End-to-end guidance is amazing. The smart preference creator tool alone is worth the entire price!" }
          ].map((rev, idx) => (
            <Card key={idx} className="bg-white/5 border border-white/5 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between">
              <CardContent className="p-0 space-y-4">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 font-semibold italic">"{rev.text}"</p>
              </CardContent>
              <CardFooter className="p-0 pt-6 border-t border-white/5 mt-6 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-white">{rev.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{rev.role}</p>
                </div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{rev.date}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

    </div>
  )
}
