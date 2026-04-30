"use client"

import { motion } from "framer-motion"
import { Briefcase, ArrowRight, Zap, Coffee, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CareersPage() {
  const jobs = [
    { title: "Senior AI Engineer", type: "Full-time", loc: "Mumbai / Remote" },
    { title: "Admission Counselor", type: "Full-time", loc: "Powai, Mumbai" },
    { title: "Frontend Developer", type: "Contract", loc: "Remote" }
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-4">Join the <span className="text-primary">Team.</span></h1>
          <p className="text-slate-500 font-medium">Help us build the future of Indian admissions.</p>
        </div>
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.title} className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex justify-between items-center group hover:border-primary transition-all">
              <div>
                <h3 className="text-xl font-black mb-1">{job.title}</h3>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{job.type} • {job.loc}</p>
              </div>
              <Button variant="ghost" className="rounded-xl font-black text-primary group-hover:bg-primary group-hover:text-white">Apply <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
