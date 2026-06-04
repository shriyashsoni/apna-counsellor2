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
    { title: "JoSAA 2024 Cutoff PDF", category: "Cutoffs", type: "PDF", icon: FileText, color: "blue" },
    { title: "MHT-CET Preference List", category: "Counseling", type: "Sheet", icon: BookOpen, color: "purple" },
    { title: "Top NITs Placement Report", category: "Placements", type: "PDF", icon: Trophy, color: "orange" },
    { title: "How to choose a branch?", category: "Guidance", type: "Video", icon: Video, color: "emerald" },
    { title: "JEE Advanced 2025 Strategy", category: "Strategy", type: "PDF", icon: Sparkles, color: "indigo" },
    { title: "BITS Pilani Iteration Guide", category: "Counseling", type: "PDF", icon: FileText, color: "rose" },
    { title: "State-wise Seat Matrix", category: "Data", type: "Sheet", icon: BookOpen, color: "amber" },
    { title: "Counseling Documents Checklist", category: "Guidance", type: "PDF", icon: CheckCircle2, color: "blue" },
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

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         res.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "All" || res.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <Sparkles className="h-4 w-4" /> Exclusive Student Resources
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Unlock your <span className="text-primary">Success.</span>
          </h1>
          
          {/* Search & Filter Bar */}
          <div className="max-w-3xl mx-auto mt-12 space-y-8">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search for cutoffs, preference lists, or topics..." 
                className="h-16 pl-16 pr-12 rounded-2xl border-none shadow-2xl bg-white dark:bg-slate-900 text-lg font-medium focus:ring-2 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-xl px-6 h-10 font-bold text-xs transition-all ${
                    activeCategory === cat ? "shadow-lg shadow-primary/20" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                  }`}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredResources.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400"
              >
                <Search className="h-16 w-16 mb-4 opacity-20" />
                <p className="text-xl font-bold">No resources match your search</p>
                <Button variant="link" onClick={() => {setSearchQuery(""); setActiveCategory("All")}}>Clear all filters</Button>
              </motion.div>
            ) : (
              filteredResources.map((res, i) => (
                <motion.div
                  key={res.title}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 hover:shadow-2xl hover:shadow-primary/5 transition-all group overflow-hidden">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className={`h-16 w-16 rounded-3xl mb-8 flex items-center justify-center ${colorMap[res.color] || colorMap.blue} group-hover:scale-110 transition-transform`}>
                        {/* Fallback to FileText if icon is missing */}
                        {res.icon ? <res.icon className="h-8 w-8" /> : <FileText className="h-8 w-8" />}
                      </div>
                      <Badge variant="outline" className="w-fit mb-4 rounded-xl px-3 py-1 font-black text-[10px] tracking-widest bg-slate-50 dark:bg-slate-800 uppercase border-none text-slate-400">
                        {res.category}
                      </Badge>
                      <h3 className="text-xl font-black mb-4 group-hover:text-primary transition-colors leading-tight">
                        {res.title}
                      </h3>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                          <Download className="h-3 w-3" /> {res.type}
                        </span>
                        <Button variant="ghost" size="sm" className="rounded-xl font-black text-xs text-primary gap-1 group-hover:bg-primary/5">
                          Download <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
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


