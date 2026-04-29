"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, BarChart3, Search, ShieldCheck, Zap, BrainCircuit } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const tools = [
  {
    title: "College Predictor",
    description: "Get a list of colleges you can secure based on your rank and category.",
    icon: BarChart3,
    color: "from-blue-500 to-indigo-600",
    link: "/predictors"
  },
  {
    title: "Choice Filling AI",
    description: "AI-optimized order of colleges to maximize your chances of success.",
    icon: BrainCircuit,
    color: "from-purple-500 to-pink-600",
    link: "/book-call"
  },
  {
    title: "Cutoff Analyzer",
    description: "Deep dive into 5-year trends for every branch and category.",
    icon: Search,
    color: "from-emerald-500 to-teal-600",
    link: "/counselling"
  },
  {
    title: "Document Verifier",
    description: "Ensure your documents are 100% ready for the verification round.",
    icon: ShieldCheck,
    color: "from-orange-500 to-amber-600",
    link: "/resources"
  }
]

export function AIToolsSection() {
  return (
    <section className="py-16 md:py-24 container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-black uppercase tracking-widest mb-4 md:mb-6">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
            AI OPTIMIZATION TOOLS
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Supercharge Your <br className="hidden md:block"/><span className="text-primary">Admission Strategy</span>
          </h2>
        </div>
        <Link href="/predictors" className="w-full md:w-auto">
          <Button className="w-full md:w-auto h-12 md:h-14 px-8 rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-xl shadow-primary/20">
            Try AI Tools Now
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {tools.map((tool, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
          >
            <Card className="h-full border-none bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all overflow-hidden group">
              <div className={`h-1.5 w-full bg-gradient-to-r ${tool.color}`} />
              <CardHeader className="p-6 md:p-8">
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <tool.icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                </div>
                <CardTitle className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{tool.title}</CardTitle>
                <CardDescription className="text-sm md:text-base text-slate-500 leading-relaxed">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 md:px-8 pb-6 md:pb-8">
                <Link href={tool.link}>
                  <Button variant="ghost" className="p-0 font-bold text-primary hover:bg-transparent h-auto">
                    Launch Tool <Zap className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
