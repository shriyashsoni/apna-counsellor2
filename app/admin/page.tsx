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
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[] | undefined>(undefined)
  const [mentors, setMentors] = useState<any[] | undefined>(undefined)
  const [stats, setStats] = useState<any | undefined>(undefined)
  const [payments, setPayments] = useState<any[] | undefined>(undefined)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const supabase = createClient()

  const fetchData = async () => {
    setIsRefreshing(true)
    const { data: userData } = await supabase.from('profiles').select('*')
    const { data: mentorData } = await supabase.from('profiles').select('*').eq('role', 'mentor')
    const { data: paymentData } = await supabase.from('payments').select('*').order('created_at', { ascending: false }).limit(10)
    
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    const { count: collegeCount } = await supabase.from('colleges').select('*', { count: 'exact', head: true })
    const { count: mentorCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'mentor')

    setUsers(userData || [])
    setMentors(mentorData || [])
    setPayments(paymentData || [])
    setStats({ users: userCount, colleges: collegeCount, mentors: mentorCount, revenue: 0 })
    setIsRefreshing(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const approveMentor = async (id: string) => {
    const { error } = await supabase.from('profiles').update({ approved: true }).eq('id', id)
    if (!error) fetchData()
  }

  const isLoading = users === undefined || mentors === undefined || stats === undefined
  const pendingMentors = mentors?.filter(m => !m.approved) || []

  // Color map for Tailwind safety
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-500",
    purple: "bg-purple-500/10 text-purple-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    orange: "bg-orange-500/10 text-orange-500",
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Admin Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-[2.5rem] bg-primary flex items-center justify-center shadow-2xl shadow-primary/40">
                <ShieldCheck className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter mb-1">Command Center</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Apna Counsellor 2026 • Platform Admin</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-2xl border-slate-800 h-12 px-6 font-bold hover:bg-slate-900">
                <Database className="mr-2 h-4 w-4" /> Export DB
              </Button>
              <Button className="rounded-2xl h-12 px-8 font-black bg-white text-black hover:bg-slate-200">
                <Activity className="mr-2 h-4 w-4" /> System Health
              </Button>
            </div>
          </div>

          {/* Core Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Total Users", value: stats?.users || 0, icon: Users, color: "blue" },
              { label: "Total Mentors", value: stats?.mentors || 0, icon: UserCheck, color: "purple" },
              { label: "Revenue", value: `₹${stats?.revenue || 0}`, icon: DollarSign, color: "emerald" },
              { label: "Colleges", value: stats?.colleges || 0, icon: Database, color: "orange" },
            ].map((stat, i) => (
              <Card key={stat.label} className="bg-slate-900 border-slate-800 rounded-[2rem] overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-4 rounded-2xl ${colorMap[stat.color]}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="border-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest">+12%</Badge>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-black">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="mentors" className="space-y-8">
            <TabsList className="bg-slate-900 border-slate-800 p-1.5 rounded-2xl h-14 w-full md:w-auto">
              <TabsTrigger value="mentors" className="rounded-xl px-8 font-black text-sm data-[state=active]:bg-primary">Mentor Approvals</TabsTrigger>
              <TabsTrigger value="users" className="rounded-xl px-8 font-black text-sm data-[state=active]:bg-primary">User Directory</TabsTrigger>
              <TabsTrigger value="payments" className="rounded-xl px-8 font-black text-sm data-[state=active]:bg-primary">Financials</TabsTrigger>
            </TabsList>

            <TabsContent value="mentors" className="space-y-6">
              <Card className="bg-slate-900 border-slate-800 rounded-[2.5rem]">
                <CardHeader className="p-10 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-black">Pending Verifications</CardTitle>
                    <p className="text-slate-500 font-medium text-sm mt-1">Review mentor profiles for platform approval.</p>
                  </div>
                  <div className="relative w-full max-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input placeholder="Search applicants..." className="bg-slate-950 border-slate-800 pl-11 rounded-xl h-12 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="py-20 text-center">
                      <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-slate-500 font-bold">Loading applications...</p>
                    </div>
                  ) : pendingMentors.length === 0 ? (
                    <div className="py-20 text-center">
                      <div className="h-20 w-20 bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="h-10 w-10 text-emerald-500" />
                      </div>
                      <p className="text-slate-500 font-bold">All applications have been processed.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-950/50">
                          <tr>
                            <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Applicant</th>
                            <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Expertise</th>
                            <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">College</th>
                            <th className="px-10 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {pendingMentors.map((mentor) => (
                            <tr key={mentor.id} className="hover:bg-slate-950/50 transition-colors">
                              <td className="px-10 py-6">
                                <div className="flex items-center gap-4">
                                  <div className="relative h-12 w-12 rounded-2xl overflow-hidden bg-slate-800">
                                    <Image 
                                      src={mentor.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.name}`} 
                                      alt={mentor.name || "Mentor"}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-black">{mentor.name || "Unknown"}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">{mentor.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-10 py-6">
                                <div className="flex flex-wrap gap-2">
                                  {(mentor.skills || []).slice(0, 2).map((s: string) => (
                                    <Badge key={s} className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase px-2">{s}</Badge>
                                  ))}
                                </div>
                              </td>
                              <td className="px-10 py-6">
                                <p className="text-sm font-black">{mentor.college || "Not Specified"}</p>
                                <p className="text-[10px] text-slate-500 uppercase font-black">{mentor.year || "N/A"} Year</p>
                              </td>
                              <td className="px-10 py-6 text-right space-x-3">
                                <Button size="sm" variant="ghost" className="h-10 w-10 p-0 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-500/10">
                                  <X className="h-5 w-5" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => approveMentor(mentor.id)}
                                  className="h-10 px-6 rounded-xl font-black bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                                >
                                  Approve
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="bg-slate-900 border-slate-800 rounded-[2.5rem]">
                <CardHeader className="p-10 border-b border-slate-800">
                  <CardTitle className="text-2xl font-black">User Directory</CardTitle>
                  <p className="text-slate-500 font-medium text-sm mt-1">Manage all registered students and mentors.</p>
                </CardHeader>
                <CardContent className="p-10 min-h-[300px] flex items-center justify-center">
                   {users ? (
                     <div className="text-center">
                        <div className="h-20 w-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                           <Users className="h-10 w-10" />
                        </div>
                        <p className="text-2xl font-black">{users.length} Registered Users</p>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Database Active</p>
                     </div>
                   ) : (
                     <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Syncing Directory...</p>
                     </div>
                   )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </AdminGuard>
  )
}

