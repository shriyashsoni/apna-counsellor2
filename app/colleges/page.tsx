"use client"

import { useState } from "react"
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

const COLLEGE_TYPES = ["All", "IIT", "NIT", "IIIT", "Government", "Private"];

export default function CollegesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const colleges = useQuery(api.colleges.list, {
    search: searchTerm,
    type: selectedType === "All" ? undefined : selectedType
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
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Explore Institutions</h1>
              <p className="text-slate-500 font-medium">Discover 50,000+ colleges across India & Abroad</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Link href="/compare" className="flex-1 md:flex-none">
                <Button variant="outline" className="w-full rounded-2xl h-12 gap-2 border-slate-200 dark:border-slate-800 font-bold">
                  <GitCompare className="h-5 w-5 text-primary" />
                  Compare
                </Button>
              </Link>
              <Link href="/predictor" className="flex-1 md:flex-none">
                <Button className="w-full rounded-2xl h-12 gap-2 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20">
                  <TrendingUp className="h-5 w-5" />
                  Predictor
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search by name, city or AISHE code..." 
                className="pl-12 h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl shadow-inner focus:ring-2 focus:ring-primary/20 text-lg transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {COLLEGE_TYPES.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  onClick={() => setSelectedType(type)}
                  className={`rounded-xl h-14 px-6 font-bold transition-all whitespace-nowrap ${
                    selectedType === type ? "shadow-lg shadow-primary/20" : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
                  }`}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3 hidden lg:block space-y-8">
            <Card className="border-none rounded-[2rem] shadow-sm bg-white dark:bg-slate-900 p-8 sticky top-44">
              <div className="flex items-center gap-3 mb-6">
                <Filter className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-black">Refine Search</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">NIRF Ranking</label>
                  <div className="space-y-2">
                    {["Top 10", "Top 50", "Top 100"].map(r => (
                      <label key={r} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                        <div className="h-5 w-5 rounded border border-slate-300 flex items-center justify-center" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{r}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Popular States</label>
                  <div className="space-y-2">
                    {["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi"].map(s => (
                      <label key={s} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                        <div className="h-5 w-5 rounded border border-slate-300 flex items-center justify-center" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Results List */}
          <main className="lg:col-span-9">
            <div className="flex justify-between items-center mb-8 px-2">
              <p className="text-slate-500 font-bold">
                Showing {colleges?.length || 0} Institutions
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Sort by:</span>
                <select className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer">
                  <option>Popularity</option>
                  <option>Ranking</option>
                  <option>Fees</option>
                </select>
              </div>
            </div>

            {colleges === undefined ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-64 rounded-[2.5rem] bg-white dark:bg-slate-900 animate-pulse" />
                ))}
              </div>
            ) : !colleges || colleges.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                <div className="h-20 w-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-black mb-2">No Colleges Found</h3>
                <p className="text-slate-500 font-medium">Try adjusting your filters or search keywords.</p>
              </div>
            ) : (
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid md:grid-cols-2 gap-6"
              >
                {colleges.map((college) => (
                  <motion.div key={college._id} variants={item}>
                    <Link href={`/college/${college._id}`}>
                      <Card className="h-full border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 group hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        <CardContent className="p-8">
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Building2 className="h-6 w-6" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] font-black uppercase tracking-wider text-slate-500">
                                    {college.type || "Private"}
                                  </span>
                                  {college.nirfRank && (
                                    <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-[9px] font-black uppercase tracking-wider text-orange-500 border border-orange-500/10">
                                      NIRF #{college.nirfRank}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full text-slate-300 group-hover:text-primary transition-colors">
                              <ChevronRight className="h-6 w-6" />
                            </Button>
                          </div>

                          <h3 className="text-xl font-black mb-2 text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors">
                            {college.shortName || college.name}
                          </h3>
                          <div className="flex items-center gap-2 text-slate-400 mb-6 font-medium text-sm">
                            <MapPin className="h-4 w-4" />
                            {college.city ? `${college.city}, ${college.state}` : (college.location || "Location Unknown")}
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50 dark:border-slate-800">
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                <DollarSign className="h-3 w-3" /> Annual Fee
                              </p>
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{college.annualFee || "₹2.5L - 4L"}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                <Trophy className="h-3 w-3" /> Avg Package
                              </p>
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 text-emerald-500">{college.avgPackage || "₹12.5 LPA"}</p>
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
