import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { 
  Calendar, Clock, Users, DollarSign, Star, Video, 
  ChevronRight, ArrowLeft, Settings, Bell, LayoutDashboard,
  ShieldCheck, MessageCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

export default async function MentorDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'mentor' && profile?.role !== 'admin') {
    redirect("/dashboard")
  }

  // Fetch upcoming sessions for this mentor
  const { data: sessions } = await supabase
    .from('sessions')
    .select('*, profiles!sessions_student_id_fkey(name, email)')
    .eq('mentor_id', user.id)
    .eq('status', 'confirmed')
    .order('date', { ascending: true })
    .order('time_slot', { ascending: true })

  // Fetch payments for completed sessions only
  const { data: completedSessions } = await supabase
    .from('sessions')
    .select('id')
    .eq('mentor_id', user.id)
    .eq('status', 'completed')

  const completedSessionIds = completedSessions?.map(s => s.id) || []

  const { data: payments } = await supabase
    .from('payments')
    .select('amount')
    .eq('mentor_id', user.id)
    .eq('status', 'captured')
    .in('session_id', completedSessionIds)

  const totalEarnings = payments?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar (Simple version for Mentor) */}
      <aside className="w-80 border-r border-slate-200 bg-white hidden lg:flex flex-col p-8 fixed h-full z-10">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-12 w-12 rounded-2xl bg-purple-600 flex items-center justify-center shadow-xl shadow-purple-200">
            <Star className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-black text-xl tracking-tighter text-slate-900">Expert<br/><span className="text-purple-600">Portal</span></h2>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          <Link href="/mentor/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-4 px-5 py-6 rounded-2xl bg-purple-600 text-white shadow-xl shadow-purple-100 hover:bg-purple-700">
              <LayoutDashboard className="h-5 w-5" />
              <span className="font-bold">Dashboard</span>
            </Button>
          </Link>
          <Link href="/mentor/availability">
            <Button variant="ghost" className="w-full justify-start gap-4 px-5 py-6 rounded-2xl text-slate-500 hover:text-slate-900 hover:bg-slate-50">
              <Calendar className="h-5 w-5" />
              <span className="font-bold">My Availability</span>
            </Button>
          </Link>
        </nav>

        <div className="mt-auto p-6 rounded-3xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center font-black text-purple-600">
                {profile.name?.charAt(0)}
             </div>
             <div>
                <p className="text-xs font-black text-slate-900 line-clamp-1">{profile.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Expert</p>
             </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 lg:ml-80 p-6 md:p-12 min-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-2 text-slate-900">Welcome Back, {profile.name?.split(' ')[0]}!</h1>
            <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] uppercase px-3">Session Sync Active</Badge>
          </div>
          
          <div className="flex gap-4">
             <Button variant="outline" className="rounded-2xl h-14 px-8 font-black border-slate-200">
                <Settings className="mr-2 h-5 w-5 text-slate-400" /> Account
             </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "My Earnings", value: `₹${totalEarnings.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Booked Calls", value: sessions?.length || 0, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "My Rating", value: profile.rating || "4.9", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
            { 
              label: "Calendar Sync", 
              value: profile.google_refresh_token ? "Linked" : "Not Linked", 
              icon: Calendar, 
              color: profile.google_refresh_token ? "text-emerald-600" : "text-slate-400", 
              bg: profile.google_refresh_token ? "bg-emerald-50" : "bg-slate-100",
              action: !profile.google_refresh_token && (
                <Link href="/api/auth/google/link">
                  <Button variant="link" className="p-0 h-auto text-[10px] font-black uppercase text-purple-600">Link Now</Button>
                </Link>
              )
            },
          ].map((stat, i) => (
            <Card key={i} className="bg-white border-none rounded-[2.5rem] shadow-sm relative overflow-hidden">
              <CardContent className="p-8">
                <div className={`p-4 rounded-2xl w-fit mb-6 ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                  </div>
                  {stat.action}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <section className="lg:col-span-8 space-y-6">
              <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-black">Upcoming Sessions</h2>
                 <Link href="/mentor/availability" className="text-sm font-black text-purple-600">Update Slots</Link>
              </div>
              
              <div className="space-y-4">
                 {sessions?.length === 0 ? (
                    <Card className="p-16 text-center rounded-[3rem] bg-white border border-slate-100">
                       <Clock className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                       <p className="text-slate-400 font-bold">No confirmed sessions yet. Your slots are live!</p>
                    </Card>
                 ) : (
                    sessions?.map((s: any) => (
                       <Card key={s.id} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                             <div className="flex items-center gap-6">
                                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                                   <Users className="h-7 w-7" />
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">Upcoming Session</p>
                                   <h4 className="text-xl font-black">{s.profiles?.name || 'Student'}</h4>
                                   <div className="flex items-center gap-4 mt-1 text-sm font-bold text-slate-400">
                                      <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(s.scheduled_at).toLocaleDateString()}</div>
                                      <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {new Date(s.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                   </div>
                                </div>
                             </div>
                             <div className="flex gap-3 w-full md:w-auto">
                                 <a href={s.meeting_link || '#'} target="_blank" rel="noopener noreferrer" className={!s.meeting_link ? 'pointer-events-none opacity-50' : ''}>
                                    <Button className="flex-1 md:flex-none rounded-xl h-12 px-6 font-black bg-purple-600 text-white shadow-lg shadow-purple-100">
                                       <Video className="mr-2 h-4 w-4" /> Join Call
                                    </Button>
                                 </a>
                                 <form action={async () => {
                                    'use server'
                                    const sb = createClient()
                                    await sb.from('sessions').update({ status: 'completed' }).eq('id', s.id)
                                    revalidatePath('/mentor/dashboard')
                                 }}>
                                    <Button type="submit" variant="outline" className="rounded-xl h-12 px-6 font-black border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                                       Mark Done
                                    </Button>
                                 </form>
                                 <Button variant="ghost" className="rounded-xl h-12 w-12 bg-slate-50 text-slate-400">
                                    <MessageCircle className="h-5 w-5" />
                                 </Button>
                             </div>
                          </div>
                       </Card>
                    ))
                 )}
              </div>
           </section>

           <aside className="lg:col-span-4 space-y-6">
              <Card className="rounded-[2.5rem] border-none bg-slate-950 text-white p-10 shadow-xl overflow-hidden relative">
                 <div className="relative z-10">
                    <h3 className="text-xl font-black mb-4">Mentor Quick Tips</h3>
                    <ul className="space-y-4">
                       <li className="flex gap-3 items-start">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                          <p className="text-sm font-bold text-white/70 leading-relaxed">Join meeting 5 mins before the scheduled time.</p>
                       </li>
                       <li className="flex gap-3 items-start">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                          <p className="text-sm font-bold text-white/70 leading-relaxed">Keep JoSAA/MHT-CET cutoff PDFs ready for screen sharing.</p>
                       </li>
                    </ul>
                 </div>
                 <Sparkles className="absolute -bottom-10 -right-10 h-40 w-40 text-white/5 rotate-12" />
              </Card>
           </aside>
        </div>
      </main>
    </div>
  )
}
