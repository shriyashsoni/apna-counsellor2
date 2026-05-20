"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { 
  UserCheck, Search, CheckCircle2, XCircle, Eye, EyeOff, 
  Trash2, Loader2, Star, ChevronRight, Phone, Mail, BookOpen
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { approveMentorAction } from "@/lib/actions/admin"

export default function AdminMentorsPage() {
  const supabase = createClient()
  const [mentors, setMentors] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const { data: mentorData } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['mentor', 'suspended_mentor'])
        .order('created_at', { ascending: false })

      const { data: appData } = await supabase
        .from('mentor_applications')
        .select('*, profiles(email)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      setMentors(mentorData || [])
      setApplications(appData || [])
    } catch (err: any) {
      toast.error("Sync failed: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleApprove = async (app: any) => {
    setIsSubmitting(app.id)
    try {
      const result = await approveMentorAction(app.id, app.user_id, app.profiles?.email, app.name)
      if (!result.success) throw new Error(result.error)
      toast.success(`${app.name} approved as mentor!`)
      fetchData()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(null)
    }
  }

  const handleToggleVisibility = async (mentorId: string, current: boolean) => {
    setIsSubmitting(mentorId)
    try {
      const { error } = await supabase.from('profiles').update({ is_visible: !current }).eq('id', mentorId)
      if (error) throw error
      toast.success(`Mentor ${!current ? 'shown' : 'hidden'} from listings`)
      fetchData()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(null)
    }
  }

  const handleSuspend = async (mentorId: string, currentRole: string) => {
    setIsSubmitting(mentorId)
    try {
      const newRole = currentRole === 'suspended_mentor' ? 'mentor' : 'suspended_mentor'
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', mentorId)
      if (error) throw error
      toast.success(`Mentor ${newRole === 'suspended_mentor' ? 'suspended' : 'reinstated'}`)
      fetchData()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(null)
    }
  }

  const handleDelete = async (mentorId: string) => {
    if (!confirm("Permanently remove this mentor? This cannot be undone.")) return
    setIsSubmitting(mentorId)
    try {
      const { error } = await supabase.from('profiles').update({ role: 'student' }).eq('id', mentorId)
      if (error) throw error
      toast.success("Mentor role revoked")
      fetchData()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(null)
    }
  }

  const filteredMentors = mentors.filter(m =>
    (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.email || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <UserCheck className="h-6 w-6 text-purple-400" /> Mentor Manager
          </h1>
          <p className="text-slate-500 text-xs font-medium mt-1">
            {mentors.length} active mentors · {applications.length} pending applications
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search mentors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-10 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-purple-500 text-sm"
          />
        </div>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="bg-slate-900 border border-white/5 rounded-xl p-1 h-11">
          <TabsTrigger value="active" className="rounded-lg text-xs font-bold data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-400 px-4">
            Active Mentors ({mentors.length})
          </TabsTrigger>
          <TabsTrigger value="applications" className="rounded-lg text-xs font-bold data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-400 px-4">
            Pending Applications
            {applications.length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white border-none text-[8px] px-1.5 py-0.5 font-black">
                {applications.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ACTIVE MENTORS TABLE */}
        <TabsContent value="active" className="mt-4">
          {isLoading ? (
            <div className="py-16 flex items-center justify-center gap-3 text-slate-500">
              <Loader2 className="animate-spin h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Syncing mentor registry...</span>
            </div>
          ) : (
            <div className="bg-slate-900 border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="border-b border-white/5 bg-white/[0.02]">
                  <tr>
                    {['Mentor', 'Contact', 'Specialization', 'Rating', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left font-black text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {filteredMentors.map(m => (
                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-black flex items-center justify-center text-sm flex-shrink-0">
                            {(m.name || 'M').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-200">{m.name || 'Anonymous'}</p>
                            <p className="text-slate-500 text-[10px]">{m.college || 'College not set'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-slate-400">{m.email}</p>
                        <p className="text-slate-600 text-[10px] mt-0.5">{m.phone || '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(m.counseling_type || []).slice(0, 2).map((t: string) => (
                            <Badge key={t} className="bg-purple-500/10 text-purple-400 border-none text-[8px] font-bold">
                              {t}
                            </Badge>
                          ))}
                          {(m.counseling_type || []).length === 0 && (
                            <span className="text-slate-600 text-[10px]">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                          <span className="font-bold text-slate-300">{m.rating || '—'}</span>
                          <span className="text-slate-600 text-[10px]">({m.reviews_count || 0})</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <Badge className={`border-none text-[9px] font-black w-fit ${
                            m.role === 'suspended_mentor' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {m.role === 'suspended_mentor' ? 'SUSPENDED' : 'ACTIVE'}
                          </Badge>
                          <Badge className={`border-none text-[9px] font-black w-fit ${
                            m.is_visible ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-slate-500'
                          }`}>
                            {m.is_visible ? 'VISIBLE' : 'HIDDEN'}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isSubmitting === m.id}
                            onClick={() => handleToggleVisibility(m.id, m.is_visible)}
                            className={`h-8 rounded-lg font-bold text-[10px] uppercase px-2.5 ${
                              m.is_visible ? 'text-slate-400 hover:bg-slate-800' : 'text-blue-400 hover:bg-blue-500/10'
                            }`}
                          >
                            {m.is_visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isSubmitting === m.id}
                            onClick={() => handleSuspend(m.id, m.role)}
                            className={`h-8 rounded-lg font-bold text-[10px] uppercase px-2.5 ${
                              m.role === 'suspended_mentor' ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-amber-400 hover:bg-amber-500/10'
                            }`}
                          >
                            {isSubmitting === m.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> :
                              m.role === 'suspended_mentor' ? 'Reinstate' : 'Suspend'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isSubmitting === m.id}
                            onClick={() => handleDelete(m.id)}
                            className="h-8 rounded-lg font-bold text-[10px] uppercase px-2.5 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredMentors.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-600 font-bold italic">
                        No mentors found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* PENDING APPLICATIONS */}
        <TabsContent value="applications" className="mt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {applications.map(app => (
              <div key={app.id} className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-black text-white text-base">{app.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{app.profiles?.email}</p>
                    <p className="text-[10px] text-slate-500">{app.college} · {app.branch}</p>
                  </div>
                  <Badge className="bg-amber-500/10 text-amber-400 border-none font-black text-[9px]">PENDING</Badge>
                </div>

                {/* Counselling Types */}
                {(app.counseling_type || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {app.counseling_type.map((t: string) => (
                      <Badge key={t} className="bg-purple-500/10 text-purple-400 border-none text-[9px] font-bold">{t}</Badge>
                    ))}
                  </div>
                )}

                <p className="text-[11px] text-slate-500 italic border-t border-white/5 pt-3 leading-relaxed">
                  "{app.bio?.slice(0, 120) || 'No bio provided'}..."
                </p>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(app)}
                    disabled={isSubmitting === app.id}
                    className="flex-1 h-10 rounded-xl bg-purple-600 text-white font-black text-xs hover:bg-purple-700"
                  >
                    {isSubmitting === app.id ? <Loader2 className="animate-spin h-4 w-4" /> : (
                      <><CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Approve Mentor</>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={isSubmitting === app.id}
                    onClick={async () => {
                      setIsSubmitting(app.id)
                      await supabase.from('mentor_applications').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', app.id)
                      toast.success("Application rejected")
                      fetchData()
                      setIsSubmitting(null)
                    }}
                    className="h-10 rounded-xl px-4 text-red-400 hover:bg-red-500/10 font-bold text-xs"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}

            {applications.length === 0 && (
              <div className="col-span-2 py-16 text-center bg-slate-900 rounded-xl border border-dashed border-white/10">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                <p className="text-slate-400 font-bold text-sm">All applications processed!</p>
                <p className="text-slate-600 text-xs mt-1">No pending mentor applications at this time.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
