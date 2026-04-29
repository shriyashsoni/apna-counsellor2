"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
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
  CheckCircle2
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { redirect } from "next/navigation"

export default function DashboardPage() {
  const profile = useQuery(api.profiles.getProfile)
  const user = useQuery(api.users.currentUser)

  if (user === undefined || profile === undefined) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
      <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 font-bold animate-pulse">Initializing Your Dashboard...</p>
    </div>
  )
  
  if (!user) redirect("/login")

  // Admin Dashboard View
  if (user.role === "admin") {
    return <AdminDashboard user={user} />
  }

  // Student Dashboard View
  if (profile === null) redirect("/onboarding")
  return <StudentDashboard profile={profile} user={user} />
}

function AdminDashboard({ user }: { user: any }) {
  return (
    <div className="space-y-8">
      {/* Admin Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Students", value: "1,284", icon: User, color: "text-blue-500", trend: "+12%" },
          { label: "Revenue (MTD)", value: "₹4.2L", icon: CreditCard, color: "text-emerald-500", trend: "+8%" },
          { label: "Pending Tasks", value: "24", icon: ListChecks, color: "text-orange-500", trend: "-2" },
          { label: "Active Mentors", value: "48", icon: GraduationCap, color: "text-purple-500", trend: "+5" },
        ].map((stat, i) => (
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
  const getRecommendedPortals = () => {
    const portals = []
    if (profile.examType === "JEE") {
      portals.push({ id: "JoSAA", name: "JoSAA 2026", desc: "IIT & NIT Admission Portal", icon: "J", color: "orange" })
      portals.push({ id: "CSAB", name: "CSAB 2026", desc: "NIT+ System Spot Rounds", icon: "C", color: "blue" })
    }
    if (profile.examType === "NEET") {
      portals.push({ id: "MCC", name: "MCC Medical", desc: "All India Quota Medical Admissions", icon: "M", color: "red" })
    }
    if (profile?.interestedStates?.includes("Maharashtra")) {
      portals.push({ id: "MHT-CET", name: "MHT-CET 2026", desc: "Maharashtra Engineering Portal", icon: "M", color: "purple" })
    }
    if (portals.length === 0) {
      portals.push({ id: "JEE-Main", name: "JEE Main Portal", desc: "Exam registration & results", icon: "J", color: "blue" })
    }
    return portals.slice(0, 4)
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Goal", value: profile.examType, icon: Target, color: "text-primary" },
          { label: "Category", value: profile.category, icon: ShieldCheck, color: "text-emerald-500" },
          { label: "Rank", value: profile.rank ? `#${profile.rank}` : "Pending", icon: TrendingUp, color: "text-orange-500" },
          { label: "Year", value: profile.targetYear, icon: Calendar, color: "text-blue-500" },
        ].map((stat, i) => (
          <Card key={i} className="border-none rounded-[2rem] shadow-sm bg-white dark:bg-slate-900 overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className={`h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-black text-slate-400 tracking-widest mb-1">{stat.label}</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          
          {/* Recommendations */}
          <section>
            <div className="flex justify-between items-center mb-6 px-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Recommended Portals</h2>
              </div>
              <Link href="/counselling" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                Browse All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
               {getRecommendedPortals().map((portal, i) => (
                 <Card key={i} className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                   <CardContent className="p-8">
                     <div className="flex justify-between items-start mb-6">
                       <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg
                         ${portal.color === 'orange' ? 'bg-orange-50 text-orange-500' : 
                           portal.color === 'blue' ? 'bg-blue-50 text-blue-500' : 
                           portal.color === 'red' ? 'bg-red-50 text-red-500' : 
                           'bg-purple-50 text-purple-500'}`}
                       >
                         {portal.icon}
                       </div>
                     </div>
                     <h3 className="text-xl font-black mb-2">{portal.name}</h3>
                     <p className="text-slate-500 text-sm mb-6 font-medium">{portal.desc}</p>
                     <Link href={`/counselling/${portal.id}`}>
                       <Button className="w-full h-12 rounded-xl bg-slate-50 hover:bg-primary hover:text-white text-slate-900 dark:bg-slate-800 border-none font-bold">
                         Access Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                       </Button>
                     </Link>
                   </CardContent>
                 </Card>
               ))}
            </div>
          </section>

          {/* Upcoming Batches */}
          <section>
            <div className="flex justify-between items-center mb-6 px-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Upcoming Batches</h2>
              </div>
              <Link href="/batches" className="text-primary text-sm font-bold hover:underline">View All</Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "JoSAA Masterclass 2026", mentor: "IIT Bombay Alumni", students: 150, price: 1999 },
                { title: "NEET Counselling Guide", mentor: "AIIMS Expert", students: 85, price: 1499 },
              ].map((batch, i) => (
                <Card key={i} className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 group hover:shadow-xl transition-all">
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-[10px] font-black uppercase tracking-widest">Active Batch</div>
                      <div className="text-xs font-bold text-slate-400">Starts July 1st</div>
                    </div>
                    <h3 className="text-xl font-black mb-1 group-hover:text-primary transition-colors">{batch.title}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-6">Led by {batch.mentor}</p>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         <div className="flex -space-x-2">
                           {[1,2,3].map(j => <div key={j} className="h-6 w-6 rounded-full bg-slate-200 border-2 border-white dark:border-slate-900" />)}
                         </div>
                         <span className="text-[10px] font-bold text-slate-400">{batch.students}+ Students</span>
                       </div>
                       <div className="text-lg font-black text-slate-900 dark:text-white">₹{batch.price}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

           {/* Upcoming Sessions */}
           <section>
             <div className="flex justify-between items-center mb-6 px-2">
               <h2 className="text-2xl font-black tracking-tight">Upcoming Sessions</h2>
               <Link href="/sessions" className="text-primary text-sm font-bold hover:underline">View All</Link>
             </div>
             <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
               {[1, 2].map((s) => (
                 <Card key={s} className="min-w-[300px] border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-slate-800">
                   <div className="flex justify-between items-start mb-4">
                     <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                       <Calendar className="h-5 w-5" />
                     </div>
                     <div className="px-2 py-1 rounded-lg bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest">Confirmed</div>
                   </div>
                   <h3 className="font-black text-slate-900 dark:text-white mb-1">JoSAA Strategy Session</h3>
                   <p className="text-xs text-slate-500 mb-4 font-medium">with Dr. Aditya Sharma</p>
                   <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> 10:00 AM</div>
                     <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> June 10</div>
                   </div>
                 </Card>
               ))}
             </div>
           </section>

           {/* Top Mentors */}
           <section>
             <div className="flex justify-between items-center mb-6 px-2">
               <h2 className="text-2xl font-black tracking-tight">Top Expert Mentors</h2>
               <Link href="/mentorship" className="text-primary text-sm font-bold hover:underline">Explore All</Link>
             </div>
             <div className="grid md:grid-cols-2 gap-6">
               {[1, 2].map((m) => (
                 <Card key={m} className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 p-6 flex items-center gap-6 group hover:shadow-xl transition-all">
                   <div className="h-20 w-20 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden relative">
                      <User className="h-full w-full p-4 text-slate-300" />
                   </div>
                   <div className="flex-grow">
                     <h3 className="font-black text-lg group-hover:text-primary transition-colors">Dr. Aditya Sharma</h3>
                     <p className="text-xs text-slate-500 font-medium mb-3">IIT & NIT Admissions Specialist</p>
                     <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1 text-[10px] font-black text-orange-500 bg-orange-500/10 px-2 py-1 rounded-lg">
                         <Sparkles className="h-3 w-3" /> 4.9
                       </div>
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">₹999 / session</div>
                     </div>
                   </div>
                   <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                 </Card>
               ))}
             </div>
           </section>

          {/* Trends */}
          <div className="grid md:grid-cols-2 gap-8">
             <Card className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 p-8 shadow-indigo-500/5">
               <div className="flex items-center gap-3 mb-6">
                 <div className="h-10 w-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                   <TrendingUp className="h-6 w-6" />
                 </div>
                 <h2 className="text-xl font-black tracking-tight">Admission Trends</h2>
               </div>
               <div className="space-y-6">
                 {[
                   { label: "IIT Bombay CSE", percent: 85, color: "bg-emerald-500" },
                   { label: "NIT Trichy ECE", percent: 62, color: "bg-blue-500" },
                   { label: "COEP Pune Mech", percent: 45, color: "bg-orange-500" },
                 ].map((item, i) => (
                   <div key={i} className="space-y-2">
                     <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                       <span className="text-slate-500">{item.label}</span>
                       <span className="text-slate-900 dark:text-white">{item.percent}% Interest</span>
                     </div>
                     <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.percent}%` }} transition={{ duration: 1 }} className={`h-full ${item.color} rounded-full`} />
                     </div>
                   </div>
                 ))}
               </div>
             </Card>

             <Card className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 p-8 shadow-red-500/5">
               <div className="flex items-center gap-3 mb-6">
                 <div className="h-10 w-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                   <Clock className="h-6 w-6" />
                 </div>
                 <h2 className="text-xl font-black tracking-tight">Upcoming Deadlines</h2>
               </div>
               <div className="space-y-4">
                 {[
                   { title: "JoSAA Registration", date: "June 15, 2026", status: "Urgent" },
                   { title: "MHT-CET Form", date: "June 22, 2026", status: "Closing" },
                 ].map((deadline, i) => (
                   <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                     <div>
                       <p className="text-sm font-bold">{deadline.title}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{deadline.date}</p>
                     </div>
                     <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${deadline.status === 'Urgent' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>
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
          <Card className="bg-primary text-white border-none rounded-[3rem] p-10 relative overflow-hidden shadow-2xl shadow-primary/20 group">
             <div className="absolute top-0 right-0 p-10 opacity-20 rotate-12 group-hover:scale-110 transition-transform">
                <Sparkles className="h-40 w-40" />
             </div>
             <div className="relative z-10">
               <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-8">
                  <Bot className="h-8 w-8" />
               </div>
               <h2 className="text-3xl font-black mb-4">AI Counselor</h2>
               <p className="text-white/80 text-base mb-8 leading-relaxed font-medium">
                 Need a personalized college list based on your rank? Just ask me.
               </p>
               <Link href="/chat">
                  <Button className="w-full h-14 bg-white text-primary hover:bg-slate-50 rounded-2xl font-black text-lg shadow-xl">
                     Open Assistant <MessageSquare className="ml-2 h-6 w-6" />
                  </Button>
               </Link>
             </div>
          </Card>

          <Card className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 p-8 space-y-6">
            <h3 className="text-xl font-black">Profile Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Home City</p>
                  <p className="text-sm font-bold">{profile.city || "Not Set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-primary">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">States Interested</p>
                  <p className="text-sm font-bold">{profile?.interestedStates?.join(", ") || "All India"}</p>
                </div>
              </div>
            </div>
            <Link href="/onboarding">
              <Button variant="ghost" className="w-full rounded-xl text-primary font-bold hover:bg-primary/5">Edit Profile</Button>
            </Link>
          </Card>

          <section className="space-y-4 px-2">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Quick Access</h3>
             <div className="grid grid-cols-1 gap-2">
               {[
                 { icon: BookOpen, label: "Resource Library", path: "/resources" },
                 { icon: CreditCard, label: "Subscription Plan", path: "/pricing" },
                 { icon: Settings, label: "Account Settings", path: "/settings" },
               ].map((item, i) => (
                 <Link key={i} href={item.path}>
                   <Button variant="ghost" className="w-full justify-between rounded-2xl h-14 font-bold hover:bg-white dark:hover:bg-slate-900 hover:shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-800 group transition-all">
                     <div className="flex items-center gap-4">
                       <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:text-primary transition-colors">
                         <item.icon className="h-5 w-5" />
                       </div>
                       <span>{item.label}</span>
                     </div>
                     <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
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
