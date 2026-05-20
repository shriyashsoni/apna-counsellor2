"use client"

import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, 
  Settings, 
  Bell, 
  Search, 
  Calendar, 
  BookOpen, 
  Globe, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  LayoutDashboard,
  ShieldCheck,
  CreditCard,
  GraduationCap,
  MapPin,
  Clock,
  ChevronRight,
  Target,
  Bot,
  ListChecks,
  CheckCircle2,
  Trophy,
  Users,
  BookCheck,
  BarChart3,
  Zap,
  Landmark,
  ShieldAlert,
  Database,
  FileText,
  ExternalLink,
  Rocket,
  ArrowUpRight,
  Activity,
  Bookmark,
  CalendarCheck
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { useRouter } from "next/navigation"
import { ReviewModal } from "@/components/review-modal"
import { Video, Star as StarIcon } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(undefined)
  const [user, setUser] = useState<any>(undefined)
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const { data: authData } = await supabase.auth.getUser()
      const authUser = authData?.user
      if (!authUser) {
        router.push("/login")
        return
      }
      
      // Get profile with metadata from user
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle()

      if (!profileData || !profileData.onboarding_complete) {
        router.push("/onboarding")
      } else {
        setProfile(profileData)
        setUser({ ...authUser, role: profileData.role || 'student' })
      }
    }
    loadData()
  }, [router])

  if (user === undefined || profile === undefined) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
      <div className="h-16 w-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 font-bold animate-pulse">Initializing Your Dashboard...</p>
    </div>
  )
  
  if (!user || !profile) return null;

  // Admin Dashboard View
  if (user.role === "admin") {
    return <AdminDashboard user={user} />
  }

  // Mentor Redirect
  if (user.role === "mentor") {
    router.push("/mentor/dashboard")
    return null
  }

  // Student Dashboard View
  return <StudentDashboard profile={profile} user={user} />
}

function AdminDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchStats() {
      const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      const { count: colleges } = await supabase.from('colleges').select('*', { count: 'exact', head: true })
      const { count: mentors } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'mentor')
      
      const { data: payments } = await supabase.from('payments').select('amount').eq('status', 'captured')
      const revenue = payments?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0
      
      setStats({ users, colleges, mentors, revenue })
    }
    fetchStats()
  }, [])

  const adminStats = [
    { label: "Total Students", value: stats?.users || 0, icon: User, color: "text-blue-500", trend: "+12%" },
    { label: "Revenue (MTD)", value: `₹${stats?.revenue || 0}`, icon: CreditCard, color: "text-emerald-500", trend: "+8%" },
    { label: "Total Mentors", value: stats?.mentors || 0, icon: GraduationCap, color: "text-purple-500", trend: "+5" },
    { label: "Colleges", value: stats?.colleges || 0, icon: Database, color: "text-orange-500", trend: "+2" },
  ]

  return (
    <div className="space-y-8">
      {/* Admin Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {adminStats.map((stat, i) => (
          <Card key={i} className="border-none rounded-[2rem] shadow-sm bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-xl transition-all">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-slate-400'}`}>{stat.trend}</span>
              </div>
              <p className="text-[11px] uppercase font-black text-slate-400 tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 p-8">
             <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-black tracking-tight">Recent Registrations</h2>
               <Button variant="ghost" className="text-primary font-bold">View All</Button>
             </div>
             <div className="space-y-4">
               {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all cursor-pointer group">
                     <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 text-xs">U{i}</div>
                       <div>
                         <p className="text-sm font-bold group-hover:text-primary transition-colors">Student {i}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase">Joined 2 hours ago • JEE aspirant</p>
                       </div>
                     </div>
                     <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
               ))}
             </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <section className="space-y-4">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Management Tools</h3>
             <div className="grid grid-cols-1 gap-3">
               {[
                 { icon: BookOpen, label: "Manage Colleges", path: "/colleges", color: "bg-blue-500" },
                 { icon: Globe, label: "Portals Config", path: "/counselling", color: "bg-emerald-500" },
                 { icon: MessageSquare, label: "Batch Support", path: "/batches", color: "bg-purple-500" },
                 { icon: Settings, label: "System Settings", path: "/settings", color: "bg-slate-500" },
               ].map((item, i) => (
                 <Link key={i} href={item.path}>
                   <Button className="w-full justify-between rounded-2xl h-16 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border-none shadow-sm hover:shadow-md group transition-all">
                     <div className="flex items-center gap-4">
                       <div className={`h-10 w-10 rounded-xl ${item.color}/10 ${item.color.replace('bg-', 'text-')} flex items-center justify-center`}>
                         <item.icon className="h-5 w-5" />
                       </div>
                       <span className="font-bold">{item.label}</span>
                     </div>
                     <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                   </Button>
                 </Link>
               ))}
             </div>
           </section>
        </div>
      </div>
    </div>
  )
}

function StudentDashboard({ profile, user }: { profile: any, user: any }) {
  const [sessions, setSessions] = useState<any[]>([])
  const [mentors, setMentors] = useState<any[]>([])
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
  const [classroomCourse, setClassroomCourse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<any>(null)
  const [greeting, setGreeting] = useState("Welcome back")
  const supabase = createClient()

  useEffect(() => {
    // Dynamic greeting based on time of day
    const hrs = new Date().getHours()
    if (hrs < 12) setGreeting("Good morning")
    else if (hrs < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [sessRes, mentorRes, coursesRes] = await Promise.all([
          supabase.from('sessions').select('*').eq('student_id', user.id).order('created_at', { ascending: false }),
          supabase.from('profiles').select('*').eq('role', 'mentor').eq('is_visible', true).limit(3),
          supabase.from('course_enrollments').select('*, courses(*)').eq('student_id', user.id).eq('status', 'active')
        ])
        
        setSessions(sessRes.data || [])
        setMentors(mentorRes.data || [])
        setEnrolledCourses(coursesRes.data || [])
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [user.id])

  const hasActiveAccess = enrolledCourses.length > 0;

  const getRecommendedPortals = () => {
    const portals = []
    if (profile.exam === "JEE") {
      portals.push({ id: "JoSAA", name: "JoSAA", desc: "IIT, NIT, IIIT & GFTI Counselling", icon: "J", color: "orange" })
      portals.push({ id: "CSAB", name: "CSAB Spot Round", desc: "NIT+ System Special Admission Rounds", icon: "C", color: "blue" })
    }
    if (profile.exam === "NEET") {
      portals.push({ id: "MCC", name: "MCC Medical", desc: "All India Quota MBBS & BDS Counselling", icon: "M", color: "red" })
    }
    if (profile?.interested_states?.includes("Maharashtra") || profile.city === "Mumbai" || profile.city === "Pune") {
      portals.push({ id: "MHT-CET", name: "MHT-CET Guidance", desc: "Maharashtra State Engineering admissions", icon: "M", color: "purple" })
    }
    if (portals.length === 0) {
      portals.push({ id: "JEE-Main", name: "JEE Central Portal", desc: "Joint Seat Allocation Authority Hub", icon: "J", color: "blue" })
    }
    return portals.slice(0, 4)
  }

  // Interactive Classroom Panel View
  if (classroomCourse) {
    const course = classroomCourse.courses
    const resources = course?.resources || []
    
    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-12">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm gap-4">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={() => setClassroomCourse(null)} className="rounded-full bg-slate-50 dark:bg-slate-800 h-10 w-10 hover:bg-slate-100 transition-colors">
               <ArrowLeft className="h-4 w-4" />
             </Button>
             <div>
               <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">{course?.title}</h1>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Active Student Portal</p>
             </div>
          </div>
          <Badge className="bg-purple-900/40 text-purple-400 border border-purple-500/20 font-black text-[9px] uppercase tracking-wider px-3 py-1">ENROLLED</Badge>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Card className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border-none shadow-sm">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">Course Highlights & Syllabus</h3>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                {course?.description || "Master preference strategy, cutoffs, and seat optimization using our expert-curated modules."}
              </p>
              
              <div className="space-y-4">
                {Array.isArray(course?.curriculum) && course.curriculum.map((m: any, i: number) => (
                  <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">{m.title}</h4>
                    <p className="text-xs text-slate-400 font-semibold">Structured learning modules detailing step-by-step admissions logic.</p>
                  </div>
                ))}
                {(!course?.curriculum || course.curriculum.length === 0) && (
                  <div className="text-center py-8 text-slate-400 italic">
                    Syllabus modules will be loaded shortly by the mentor team.
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <Card className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border-none shadow-sm space-y-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Uploaded Lectures & Resources</h3>
              
              <div className="space-y-3">
                {resources.map((r: any, idx: number) => (
                  <a key={idx} href={r.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-300 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all group">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          r.type === 'video' ? 'bg-red-50 text-red-500' :
                          r.type === 'pdf' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'
                        }`}>
                          {r.type === 'video' ? <Video className="h-4 w-4" /> :
                           r.type === 'pdf' ? <FileText className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-purple-600 transition-colors">{r.title}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{r.type}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </a>
                ))}

                {resources.length === 0 && (
                  <div className="text-center py-10 text-slate-400 font-bold italic">
                    No videos, PDFs or solutions uploaded yet. Check back soon!
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-16">
      {/* Dynamic Welcoming Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-purple-900/10 via-purple-600/5 to-transparent p-8 md:p-10 rounded-[2.5rem] border border-purple-500/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black tracking-widest text-purple-600 dark:text-purple-400 uppercase bg-purple-600/10 px-3 py-1 rounded-full">{greeting}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {profile.name || "Student"}
          </h1>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">
            Here is your live admissions strategy workspace. Use our tools to secure your dream seat.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1.5 font-bold rounded-xl flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Active Student
          </Badge>
          <UserNav />
        </div>
      </div>

      {/* Pro Banner for Free Users */}
      {!hasActiveAccess && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 md:p-12 rounded-[3rem] bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white relative overflow-hidden group shadow-2xl border border-white/5"
        >
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000 rotate-12">
              <Sparkles className="h-48 w-48 text-purple-500" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <Badge className="bg-purple-600/20 text-purple-400 border border-purple-500/30 font-black text-[10px] uppercase tracking-widest px-3 py-1 mb-6">PREMIUM COUNSELLING MODULES</Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tighter">Revolutionize Your <br/><span className="text-purple-400">Admission Journey</span></h2>
            <p className="text-slate-300 font-medium text-lg leading-relaxed mb-10 max-w-xl">
              Unlock live lectures, priority choice filling, and 1-on-1 strategy sessions. Don&apos;t leave your future to chance.
            </p>
            <Link href="/courses">
              <Button className="rounded-2xl h-16 px-10 font-black text-lg shadow-2xl shadow-purple-600/25 bg-purple-600 hover:bg-purple-700 transition-all hover:scale-105 active:scale-95 text-white">
                Explore Admissions Courses
                <Zap className="ml-2 h-5 w-5 fill-current" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Subscribed Programs Section */}
      {enrolledCourses.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-sm">
              <Rocket className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Your Enrolled Programs</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map((ec: any) => (
              <Card key={ec.id} className="border-none rounded-[3rem] shadow-sm bg-white dark:bg-slate-900 group hover:shadow-xl transition-all border border-slate-100 dark:border-slate-800">
                <CardContent className="p-8 md:p-10 flex flex-col justify-between h-full min-h-[220px]">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <Badge className="bg-purple-600/10 text-purple-600 border border-purple-500/20 font-black text-[9px] uppercase tracking-wider px-3 py-1">SUBSCRIBED</Badge>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Access</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors">{ec.courses?.title}</h3>
                    <p className="text-slate-500 text-sm font-semibold mb-6 line-clamp-2">{ec.courses?.description}</p>
                  </div>
                  <Button onClick={() => setClassroomCourse(ec)} className="w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-base shadow-lg shadow-purple-900/10 transition-all">
                    Access Classroom <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Target Stats Overview */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Target Goal", value: profile.exam || "Not Specified", icon: Target, color: "text-purple-600", bg: "bg-purple-600/10" },
          { label: "Category Quota", value: profile.category || "General", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Percentile/Rank", value: profile.rank ? `#${profile.rank}` : "Pending Strategy", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Target Year", value: profile.target_year || "Evergreen", icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-8">
              <div className="flex flex-col gap-6">
                <div className={`h-14 w-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-105 transition-transform duration-500 shadow-sm`}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-black text-slate-400 tracking-widest mb-1.5">{stat.label}</p>
                  <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Recommended Portals */}
          <section>
            <div className="flex justify-between items-center mb-8 px-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-sm">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Recommended Portals</h2>
              </div>
              <Link href="/counselling" className="text-purple-600 text-sm font-bold hover:underline flex items-center gap-1 group">
                Browse All <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
               {getRecommendedPortals().map((portal, i) => (
                 <Card key={i} className="border-none rounded-[3rem] shadow-sm bg-white dark:bg-slate-900 group hover:shadow-md transition-all duration-300 border border-slate-100 dark:border-slate-800">
                   <CardContent className="p-8 md:p-10">
                     <div className="flex justify-between items-start mb-8">
                       <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center font-black text-3xl shadow-xl
                         ${portal.color === 'orange' ? 'bg-orange-50 text-orange-500 shadow-orange-500/5' : 
                           portal.color === 'blue' ? 'bg-blue-50 text-blue-500 shadow-blue-500/5' : 
                           portal.color === 'red' ? 'bg-red-50 text-red-500 shadow-red-500/5' : 
                           'bg-purple-50 text-purple-500 shadow-purple-500/5'}`}
                       >
                         {portal.icon}
                       </div>
                       <Badge className="bg-slate-50 dark:bg-slate-800 text-slate-400 border-none font-bold">Live Hub</Badge>
                     </div>
                     <h3 className="text-2xl font-black mb-3 group-hover:text-purple-600 transition-colors">{portal.name}</h3>
                     <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed">{portal.desc}</p>
                     <Link href={`/counselling/${portal.id}`}>
                       <Button className="w-full h-14 rounded-2xl bg-slate-50 hover:bg-purple-600 hover:text-white text-slate-900 dark:bg-slate-800 dark:text-white border-none font-black text-base shadow-sm group transition-all">
                         Access Dashboard 
                         <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                       </Button>
                     </Link>
                   </CardContent>
                 </Card>
               ))}
            </div>
          </section>

          {/* Institute Catalogs */}
          <section>
            <div className="flex justify-between items-center mb-8 px-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm">
                  <Trophy className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Institute Catalogs</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "IITs", count: "23", color: "bg-blue-500", filter: "IIT" },
                { label: "NITs", count: "31", color: "bg-emerald-500", filter: "NIT" },
                { label: "IIITs", count: "26", color: "bg-purple-500", filter: "IIIT" },
                { label: "Top 50", count: "50", color: "bg-orange-500", filter: "Top 50" },
              ].map((cat, i) => (
                <Link key={i} href={`/colleges?category=${cat.filter}`}>
                  <Card className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 group hover:shadow-md transition-all duration-300">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className={`h-14 w-14 rounded-2xl ${cat.color} text-white flex items-center justify-center mb-6 shadow-md font-black text-sm group-hover:scale-105 transition-transform`}>
                        {cat.label}
                      </div>
                      <p className="font-black text-lg mb-1">{cat.label}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.count} Institutions</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Upcoming Live Sessions / Schedule */}
          <section>
            <div className="flex justify-between items-center mb-8 px-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-sm">
                  <Calendar className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Your Schedule</h2>
              </div>
              <Link href="/mentorship" className="text-purple-600 text-sm font-bold hover:underline">Book call</Link>
            </div>

            {sessions.length === 0 ? (
              <Card className="border-none rounded-[3rem] p-12 text-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                 <Clock className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                 <h3 className="text-xl font-bold mb-2">No Sessions Booked</h3>
                 <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">Lock in a personalized 1-on-1 choice strategy session with top mentors.</p>
                 <Link href="/mentorship">
                   <Button variant="outline" className="rounded-2xl h-12 px-8 font-black border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-colors">Book Mentor Session</Button>
                 </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {sessions.map((s: any) => (
                  <Card key={s.id} className="border-none rounded-[2rem] shadow-sm bg-white dark:bg-slate-900 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 group hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <CalendarCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-lg text-slate-900 dark:text-white">{s.title || "Strategy Call"}</h4>
                        <p className="text-sm font-semibold text-slate-500">with {s.mentor_name || "Expert Mentor"}</p>
                        <p className="text-xs text-slate-400 mt-1 uppercase font-black tracking-wider flex items-center gap-2">
                          <span>{s.date || "Date Pending"}</span>
                          <span>•</span>
                          <span>{s.time_slot || "Time Pending"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      {s.status === 'confirmed' && s.meeting_link && (
                        <a href={s.meeting_link} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                          <Button className="w-full h-12 px-6 rounded-xl bg-purple-600 text-white font-black text-xs gap-2">
                            <Video className="h-4 w-4" /> Join Google Meet
                          </Button>
                        </a>
                      )}
                      
                      {s.status === 'completed' && (
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedSession(s)}
                          className="w-full md:w-auto h-12 px-6 rounded-xl border-amber-200 text-amber-600 font-black text-xs gap-2 hover:bg-amber-50"
                        >
                          <StarIcon className="h-4 w-4" /> Review Session
                        </Button>
                      )}

                      <Badge className={`ml-auto md:ml-0 border-none text-[10px] font-black uppercase tracking-widest px-3 py-1.5 ${
                        s.status === 'confirmed' ? 'bg-emerald-500 text-white' : 
                        s.status === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-amber-500 text-white'
                      }`}>
                        {s.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {selectedSession && (
              <ReviewModal 
                isOpen={!!selectedSession}
                onClose={() => setSelectedSession(null)}
                mentorId={selectedSession.mentor_id}
                mentorName={selectedSession.mentor_name}
                sessionId={selectedSession.id}
              />
            )}
          </section>

          {/* Expert Mentors List */}
          <section>
            <div className="flex justify-between items-center mb-8 px-2">
               <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-sm">
                   <Users className="h-6 w-6" />
                 </div>
                 <h2 className="text-2xl font-black tracking-tight">Active Mentors</h2>
               </div>
              <Link href="/mentorship" className="text-purple-600 text-sm font-bold hover:underline">View All</Link>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {mentors.length === 0 ? (
                <div className="col-span-2 text-center py-6 text-slate-400 italic">
                  Loading available senior mentors...
                </div>
              ) : (
                mentors.map((m) => (
                  <Card key={m.id} className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 p-6 flex items-center gap-6 group hover:shadow-md transition-all border border-slate-100 dark:border-slate-800">
                    <div className="h-20 w-20 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 shrink-0 overflow-hidden relative border border-purple-500/10">
                       {m.avatar_url ? (
                          <img src={m.avatar_url} alt={m.name} className="h-full w-full object-cover" />
                       ) : (
                          <User className="h-full w-full p-5 text-slate-300" />
                       )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-black text-lg group-hover:text-purple-600 transition-colors truncate">{m.name}</h3>
                      <p className="text-xs text-slate-500 font-semibold truncate mb-3">{m.college || "Senior Admissions Counsel"}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-[10px] font-black text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-lg">
                          <Sparkles className="h-3 w-3" /> {m.rating || "5.0"}
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">₹{m.pricing || "499"} / session</div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-200 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Widgets Column */}
        <div className="lg:col-span-4 space-y-8">
          {/* AI Helper Card */}
          <Card className="bg-purple-900 text-white border-none rounded-[3rem] p-10 relative overflow-hidden shadow-xl group">
             <div className="absolute top-0 right-0 p-12 opacity-15 rotate-12 group-hover:scale-110 transition-transform duration-1000">
                <Bot className="h-44 w-44" />
             </div>
             <div className="relative z-10">
               <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 border border-white/10">
                  <Sparkles className="h-7 w-7 text-white" />
               </div>
               <h2 className="text-3xl font-black mb-4 tracking-tighter">AI Counselor</h2>
               <p className="text-white/80 text-sm mb-8 leading-relaxed font-semibold">
                 Instantly predict your college chances and matching branches based on your current JEE/CET/NEET ranks.
               </p>
               <Link href="/chat">
                  <Button className="w-full h-14 bg-white text-purple-900 hover:bg-slate-50 rounded-2xl font-black text-base shadow-lg transition-all hover:scale-[1.01]">
                     Ask AI Assistant 
                     <MessageSquare className="ml-2 h-5 w-5" />
                  </Button>
               </Link>
             </div>
          </Card>

          {/* Profile Details Widget */}
          <Card className="border-none rounded-[3rem] shadow-sm bg-white dark:bg-slate-900 p-8 border border-slate-100 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black tracking-tight">Your Profile</h3>
              <Badge className="bg-purple-600/10 text-purple-600 border-none font-bold">Verified</Badge>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 transition-colors hover:bg-slate-100/60">
                <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-purple-600 shadow-sm border border-slate-100 dark:border-slate-800">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-100">{profile.city || "Not Specified"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 transition-colors hover:bg-slate-100/60">
                <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-purple-600 shadow-sm border border-slate-100 dark:border-slate-800">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">State Focus</p>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-100 truncate max-w-[170px]">
                    {profile?.interested_states?.join(", ") || "All India"}
                  </p>
                </div>
              </div>
            </div>

            <Link href="/onboarding">
              <Button variant="ghost" className="w-full h-12 rounded-xl text-purple-600 hover:bg-purple-50 font-black text-xs transition-all">
                Update Admissions Profile
              </Button>
            </Link>
          </Card>

          {/* Quick Support & Tools Links */}
          <section className="space-y-3 px-1">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">Ecosystem Quick Links</h3>
             <div className="grid grid-cols-1 gap-2">
               {[
                 { icon: BookOpen, label: "Resource Library", path: "/resources", color: "text-blue-500" },
                 { icon: CreditCard, label: "Subscription Plans", path: "/pricing", color: "text-emerald-500" },
                 { icon: Settings, label: "Account Settings", path: "/settings", color: "text-slate-500" },
                 { icon: MessageSquare, label: "Help & Support", path: "/support", color: "text-purple-500" },
               ].map((item, i) => (
                 <Link key={i} href={item.path}>
                   <Button variant="ghost" className="w-full justify-between rounded-xl h-14 font-bold hover:bg-white dark:hover:bg-slate-900 hover:shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-800 group transition-all px-4">
                     <div className="flex items-center gap-4">
                       <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:text-purple-600 transition-colors">
                         <item.icon className={`h-4 w-4 ${item.color}`} />
                       </div>
                       <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                     </div>
                     <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                   </Button>
                 </Link>
               ))}
             </div>
          </section>
        </div>
      </div>
    </div>
  )
}
