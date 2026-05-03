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
  Rocket
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { toast } from "sonner"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [users, setUsers] = useState<any[] | undefined>(undefined)
  const [mentors, setMentors] = useState<any[] | undefined>(undefined)
  const [stats, setStats] = useState<any | undefined>(undefined)
  const [logs, setLogs] = useState<any[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  
  const supabase = createClient()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const { data: userData } = await supabase.from('profiles').select('*')
      const { data: mentorData } = await supabase.from('profiles').select('*').eq('role', 'mentor')
      const { data: logData } = await supabase.from('system_logs').select('*').order('created_at', { ascending: false })
      
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      const { count: mentorCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'mentor')
      const { data: paymentData } = await supabase.from('payments').select('amount')
      
      const totalRevenue = paymentData?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0

      setUsers(userData || [])
      setMentors(mentorData || [])
      setLogs(logData || [])
      setStats({ 
        users: userCount, 
        mentors: mentorCount, 
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

  if (isLoading) {
    return (
      <AdminGuard>
        <div className="h-screen flex flex-col items-center justify-center bg-white text-black">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
          <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Accessing Command Center...</p>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50 text-black font-sans flex">
        
        {/* Sidebar */}
        <aside className="w-72 border-r border-slate-200 bg-white hidden lg:flex flex-col p-8 fixed h-full shadow-sm z-10">
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
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
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
            <div className="flex items-center gap-3 mb-4">
               <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live System</p>
            </div>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              White & Purple Edition. Optimized for Clarity.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 p-8 lg:p-12">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
            <div>
              <h1 className="text-4xl font-black tracking-tighter mb-2 text-slate-900 capitalize">{activeTab.replace('-', ' ')}</h1>
              <p className="text-slate-500 font-medium">Platform Management Dashboard</p>
            </div>
            <div className="flex gap-3">
               <Button className="rounded-2xl h-12 px-8 font-black bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-100">
                  <Plus className="mr-2 h-4 w-4" /> Global Action
               </Button>
            </div>
          </header>

          {activeTab === 'overview' && (
            <div className="space-y-12">
              {/* Top Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50", trend: "+14%" },
                  { label: "Total Users", value: stats.users, icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "+8%" },
                  { label: "Mentors", value: stats.mentors, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+12%" },
                  { label: "Sessions", value: stats.activeSessions, icon: Activity, color: "text-orange-600", bg: "bg-orange-50", trend: "+22%" },
                ].map((stat, i) => (
                  <Card key={i} className="bg-white border-slate-100 rounded-[2.5rem] overflow-hidden group hover:shadow-xl hover:shadow-purple-500/5 transition-all">
                    <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-colors`}>
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

              {/* Middle Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 bg-white border-slate-100 rounded-[2.5rem] shadow-sm">
                  <CardHeader className="p-10">
                    <CardTitle className="text-2xl font-black flex items-center gap-3 text-slate-900">
                      <TrendingUp className="h-6 w-6 text-purple-600" /> Platform Insights
                    </CardTitle>
                    <CardDescription className="text-slate-400 font-medium">Analytical growth monitoring.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-10 pt-0 h-64 flex items-center justify-center border-t border-slate-50">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 text-slate-100 mx-auto mb-4" />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Visualizing trends...</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-sm">
                  <CardHeader className="p-10">
                    <CardTitle className="text-2xl font-black flex items-center gap-3 text-slate-900">
                      <HardDrive className="h-6 w-6 text-purple-600" /> Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-10 pt-0 space-y-8">
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
                        <p className="text-sm font-black text-emerald-500">Stable</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Requests</p>
                        <p className="text-sm font-black text-slate-900">2.4k/m</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
               <CardHeader className="p-10 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-black text-slate-900">User Directory</CardTitle>
                    <p className="text-slate-500 font-medium text-sm mt-1">Manage all registered accounts.</p>
                  </div>
                  <div className="relative w-full max-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search records..." className="bg-slate-50 border-slate-100 pl-11 rounded-xl h-12 text-black" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50/50">
                        <tr>
                          <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                          <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                          <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Joined</th>
                          <th className="px-10 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Manage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {users?.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                                   {user.name?.[0] || 'U'}
                                </div>
                                <div>
                                  <p className="font-black text-sm text-slate-900">{user.name || "Anonymous"}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-6">
                               <Badge className={`${user.role === 'mentor' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'} border-none font-black text-[9px] uppercase px-2`}>
                                  {user.role}
                               </Badge>
                            </td>
                            <td className="px-10 py-6 text-sm text-slate-400 font-bold">
                              {new Date(user.created_at).toLocaleDateString()}
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
                <CardHeader className="p-10 border-b border-slate-50">
                  <CardTitle className="text-2xl font-black text-slate-900">Expert Verification</CardTitle>
                  <p className="text-slate-400 font-medium text-sm mt-1">Process mentor applications.</p>
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
                        <tbody className="divide-y divide-slate-50">
                          {mentors?.map((mentor) => (
                            <tr key={mentor.id} className="hover:bg-slate-50/30 transition-colors">
                               <td className="px-10 py-6">
                                  <div className="flex items-center gap-4">
                                     <div className="h-12 w-12 rounded-2xl bg-slate-50 overflow-hidden">
                                        {mentor.image && <img src={mentor.image} alt="" className="h-full w-full object-cover" />}
                                     </div>
                                     <div>
                                        <p className="font-black text-slate-900">{mentor.name}</p>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{mentor.college || 'No Data'}</p>
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
                                    <Button onClick={() => approveMentor(mentor.id)} className="bg-purple-600 text-white font-black rounded-xl">Approve Expert</Button>
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
                <Card className="bg-white border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all">
                   <div className="h-20 w-20 bg-purple-50 text-purple-600 rounded-[2rem] flex items-center justify-center mb-6">
                      <BookOpen className="h-10 w-10" />
                   </div>
                   <h3 className="text-2xl font-black mb-2 text-slate-900">Launch Course</h3>
                   <p className="text-slate-400 font-medium mb-8 text-sm">Deploy a new academic course.</p>
                   <Button className="w-full rounded-2xl h-14 font-black bg-purple-600 text-white hover:bg-purple-700">Deploy Now</Button>
                </Card>

                <Card className="bg-white border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all">
                   <div className="h-20 w-20 bg-purple-50 text-purple-600 rounded-[2rem] flex items-center justify-center mb-6">
                      <FileText className="h-10 w-10" />
                   </div>
                   <h3 className="text-2xl font-black mb-2 text-slate-900">Test Series</h3>
                   <p className="text-slate-400 font-medium mb-8 text-sm">Release specialized mock tests.</p>
                   <Button className="w-full rounded-2xl h-14 font-black bg-black text-white hover:bg-slate-800">Launch Series</Button>
                </Card>

                <Card className="bg-white border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all">
                   <div className="h-20 w-20 bg-purple-50 text-purple-600 rounded-[2rem] flex items-center justify-center mb-6">
                      <MessageSquare className="h-10 w-10" />
                   </div>
                   <h3 className="text-2xl font-black mb-2 text-slate-900">Post Blog</h3>
                   <p className="text-slate-400 font-medium mb-8 text-sm">Publish a new bong/article.</p>
                   <Button className="w-full rounded-2xl h-14 font-black border-2 border-purple-600 text-purple-600 hover:bg-purple-50">Write Content</Button>
                </Card>
             </div>
          )}

          {activeTab === 'health' && (
             <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-sm">
                      <CardHeader className="p-10 border-b border-slate-50">
                         <CardTitle className="text-2xl font-black text-slate-900">Issue Tracker</CardTitle>
                         <p className="text-slate-400 font-medium text-sm mt-1">Technical monitoring.</p>
                      </CardHeader>
                      <CardContent className="p-10">
                         {logs?.filter(l => l.type === 'issue').length === 0 ? (
                           <div className="text-center py-10">
                              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                              <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">System Healthy</p>
                           </div>
                         ) : (
                           <div className="space-y-4">
                              {logs?.filter(l => l.type === 'issue').map(log => (
                                <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                                   <div>
                                      <p className="font-black text-slate-900">{log.title}</p>
                                      <p className="text-xs text-slate-400">{log.description}</p>
                                   </div>
                                   <Badge className="bg-purple-100 text-purple-600 border-none text-[9px] uppercase font-black">{log.priority}</Badge>
                                </div>
                              ))}
                           </div>
                         )}
                      </CardContent>
                   </Card>

                   <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-sm">
                      <CardHeader className="p-10 border-b border-slate-50">
                         <CardTitle className="text-2xl font-black text-slate-900">Requests</CardTitle>
                         <p className="text-slate-400 font-medium text-sm mt-1">Incoming inquiries.</p>
                      </CardHeader>
                      <CardContent className="p-10">
                         {logs?.filter(l => l.type === 'request').length === 0 ? (
                           <div className="text-center py-10">
                              <AlertCircle className="h-12 w-12 text-purple-200 mx-auto mb-4" />
                              <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">No pending requests</p>
                           </div>
                         ) : (
                           <div className="space-y-4">
                              {logs?.filter(l => l.type === 'request').map(log => (
                                <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                                   <div>
                                      <p className="font-black text-slate-900">{log.title}</p>
                                      <p className="text-xs text-slate-400">{new Date(log.created_at).toLocaleDateString()}</p>
                                   </div>
                                   <Button size="sm" variant="outline" className="rounded-xl border-slate-200 text-xs font-black">Review</Button>
                                </div>
                              ))}
                           </div>
                         )}
                      </CardContent>
                   </Card>
                </div>

                <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-sm">
                   <CardHeader className="p-10 border-b border-slate-50">
                      <CardTitle className="text-2xl font-black text-slate-900">System Limits</CardTitle>
                      <p className="text-slate-400 font-medium text-sm mt-1">Operational thresholds.</p>
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

        </main>
      </div>
    </AdminGuard>
  )
}
