"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { 
  Users, UserCheck, Activity, DollarSign, Rocket, BookOpen, 
  FileText, Bell, Plus, Loader2, CheckCircle2, BarChart3,
  ArrowUpRight, Clock, TrendingUp
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { approveMentorAction } from "@/lib/actions/admin"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [stats, setStats] = useState({ students: 0, mentors: 0, courses: 0, enrollments: 0, revenue: 0, blogs: 0 })
  const [recentEnrollments, setRecentEnrollments] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [
        { count: students },
        { count: mentors },
        { count: courses },
        { count: enrollments },
        { data: payments },
        { data: blogs },
        { data: enrollData },
        { data: appData },
        { data: logData }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'mentor'),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('course_enrollments').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('payments').select('amount').eq('status', 'captured'),
        supabase.from('blogs').select('id', { count: 'exact', head: false }),
        supabase.from('course_enrollments').select('*, courses(title), profiles:student_id(name, email)').order('created_at', { ascending: false }).limit(8),
        supabase.from('mentor_applications').select('*, profiles(email)').eq('status', 'pending'),
        supabase.from('course_audit_logs').select('*').order('created_at', { ascending: false }).limit(15)
      ])

      const revenue = payments?.reduce((acc, p) => acc + (Number(p.amount) || 0), 0) || 0
      setStats({ students: students || 0, mentors: mentors || 0, courses: courses || 0, enrollments: enrollments || 0, revenue, blogs: blogs?.length || 0 })
      setRecentEnrollments(enrollData || [])
      setApplications(appData || [])
      setAuditLogs(logData || [])
    } catch (err: any) {
      toast.error("Data sync failed: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleApprove = async (app: any) => {
    setIsSubmitting(true)
    try {
      const result = await approveMentorAction(app.id, app.user_id, app.profiles?.email, app.name)
      if (!result.success) throw new Error(result.error)
      toast.success(`${app.name} approved as mentor!`)
      fetchData()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const statCards = [
    { label: "Total Students", value: stats.students, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", trend: "+12% this week" },
    { label: "Active Courses", value: stats.courses, icon: Rocket, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", trend: "Live programs" },
    { label: "Enrollments", value: stats.enrollments, icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", trend: "Paid subscriptions" },
    { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", trend: "All time" },
    { label: "Active Mentors", value: stats.mentors, icon: UserCheck, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", trend: "Approved experts" },
    { label: "Blog Posts", value: stats.blogs, icon: FileText, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", trend: "Published articles" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Command Center</h1>
          <p className="text-slate-500 text-xs font-medium mt-1">Real-time platform overview & controls</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/courses/new">
            <Button className="h-10 rounded-xl bg-purple-600 text-white font-black text-xs px-5 hover:bg-purple-700 shadow-lg shadow-purple-500/20 flex items-center gap-2">
              <Plus className="h-4 w-4" /> Launch Course
            </Button>
          </Link>
          <Button onClick={fetchData} variant="ghost" className="h-10 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs font-bold px-4">
            {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "↻ Sync"}
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((s, i) => (
          <Card key={i} className={`bg-slate-900 border ${s.border} rounded-xl p-5 relative overflow-hidden`}>
            <div className={`h-9 w-9 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
              <s.icon className={`h-4.5 w-4.5 ${s.color}`} />
            </div>
            <p className="text-xl font-black text-white">{s.value}</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{s.label}</p>
            <p className="text-[8px] text-slate-600 mt-1">{s.trend}</p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "New Course", icon: Rocket, href: "/admin/courses/new", color: "text-purple-400" },
          { label: "Write Blog", icon: FileText, href: "/admin/blogs", color: "text-cyan-400" },
          { label: "Broadcast", icon: Bell, href: "/admin/notifications", color: "text-amber-400" },
          { label: "Students", icon: Users, href: "/admin/students", color: "text-blue-400" },
        ].map(a => (
          <Link key={a.href} href={a.href}>
            <div className="bg-slate-900 border border-white/5 rounded-xl p-5 flex items-center gap-3 hover:border-white/10 hover:bg-slate-800 transition-all cursor-pointer group">
              <a.icon className={`h-5 w-5 ${a.color} flex-shrink-0`} />
              <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{a.label}</span>
              <ArrowUpRight className="h-4 w-4 text-slate-600 ml-auto group-hover:text-slate-400 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* Tabs: Enrollments / Applications / Audit */}
      <Tabs defaultValue="enrollments">
        <TabsList className="bg-slate-900 border border-white/5 rounded-xl p-1 h-12">
          <TabsTrigger value="enrollments" className="rounded-lg text-xs font-bold data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-400 px-4">
            Enrollments ({recentEnrollments.length})
          </TabsTrigger>
          <TabsTrigger value="applications" className="rounded-lg text-xs font-bold data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-400 px-4">
            Approvals {applications.length > 0 && <Badge className="ml-1.5 bg-red-500 text-white border-none text-[8px] px-1.5">{applications.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="audits" className="rounded-lg text-xs font-bold data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-400 px-4">
            Audit Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enrollments" className="mt-4">
          <div className="bg-slate-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="border-b border-white/5">
                <tr>
                  {['Student', 'Course', 'Payment ID', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left font-black text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentEnrollments.map(e => (
                  <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-200">{e.profiles?.name || 'Anonymous'}</p>
                      <p className="text-[10px] text-slate-500">{e.profiles?.email}</p>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-300">{e.courses?.title || '—'}</td>
                    <td className="px-5 py-4 font-mono text-slate-500 text-[10px]">{e.payment_id?.slice(0, 16) || 'N/A'}</td>
                    <td className="px-5 py-4">
                      <Badge className={`border-none text-[9px] font-black ${e.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-400'}`}>
                        {e.status?.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{new Date(e.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {!recentEnrollments.length && (
                  <tr><td colSpan={5} className="py-12 text-center text-slate-600 font-bold italic">No enrollments recorded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="mt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {applications.map(app => (
              <div key={app.id} className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-black text-white">{app.name}</p>
                    <p className="text-[10px] text-slate-500">{app.profiles?.email}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{app.college} · {app.branch}</p>
                  </div>
                  <Badge className="bg-amber-500/10 text-amber-400 border-none font-black text-[9px]">PENDING</Badge>
                </div>
                <p className="text-xs text-slate-500 italic border-t border-white/5 pt-3">"{app.bio?.slice(0, 100) || 'No bio'}..."</p>
                <Button
                  onClick={() => handleApprove(app)}
                  disabled={isSubmitting}
                  className="w-full h-10 rounded-xl bg-purple-600 text-white font-black text-xs hover:bg-purple-700"
                >
                  {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Approve as Mentor"}
                </Button>
              </div>
            ))}
            {!applications.length && (
              <div className="col-span-2 py-16 text-center bg-slate-900 rounded-xl border border-dashed border-white/10">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                <p className="text-slate-400 font-bold text-sm">All applications are processed!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="audits" className="mt-4">
          <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-3 max-h-[400px] overflow-y-auto">
            {auditLogs.map(log => (
              <div key={log.id} className="flex items-start gap-3 p-3 bg-white/[0.03] rounded-lg border border-white/5">
                <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
                  <Activity className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs text-slate-300 font-medium">{log.details}</p>
                  <p className="text-[9px] text-slate-600 mt-0.5">{new Date(log.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {!auditLogs.length && (
              <p className="text-center py-10 text-slate-600 font-bold italic text-xs">No audit events yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
