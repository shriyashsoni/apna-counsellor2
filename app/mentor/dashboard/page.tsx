"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Calendar, Clock, Users, DollarSign, Star, Video, Settings,
  Bell, LayoutDashboard, ShieldCheck, MessageCircle, LayoutGrid,
  ShieldAlert, CheckCircle2, ArrowRight, Loader2, RefreshCw
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function MentorDashboard() {
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [unscheduledSessions, setUnscheduledSessions] = useState<any[]>([])
  const [earnings, setEarnings] = useState(0)
  const [paymentCount, setPaymentCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      const { data: authData } = await supabase.auth.getUser()
      const user = authData?.user
      if (!user) { router.push("/login"); return }

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      if (!prof || (prof.role !== 'mentor' && prof.role !== 'admin' && !prof.onboarding_complete)) {
        router.push("/dashboard"); return
      }
      setProfile(prof)

      // Fetch sessions with student info
      const { data: allSessions } = await supabase
        .from('sessions')
        .select('*')
        .eq('mentor_id', user.id)
        .order('created_at', { ascending: false })

      const all = allSessions || []
      setSessions(all.filter(s => s.status === 'confirmed' || s.status === 'completed'))
      setUnscheduledSessions(all.filter(s => s.status === 'paid_unscheduled'))

      // Earnings
      const { data: payments } = await supabase.from('payments').select('amount').eq('mentor_id', user.id).eq('status', 'captured')
      setEarnings(payments?.reduce((acc, p) => acc + (Number(p.amount) * 0.7 || 0), 0) || 0)
      setPaymentCount(payments?.length || 0)

      setIsLoading(false)
    }
    loadData()
  }, [router])

  const markDone = async (sessionId: string) => {
    setIsUpdating(sessionId)
    await supabase.from('sessions').update({ status: 'completed' }).eq('id', sessionId)
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'completed' } : s))
    setIsUpdating(null)
  }

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-14 w-14 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-slate-400 font-bold text-sm animate-pulse">Loading your dashboard...</p>
      </div>
    </div>
  )

  if (!profile) return null

  const isPending = profile.role !== 'mentor' && profile.role !== 'admin'

  const navItems = [
    { href: "/mentor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/mentor/availability", label: "My Availability", icon: Calendar },
    { href: "/mentor/services", label: "My Services", icon: LayoutGrid },
    { href: "/mentor/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-200 bg-white hidden lg:flex flex-col p-6 fixed h-full z-10 shadow-sm">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-10 w-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-200">
            <Star className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-black text-lg tracking-tight text-slate-900">Expert <span className="text-purple-600">Portal</span></h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Mentor Workspace</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost"
                className={`w-full justify-start gap-3 px-4 py-5 rounded-xl font-bold text-sm transition-all ${
                  item.href === "/mentor/dashboard"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-100 hover:bg-purple-700"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-purple-100 flex items-center justify-center font-black text-purple-600 text-sm">
              {profile?.name?.[0]?.toUpperCase() || 'M'}
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 line-clamp-1">{profile?.name || 'Mentor'}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {isPending ? 'Pending Approval' : 'Verified Expert'}
              </p>
            </div>
          </div>
          <Link href="/" className="mt-3 block">
            <Button variant="outline" className="w-full h-8 rounded-lg font-bold text-xs border-slate-200 text-slate-500 hover:text-slate-900">
              View Public Site ↗
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-5 md:p-8 min-h-screen">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
              Welcome back, {profile?.name?.split(' ')[0] || 'Expert'}!
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {isPending ? 'Pending Verification' : 'Session Sync Active'}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-slate-200 relative">
              <Bell className="h-4 w-4 text-slate-400" />
              <div className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-red-500 rounded-full" />
            </Button>
            <Link href="/mentor/settings">
              <Button variant="outline" className="rounded-xl h-10 px-5 font-bold text-xs border-slate-200">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
            </Link>
          </div>
        </header>

        {/* Pending Approval Banner */}
        {isPending && (
          <div className="mb-6 p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-amber-100 flex items-center justify-center text-amber-500 flex-shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm">Application Under Review</h3>
              <p className="text-slate-500 font-medium text-xs mt-0.5">Your profile is being verified. It won't be visible to students until approved by our team.</p>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Your Earnings (70%)", value: `₹${earnings.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Paid Bookings", value: paymentCount, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Approved Sessions", value: sessions.length, icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Portal Status", value: isPending ? "Pending" : "Active", icon: isPending ? ShieldAlert : ShieldCheck, color: isPending ? "text-amber-500" : "text-emerald-600", bg: isPending ? "bg-amber-50" : "bg-emerald-50" },
          ].map((s, i) => (
            <Card key={i} className="bg-white border-none rounded-2xl shadow-sm">
              <CardContent className="p-5">
                <div className={`h-10 w-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-3`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{s.label}</p>
                <p className="text-xl font-black text-slate-900">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Unscheduled (Awaiting your action) */}
            {unscheduledSessions.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900">Awaiting Scheduling</h2>
                  <Badge className="bg-purple-600 text-white border-none font-black">{unscheduledSessions.length}</Badge>
                </div>
                {unscheduledSessions.map(s => (
                  <Card key={s.id} className="bg-white border-l-4 border-l-purple-600 rounded-2xl shadow-sm p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                          <Clock className="h-5 w-5 animate-pulse" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest">Paid · Pending Schedule</p>
                          <h4 className="font-black text-slate-900">{s.student_name || 'Student'}</h4>
                          <p className="text-xs text-slate-400">{s.title}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-slate-400 border-slate-200 text-[9px]">Cal.com Pending</Badge>
                    </div>
                  </Card>
                ))}
              </section>
            )}

            {/* Confirmed Sessions */}
            <section className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-black text-slate-900">Confirmed Sessions</h2>
                <Link href="/mentor/availability" className="text-purple-600 font-black text-xs hover:underline">Update Slots →</Link>
              </div>

              {sessions.length === 0 ? (
                <Card className="bg-white border-none rounded-2xl shadow-sm p-12 text-center">
                  <Clock className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 font-bold text-sm">No confirmed sessions yet.</p>
                  <p className="text-slate-400 text-xs mt-1">Your slots are live — students will book soon!</p>
                </Card>
              ) : (
                sessions.map(s => (
                  <Card key={s.id} className="bg-white border-none rounded-2xl shadow-sm p-5 hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                          <Users className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest">Upcoming Session</p>
                            {s.status === 'completed' && (
                              <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black">Completed</Badge>
                            )}
                          </div>
                          <h4 className="font-black text-slate-900">
                            {(Array.isArray(s.student_profile) ? s.student_profile[0]?.name : s.student_profile?.name) || s.student_name || 'Student'}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {s.scheduled_at ? new Date(s.scheduled_at).toLocaleDateString() : (s.date || 'No Date')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {s.scheduled_at ? new Date(s.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (s.time_slot || 'No Time')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {s.meeting_link && (
                          <a href={s.meeting_link} target="_blank" rel="noopener noreferrer">
                            <Button className="h-9 rounded-xl bg-purple-600 text-white font-black text-xs px-4 hover:bg-purple-700 shadow-sm flex items-center gap-1.5">
                              <Video className="h-3.5 w-3.5" /> Join
                            </Button>
                          </a>
                        )}
                        {s.status !== 'completed' && (
                          <Button
                            variant="outline"
                            onClick={() => markDone(s.id)}
                            disabled={isUpdating === s.id}
                            className="h-9 rounded-xl border-emerald-200 text-emerald-600 font-black text-xs px-4 hover:bg-emerald-50"
                          >
                            {isUpdating === s.id ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : "Mark Done"}
                          </Button>
                        )}
                        <Button variant="ghost" className="h-9 w-9 rounded-xl bg-slate-50 text-slate-400 p-0">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </section>
          </div>

          {/* Sidebar Tips */}
          <aside className="space-y-4">
            <Card className="bg-slate-900 text-white rounded-2xl p-6 border-none shadow-xl">
              <h3 className="font-black text-lg mb-4">Mentor Tips</h3>
              <ul className="space-y-3">
                {[
                  "Join meetings 5 minutes early to test audio/video.",
                  "Keep JoSAA/MHT-CET cutoff PDFs ready for screen sharing.",
                  "Take notes after each session for follow-up.",
                  "Update your availability slots every Sunday.",
                ].map((tip, i) => (
                  <li key={i} className="flex gap-2.5 items-start">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-white/70 leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="bg-purple-600 text-white rounded-2xl p-6 border-none shadow-xl shadow-purple-200">
              <h3 className="font-black text-lg mb-2">Update Your Profile</h3>
              <p className="text-xs text-purple-100 font-medium mb-4 leading-relaxed">
                Keep your availability, pricing, and bio updated to attract more students.
              </p>
              <Link href="/mentor/settings">
                <Button className="w-full h-10 bg-white text-purple-700 font-black rounded-xl text-xs hover:bg-purple-50 flex items-center justify-center gap-2">
                  <Settings className="h-4 w-4" /> Edit Profile
                </Button>
              </Link>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  )
}
