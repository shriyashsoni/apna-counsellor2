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
  Type, Link as LinkIcon, List, Calendar, Tag, Shield
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

type EditorView = 'dashboard' | 'course-creator' | 'blog-creator' | 'test-creator' | 'college-creator';

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
    users: 0, mentors: 0, colleges: 0, revenue: 0, storage: { used: 12.5, total: 100 }
  })

  // Advanced Form States
  const [courseForm, setCourseForm] = useState<any>({
    title: '', slug: '', description: '', longDesc: '', price: '', category: '', 
    level: 'beginner', duration: '', image: '', video: '',
    curriculum: [{ title: 'Module 1', lessons: [{ title: 'Intro', type: 'video' }] }],
    benefits: [''], requirements: ['']
  })

  const [blogForm, setBlogForm] = useState<any>({
    title: '', slug: '', content: '', excerpt: '', category: '', tags: '', image: '',
    seoTitle: '', seoDesc: ''
  })

  const [testForm, setTestForm] = useState<any>({
    title: '', slug: '', description: '', category: '', price: '', image: '',
    tests: [{ name: 'Part Test 1', duration: 180, marks: 300 }],
    features: ['Real-time Ranking', 'Detailed Solutions']
  })

  const supabase = createClient()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const { data: userData } = await supabase.from('profiles').select('*')
      const { data: mentorData } = await supabase.from('profiles').select('*').eq('role', 'mentor')
      const { data: collegeData } = await supabase.from('colleges').select('*').limit(20)
      const { data: paymentData } = await supabase.from('payments').select('amount')
      
      const totalRevenue = paymentData?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0

      setUsers(userData || [])
      setMentors(mentorData || [])
      setColleges(collegeData || [])
      setStats({ 
        users: userData?.length || 0, 
        mentors: mentorData?.length || 0, 
        colleges: collegeData?.length || 0,
        revenue: totalRevenue,
        storage: { used: 12.5, total: 100 }
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

  // HANDLERS
  const saveCourse = async () => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('courses').insert({
        title: courseForm.title,
        slug: courseForm.slug || courseForm.title.toLowerCase().replace(/ /g, '-'),
        description: courseForm.description,
        long_description: courseForm.longDesc,
        price: Number(courseForm.price) || 0,
        image_url: courseForm.image,
        video_preview_url: courseForm.video,
        category: courseForm.category,
        level: courseForm.level,
        duration_hours: Number(courseForm.duration) || 0,
        benefits: courseForm.benefits,
        requirements: courseForm.requirements,
        curriculum: courseForm.curriculum,
        is_published: true
      })
      if (error) throw error
      toast.success("Professional Course Launched!")
      setView('dashboard')
      fetchData()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const saveBlog = async () => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('blogs').insert({
        title: blogForm.title,
        slug: blogForm.slug || blogForm.title.toLowerCase().replace(/ /g, '-'),
        content: blogForm.content,
        excerpt: blogForm.excerpt,
        featured_image: blogForm.image,
        category: blogForm.category,
        tags: blogForm.tags.split(',').map((t: string) => t.trim()),
        seo_title: blogForm.seoTitle,
        seo_description: blogForm.seoDesc,
        is_published: true
      })
      if (error) throw error
      toast.success("Blog Published Live!")
      setView('dashboard')
      fetchData()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const saveTestSeries = async () => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('test_series').insert({
        title: testForm.title,
        slug: testForm.slug || testForm.title.toLowerCase().replace(/ /g, '-'),
        description: testForm.description,
        category: testForm.category,
        price: Number(testForm.price) || 0,
        image_url: testForm.image,
        features: testForm.features,
        test_list: testForm.tests,
        total_tests: testForm.tests.length,
        is_published: true
      })
      if (error) throw error
      toast.success("Advanced Test Series Live!")
      setView('dashboard')
      fetchData()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addModule = () => {
    setCourseForm({
      ...courseForm,
      curriculum: [...courseForm.curriculum, { title: `Module ${courseForm.curriculum.length + 1}`, lessons: [{ title: 'New Lesson', type: 'video' }] }]
    })
  }

  const addLesson = (moduleIdx: number) => {
    const newCurriculum = [...courseForm.curriculum]
    newCurriculum[moduleIdx].lessons.push({ title: 'New Lesson', type: 'video' })
    setCourseForm({ ...courseForm, curriculum: newCurriculum })
  }

  const removeModule = (idx: number) => {
    const newCurriculum = [...courseForm.curriculum]
    newCurriculum.splice(idx, 1)
    setCourseForm({ ...courseForm, curriculum: newCurriculum })
  }

  const changeUserRole = async (id: string, role: string) => {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
    if (!error) {
      toast.success(`Access level updated to ${role}`)
      fetchData()
    }
  }

  if (view !== 'dashboard') {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-slate-50 text-black p-6 md:p-12">
          <div className="max-w-5xl mx-auto">
            
            {/* Creator Header */}
            <header className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-6">
                 <Button variant="ghost" size="icon" onClick={() => setView('dashboard')} className="rounded-full bg-white shadow-sm h-12 w-12 hover:bg-slate-100">
                    <ArrowLeft className="h-6 w-6" />
                 </Button>
                 <div>
                    <h1 className="text-3xl font-black tracking-tighter">
                      {view === 'course-creator' ? 'Architect New Course' : (view === 'blog-creator' ? 'Write Master Blog' : 'Launch Test Series')}
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Production Environment • Master Auth</p>
                 </div>
              </div>
              <div className="flex gap-3">
                 <Button variant="outline" className="rounded-2xl h-12 px-8 font-black border-slate-200">
                    <Eye className="mr-2 h-4 w-4" /> Preview
                 </Button>
                 <Button 
                    onClick={view === 'course-creator' ? saveCourse : (view === 'blog-creator' ? saveBlog : saveTestSeries)} 
                    disabled={isSubmitting}
                    className="rounded-2xl h-12 px-10 font-black bg-purple-600 text-white shadow-xl shadow-purple-200"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Publish Live</>}
                 </Button>
              </div>
            </header>

            {/* COURSE CREATOR */}
            {view === 'course-creator' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                   <Card className="rounded-[2.5rem] border-none shadow-sm p-8 md:p-10 space-y-8">
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Course Title</label>
                              <Input 
                                placeholder="e.g. Master Engineering Counselling 2026" 
                                value={courseForm.title}
                                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                                className="h-14 rounded-2xl border-slate-100 font-bold text-lg" 
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Custom Slug</label>
                              <Input 
                                placeholder="engineering-mastery-2026" 
                                value={courseForm.slug}
                                onChange={(e) => setCourseForm({ ...courseForm, slug: e.target.value })}
                                className="h-14 rounded-2xl border-slate-100 font-bold" 
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Brief Overview (Student View)</label>
                           <Textarea 
                              placeholder="Catchy 2-line description..." 
                              value={courseForm.description}
                              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                              className="rounded-2xl border-slate-100 font-medium" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black text-slate-400 uppercase tracking-widest">In-Depth Course Content (Full Details)</label>
                           <Textarea 
                              placeholder="Explain every benefit, section, and outcome here..." 
                              value={courseForm.longDesc}
                              onChange={(e) => setCourseForm({ ...courseForm, longDesc: e.target.value })}
                              className="rounded-2xl min-h-[300px] border-slate-100 font-medium leading-relaxed" 
                           />
                        </div>
                      </div>
                   </Card>

                   {/* Curriculum Manager */}
                   <Card className="rounded-[2.5rem] border-none shadow-sm p-8 md:p-10">
                      <div className="flex justify-between items-center mb-8">
                         <h3 className="text-xl font-black flex items-center gap-3">
                            <List className="h-6 w-6 text-purple-600" /> Syllabus & Curriculum
                         </h3>
                         <Button variant="outline" size="sm" onClick={addModule} className="rounded-xl font-bold">
                            <Plus className="h-4 w-4 mr-1" /> Add Module
                         </Button>
                      </div>
                      
                      <div className="space-y-6">
                         {courseForm.curriculum.map((mod: any, mIdx: number) => (
                           <div key={mIdx} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 relative group">
                              <Button variant="ghost" size="icon" onClick={() => removeModule(mIdx)} className="absolute top-4 right-4 h-8 w-8 text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                 <Trash2 className="h-4 w-4" />
                              </Button>
                              <Input 
                                value={mod.title}
                                onChange={(e) => {
                                  const newCur = [...courseForm.curriculum]
                                  newCur[mIdx].title = e.target.value
                                  setCourseForm({ ...courseForm, curriculum: newCur })
                                }}
                                className="bg-transparent border-none font-black text-lg p-0 h-auto focus-visible:ring-0 mb-4" 
                              />
                              <div className="space-y-3">
                                 {mod.lessons.map((lesson: any, lIdx: number) => (
                                   <div key={lIdx} className="flex gap-4 items-center bg-white p-3 rounded-2xl border border-slate-200">
                                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                         {lesson.type === 'video' ? <Video className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                      </div>
                                      <Input 
                                        value={lesson.title}
                                        onChange={(e) => {
                                          const newCur = [...courseForm.curriculum]
                                          newCur[mIdx].lessons[lIdx].title = e.target.value
                                          setCourseForm({ ...courseForm, curriculum: newCur })
                                        }}
                                        className="bg-transparent border-none font-bold text-sm h-auto focus-visible:ring-0 p-0" 
                                      />
                                   </div>
                                 ))}
                                 <Button variant="ghost" size="sm" onClick={() => addLesson(mIdx)} className="text-[10px] font-black uppercase text-purple-600 hover:bg-purple-50">
                                    + Add Lesson
                                 </Button>
                              </div>
                           </div>
                         ))}
                      </div>
                   </Card>
                </div>

                <div className="space-y-8">
                   <Card className="rounded-[2.5rem] border-none shadow-sm p-8 space-y-6">
                      <h4 className="text-lg font-black tracking-tight">Financials & Media</h4>
                      <div className="space-y-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selling Price (₹)</label>
                            <Input 
                               type="number" 
                               value={courseForm.price}
                               onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                               className="h-12 rounded-xl border-slate-100 font-black" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Feature Image URL</label>
                            <div className="relative">
                               <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                               <Input 
                                 value={courseForm.image}
                                 onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                                 placeholder="https://..." className="h-12 pl-12 rounded-xl border-slate-100 font-bold" 
                               />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                            <Select value={courseForm.category} onValueChange={(v) => setCourseForm({ ...courseForm, category: v })}>
                               <SelectTrigger className="h-12 rounded-xl border-slate-100 font-bold">
                                  <SelectValue placeholder="Select Category" />
                               </SelectTrigger>
                               <SelectContent>
                                  <SelectItem value="engineering">Engineering</SelectItem>
                                  <SelectItem value="medical">Medical</SelectItem>
                                  <SelectItem value="mba">MBA</SelectItem>
                               </SelectContent>
                            </Select>
                         </div>
                      </div>
                   </Card>

                   <Card className="rounded-[2.5rem] border-none shadow-sm p-8">
                      <h4 className="text-lg font-black tracking-tight mb-6">Learning Outcomes</h4>
                      <div className="space-y-4">
                         {courseForm.benefits.map((b: string, i: number) => (
                           <div key={i} className="flex gap-2">
                              <Input 
                                value={b}
                                onChange={(e) => {
                                  const newB = [...courseForm.benefits]
                                  newB[i] = e.target.value
                                  setCourseForm({ ...courseForm, benefits: newB })
                                }}
                                className="rounded-xl border-slate-100 font-medium" 
                              />
                              <Button variant="ghost" size="icon" onClick={() => {
                                const newB = [...courseForm.benefits]; newB.splice(i, 1); setCourseForm({ ...courseForm, benefits: newB });
                              }}><X className="h-4 w-4" /></Button>
                           </div>
                         ))}
                         <Button variant="ghost" size="sm" onClick={() => setCourseForm({ ...courseForm, benefits: [...courseForm.benefits, ''] })} className="w-full rounded-xl border-dashed border-2 h-10 font-bold">
                            + Add Outcome
                         </Button>
                      </div>
                   </Card>
                </div>
              </div>
            )}

            {/* BLOG CREATOR */}
            {view === 'blog-creator' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-8">
                   <Card className="rounded-[2.5rem] border-none shadow-sm p-10 space-y-10">
                      <div className="space-y-4">
                         <Input 
                           placeholder="Enter Catchy Headline..." 
                           value={blogForm.title}
                           onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                           className="h-20 text-4xl font-black tracking-tighter border-none focus-visible:ring-0 p-0" 
                         />
                         <Input 
                           placeholder="article-slug-url" 
                           value={blogForm.slug}
                           onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                           className="h-8 font-bold text-purple-600 bg-purple-50 rounded-lg px-4 border-none w-fit text-sm" 
                         />
                      </div>

                      <div className="space-y-4 pt-10 border-t border-slate-100">
                         <div className="flex items-center gap-4 text-slate-400 mb-2">
                            <Type className="h-5 w-5" />
                            <span className="text-sm font-black uppercase tracking-widest">Article Body Content</span>
                         </div>
                         <Textarea 
                            placeholder="Start writing your master insight here..." 
                            value={blogForm.content}
                            onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                            className="min-h-[600px] text-lg font-medium leading-relaxed border-none focus-visible:ring-0 p-0" 
                         />
                      </div>
                   </Card>
                </div>

                <div className="space-y-8">
                   <Card className="rounded-[3rem] border-none shadow-sm p-8 space-y-8">
                      <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                           <Input 
                             value={blogForm.category}
                             onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                             placeholder="e.g. Admission Tips" className="h-12 rounded-2xl border-slate-100 font-bold" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tags (Comma separated)</label>
                           <Input 
                             value={blogForm.tags}
                             onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                             placeholder="MHT CET, Tips, Engineering" className="h-12 rounded-2xl border-slate-100 font-bold" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Featured Image</label>
                           <div className="aspect-video rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all overflow-hidden">
                              {blogForm.image ? (
                                <img src={blogForm.image} alt="Preview" className="h-full w-full object-cover" />
                              ) : (
                                <>
                                  <ImageIcon className="h-10 w-10 text-slate-300 mb-2" />
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Insert URL</p>
                                </>
                              )}
                              <Input 
                                value={blogForm.image}
                                onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                                placeholder="https://..." className="absolute inset-0 opacity-0 cursor-pointer" 
                              />
                           </div>
                        </div>
                      </div>
                   </Card>

                   <Card className="rounded-[3rem] border-none shadow-sm p-8 space-y-6">
                      <div className="flex items-center gap-2">
                         <Globe className="h-4 w-4 text-purple-600" />
                         <span className="text-sm font-black tracking-tight">SEO Metadata</span>
                      </div>
                      <div className="space-y-4">
                        <Input 
                          placeholder="Meta Title" 
                          value={blogForm.seoTitle}
                          onChange={(e) => setBlogForm({ ...blogForm, seoTitle: e.target.value })}
                          className="rounded-xl border-slate-100 font-bold text-sm" 
                        />
                        <Textarea 
                          placeholder="Meta Description" 
                          value={blogForm.seoDesc}
                          onChange={(e) => setBlogForm({ ...blogForm, seoDesc: e.target.value })}
                          className="rounded-xl border-slate-100 text-xs font-medium" 
                        />
                      </div>
                   </Card>
                </div>
              </div>
            )}

            {/* TEST SERIES CREATOR */}
            {view === 'test-creator' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 space-y-8">
                    <Card className="rounded-[2.5rem] border-none shadow-sm p-10 space-y-10">
                       <div className="space-y-6">
                          <Input 
                            placeholder="Enter Series Title..." 
                            value={testForm.title}
                            onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                            className="h-16 text-3xl font-black tracking-tighter border-none focus-visible:ring-0 p-0" 
                          />
                          <Textarea 
                            placeholder="What makes this test series different? Explain the quality of questions..." 
                            value={testForm.description}
                            onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
                            className="min-h-[150px] rounded-2xl border-slate-100 font-medium leading-relaxed" 
                          />
                       </div>

                       <div className="space-y-6 pt-10 border-t border-slate-100">
                          <div className="flex justify-between items-center">
                             <h4 className="text-lg font-black flex items-center gap-3"><FileText className="h-6 w-6 text-purple-600" /> Tests List</h4>
                             <Button variant="ghost" size="sm" onClick={() => setTestForm({ ...testForm, tests: [...testForm.tests, { name: 'New Test', duration: 180, marks: 300 }] })} className="font-black text-xs uppercase text-purple-600">
                                + Add Individual Test
                             </Button>
                          </div>
                          
                          <div className="space-y-4">
                             {testForm.tests.map((test: any, i: number) => (
                               <div key={i} className="flex flex-col md:flex-row gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100 items-center">
                                  <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-400 text-xs">{i+1}</div>
                                  <Input 
                                    value={test.name}
                                    onChange={(e) => {
                                      const newT = [...testForm.tests]; newT[i].name = e.target.value; setTestForm({ ...testForm, tests: newT });
                                    }}
                                    className="flex-1 rounded-xl bg-transparent border-none font-black text-slate-700" 
                                  />
                                  <div className="flex gap-2 items-center">
                                     <Input 
                                       type="number" value={test.duration} 
                                       onChange={(e) => {
                                         const newT = [...testForm.tests]; newT[i].duration = e.target.value; setTestForm({ ...testForm, tests: newT });
                                       }}
                                       className="w-20 rounded-xl h-10 border-slate-100 font-black text-xs text-center" 
                                     />
                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MINS</span>
                                  </div>
                                  <Button variant="ghost" size="icon" onClick={() => {
                                    const newT = [...testForm.tests]; newT.splice(i, 1); setTestForm({ ...testForm, tests: newT });
                                  }} className="text-red-400"><Trash2 className="h-4 w-4" /></Button>
                               </div>
                             ))}
                          </div>
                       </div>
                    </Card>
                 </div>

                 <div className="space-y-8">
                    <Card className="rounded-[3rem] border-none shadow-sm p-8 space-y-8">
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Exam / Category</label>
                             <Select value={testForm.category} onValueChange={(v) => setTestForm({ ...testForm, category: v })}>
                                <SelectTrigger className="h-12 rounded-xl border-slate-100 font-bold">
                                   <SelectValue placeholder="Select Exam" />
                                </SelectTrigger>
                                <SelectContent>
                                   <SelectItem value="mht-cet">MHT CET</SelectItem>
                                   <SelectItem value="jee-main">JEE Main</SelectItem>
                                   <SelectItem value="neet">NEET UG</SelectItem>
                                </SelectContent>
                             </Select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Launch Price (₹)</label>
                             <Input 
                               type="number" 
                               value={testForm.price}
                               onChange={(e) => setTestForm({ ...testForm, price: e.target.value })}
                               className="h-12 rounded-xl border-slate-100 font-black" 
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cover Image</label>
                             <Input 
                               value={testForm.image}
                               onChange={(e) => setTestForm({ ...testForm, image: e.target.value })}
                               placeholder="https://..." className="h-12 rounded-xl border-slate-100 font-bold" 
                             />
                          </div>
                       </div>
                    </Card>

                    <Card className="rounded-[3rem] border-none shadow-sm p-8">
                       <h4 className="text-lg font-black tracking-tight mb-6">Key Highlights</h4>
                       <div className="space-y-4">
                          {testForm.features.map((f: string, i: number) => (
                            <Input 
                              key={i} value={f} 
                              onChange={(e) => {
                                const newF = [...testForm.features]; newF[i] = e.target.value; setTestForm({ ...testForm, features: newF });
                              }}
                              className="rounded-xl border-slate-100 font-bold text-sm" 
                            />
                          ))}
                          <Button variant="outline" size="sm" onClick={() => setTestForm({ ...testForm, features: [...testForm.features, ''] })} className="w-full rounded-xl border-dashed border-2 h-10 font-bold">+ Add Feature</Button>
                       </div>
                    </Card>
                 </div>
              </div>
            )}

          </div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50 text-black font-sans flex flex-col lg:flex-row">
        
        {/* Desktop Sidebar */}
        <aside className="w-72 border-r border-slate-200 bg-white hidden lg:flex flex-col p-8 fixed h-full z-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-12 w-12 rounded-2xl bg-purple-600 flex items-center justify-center shadow-xl shadow-purple-200">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-black text-xl tracking-tighter text-slate-900">ApnaAdmin</h2>
              <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Highly Permitted</p>
            </div>
          </div>

          <nav className="space-y-1.5 flex-1">
            {[
              { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'users', label: 'Identity Hub', icon: Users },
              { id: 'mentors', label: 'Expert Network', icon: UserCheck },
              { id: 'colleges', label: 'Colleges', icon: School },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
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
            <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-2">Authenticated Owner</p>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              Full permissions enabled. Database synced.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 p-6 md:p-12 min-h-screen">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 text-slate-900 capitalize">{activeTab.replace('-', ' ')}</h1>
              <div className="flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">System Connection Optimized</p>
              </div>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
               <Button onClick={() => setView('course-creator')} className="flex-1 md:flex-none rounded-2xl h-14 px-8 font-black bg-purple-600 text-white shadow-xl shadow-purple-100 hover:scale-[1.02] transition-all">
                  <BookOpen className="mr-2 h-5 w-5" /> Launch Course
               </Button>
               <Button onClick={() => setView('blog-creator')} className="flex-1 md:flex-none rounded-2xl h-14 px-8 font-black bg-black text-white hover:bg-slate-900 shadow-xl transition-all">
                  < Globe className="mr-2 h-5 w-5" /> Post Blog
               </Button>
            </div>
          </header>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-12">
            <TabsContent value="overview" className="space-y-12 m-0">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Gross Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Identity Profiles", value: stats.users, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Expert Mentors", value: stats.mentors, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Registered Colleges", value: stats.colleges, icon: School, color: "text-orange-600", bg: "bg-orange-50" },
                  ].map((stat, i) => (
                    <Card key={i} className="bg-white border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-purple-500/5 transition-all">
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
                  <Card className="lg:col-span-2 bg-white border-slate-100 rounded-[3rem] shadow-sm p-10">
                     <div className="flex justify-between items-center mb-10">
                        <h3 className="text-2xl font-black flex items-center gap-3"><Rocket className="h-7 w-7 text-purple-600" /> Recent Content Launches</h3>
                        <Button variant="ghost" className="font-black text-xs text-purple-600">View All</Button>
                     </div>
                     <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                             <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center"><BookOpen className="h-6 w-6 text-slate-400" /></div>
                                <div>
                                   <p className="font-black text-slate-900">Engineering Mastery Course {i}</p>
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Published 2h ago</p>
                                </div>
                             </div>
                             <Badge className="bg-emerald-100 text-emerald-600 border-none font-black text-[9px] uppercase">Live</Badge>
                          </div>
                        ))}
                     </div>
                  </Card>

                  <Card className="bg-white border-slate-100 rounded-[3rem] shadow-sm p-10">
                     <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><Activity className="h-7 w-7 text-purple-600" /> System Metrics</h3>
                     <div className="space-y-10">
                        <div>
                           <div className="flex justify-between items-center mb-3">
                              <span className="text-sm font-black text-slate-500 uppercase tracking-widest">Storage Efficiency</span>
                              <span className="text-sm font-black text-slate-900">12%</span>
                           </div>
                           <Progress value={12} className="h-3 bg-slate-100" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">API Status</p>
                              <p className="text-xl font-black text-emerald-500">99.9%</p>
                           </div>
                           <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">DB Load</p>
                              <p className="text-xl font-black text-slate-900">Low</p>
                           </div>
                        </div>
                        <Button className="w-full rounded-2xl h-14 font-black border-2 border-slate-100 bg-transparent text-slate-900 hover:bg-slate-50">View Full Diagnostics</Button>
                     </div>
                  </Card>
               </div>
            </TabsContent>

            {activeTab === 'users' && (
               <Card className="bg-white border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
                  <CardHeader className="p-10 border-b border-slate-50 flex justify-between items-center">
                     <div>
                        <CardTitle className="text-2xl font-black">Identity Hub</CardTitle>
                        <p className="text-slate-500 font-medium text-sm mt-1">Manage global user permissions and roles.</p>
                     </div>
                     <div className="relative w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search user..." className="pl-11 rounded-xl h-12 bg-slate-50 border-slate-100" />
                     </div>
                  </CardHeader>
                  <CardContent className="p-0">
                     <div className="overflow-x-auto">
                        <table className="w-full">
                           <thead className="bg-slate-50/50">
                              <tr>
                                 <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">User Identity</th>
                                 <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Security Role</th>
                                 <th className="px-10 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Access Level</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50 text-sm">
                              {users.map((user) => (
                                 <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-10 py-6 flex items-center gap-4">
                                       <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">{user.name?.[0]}</div>
                                       <div>
                                          <p className="font-black text-slate-900">{user.name}</p>
                                          <p className="text-[10px] text-slate-400 font-bold uppercase">{user.email}</p>
                                       </div>
                                    </td>
                                    <td className="px-10 py-6">
                                       <Badge className={`${user.role === 'mentor' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'} border-none font-black text-[9px] uppercase px-2`}>
                                          {user.role}
                                       </Badge>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                       <Button size="sm" variant="outline" onClick={() => changeUserRole(user.id, user.role === 'student' ? 'mentor' : 'student')} className="rounded-xl border-slate-200 text-xs font-black">
                                          Elevate to {user.role === 'student' ? 'Mentor' : 'Student'}
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

            {activeTab === 'colleges' && (
               <div className="space-y-8">
                  <div className="flex justify-between items-center">
                     <h2 className="text-2xl font-black">Institute Database</h2>
                     <Button className="rounded-2xl h-12 px-8 font-black bg-purple-600 text-white" onClick={() => setView('college-creator')}>
                        + Add New College
                     </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {colleges.map(college => (
                        <Card key={college.id} className="bg-white border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all">
                           <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-6">
                              <School className="h-6 w-6" />
                           </div>
                           <h3 className="text-xl font-black mb-1">{college.name}</h3>
                           <p className="text-slate-500 font-bold text-sm mb-6">{college.city}, {college.state}</p>
                           <Button variant="outline" className="w-full rounded-xl font-black text-xs border-slate-100 h-12">Edit College Page</Button>
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
