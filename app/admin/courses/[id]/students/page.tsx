"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, Mail, Phone, ExternalLink } from "lucide-react"

export default function CourseStudentsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  const supabase = createClient()
  
  const [course, setCourse] = useState<any>(null)
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data: cData } = await supabase.from('courses').select('title, whatsapp_group_url').eq('id', courseId).single()
      setCourse(cData)
      
      const { data: eData } = await supabase
        .from('course_enrollments')
        .select(`
          id, created_at, status, payment_id, amount,
          student:student_id ( id, name, email, phone )
        `)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false })
      
      setEnrollments(eData || [])
      setLoading(false)
    }
    loadData()
  }, [courseId])

  if (loading) return <div className="p-10 text-white text-center">Loading Roster...</div>

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="text-slate-400 hover:text-white bg-white/5 rounded-full h-10 w-10 p-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
              <Users className="h-8 w-8 text-[#00FF88]" />
              Live Student Roster
            </h1>
            <p className="text-slate-400 font-medium text-sm mt-1">Course: <span className="text-[#00FF88] font-bold">{course?.title}</span></p>
          </div>
        </div>
        
        <div className="bg-[#0f0f0f] border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4">
           <div>
             <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Total Enrolled</p>
             <p className="text-2xl font-black text-white">{enrollments.length}</p>
           </div>
           {course?.whatsapp_group_url && (
             <a href={course.whatsapp_group_url} target="_blank" rel="noreferrer" className="text-[#00FF88] hover:text-[#00e077] p-2 bg-[#00FF88]/10 rounded-lg">
               <ExternalLink className="h-5 w-5" />
             </a>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {enrollments.map(en => (
          <Card key={en.id} className="bg-[#0f0f0f] border-white/10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition-colors">
            <div>
              <h3 className="text-lg font-black text-white">{en.student?.name || 'Unknown Student'}</h3>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-400">
                {en.student?.email && <span className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-[#00FF88]" /> {en.student.email}</span>}
                {en.student?.phone && <span className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-[#00FF88]" /> {en.student.phone}</span>}
              </div>
            </div>
            <div className="text-left md:text-right border-t border-white/5 pt-4 md:border-0 md:pt-0">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enrolled On</p>
              <p className="text-sm text-white font-bold mb-2">
                {new Date(en.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${en.status === 'active' ? 'bg-[#00FF88]/20 text-[#00FF88]' : 'bg-red-500/20 text-red-500'}`}>
                  {en.status}
                </span>
                <span className="text-[10px] font-black uppercase text-slate-400 border border-slate-700 px-2 py-0.5 rounded tracking-wider">
                  {en.payment_id === 'free_enrollment' ? 'FREE' : en.payment_id}
                </span>
              </div>
            </div>
          </Card>
        ))}
        {enrollments.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">No students enrolled yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
