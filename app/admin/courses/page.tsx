"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { 
  Rocket, Plus, Search, BookOpen, Trash2, Edit, 
  ExternalLink, Video, FileText, Loader2, AlertCircle, PlusCircle, Check, Users, Send, BellMinus, CalendarCheck, BookCheck
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"

export default function AdminCoursesPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  
  // Resources Editor Drawer state
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [newResource, setNewResource] = useState({ title: '', type: 'video', url: '' })

  // Notification Drawer state
  const [notifyCourse, setNotifyCourse] = useState<any>(null)
  const [notifySubject, setNotifySubject] = useState("")
  const [notifyBody, setNotifyBody] = useState("")
  const [notifyUrl, setNotifyUrl] = useState("")
  const [isSendingNotification, setIsSendingNotification] = useState(false)

  // Past Broadcasts state
  const [showBroadcasts, setShowBroadcasts] = useState(false)
  const [recentBroadcasts, setRecentBroadcasts] = useState<any[]>([])
  const [isLoadingBroadcasts, setIsLoadingBroadcasts] = useState(false)

  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setCourses(data || [])
    } catch (err: any) {
      toast.error(`Sync Failed: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this course? This action is irreversible.")) return
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id)
      if (error) throw error
      toast.success("Course deleted successfully!")
      fetchCourses()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleUpdateResources = async () => {
    if (!selectedCourse) return
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('courses')
        .update({ resources: selectedCourse.resources || [] })
        .eq('id', selectedCourse.id)
      
      if (error) throw error

      await supabase.from('course_audit_logs').insert({
        action: 'course_updated',
        details: `Admin upgraded learning resources for Course: "${selectedCourse.title}"`
      })

      toast.success("Learning resources deployed successfully!")
      setSelectedCourse(null)
      fetchCourses()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addResourceItem = () => {
    if (!newResource.title || !newResource.url) return toast.error("Please fill all resource details")
    const updated = [...(selectedCourse.resources || []), { ...newResource, id: Math.random().toString(36).substr(2, 9) }]
    setSelectedCourse({ ...selectedCourse, resources: updated })
    setNewResource({ title: '', type: 'video', url: '' })
    toast.success("Resource staged!")
  }

  const removeResourceItem = (id: string) => {
    const filtered = (selectedCourse.resources || []).filter((r: any) => r.id !== id)
    setSelectedCourse({ ...selectedCourse, resources: filtered })
    toast.success("Resource staged for removal!")
  }

  const handleSendNotification = async () => {
    if (!notifySubject || !notifyBody) return toast.error("Please fill subject and body.")
    setIsSendingNotification(true)
    
    try {
      let finalBody = `<p style="white-space: pre-wrap; font-size: 15px; color: #374151;">${notifyBody}</p>`
      if (notifyUrl) {
        finalBody += `<br/><p style="margin-top: 10px;"><strong>📺 Watch Video:</strong> <a href="${notifyUrl}" style="color: #3b82f6;">${notifyUrl}</a></p>`
      }

      // We use the broadcast API template
      const templateRes = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: notifySubject,
          html: finalBody,
          audience: 'course',
          courseId: notifyCourse.id
        })
      })
      const result = await templateRes.json()
      if (!templateRes.ok) throw new Error(result.error)

      toast.success(`Video notification sent to ${result.sent} students!`)
      setNotifyCourse(null)
      setNotifySubject("")
      setNotifyBody("")
      setNotifyUrl("")
    } catch (err: any) {
      toast.error(`Broadcast Failed: ${err.message}`)
    } finally {
      setIsSendingNotification(false)
    }
  }

  const fetchRecentBroadcasts = async () => {
    setIsLoadingBroadcasts(true)
    setShowBroadcasts(true)
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('title, created_at')
        .eq('is_broadcast', true)
        .order('created_at', { ascending: false })
        .limit(500)
      
      if (error) throw error

      const unique = Array.from(new Map((data || []).map(item => [item.title, item])).values())
      setRecentBroadcasts(unique)
    } catch (err: any) {
      toast.error(`Failed to fetch past broadcasts: ${err.message}`)
    } finally {
      setIsLoadingBroadcasts(false)
    }
  }

  const handleDeleteBroadcast = async (title: string) => {
    if (!confirm(`Delete all notifications titled "${title}" from student dashboards?`)) return
    try {
      const { error } = await supabase.from('notifications').delete().eq('title', title).eq('is_broadcast', true)
      if (error) throw error
      toast.success("Broadcast deleted from all inboxes!")
      fetchRecentBroadcasts()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  // Filters calculation
  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || c.category === categoryFilter
    const matchesStatus = statusFilter === "all" || 
                          (statusFilter === "published" && c.is_published) || 
                          (statusFilter === "draft" && !c.is_published)
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
            <Rocket className="h-8 w-8 text-[#00FF88] shadow-[0_0_15px_rgba(0,255,136,0.3)] animate-pulse" />
            Course Command & Launcher
          </h1>
          <p className="text-slate-500 font-medium text-xs uppercase tracking-wider mt-1">Publish admission programs, edit study resources, and catalog guides</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            onClick={fetchRecentBroadcasts} 
            className="rounded-xl h-12 px-5 font-bold bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <BellMinus className="h-5 w-5" /> Manage Broadcasts
          </Button>
          <Button 
            onClick={() => router.push("/admin/courses/new")} 
            className="rounded-xl h-12 px-6 font-black bg-[#00FF88] text-black hover:bg-[#00e077] transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(0,255,136,0.15)] flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> Launch Course Wizard
          </Button>
        </div>
      </div>

      {/* 2. Interactive Search & Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Search by program title or details..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-11 rounded-xl h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 font-semibold focus-visible:ring-[#00FF88]"
          />
        </div>
        <div className="md:col-span-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/10 text-white font-semibold focus:ring-[#00FF88]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="JEE Main">JEE Main</SelectItem>
              <SelectItem value="JEE Advanced">JEE Advanced</SelectItem>
              <SelectItem value="NEET">NEET</SelectItem>
              <SelectItem value="MHT-CET">MHT-CET</SelectItem>
              <SelectItem value="MBA/CAT">MBA/CAT</SelectItem>
              <SelectItem value="Study Abroad">Study Abroad</SelectItem>
              <SelectItem value="Career Counselling">Career Counselling</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/10 text-white font-semibold focus:ring-[#00FF88]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 3. Course List Cards Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-[#00FF88] mb-4" />
          <p className="text-slate-400 font-semibold text-xs tracking-wider uppercase animate-pulse">Syncing Active Courses...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(c => (
            <Card key={c.id} className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 relative overflow-hidden group shadow-lg hover:border-white/10 transition-all">
              {/* Background gradient glowing accent using course hex choice */}
              <div 
                className="absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 rounded-full" 
                style={{ backgroundColor: c.color_accent || '#00FF88' }}
              />

              <div className="flex justify-between items-start mb-6">
                <div className="h-11 w-11 rounded-xl bg-white/5 text-white/80 flex items-center justify-center border border-white/10">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="flex flex-wrap gap-1.5 items-end justify-end max-w-[200px]">
                  {c.is_featured && (
                    <Badge className="rounded-lg font-black text-[9px] border-none px-1.5 py-0.5 bg-amber-500/10 text-amber-400">
                      ★ FEATURED
                    </Badge>
                  )}
                  <Badge className="rounded-lg font-black text-[9px] border-none px-1.5 py-0.5 bg-blue-500/10 text-blue-400">
                    {String(c.mode || 'Live Course').toUpperCase()}
                  </Badge>
                  <Badge className={`rounded-lg font-black text-[9px] border-none px-1.5 py-0.5 ${c.is_published ? 'bg-[#00FF88]/10 text-[#00FF88]' : 'bg-white/10 text-slate-400'}`}>
                    {c.is_published ? 'PUBLISHED' : 'DRAFT'}
                  </Badge>
                </div>
              </div>

              <h3 className="font-black text-lg text-white mb-2 line-clamp-1 leading-snug">{c.title}</h3>
              <p className="text-xs text-slate-400 font-medium line-clamp-2 mb-6 leading-relaxed">{c.description || 'No description summary.'}</p>

              <div className="grid grid-cols-3 gap-3 p-3 bg-white/5 border border-white/5 rounded-xl text-center mb-6">
                <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Price</p>
                  <p className="text-xs font-black text-[#00FF88]">₹{Number(c.price).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Lessons</p>
                  <p className="text-xs font-black text-slate-200">{c.total_lessons || 0}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Assets</p>
                  <p className="text-xs font-black text-slate-200">{(c.resources || []).length}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setSelectedCourse(c)} 
                  className="flex-1 rounded-xl h-10 font-bold text-[10px] bg-white/5 hover:bg-white/10 text-white border border-white/10 uppercase flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="h-3.5 w-3.5 text-[#00FF88]" /> Materials
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => router.push(`/admin/courses/${c.id}/students`)} 
                  className="h-10 w-10 text-blue-400 hover:bg-blue-400/10 hover:text-blue-300 rounded-xl"
                  title="View Students"
                >
                  <Users className="h-4.5 w-4.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => router.push(`/admin/courses/${c.id}/edit`)} 
                  className="h-10 w-10 text-[#00FF88] hover:bg-[#00FF88]/10 hover:text-[#00e077] rounded-xl"
                >
                  <Edit className="h-4.5 w-4.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setNotifyCourse(c)} 
                  className="h-10 w-10 text-purple-400 hover:bg-purple-400/10 hover:text-purple-300 rounded-xl"
                  title="Send Batch Notification"
                >
                  <Send className="h-4.5 w-4.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDeleteCourse(c.id)} 
                  className="h-10 w-10 text-red-500 hover:bg-red-500/10 hover:text-red-400 rounded-xl"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </Button>
              </div>
            </Card>
          ))}

          {filteredCourses.length === 0 && (
            <div className="col-span-full py-20 text-center rounded-2xl bg-white/5 border border-dashed border-white/10">
              <Rocket className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 font-bold">No active courses match the filter settings.</p>
            </div>
          )}
        </div>
      )}

      {/* 4. Classroom Study Materials Drawer Overlay */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-4xl w-full flex flex-col max-h-[85vh] shadow-2xl relative">
            <header className="p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-white">Stage Classroom Materials</h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{selectedCourse.title}</p>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCourse(null)} 
                className="h-9 w-9 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 p-0"
              >
                ✕
              </Button>
            </header>

            <div className="p-6 flex-1 overflow-y-auto grid md:grid-cols-12 gap-8">
              {/* Left Column: Form to Stage Asset */}
              <div className="md:col-span-6 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#00FF88]">Add New Resource</h4>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500">Resource Title</label>
                  <Input 
                    placeholder="e.g. Option Entry Workbook Draft" 
                    value={newResource.title} 
                    onChange={e => setNewResource({ ...newResource, title: e.target.value })} 
                    className="h-11 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500">Resource Category</label>
                  <Select value={newResource.type} onValueChange={v => setNewResource({ ...newResource, type: v })}>
                    <SelectTrigger className="h-11 rounded-xl bg-white/5 border-white/10 text-white font-bold">
                       <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                       <SelectItem value="video">Video Lecture Embed Link</SelectItem>
                       <SelectItem value="pdf">Admissions PDF / Cutoff Matrix</SelectItem>
                       <SelectItem value="link">Interactive Tool / Site Link</SelectItem>
                       <SelectItem value="assignment">Assignment / Practice</SelectItem>
                       <SelectItem value="schedule">Live Class Schedule Link</SelectItem>
                       <SelectItem value="paid_material">Premium Paid Material</SelectItem>
                       <SelectItem value="class">Recorded Class Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500">Resource Location URL</label>
                  <Input 
                    placeholder="e.g. https://youtube.com/embed/..." 
                    value={newResource.url} 
                    onChange={e => setNewResource({ ...newResource, url: e.target.value })} 
                    className="h-11 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88]"
                  />
                </div>

                <Button 
                  onClick={addResourceItem} 
                  className="w-full h-11 rounded-xl bg-[#00FF88] text-black font-black hover:bg-[#00e077] transition-all"
                >
                  + Add to Learning Catalog
                </Button>
              </div>

              {/* Right Column: Staged Resources */}
              <div className="md:col-span-6 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#00FF88]">Staged Assets ({(selectedCourse.resources || []).length})</h4>
                <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {(selectedCourse.resources || []).map((r: any) => (
                    <div key={r.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                          r.type === 'video' || r.type === 'class' ? 'bg-red-500/10 text-red-500' :
                          r.type === 'pdf' || r.type === 'assignment' ? 'bg-blue-500/10 text-blue-500' : 
                          r.type === 'paid_material' ? 'bg-amber-500/10 text-amber-500' : 'bg-purple-500/10 text-purple-500'
                        }`}>
                          {r.type === 'video' || r.type === 'class' ? <Video className="h-4 w-4" /> :
                           r.type === 'pdf' ? <FileText className="h-4 w-4" /> : 
                           r.type === 'assignment' ? <BookOpen className="h-4 w-4" /> : 
                           r.type === 'paid_material' ? <BookCheck className="h-4 w-4" /> : 
                           r.type === 'schedule' ? <CalendarCheck className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-black text-white line-clamp-1">{r.title}</p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{r.type}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeResourceItem(r.id)} 
                        className="h-8 w-8 text-red-500 hover:bg-red-500/10 hover:text-red-400 rounded-lg p-0"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}

                  {(selectedCourse.resources || []).length === 0 && (
                    <div className="text-center py-12 text-slate-500 font-bold italic text-xs">No learning materials added yet.</div>
                  )}
                </div>
              </div>
            </div>

            <footer className="p-6 border-t border-white/10 flex justify-end gap-3 bg-[#0a0a0a]">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCourse(null)} 
                className="rounded-xl border border-white/10 text-white hover:bg-white/5 font-bold h-11 px-5"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateResources} 
                disabled={isSubmitting} 
                className="rounded-xl bg-[#00FF88] text-black font-black hover:bg-[#00e077] h-11 px-6 flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,136,0.15)]"
              >
                {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : <Check className="h-4 w-4" />}
                Save & Deploy Live
              </Button>
            </footer>
          </div>
        </div>
      )}
      {/* 5. Batch Notification Drawer Overlay */}
      {notifyCourse && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-2xl w-full flex flex-col max-h-[85vh] shadow-2xl relative">
            <header className="p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-white">Send Batch Video Notification</h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">To: {notifyCourse.title}</p>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setNotifyCourse(null)} 
                className="h-9 w-9 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 p-0"
              >
                ✕
              </Button>
            </header>

            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-500">Email Subject / Notification Title</label>
                <Input 
                  placeholder="e.g. New Live Lecture Details" 
                  value={notifySubject} 
                  onChange={e => setNotifySubject(e.target.value)} 
                  className="h-11 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-500">Message Body</label>
                <textarea 
                  placeholder="Hello batch, we have just uploaded the new cutoff PDF and a video explanation..." 
                  value={notifyBody} 
                  onChange={e => setNotifyBody(e.target.value)} 
                  className="w-full min-h-[120px] p-3 bg-white/5 border border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88] focus:outline-none focus:ring-1 focus:ring-[#00FF88] text-sm resize-y"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-500">YouTube Video Link (Optional)</label>
                <Input 
                  placeholder="e.g. https://youtube.com/watch?v=..." 
                  value={notifyUrl} 
                  onChange={e => setNotifyUrl(e.target.value)} 
                  className="h-11 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-600 focus:border-[#00FF88]"
                />
              </div>
            </div>

            <footer className="p-6 border-t border-white/10 flex justify-end gap-3 bg-[#0a0a0a]">
              <Button 
                variant="ghost" 
                onClick={() => setNotifyCourse(null)} 
                className="rounded-xl border border-white/10 text-white hover:bg-white/5 font-bold h-11 px-5"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSendNotification} 
                disabled={isSendingNotification} 
                className="rounded-xl bg-purple-500 text-white font-black hover:bg-purple-600 h-11 px-6 flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              >
                {isSendingNotification ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4" />}
                Blast to Enrolled Students
              </Button>
            </footer>
          </div>
        </div>
      )}

      {/* 6. Manage Past Broadcasts Overlay */}
      {showBroadcasts && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-2xl w-full flex flex-col max-h-[85vh] shadow-2xl relative">
            <header className="p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2"><BellMinus className="h-5 w-5 text-red-400" /> Manage Sent Broadcasts</h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Delete past notifications from all student dashboards</p>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setShowBroadcasts(false)} 
                className="h-9 w-9 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 p-0"
              >
                ✕
              </Button>
            </header>

            <div className="p-6 flex-1 overflow-y-auto space-y-3">
              {isLoadingBroadcasts ? (
                <div className="py-12 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-slate-500" /></div>
              ) : recentBroadcasts.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-bold italic text-sm">No recent broadcasts found in the system.</div>
              ) : (
                recentBroadcasts.map((b, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div>
                      <p className="font-bold text-white text-sm">{b.title}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                        Sent: {new Date(b.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleDeleteBroadcast(b.title)}
                      className="h-9 px-4 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 font-bold text-xs flex items-center gap-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
