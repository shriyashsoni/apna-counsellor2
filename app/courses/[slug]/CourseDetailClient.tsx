"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { useRazorpay } from "@/hooks/use-razorpay"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Loader2, ArrowRight, CheckCircle2, Star, Sparkles, BookOpen, 
  Calendar, Award, Lock, Unlock, PlayCircle, FileText, Quote, Users, Video
} from "lucide-react"
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
  const [activeTab, setActiveTab] = useState('about')
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
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

  const scrollToSection = (id: string) => {
    setActiveTab(id)
    const element = document.getElementById(id)
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100 // offset for sticky header
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-900">
        <Loader2 className="animate-spin h-10 w-10 text-purple-600 mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Loading Program Details...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-900 p-6">
        <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-6">
          <BookOpen className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-black mb-2">Program Not Found</h1>
        <p className="text-slate-500 text-sm mb-6">The requested counselling course slug does not exist.</p>
        <Link href="/courses">
          <Button className="rounded-xl h-12 bg-purple-600 text-white font-black hover:bg-purple-700">Browse Active Courses</Button>
        </Link>
      </div>
    )
  }

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'features', label: 'Features' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'details', label: 'More Details' },
    { id: 'reviews', label: 'Reviews' },
  ]

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans pb-32">
      
      {/* CONTINUOUS SCROLLING BANNER */}
      <div className="bg-purple-100 py-3 border-b border-purple-200">
        <Marquee speed={60} gradient={false} className="overflow-hidden">
          <div className="flex items-center gap-12 text-sm font-black uppercase tracking-widest text-purple-700 px-8">
            <span className="flex items-center gap-2"><Sparkles className="h-4 w-4"/> Admissions Open 2026</span>
            <span className="flex items-center gap-2"><Award className="h-4 w-4"/> Limited Seats Available</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/> 100% Satisfaction</span>
            <span className="flex items-center gap-2"><Users className="h-4 w-4"/> Join 50,000+ Students</span>
          </div>
        </Marquee>
      </div>

      {/* MAIN CONTAINER */}
      <div className="container mx-auto px-4 max-w-6xl pt-10">
        
        {/* Title Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-widest">
            <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/courses" className="hover:text-purple-600 transition-colors">Courses</Link>
            <span>›</span>
            <span className="text-slate-900">{course.category || 'Batch'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4 leading-tight">
            {course.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center text-xs sm:text-sm font-bold text-slate-600">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <Users className="h-4 w-4 text-purple-600" />
              <span>For {course.category || 'MHT-CET'} Aspirants</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span>Starts on Available Immediately</span>
            </div>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT */}
        <div className="grid lg:grid-cols-12 gap-10 relative">
          
          {/* LEFT COLUMN: Main Content & Tabs */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Sticky Tabs Bar */}
            <div className="sticky top-0 z-40 bg-[#F8F9FA] pt-4 pb-0 flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar border-b border-slate-200 shadow-[0_10px_10px_-10px_rgba(0,0,0,0.05)] px-1">
              {tabs.map(t => (
                <button 
                  key={t.id}
                  onClick={() => scrollToSection(t.id)}
                  className={`pb-3 font-bold text-sm sm:text-base whitespace-nowrap transition-all border-b-[3px] ${
                    activeTab === t.id 
                      ? 'border-purple-600 text-purple-700' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* SECTIONS */}
            <div className="space-y-12">
              
              {/* About Section */}
              <section id="about" className="scroll-mt-32">
                <h2 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6 text-slate-900">About the Batch</h2>
                <Card className="bg-white rounded-3xl border-slate-200 shadow-sm overflow-hidden">
                  <CardContent className="p-5 sm:p-8 space-y-6">
                    <div className="relative">
                      <div 
                        className={`text-slate-600 font-medium text-base leading-relaxed prose prose-slate prose-p:my-2 prose-ul:my-2 prose-ol:my-2 max-w-none ${!isDescriptionExpanded ? 'line-clamp-4 overflow-hidden' : ''}`}
                        dangerouslySetInnerHTML={{ __html: course.description || '' }}
                      />
                      {(course.description?.length > 250) && (
                        <button 
                          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                          className="text-purple-600 font-black text-sm mt-3 hover:text-purple-700 flex items-center gap-1"
                        >
                          {isDescriptionExpanded ? 'Read Less' : 'Read More...'}
                        </button>
                      )}
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-slate-500">Course Duration</p>
                          <p className="font-bold text-slate-900">Till Admission Round</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Award className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-slate-500">Validity</p>
                          <p className="font-bold text-slate-900">Lifetime Access</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-slate-700">Expert guidance at our Online Centers</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-slate-700">One-to-one emotional well-being support by Counselors</span>
                      </div>
                    </div>

                    {/* Orientation Video Preview Box */}
                    {course.promo_video_url && (
                      <div className="mt-8 bg-amber-50/50 rounded-2xl p-6 border border-amber-100 flex items-center justify-between">
                        <div>
                          <h4 className="font-black text-slate-900 mb-1">Orientation Video</h4>
                          <p className="text-sm font-medium text-slate-600">Know important details and get oriented with your mentors.</p>
                        </div>
                        <a href={course.promo_video_url} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 group cursor-pointer">
                          <div className="h-12 w-12 rounded-full bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                            <PlayCircle className="h-6 w-6 text-purple-600" />
                          </div>
                          <span className="text-[10px] font-black uppercase text-purple-600">Click to watch</span>
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>

              {/* Features Section */}
              <section id="features" className="scroll-mt-32">
                <h2 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6 text-slate-900">Batch Features</h2>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  
                  {/* Primary Feature Box */}
                  <Card className="bg-slate-900 rounded-3xl border-slate-800 shadow-xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4">
                      <Badge className="bg-purple-500 text-white font-black border-none uppercase tracking-widest text-[9px]">Premium</Badge>
                    </div>
                    <CardContent className="p-5 sm:p-8">
                      <h3 className="text-xl sm:text-2xl font-black text-white mb-6 border-b border-slate-800 pb-4">
                        Core Program
                      </h3>
                      <ul className="space-y-4">
                        {(course.highlights || [
                          "Live Interactive Choice-Filling Sessions",
                          "Full Access to College Predictors & Cutoffs",
                          "Personalized Mentor Q&A Backing",
                          "100% Accurate Admission Success Map",
                          "Live Doubt Support"
                        ]).map((highlight: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                            <span className="text-slate-300 font-semibold text-sm">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Secondary Features/Bonuses Box */}
                  <Card className="bg-white rounded-3xl border-slate-200 shadow-sm overflow-hidden border-t-[6px] border-t-amber-400">
                    <CardContent className="p-5 sm:p-8">
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4">
                        Bonuses Included
                      </h3>
                      <ul className="space-y-4">
                        {[
                          "Interactive PDF Worksheets",
                          "Priority WhatsApp Support",
                          "Previous Year Cutoff Matrices",
                          "Post-Allotment Document Help",
                        ].map((highlight: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" />
                            <span className="text-slate-700 font-bold text-sm">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Schedule / Curriculum Section */}
              <section id="schedule" className="scroll-mt-32">
                <h2 className="text-2xl font-black mb-6 text-slate-900">Batch Schedules</h2>
                <div className="space-y-4">
                  {Array.isArray(course.curriculum) && course.curriculum.length > 0 ? (
                    course.curriculum.map((mod: any, idx: number) => {
                      const colors = [
                        'border-l-blue-500 bg-blue-50',
                        'border-l-purple-500 bg-purple-50',
                        'border-l-amber-500 bg-amber-50',
                        'border-l-emerald-500 bg-emerald-50'
                      ]
                      const theme = colors[idx % colors.length]
                      
                      return (
                        <div key={idx} className={`p-6 rounded-2xl border border-slate-200 border-l-[4px] ${theme} flex flex-col sm:flex-row justify-between sm:items-center gap-4`}>
                          <div>
                            <h4 className="font-black text-lg text-slate-900">{mod.title || `Module ${idx + 1}`}</h4>
                            <div className="flex items-center gap-3 mt-2 text-sm text-slate-500 font-semibold">
                              <span>{mod.lessons?.length || 0} Lectures</span>
                              {mod.lessons && mod.lessons.length > 0 && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                  <span>Expert Faculties</span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          {/* Module Lessons Preview */}
                          {mod.lessons && mod.lessons.length > 0 && (
                            <div className="flex flex-col gap-2 w-full sm:w-auto min-w-[200px]">
                              {mod.lessons.slice(0,2).map((lesson: any, lIdx: number) => (
                                 <div key={lIdx} className="flex justify-between items-center bg-white p-2 px-3 rounded-lg border border-slate-200 shadow-sm text-xs font-bold">
                                    <span className="text-slate-700 truncate max-w-[150px]">{lesson.title}</span>
                                    {lesson.is_free_preview || course.is_free ? (
                                      <Unlock className="h-3.5 w-3.5 text-emerald-500" />
                                    ) : (
                                      <Lock className="h-3.5 w-3.5 text-slate-400" />
                                    )}
                                 </div>
                              ))}
                              {mod.lessons.length > 2 && (
                                <p className="text-[10px] text-center font-bold text-purple-600 mt-1">+{mod.lessons.length - 2} more lessons inside</p>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <Card className="bg-white rounded-3xl border-slate-200 shadow-sm">
                      <CardContent className="p-8 text-center">
                        <p className="text-slate-500 font-medium">No structured schedules defined yet.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </section>

              {/* Details / Resources Section */}
              <section id="details" className="scroll-mt-32">
                <Card className="bg-white rounded-3xl border-slate-200 shadow-sm overflow-hidden">
                  <CardContent className="p-5 sm:p-8 md:p-12">
                    <h2 className="text-xl sm:text-2xl font-black mb-6 sm:mb-8 text-slate-900">More Details</h2>
                    <div className="space-y-6">
                      
                      {Array.isArray(course.resources) && course.resources.length > 0 ? (
                        course.resources.map((res: any, idx: number) => (
                          <div key={idx} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                            <div className="flex items-start gap-4">
                              <span className="text-slate-400 font-medium text-lg mt-0.5">
                                {String(idx + 1).padStart(2, '0')}.
                              </span>
                              <div>
                                <p className="font-semibold text-slate-700 leading-relaxed text-base">
                                  <span className="font-black text-slate-900">{res.title}</span> — {res.type === 'pdf' ? 'PDF Resource kit and worksheets' : 'Additional learning links and videos'} will be provided according to the planner.
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="pb-6 border-b border-slate-100">
                            <div className="flex gap-4">
                              <span className="text-slate-400 font-medium text-lg">01.</span>
                              <p className="font-semibold text-slate-700 leading-relaxed"><span className="font-black text-slate-900">Live Lectures</span> by Expert Mentors & Class Notes will be provided.</p>
                            </div>
                          </div>
                          <div className="pb-6 border-b border-slate-100">
                            <div className="flex gap-4">
                              <span className="text-slate-400 font-medium text-lg">02.</span>
                              <p className="font-semibold text-slate-700 leading-relaxed"><span className="font-black text-slate-900">Complete Cutoff Practice</span> sheets will be provided.</p>
                            </div>
                          </div>
                          <div className="pb-6 border-b border-slate-100">
                            <div className="flex gap-4">
                              <span className="text-slate-400 font-medium text-lg">03.</span>
                              <div>
                                <p className="font-semibold text-slate-700 leading-relaxed"><span className="font-black text-slate-900">Digital Preparation KIT :</span></p>
                                <ul className="mt-2 space-y-1 text-slate-600 font-medium ml-2">
                                  <li>A) Chapterwise Audio Summary & Handwritten Notes</li>
                                  <li>B) Chapterwise PYQ Replica sheets</li>
                                  <li>C) Blueprints (Weightage Analysis)</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="flex gap-4">
                              <span className="text-slate-400 font-medium text-lg">04.</span>
                              <p className="font-semibold text-slate-700 leading-relaxed"><span className="font-black text-slate-900">Access to all updates</span> will be provided in the batch <span className="font-black text-slate-900">till end of admission cycle.</span></p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Reviews Section */}
              <section id="reviews" className="scroll-mt-32">
                <h2 className="text-2xl font-black mb-6 text-slate-900">Trusted by Students</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { author: "Halima Sayyad", text: "Very good counseling it was very useful helped me a lot any time sir was available to answer thank you sir I got my dream college 😊" },
                    { author: "Nutunj Kamdi", text: "The journey with this guy was great he helped me a lot during my engineering process so thank you for all this 🙏" },
                  ].map((review, index) => (
                    <Card key={index} className="border-slate-200 shadow-sm rounded-3xl bg-white overflow-hidden p-6 relative">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center font-black text-purple-600 text-sm">
                            {review.author[0].toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-black text-sm text-slate-900 leading-tight">{review.author}</h3>
                            <div className="flex gap-0.5 mt-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 fill-amber-400 text-amber-400`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="relative">
                          <Quote className="absolute -top-2 -left-2 h-8 w-8 text-slate-100 -z-1" />
                          <p className="text-slate-600 text-sm leading-relaxed font-semibold relative z-10">
                            "{review.text}"
                          </p>
                        </div>
                    </Card>
                  ))}
                </div>
              </section>

            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Buy Card */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-24">
              <Card className="rounded-3xl border-slate-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] bg-white overflow-hidden">
                
                {course.thumbnail_url ? (
                  <div className="w-full aspect-video relative bg-slate-100">
                    <Image 
                      src={course.thumbnail_url} 
                      alt={course.title} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-purple-200" />
                  </div>
                )}
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-black text-slate-900 mb-4 line-clamp-2 leading-tight">
                    {course.title}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span>For {course.category || 'Dropper NEET'} Aspirants</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>Starts on <strong>29 Jun 2026</strong></span>
                    </div>
                  </div>

                  <div className="flex items-end gap-3 mb-6 pt-6 border-t border-slate-100">
                    {course.is_free ? (
                      <span className="text-4xl font-black text-emerald-500">FREE</span>
                    ) : (
                      <>
                        <span className="text-4xl font-black text-slate-900 leading-none">
                          ₹{Number(course.discounted_price || course.price).toLocaleString()}
                        </span>
                        {course.original_price && course.discounted_price && (
                          <span className="text-lg font-semibold text-slate-400 line-through mb-1">
                            ₹{Number(course.original_price).toLocaleString()}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {isEnrolled ? (
                    <Link href="/dashboard" className="w-full block">
                      <Button className="w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-lg transition-all shadow-xl shadow-purple-200">
                        Go to Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      onClick={handleEnroll} 
                      disabled={isPaying}
                      className="w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-lg transition-all shadow-xl shadow-purple-200 hover:shadow-2xl hover:shadow-purple-300 hover:-translate-y-0.5"
                    >
                      {isPaying ? <Loader2 className="animate-spin h-5 w-5" /> : (course.is_free ? "Enroll for Free" : "Continue to Buy")}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
      
      {/* MOBILE STICKY BUY BAR (Visible only on mobile/tablet) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 sm:p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.08)] z-50 flex items-center justify-between gap-3">
        <div className="flex-shrink-0">
          {course.is_free ? (
            <p className="text-xl sm:text-2xl font-black text-emerald-500">FREE</p>
          ) : (
            <div className="flex flex-col">
              <p className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
                ₹{Number(course.discounted_price || course.price).toLocaleString()}
              </p>
              {course.original_price && course.discounted_price && (
                <p className="text-[10px] sm:text-xs font-semibold text-slate-400 line-through mt-0.5">
                  ₹{Number(course.original_price).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>
        
        {isEnrolled ? (
          <Link href="/dashboard" className="flex-1 max-w-[220px]">
            <Button className="w-full h-11 sm:h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm sm:text-md">
              Dashboard
            </Button>
          </Link>
        ) : (
          <Button 
            onClick={handleEnroll} 
            disabled={isPaying}
            className="flex-1 max-w-[220px] h-11 sm:h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm sm:text-md shadow-lg shadow-purple-200"
          >
            {isPaying ? <Loader2 className="animate-spin h-5 w-5" /> : (course.is_free ? "Enroll Free" : "Continue")}
          </Button>
        )}
      </div>

    </div>
  )
}
