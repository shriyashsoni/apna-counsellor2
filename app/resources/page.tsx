"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowDown, ArrowRight, BookOpen, CheckCircle, FileText, List, ExternalLink, Globe, GraduationCap, ShieldCheck, Sparkles, Search } from "lucide-react"
import { motion } from "framer-motion"

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const counselingsData = useQuery(api.counselings.listCounselings)

  if (counselingsData === undefined) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">Loading verified resources...</p>
      </div>
    )
  }

  const counselings = counselingsData.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.region.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Categorize for better UI
  const engineering = counselings.filter(c => c.category?.includes("Engineering") || c.name.includes("CET") || c.name.includes("JAC"))
  const medical = counselings.filter(c => c.category?.includes("Medical") || c.name.includes("NEET"))
  const other = counselings.filter(c => !engineering.includes(c) && !medical.includes(c))


  const categories = [
    { title: "Engineering Counselings", data: engineering, icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Medical Counselings", data: medical, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "Regional & Other Portals", data: other, icon: Globe, color: "text-purple-500", bg: "bg-purple-50" },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center space-y-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-black uppercase tracking-widest"
          >
            <Sparkles className="h-4 w-4" /> 200+ Verified Resources
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
            Official <span className="text-primary">Resource</span> Hub
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium mb-8">
            Access the most comprehensive directory of admission portals, official cutoffs, and document checklists verified by our experts.
          </p>
          
          {/* Search Panel */}
          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for counseling, state, or exam (e.g., MHT-CET, NEET, Delhi)..."
              className="w-full h-16 pl-12 pr-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-transparent focus:border-primary/20 shadow-sm outline-none text-lg font-medium transition-all focus:shadow-md"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="space-y-24">
          {categories.map((cat, i) => (
            cat.data.length > 0 && (
              <section key={i} className="space-y-8">
                <div className="flex items-center gap-4 px-2">
                  <div className={`h-12 w-12 rounded-2xl ${cat.bg} dark:bg-slate-800 flex items-center justify-center ${cat.color}`}>
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">{cat.title}</h2>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{cat.data.length} Portals Listed</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cat.data.map((item: any, idx: number) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 h-full flex flex-col group hover:shadow-xl transition-all duration-300">
                        <CardHeader className="p-8 pb-4 flex-grow">
                          <div className="flex justify-between items-start mb-6">
                            <div className="px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">
                              {item.region || "National"}
                            </div>
                            <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                              <CheckCircle className="h-4 w-4" />
                            </div>
                          </div>
                          <CardTitle className="text-xl font-black leading-tight group-hover:text-primary transition-colors">
                            {item.name}
                          </CardTitle>
                          <p className="text-slate-500 dark:text-slate-400 text-sm mt-4 font-medium line-clamp-2">
                            {item.description || `Official counselling portal for ${item.name} admissions.`}
                          </p>
                        </CardHeader>
                        <CardFooter className="p-8 pt-4 flex flex-col gap-4">
                          {item.links && item.links.length > 0 && (
                            <div className="w-full space-y-2">
                              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Key Resources</p>
                              <div className="grid grid-cols-1 gap-2">
                                {item.links.map((link: any, lIdx: number) => (
                                  <Link key={lIdx} href={link.url} target="_blank" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 hover:border-primary/20 hover:bg-white dark:hover:bg-slate-900 transition-all group/link">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-3 w-3 text-slate-400 group-hover/link:text-primary" />
                                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 group-hover/link:text-primary">{link.label}</span>
                                    </div>
                                    <ExternalLink className="h-3 w-3 text-slate-300 opacity-0 group-hover/link:opacity-100 transition-all" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                          <Link href={item.officialUrl || "#"} target="_blank" className="w-full">
                            <Button className="w-full h-12 rounded-xl bg-primary text-white hover:bg-primary/90 font-black shadow-lg shadow-primary/20 transition-all">
                              Visit Official Site <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </section>
            )
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          {[
            { icon: FileText, title: "Official Cutoffs", desc: "Download verified last-round closing ranks for all major colleges." },
            { icon: List, title: "Document Lists", desc: "Category-wise checklists for smooth physical and online reporting." },
            { icon: ArrowDown, title: "PDF Resources", desc: "Information brochures and seat matrix summaries for 200+ counselings." },
          ].map((feature, i) => (
            <Card key={i} className="border-none rounded-[3rem] p-10 bg-white dark:bg-slate-900 shadow-sm text-center space-y-6">
              <div className="h-16 w-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </Card>
          ))}
        </div>

        {/* Support Section */}
        <Card className="mt-32 border-none rounded-[4rem] bg-primary p-12 md:p-20 text-white relative overflow-hidden shadow-2xl shadow-primary/30">
          <div className="absolute top-0 right-0 p-20 opacity-10 rotate-12">
            <Sparkles className="h-64 w-64" />
          </div>
          <div className="relative z-10 max-w-3xl space-y-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Can't find a specific resource?</h2>
            <p className="text-white/80 text-xl font-medium">
              Our team of experts is constantly researching and adding new data. If you need something specific, let us know and we'll prioritize it for you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="https://wa.link/cld3hu" target="_blank">
                <Button className="h-14 px-10 rounded-2xl bg-white text-primary hover:bg-slate-50 font-black text-lg">
                  Request Resource <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/book-call">
                <Button variant="outline" className="h-14 px-10 rounded-2xl border-white/20 text-white hover:bg-white/10 font-black text-lg">
                  Book Expert Call
                </Button>
              </Link>
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
}
