"use client"

import { motion } from "framer-motion"

const partners = [
  "IIT Bombay", "NIT Trichy", "COEP Pune", "VJTI Mumbai", "BITS Pilani", 
  "VIT Vellore", "SRM Chennai", "DTU Delhi", "RVCE Bangalore", "MIT Manipal"
]

export function PartnershipCarousel() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 py-12 overflow-hidden border-y border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 mb-8 text-center">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Guidance for Top Institutes</p>
      </div>
      <div className="relative flex overflow-x-hidden">
        <motion.div 
          className="flex whitespace-nowrap animate-marquee"
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        >
          {[...partners, ...partners].map((partner, i) => (
            <div key={i} className="mx-8 text-2xl font-black text-slate-300 dark:text-slate-700 hover:text-primary transition-colors cursor-default">
              {partner}
            </div>
          ))}
        </motion.div>
      </div>
      
      <style jsx>{`
        .animate-marquee {
          display: inline-flex;
        }
      `}</style>
    </div>
  )
}
