"use client"

import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { AdminGuard } from "@/components/admin-guard"
import { 
  Users, UserCheck, BarChart3, Activity, Database, DollarSign, ShieldCheck,
  Search, Check, X, Phone, Loader2, AlertCircle, Plus, BookOpen, FileText,
  Settings, HardDrive, MessageSquare, ChevronRight, TrendingUp, Cpu, Layers,
  LayoutDashboard, CheckCircle2, Rocket, Menu, School, Globe, MoreVertical,
  ExternalLink, ArrowLeft, Image as ImageIcon, Video, Trash2, Save, Eye,
  Type, Link as LinkIcon, List, Calendar, Tag, Shield, PieChart, Briefcase, GraduationCap
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

type EditorView = 'dashboard' | 'course-creator' | 'blog-creator' | 'test-creator' | 'roi-manager';

export default function AdminDashboard() {
  const [view, setView] = useState<EditorView>('dashboard')
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Data States
  const [users, setUsers] = useState<any[]>([])
  const [mentors, setMentors] = useState<any[]>([])
  const [colleges, setColleges] = useState<any[]>([])
  const [stats, setStats] = useState<any>({
    users: 0, mentors: 0, colleges: 0, revenue: 0
  })

  // ROI Form State (Renamed from Placement)
  const [roiForm, setRoiForm] = useState<any>({
    collegeId: '', year: '2025', highest: '', average: '', median: '', 
    percentage: '', recruiters: '', 
    branches: [{ branch: 'CSE', avg: '', median: '', max: '' }]
  })

  const supabase = createClient()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const { data: userData } = await supabase.from('profiles').select('*')
      const { data: mentorData } = await supabase.from('profiles').select('*').eq('role', 'mentor')
      const { data: collegeData } = await supabase.from('colleges').select('id, name, city, state').order('name')
      const { data: paymentData } = await supabase.from('payments').select('amount')
      
      const totalRevenue = paymentData?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0

      setUsers(userData || [])
      setMentors(mentorData || [])
      setColleges(collegeData || [])
      setStats({ 
        users: userData?.length || 0, 
        mentors: mentorData?.length || 0, 
        colleges: collegeData?.length || 0,
        revenue: totalRevenue
      })
    } catch (error) {
      console.error("Admin Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const saveROIData = async () => {
    if (!roiForm.collegeId || !roiForm.average) {
      toast.error("Required fields missing")
      return
    }
    
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('placement_reports').upsert({
        college_id: roiForm.collegeId,
        year: Number(roiForm.year),
        highest_package: Number(roiForm.highest),
        average_package: Number(roiForm.average),
        median_package: Number(roiForm.median),
        placement_percentage: Number(roiForm.percentage),
        top_recruiters: roiForm.recruiters.split(',').map((r: string) => r.trim()),
        branch_stats: roiForm.branches,
        is_published: true
      })
      if (error) throw error
      toast.success("Institute ROI Analysis Published!")
      setView('dashboard')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setIsSubmitting(false)
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
          <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Counseling Master</p>
        </div>
      </div>

      <nav className="space-y-1.5 flex-1">
        {[
          { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'users', label: 'Identity Hub', icon: Users },
          { id: 'colleges', label: 'Institute Data', icon: School },
          { id: 'roi', label: 'ROI Analytics', icon: GraduationCap },
          { id: 'content', label: 'Launch Pad', icon: Rocket },
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
        <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1 text-center italic">Verified Owner</p>
      </div>
    </div>
  )

  if (view === 'roi-manager') {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-white text-black p-6 md:p-12">
           <div className="max-w-4xl mx-auto">
              <header className="flex justify-between items-center mb-12">
                 <div className="flex items-center gap-6">
                    <Button variant="ghost" size="icon" onClick={() => setView('dashboard')} className="rounded-full bg-slate-50 h-12 w-12"><ArrowLeft /></Button>
                    <div>
                       <h1 className="text-3xl font-black tracking-tighter">Institute ROI & Outcome Manager</h1>
                       <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Providing Students with Career ROI Insights</p>
                    </div>
                 </div>
                 <Button onClick={saveROIData} disabled={isSubmitting} className="rounded-2xl h-14 px-10 font-black bg-purple-600 text-white shadow-xl shadow-purple-200">
                    {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : <><Save className="mr-2 h-4 w-4" /> Save ROI Data</>}
                 </Button>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Card className="rounded-[2.5rem] border-slate-100 p-8 space-y-6 shadow-sm">
                    <h3 className="text-lg font-black flex items-center gap-2"><School className="h-5 w-5 text-purple-600" /> Choose Institute</h3>
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400">Target College</label>
                          <Select onValueChange={(v) => setRoiForm({ ...roiForm, collegeId: v })}>
                             <SelectTrigger className="h-12 rounded-xl border-slate-100 font-bold">
                                <SelectValue placeholder="Search NIT/IIIT/Univ..." />
                             </SelectTrigger>
                             <SelectContent className="max-h-80">
                                {colleges.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                             </SelectContent>
                          </Select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400">Academic Batch Year</label>
                          <Input value={roiForm.year} onChange={(e) => setRoiForm({ ...roiForm, year: e.target.value })} className="h-12 rounded-xl border-slate-100 font-black" />
                       </div>
                    </div>
                 </Card>

                 <Card className="rounded-[2.5rem] border-slate-100 p-8 space-y-6 shadow-sm">
                    <h3 className="text-lg font-black flex items-center gap-2"><DollarSign className="h-5 w-5 text-purple-600" /> Career Outcome Metrics (LPA)</h3>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400">Highest Salary</label>
                          <Input value={roiForm.highest} onChange={(e) => setRoiForm({ ...roiForm, highest: e.target.value })} className="h-12 rounded-xl border-slate-100 font-black" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400">Avg Package</label>
                          <Input value={roiForm.average} onChange={(e) => setRoiForm({ ...roiForm, average: e.target.value })} className="h-12 rounded-xl border-slate-100 font-black" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400">Median Package</label>
                          <Input value={roiForm.median} onChange={(e) => setRoiForm({ ...roiForm, median: e.target.value })} className="h-12 rounded-xl border-slate-100 font-black" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400">Success Rate %</label>
                          <Input value={roiForm.percentage} onChange={(e) => setRoiForm({ ...roiForm, percentage: e.target.value })} className="h-12 rounded-xl border-slate-100 font-black" />
                       </div>
                    </div>
                 </Card>

                 <Card className="rounded-[2.5rem] border-slate-100 p-8 space-y-6 shadow-sm md:col-span-2">
                    <div className="flex justify-between items-center">
                       <h3 className="text-lg font-black flex items-center gap-2"><Layers className="h-5 w-5 text-purple-600" /> Specialization Analysis</h3>
                       <Button variant="ghost" size="sm" onClick={() => setRoiForm({ ...roiForm, branches: [...roiForm.branches, { branch: '', avg: '', median: '', max: '' }] })} className="font-black text-purple-600 text-[10px] uppercase">+ Add Branch</Button>
                    </div>
                    <div className="space-y-3">
                       {roiForm.branches.map((b: any, i: number) => (
                         <div key={i} className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl">
                            <Input placeholder="Branch" value={b.branch} onChange={(e) => {
                               const nb = [...roiForm.branches]; nb[i].branch = e.target.value; setRoiForm({ ...roiForm, branches: nb });
                            }} className="h-10 border-none font-bold text-xs" />
                            <Input placeholder="Avg" value={b.avg} onChange={(e) => {
                               const nb = [...roiForm.branches]; nb[i].avg = e.target.value; setRoiForm({ ...roiForm, branches: nb });
                            }} className="h-10 border-none font-bold text-xs" />
                            <Input placeholder="Median" value={b.median} onChange={(e) => {
                               const nb = [...roiForm.branches]; nb[i].median = e.target.value; setRoiForm({ ...roiForm, branches: nb });
                            }} className="h-10 border-none font-bold text-xs" />
                            <Button variant="ghost" size="icon" onClick={() => {
                               const nb = [...roiForm.branches]; nb.splice(i, 1); setRoiForm({ ...roiForm, branches: nb });
                            }} className="text-red-400"><Trash2 className="h-4 w-4" /></Button>
                         </div>
                       ))}
                    </div>
                 </Card>

                 <Card className="rounded-[2.5rem] border-slate-100 p-8 space-y-4 shadow-sm md:col-span-2">
                    <h3 className="text-lg font-black flex items-center gap-2"><PieChart className="h-5 w-5 text-purple-600" /> Partner Companies</h3>
                    <Textarea value={roiForm.recruiters} onChange={(e) => setRoiForm({ ...roiForm, recruiters: e.target.value })} placeholder="Companies hiring from this institute (Comma separated)" className="rounded-2xl min-h-[100px] border-slate-100 font-medium" />
                 </Card>
              </div>
           </div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50 text-black font-sans flex flex-col lg:flex-row">
        
        {/* Sidebar */}
        <aside className="w-72 border-r border-slate-200 bg-white hidden lg:flex flex-col p-8 fixed h-full z-10">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 p-6 md:p-12 min-h-screen">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 text-slate-900 capitalize">{activeTab.replace('-', ' ')}</h1>
              <Badge className="bg-purple-50 text-purple-600 border-none font-black text-[10px] uppercase px-3">Master Auth Enabled</Badge>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
               <Button onClick={() => setView('roi-manager')} className="flex-1 md:flex-none rounded-2xl h-14 px-8 font-black bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 shadow-sm transition-all">
                  <GraduationCap className="mr-2 h-5 w-5" /> Manage ROI Data
               </Button>
               <Button onClick={() => fetchData()} className="rounded-2xl h-14 w-14 bg-white border border-slate-200 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-slate-400" />
               </Button>
            </div>
          </header>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-12">
            <TabsContent value="overview" className="m-0 space-y-12">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Gross Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Active Profiles", value: stats.users, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Expert Network", value: stats.mentors, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Institutes", value: stats.colleges, icon: School, color: "text-orange-600", bg: "bg-orange-50" },
                  ].map((stat, i) => (
                    <Card key={i} className="bg-white border-none rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all">
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

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card className="lg:col-span-2 bg-white border-none rounded-[3rem] shadow-sm p-10">
                     <div className="flex justify-between items-center mb-10">
                        <h3 className="text-2xl font-black flex items-center gap-3"><GraduationCap className="h-7 w-7 text-purple-600" /> Career ROI Monitoring</h3>
                        <Button variant="ghost" onClick={() => setView('roi-manager')} className="font-black text-xs text-purple-600">Update Analytics</Button>
                     </div>
                     <div className="space-y-6">
                        <p className="text-slate-500 font-medium max-w-lg">Analyze detailed success reports for Top 100 NITs, IIITs, and private universities. Track batch-wise outcomes and median salary trends to help students make informed decisions.</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                           <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Success Batch</p>
                              <p className="text-xl font-black text-slate-900">2025</p>
                           </div>
                           <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Max Outcome</p>
                              <p className="text-xl font-black text-emerald-500">1.2 CR</p>
                           </div>
                           <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg ROI Score</p>
                              <p className="text-xl font-black text-purple-600">High</p>
                           </div>
                        </div>
                     </div>
                  </Card>

                  <Card className="bg-white border-none rounded-[3rem] shadow-sm p-10 flex flex-col justify-center items-center text-center">
                     <div className="h-20 w-20 bg-purple-50 text-purple-600 rounded-[2rem] flex items-center justify-center mb-6">
                        <TrendingUp className="h-10 w-10" />
                     </div>
                     <h3 className="text-2xl font-black mb-2">College ROI Insights</h3>
                     <p className="text-slate-400 font-medium mb-8 text-sm">Provide students with accurate salary expectations vs tuition fees for every college.</p>
                     <Button className="w-full rounded-2xl h-14 font-black bg-purple-600 text-white">Update Insights</Button>
                  </Card>
               </div>
            </TabsContent>

            {/* Other tabs like users, colleges... */}
            {activeTab === 'roi' && (
               <div className="space-y-8">
                  <div className="flex justify-between items-center">
                     <h2 className="text-2xl font-black">Institute ROI Reports</h2>
                     <Button className="rounded-2xl h-12 px-8 font-black bg-purple-600 text-white" onClick={() => setView('roi-manager')}>+ New Batch Report</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {colleges.slice(0, 6).map(c => (
                        <Card key={c.id} className="bg-white border-none rounded-[2.5rem] p-8 shadow-sm">
                           <h3 className="font-black text-lg mb-2">{c.name}</h3>
                           <div className="flex justify-between text-sm font-bold text-slate-500 mb-4">
                              <span>Batch 2025</span>
                              <span className="text-emerald-500">18.5 LPA Avg</span>
                           </div>
                           <Button variant="outline" className="w-full rounded-xl font-black text-xs border-slate-100 h-10">Edit Report</Button>
                        </Card>
                     ))}
                  </div>
               </div>
            )}
          </Tabs>

        </main>
      </div>
    </AdminGuard>
  )
}
