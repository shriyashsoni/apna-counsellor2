"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  BookOpen, 
  Download, 
  FileText, 
  Video, 
  ArrowRight,
  Sparkles,
  Trophy,
  Users,
  Search,
  Filter,
  X,
  Globe,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { allResources } from "@/lib/data/counseling-resources"

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const iconMap: Record<string, any> = {
    Globe,
    FileText,
    BookOpen,
    CheckCircle: CheckCircle2,
    Video,
    Sparkles,
    Trophy
  }

  const generatedResources = allResources.map(r => ({
    ...r,
    icon: iconMap[r.iconName as string] || FileText
  }))

  const resources = [
    { title: "JoSAA 2024 Cutoff PDF", category: "Cutoffs", type: "PDF", icon: FileText, color: "blue", link: "https://josaa.admissions.nic.in/applicant/seatmatrix/cutoff.aspx" },
    { title: "MHT-CET Preference List", category: "Counseling", type: "Sheet", icon: BookOpen, color: "purple", link: "https://cetcell.mahacet.org" },
    { title: "Top NITs Placement Report", category: "Placements", type: "PDF", icon: Trophy, color: "orange", link: "https://www.shiksha.com/b-tech/articles/nits-placements-highest-average-salary-packages-top-recruiters-blogId-25159" },
    { title: "How to choose a branch?", category: "Guidance", type: "Video", icon: Video, color: "emerald", link: "https://www.youtube.com/watch?v=M9p7H2pBfWk" },
    { title: "JEE Advanced 2025 Strategy", category: "Strategy", type: "PDF", icon: Sparkles, color: "indigo", link: "https://jeeadv.ac.in/" },
    { title: "BITS Pilani Iteration Guide", category: "Counseling", type: "PDF", icon: FileText, color: "rose", link: "https://www.bitsadmission.com/bitsat/2023/BITSAT-2023-Iteration-1.pdf" },
    { title: "State-wise Seat Matrix", category: "Data", type: "Sheet", icon: BookOpen, color: "amber", link: "https://www.collegepravesh.com/seat-matrix/" },
    { title: "Counseling Documents Checklist", category: "Guidance", type: "PDF", icon: CheckCircle2, color: "blue", link: "https://josaa.nic.in/document-requirement/" },
    ...generatedResources
  ].map(r => ({...r, color: r.color || "blue"}))

  // Mapping dynamic colors to Tailwind safe classes to avoid build issues
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-500",
    purple: "bg-purple-500/10 text-purple-500",
    orange: "bg-orange-500/10 text-orange-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    indigo: "bg-indigo-500/10 text-indigo-500",
    rose: "bg-rose-500/10 text-rose-500",
    amber: "bg-amber-500/10 text-amber-500",
  }

  const categories = ["All", ...Array.from(new Set(resources.map(r => r.category)))]

  // We only filter by activeCategory since search is now specifically for the sidebar categories
  const filteredResources = resources.filter(res => {
    const matchesCategory = activeCategory === "All" || res.category === activeCategory
    return matchesCategory
  })

  // Group resources by category for the new "underlined topic" format
  const groupedResources = filteredResources.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, typeof resources>);

  // Filter sidebar categories by search
  const visibleCategories = categories.filter(cat => 
    cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4"
          >
            <Sparkles className="h-4 w-4" /> Official Materials
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Counseling <span className="text-primary">Resources.</span>
          </h1>
          <p className="text-slate-500 font-medium">Access official cutoffs, seat matrices, and documents for all major Indian counselings.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Area */}
          <aside className="w-full lg:w-80 shrink-0 space-y-8">
            <div className="sticky top-24 bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200/20 dark:shadow-none border border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Search Counselings</h3>
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  placeholder="e.g. JoSAA, MHT CET..."
                  className="h-12 pl-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-sm font-bold text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Select Topic</h3>
              <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {visibleCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${
                      activeCategory === cat 
                        ? "bg-primary text-white shadow-md shadow-primary/20" 
                        : "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {cat}
                    {activeCategory === cat && <CheckCircle2 className="h-4 w-4" />}
                  </button>
                ))}
                {visibleCategories.length === 0 && (
                  <p className="text-slate-400 text-sm font-medium text-center py-4">No counselings found.</p>
                )}
              </div>
            </div>
          </aside>

          {/* Main Resources Content */}
          <main className="flex-1 min-h-[500px]">
            <AnimatePresence mode="popLayout">
              {Object.keys(groupedResources).length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 h-full"
                >
                  <Search className="h-16 w-16 mb-4 opacity-20" />
                  <p className="text-xl font-bold">No resources available</p>
                </motion.div>
              ) : (
                <div className="space-y-16">
                  {Object.entries(groupedResources).map(([category, items]) => (
                    <motion.div 
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white underline decoration-primary decoration-4 underline-offset-8 uppercase tracking-tight">
                        {category} Official Materials
                      </h2>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {items.map((res, i) => (
                          <Card key={i} className="border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all group overflow-hidden">
                            <CardContent className="p-4 sm:p-6 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4 min-w-0">
                                <div className={`h-12 w-12 shrink-0 rounded-xl flex items-center justify-center ${colorMap[res.color] || colorMap.blue} group-hover:scale-110 transition-transform`}>
                                  {res.icon ? <res.icon className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">
                                    {res.title}
                                  </h3>
                                  <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mt-1">
                                    <Download className="h-3 w-3" /> {res.type}
                                  </span>
                                </div>
                              </div>
                              {res.link ? (
                                <a href={res.link} target="_blank" rel="noopener noreferrer" className="shrink-0">
                                  <Button variant="ghost" size="icon" className="rounded-xl text-primary hover:bg-primary/10 h-10 w-10">
                                    <ArrowRight className="h-5 w-5" />
                                  </Button>
                                </a>
                              ) : (
                                <Button variant="ghost" size="icon" className="shrink-0 rounded-xl text-primary hover:bg-primary/10 h-10 w-10">
                                  <ArrowRight className="h-5 w-5" />
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </main>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-12 rounded-[3rem] bg-slate-900 text-white text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Users className="h-40 w-40" />
          </div>
          <h2 className="text-3xl font-black mb-4 relative z-10">Join 10,000+ Students</h2>
          <p className="text-slate-400 font-medium max-w-md mx-auto mb-8 relative z-10">
            Get instant access to all premium resources, predictors, and one-on-one mentorship sessions.
          </p>
          <Button className="rounded-2xl h-14 px-10 font-black shadow-xl shadow-primary/20 relative z-10 bg-primary hover:bg-primary/90 text-white">
            Get Full Access Now
          </Button>
        </motion.div>

      </div>
    </div>
  )
}


