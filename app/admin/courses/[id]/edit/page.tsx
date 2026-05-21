"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { 
  Rocket, ArrowLeft, ArrowRight, Check, Sparkles, BookOpen, 
  HelpCircle, Settings, Image as ImageIcon, Video, Search, FileText, ChevronDown, Trash2, Loader2
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"

import { useEffect } from "react"
export default function AdminEditCoursePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()
  
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 1. Wizard Form State Management
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    title: "",
    tagline: "",
    description: "",
    category: "JEE Main",
    level: "All Levels",
    language: "Hinglish",
    duration: "6 Weeks",
    total_sessions: 12,
    mode: "Live Online",

    // Step 2: Pricing & Visibility
    original_price: "",
    discounted_price: "",
    discount_badge: "Early Bird",
    enrollment_deadline: "",
    max_seats: 100,
    status: "published",
    is_featured: false,
    visibility: "public",
    is_free: false,
    available_seats: "",
    total_students: 1200,

    // Step 3: Media & Accent
    banner_url: "",
    thumbnail_url: "",
    promo_video_url: "",
    color_accent: "#00FF88",

    // Step 4: Curriculum (Dynamic JSONB array)
    curriculum: [
      {
        section_id: "sec-1",
        title: "Week 1: Strategy, Core Materials & Deadlines",
        lessons: [
          {
            lesson_id: "les-1",
            title: "Unlock Your Prime Admissions Roadmap",
            type: "video",
            content_url: "",
            duration_minutes: 45,
            is_free_preview: true
          }
        ]
      }
    ],

    // Step 5: Resources (JSONB list)
    resources: [
      {
        resource_id: "res-1",
        title: "Initial Rank-Cutoff Tracker Workbook",
        type: "pdf",
        url: "",
        is_locked: true
      }
    ],

    // Step 6: SEO
    meta_title: "",
    meta_description: "",
    keywords: ""
  })

  useEffect(() => {
    async function loadCourse() {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', params.id)
          .single()
        
        if (data) {
          setFormData({
            title: data.title || "",
            tagline: data.tagline || "",
            description: data.description || "",
            category: data.category || "JEE Main",
            level: data.level || "All Levels",
            language: data.language || "Hinglish",
            duration: data.duration || "6 Weeks",
            total_sessions: data.total_lessons || 12,
            mode: data.mode || "Live Online",
            original_price: data.original_price?.toString() || "",
            discounted_price: data.discounted_price?.toString() || "",
            discount_badge: data.discount_badge || "",
            enrollment_deadline: "",
            max_seats: 100,
            status: data.is_published ? "published" : "draft",
            is_featured: data.is_featured || false,
            visibility: data.visibility || "public",
            is_free: data.is_free || false,
            available_seats: data.available_seats?.toString() || "",
            total_students: data.total_students || 1200,
            banner_url: data.banner_url || "",
            thumbnail_url: data.thumbnail_url || "",
            promo_video_url: data.promo_video_url || "",
            color_accent: data.color_accent || "#00FF88",
            curriculum: data.curriculum || [],
            resources: data.resources || [],
            meta_title: data.meta_title || "",
            meta_description: data.meta_description || "",
            keywords: (data.keywords || []).join(", ")
          })
        }
      } catch (err) {
        console.error("Error loading course:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadCourse()
  }, [params.id, supabase])

  // 2. Navigation Actions
  const nextStep = () => {
    if (step === 1 && !formData.title) return toast.error("Course Title is required!")
    if (step === 2 && !formData.original_price) return toast.error("Original Price is required!")
    setStep(s => Math.min(s + 1, 7))
  }
  
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  // 3. Dynamic Module Builders (Curriculum)
  const addSection = () => {
    const sectionId = "sec-" + Math.random().toString(36).substr(2, 9)
    const newSection = {
      section_id: sectionId,
      title: `Week ${formData.curriculum.length + 1}: Staging & Choice Options`,
      lessons: []
    }
    setFormData({ ...formData, curriculum: [...formData.curriculum, newSection] })
    toast.success("New Module Section added!")
  }

  const removeSection = (sectionIndex: number) => {
    const updated = formData.curriculum.filter((_, i) => i !== sectionIndex)
    setFormData({ ...formData, curriculum: updated })
    toast.success("Module Section removed!")
  }

  const addLesson = (sectionIndex: number) => {
    const lessonId = "les-" + Math.random().toString(36).substr(2, 9)
    const newLesson = {
      lesson_id: lessonId,
      title: "New Tutorial Guide Topic",
      type: "video",
      content_url: "",
      duration_minutes: 30,
      is_free_preview: false
    }
    const updatedCurriculum = [...formData.curriculum]
    updatedCurriculum[sectionIndex].lessons.push(newLesson)
    setFormData({ ...formData, curriculum: updatedCurriculum })
    toast.success("New Lesson row added!")
  }

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    const updatedCurriculum = [...formData.curriculum]
    updatedCurriculum[sectionIndex].lessons = updatedCurriculum[sectionIndex].lessons.filter((_, i) => i !== lessonIndex)
    setFormData({ ...formData, curriculum: updatedCurriculum })
    toast.success("Lesson row removed!")
  }

  const handleLessonChange = (sectionIndex: number, lessonIndex: number, field: string, value: any) => {
    const updatedCurriculum = [...formData.curriculum]
    updatedCurriculum[sectionIndex].lessons[lessonIndex] = {
      ...updatedCurriculum[sectionIndex].lessons[lessonIndex],
      [field]: value
    }
    setFormData({ ...formData, curriculum: updatedCurriculum })
  }

  // 4. Dynamic Resources Catalog
  const addResource = () => {
    const resId = "res-" + Math.random().toString(36).substr(2, 9)
    const newRes = {
      resource_id: resId,
      title: "New Staged PDF Guide",
      type: "pdf",
      url: "",
      is_locked: true
    }
    setFormData({ ...formData, resources: [...formData.resources, newRes] })
  }

  const removeResource = (resIndex: number) => {
    const updated = formData.resources.filter((_, i) => i !== resIndex)
    setFormData({ ...formData, resources: updated })
  }

  const handleResourceChange = (resIndex: number, field: string, value: any) => {
    const updated = [...formData.resources]
    updated[resIndex] = { ...updated[resIndex], [field]: value }
    setFormData({ ...formData, resources: updated })
  }

  // 5. Submit & Insert Operations
  const handleUpdateCourse = async () => {
    setIsSubmitting(true)
    try {
      const slug = formData.title.toLowerCase().trim().replace(/[^a-zA-Z0-9]+/g, '-')
      
      const { data, error } = await supabase.from('courses').update({
        title: formData.title,
        tagline: formData.tagline,
        description: formData.description,
        price: Number(formData.discounted_price || formData.original_price),
        original_price: Number(formData.original_price),
        discounted_price: formData.discounted_price ? Number(formData.discounted_price) : null,
        discount_badge: formData.discount_badge,
        category: formData.category,
        level: formData.level,
        language: formData.language,
        duration: formData.duration,
        total_lessons: Number(formData.total_sessions) || 12,
        mode: formData.mode,
        color_accent: formData.color_accent,
        curriculum: formData.curriculum,
        resources: formData.resources,
        slug: slug,
        is_published: formData.status === 'published',
        is_featured: formData.is_featured,
        visibility: formData.visibility,
        thumbnail_url: formData.thumbnail_url,
        banner_url: formData.banner_url,
        promo_video_url: formData.promo_video_url,
        is_free: formData.is_free,
        available_seats: formData.available_seats ? Number(formData.available_seats) : null,
        total_students: formData.total_students ? Number(formData.total_students) : 1200,
        meta_title: formData.meta_title || formData.title,
        meta_description: formData.meta_description || formData.tagline,
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean)
      }).eq('id', params.id).select().single()

      if (error) throw error

      await supabase.from('course_audit_logs').insert({
        action: 'course_updated',
        details: `Admin successfully updated evergreen course: "${formData.title}" priced at ₹${formData.discounted_price || formData.original_price}`
      })

      toast.success("Course updated and changes live successfully!")
      router.push("/admin/courses")
    } catch (err: any) {
      toast.error(`Deploy Failed: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Back button header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/admin/courses")} 
          className="rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-white h-10 w-10 p-0"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </Button>
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Edit Admission Course</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Update your program details</p>
        </div>
      </div>

      {/* STEP PROGRESS BAR INDICATOR */}
      <div className="bg-[#0f0f0f] border border-white/5 p-4 rounded-xl flex items-center justify-between overflow-x-auto gap-4">
        {[
          { num: 1, label: "Basic Info" },
          { num: 2, label: "Pricing & Visibility" },
          { num: 3, label: "Media & Branding" },
          { num: 4, label: "Curriculum" },
          { num: 5, label: "Resources" },
          { num: 6, label: "SEO Meta" },
          { num: 7, label: "Review & Launch" }
        ].map(s => (
          <div key={s.num} className="flex items-center gap-2 flex-shrink-0">
            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
              step >= s.num ? "bg-[#00FF88] text-black shadow-[0_0_10px_rgba(0,255,136,0.2)]" : "bg-white/5 text-slate-500"
            }`}>
              {step > s.num ? "✓" : s.num}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${step >= s.num ? "text-slate-200" : "text-slate-500"}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* FORM CARDS CONTAINER */}
      <Card className="bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl shadow-xl">
        <CardContent className="p-0 space-y-8">
          
          {/* STEP 1: BASIC INFO */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#00FF88]" /> Step 1: Program Fundamentals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Course Title (Required)</label>
                  <Input 
                    placeholder="e.g. MHT-CET Premium Counselling Program" 
                    value={formData.title} 
                    onChange={e => setFormData({ ...formData, title: e.target.value })} 
                    className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:border-[#00FF88]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Tagline / Short Excerpt</label>
                  <Input 
                    placeholder="Complete personal roadmap to COEP, VJTI, and top institutions" 
                    value={formData.tagline} 
                    onChange={e => setFormData({ ...formData, tagline: e.target.value })} 
                    className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:border-[#00FF88]"
                  />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Full Description</label>
                  <Textarea 
                    placeholder="Detailed learning highlights, counselling deliverables, schedules, etc..." 
                    value={formData.description} 
                    onChange={e => setFormData({ ...formData, description: e.target.value })} 
                    className="min-h-[140px] bg-white/5 border-white/10 text-white rounded-xl focus:border-[#00FF88]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Exam Category</label>
                  <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                    <SelectTrigger className="h-11 rounded-xl bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                      <SelectItem value="JEE Main">JEE Main</SelectItem>
                      <SelectItem value="JEE Advanced">JEE Advanced</SelectItem>
                      <SelectItem value="NEET">NEET</SelectItem>
                      <SelectItem value="MHT-CET">MHT-CET</SelectItem>
                      <SelectItem value="MBA/CAT">MBA/CAT</SelectItem>
                      <SelectItem value="Study Abroad">Study Abroad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Counselling Level</label>
                  <Select value={formData.level} onValueChange={v => setFormData({ ...formData, level: v })}>
                    <SelectTrigger className="h-11 rounded-xl bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="All Levels">All Levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PRICING & VISIBILITY */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#00FF88]" /> Step 2: Pricing & Visibility Matrix
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Original Price (₹)</label>
                  <Input 
                    type="number"
                    placeholder="9999" 
                    value={formData.original_price} 
                    onChange={e => setFormData({ ...formData, original_price: e.target.value })} 
                    className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:border-[#00FF88]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Discounted Price (₹)</label>
                  <Input 
                    type="number"
                    placeholder="4999" 
                    value={formData.discounted_price} 
                    onChange={e => setFormData({ ...formData, discounted_price: e.target.value })} 
                    className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:border-[#00FF88]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Discount Badge Text</label>
                  <Input 
                    placeholder="e.g. 50% OFF / Early Bird" 
                    value={formData.discount_badge} 
                    onChange={e => setFormData({ ...formData, discount_badge: e.target.value })} 
                    className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:border-[#00FF88]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Visibility Status</label>
                  <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v })}>
                    <SelectTrigger className="h-11 rounded-xl bg-[#080808] border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                      <SelectItem value="published">Active & Published</SelectItem>
                      <SelectItem value="draft">Save in Drafts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl mt-6">
                  <div>
                    <p className="text-xs font-black text-white">Featured Program?</p>
                    <p className="text-[9px] text-slate-500 font-medium">Showcase in the hero carousel listing</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={formData.is_featured} 
                    onChange={e => setFormData({ ...formData, is_featured: e.target.checked })} 
                    className="h-5 w-5 rounded bg-white/5 border-white/10 text-[#00FF88] focus:ring-[#00FF88]"
                  />
                </div>
                <div className="space-y-2 flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl mt-6">
                  <div>
                    <p className="text-xs font-black text-white">100% Free Course?</p>
                    <p className="text-[9px] text-slate-500 font-medium">Bypass Razorpay checkout</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={formData.is_free} 
                    onChange={e => setFormData({ ...formData, is_free: e.target.checked })} 
                    className="h-5 w-5 rounded bg-white/5 border-white/10 text-[#00FF88] focus:ring-[#00FF88]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Total Students (Stat)</label>
                  <Input 
                    type="number"
                    placeholder="1200" 
                    value={formData.total_students} 
                    onChange={e => setFormData({ ...formData, total_students: e.target.value })} 
                    className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:border-[#00FF88]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Available Seats (Leave blank for infinite)</label>
                  <Input 
                    type="number"
                    placeholder="e.g. 50" 
                    value={formData.available_seats} 
                    onChange={e => setFormData({ ...formData, available_seats: e.target.value })} 
                    className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:border-[#00FF88]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: MEDIA & BRANDING */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-[#00FF88]" /> Step 3: Media Elements & Brand Identity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Thumbnail Image URL (Course Page & SEO Preview)</label>
                  <Input 
                    placeholder="https://images.unsplash.com/photo-..." 
                    value={formData.thumbnail_url} 
                    onChange={e => setFormData({ ...formData, thumbnail_url: e.target.value })} 
                    className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:border-[#00FF88]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Banner Image URL</label>
                  <Input 
                    placeholder="https://images.unsplash.com/photo-..." 
                    value={formData.banner_url} 
                    onChange={e => setFormData({ ...formData, banner_url: e.target.value })} 
                    className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:border-[#00FF88]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Card Accent Color (HEX)</label>
                  <div className="flex gap-3">
                    <Input 
                      placeholder="#00FF88" 
                      value={formData.color_accent} 
                      onChange={e => setFormData({ ...formData, color_accent: e.target.value })} 
                      className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:border-[#00FF88] flex-1"
                    />
                    <div 
                      className="h-11 w-11 rounded-xl border border-white/10" 
                      style={{ backgroundColor: formData.color_accent || '#00FF88' }}
                    />
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Loom / YouTube Promo Video URL</label>
                  <Input 
                    placeholder="https://www.youtube.com/watch?v=..." 
                    value={formData.promo_video_url} 
                    onChange={e => setFormData({ ...formData, promo_video_url: e.target.value })} 
                    className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:border-[#00FF88]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CURRICULUM BUILDER */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#00FF88]" /> Step 4: Curriculum Module Matrix
                </h2>
                <Button 
                  onClick={addSection} 
                  className="rounded-xl h-10 px-4 bg-white/5 hover:bg-white/10 text-[#00FF88] border border-[#00FF88]/20 font-black text-xs"
                >
                  + Add Section Module
                </Button>
              </div>

              <div className="space-y-6">
                {formData.curriculum.map((section, sIdx) => (
                  <div key={section.section_id} className="p-6 bg-white/5 border border-white/5 rounded-2xl relative space-y-4">
                    <div className="flex justify-between items-center">
                      <Input 
                        value={section.title} 
                        onChange={e => {
                          const updated = [...formData.curriculum]
                          updated[sIdx].title = e.target.value
                          setFormData({ ...formData, curriculum: updated })
                        }}
                        className="bg-transparent border-none text-white font-black text-md focus-visible:ring-0 p-0 max-w-lg"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeSection(sIdx)} 
                        className="text-red-500 hover:bg-red-500/10 h-8 w-8 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Lessons nested layout */}
                    <div className="pl-6 border-l border-white/10 space-y-4">
                      {section.lessons.map((lesson, lIdx) => (
                        <div key={lesson.lesson_id} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-[#0a0a0a] border border-white/5 rounded-xl">
                          <div className="md:col-span-4">
                            <label className="text-[8px] font-black uppercase text-slate-500">Lesson Title</label>
                            <Input 
                              value={lesson.title} 
                              onChange={e => handleLessonChange(sIdx, lIdx, "title", e.target.value)} 
                              className="h-9 bg-white/5 border-white/10 text-white rounded-lg text-xs"
                            />
                          </div>
                          <div className="md:col-span-3">
                            <label className="text-[8px] font-black uppercase text-slate-500">Content Link</label>
                            <Input 
                              placeholder="URL / YouTube embed code"
                              value={lesson.content_url} 
                              onChange={e => handleLessonChange(sIdx, lIdx, "content_url", e.target.value)} 
                              className="h-9 bg-white/5 border-white/10 text-white rounded-lg text-xs"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[8px] font-black uppercase text-slate-500">Minutes</label>
                            <Input 
                              type="number"
                              value={lesson.duration_minutes} 
                              onChange={e => handleLessonChange(sIdx, lIdx, "duration_minutes", Number(e.target.value))} 
                              className="h-9 bg-white/5 border-white/10 text-white rounded-lg text-xs"
                            />
                          </div>
                          <div className="md:col-span-2 flex items-center justify-between pt-4">
                            <span className="text-[9px] font-bold text-slate-400">Free?</span>
                            <input 
                              type="checkbox" 
                              checked={lesson.is_free_preview} 
                              onChange={e => handleLessonChange(sIdx, lIdx, "is_free_preview", e.target.checked)} 
                              className="h-4.5 w-4.5 bg-white/5 border-white/10 rounded text-[#00FF88]"
                            />
                          </div>
                          <div className="md:col-span-1 flex items-center justify-end pt-4">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeLesson(sIdx, lIdx)} 
                              className="text-red-500 hover:bg-red-500/10 h-7 w-7 rounded"
                            >
                              ✕
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => addLesson(sIdx)} 
                        className="text-[10px] font-black text-slate-400 hover:text-white uppercase px-3"
                      >
                        + Stage Lesson Topic
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: RESOURCES */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#00FF88]" /> Step 5: Downloads & Solutions Catalog
                </h2>
                <Button 
                  onClick={addResource} 
                  className="rounded-xl h-10 px-4 bg-white/5 hover:bg-white/10 text-[#00FF88] border border-[#00FF88]/20 font-black text-xs"
                >
                  + Add Resource Row
                </Button>
              </div>

              <div className="space-y-4">
                {formData.resources.map((res, rIdx) => (
                  <div key={res.resource_id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <div className="md:col-span-4">
                      <label className="text-[8px] font-black uppercase text-slate-500">Asset Title</label>
                      <Input 
                        value={res.title} 
                        onChange={e => handleResourceChange(rIdx, "title", e.target.value)} 
                        className="h-10 bg-[#080808] border-white/10 text-white rounded-lg text-xs"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-[8px] font-black uppercase text-slate-500">Asset Category</label>
                      <Select value={res.type} onValueChange={v => handleResourceChange(rIdx, "type", v)}>
                        <SelectTrigger className="h-10 bg-[#080808] border-white/10 text-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0f0f0f] border-white/10 text-white text-xs">
                          <SelectItem value="pdf">PDF Worksheet</SelectItem>
                          <SelectItem value="link">Reference Web link</SelectItem>
                          <SelectItem value="video">Lecture Recording</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-4">
                      <label className="text-[8px] font-black uppercase text-slate-500">Content Location URL</label>
                      <Input 
                        placeholder="https://..."
                        value={res.url} 
                        onChange={e => handleResourceChange(rIdx, "url", e.target.value)} 
                        className="h-10 bg-[#080808] border-white/10 text-white rounded-lg text-xs"
                      />
                    </div>
                    <div className="md:col-span-1 flex items-center justify-end pt-4">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeResource(rIdx)} 
                        className="text-red-500 hover:bg-red-500/10 h-8 w-8 rounded-lg"
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: SEO & META */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#00FF88]" /> Step 6: SEO Optimization Keys
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Meta SEO Title (Defaults to Course Title)</label>
                  <Input 
                    placeholder="Search Engine Page Title" 
                    value={formData.meta_title} 
                    onChange={e => setFormData({ ...formData, meta_title: e.target.value })} 
                    className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:border-[#00FF88]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Keywords (Comma Separated)</label>
                  <Input 
                    placeholder="mht-cet counselling, coep seats, cutoff, guidance" 
                    value={formData.keywords} 
                    onChange={e => setFormData({ ...formData, keywords: e.target.value })} 
                    className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:border-[#00FF88]"
                  />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Meta SEO Description</label>
                  <Textarea 
                    placeholder="Short summary displayed on Google search results page" 
                    value={formData.meta_description} 
                    onChange={e => setFormData({ ...formData, meta_description: e.target.value })} 
                    className="min-h-[100px] bg-white/5 border-white/10 text-white rounded-xl focus:border-[#00FF88]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: REVIEW & PUBLISH */}
          {step === 7 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Rocket className="h-5 w-5 text-[#00FF88] animate-bounce" /> Step 7: System Deploy & Launch Staging
              </h2>
              
              <div className="p-6 bg-white/5 border border-white/5 rounded-2xl grid md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Fundamentals Info</p>
                  <p className="text-white font-black text-xl">{formData.title}</p>
                  <p className="text-slate-400 font-medium italic">"{formData.tagline}"</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-[#00FF88]/10 text-[#00FF88] border-none text-[10px] font-black">{formData.category}</Badge>
                    <Badge className="bg-white/10 text-white border-none text-[10px] font-black">{formData.level}</Badge>
                  </div>
                </div>

                <div className="space-y-3 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                  <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Visibility & Price Status</p>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-black text-lg">₹{(formData.discounted_price || formData.original_price)}</span>
                    {formData.discounted_price && (
                      <span className="text-slate-500 font-semibold line-through text-sm">₹{formData.original_price}</span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-400">Total Curriculum Modules: <span className="text-white font-black">{formData.curriculum.length}</span></p>
                  <p className="text-xs font-bold text-slate-400">Learning materials catalogued: <span className="text-white font-black">{formData.resources.length}</span></p>
                </div>
              </div>

              <div className="p-4 bg-[#00FF88]/5 border border-[#00FF88]/10 rounded-xl flex items-center gap-3 text-[#00FF88] text-xs font-semibold">
                <Sparkles className="h-5 w-5 animate-pulse" />
                Audit staging checks verified. Click Launch below to register this program onto the public course pages instantly!
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      {/* STEP NAVIGATION BUTTONS */}
      <div className="flex justify-between items-center bg-[#0f0f0f] border border-white/5 p-4 rounded-xl">
        <Button 
          onClick={prevStep} 
          disabled={step === 1}
          className="rounded-xl h-11 px-5 border border-white/10 text-white bg-transparent hover:bg-white/5 font-bold"
        >
          Back
        </Button>

        {step < 7 ? (
          <Button 
            onClick={nextStep} 
            className="rounded-xl h-11 px-5 bg-[#00FF88] text-black font-black hover:bg-[#00e077] flex items-center gap-2"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleUpdateCourse} 
            disabled={isSubmitting}
            className="rounded-xl h-11 px-6 bg-[#00FF88] text-black font-black hover:bg-[#00e077] flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,136,0.2)]"
          >
            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : <Check className="h-5 w-5" />}
            Save & Update Course
          </Button>
        )}
      </div>
    </div>
  )
}
