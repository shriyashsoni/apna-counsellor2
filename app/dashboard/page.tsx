"use client"

import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
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
  CalendarCheck,
  Filter,
  AlertCircle,
  Video,
  Star as StarIcon,
  PlayCircle
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { UserNav } from "@/components/user-nav"
import { useRouter } from "next/navigation"
import { ReviewModal } from "@/components/review-modal"

import { predictAI } from "@/lib/ai"
import { predictColleges } from "@/lib/actions/predict"

export default function DashboardPage() {
  const router = useRouter()
  const { user: firebaseUser, isLoading: authLoading } = useAuth()
  const [profile, setProfile] = useState<any>(undefined)
  const [user, setUser] = useState<any>(undefined)
  const supabase = createClient()

  useEffect(() => {
    // Wait for Firebase auth to resolve before acting
    if (authLoading) return;

    if (!firebaseUser) {
      router.push("/login")
      return
    }

    async function loadProfile() {
      // Use the Firebase user's deterministic UUID (mapped to Supabase)
      const userId = firebaseUser!.id

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (!profileData || !profileData.onboarding_complete) {
        router.push("/onboarding")
      } else {
        setProfile(profileData)
        setUser({
          id: userId,
          uid: firebaseUser!.uid,
          email: firebaseUser!.email,
          name: firebaseUser!.name,
          role: profileData.role || 'student'
        })
      }
    }
    loadProfile()
  }, [authLoading, firebaseUser, router])

  if (authLoading || user === undefined || profile === undefined) return (
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

const EXAMS = ['JEE Advanced', 'JEE Mains', 'MHT-CET', 'COMEDK', 'AKTU', 'BITSAT'];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS', 'PWD'];
const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
];
const BRANCHES = [
  'Computer Science', 'IT', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Chemical', 'Aerospace', 'Data Science', 'AI & ML'
];
const SKILLS = ['JEE Advanced', 'JEE Mains', 'MHT-CET', 'COMEDK', 'Programming', 'Career Guidance'];
const COUNSELING_TYPES = ['JoSAA', 'MHT-CET', 'CSAB', 'JAC Delhi', 'COMEDK'];

function StudentDashboard({ profile, user }: { profile: any, user: any }) {
  const [activeTab, setActiveTab] = useState<"overview" | "predictor" | "mentors" | "subscriptions" | "batches">("overview")
  const [sessions, setSessions] = useState<any[]>([])
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [classroomCourse, setClassroomCourse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<any>(null)
  const [greeting, setGreeting] = useState("Welcome back")
  const supabase = createClient()

  // Predictor state
  const [counselings, setCounselings] = useState<any[]>([])
  const [selectedCounseling, setSelectedCounseling] = useState<any>(null)
  const [examSearch, setExamSearch] = useState("")
  const [rank, setRank] = useState("")
  const [percentile, setPercentile] = useState("")
  const [category, setCategory] = useState(profile.category || "General")
  const [homeState, setHomeState] = useState(profile.city || "")
  const [selectedBranches, setSelectedBranches] = useState<string[]>([])
  const [isPredicting, setIsPredicting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [aiSummary, setAiSummary] = useState("")
  const [dbResults, setDbResults] = useState<any[] | null>(null)

  // Mentors state
  const [mentorSearch, setMentorSearch] = useState("")
  const [selectedSkill, setSelectedSkill] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [mentorsList, setMentorsList] = useState<any[]>([])
  const [isMentorsLoading, setIsMentorsLoading] = useState(false)

  // Subscriptions/Courses state
  const [allCourses, setAllCourses] = useState<any[]>([])
  const [isCoursesLoading, setIsCoursesLoading] = useState(false)

  useEffect(() => {
    const hrs = new Date().getHours()
    if (hrs < 12) setGreeting("Good morning")
    else if (hrs < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  // Initial dashboard load
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [sessRes, enrolledRes] = await Promise.all([
          supabase.from('sessions').select('*').eq('student_id', user.id).order('created_at', { ascending: false }),
          supabase.from('course_enrollments').select('*, courses(*)').eq('student_id', user.id).eq('status', 'active')
        ])
        
        setSessions(sessRes.data || [])
        const coursesData = enrolledRes.data || []
        setEnrolledCourses(coursesData)

        const enrolledCourseIds = coursesData.map((ec: any) => ec.course_id).filter(Boolean)
        let query = supabase.from('notifications').select('*, courses(title)')
        
        if (enrolledCourseIds.length > 0) {
          query = query.or(`target_group.eq.all,target_group.eq.students,user_id.eq.${user.id},course_id.in.(${enrolledCourseIds.join(',')})`)
        } else {
          query = query.or(`target_group.eq.all,target_group.eq.students,user_id.eq.${user.id}`)
        }
        
        const { data: notifsRes } = await query.order('created_at', { ascending: false }).limit(10)
        setNotifications(notifsRes || [])
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [user.id])

  // Fetch counselings for predictor
  useEffect(() => {
    if (activeTab === 'predictor' && counselings.length === 0) {
      supabase.from("counselings").select("*").then(({ data }) => {
        setCounselings(data || [])
        if (data && profile.exam) {
          const found = data.find((c: any) => 
            c.name.toLowerCase().includes(profile.exam.toLowerCase()) || 
            c.exam?.toLowerCase().includes(profile.exam.toLowerCase())
          );
          if (found) setSelectedCounseling(found);
        }
      })
    }
  }, [activeTab, counselings.length, profile.exam])

  // Fetch mentors list
  useEffect(() => {
    if (activeTab === 'mentors' || activeTab === 'overview') {
      async function fetchMentors() {
        setIsMentorsLoading(true)
        try {
          let query = supabase.from("profiles").select("*").eq("role", "mentor").eq("is_visible", true)
          if (mentorSearch) {
            query = query.ilike("name", `%${mentorSearch}%`)
          }
          const { data } = await query
          let filtered = data || []
          if (selectedSkill) {
            filtered = filtered.filter(m => m.skills?.includes(selectedSkill))
          }
          if (selectedType) {
            filtered = filtered.filter(m => m.counseling_type?.includes(selectedType))
          }
          setMentorsList(filtered)
        } catch (err) {
          console.error("Error fetching mentors:", err)
        } finally {
          setIsMentorsLoading(false)
        }
      }
      fetchMentors()
    }
  }, [activeTab, mentorSearch, selectedSkill, selectedType])

  // Fetch all courses for subscription
  useEffect(() => {
    if (activeTab === 'subscriptions') {
      async function fetchCourses() {
        setIsCoursesLoading(true)
        try {
          const { data } = await supabase
            .from('courses')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
          setAllCourses(data || [])
        } catch (err) {
          console.error("Error fetching courses:", err)
        } finally {
          setIsCoursesLoading(false)
        }
      }
      fetchCourses()
    }
  }, [activeTab])

  const hasActiveAccess = enrolledCourses.length > 0

  const handlePredict = async () => {
    if (!rank && !percentile) return
    setIsPredicting(true)
    setAiSummary("")
    setDbResults(null)
    
    try {
      const examName = selectedCounseling?.name || profile.exam || "JEE Mains"
      const userRank = rank ? parseInt(rank.replace(/,/g, "")) : (percentile ? Math.floor((100 - parseFloat(percentile)) * 12000) : 0)
      
      const dataResults = await predictColleges({
        exam: examName,
        rank: userRank,
        category,
        homeState,
        preferredBranches: selectedBranches
      })
      setDbResults(dataResults || [])

      const aiResponse = await predictAI({
        exam: examName,
        rank: userRank,
        category,
        homeState,
        preferredBranches: selectedBranches,
        verifiedData: dataResults?.slice(0, 10)
      })
      
      if (aiResponse) {
        setAiSummary(aiResponse.summary || "")
      }
      setShowResults(true)
    } catch (error) {
      console.error("Prediction failed:", error)
      setDbResults([])
      setShowResults(true) 
    } finally {
      setIsPredicting(false)
    }
  }

  const toggleBranch = (branch: string) => {
    setSelectedBranches(prev => 
      prev.includes(branch) ? prev.filter(b => b !== branch) : [...prev, branch]
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Professional Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black tracking-wider text-purple-600 dark:text-purple-400 uppercase bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded">
              {greeting}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {profile.name || "Student"}
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Admissions and Strategy Desk. Manage college targets, live counseling tracker and mentorship.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2.5 py-1 text-xs font-bold rounded-lg flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> Active Student
          </Badge>
          <UserNav />
        </div>
      </div>

      {/* Mobile-first Navigation Pills (Accessible top drawer on small screen) */}
      <div className="lg:hidden flex gap-1.5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
        {[
          { id: "overview", label: "Overview", icon: LayoutDashboard },
          { id: "predictor", label: "Predictor", icon: TrendingUp },
          { id: "mentors", label: "Mentors", icon: Users },
          { id: "subscriptions", label: "Courses", icon: CreditCard },
          { id: "batches", label: "Batches", icon: Rocket },
        ].map((tab) => {
          const Icon = tab.icon
          const isSelected = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any)
                setClassroomCourse(null)
              }}
              className={`snap-start shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                isSelected 
                  ? "bg-purple-600 text-white border-purple-600 shadow-sm" 
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Main Grid: Desktop side menu, responsive views */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left/Middle: Selected View Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Target Stats Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Target Goal", value: profile.exam || "Not Specified", icon: Target, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/20" },
                  { label: "Category", value: profile.category || "General", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
                  { label: "Percentile/Rank", value: profile.rank ? `#${profile.rank}` : "Pending", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/20" },
                  { label: "Target Year", value: profile.target_year || "2026", icon: Calendar, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20" },
                ].map((stat, i) => (
                  <Card key={i} className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                    <CardContent className="p-4 flex flex-col justify-between h-28">
                      <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color} shadow-sm`}>
                        <stat.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase font-black text-slate-400 tracking-wider mb-0.5">{stat.label}</p>
                        <p className="text-sm font-black text-slate-950 dark:text-white truncate">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Classroom Batches Quick View */}
              <div className="space-y-3">
                <h2 className="text-sm font-black uppercase text-slate-400 flex items-center gap-1.5 px-1">
                  <Rocket className="h-4 w-4 text-purple-600" /> Active Classrooms
                </h2>
                {enrolledCourses.length === 0 ? (
                  <Card className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-6 text-center shadow-sm">
                    <p className="text-xs text-slate-500 font-semibold mb-4">You have not subscribed to any batch programs yet.</p>
                    <Button onClick={() => setActiveTab("subscriptions")} size="sm" className="rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-700 text-white">
                      Explore Admissions Courses
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {enrolledCourses.map((ec) => (
                      <Card key={ec.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-5 flex flex-col justify-between shadow-sm">
                        <div>
                          <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[8px] font-black uppercase tracking-wider mb-2">SUBSCRIBED</Badge>
                          <h3 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">{ec.courses?.title}</h3>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{ec.courses?.description}</p>
                        </div>
                        <Button 
                          onClick={() => {
                            setClassroomCourse(ec)
                            setActiveTab("batches")
                          }} 
                          size="sm" 
                          className="w-full mt-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9"
                        >
                          Access Classroom <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirmed Schedule Call List */}
              <div className="space-y-3">
                <h2 className="text-sm font-black uppercase text-slate-400 flex items-center gap-1.5 px-1">
                  <Calendar className="h-4 w-4 text-emerald-500" /> Booked Strategy Sessions
                </h2>
                {sessions.length === 0 ? (
                  <Card className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-6 text-center shadow-sm">
                    <p className="text-xs text-slate-500 font-semibold mb-4">No active 1-on-1 strategy sessions found on schedule.</p>
                    <Button onClick={() => setActiveTab("mentors")} size="sm" variant="outline" className="rounded-xl font-bold text-xs border-purple-600 text-purple-600">
                      Book Session with Mentor
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((s) => (
                      <Card key={s.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-4 flex justify-between items-center shadow-sm">
                        <div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white">{s.title || "Admissions Consultation"}</h4>
                          <p className="text-[11px] text-slate-500 font-bold mt-0.5">Mentor: {s.mentor_name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{s.date} @ {s.time_slot}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {s.status === 'confirmed' && s.meeting_link && (
                            <a href={s.meeting_link} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" className="bg-purple-600 text-white text-[10px] font-bold rounded-lg h-8 px-3">Join Meet</Button>
                            </a>
                          )}
                          <Badge className={`text-[8px] font-black uppercase tracking-wider ${
                            s.status === 'confirmed' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                          }`}>
                            {s.status}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications Center */}
              {notifications.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-black uppercase text-slate-400 flex items-center gap-1.5 px-1">
                    <Bell className="h-4 w-4 text-amber-500" /> Notifications & Alerts
                  </h2>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-start gap-3 shadow-sm">
                        <div className="h-8 w-8 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-lg flex items-center justify-center shrink-0">
                          <Bell className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex justify-between items-start flex-wrap gap-1">
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white">{n.title}</h4>
                            <span className="text-[9px] font-bold text-slate-400">{new Date(n.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{n.message}</p>
                          {n.link && (
                            <a href={n.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[10px] font-bold text-purple-600 mt-1">
                              View Update <ArrowUpRight className="ml-0.5 h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: INLINE COLLEGE PREDICTOR */}
          {activeTab === "predictor" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {!showResults ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Form fields */}
                  <Card className="md:col-span-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                    <CardContent className="p-6 space-y-6">
                      
                      {/* Counseling selection */}
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Counseling</label>
                          <Input 
                            placeholder="Filter counselings..." 
                            className="h-9 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            value={examSearch}
                            onChange={(e) => setExamSearch(e.target.value)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                          {(counselings || [])
                            .filter(c => c.name.toLowerCase().includes(examSearch.toLowerCase()) || (c.exam || '').toLowerCase().includes(examSearch.toLowerCase()))
                            .map((c: any) => (
                              <button
                                key={c.id}
                                onClick={() => setSelectedCounseling(c)}
                                className={`p-3 rounded-xl font-bold text-[10px] text-left transition-all border ${
                                  selectedCounseling?.id === c.id 
                                    ? "bg-purple-600 border-purple-600 text-white shadow-sm" 
                                    : "bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-purple-300"
                                }`}
                              >
                                <span className="line-clamp-1 leading-tight">{c.name}</span>
                              </button>
                            ))}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                          <select 
                            className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 font-bold text-xs text-slate-900 dark:text-white appearance-none cursor-pointer"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                          >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Home State</label>
                          <select 
                            className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 font-bold text-xs text-slate-900 dark:text-white appearance-none cursor-pointer"
                            value={homeState}
                            onChange={(e) => setHomeState(e.target.value)}
                          >
                            <option value="">Select State</option>
                            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Percentile (Optional)</label>
                          <Input 
                            placeholder="e.g. 98.45" 
                            className="h-11 rounded-xl text-xs font-bold border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4"
                            value={percentile}
                            onChange={(e) => setPercentile(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">AIR / Category Rank</label>
                          <Input 
                            placeholder="e.g. 12450" 
                            className="h-11 rounded-xl text-xs font-bold border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4"
                            value={rank}
                            onChange={(e) => setRank(e.target.value)}
                          />
                        </div>
                      </div>

                      <Button 
                        onClick={handlePredict}
                        disabled={isPredicting || (!rank && !percentile) || !selectedCounseling}
                        className="w-full h-12 rounded-xl text-xs font-black bg-purple-600 hover:bg-purple-700 text-white gap-2 shadow-sm"
                      >
                        {isPredicting ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Analyzing cutoff data...
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4" />
                            Fetch College Predictions
                          </>
                        )}
                      </Button>

                    </CardContent>
                  </Card>

                  {/* Branches Filter Column */}
                  <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Filter className="h-3.5 w-3.5" /> Preferred Branches
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {BRANCHES.map(b => (
                        <button
                          key={b}
                          onClick={() => toggleBranch(b)}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all border ${
                            selectedBranches.includes(b)
                              ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                              : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-650 hover:border-purple-300"
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Results Header */}
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setShowResults(false)} className="rounded-xl h-9 w-9 bg-white border border-slate-200 shadow-sm">
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <div>
                        <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Prediction Results</h2>
                        <p className="text-[10px] text-slate-500 font-bold">{selectedCounseling?.name} · Category: {category} · Rank: {rank || percentile}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setShowResults(false)} className="rounded-xl text-[10px] font-black uppercase tracking-wider px-3 h-8">
                      Adjust Ranks
                    </Button>
                  </div>

                  {/* AI Summary Card */}
                  {aiSummary && (
                    <Card className="border border-purple-100 dark:border-purple-900/30 rounded-2xl bg-purple-50/40 dark:bg-purple-950/15 p-5">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 bg-purple-600 text-white rounded-lg flex items-center justify-center shrink-0">
                          <Sparkles className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">AI Counselor Strategy Assessment</h3>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic whitespace-pre-wrap">
                            {aiSummary}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Results Cards List */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {dbResults === null ? (
                      <div className="col-span-full py-12 text-center space-y-3">
                        <div className="h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-xs text-slate-500 font-bold">Querying verified cutoff database...</p>
                      </div>
                    ) : dbResults.length === 0 ? (
                      <Card className="col-span-full p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-sm font-black mb-1">No Matches Found</h3>
                        <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto">
                          We couldn't locate matching seat probabilities in this counseling round. Try broadening category/state settings.
                        </p>
                      </Card>
                    ) : (
                      dbResults.map((item: any, i: number) => (
                        <Card key={i} className={`border rounded-2xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden ${
                          item.tag === 'Safe' ? 'border-emerald-500/20' : 
                          item.tag === 'Moderate' ? 'border-orange-500/20' : 'border-blue-500/20'
                        }`}>
                          <CardContent className="p-5 space-y-4">
                            <div className="flex justify-between items-start gap-3">
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <Badge className={`border-none px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                                    item.tag === 'Safe' ? 'bg-emerald-500 text-white' : 
                                    item.tag === 'Moderate' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                                  }`}>
                                    {item.tag || 'Moderate'}
                                  </Badge>
                                  <Badge variant="outline" className="border-slate-200 dark:border-slate-800 text-slate-500 text-[8px] font-black tracking-wider px-2 py-0.5 rounded">
                                    {item.quota || 'AI'} Quota
                                  </Badge>
                                </div>
                                <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight line-clamp-1">{item.name}</h3>
                                <p className="text-[10px] text-slate-400 font-semibold">{item.state} · {item.type || 'Govt'}</p>
                              </div>
                              <div className="h-10 w-10 rounded-lg bg-slate-50 dark:bg-slate-850 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                                <span className="text-[8px] font-black text-slate-400 leading-none uppercase">NIRF</span>
                                <span className="text-xs font-black leading-none mt-0.5">{item.nirfRank || '#?'}</span>
                              </div>
                            </div>

                            <div className="p-3 bg-slate-50 dark:bg-slate-850/50 rounded-xl flex items-center gap-3 border border-slate-100 dark:border-slate-800">
                              <GraduationCap className="h-4 w-4 text-purple-600 shrink-0" />
                              <div className="min-w-0">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Admitted Branch</p>
                                <p className="text-xs font-black text-slate-900 dark:text-white truncate leading-none">{item.branch}</p>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-450">
                                <span>Probability</span>
                                <span>{item.probability}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${
                                    item.tag === 'Safe' ? 'bg-emerald-500' : 
                                    item.tag === 'Moderate' ? 'bg-orange-500' : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${item.probability}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/50 text-[10px] font-bold text-slate-500">
                              <div className="flex gap-4">
                                <div>
                                  <span className="text-[8px] font-black text-slate-400 block uppercase">Avg Package</span>
                                  <span className="font-black text-slate-850 dark:text-slate-200">{item.avgPackage || '₹8-10 LPA'}</span>
                                </div>
                                <div>
                                  <span className="text-[8px] font-black text-slate-400 block uppercase">Cutoff Rank</span>
                                  <span className="font-black text-slate-850 dark:text-slate-200">{item.cutoffRank || 'N/A'}</span>
                                </div>
                              </div>
                              <Link href={`/college/${item.id}`}>
                                <Button size="sm" className="h-8 rounded-lg text-[9px] font-black uppercase px-3 gap-1">
                                  View Detail <ChevronRight className="h-3 w-3" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COURSE MENTORS */}
          {activeTab === "mentors" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Mentor Search and Filters UI */}
              <div className="grid md:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                
                {/* Search Bar */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400">Search Mentor</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="Name, IIT, NIT or branch..."
                      className="h-10 pl-9 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-250"
                      value={mentorSearch}
                      onChange={(e) => setMentorSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Focus Skill Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400">Focus Area</label>
                  <select 
                    className="w-full h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 px-3 font-bold text-xs text-slate-900 dark:text-white"
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                  >
                    <option value="">All Areas</option>
                    {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Counseling Type Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400">Counseling Portal</label>
                  <select 
                    className="w-full h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 px-3 font-bold text-xs text-slate-900 dark:text-white"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">All Portals</option>
                    {COUNSELING_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Mentor Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {isMentorsLoading ? (
                  <div className="col-span-full py-12 text-center space-y-3">
                    <div className="h-8 w-8 border-3 border-purple-650 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-slate-500 font-bold">Fetching certified mentors list...</p>
                  </div>
                ) : mentorsList.length === 0 ? (
                  <div className="col-span-full py-12 text-center">
                    <Users className="h-10 w-10 text-slate-350 mx-auto mb-3" />
                    <h3 className="text-sm font-black mb-1">No Mentors Available</h3>
                    <p className="text-xs text-slate-500 font-semibold">Try adjusting focus area or search keywords.</p>
                  </div>
                ) : (
                  mentorsList.map((mentor) => (
                    <Card key={mentor.id} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                      <div className="h-16 w-16 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden relative border border-slate-200 dark:border-slate-700">
                        {mentor.avatar_url ? (
                          <img src={mentor.avatar_url} alt={mentor.name} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-full w-full p-4 text-slate-300 dark:text-slate-650" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-sm text-slate-950 dark:text-white truncate leading-tight">{mentor.name}</h3>
                        <p className="text-[11px] text-slate-500 font-semibold truncate mt-0.5">{mentor.college || "Senior Admissions Counselor"}</p>
                        
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center gap-0.5 text-[9px] font-black text-orange-600 bg-orange-100/50 dark:bg-orange-950/20 px-2 py-0.5 rounded">
                            ★ {mentor.rating || "5.0"}
                          </div>
                          <span className="text-[9px] font-black text-slate-400 uppercase">₹{mentor.pricing || "499"} / Round</span>
                        </div>
                      </div>
                      
                      <Link href={`/mentor/${mentor.id}`}>
                        <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-purple-650 hover:bg-purple-50 dark:hover:bg-purple-950/20">
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </Link>
                    </Card>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 4: COURSES SUBSCRIPTIONS */}
          {activeTab === "subscriptions" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {isCoursesLoading ? (
                <div className="py-12 text-center space-y-3">
                  <div className="h-8 w-8 border-3 border-purple-650 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-500 font-bold">Loading admissions courses catalog...</p>
                </div>
              ) : allCourses.length === 0 ? (
                <Card className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                  <p className="text-xs text-slate-500 font-semibold">No published courses available for enrollment currently.</p>
                </Card>
              ) : (
                <>
                  {/* Category 1: Live Courses */}
                  {allCourses.filter(c => c.mode !== 'Data Course').length > 0 && (
                    <div className="space-y-4">
                      <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                        <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          Top Live Counselling Programs
                        </h2>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {allCourses.filter(c => c.mode !== 'Data Course').map((course) => (
                          <DashboardCourseCard key={course.id} course={course} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category 2: Data Courses */}
                  {allCourses.filter(c => c.mode === 'Data Course').length > 0 && (
                    <div className="space-y-4">
                      <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                        <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                          Self-Paced & Data-Driven Courses
                        </h2>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {allCourses.filter(c => c.mode === 'Data Course').map((course) => (
                          <DashboardCourseCard key={course.id} course={course} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* TAB 5: BATCHES DATA (CLASSROOM) */}
          {activeTab === "batches" && (
            <div className="animate-in fade-in duration-200">
              {classroomCourse === null ? (
                <div className="space-y-4">
                  <h2 className="text-sm font-black uppercase text-slate-400 px-1">Your Subscribed Classrooms</h2>
                  {enrolledCourses.length === 0 ? (
                    <Card className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-8 text-center shadow-sm">
                      <Rocket className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                      <h3 className="text-sm font-black mb-1">No Enrolled Batches</h3>
                      <p className="text-xs text-slate-500 font-semibold mb-4">Subscribe to our counselor-guided programs to unlock your active classroom lectures and tracker sheets.</p>
                      <Button onClick={() => setActiveTab("subscriptions")} className="rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-700 text-white">
                        Unlock Batches
                      </Button>
                    </Card>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {enrolledCourses.map((ec) => (
                        <Card key={ec.id} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                          <div>
                            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-black text-[8px] uppercase tracking-wider px-2 py-0.5 rounded mb-2 inline-block">ACTIVE CLASSROOM</span>
                            <h3 className="font-black text-sm text-slate-950 dark:text-white leading-snug line-clamp-1">{ec.courses?.title}</h3>
                            <p className="text-[11px] text-slate-500 font-medium mt-1 line-clamp-2">{ec.courses?.description}</p>
                          </div>
                          <Button 
                            onClick={() => setClassroomCourse(ec)}
                            className="w-full mt-4 rounded-xl bg-purple-650 hover:bg-purple-750 text-white font-bold text-xs h-9"
                          >
                            Access Lectures & Resources <ArrowRight className="ml-1 h-3.5 w-3.5" />
                          </Button>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Classroom Detail Header */}
                  <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-3">
                    <div className="flex items-center gap-2.5">
                      <Button variant="ghost" size="icon" onClick={() => setClassroomCourse(null)} className="rounded-xl h-8 w-8 bg-slate-50 dark:bg-slate-800 border border-slate-200">
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <div>
                        <h2 className="text-sm font-black text-slate-950 dark:text-white line-clamp-1">{classroomCourse.courses?.title}</h2>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Syllabus & Lecture Tracker</p>
                      </div>
                    </div>
                    <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-black text-[8px] uppercase px-2.5 py-1">ENROLLED</Badge>
                  </div>

                  {/* Classroom Details Content */}
                  <div className="grid md:grid-cols-12 gap-6">
                    {/* Syllabus list */}
                    <div className="md:col-span-7 space-y-4">
                      <Card className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Structured Syllabus Overview</h3>
                        <div className="space-y-3">
                          {Array.isArray(classroomCourse.courses?.curriculum) && classroomCourse.courses.curriculum.map((m: any, i: number) => (
                            <div key={i} className="p-3 bg-slate-50 dark:bg-slate-850/50 rounded-xl border border-slate-100 dark:border-slate-800">
                              <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">{m.title}</h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-1">Structured learning unit and preference templates.</p>
                            </div>
                          ))}
                          {(!classroomCourse.courses?.curriculum || classroomCourse.courses.curriculum.length === 0) && (
                            <p className="text-xs text-slate-400 italic text-center py-6">Admissions curriculum syllabus will be uploaded by counsel team shortly.</p>
                          )}
                        </div>
                      </Card>
                    </div>

                    {/* Resources & Files links list */}
                    <div className="md:col-span-5 space-y-4">
                      <Card className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Classroom Resources</h3>
                        <div className="space-y-2">
                          {(classroomCourse.courses?.resources || []).map((r: any, idx: number) => (
                            <a key={idx} href={r.url} target="_blank" rel="noopener noreferrer" className="block p-3 bg-slate-50 dark:bg-slate-850/40 hover:bg-purple-50/50 dark:hover:bg-purple-950/10 rounded-xl border border-slate-150 transition-all group">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                                    r.type === 'video' ? 'bg-red-50 text-red-500' :
                                    r.type === 'pdf' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'
                                  }`}>
                                    {r.type === 'video' ? <Video className="h-3.5 w-3.5" /> :
                                     r.type === 'pdf' ? <FileText className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}
                                  </div>
                                  <div className="min-w-0 text-left">
                                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-purple-650 transition-colors">{r.title}</p>
                                    <p className="text-[8px] font-black text-slate-400 uppercase mt-0.5 tracking-wider">{r.type}</p>
                                  </div>
                                </div>
                                <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-purple-600 shrink-0" />
                              </div>
                            </a>
                          ))}
                          {(!classroomCourse.courses?.resources || classroomCourse.courses.resources.length === 0) && (
                            <p className="text-xs text-slate-400 italic text-center py-6">Admissions spreadsheets, pdfs and video links will appear here.</p>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Sidebar: Switcher and details (Adapts columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Desktop Right Corner Navigation Selector Card */}
          <Card className="hidden lg:block border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm bg-white dark:bg-slate-900 p-5 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Admissions Control</h3>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
                { id: "predictor", label: "College Predictor", icon: TrendingUp },
                { id: "mentors", label: "Course Mentors", icon: Users },
                { id: "subscriptions", label: "Explore Programs", icon: CreditCard },
                { id: "batches", label: "Batches Classroom", icon: Rocket },
              ].map((tab) => {
                const Icon = tab.icon
                const isSelected = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any)
                      setClassroomCourse(null)
                    }}
                    className={`w-full flex items-center justify-between rounded-xl h-10 px-3 font-bold text-xs transition-all border ${
                      isSelected 
                        ? "bg-purple-600 text-white border-purple-600 shadow-sm" 
                        : "bg-transparent text-slate-700 dark:text-slate-350 border-transparent hover:bg-slate-50 dark:hover:bg-slate-850"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </div>
                    {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Profile Details Card */}
          <Card className="border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 dark:text-white">Admissions Profile</h3>
              <Badge className="bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border-none font-bold text-[9px]">Verified</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 transition-colors">
                <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-purple-600 shadow-sm border border-slate-200 dark:border-slate-705">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Home City</p>
                  <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">{profile.city || "Not Specified"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 transition-colors">
                <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-purple-600 shadow-sm border border-slate-200 dark:border-slate-705">
                  <Globe className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">State Focus</p>
                  <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
                    {profile?.interested_states?.join(", ") || "All India"}
                  </p>
                </div>
              </div>
            </div>

            <Link href="/onboarding" className="block">
              <Button variant="ghost" className="w-full h-10 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20 font-black text-[10px] uppercase tracking-wider transition-all">
                Update Admissions Settings
              </Button>
            </Link>
          </Card>

          {/* Quick Ecosystem Links */}
          <section className="space-y-2">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-3">Ecosystem Services</h3>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { icon: BookOpen, label: "Resource Library", path: "/resources", color: "text-blue-500" },
                { icon: CreditCard, label: "Subscription Plans", path: "/pricing", color: "text-emerald-500" },
                { icon: Settings, label: "Account Settings", path: "/settings", color: "text-slate-500" },
                { icon: MessageSquare, label: "Help & Support", path: "/support", color: "text-purple-500" },
              ].map((item, i) => (
                <Link key={i} href={item.path}>
                  <Button variant="ghost" className="w-full justify-between rounded-xl h-12 font-bold hover:bg-white dark:hover:bg-slate-900 hover:shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-800/80 group transition-all px-3">
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-lg bg-slate-105 dark:bg-slate-800 flex items-center justify-center group-hover:text-purple-600 transition-colors">
                        <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{item.label}</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                  </Button>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>

      {selectedSession && (
        <ReviewModal 
          isOpen={!!selectedSession}
          onClose={() => setSelectedSession(null)}
          mentorId={selectedSession.mentor_id}
          mentorName={selectedSession.mentor_name}
          sessionId={selectedSession.id}
        />
      )}
    </div>
  )
}

function DashboardCourseCard({ course }: { course: any }) {
  return (
    <Card className="h-full flex flex-col border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold text-[9px] uppercase px-2 py-0.5 rounded">
            {course.category || 'Counselling'}
          </span>
          {course.is_featured && (
            <span className="bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 font-bold text-[9px] uppercase px-2 py-0.5 rounded">
              ★ FEATURED
            </span>
          )}
          {course.discount_badge && (
            <span className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500 font-bold text-[9px] uppercase px-2 py-0.5 rounded">
              {course.discount_badge}
            </span>
          )}
        </div>
        <CardTitle className="text-base font-black text-slate-900 dark:text-white leading-tight line-clamp-1">
          {course.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0 flex-grow">
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-medium mb-3">
          {course.description}
        </p>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-450">
          <PlayCircle className="h-3.5 w-3.5 text-purple-500" />
          <span>{course.total_lessons || '15+'} Lessons Included</span>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 mt-auto pt-4">
        <div>
          {course.is_free ? (
            <p className="text-sm font-black text-emerald-500">FREE</p>
          ) : (
            <p className="text-sm font-black text-slate-900 dark:text-white">₹{Number(course.price).toLocaleString()}</p>
          )}
        </div>
        <Link href={`/courses/${course.slug}`}>
          <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs h-9">
            Details <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
