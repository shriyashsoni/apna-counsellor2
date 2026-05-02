"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { MentorGuard } from "@/components/mentor-guard"
import { motion } from "framer-motion"
import { 
  Users, 
  Calendar, 
  IndianRupee, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Settings,
  User,
  LayoutDashboard
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function MentorPortal() {
  const user = useQuery(api.users.currentUser, {})
  const sessions = useQuery(api.sessions.listByMentor, { mentorId: user?._id || "" })
  
  const stats = [
    { label: "Total Sessions", value: user?.sessionsCount || 0, icon: Calendar, color: "blue" },
    { label: "Active Bookings", value: sessions?.filter(s => s.status === "booked").length || 0, icon: Users, color: "purple" },
    { label: "Total Earnings", value: `₹${user?.earnings || 0}`, icon: IndianRupee, color: "emerald" },
    { label: "Rating", value: user?.rating || "5.0", icon: TrendingUp, color: "orange" },
  ]

  return (
    <MentorGuard>
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase tracking-widest px-3">Verified Mentor</Badge>
                <span className="text-slate-400 font-bold text-xs">•</span>
                <span className="text-slate-400 font-bold text-xs">Joined {new Date(user?._creationTime || Date.now()).toLocaleDateString()}</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-4">
                Welcome back, {user?.name?.split(' ')[0]} 👋
              </h1>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold gap-2">
                <Settings className="h-4 w-4" /> Edit Profile
              </Button>
              <Button className="rounded-2xl h-12 px-8 font-black shadow-xl shadow-primary/20 gap-2">
                <Calendar className="h-4 w-4" /> Set Availability
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-none rounded-[2rem] shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center bg-${stat.color}-500/10 text-${stat.color}-500`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                        <p className="text-2xl font-black">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Bookings */}
            <Card className="lg:col-span-2 border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900">
              <CardHeader className="p-8 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-black">Upcoming Sessions</CardTitle>
                <Button variant="ghost" className="text-primary font-bold text-xs">View Calendar</Button>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                {!sessions || sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-bold">No sessions booked yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session: any) => (
                      <div key={session._id} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between group hover:bg-primary/5 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                            <User className="h-6 w-6 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{session.studentName}</h4>
                            <p className="text-xs text-slate-400 font-medium">{session.date} • {session.timeSlot}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold uppercase text-[9px] px-3">{session.status}</Badge>
                          <Button size="sm" className="rounded-xl font-bold h-9 bg-white text-primary hover:bg-primary hover:text-white border border-primary/20">Launch Session</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Quick View */}
            <div className="space-y-6">
              <Card className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-primary to-purple-600" />
                <CardContent className="p-8 pt-0 -mt-12 text-center">
                  <div className="relative inline-block mb-4">
                    <img src={user?.image || "https://github.com/shadcn.png"} className="h-24 w-24 rounded-[2rem] border-4 border-white dark:border-slate-900 shadow-xl" />
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-black mb-1">{user?.name}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">{user?.headline || "Expert Counselor"}</p>
                  
                  <div className="grid grid-cols-2 gap-3 py-6 border-y border-slate-100 dark:border-slate-800 mb-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Session Price</p>
                      <p className="text-lg font-black text-primary">₹{user?.pricing || 499}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Earnings</p>
                      <p className="text-lg font-black">₹{user?.earnings || 0}</p>
                    </div>
                  </div>

                  <Button className="w-full rounded-2xl h-14 font-black shadow-lg shadow-primary/20">Share Profile Link</Button>
                </CardContent>
              </Card>

              <Card className="border-none rounded-[2.5rem] shadow-sm bg-slate-900 text-white p-8">
                <h4 className="text-lg font-black mb-2 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" /> 
                  Grow your influence
                </h4>
                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
                  Complete 5 more sessions this week to reach **Top Mentor** status and increase your visibility by 40%.
                </p>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-3/5" />
                </div>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </MentorGuard>
  )
}
