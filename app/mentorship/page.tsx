"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  Star, 
  MapPin, 
  ChevronRight, 
  CheckCircle2,
  Filter,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

const SKILLS = ['JEE Advanced', 'JEE Mains', 'MHT-CET', 'COMEDK', 'Programming', 'Career Guidance'];
const COUNSELING_TYPES = ['JoSAA', 'MHT-CET', 'CSAB', 'JAC Delhi', 'COMEDK'];

export default function MentorshipPage() {
  const [search, setSearch] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [mentors, setMentors] = useState<any[] | undefined>(undefined);
  const supabase = createClient();

  useEffect(() => {
    async function fetchMentors() {
      let query = supabase.from("profiles").select("*").eq("role", "mentor").eq("is_visible", true);
      
      if (search) {
        query = query.ilike("name", `%${search}%`);
      }
      
      const { data } = await query;
      
      // Client-side filtering
      let filtered = data || [];
      if (selectedSkill) {
        filtered = filtered.filter(m => m.skills?.includes(selectedSkill));
      }
      if (selectedType) {
        filtered = filtered.filter(m => m.counseling_type?.includes(selectedType));
      }
      
      setMentors(filtered);
    }
    fetchMentors();
  }, [search, selectedSkill, selectedType]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="mb-12 relative overflow-hidden rounded-[3rem] bg-primary p-8 md:py-10 md:px-12 text-white shadow-2xl shadow-primary/20">
          <div className="relative z-10 max-w-2xl">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none px-4 py-1 rounded-full mb-4 backdrop-blur-md">
              Top 1% Mentors Only
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-tight">
              Learn from those who have <span className="text-indigo-200">Already Conquered.</span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 font-medium mb-6">
              Connect with IITians, NITians, and Industry Experts for personalized 1-on-1 guidance.
            </p>
            <div className="flex flex-wrap gap-4">
               <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
                  <CheckCircle2 className="h-5 w-5 text-indigo-200" />
                  <span className="font-bold text-sm">Verified Experts</span>
               </div>
               <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
                  <Users className="h-5 w-5 text-indigo-200" />
                  <span className="font-bold text-sm">5000+ Students Guided</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-80 space-y-8">
             <div className="sticky top-24">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Search Experts</h3>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input 
                        placeholder="Name, College, Branch..."
                        className="h-14 pl-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Focus Areas</h3>
                    <div className="flex flex-wrap lg:flex-col gap-2">
                      {SKILLS.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => setSelectedSkill(selectedSkill === skill ? '' : skill)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${
                            selectedSkill === skill 
                              ? "bg-primary text-white shadow-lg shadow-primary/20" 
                              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800"
                          }`}
                        >
                          {skill}
                          {selectedSkill === skill && <CheckCircle2 className="h-4 w-4" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Counseling Type</h3>
                    <div className="flex flex-wrap lg:flex-col gap-2">
                      {COUNSELING_TYPES.map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedType(selectedType === type ? '' : type)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${
                            selectedType === type 
                              ? "bg-primary text-white shadow-lg shadow-primary/20" 
                              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800"
                          }`}
                        >
                          {type}
                          {selectedType === type && <CheckCircle2 className="h-4 w-4" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Card className="rounded-[2rem] bg-indigo-500/10 border-indigo-500/20 p-6">
                     <h4 className="font-black text-indigo-700 dark:text-indigo-400 mb-2">Need Help Choosing?</h4>
                     <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                       Take our AI Assessment to find the perfect mentor for your career goals.
                     </p>
                     <Button variant="outline" className="w-full rounded-xl border-indigo-500/20 text-indigo-600 font-bold text-xs bg-white dark:bg-slate-900">
                        Start Assessment
                     </Button>
                  </Card>
                </div>
             </div>
          </aside>

          {/* Mentor Grid */}
          <main className="flex-1">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black tracking-tight">
                  {mentors ? `${mentors.length} Experts Available` : 'Searching Experts...'}
                </h2>
                <div className="flex items-center gap-2">
                   <Button variant="ghost" size="sm" className="rounded-xl font-bold text-slate-500">
                      Sort by: Rating
                   </Button>
                </div>
             </div>

             <div className="grid sm:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {mentors === undefined ? (
                    [1,2,3,4].map(i => (
                      <div key={i} className="h-80 rounded-[2.5rem] bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    ))
                  ) : !mentors || mentors.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                       <Users className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                       <h3 className="text-xl font-black mb-2">No experts found</h3>
                       <p className="text-slate-500 font-medium">Try adjusting your filters or search terms.</p>
                    </div>
                  ) : (
                    mentors.map((mentor: any, i: number) => (
                      <motion.div
                        key={mentor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        layout
                        className="h-full"
                      >
                        <Card className="group relative h-full flex flex-col border-none rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                           <CardContent className="p-8 flex flex-col flex-1">
                              <div className="flex justify-between items-start mb-6">
                                 <div className="relative h-20 w-20 rounded-3xl overflow-hidden shadow-xl ring-4 ring-slate-50 dark:ring-slate-800">
                                    <Image 
                                       src={mentor.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.name}`} 
                                       alt={mentor.name}
                                       fill
                                       className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                 </div>
                                 <div className="flex flex-col items-end gap-2">
                                    {mentor.cal_link && (
                                       <Badge className="bg-emerald-500 text-white border-none px-2 py-0.5 rounded-lg flex gap-1 font-black text-[9px] animate-pulse">
                                          <div className="h-1.5 w-1.5 bg-white rounded-full" /> LIVE
                                       </Badge>
                                    )}
                                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-xl">
                                       <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                       <span className="font-black text-amber-700 dark:text-amber-400 text-sm">{mentor.rating || '4.9'}</span>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">{mentor.reviews || 0} Reviews</p>
                                 </div>
                              </div>

                              <div className="space-y-4 flex flex-col flex-1">
                                 <div>
                                    <div className="flex items-center gap-2">
                                       <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">{mentor.name}</h3>
                                       {mentor.verified !== false && <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />}
                                    </div>
                                    <p className="text-slate-500 font-bold text-sm mt-1 line-clamp-2 min-h-[40px]">{mentor.headline || 'Senior Career Mentor'}</p>
                                 </div>

                                 <div className="flex items-start gap-2 text-slate-400 font-medium text-xs">
                                    <GraduationCap className="h-4 w-4 shrink-0 mt-0.5" />
                                    <span className="line-clamp-2">{mentor.college} · {mentor.branch}</span>
                                 </div>

                                 <div className="flex flex-wrap gap-2">
                                    {mentor.counseling_type?.map((type: string) => (
                                       <Badge key={type} className="rounded-lg px-2 py-0.5 text-[10px] font-black bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 border-none">
                                          {type}
                                       </Badge>
                                    ))}
                                    {mentor.skills?.slice(0, 2).map((skill: string) => (
                                       <Badge key={skill} variant="secondary" className="rounded-lg px-2 py-0.5 text-[10px] font-black bg-slate-50 dark:bg-slate-800 text-slate-500 border-none">
                                          {skill}
                                       </Badge>
                                    ))}
                                 </div>

                                 <div className="flex-1" />

                                 <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between mt-auto">
                                    <div>
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</p>
                                       <p className="text-lg font-black text-slate-900 dark:text-white">₹{mentor.pricing || 499}<span className="text-sm font-bold text-slate-400">/session</span></p>
                                    </div>
                                    <Link href={`/mentor/${mentor.slug || mentor.id}`}>
                                       <Button className="rounded-2xl font-black gap-2 shadow-lg shadow-primary/20 shrink-0">
                                          View Profile <ArrowRight className="h-4 w-4" />
                                       </Button>
                                    </Link>
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
             </div>
          </main>

        </div>
      </div>
    </div>
  )
}
