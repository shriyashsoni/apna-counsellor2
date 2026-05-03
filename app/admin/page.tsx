"use client"

import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { AdminGuard } from "@/components/admin-guard"
import { 
  Users, 
  UserCheck, 
  BarChart3, 
  Activity, 
  Database, 
  DollarSign, 
  ShieldCheck,
  Search,
  Check,
  X,
  Phone,
  Loader2,
  AlertCircle,
  Plus,
  BookOpen,
  FileText,
  Settings,
  HardDrive,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  LayoutDashboard,
  CheckCircle2,
  Rocket,
  Menu,
  MoreVertical
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Data States
  const [users, setUsers] = useState<any[]>([])
  const [mentors, setMentors] = useState<any[]>([])
  const [stats, setStats] = useState<any>({
    users: 0, mentors: 0, revenue: 0, storage: { used: 12.5, total: 100 }, activeSessions: 0
  })
  const [logs, setLogs] = useState<any[]>([])

  // Modal States
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false)
  const [launchType, setLaunchType] = useState<'course' | 'test' | 'blog'>('course')
  const [launchData, setLaunchData] = useState({ title: '', desc: '', price: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const supabase = createClient()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const { data: userData } = await supabase.from('profiles').select('*')
      const { data: mentorData } = await supabase.from('profiles').select('*').eq('role', 'mentor')
      
      // Try fetching from system_logs (handle error if table doesn't exist yet)
      const { data: logData, error: logError } = await supabase.from('system_logs').select('*').order('created_at', { ascending: false })
      if (!logError) setLogs(logData || [])

      const { data: paymentData } = await supabase.from('payments').select('amount')
      const totalRevenue = paymentData?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0

      setUsers(userData || [])
      setMentors(mentorData || [])
      setStats({ 
        users: userData?.length || 0, 
        mentors: mentorData?.length || 0, 
        revenue: totalRevenue,
        storage: { used: 12.5, total: 100 },
        activeSessions: 42
      })
    } catch (error) {
      console.error("Error fetching admin data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleLaunchSubmit = async () => {
    if (!launchData.title || !launchData.desc) {
      toast.error("Please fill in all fields")
      return
    }
    
    setIsSubmitting(true)
    try {
      let table = launchType === 'course' ? 'courses' : (launchType === 'test' ? 'test_series' : 'system_logs')
      let payload: any = {
        title: launchData.title,
        description: launchData.desc,
      }
      
      if (launchType !== 'blog') {
        payload.price = Number(launchData.price) || 0
      } else {
        payload.type = 'feedback' // Mapping blog to system_logs for now as an example
      }

      const { error } = await supabase.from(table).insert(payload)
      
      if (error) {
        if (error.code === '42P01') {
          toast.error("Database table missing. Please run the provided SQL script in Supabase first.")
        } else {
          toast.error(error.message)
        }
      } else {
        toast.success(`${launchType.toUpperCase()} launched successfully!`)
        setIsLaunchModalOpen(false)
        setLaunchData({ title: '', desc: '', price: '' })
        fetchData()
      }
    } catch (err: any) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const approveMentor = async (id: string) => {
    const { error } = await supabase.from('profiles').update({ approved: true }).eq('id', id)
    if (!error) {
      toast.success("Mentor approved!")
      fetchData()
    }
  }

  const changeUserRole = async (id: string, role: string) => {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
    if (!error) {
      toast.success(`Role updated to ${role}`)
      fetchData()
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-12">
        <div className="h-12 w-12 rounded-2xl bg-purple-600 flex items-center justify-center shadow-xl shadow-purple-200">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="font-black text-xl tracking-tighter text-slate-900">ApnaAdmin</h2>
          <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Master Portal</p>
        </div>
      </div>

      <nav className="space-y-1.5 flex-1">
        {[
          { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'mentors', label: 'Mentors', icon: UserCheck },
          { id: 'content', label: 'Launch Pad', icon: Rocket },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'health', label: 'Health', icon: Activity },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id)
              setIsMobileMenuOpen(false)
            }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
              activeTab === item.id 
              ? "bg-purple-600 text-white shadow-lg shadow-purple-200" 
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto p-6 rounded-3xl bg-slate-50 border border-slate-100">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Authenticated Owner</p>
        <p className="text-xs font-bold text-slate-500 leading-relaxed">
          Full permissions enabled. Actions are live on production.
        </p>
      </div>
    </div>
  )

  if (isLoading && users.length === 0) {
    return (
      <AdminGuard>
        <div className="h-screen flex flex-col items-center justify-center bg-white text-black">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
          <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Initializing Master Console...</p>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-white text-black font-sans flex flex-col lg:flex-row">
        
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-200">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-black text-lg tracking-tighter">ApnaAdmin</h2>
          </div>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-8">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </header>

        {/* Desktop Sidebar */}
        <aside className="w-72 border-r border-slate-200 bg-white hidden lg:flex flex-col p-8 fixed h-full z-10">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 p-6 md:p-12 min-h-screen bg-slate-50/30">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 text-slate-900 capitalize">{activeTab.replace('-', ' ')}</h1>
              <p className="text-slate-500 font-medium text-sm md:text-base">Real-time platform control & monitoring.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
               <Button onClick={() => { setLaunchType('course'); setIsLaunchModalOpen(true); }} className="flex-1 md:flex-none rounded-2xl h-12 px-8 font-black bg-purple-600 text-white hover:bg-purple-700 shadow-xl shadow-purple-100 transition-all active:scale-95">
                  <Plus className="mr-2 h-4 w-4" /> Quick Action
               </Button>
            </div>
          </header>

          {/* Tab Content */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'overview' && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50", trend: "+14%" },
                    { label: "Total Users", value: stats.users, icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "+8%" },
                    { label: "Mentors", value: stats.mentors, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+12%" },
                    { label: "Sessions", value: stats.activeSessions, icon: Activity, color: "text-orange-600", bg: "bg-orange-50", trend: "+22%" },
                  ].map((stat, i) => (
                    <Card key={i} className="bg-white border-slate-100 rounded-[2rem] overflow-hidden group hover:shadow-xl hover:shadow-purple-500/5 transition-all">
                      <CardContent className="p-8">
                        <div className="flex justify-between items-start mb-6">
                          <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                          </div>
                          <Badge variant="outline" className="border-slate-100 text-purple-600 text-[10px] font-black uppercase tracking-widest">{stat.trend}</Badge>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                        <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card className="lg:col-span-2 bg-white border-slate-100 rounded-[2.5rem] shadow-sm">
                    <CardHeader className="p-8 md:p-10">
                      <CardTitle className="text-2xl font-black flex items-center gap-3 text-slate-900">
                        <TrendingUp className="h-6 w-6 text-purple-600" /> Platform Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 md:p-10 pt-0 h-64 flex items-center justify-center border-t border-slate-50">
                      <div className="text-center">
                        <BarChart3 className="h-16 w-16 text-slate-100 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Live data stream active...</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-sm">
                    <CardHeader className="p-8 md:p-10">
                      <CardTitle className="text-2xl font-black flex items-center gap-3 text-slate-900">
                        <HardDrive className="h-6 w-6 text-purple-600" /> Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 md:p-10 pt-0 space-y-8">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-bold text-slate-500">Storage Usage</span>
                          <span className="text-sm font-black text-slate-900">{stats.storage.used}GB / {stats.storage.total}GB</span>
                        </div>
                        <Progress value={(stats.storage.used / stats.storage.total) * 100} className="h-3 bg-slate-100" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Backup</p>
                          <p className="text-sm font-black text-emerald-500">Enabled</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Health</p>
                          <p className="text-sm font-black text-slate-900">99.9%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                <CardHeader className="p-8 md:p-10 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-black text-slate-900">User Management</CardTitle>
                    <p className="text-slate-500 font-medium text-sm mt-1">Direct control over {users.length} entities.</p>
                  </div>
                  <div className="relative w-full max-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search identity..." className="bg-slate-50 border-slate-100 pl-11 rounded-xl h-12 text-black focus-visible:ring-purple-600" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50/50">
                        <tr>
                          <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                          <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                          <th className="px-10 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Permissions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-sm">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                                   {user.name?.[0] || 'U'}
                                </div>
                                <div>
                                  <p className="font-black text-slate-900">{user.name || "User"}</p>
                                  <p className="text-[10px] text-slate-400 font-bold">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-6">
                               <Badge className={`${user.role === 'mentor' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'} border-none font-black text-[9px] uppercase px-2`}>
                                  {user.role}
                               </Badge>
                            </td>
                            <td className="px-10 py-6 text-right space-x-2">
                               <Button size="sm" variant="ghost" onClick={() => changeUserRole(user.id, user.role === 'student' ? 'mentor' : 'student')} className="text-xs font-black text-purple-600 hover:bg-purple-50">
                                  Assign {user.role === 'student' ? 'Mentor' : 'Student'}
                                </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'mentors' && (
              <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                <CardHeader className="p-8 md:p-10 border-b border-slate-50">
                  <CardTitle className="text-2xl font-black text-slate-900">Expert Verification</CardTitle>
                  <p className="text-slate-400 font-medium text-sm mt-1">Reviewing pending expert applications.</p>
                </CardHeader>
                <CardContent className="p-0">
                   <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50/50">
                          <tr>
                            <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Expert</th>
                            <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                            <th className="px-10 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                          {mentors.map((mentor) => (
                            <tr key={mentor.id} className="hover:bg-slate-50/30 transition-colors">
                               <td className="px-10 py-6">
                                  <div className="flex items-center gap-4">
                                     <div className="h-12 w-12 rounded-2xl bg-slate-50 overflow-hidden">
                                        {mentor.image && <img src={mentor.image} alt="" className="h-full w-full object-cover" />}
                                     </div>
                                     <div>
                                        <p className="font-black text-slate-900">{mentor.name}</p>
                                        <p className="text-[10px] text-slate-400 font-black uppercase">{mentor.college || 'No Data'}</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-10 py-6">
                                  {mentor.approved ? (
                                    <Badge className="bg-emerald-100 text-emerald-600 border-none font-black text-[9px] uppercase px-2">Verified</Badge>
                                  ) : (
                                    <Badge className="bg-orange-100 text-orange-600 border-none font-black text-[9px] uppercase px-2">Pending</Badge>
                                  )}
                               </td>
                               <td className="px-10 py-6 text-right">
                                  {!mentor.approved && (
                                    <Button onClick={() => approveMentor(mentor.id)} className="bg-purple-600 text-white font-black rounded-xl h-10 px-6">Approve Expert</Button>
                                  )}
                               </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'content' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { id: 'course', title: 'New Course', desc: 'Deploy academic content.', icon: BookOpen, color: 'purple' },
                  { id: 'test', title: 'Test Series', desc: 'Launch mock tests.', icon: FileText, color: 'black' },
                  { id: 'blog', title: 'Post Bong', desc: 'Publish insights.', icon: MessageSquare, color: 'purple-outline' },
                ].map((item) => (
                  <Card key={item.id} className="bg-white border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all group">
                    <div className="h-20 w-20 bg-purple-50 text-purple-600 rounded-[2rem] flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                      <item.icon className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-black mb-2 text-slate-900">{item.title}</h3>
                    <p className="text-slate-400 font-medium mb-8 text-sm">{item.desc}</p>
                    <Button 
                      onClick={() => { setLaunchType(item.id as any); setIsLaunchModalOpen(true); }}
                      className={`w-full rounded-2xl h-14 font-black ${item.color === 'purple' ? 'bg-purple-600 text-white' : (item.color === 'black' ? 'bg-black text-white' : 'border-2 border-purple-600 text-purple-600 bg-transparent')}`}
                    >
                      Initialize {item.id}
                    </Button>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'health' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-sm">
                    <CardHeader className="p-10 border-b border-slate-50">
                      <CardTitle className="text-2xl font-black text-slate-900">Incident Monitor</CardTitle>
                    </CardHeader>
                    <CardContent className="p-10">
                      {logs.filter(l => l.type === 'issue').length === 0 ? (
                        <div className="text-center py-10">
                          <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                          <p className="font-bold text-slate-400 uppercase tracking-widest text-xs text-center">All Systems Operational</p>
                        </div>
                      ) : (
                        <div className="space-y-4 text-sm">
                          {logs.filter(l => l.type === 'issue').map(log => (
                            <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                              <div>
                                <p className="font-black text-slate-900">{log.title}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{log.description}</p>
                              </div>
                              <Badge className="bg-purple-100 text-purple-600 border-none font-black text-[9px] uppercase">{log.priority}</Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-sm">
                    <CardHeader className="p-10 border-b border-slate-50">
                      <CardTitle className="text-2xl font-black text-slate-900">User Inquiries</CardTitle>
                    </CardHeader>
                    <CardContent className="p-10">
                      {logs.filter(l => l.type === 'request').length === 0 ? (
                        <div className="text-center py-10">
                          <MessageSquare className="h-12 w-12 text-slate-100 mx-auto mb-4" />
                          <p className="font-bold text-slate-400 uppercase tracking-widest text-xs text-center">Inbox Clean</p>
                        </div>
                      ) : (
                        <div className="space-y-4 text-sm">
                          {logs.filter(l => l.type === 'request').map(log => (
                            <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                              <div>
                                <p className="font-black text-slate-900">{log.title}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{new Date(log.created_at).toLocaleDateString()}</p>
                              </div>
                              <Button size="sm" variant="ghost" className="text-xs font-black text-purple-600">Review</Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-sm">
                   <CardHeader className="p-10 border-b border-slate-50">
                      <CardTitle className="text-2xl font-black text-slate-900">Operational Thresholds</CardTitle>
                   </CardHeader>
                   <CardContent className="p-10">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         {[
                           { label: "Max Mentors", value: "500", icon: UserCheck },
                           { label: "Storage Capacity", value: "100GB", icon: Database },
                           { label: "Daily Throughput", value: "100k", icon: Cpu },
                         ].map((limit, i) => (
                           <div key={i} className="flex items-center gap-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                              <div className="p-3 rounded-2xl bg-purple-100 text-purple-600">
                                 <limit.icon className="h-6 w-6" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{limit.label}</p>
                                 <p className="text-xl font-black text-slate-900">{limit.value}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </CardContent>
                </Card>
              </div>
            )}
          </div>

        </main>

        {/* Launch Modal */}
        <Dialog open={isLaunchModalOpen} onOpenChange={setIsLaunchModalOpen}>
          <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
            <div className="bg-purple-600 p-10 text-white">
              <DialogTitle className="text-3xl font-black tracking-tighter capitalize">Launch {launchType}</DialogTitle>
              <DialogDescription className="text-purple-100 font-medium mt-2">
                Create and publish new {launchType} content for all users.
              </DialogDescription>
            </div>
            <div className="p-10 space-y-6 bg-white">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title</label>
                <Input 
                  placeholder={`Enter ${launchType} title`} 
                  value={launchData.title}
                  onChange={(e) => setLaunchData({ ...launchData, title: e.target.value })}
                  className="rounded-xl h-12 border-slate-100 focus-visible:ring-purple-600 font-bold" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                <Textarea 
                  placeholder="Details and insights..." 
                  value={launchData.desc}
                  onChange={(e) => setLaunchData({ ...launchData, desc: e.target.value })}
                  className="rounded-xl min-h-[120px] border-slate-100 focus-visible:ring-purple-600 font-medium" 
                />
              </div>
              {launchType !== 'blog' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pricing (INR)</label>
                  <Input 
                    type="number"
                    placeholder="e.g. 999" 
                    value={launchData.price}
                    onChange={(e) => setLaunchData({ ...launchData, price: e.target.value })}
                    className="rounded-xl h-12 border-slate-100 focus-visible:ring-purple-600 font-bold" 
                  />
                </div>
              )}
            </div>
            <DialogFooter className="p-10 pt-0 bg-white">
              <Button 
                variant="ghost" 
                onClick={() => setIsLaunchModalOpen(false)}
                className="rounded-xl h-12 font-bold text-slate-400"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleLaunchSubmit}
                disabled={isSubmitting}
                className="rounded-xl h-12 px-10 font-black bg-purple-600 text-white hover:bg-purple-700"
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Publish Live"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  )
}
