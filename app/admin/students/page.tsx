"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Users, Search, ChevronRight, X, BookOpen, Calendar, Loader2, Mail, Phone, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function AdminStudentsPage() {
  const supabase = createClient()
  const [students, setStudents] = useState<any[]>([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [enrollCourseId, setEnrollCourseId] = useState("")

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const { data: studentData } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false })

      const { data: enrollData } = await supabase
        .from('course_enrollments')
        .select('*, courses(title, price), profiles:student_id(name, email)')
        .order('created_at', { ascending: false })

      const { data: courseData } = await supabase
        .from('courses')
        .select('id, title, price')
        .eq('is_published', true)

      setStudents(studentData || [])
      setEnrollments(enrollData || [])
      setCourses(courseData || [])
    } catch (err: any) {
      toast.error(`Sync Failed: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const getStudentEnrollments = (studentId: string) =>
    enrollments.filter(e => e.student_id === studentId)

  const handleManualEnroll = async () => {
    if (!selectedStudent || !enrollCourseId) return toast.error("Select a course to enroll")
    setIsEnrolling(true)
    try {
      const { error } = await supabase.from('course_enrollments').upsert({
        student_id: selectedStudent.id,
        course_id: enrollCourseId,
        status: 'active',
        payment_id: 'admin_manual_grant'
      }, { onConflict: 'course_id,student_id' })

      if (error) throw error
      toast.success(`${selectedStudent.name || 'Student'} manually enrolled!`)
      fetchData()
      setEnrollCourseId("")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsEnrolling(false)
    }
  }

  const filtered = students.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Users className="h-7 w-7 text-[#00FF88]" /> Students Manager
          </h1>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-1">
            Real-time registry — {students.length} students enrolled
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-11 h-11 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88]"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin h-8 w-8 text-[#00FF88]" />
          <p className="text-slate-500 text-xs uppercase tracking-widest animate-pulse font-bold">Syncing Student Registry...</p>
        </div>
      ) : (
        <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/5 bg-white/[0.03]">
              <tr>
                {['Student', 'Exam Target', 'City', 'Enrolled', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 font-black text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filtered.map(s => {
                const studentEnrollments = getStudentEnrollments(s.id)
                return (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 text-white font-black flex items-center justify-center text-xs">
                          {(s.name || s.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200">{s.name || 'Anonymous'}</p>
                          <p className="text-slate-500">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge className="bg-white/5 text-slate-400 border-none font-bold text-[9px] uppercase">
                        {s.exam || 'Not Set'}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-slate-500 font-medium">{s.city || '—'}</td>
                    <td className="px-6 py-5">
                      <Badge className={`border-none font-black text-[9px] ${
                        studentEnrollments.length > 0 ? 'bg-[#00FF88]/10 text-[#00FF88]' : 'bg-white/5 text-slate-500'
                      }`}>
                        {studentEnrollments.length} Course{studentEnrollments.length !== 1 ? 's' : ''}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-slate-500">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedStudent(s)}
                        className="text-[#00FF88] hover:bg-[#00FF88]/10 rounded-lg font-bold text-[10px] uppercase"
                      >
                        View Profile <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500 font-bold italic">
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Student Profile Drawer */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-[#0d0d0d] border-l border-white/10 w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <header className="p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h3 className="font-black text-white text-lg">{selectedStudent.name || 'Anonymous Student'}</h3>
                <p className="text-slate-500 text-xs">{selectedStudent.email}</p>
              </div>
              <Button variant="ghost" onClick={() => setSelectedStudent(null)}
                className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 p-0">
                <X className="h-4 w-4" />
              </Button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile Info */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-[#00FF88] tracking-widest">Profile Details</p>
                {[
                  { icon: Mail, label: selectedStudent.email },
                  { icon: Phone, label: selectedStudent.phone || 'Not provided' },
                  { icon: MapPin, label: selectedStudent.city || 'City not set' },
                  { icon: Calendar, label: `Joined: ${new Date(selectedStudent.created_at).toLocaleDateString()}` },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                    <item.icon className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    <span className="text-xs text-slate-300 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Enrollment History */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-[#00FF88] tracking-widest">
                  Enrollment History ({getStudentEnrollments(selectedStudent.id).length})
                </p>
                {getStudentEnrollments(selectedStudent.id).map(e => (
                  <div key={e.id} className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-[#00FF88]" />
                        <div>
                          <p className="text-xs font-bold text-white">{e.courses?.title}</p>
                          <p className="text-[9px] text-slate-500">{new Date(e.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge className={`border-none text-[9px] font-black ${
                        e.status === 'active' ? 'bg-[#00FF88]/10 text-[#00FF88]' : 'bg-white/5 text-slate-400'
                      }`}>
                        {e.status?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
                {getStudentEnrollments(selectedStudent.id).length === 0 && (
                  <p className="text-slate-600 font-bold italic text-xs py-4 text-center">No enrollments yet.</p>
                )}
              </div>

              {/* Manual Enroll */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-[#00FF88] tracking-widest">Manual Course Enrollment</p>
                <select
                  value={enrollCourseId}
                  onChange={e => setEnrollCourseId(e.target.value)}
                  className="w-full h-11 bg-white/5 border border-white/10 text-white rounded-xl px-3 text-xs font-bold focus:outline-none focus:border-[#00FF88]"
                >
                  <option value="">Select a course to grant access...</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id} className="bg-[#0f0f0f]">{c.title} — ₹{c.price}</option>
                  ))}
                </select>
                <Button
                  onClick={handleManualEnroll}
                  disabled={isEnrolling || !enrollCourseId}
                  className="w-full h-11 rounded-xl bg-[#00FF88] text-black font-black hover:bg-[#00e077]"
                >
                  {isEnrolling ? <Loader2 className="animate-spin h-4 w-4" /> : 'Grant Course Access'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
