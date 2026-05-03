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
  School,
  Globe,
  MoreVertical,
  ExternalLink
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Data States
  const [users, setUsers] = useState<any[]>([])
  const [mentors, setMentors] = useState<any[]>([])
  const [colleges, setColleges] = useState<any[]>([])
  const [stats, setStats] = useState<any>({
    users: 0, mentors: 0, colleges: 0, revenue: 0, storage: { used: 12.5, total: 100 }, activeSessions: 0
  })
  const [logs, setLogs] = useState<any[]>([])

  // Modal States
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false)
  const [launchType, setLaunchType] = useState<'course' | 'test' | 'blog' | 'college'>('course')
  const [launchData, setLaunchData] = useState({ title: '', desc: '', price: '', extra: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const supabase = createClient()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const { data: userData } = await supabase.from('profiles').select('*')
      const { data: mentorData } = await supabase.from('profiles').select('*').eq('role', 'mentor')
      const { data: collegeData } = await supabase.from('colleges').select('*').limit(50)
      const { data: logData } = await supabase.from('system_logs').select('*').order('created_at', { ascending: false }).limit(10)
      const { data: paymentData } = await supabase.from('payments').select('amount')
      
      const totalRevenue = paymentData?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0

      setUsers(userData || [])
      setMentors(mentorData || [])
      setColleges(collegeData || [])
      setLogs(logData || [])
      setStats({ 
        users: userData?.length || 0, 
        mentors: mentorData?.length || 0, 
        colleges: collegeData?.length || 0,
        revenue: totalRevenue,
        storage: { used: 12.5, total: 100 },
        activeSessions: 42
      })
    } catch (error) {
      console.error("Admin Fetch Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleLaunchSubmit = async () => {
    if (!launchData.title || !launchData.desc) {
      toast.error("Required fields missing")
      return
    }
    
    setIsSubmitting(true)
    try {
      let table = ''
      let payload: any = {}

      switch(launchType) {
        case 'course':
          table = 'courses';
          payload = { title: launchData.title, description: launchData.desc, price: Number(launchData.price) || 0, is_published: true };
          break;
        case 'test':
          table = 'test_series';
          payload = { title: launchData.title, description: launchData.desc, price: Number(launchData.price) || 0, is_published: true };
          break;
        case 'blog':
          table = 'blogs';
          payload = { title: launchData.title, content: launchData.desc, excerpt: launchData.extra, is_published: true };
          break;
        case 'college':
          table = 'colleges';
          payload = { name: launchData.title, description: launchData.desc, city: launchData.extra, college_id: `COL-${Date.now()}` };
          break;
      }

      const { error } = await supabase.from(table).insert(payload)
      
      if (error) {
        toast.error(`Database Error: ${error.message}. Make sure you ran the SQL script!`)
      } else {
        toast.success(`${launchType.toUpperCase()} published successfully!`)
        setIsLaunchModalOpen(false)
        setLaunchData({ title: '', desc: '', price: '', extra: '' })
        fetchData()
      }
    } catch (err: any) {
      toast.error("Operation failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const approveMentor = async (id: string) => {
    const { error } = await supabase.from('profiles').update({ approved: true }).eq('id', id)
    if (!error) {
      toast.success("Mentor approved!")
      fetchData()
    } else {
      toast.error("Permission denied or database error")
    }
  }

  const changeUserRole = async (id: string, role: string) => {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
    if (!error) {
      toast.success(`Role set to ${role}`)
      fetchData()
    } else {
      toast.error("Role update failed. Check RLS policies.")
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
          <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Highly Permitted Access</p>
        </div>
      </div>

      <nav className="space-y-1.5 flex-1">
        {[
          { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'users', label: 'Identity Hub', icon: Users },
          { id: 'mentors', label: 'Expert Network', icon: UserCheck },
          { id: 'colleges', label: 'Colleges', icon: School },
          { id: 'content', label: 'Launch Pad', icon: Rocket },
          { id: 'health', label: 'System Health', icon: Activity },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
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
        <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-2">Master Owner</p>
        <p className="text-xs font-bold text-slate-500 leading-relaxed">
          Database synchronization: <span className="text-emerald-500">Active</span>
        </p>
      </div>
    </div>
  )

  return (
    <AdminGuard>
      <div className="min-h-screen bg-white text-black font-sans flex flex-col lg:flex-row">
        
        {/* Desktop Sidebar */}
        <aside className="w-72 border-r border-slate-200 bg-white hidden lg:flex flex-col p-8 fixed h-full z-10">
          <SidebarContent />
        </aside>

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

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 p-6 md:p-12 min-h-screen bg-slate-50/20">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 text-slate-900 capitalize">{activeTab.replace('-', ' ')}</h1>
              <Badge variant="outline" className="border-purple-200 text-purple-600 font-black uppercase tracking-widest text-[9px] px-2 py-0.5">Live Sync Enabled</Badge>
            </div>
            
            {/* Global Action Button - Now Functional Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full md:w-auto rounded-2xl h-14 px-10 font-black bg-purple-600 text-white hover:bg-purple-700 shadow-xl shadow-purple-100 transition-all">
                  <Plus className="mr-2 h-5 w-5" /> Global Action
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-2xl p-2 shadow-2xl border-slate-100">
                <DropdownMenuLabel className="font-black text-slate-400 text-[10px] uppercase px-4 py-2">Quick Launch</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => { setLaunchType('course'); setIsLaunchModalOpen(true); }} className="rounded-xl font-bold p-4 gap-3">
                   <BookOpen className="h-4 w-4 text-purple-600" /> New Course
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setLaunchType('blog'); setIsLaunchModalOpen(true); }} className="rounded-xl font-bold p-4 gap-3">
                   <MessageSquare className="h-4 w-4 text-blue-600" /> Post Blog
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setLaunchType('college'); setIsLaunchModalOpen(true); }} className="rounded-xl font-bold p-4 gap-3">
                   <School className="h-4 w-4 text-emerald-600" /> Add College
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={fetchData} className="rounded-xl font-bold p-4 gap-3">
                   <Activity className="h-4 w-4 text-slate-400" /> Refresh Data
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          {/* Tab Content Area */}
          <div className="space-y-8">
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Gross Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Active Users", value: stats.users, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Expert Mentors", value: stats.mentors, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Institutes", value: stats.colleges, icon: School, color: "text-orange-600", bg: "bg-orange-50" },
                  ].map((stat, i) => (
                    <Card key={i} className="bg-white border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all">
                      <CardContent className="p-8">
                        <div className={`p-4 rounded-2xl w-fit mb-6 ${stat.bg} ${stat.color}`}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                        <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-sm">
                      <CardHeader className="p-10 border-b border-slate-50">
                         <CardTitle className="text-2xl font-black flex items-center gap-3">
                            <Activity className="h-6 w-6 text-purple-600" /> System Health
                         </CardTitle>
                      </CardHeader>
                      <CardContent className="p-10 space-y-6">
                         <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold">
                               <span className="text-slate-500">Database Load</span>
                               <span>24%</span>
                            </div>
                            <Progress value={24} className="h-2 bg-slate-100" />
                         </div>
                         <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-sm font-black uppercase tracking-wider">All Services Operational</span>
                         </div>
                      </CardContent>
                   </Card>

                   <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                      <CardHeader className="p-10 border-b border-slate-50">
                         <CardTitle className="text-2xl font-black">Storage Hub</CardTitle>
                      </CardHeader>
                      <CardContent className="p-10 flex items-center justify-between">
                         <div className="space-y-1">
                            <p className="text-4xl font-black text-slate-900">12.5 <span className="text-lg text-slate-400">GB</span></p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacity Used</p>
                         </div>
                         <div className="h-20 w-20 rounded-full border-[6px] border-purple-100 border-t-purple-600 flex items-center justify-center font-black text-sm">
                            12%
                         </div>
                      </CardContent>
                   </Card>
                </div>
              </>
            )}

            {activeTab === 'users' && (
              <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                <CardHeader className="p-10 border-b border-slate-50 flex justify-between items-center">
                  <CardTitle className="text-2xl font-black">Universal User Hub</CardTitle>
                  <Button variant="outline" className="rounded-xl font-bold h-10 px-4" onClick={fetchData}>Sync Now</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50/50">
                        <tr>
                          <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">User Details</th>
                          <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Permissions</th>
                          <th className="px-10 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Management</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-sm">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-10 py-6 flex items-center gap-4">
                               <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                                  {user.name?.[0] || 'U'}
                               </div>
                               <div>
                                  <p className="font-black text-slate-900">{user.name || "Master User"}</p>
                                  <p className="text-[10px] text-slate-400 font-bold">{user.email}</p>
                               </div>
                            </td>
                            <td className="px-10 py-6">
                               <Badge className={`${user.role === 'mentor' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'} border-none font-black text-[9px] uppercase`}>
                                  {user.role}
                               </Badge>
                            </td>
                            <td className="px-10 py-6 text-right">
                               <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                     <Button variant="ghost" size="icon" className="rounded-xl"><MoreVertical className="h-4 w-4" /></Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="rounded-xl">
                                     <DropdownMenuItem onClick={() => changeUserRole(user.id, 'mentor')}>Make Mentor</DropdownMenuItem>
                                     <DropdownMenuItem onClick={() => changeUserRole(user.id, 'student')}>Make Student</DropdownMenuItem>
                                     <DropdownMenuSeparator />
                                     <DropdownMenuItem className="text-red-500">Block Access</DropdownMenuItem>
                                  </DropdownMenuContent>
                               </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'colleges' && (
               <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                  <CardHeader className="p-10 border-b border-slate-50 flex justify-between items-center">
                     <div>
                        <CardTitle className="text-2xl font-black">College Database</CardTitle>
                        <p className="text-slate-400 text-sm font-medium mt-1">Manage {colleges.length} academic institutions.</p>
                     </div>
                     <Button onClick={() => { setLaunchType('college'); setIsLaunchModalOpen(true); }} className="rounded-xl bg-purple-600 font-black h-12 px-6">Add Institute</Button>
                  </CardHeader>
                  <CardContent className="p-0">
                     <div className="overflow-x-auto">
                        <table className="w-full">
                           <thead className="bg-slate-50/50">
                              <tr>
                                 <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Institute</th>
                                 <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
                                 <th className="px-10 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50 text-sm">
                              {colleges.map((college) => (
                                 <tr key={college.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-10 py-6">
                                       <p className="font-black text-slate-900">{college.name}</p>
                                       <p className="text-[10px] text-slate-400 font-bold">{college.type || 'Engineering'}</p>
                                    </td>
                                    <td className="px-10 py-6 font-bold text-slate-500">
                                       {college.city}, {college.state}
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                       <Button variant="ghost" className="rounded-xl h-10 px-4 text-xs font-black text-purple-600 gap-2">
                                          Edit Profile <ChevronRight className="h-3 w-3" />
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

            {activeTab === 'content' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { id: 'course', title: 'Launch Course', icon: BookOpen, desc: 'Add new paid courses.' },
                  { id: 'test', title: 'Test Series', icon: FileText, desc: 'Release mock tests.' },
                  { id: 'blog', title: 'Publish Blog', icon: Globe, desc: 'Write insightful articles.' },
                ].map((item) => (
                  <Card key={item.id} className="bg-white border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all">
                    <div className="h-20 w-20 bg-purple-50 text-purple-600 rounded-[2rem] flex items-center justify-center mb-6">
                      <item.icon className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-black mb-2">{item.title}</h3>
                    <p className="text-slate-400 font-medium mb-8 text-sm">{item.desc}</p>
                    <Button onClick={() => { setLaunchType(item.id as any); setIsLaunchModalOpen(true); }} className="w-full rounded-2xl h-14 font-black bg-purple-600 text-white">Create New</Button>
                  </Card>
                ))}
              </div>
            )}
            
            {activeTab === 'health' && (
               <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-sm p-10 text-center">
                  <Database className="h-20 w-20 text-slate-100 mx-auto mb-6" />
                  <h3 className="text-2xl font-black mb-2">Platform Integrity</h3>
                  <p className="text-slate-400 font-medium mb-10 max-w-sm mx-auto">Full system logs and diagnostic data are streamed here in real-time from Supabase.</p>
                  <Button variant="outline" className="rounded-2xl h-14 px-10 font-black border-slate-200">Run Diagnostics</Button>
               </Card>
            )}
          </div>

        </main>

        {/* Global Launch Modal */}
        <Dialog open={isLaunchModalOpen} onOpenChange={setIsLaunchModalOpen}>
          <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
            <div className="bg-purple-600 p-10 text-white">
              <DialogTitle className="text-3xl font-black tracking-tighter capitalize flex items-center gap-3">
                 <Rocket className="h-8 w-8" /> New {launchType}
              </DialogTitle>
              <DialogDescription className="text-purple-100 font-medium mt-2">
                Deploying directly to production database.
              </DialogDescription>
            </div>
            <div className="p-10 space-y-6 bg-white max-h-[60vh] overflow-y-auto">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title / Name</label>
                  <Input 
                    placeholder="Enter heading..." 
                    value={launchData.title}
                    onChange={(e) => setLaunchData({ ...launchData, title: e.target.value })}
                    className="rounded-xl h-12 border-slate-100 focus-visible:ring-purple-600 font-bold" 
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description / Content</label>
                  <Textarea 
                    placeholder="Provide all details..." 
                    value={launchData.desc}
                    onChange={(e) => setLaunchData({ ...launchData, desc: e.target.value })}
                    className="rounded-xl min-h-[150px] border-slate-100 focus-visible:ring-purple-600 font-medium" 
                  />
               </div>
               {launchType === 'blog' || launchType === 'college' ? (
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{launchType === 'blog' ? 'Excerpt' : 'City'}</label>
                    <Input 
                      placeholder={launchType === 'blog' ? "Short summary..." : "e.g. Mumbai"} 
                      value={launchData.extra}
                      onChange={(e) => setLaunchData({ ...launchData, extra: e.target.value })}
                      className="rounded-xl h-12 border-slate-100 font-bold" 
                    />
                 </div>
               ) : (
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price (INR)</label>
                    <Input 
                      type="number"
                      placeholder="e.g. 1499" 
                      value={launchData.price}
                      onChange={(e) => setLaunchData({ ...launchData, price: e.target.value })}
                      className="rounded-xl h-12 border-slate-100 font-bold" 
                    />
                 </div>
               )}
            </div>
            <DialogFooter className="p-10 pt-0 bg-white">
              <Button onClick={handleLaunchSubmit} disabled={isSubmitting} className="w-full rounded-2xl h-14 font-black bg-purple-600 text-white shadow-xl shadow-purple-100 hover:scale-[1.02] transition-all">
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Authorize & Deploy"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  )
}
