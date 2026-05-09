"use client"

import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
  Database
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
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push("/login")
        return
      }
      
      // Get profile with metadata from user
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (!profileData) {
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
      <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
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
      
      setStats({ users, colleges, mentors, revenue: 0 })
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
  const [subscription, setSubscription] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [mentors, setMentors] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [subRes, sessRes, mentorRes] = await Promise.all([
          supabase.from('payments').select('*').eq('user_id', user.id).eq('status', 'captured').maybeSingle(),
          supabase.from('sessions').select('*').eq('student_id', user.id).order('date', { ascending: true }),
          supabase.from('profiles').select('*').eq('role', 'mentor').limit(4)
        ])
        
        setSubscription(subRes.data)
        setSessions(sessRes.data || [])
        setMentors(mentorRes.data || [])
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [user.id])

  const isPro = !!subscription;

  const getRecommendedPortals = () => {
    const portals = []
    if (profile.exam === "JEE") {
      portals.push({ id: "JoSAA", name: "JoSAA 2026", desc: "IIT & NIT Admission Portal", icon: "J", color: "orange" })
      portals.push({ id: "CSAB", name: "CSAB 2026", desc: "NIT+ System Spot Rounds", icon: "C", color: "blue" })
    }
    if (profile.exam === "NEET") {
      portals.push({ id: "MCC", name: "MCC Medical", desc: "All India Quota Medical Admissions", icon: "M", color: "red" })
    }
    if (profile?.interested_states?.includes("Maharashtra") || profile.city === "Mumbai" || profile.city === "Pune") {
      portals.push({ id: "MHT-CET", name: "MHT-CET 2026", desc: "Maharashtra Engineering Portal", icon: "M", color: "purple" })
    }
    if (portals.length === 0) {
      portals.push({ id: "JEE-Main", name: "JEE Main Portal", desc: "Exam registration & results", icon: "J", color: "blue" })
    }
    return portals.slice(0, 4)
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Pro Banner for free users */}
      {!isPro && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 md:p-12 rounded-[3rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden group shadow-2xl border border-white/5"
        >
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000 rotate-12">
              <Sparkles className="h-48 w-48 text-primary" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <Badge className="bg-primary/20 text-primary border-primary/20 font-black text-[10px] uppercase tracking-widest px-3 py-1 mb-6">Premium Alpha Access</Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tighter">Revolutionize Your <br/><span className="text-primary">Admission Journey.</span></h2>
            <p className="text-slate-400 font-medium text-lg leading-relaxed mb-10 max-w-xl">
              Unlock **100+ predictors**, real-time round alerts, and priority 1-on-1 mentorship. Don&apos;t leave your future to chance.
            </p>
            <Link href="/pricing">
              <Button className="rounded-2xl h-16 px-10 font-black text-lg shadow-2xl shadow-primary/40 bg-primary hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
                Upgrade to Pro
                <Zap className="ml-2 h-5 w-5 fill-current" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Stats Overview */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Active Goal", value: profile.exam || "Not Set", icon: Target, color: "text-primary", bg: "bg-primary/10" },
          { label: "Category", value: profile.category || "General", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Current Rank", value: profile.rank ? `#${profile.rank}` : "Pending", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Target Year", value: profile.target_year || "2026", icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-xl transition-all">
            <CardContent className="p-8">
              <div className="flex flex-col gap-6">
                <div className={`h-14 w-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-black text-slate-400 tracking-widest mb-1.5">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-10">
          
          {/* Recommendations */}
          <section>
            <div className="flex justify-between items-center mb-8 px-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-black tracking-tight">Recommended Portals</h2>
              </div>
              <Link href="/counselling" className="text-primary text-sm font-bold hover:underline flex items-center gap-1 group">
                Browse All <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
               {getRecommendedPortals().map((portal, i) => (
                 <Card key={i} className="border-none rounded-[3rem] shadow-sm bg-white dark:bg-slate-900 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-50 dark:border-slate-800">
                   <CardContent className="p-10">
                     <div className="flex justify-between items-start mb-8">
                       <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center font-black text-3xl shadow-xl
                         ${portal.color === 'orange' ? 'bg-orange-50 text-orange-500 shadow-orange-500/10' : 
                           portal.color === 'blue' ? 'bg-blue-50 text-blue-500 shadow-blue-500/10' : 
                           portal.color === 'red' ? 'bg-red-50 text-red-500 shadow-red-500/10' : 
                           'bg-purple-50 text-purple-500 shadow-purple-500/10'}`}
                       >
                         {portal.icon}
                       </div>
                       <Badge className="bg-slate-50 dark:bg-slate-800 text-slate-400 border-none font-bold">2026 Live</Badge>
                     </div>
                     <h3 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors">{portal.name}</h3>
                     <p className="text-slate-500 text-base mb-8 font-medium leading-relaxed">{portal.desc}</p>
                     <Link href={`/counselling/${portal.id}`}>
                       <Button className="w-full h-14 rounded-2xl bg-slate-50 hover:bg-primary hover:text-white text-slate-900 dark:bg-slate-800 border-none font-black text-base shadow-sm group">
                         Access Dashboard 
                         <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                       </Button>
                     </Link>
                   </CardContent>
                 </Card>
               ))}
            </div>
          </section>

          {/* Top Institutions Quick Lists */}
          <section>
            <div className="flex justify-between items-center mb-8 px-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm">
                  <Trophy className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-black tracking-tight">Institute Catalogs</h2>
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
                  <Card className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                    <CardContent className="p-8 flex flex-col items-center text-center">
                      <div className={`h-14 w-14 rounded-2xl ${cat.color} text-white flex items-center justify-center mb-6 shadow-xl shadow-black/5 font-black text-sm group-hover:scale-110 transition-transform`}>
                        {cat.label}
                      </div>
                      <p className="font-black text-xl mb-1.5">{cat.label}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.count} Institutions</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

           {/* Upcoming Sessions */}
           <section>
             <div className="flex justify-between items-center mb-8 px-2">
               <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-sm">
                   <Calendar className="h-6 w-6" />
                 </div>
                 <h2 className="text-3xl font-black tracking-tight">Your Schedule</h2>
               </div>
               <Link href="/sessions" className="text-primary text-sm font-bold hover:underline">Manage All</Link>
             </div>
             {sessions.length === 0 ? (
               <Card className="border-none rounded-[3rem] p-12 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800">
                  <Clock className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                  <h3 className="text-xl font-bold mb-2">No Sessions Booked</h3>
                  <p className="text-slate-500 font-medium mb-8">Book a 1-on-1 session with our experts to plan your strategy.</p>
                  <Link href="/mentorship">
                    <Button variant="outline" className="rounded-2xl h-12 px-8 font-black border-primary text-primary hover:bg-primary hover:text-white">Book Expert Session</Button>
                  </Link>
               </Card>
             ) : (
               <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                 {sessions.map((s) => (
                   <Card key={s.id} className="min-w-[320px] border-none rounded-[3rem] shadow-sm bg-white dark:bg-slate-900 p-8 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all">
                     <div className="flex justify-between items-start mb-6">
                       <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                         <Calendar className="h-6 w-6" />
                       </div>
                       <Badge className={`border-none text-[10px] font-black uppercase tracking-widest px-3 py-1 ${
                         s.status === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-500 text-white'
                       }`}>
                         {s.status}
                       </Badge>
                     </div>
                     <h3 className="font-black text-xl text-slate-900 dark:text-white mb-2 line-clamp-1">{s.title || "Consultation Session"}</h3>
                     <p className="text-sm text-slate-500 mb-8 font-medium">with {s.mentor_name}</p>
                     
                     <div className="flex flex-col gap-4 mb-8">
                       <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {s.time_slot}</div>
                         <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {s.date}</div>
                       </div>

                       {s.status === 'confirmed' && s.meeting_link && (
                         <a href={s.meeting_link} target="_blank" rel="noopener noreferrer">
                           <Button className="w-full h-12 rounded-xl bg-primary text-white font-black text-xs gap-2">
                             <Video className="h-4 w-4" /> Join Google Meet
                           </Button>
                         </a>
                       )}

                       {s.status === 'completed' && (
                         <Button 
                           variant="outline" 
                           onClick={() => setSelectedSession(s)}
                           className="w-full h-12 rounded-xl border-amber-200 text-amber-600 font-black text-xs gap-2 hover:bg-amber-50"
                         >
                           <StarIcon className="h-4 w-4" /> Review Session
                         </Button>
                       )}
                     </div>
                   </Card>
                 ))}
                 
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
             )}
           </section>

           {/* Top Mentors */}
           <section>
             <div className="flex justify-between items-center mb-8 px-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-sm">
                    <Users className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight">Expert Mentors</h2>
                </div>
               <Link href="/mentorship" className="text-primary text-sm font-bold hover:underline">View All</Link>
             </div>
             <div className="grid md:grid-cols-2 gap-6">
               {mentors.length === 0 ? (
                 [1, 2].map(i => (
                   <Card key={i} className="border-none rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 animate-pulse flex items-center gap-6">
                      <div className="h-20 w-20 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800" />
                      <div className="flex-grow space-y-3">
                        <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded-full" />
                        <div className="h-2 w-48 bg-slate-100 dark:bg-slate-800 rounded-full" />
                      </div>
                   </Card>
                 ))
               ) : (
                 mentors.map((m) => (
                   <Card key={m.id} className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 p-8 flex items-center gap-6 group hover:shadow-2xl hover:-translate-y-1 transition-all border border-slate-50 dark:border-slate-800">
                     <div className="h-24 w-24 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 shrink-0 overflow-hidden relative border-2 border-primary/10">
                        {m.image ? (
                           <img src={m.image} alt={m.name} className="h-full w-full object-cover" />
                        ) : (
                           <User className="h-full w-full p-6 text-slate-300" />
                        )}
                     </div>
                     <div className="flex-grow">
                       <h3 className="font-black text-xl group-hover:text-primary transition-colors">{m.name}</h3>
                       <p className="text-sm text-slate-500 font-medium mb-4 line-clamp-1">{m.headline || m.college || "Senior Admissions Expert"}</p>
                       <div className="flex items-center gap-6">
                         <div className="flex items-center gap-1.5 text-[10px] font-black text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-xl">
                           <Sparkles className="h-3.5 w-3.5" /> {m.rating || "5.0"}
                         </div>
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">₹{m.pricing || "999"} / session</div>
                       </div>
                     </div>
                     <ChevronRight className="h-6 w-6 text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                   </Card>
                 ))
               )}
             </div>
           </section>

          {/* Trends */}
          <div className="grid md:grid-cols-2 gap-8">
             <Card className="border-none rounded-[3rem] shadow-sm bg-white dark:bg-slate-900 p-10 shadow-indigo-500/5">
               <div className="flex items-center gap-4 mb-8">
                 <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-sm">
                   <TrendingUp className="h-7 w-7" />
                 </div>
                 <h2 className="text-2xl font-black tracking-tight">Admission Trends</h2>
               </div>
               <div className="space-y-8">
                 {[
                   { label: "IIT Bombay CSE", percent: 85, color: "bg-emerald-500" },
                   { label: "NIT Trichy ECE", percent: 62, color: "bg-blue-500" },
                   { label: "COEP Pune Mech", percent: 45, color: "bg-orange-500" },
                 ].map((item, i) => (
                   <div key={i} className="space-y-3">
                     <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                       <span className="text-slate-400">{item.label}</span>
                       <span className="text-slate-900 dark:text-white">{item.percent}% Interest</span>
                     </div>
                     <div className="h-3 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.percent}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className={`h-full ${item.color} rounded-full shadow-lg shadow-current/20`} />
                     </div>
                   </div>
                 ))}
               </div>
             </Card>

             <Card className="border-none rounded-[3rem] shadow-sm bg-white dark:bg-slate-900 p-10 shadow-red-500/5">
               <div className="flex items-center gap-4 mb-8">
                 <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-sm">
                   <Clock className="h-7 w-7" />
                 </div>
                 <h2 className="text-2xl font-black tracking-tight">Deadlines</h2>
               </div>
               <div className="space-y-5">
                 {[
                   { title: "JoSAA Registration", date: "June 15, 2026", status: "Urgent", color: "bg-red-500" },
                   { title: "MHT-CET Form", date: "June 22, 2026", status: "Closing", color: "bg-orange-500" },
                   { title: "COMEDK Choice Filling", date: "July 05, 2026", status: "Upcoming", color: "bg-blue-500" },
                 ].map((deadline, i) => (
                   <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all group cursor-default">
                     <div>
                       <p className="text-base font-black group-hover:text-primary transition-colors">{deadline.title}</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{deadline.date}</p>
                     </div>
                     <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-current/10 ${deadline.color}`}>
                       {deadline.status}
                     </div>
                   </div>
                 ))}
               </div>
             </Card>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="bg-primary text-white border-none rounded-[3.5rem] p-12 relative overflow-hidden shadow-2xl shadow-primary/30 group">
             <div className="absolute top-0 right-0 p-12 opacity-20 rotate-12 group-hover:scale-125 transition-transform duration-1000">
                <Bot className="h-48 w-48" />
             </div>
             <div className="relative z-10">
               <div className="h-16 w-16 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-10 shadow-xl border border-white/10">
                  <Sparkles className="h-9 w-9 text-white" />
               </div>
               <h2 className="text-4xl font-black mb-6 tracking-tighter">AI Counselor</h2>
               <p className="text-white/80 text-lg mb-10 leading-relaxed font-medium">
                 Get an instant, personalized college list based on your rank. Our AI analyzes 10+ years of data.
               </p>
               <Link href="/chat">
                  <Button className="w-full h-16 bg-white text-primary hover:bg-slate-50 rounded-2xl font-black text-xl shadow-2xl transition-all hover:scale-[1.02] active:scale-95">
                     Ask AI Assistant 
                     <MessageSquare className="ml-3 h-6 w-6" />
                  </Button>
               </Link>
             </div>
          </Card>

          <Card className="border-none rounded-[3rem] shadow-sm bg-white dark:bg-slate-900 p-10 space-y-8 border border-slate-50 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black tracking-tight">Your Profile</h3>
              <Badge className="bg-primary/10 text-primary border-none">Verified</Badge>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 dark:bg-slate-800 transition-colors hover:bg-slate-100">
                <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-primary shadow-sm">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</p>
                  <p className="text-base font-black">{profile.city || "Not Set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 dark:bg-slate-800 transition-colors hover:bg-slate-100">
                <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-primary shadow-sm">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">State Focus</p>
                  <p className="text-base font-black truncate max-w-[180px]">{profile?.interested_states?.join(", ") || "All India"}</p>
                </div>
              </div>
            </div>
            <Link href="/onboarding">
              <Button variant="ghost" className="w-full h-14 rounded-2xl text-primary font-black text-base hover:bg-primary/5 transition-all">
                Edit Professional Profile
              </Button>
            </Link>
          </Card>

          <section className="space-y-4 px-2">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-4">Ecosystem Access</h3>
             <div className="grid grid-cols-1 gap-3">
               {[
                 { icon: BookOpen, label: "Resource Library", path: "/resources", color: "text-blue-500" },
                 { icon: CreditCard, label: "Subscription Plans", path: "/pricing", color: "text-emerald-500" },
                 { icon: Settings, label: "Account Settings", path: "/settings", color: "text-slate-500" },
                 { icon: MessageSquare, label: "Help & Support", path: "/support", color: "text-purple-500" },
               ].map((item, i) => (
                 <Link key={i} href={item.path}>
                   <Button variant="ghost" className="w-full justify-between rounded-2xl h-16 font-bold hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 group transition-all px-6">
                     <div className="flex items-center gap-5">
                       <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:text-primary transition-colors">
                         <item.icon className={`h-5 w-5 ${item.color}`} />
                       </div>
                       <span className="text-base font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                     </div>
                     <ChevronRight className="h-5 w-5 text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
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
