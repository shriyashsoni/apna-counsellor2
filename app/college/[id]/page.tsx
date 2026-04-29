"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
  MapPin, 
  Building2, 
  Globe, 
  ExternalLink, 
  GraduationCap, 
  Trophy, 
  DollarSign, 
  Calendar,
  CheckCircle2,
  Share2,
  ArrowLeft,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function CollegeDetailsPage() {
  const params = useParams()
  const collegeId = params.id as any
  const college = useQuery(api.colleges.getById, { id: collegeId })

  if (college === undefined) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (college === null) return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-2xl font-bold">College not found</h2>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Hero Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-12">
          <Link href="/colleges">
            <Button variant="ghost" className="mb-8 rounded-xl font-bold text-slate-500 hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
            </Button>
          </Link>
          
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="flex-grow space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
                  {college.type || "Institution"}
                </span>
                {college.nirfRank && (
                  <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-black uppercase tracking-wider border border-orange-500/10">
                    NIRF #{college.nirfRank}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {college.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {college.city}, {college.state}
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Established: {college.established || "1960"}
                </div>
                {college.website && (
                  <Link href={college.website} target="_blank" className="flex items-center gap-2 text-primary hover:underline">
                    <Globe className="h-5 w-5" />
                    Official Website
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
            
            <div className="w-full lg:w-auto shrink-0 flex gap-4">
               <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 font-black text-lg shadow-xl shadow-primary/20 flex-grow lg:flex-none">
                 Add to Shortlist
               </Button>
               <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-slate-200 dark:border-slate-800">
                 <Share2 className="h-6 w-6" />
               </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Stats */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "Annual Fee", value: college.annualFee || "₹3.5 Lakhs", icon: DollarSign, color: "text-blue-500" },
                { label: "Avg Package", value: college.avgPackage || "₹12.5 LPA", icon: Trophy, color: "text-emerald-500" },
                { label: "High Package", value: "₹52 LPA", icon: TrendingUp, color: "text-orange-500" },
              ].map((stat, i) => (
                <Card key={i} className="border-none rounded-[2rem] shadow-sm bg-white dark:bg-slate-900">
                  <CardContent className="p-6 text-center">
                    <div className={`h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 p-8 md:p-10">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <Info className="h-6 w-6 text-primary" />
                About Institution
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-medium">
                {college.description || `Established in ${college.established || "the early 1960s"}, ${college.name} has grown to become one of the premier institutions for technical education in ${college.state}. With a focus on research, innovation, and industry-readiness, the college offers a range of undergraduate and postgraduate programs. The campus provides state-of-the-art facilities, including modern labs, a central library, and extensive sports infrastructure.`}
              </p>
            </Card>

            <Card className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 p-8 md:p-10">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-primary" />
                Available Branches
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {(college.branches || ["Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil"]).map((branch: string) => (
                  <div key={branch} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{branch}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="bg-gradient-to-br from-indigo-600 to-primary text-white border-none rounded-[3rem] p-10 relative overflow-hidden shadow-2xl shadow-primary/20 group">
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-4">Predict Admission</h3>
                <p className="text-white/80 font-medium mb-8 leading-relaxed">
                  Calculate your chances of getting into {college.shortName || "this college"} based on your rank and category.
                </p>
                <Link href="/predictor">
                  <Button className="w-full h-14 bg-white text-primary hover:bg-slate-50 rounded-2xl font-black text-lg">
                    Check Chances
                  </Button>
                </Link>
              </div>
              <TrendingUp className="absolute -bottom-6 -right-6 h-32 w-32 text-white/10 rotate-12" />
            </Card>

            <Card className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 p-8">
              <h3 className="text-xl font-black mb-6">Cutoff History</h3>
              <div className="space-y-4">
                {[2024, 2023, 2022].map(year => (
                  <div key={year} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                    <span className="font-bold text-slate-500">{year} Cutoff</span>
                    <span className="font-black text-primary">View Details</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
