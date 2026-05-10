"use client"

import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"

import { 
  Users, UserCheck, BarChart3, Activity, Database, DollarSign, ShieldCheck,
  Search, Check, X, Phone, Loader2, AlertCircle, Plus, BookOpen, FileText,
  Settings, HardDrive, MessageSquare, ChevronRight, TrendingUp, Cpu, Layers,
  LayoutDashboard, CheckCircle2, Rocket, Menu, School, Globe, MoreVertical,
  ExternalLink, ArrowLeft, Image as ImageIcon, Video, Trash2, Save, Eye,
  Type, List, Calendar, Tag, Shield, PieChart, Briefcase, GraduationCap, Bell,
  FilePlus, ClipboardList, Monitor, Star, Clock, Zap, MapPin, Mail, CreditCard,
  Share2, MousePointer2, Smartphone, MonitorIcon
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import Image from "next/image"
import { approveMentorAction, suspendMentorAction, deleteMentorAction, toggleMentorVisibilityAction } from "@/lib/actions/admin"

type EditorView = 'dashboard' | 'course-creator' | 'blog-creator' | 'test-creator' | 'roi-manager' | 'notification-center' | 'identity-manager';

export default function AdminDashboard() {
  const [view, setView] = useState<EditorView>('dashboard')
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Data States
  const [users, setUsers] = useState<any[]>([])
  const [mentors, setMentors] = useState<any[]>([])
  const [colleges, setColleges] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [stats, setStats] = useState<any>({
    users: 0, mentors: 0, colleges: 0, revenue: 0, sessions: 0, pendingMentors: 0
  })

  // Content States
  const [blogForm, setBlogForm] = useState({
    title: '', content: '', category: 'Engineering', excerpt: '', featuredImage: '', tags: '', seoTitle: '', seoDescription: ''
  })
  const [courseForm, setCourseForm] = useState({
    title: '', description: '', price: '', category: 'Mentorship', level: 'beginner', duration: '', lessons: '', 
    modules: [{ title: 'Module 1', lessons: [{ title: 'Lesson 1', type: 'video' }] }]
  })
  const [notifForm, setNotifForm] = useState({
    title: '', message: '', type: 'info', link: ''
  })

  const [bookings, setBookings] = useState<any[]>([])

  const supabase = createClient()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const { data: userData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      const { data: mentorData } = await supabase.from('profiles').select('*, is_visible').in('role', ['mentor', 'suspended_mentor'])
      const { data: collegeData } = await supabase.from('colleges').select('id, name, city, state').order('name')
      const { data: paymentData } = await supabase.from('payments').select('amount')
      const { data: appData, error: appError } = await supabase.from('mentor_applications').select('*, profiles(email)').eq('status', 'pending')
      if (appError) console.error("Applications Fetch Error:", appError)
      const { data: sessionData } = await supabase.from('sessions').select('*, profiles:student_id(name, email)').order('created_at', { ascending: false })
      
      const totalRevenue = paymentData?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0

      setUsers(userData || [])
      setMentors(mentorData || [])
      setColleges(collegeData || [])
      setApplications(appData || [])
      setBookings(sessionData || [])
      setStats({ 
        users: userData?.length || 0, 
        mentors: mentorData?.length || 0, 
        colleges: collegeData?.length || 0,
        revenue: totalRevenue,
        sessions: sessionData?.length || 0,
        pendingMentors: appData?.length || 0
      })
    } catch (error: any) {
      console.error("Admin Error:", error)
      toast.error(`Sync Failed: ${error.message || "Please check your admin permissions"}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreateCourse = async () => {
    if (!courseForm.title || !courseForm.price) return toast.error("Missing title or price")
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('courses').insert({
        title: courseForm.title,
        description: courseForm.description,
        price: Number(courseForm.price),
        category: courseForm.category,
        level: courseForm.level,
        duration_hours: Number(courseForm.duration),
        total_lessons: Number(courseForm.lessons),
        curriculum: courseForm.modules,
        slug: courseForm.title.toLowerCase().replace(/ /g, '-'),
        is_published: true
      })
      if (error) throw error
      toast.success("Course launched successfully!")
      setView('dashboard')
      fetchData()
    } catch (e: any) { toast.error(e.message) }
    finally { setIsSubmitting(false) }
  }

  const handleCreateBlog = async () => {
    if (!blogForm.title || !blogForm.content) return toast.error("Missing fields")
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('blogs').insert({
        ...blogForm,
        slug: blogForm.title.toLowerCase().replace(/ /g, '-'),
        tags: blogForm.tags.split(',').map(t => t.trim()),
        is_published: true
      })
      if (error) throw error
      toast.success("Blog published successfully!")
      setView('dashboard')
    } catch (e: any) { toast.error(e.message) }
    finally { setIsSubmitting(false) }
  }

  const handleSendNotification = async () => {
    if (!notifForm.title || !notifForm.message) return toast.error("Missing message")
    setIsSubmitting(true)
    try {
      // 1. Save to Supabase Notifications Table
      const { error } = await supabase.from('notifications').insert({
        ...notifForm,
        target_group: 'all',
        is_read: false
      })
      if (error) throw error

      // 2. Automated Email Broadcast
      const { sendBroadCastEmail } = await import('@/lib/actions/emails')
      const userEmails = users.map(u => u.email).filter(Boolean)
      
      if (userEmails.length > 0) {
        await sendBroadCastEmail(userEmails, notifForm.title, notifForm.message, notifForm.link)
        toast.success(`Notification sent to ${userEmails.length} users via Email!`)
      } else {
        toast.success("Notification posted to dashboard!")
      }
      
      setView('dashboard')
    } catch (e: any) { toast.error(e.message) }
    finally { setIsSubmitting(false) }
  }

  const approveMentor = async (appId: string, userId: string) => {
    try {
      const { error: profileError } = await supabase.from('profiles').update({ 
        role: 'mentor',
        verified: true,
        onboarding_complete: true
      }).eq('id', userId)
      
      if (profileError) throw profileError

      const { error: appError } = await supabase.from('mentor_applications').update({ status: 'approved' }).eq('id', appId)
      if (appError) throw appError

      toast.success("Mentor approved and profile updated!")
      fetchData()
    } catch (e: any) { 
      console.error("Approval Error:", e)
      toast.error(`Approval failed: ${e.message || "Permissions error"}`) 
    }
  }

  const approveMentorWithEmail = async (appId: string, userId: string, email: string, name: string) => {
    setIsSubmitting(true)
    try {
      console.log("Approving mentor:", { appId, userId, email, name })
      const result = await approveMentorAction(appId, userId, email, name)
      
      if (result.success) {
        toast.success(`Mentor approved and notification sent to ${email}`)
        await fetchData()
      } else {
        throw new Error(result.error)
      }
    } catch (e: any) {
      console.error("Approval Action Error:", e)
      toast.error(`Failed to approve: ${e.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSuspendMentor = async (userId: string, currentRole: string) => {
    setIsSubmitting(true)
    try {
      const result = await suspendMentorAction(userId, currentRole === 'mentor')
      if (result.success) {
        toast.success(currentRole === 'mentor' ? "Mentor suspended" : "Mentor unsuspended")
        await fetchData()
      } else throw new Error(result.error)
    } catch (e: any) { toast.error(e.message) }
    finally { setIsSubmitting(false) }
  }

  const handleDeleteMentor = async (userId: string) => {
    if (!confirm("Are you sure you want to revoke mentor access? This will downgrade them to a student.")) return
    setIsSubmitting(true)
    try {
      const result = await deleteMentorAction(userId)
      if (result.success) {
        toast.success("Mentor access revoked")
        await fetchData()
      } else throw new Error(result.error)
    } catch (e: any) { toast.error(e.message) }
    finally { setIsSubmitting(false) }
  }

  const handleToggleVisibility = async (userId: string, currentVisibility: boolean) => {
    setIsSubmitting(true)
    try {
      const result = await toggleMentorVisibilityAction(userId, !currentVisibility)
      if (result.success) {
        toast.success(!currentVisibility ? "Mentor is now visible" : "Mentor is now hidden")
        await fetchData()
      } else throw new Error(result.error)
    } catch (e: any) { toast.error(e.message) }
    finally { setIsSubmitting(false) }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-12">
        <div className="h-12 w-12 rounded-2xl bg-purple-600 flex items-center justify-center shadow-xl shadow-purple-200">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="font-black text-xl tracking-tighter text-slate-900 leading-tight">Admin<br/><span className="text-purple-600">Command</span></h2>
        </div>
      </div>

      <nav className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {[
          { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
          { id: 'users', label: 'Identity Hub', icon: Users },
          { id: 'mentors', label: 'Expert Network', icon: UserCheck },
          { id: 'sessions', label: 'Global Sessions', icon: Phone },
          { id: 'content', label: 'Content Architect', icon: FilePlus },
          { id: 'roi', label: 'Institute ROI', icon: GraduationCap },
          { id: 'notifs', label: 'Notification Hub', icon: Bell },
          { id: 'analytics', label: 'System Pulse', icon: Activity },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${
              activeTab === item.id 
              ? "bg-purple-600 text-white shadow-xl shadow-purple-200" 
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-8 p-6 rounded-[2rem] bg-slate-950 text-white relative overflow-hidden group">
         <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2">Supabase Sync</p>
            <div className="flex items-center gap-2 mb-4">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-xs font-bold">Postgres Online</p>
            </div>
            <Button variant="secondary" onClick={fetchData} className="w-full rounded-xl h-10 font-black text-[10px] uppercase">Force Sync</Button>
         </div>
         <Database className="absolute -bottom-4 -right-4 h-24 w-24 text-white/5 rotate-12" />
      </div>
    </div>
  )

  const RenderDashboard = () => (
    <div className="space-y-12">
      {/* Quick Actions */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Post Blog', icon: FileText, color: 'bg-blue-600', action: () => setView('blog-creator') },
          { label: 'Launch Course', icon: Rocket, color: 'bg-purple-600', action: () => setView('course-creator') },
          { label: 'Alert All Users', icon: Bell, color: 'bg-orange-500', action: () => setView('notification-center') },
          { label: 'ROI Analytics', icon: GraduationCap, color: 'bg-emerald-600', action: () => setView('roi-manager') },
        ].map((act, i) => (
          <button key={i} onClick={act.action} className="group p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left">
            <div className={`h-12 w-12 ${act.color} text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
              <act.icon className="h-6 w-6" />
            </div>
            <p className="font-black text-sm text-slate-900">{act.label}</p>
          </button>
        ))}
      </section>

      {/* Analytics Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <Card className="lg:col-span-8 bg-white border-none rounded-[3rem] shadow-sm p-10">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-2xl font-black flex items-center gap-3"><Activity className="h-7 w-7 text-purple-600" /> Platform Pulse</h3>
               <div className="flex gap-2">
                  <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold">+12% growth</Badge>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { label: 'New Students', val: stats.users, detail: 'Last 30 days', icon: Users, color: 'text-blue-600' },
                 { label: 'Mentor Calls', val: stats.sessions, detail: 'Total Sessions', icon: Phone, color: 'text-purple-600' },
                 { label: 'Gross Revenue', val: `₹${stats.revenue.toLocaleString()}`, detail: 'Life-time', icon: DollarSign, color: 'text-emerald-600' },
               ].map((s, i) => (
                 <div key={i} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 relative overflow-hidden group">
                    <s.icon className={`h-12 w-12 ${s.color} opacity-10 absolute -top-2 -right-2`} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                    <p className="text-3xl font-black text-slate-900">{s.val}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-2">{s.detail}</p>
                 </div>
               ))}
            </div>
         </Card>

         <Card className="lg:col-span-4 bg-slate-950 text-white border-none rounded-[3rem] shadow-sm p-10 flex flex-col relative overflow-hidden">
            <div className="relative z-10 h-full flex flex-col">
               <h3 className="text-xl font-black mb-6">Pending Tasks</h3>
               <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                     <div className="flex items-center gap-3">
                        <UserCheck className="h-5 w-5 text-purple-400" />
                        <span className="text-sm font-bold">Mentor Apps</span>
                     </div>
                     <Badge className="bg-purple-600 text-white border-none">{stats.pendingMentors}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 opacity-50">
                     <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-orange-400" />
                        <span className="text-sm font-bold">Bug Reports</span>
                     </div>
                     <Badge className="bg-slate-700 text-white border-none">0</Badge>
                  </div>
               </div>
               <Button onClick={() => setActiveTab('mentors')} className="w-full mt-6 rounded-xl h-12 bg-white text-black font-black hover:bg-slate-100">Review All Requests</Button>
            </div>
            <Zap className="absolute -bottom-10 -right-10 h-40 w-40 text-white/5 rotate-45" />
         </Card>
      </div>
    </div>
  )

  const RenderUsers = () => (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-black">Identity Management</h2>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search by email or name..." className="pl-11 rounded-2xl h-12 bg-white border-slate-200 font-bold" />
        </div>
      </div>
      
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">User</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Role</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Join Date</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-black">
                      {u.name?.charAt(0) || u.email?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{u.name || 'Anonymous User'}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <Badge className={`rounded-lg px-2 py-0.5 border-none font-black text-[10px] ${
                    u.role === 'admin' ? 'bg-red-50 text-red-600' : 
                    u.role === 'mentor' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {u.role?.toUpperCase() || 'STUDENT'}
                  </Badge>
                </td>
                <td className="px-8 py-6 text-sm font-bold text-slate-500">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-8 py-6">
                  <Button variant="ghost" size="sm" className="font-black text-xs text-purple-600 hover:bg-purple-50 rounded-xl">Elevate</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const RenderContentCreator = () => (
     <div className="space-y-12">
        <header className="text-center max-w-2xl mx-auto mb-16">
           <h2 className="text-4xl font-black mb-4">Content Architect</h2>
           <p className="text-slate-500 font-medium italic">Deploy blogs, courses, and test series directly to the live platform.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: 'Global Blogs', icon: FileText, count: '12 Posts', action: () => setView('blog-creator') },
             { title: 'Premium Courses', icon: Rocket, count: '4 Active', action: () => setView('course-creator') },
             { title: 'Test Series', icon: Monitor, count: '8 Packs', action: () => setView('test-creator') },
           ].map((c, i) => (
             <Card key={i} className="group p-8 rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer" onClick={c.action}>
                <div className="h-16 w-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-purple-600 group-hover:text-white transition-all">
                   <c.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-black mb-1">{c.title}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{c.count}</p>
                <ChevronRight className="mt-8 text-slate-300 group-hover:translate-x-2 transition-all" />
             </Card>
           ))}
        </div>
     </div>
  )

  const RenderNotificationHub = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="rounded-[3rem] border-slate-100 p-10 space-y-8 shadow-sm">
        <div className="flex items-center gap-4">
           <div className="h-12 w-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
              <Bell className="h-6 w-6" />
           </div>
           <div>
              <h2 className="text-2xl font-black">Notification Hub</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Broadcast Messages to All Students</p>
           </div>
        </div>

        <div className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">Alert Title</label>
              <Input placeholder="Flash: MHT-CET Result Out!" value={notifForm.title} onChange={e => setNotifForm({...notifForm, title: e.target.value})} className="h-14 rounded-2xl font-black" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">Content</label>
              <Textarea placeholder="The MHT-CET results are officially live. Click below to check your rank..." value={notifForm.message} onChange={e => setNotifForm({...notifForm, message: e.target.value})} className="min-h-[120px] rounded-2xl font-medium" />
           </div>
           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400">Action Link (Optional)</label>
                 <Input placeholder="https://..." value={notifForm.link} onChange={e => setNotifForm({...notifForm, link: e.target.value})} className="h-12 rounded-xl font-bold" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400">Type</label>
                 <Select value={notifForm.type} onValueChange={v => setNotifForm({...notifForm, type: v})}>
                    <SelectTrigger className="h-12 rounded-xl font-bold">
                       <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="info">Information (Blue)</SelectItem>
                       <SelectItem value="warning">Important (Orange)</SelectItem>
                       <SelectItem value="success">Success (Green)</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
           </div>
           <Button onClick={handleSendNotification} disabled={isSubmitting} className="w-full h-16 rounded-[2rem] bg-orange-600 text-white font-black text-lg shadow-xl shadow-orange-100">
              {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : "Broadcast Notification"}
           </Button>
        </div>
      </Card>
    </div>
  )

  const RenderBlogCreator = () => (
     <div className="max-w-5xl mx-auto space-y-12 pb-20">
        <header className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky top-6 z-20">
           <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setView('dashboard')} className="rounded-full bg-slate-50 h-10 w-10"><ArrowLeft className="h-4 w-4" /></Button>
              <h1 className="text-xl font-black tracking-tighter">Blog Architect</h1>
           </div>
           <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl font-black text-xs border-slate-100">Save Draft</Button>
              <Button onClick={handleCreateBlog} disabled={isSubmitting} className="rounded-xl px-8 font-black text-xs bg-purple-600 text-white">
                 {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Publish to Site"}
              </Button>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 space-y-8">
              <Card className="p-8 rounded-[2.5rem] border-slate-100 shadow-sm space-y-6">
                 <Input value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} placeholder="Article Title..." className="h-16 text-3xl font-black border-none placeholder:text-slate-200 px-0 focus-visible:ring-0" />
                 <div className="flex gap-2">
                    <Badge className="bg-slate-100 text-slate-500 border-none font-bold">Category: {blogForm.category}</Badge>
                 </div>
                 <Textarea value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} placeholder="Write your content here (Supports Markdown/Rich Text)..." className="min-h-[500px] text-lg border-none focus-visible:ring-0 px-0 font-medium leading-relaxed" />
              </Card>
           </div>

           <aside className="lg:col-span-4 space-y-6">
              <Card className="p-8 rounded-[2.5rem] border-slate-100 shadow-sm space-y-6">
                 <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">SEO & Identity</h4>
                 <div className="space-y-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase">Featured Image URL</label>
                       <Input value={blogForm.featuredImage} onChange={e => setBlogForm({...blogForm, featuredImage: e.target.value})} className="h-10 rounded-xl bg-slate-50 border-none text-xs font-bold" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase">Tags (Comma Sep)</label>
                       <Input value={blogForm.tags} onChange={e => setBlogForm({...blogForm, tags: e.target.value})} className="h-10 rounded-xl bg-slate-50 border-none text-xs font-bold" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase">SEO Description</label>
                       <Textarea value={blogForm.seoDescription} onChange={e => setBlogForm({...blogForm, seoDescription: e.target.value})} className="rounded-xl bg-slate-50 border-none text-xs font-bold" />
                    </div>
                 </div>
              </Card>

              <Card className="p-8 rounded-[2.5rem] border-slate-100 shadow-sm bg-purple-50 border-purple-100">
                 <h4 className="text-sm font-black text-purple-600 mb-2">Pro Tip</h4>
                 <p className="text-xs font-medium text-purple-900/60 leading-relaxed">Images with 1200x630 resolution perform best for social link previews.</p>
              </Card>
           </aside>
        </div>
     </div>
  )

  const RenderCourseCreator = () => (
     <div className="max-w-5xl mx-auto space-y-12 pb-20">
        <header className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky top-6 z-20">
           <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setView('dashboard')} className="rounded-full bg-slate-50 h-10 w-10"><ArrowLeft className="h-4 w-4" /></Button>
              <h1 className="text-xl font-black tracking-tighter">Course Architect</h1>
           </div>
           <div className="flex gap-3">
              <Button onClick={handleCreateCourse} disabled={isSubmitting} className="rounded-xl px-8 font-black text-xs bg-purple-600 text-white shadow-lg shadow-purple-100">
                 {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Launch Course"}
              </Button>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 space-y-8">
              <Card className="p-10 rounded-[3rem] border-slate-100 shadow-sm space-y-6">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400">Course Title</label>
                    <Input value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} placeholder="e.g. Master JoSAA Counseling" className="h-14 text-2xl font-black rounded-2xl" />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400">Description</label>
                    <Textarea value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} placeholder="What is this course about?" className="min-h-[200px] rounded-2xl font-medium" />
                 </div>
              </Card>

              <Card className="p-10 rounded-[3rem] border-slate-100 shadow-sm space-y-8">
                 <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black">Curriculum Modules</h3>
                    <Button variant="ghost" onClick={() => setCourseForm({...courseForm, modules: [...courseForm.modules, { title: 'New Module', lessons: [] }]})} className="text-purple-600 font-black">+ Add Module</Button>
                 </div>
                 <div className="space-y-4">
                    {courseForm.modules.map((m, i) => (
                       <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                          <Input value={m.title} onChange={e => {
                             const nm = [...courseForm.modules]; nm[i].title = e.target.value; setCourseForm({...courseForm, modules: nm});
                          }} className="font-black mb-4 bg-transparent border-none focus-visible:ring-0 text-lg" />
                          <div className="pl-6 border-l-2 border-purple-200 space-y-3">
                             <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Lessons</p>
                             <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-black">+ Add Lesson</Button>
                          </div>
                       </div>
                    ))}
                 </div>
              </Card>
           </div>

           <aside className="lg:col-span-4 space-y-6">
              <Card className="p-8 rounded-[2.5rem] border-slate-100 shadow-sm space-y-6">
                 <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Course Settings</h4>
                 <div className="space-y-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase">Price (₹)</label>
                       <Input value={courseForm.price} onChange={e => setCourseForm({...courseForm, price: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-black" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase">Duration (Hrs)</label>
                       <Input value={courseForm.duration} onChange={e => setCourseForm({...courseForm, duration: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-black" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase">Total Lessons</label>
                       <Input value={courseForm.lessons} onChange={e => setCourseForm({...courseForm, lessons: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-black" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase">Level</label>
                       <Select value={courseForm.level} onValueChange={v => setCourseForm({...courseForm, level: v})}>
                          <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-black">
                             <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="beginner">Beginner</SelectItem>
                             <SelectItem value="intermediate">Intermediate</SelectItem>
                             <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                 </div>
              </Card>
           </aside>
        </div>
     </div>
  )

  const RenderBookings = () => (
     <div className="space-y-8">
        <div className="flex justify-between items-center">
           <h2 className="text-2xl font-black flex items-center gap-3"><MonitorIcon className="h-7 w-7 text-purple-600" /> Global Sessions Monitor</h2>
           <Badge className="bg-emerald-50 text-emerald-600 border-none font-black uppercase text-[10px] px-3 py-1">Real-time Sync Active</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {bookings.map(b => (
              <Card key={b.id} className="p-8 rounded-[2.5rem] border-slate-100 shadow-sm bg-white hover:shadow-xl transition-all">
                 <div className="flex justify-between items-start mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                       <Calendar className="h-6 w-6" />
                    </div>
                    <Badge variant={b.status === 'scheduled' ? 'default' : 'secondary'} className="rounded-lg font-black text-[10px]">
                       {b.status?.toUpperCase() || 'SCHEDULED'}
                    </Badge>
                 </div>
                 <div className="space-y-4">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Student</p>
                       <p className="font-bold text-slate-900">{b.profiles?.name || 'Anonymous'}</p>
                       <p className="text-xs text-slate-400 font-medium">{b.profiles?.email}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Schedule</p>
                       <p className="text-sm font-black text-purple-600">{new Date(b.scheduled_at).toLocaleString()}</p>
                    </div>
                    <Button variant="outline" className="w-full rounded-xl h-10 font-black text-[10px] uppercase border-slate-100">View Meeting</Button>
                 </div>
              </Card>
           ))}
           {bookings.length === 0 && (
              <Card className="col-span-full p-20 text-center rounded-[3rem] bg-slate-50 border-2 border-dashed border-slate-200">
                 <Monitor className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                 <p className="text-slate-500 font-bold">No active consultancy sessions found.</p>
              </Card>
           )}
        </div>
     </div>
  )

  const RenderMentorsHub = () => (
    <div className="space-y-12">
      <section className="space-y-6">
        <h2 className="text-2xl font-black flex items-center gap-3">
          <UserCheck className="h-7 w-7 text-purple-600" /> Pending Applications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.length === 0 ? (
            <Card className="col-span-full p-12 text-center rounded-[3rem] bg-slate-50 border-2 border-dashed border-slate-200">
               <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
               <p className="text-slate-500 font-bold">All applications are currently processed.</p>
            </Card>
          ) : (
            applications.map(app => (
              <Card key={app.id} className="p-8 rounded-[2.5rem] border-slate-100 shadow-sm bg-white hover:shadow-xl transition-all">
                 <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-black">
                          {app.name?.charAt(0)}
                       </div>
                        <div>
                           <h4 className="font-black text-lg">{app.name}</h4>
                           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{app.college} · {app.branch}</p>
                           <div className="flex flex-wrap gap-1 mt-1">
                              {app.counseling_type?.map((type: string) => (
                                <Badge key={type} className="bg-purple-50 text-purple-600 border-none text-[8px] px-1.5 py-0">{type}</Badge>
                              ))}
                           </div>
                        </div>
                    </div>
                    <Badge className="bg-orange-50 text-orange-600 border-none font-black text-[10px]">NEW</Badge>
                 </div>
                 <div className="space-y-4 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 line-clamp-3 italic">"{app.bio || 'No bio provided'}"</p>
                 </div>
                 <div className="flex gap-3">
                    <Button 
                      onClick={() => approveMentorWithEmail(app.id, app.user_id, app.profiles?.email, app.name)} 
                      disabled={isSubmitting}
                      className="flex-1 rounded-xl h-12 bg-purple-600 font-black text-xs text-white"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Approve Expert"}
                    </Button>
                    <Button variant="ghost" className="rounded-xl h-12 px-5 text-red-500 font-black text-xs hover:bg-red-50">Decline</Button>
                 </div>
              </Card>
            ))
          )}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-black">Active Experts</h2>
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Expert</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Stats</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Pricing</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mentors.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-black overflow-hidden relative">
                         {m.image ? <Image src={m.image} alt={m.name} fill className="object-cover" /> : m.name?.charAt(0)}
                      </div>
                       <div>
                        <p className="font-bold text-slate-900">{m.name}</p>
                        <p className="text-xs text-slate-400 font-bold">{m.college}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                           {m.counseling_type?.map((type: string) => (
                              <Badge key={type} className="bg-purple-50 text-purple-600 border-none text-[8px] px-1.5 py-0">{type}</Badge>
                           ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                       <span className="text-sm font-black">{m.rating || '4.9'}</span>
                       <span className="text-xs text-slate-300">({m.reviewsCount || 0})</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-emerald-600">
                    ₹{m.pricing || 499}
                  </td>
                  <td className="px-8 py-6">
                    <Badge className={`rounded-lg px-2 py-0.5 border-none font-black text-[10px] ${m.is_visible ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {m.is_visible ? 'VISIBLE' : 'HIDDEN'}
                    </Badge>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         onClick={() => handleToggleVisibility(m.id, m.is_visible)}
                         className={`font-black text-[10px] uppercase rounded-xl ${m.is_visible ? 'text-slate-500 hover:bg-slate-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                       >
                         {m.is_visible ? 'Hide' : 'Show'}
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         onClick={() => handleSuspendMentor(m.id, m.role)}
                         className={`font-black text-[10px] uppercase rounded-xl ${m.role === 'suspended_mentor' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-orange-500 hover:bg-orange-50'}`}
                       >
                         {m.role === 'suspended_mentor' ? 'Unsuspend' : 'Suspend'}
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         onClick={() => handleDeleteMentor(m.id)}
                         className="font-black text-[10px] uppercase text-red-500 hover:bg-red-50 rounded-xl"
                       >
                         Revoke
                       </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )

  if (view === 'blog-creator') return <div className="bg-slate-50 min-h-screen p-6 md:p-12"><RenderBlogCreator /></div>
  if (view === 'course-creator') return <div className="bg-slate-50 min-h-screen p-6 md:p-12"><RenderCourseCreator /></div>
  if (view === 'notification-center') return <div className="bg-slate-50 min-h-screen p-6 md:p-12"><div className="flex items-center gap-4 mb-12"><Button variant="ghost" size="icon" onClick={() => setView('dashboard')} className="rounded-full bg-white h-12 w-12 shadow-sm"><ArrowLeft /></Button><h1 className="text-3xl font-black tracking-tighter">Communications Center</h1></div><RenderNotificationHub /></div>

  return (
    <div className="min-h-screen bg-slate-50 text-black font-sans flex flex-col lg:flex-row">
        
        {/* Sidebar */}
        <aside className="w-80 border-r border-slate-200 bg-white hidden lg:flex flex-col p-8 fixed h-full z-10">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-80 p-6 md:p-12 min-h-screen">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                 <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 capitalize">{activeTab.replace('-', ' ')}</h1>
                 {isLoading && <Loader2 className="animate-spin h-6 w-6 text-purple-600" />}
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Command Center for Apna Counsellor Authority</p>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
               <Button onClick={() => setView('dashboard')} className="rounded-2xl h-14 w-14 bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <Activity className="h-5 w-5 text-slate-400" />
               </Button>
               <Button onClick={fetchData} className="flex-1 md:flex-none rounded-2xl h-14 px-8 font-black bg-purple-600 text-white shadow-xl shadow-purple-100 transition-all hover:scale-105">
                  <RotateCcw className="mr-2 h-5 w-5" /> Refresh Systems
               </Button>
            </div>
          </header>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             {activeTab === 'overview' && <RenderDashboard />}
             {activeTab === 'users' && <RenderUsers />}
             {activeTab === 'mentors' && <RenderMentorsHub />}
             {activeTab === 'sessions' && <RenderBookings />}
             {activeTab === 'content' && <RenderContentCreator />}
             {activeTab === 'notifs' && <RenderNotificationHub />}
             {activeTab === 'roi' && (
                <div className="space-y-8">
                   <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                      <div>
                         <h2 className="text-2xl font-black">Institute ROI Reports</h2>
                         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Manage batch outcomes for 100+ institutes</p>
                      </div>
                      <Button className="rounded-2xl h-14 px-8 font-black bg-purple-600 text-white shadow-xl shadow-purple-100" onClick={() => setView('roi-manager')}>+ New Batch Report</Button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {colleges.slice(0, 12).map(c => (
                         <Card key={c.id} className="bg-white border-none rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group">
                            <h3 className="font-black text-lg mb-2 text-slate-900 line-clamp-1">{c.name}</h3>
                            <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400 mb-6">
                               <span>Batch 2025</span>
                               <span className="text-emerald-600">Active Analytics</span>
                            </div>
                            <Button variant="outline" className="w-full rounded-xl font-black text-[10px] uppercase border-slate-100 h-12 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all">Edit ROI Report</Button>
                         </Card>
                      ))}
                   </div>
                </div>
             )}
          </div>

        </main>
      </div>
  )
}

function RotateCcw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}
