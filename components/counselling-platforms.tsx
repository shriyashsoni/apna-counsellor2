"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Sparkles, GraduationCap } from "lucide-react"
import { motion } from "framer-motion"

const CounsellingPlatforms = () => {
  // Detailed preview for homepage
  const platforms = [
    {
      id: "JoSAA",
      title: "JEE Mains & Advanced – JoSAA",
      description: "Expert guidance for IITs, NITs, and IIITs admissions via JoSAA & CSAB.",
      tag: "Top Choice",
      features: ["AI-Based College Predictor", "Branch-Wise Cutoff Data", "Institute Comparison Tool"]
    },
    {
      id: "NEET_UG",
      title: "NEET UG Admission Portal",
      description: "Complete medical admission support for MBBS, BDS, and AYUSH courses.",
      tag: "Medical",
      features: ["Round-Wise Strategy", "Category Seat Matrix", "Bond & Fee Analysis"]
    },
    {
      id: "Maharashtra",
      title: "MHT CET Admission Portal",
      description: "Maharashtra engineering and pharmacy admissions guidance.",
      tag: "State Level",
      features: ["CAP Round Assistance", "Institute Cutoffs", "Document Checklist"]
    }
  ]

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {platforms.map((platform, index) => (
        <motion.div
          key={platform.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ y: -10 }}
        >
          <Card className="flex flex-col h-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
            <CardHeader className="p-8 pb-4">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {platform.tag}
                </span>
              </div>
              <CardTitle className="text-2xl font-bold leading-tight">{platform.title}</CardTitle>
              <CardDescription className="text-base mt-2">{platform.description}</CardDescription>
            </CardHeader>
            <CardContent className="px-8 flex-grow">
              <div className="flex items-center gap-2 text-primary text-sm font-bold mb-4">
                <Sparkles className="h-4 w-4" />
                <span>AI-Optimized Strategy</span>
              </div>
              <ul className="space-y-2 mb-6">
                {platform.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-xs text-slate-500">
                    <div className="h-1 w-1 rounded-full bg-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-8 pt-0 mt-auto">
              <Link href={`/counselling/${platform.id}`} className="w-full">
                <Button className="w-full rounded-xl font-bold h-12 shadow-lg shadow-primary/20">
                  Explore Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default CounsellingPlatforms
