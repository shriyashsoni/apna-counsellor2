"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { 
  Users, UserCheck, BarChart3, Activity, Database, DollarSign, ShieldCheck,
  Search, Check, X, Phone, Loader2, AlertCircle, Plus, BookOpen, FileText,
  Settings, HardDrive, MessageSquare, ChevronRight, TrendingUp, Cpu, Layers,
  LayoutDashboard, CheckCircle2, Rocket, Menu, School, Globe, MoreVertical,
  ExternalLink, ArrowLeft, Image as ImageIcon, Video, Trash2, Save, Eye,
  Type, List, Calendar, Tag, Shield, PieChart, Briefcase, GraduationCap, Bell,
  FilePlus, ClipboardList, Monitor, Star, Clock, Zap, MapPin, Mail, CreditCard
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { approveMentorAction, suspendMentorAction, deleteMentorAction, toggleMentorVisibilityAction, createBroadcastNotificationAction } from "@/lib/actions/admin"
import { sendBroadCastEmail } from "@/lib/actions/emails"

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeSubTab, setActiveSubTab] = useState("overview")

  // Data States
  const [users, setUsers] = useState<any[]>([])
  const [mentors, setMentors] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])

  const [stats, setStats] = useState<any>({
    users: 0, mentors: 0, revenue: 0, sessions: 0, pendingMentors: 0
  })

  const supabase = createClient()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const { data: userData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      const { data: mentorData } = await supabase.from('profiles').select('*, is_visible').in('role', ['mentor', 'suspended_mentor'])
      const { data: paymentData } = await supabase.from('payments').select('amount')
      const { data: appData } = await supabase.from('mentor_applications').select('*, profiles(email)').eq('status', 'pending')
      const { data: sessionData } = await supabase.from('sessions').select('*, profiles:student_id(name, email)').order('created_at', { ascending: false })
      
      const { data: courseData } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
      const { data: enrollData } = await supabase.from('course_enrollments').select('*, courses(title), profiles:student_id(name, email)').order('created_at', { ascending: false })
      const { data: logData } = await supabase.from('course_audit_logs').select('*').order('created_at', { ascending: false })
      
      const totalRevenue = paymentData?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0

      setUsers(userData || [])
      setMentors(mentorData || [])
      setApplications(appData || [])
      setBookings(sessionData || [])
      
      setCourses(courseData || [])
      setEnrollments(enrollData || [])
      setAuditLogs(logData || [])
      
      setStats({ 
        users: userData?.length || 0, 
        mentors: mentorData?.length || 0, 
        revenue: totalRevenue,
        sessions: sessionData?.length || 0,
        pendingMentors: appData?.length || 0
      })
    } catch (error: any) {
      console.error("Admin Sync Error:", error)
      toast.error(`Platform Sync Failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const approveMentorWithEmail = async (appId: string, userId: string, email: string, name: string) => {
    setIsSubmitting(true)
    try {
      const result = await approveMentorAction(appId, userId, email, name)
      if (result.success) {
        toast.success(`Mentor approved and notification sent to ${email}`)
        await fetchData()
      } else {
        throw new Error(result.error)
      }
    } catch (e: any) {
      toast.error(`Failed to approve: ${e.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* Dynamic Sub-Tabs */}
      <Tabs defaultValue="overview" className="w-full space-y-8">
        <TabsList className="bg-[#0f0f0f] p-1 border border-white/5 rounded-xl h-14 max-w-lg w-full flex">
          <TabsTrigger value="overview" className="rounded-lg font-black text-xs flex-1 text-slate-400 data-[state=active]:bg-[#00FF88] data-[state=active]:text-black transition-all">Overview</TabsTrigger>
          <TabsTrigger value="applications" className="rounded-lg font-black text-xs flex-1 text-slate-400 data-[state=active]:bg-[#00FF88] data-[state=active]:text-black transition-all">Approvals ({stats.pendingMentors})</TabsTrigger>
          <TabsTrigger value="audits" className="rounded-lg font-black text-xs flex-1 text-slate-400 data-[state=active]:bg-[#00FF88] data-[state=active]:text-black transition-all">Audit Logs</TabsTrigger>
        </TabsList>

        {/* OVERVIEW ANALYTICS */}
        <TabsContent value="overview" className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Students Registered', val: stats.users, detail: 'Primary user logins', icon: Users, color: 'text-blue-500' },
              { label: 'Active Courses', val: courses.length, detail: 'Launched admission guides', icon: Rocket, color: 'text-purple-500' },
              { label: 'Course Enrollments', val: enrollments.length, detail: 'Staged subscriptions', icon: BookOpen, color: 'text-[#00FF88]' },
              { label: 'Total Sessions', val: stats.sessions, detail: 'Expert consultations booked', icon: Phone, color: 'text-amber-500' },
            ].map((s, i) => (
              <Card key={i} className="bg-[#0f0f0f] border border-white/5 p-6 rounded-2xl relative overflow-hidden group shadow-lg">
                <s.icon className={`h-12 w-12 ${s.color} opacity-5 absolute -top-1 -right-1`} />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-3xl font-black text-white">{s.val}</p>
                <p className="text-[9px] font-semibold text-slate-500 mt-2">{s.detail}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Recent Staged Enrollments list */}
            <Card className="lg:col-span-8 bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h3 className="text-md font-black text-white mb-6 flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#00FF88]" /> Recent Student Signups & enrollments
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/5 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Details</th>
                      <th className="px-4 py-3">Enrolled On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {enrollments.slice(0, 5).map(e => (
                      <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-4">
                          <p className="font-bold text-white">{e.profiles?.name || 'Anonymous'}</p>
                          <p className="text-[10px] text-slate-500">{e.profiles?.email}</p>
                        </td>
                        <td className="px-4 py-4 font-bold text-slate-300">
                          {e.courses?.title || 'Unknown Program'}
                        </td>
                        <td className="px-4 py-4 text-slate-500">
                          {new Date(e.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {enrollments.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-slate-500 italic font-bold">No recent enrollments tracked.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Quick action grid */}
            <Card className="lg:col-span-4 bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-md font-black text-white mb-4">Operations Shortcuts</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-6">Deploy blogs, dispatch mass notifications via Resend/Novu channels, and check ranks.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-xl text-xs font-bold">
                    <span className="text-slate-300">Active Mentors</span>
                    <Badge className="bg-white/10 text-white font-black">{stats.mentors}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-xl text-xs font-bold">
                    <span className="text-slate-300">Pending Applications</span>
                    <Badge className="bg-[#00FF88]/10 text-[#00FF88] font-black">{stats.pendingMentors}</Badge>
                  </div>
                </div>
              </div>
              <Button onClick={fetchData} className="w-full h-11 bg-white text-black font-black hover:bg-slate-100 rounded-xl mt-6">
                Force Data Sync
              </Button>
            </Card>
          </div>
        </TabsContent>

        {/* PENDING OPERATIONS (MENTOR APPROVALS) */}
        <TabsContent value="applications" className="space-y-6">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-[#00FF88]" /> Process Mentor Onboarding Applications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.map(app => (
              <Card key={app.id} className="bg-[#0f0f0f] border border-white/5 p-6 rounded-2xl shadow-lg relative group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-black text-white text-lg">{app.name}</h4>
                    <p className="text-xs text-slate-500 font-semibold uppercase mt-0.5">{app.college} · {app.branch}</p>
                  </div>
                  <Badge className="bg-[#00FF88]/10 text-[#00FF88] font-black text-[9px] border-none">PENDING</Badge>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 mb-6 text-xs text-slate-400 italic">
                  "{app.bio || 'No bio introduction provided'}"
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => approveMentorWithEmail(app.id, app.user_id, app.profiles?.email, app.name)}
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl h-11 bg-[#00FF88] text-black font-black text-xs hover:bg-[#00e077]"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Approve Application"}
                  </Button>
                </div>
              </Card>
            ))}
            {applications.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white/5 border border-dashed border-white/10 rounded-2xl">
                <CheckCircle2 className="h-10 w-10 text-[#00FF88] mx-auto mb-4 animate-bounce" />
                <p className="text-slate-400 font-bold text-sm">All expert applications have been processed successfully!</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* AUDIT SYSTEM LOGS */}
        <TabsContent value="audits" className="space-y-6">
          <Card className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-md font-black text-white mb-6">Global Audit System Pulse</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-start gap-4">
                  <div className="h-7 w-7 rounded-lg bg-[#00FF88]/10 text-[#00FF88] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-300">{log.details}</p>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {auditLogs.length === 0 && (
                <div className="text-center py-10 text-slate-500 font-bold italic text-xs">No recent audits logged yet.</div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
