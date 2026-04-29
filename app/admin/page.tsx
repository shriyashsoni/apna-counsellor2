"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  ArrowRight,
  Search,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Linkedin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Image from "next/image"

export default function AdminDashboard() {
  const mentors = useQuery(api.users.listMentors)
  const updateUser = useMutation(api.users.updateUser)

  const handleApprove = async (id: any) => {
    try {
      await updateUser({ id, data: { verified: true } })
      toast.success("Mentor approved!")
    } catch (e) {
      toast.error("Action failed")
    }
  }

  const handleBlock = async (id: any) => {
    try {
      await updateUser({ id, data: { verified: false, role: "student" } })
      toast.success("Mentor status revoked")
    } catch (e) {
      toast.error("Action failed")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 flex justify-between items-end">
           <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Admin Control Center</h1>
              <p className="text-slate-500 font-medium mt-1">Platform-wide management and mentor verification.</p>
           </div>
           <Badge className="h-10 px-6 rounded-xl bg-primary text-white font-black">
              Super Admin Mode
           </Badge>
        </div>

        <div className="grid gap-8">
           
           {/* Stats Row */}
           <div className="grid sm:grid-cols-4 gap-6">
              <StatCard title="Total Students" value="12,450" icon={<Users className="h-5 w-5" />} />
              <StatCard title="Verified Mentors" value={mentors?.filter(m => m.verified)?.length || 0} icon={<CheckCircle2 className="h-5 w-5" />} />
              <StatCard title="Pending Approvals" value={mentors?.filter(m => !m.verified)?.length || 0} icon={<ShieldCheck className="h-5 w-5" />} color="bg-amber-500" />
              <StatCard title="Total Revenue" value="₹4.2L" icon={<ShieldCheck className="h-5 w-5" />} />
           </div>

           {/* Approval Queue */}
           <div className="space-y-6">
              <h2 className="text-2xl font-black px-2 flex items-center gap-3">
                 <ShieldCheck className="h-7 w-7 text-primary" />
                 Mentor Verification Queue
              </h2>

              <div className="grid gap-4">
                 {mentors === undefined ? (
                    <div className="py-20 text-center font-bold text-slate-400 animate-pulse">Loading queue...</div>
                 ) : mentors.length === 0 ? (
                    <div className="py-20 text-center font-bold text-slate-400">No mentors registered yet.</div>
                 ) : (
                    mentors.map((mentor: any) => (
                      <Card key={mentor._id} className="border-none rounded-[2rem] bg-white dark:bg-slate-900 shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
                         <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                               <div className="h-16 w-16 rounded-2xl overflow-hidden relative shadow-lg">
                                  <Image 
                                    src={mentor.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.name}`} 
                                    alt={mentor.name}
                                    fill
                                    className="object-cover"
                                  />
                               </div>
                               <div className="flex-1 space-y-1 text-center md:text-left">
                                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                     <h3 className="text-lg font-black">{mentor.name}</h3>
                                     {mentor.verified ? (
                                       <Badge className="bg-emerald-500/10 text-emerald-600 border-none rounded-full px-2 py-0.5 text-[10px] font-black">Verified</Badge>
                                     ) : (
                                       <Badge className="bg-amber-500/10 text-amber-600 border-none rounded-full px-2 py-0.5 text-[10px] font-black">Pending Approval</Badge>
                                     )}
                                  </div>
                                  <p className="text-xs font-bold text-slate-500 flex items-center justify-center md:justify-start gap-2">
                                     <GraduationCap className="h-3.5 w-3.5" /> {mentor.college} · {mentor.branch}
                                  </p>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{mentor.email}</p>
                               </div>

                               <div className="flex flex-wrap gap-2 justify-center">
                                  <Button variant="ghost" size="sm" className="rounded-xl font-bold gap-1 text-slate-400">
                                     <Linkedin className="h-4 w-4" /> Profile
                                  </Button>
                                  {mentor.verified ? (
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleBlock(mentor._id)}
                                      className="rounded-xl font-bold gap-1 text-red-500 hover:bg-red-50"
                                    >
                                       <XCircle className="h-4 w-4" /> Revoke
                                    </Button>
                                  ) : (
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleApprove(mentor._id)}
                                      className="rounded-xl font-black gap-1 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                                    >
                                       <CheckCircle2 className="h-4 w-4" /> Approve Expert
                                    </Button>
                                  )}
                               </div>
                            </div>
                         </CardContent>
                      </Card>
                    ))
                 )}
              </div>
           </div>

        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color = "bg-primary" }: any) {
  return (
    <Card className="border-none rounded-[2rem] bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-100 dark:border-slate-800">
       <div className="flex justify-between items-start mb-4">
          <div className={`h-10 w-10 rounded-xl ${color}/10 flex items-center justify-center text-white`} style={{ color: "white", backgroundColor: color.includes('bg-') ? undefined : color }}>
             <div className={`${color} h-full w-full rounded-xl flex items-center justify-center`}>
               {icon}
             </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-200" />
       </div>
       <p className="text-3xl font-black text-slate-900 dark:text-white">{value}</p>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{title}</p>
    </Card>
  )
}
