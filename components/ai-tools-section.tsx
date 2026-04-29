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
    <section className="py-24 container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6">
            <Sparkles className="h-4 w-4" />
            AI OPTIMIZATION TOOLS
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Supercharge Your <span className="text-primary">Admission Strategy</span>
          </h2>
        </div>
        <Link href="/predictors">
          <Button className="h-14 px-8 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
            Try AI Tools Now
          </Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {tools.map((tool, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
          >
            <Card className="h-full border-none bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all overflow-hidden group">
              <div className={`h-2 w-full bg-gradient-to-r ${tool.color}`} />
              <CardHeader className="p-8">
                <div className="h-14 w-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <tool.icon className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold mb-4">{tool.title}</CardTitle>
                <CardDescription className="text-base text-slate-500 leading-relaxed">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <Link href={tool.link}>
                  <Button variant="ghost" className="p-0 font-bold text-primary hover:bg-transparent">
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
