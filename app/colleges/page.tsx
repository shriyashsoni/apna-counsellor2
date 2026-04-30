"use client"

import { useState, useEffect } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  Filter, 
  MapPin, 
  GraduationCap, 
  TrendingUp, 
  ChevronRight, 
  ArrowRight,
  GitCompare,
  Building2,
  Trophy,
  DollarSign
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const CATEGORIES = ["All", "IIT", "NIT", "IIIT", "Government", "Private"];
const STATES = ["All", "Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Uttar Pradesh", "Gujarat", "Rajasthan", "West Bengal", "Madhya Pradesh"];
const RANKINGS = ["All", "Top 50", "Top 100", "Top 200", "Top 500"];

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

export default function CollegesPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading search...</div>}>
      <CollegesList />
    </Suspense>
  )
}

function CollegesList() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedRanking, setSelectedRanking] = useState(searchParams.get("ranking") || "All");


  // Debounce search to prevent spamming the database
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const colleges = useQuery(api.colleges.list, {
    search: debouncedSearchTerm,
    category: selectedCategory,
    state: selectedState,
    ranking: selectedRanking
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Hero / Search Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1 md:mb-2">Explore Institutions</h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium">Discover 70,000+ colleges across India & Abroad</p>
            </div>
            <div className="flex gap-2 md:gap-3 w-full md:w-auto">
              <Link href="/compare" className="flex-1 md:flex-none">
                <Button variant="outline" className="w-full rounded-xl md:rounded-2xl h-10 md:h-12 gap-2 border-slate-200 dark:border-slate-800 font-bold text-xs md:text-sm">
                  <GitCompare className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Compare
                </Button>
              </Link>
              <Link href="/predictor" className="flex-1 md:flex-none">
                <Button className="w-full rounded-xl md:rounded-2xl h-10 md:h-12 gap-2 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 text-xs md:text-sm">
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                  Predictor
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search by name, city or AISHE code..." 
                className="pl-12 h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl shadow-inner focus:ring-2 focus:ring-primary/20 text-lg transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Category</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">State</label>
                <select 
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                >
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Ranking</label>
                <select 
                  value={selectedRanking}
                  onChange={(e) => setSelectedRanking(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                >
                  {RANKINGS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 hidden lg:block space-y-8">
            <Card className="border-none rounded-[2.5rem] shadow-sm bg-primary/5 p-8 sticky top-64 overflow-hidden group">
              <div className="absolute -top-10 -right-10 h-32 w-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
              <div className="relative z-10">
                <Trophy className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-black mb-2">Need Guidance?</h3>
                <p className="text-sm text-slate-500 font-medium mb-6">Talk to our experts to find the perfect college for your rank.</p>
                <Link href="/mentors">
                  <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 font-black shadow-lg shadow-primary/20">
                    Book Session
                  </Button>
                </Link>
              </div>
            </Card>
          </aside>

          {/* Results List */}
          <main className="lg:col-span-9">
            <div className="flex justify-between items-center mb-6 md:mb-8 px-2">
              <p className="text-xs md:text-sm text-slate-500 font-bold">
                Showing {colleges?.length || 0} Institutions
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Sort by:</span>
                <select className="bg-transparent border-none text-[10px] md:text-sm font-bold text-primary focus:ring-0 cursor-pointer">
                  <option>Popularity</option>
                  <option>Ranking</option>
                  <option>Fees</option>
                </select>
              </div>
            </div>

            {colleges === undefined ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-48 md:h-64 rounded-[1.5rem] md:rounded-[2.5rem] bg-white dark:bg-slate-900 animate-pulse" />
                ))}
              </div>
            ) : (!colleges || colleges.length === 0) && searchTerm.trim() === "" && selectedCategory === "All" ? (

              <div className="text-center py-16 md:py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border-none shadow-sm">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-black mb-3">Explore 70,000+ Colleges</h3>
                <p className="text-slate-500 font-medium max-w-md mx-auto">
                  Type a college name above or select a category like IIT or NIT to instantly find verified admission data, cutoffs, and fees.
                </p>
              </div>
            ) : !colleges || colleges.length === 0 ? (
              <div className="text-center py-12 md:py-20 bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 md:h-10 md:w-10 text-slate-300" />
                </div>
                <h3 className="text-xl md:text-2xl font-black mb-1 md:mb-2">No Colleges Found</h3>
                <p className="text-sm md:text-base text-slate-500 font-medium">Try adjusting your filters or search keywords.</p>
              </div>
            ) : (
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
              >
                {colleges.map((college) => (
                  <motion.div key={college._id} variants={item}>
                    <Link href={`/college/${college._id}`}>
                      <Card className="h-full border-none rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 group hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        <CardContent className="p-5 md:p-8">
                          <div className="flex justify-between items-start mb-4 md:mb-6">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Building2 className="h-5 w-5 md:h-6 md:w-6" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[8px] md:text-[9px] font-black uppercase tracking-wider text-slate-500">
                                    {college.type || "Private"}
                                  </span>
                                  {college.nirfRank && (
                                    <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-[8px] md:text-[9px] font-black uppercase tracking-wider text-orange-500 border border-orange-500/10">
                                      NIRF #{college.nirfRank}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full text-slate-300 group-hover:text-primary transition-colors">
                              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                            </Button>
                          </div>

                          <h3 className="text-lg md:text-xl font-black mb-1 md:mb-2 text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {college.name}
                          </h3>
                          <div className="flex items-center gap-2 text-slate-400 mb-4 md:mb-6 font-medium text-[10px] md:text-sm">
                            <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                            {college.city ? `${college.city}, ${college.state}` : (college.location || "Location Unknown")}
                          </div>

                          <div className="grid grid-cols-2 gap-3 md:gap-4 pt-4 md:pt-6 border-t border-slate-50 dark:border-slate-800">
                            <div>
                              <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                <DollarSign className="h-2 w-2 md:h-3 md:w-3" /> Fee
                              </p>
                              <p className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300">{college.annualFee || "₹2.5L"}</p>
                            </div>
                            <div>
                              <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                <Trophy className="h-2 w-2 md:h-3 md:w-3" /> Package
                              </p>
                              <p className="text-xs md:text-sm font-bold text-emerald-500">{college.avgPackage || "₹12 LPA"}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

