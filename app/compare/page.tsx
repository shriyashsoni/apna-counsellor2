"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  X, 
  ArrowRight, 
  ArrowLeft,
  Search,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  GraduationCap,
  MapPin,
  Banknote,
  Briefcase
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

const METRICS = [
  { key: 'nirfRank', label: 'NIRF Rank', icon: <TrendingUp className="h-4 w-4" />, fmt: (v: any) => v ? `#${v}` : 'N/A' },
  { key: 'type', label: 'Institution Type', icon: <GraduationCap className="h-4 w-4" />, fmt: (v: any) => v },
  { key: 'state', label: 'Location / State', icon: <MapPin className="h-4 w-4" />, fmt: (v: any) => v },
  { key: 'annualFee', label: 'Annual Fees', icon: <Banknote className="h-4 w-4" />, fmt: (v: any) => v ? `₹${v}` : 'N/A' },
  { key: 'avgPackage', label: 'Avg Package', icon: <Briefcase className="h-4 w-4" />, fmt: (v: any) => v ? `₹${v}` : 'N/A' },
  { key: 'highestPackage', label: 'Highest Pkg', icon: <TrendingUp className="h-4 w-4" />, fmt: (v: any) => v ? `₹${v}` : 'N/A' },
];

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<any[]>([])
  const [search, setSearch] = useState('')

  // This is a simplified fetch - ideally we'd have a search query
  const allColleges = useQuery(api.colleges.predict, { exam: "JEE MAINS", category: "General" });
  const comparedColleges = useQuery(api.colleges.getByIds, { ids: selectedIds });

  const toggleSelect = (id: any) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id))
    } else if (selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id])
    }
  }

  const filteredColleges = allColleges?.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.shortName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <Link href="/dashboard">
             <Button variant="ghost" className="mb-6 gap-2 text-slate-500 hover:text-primary rounded-xl">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
             </Button>
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
             <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Compare Colleges</h1>
                <p className="text-slate-500 font-medium mt-1">Side-by-side analysis for smarter decisions.</p>
             </div>
             <div className="flex gap-4">
                {selectedIds.length > 0 && (
                  <Button variant="ghost" onClick={() => setSelectedIds([])} className="rounded-xl font-bold text-red-500 hover:bg-red-50">
                    Clear Selection
                  </Button>
                )}
                <Badge className="h-12 px-6 rounded-2xl bg-primary text-white text-sm font-black flex items-center gap-2">
                   {selectedIds.length} / 4 Selected
                </Badge>
             </div>
          </div>
        </div>

        {selectedIds.length < 2 && (
           <div className="mb-12 space-y-8">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
                <Input 
                  placeholder="Search by college name or short name..."
                  className="h-20 pl-16 rounded-[2rem] text-xl font-bold shadow-2xl shadow-slate-200/50 dark:shadow-none border-none bg-white dark:bg-slate-900"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                 {filteredColleges === undefined ? (
                   [1,2,3,4,5].map(i => <div key={i} className="h-32 rounded-[2rem] bg-slate-200 dark:bg-slate-800 animate-pulse" />)
                 ) : (
                   filteredColleges.map((c: any) => (
                     <button
                       key={c.id}
                       onClick={() => toggleSelect(c.id)}
                       className={`p-6 rounded-[2rem] text-left transition-all ${
                         selectedIds.includes(c.id)
                           ? "bg-primary text-white shadow-xl shadow-primary/30"
                           : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800"
                       }`}
                     >
                       <p className="font-black text-lg leading-tight mb-1">{c.shortName}</p>
                       <p className="text-[10px] font-black uppercase opacity-60">#{c.nirfRank} · {c.state}</p>
                     </button>
                   ))
                 )}
              </div>
           </div>
        )}

        <AnimatePresence>
          {selectedIds.length >= 2 && comparedColleges && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
               {/* Comparison Table */}
               <Card className="border-none rounded-[3rem] shadow-2xl bg-white dark:bg-slate-900 overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                     <thead>
                        <tr>
                           <th className="p-10 border-b border-r border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                 <CheckCircle2 className="h-6 w-6" />
                              </div>
                           </th>
                           {comparedColleges.map((c: any) => (
                              <th key={c._id} className="p-10 border-b border-slate-50 dark:border-slate-800 min-w-[200px]">
                                 <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                       <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{c.name}</h3>
                                       <button onClick={() => toggleSelect(c._id)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                                          <X className="h-5 w-5" />
                                       </button>
                                    </div>
                                    <Badge variant="outline" className="rounded-xl px-3 py-1 font-black text-[10px] bg-slate-50 dark:bg-slate-800 border-none">
                                       {c.shortName} · {c.type}
                                    </Badge>
                                 </div>
                              </th>
                           ))}
                        </tr>
                     </thead>
                     <tbody>
                        {METRICS.map((metric, i) => (
                           <tr key={metric.key} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/30 dark:bg-slate-800/20"}>
                              <td className="p-8 border-r border-slate-50 dark:border-slate-800">
                                 <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                       {metric.icon}
                                    </div>
                                    <span className="font-black text-slate-400 text-xs uppercase tracking-widest">{metric.label}</span>
                                 </div>
                              </td>
                              {comparedColleges.map((c: any) => (
                                 <td key={c._id} className="p-8 font-black text-lg text-slate-700 dark:text-slate-300">
                                    {metric.fmt(c[metric.key])}
                                 </td>
                              ))}
                           </tr>
                        ))}
                        <tr>
                           <td className="p-8 border-r border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                              <span className="font-black text-slate-400 text-xs uppercase tracking-widest">Actions</span>
                           </td>
                           {comparedColleges.map((c: any) => (
                              <td key={c._id} className="p-8">
                                 <Link href={`/counselling/${c._id}`}>
                                    <Button className="w-full rounded-2xl font-black h-14 gap-2">
                                       View Details <ChevronRight className="h-4 w-4" />
                                    </Button>
                                 </Link>
                              </td>
                           ))}
                        </tr>
                     </tbody>
                  </table>
               </Card>

               <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={() => setSelectedIds([])} className="h-14 px-10 rounded-2xl font-black text-lg border-2">
                     Reset Comparison
                  </Button>
                  <Button className="h-14 px-10 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
                     Download Report (PDF)
                  </Button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
