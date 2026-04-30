"use client"

import { motion } from "framer-motion"
import { Globe, Plane, GraduationCap, MapPin, Sparkles, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function GlobalHubPage() {
  const regions = [
    { name: "United Kingdom", desc: "UCAS applications, Oxford/Cambridge prep, and Visa support.", flag: "🇬🇧" },
    { name: "USA & Canada", desc: "Ivy League guidance, CommonApp support, and scholarship hunts.", flag: "🇺🇸" },
    { name: "Europe (Germany/Italy)", desc: "Public university admissions and language proficiency tracks.", flag: "🇪🇺" },
    { name: "Australia & NZ", desc: "CRICOS registered courses and fast-track student visa paths.", flag: "🇦🇺" }
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <Globe className="h-4 w-4" /> Your Global Future Starts Here
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Global <span className="text-primary">Hub.</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Expand your horizons. We provide expert counseling for top international universities across 4 continents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {regions.map((region, i) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-primary/5 transition-all group"
            >
              <div className="text-4xl mb-6">{region.flag}</div>
              <h3 className="text-xl font-black mb-4 group-hover:text-primary transition-colors">{region.name}</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">{region.desc}</p>
              <Button variant="outline" className="w-full rounded-2xl h-12 font-black border-slate-200 dark:border-slate-800 hover:bg-primary hover:text-white transition-all">Explore Track</Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-24 p-12 rounded-[3rem] bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-12 opacity-5">
             <Plane className="h-60 w-60" />
          </div>
          <div className="max-w-xl text-center md:text-left relative z-10">
            <h2 className="text-4xl font-black mb-4">Ready to Study Abroad?</h2>
            <p className="text-slate-400 font-medium leading-relaxed">
              Our international experts help you with everything from University selection to SOP drafting and Visa processing.
            </p>
          </div>
          <div className="relative z-10">
             <Button className="rounded-[1.5rem] h-16 px-10 font-black text-lg shadow-xl shadow-primary/20">Talk to Abroad Expert</Button>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
