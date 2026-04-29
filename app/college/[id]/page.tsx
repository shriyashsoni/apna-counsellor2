"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowLeft, MapPin, Building2, Globe, GraduationCap, Trophy, DollarSign, Calendar, Target, Loader2, Sparkles, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CollegeProfilePage() {
  const params = useParams()
  const router = useRouter()
  const collegeIdString = params.id as string
  
  const college = useQuery(api.colleges.getById, { id: collegeIdString })
  const extractData = useAction(api.scraper.extractCollegeData)
  
  const [isExtracting, setIsExtracting] = useState(false)
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null)
  const [localDesc, setLocalDesc] = useState<string | null>(null)

  // Trigger on-demand extraction if missing
  useEffect(() => {
    async function performExtraction() {
      if (college && college._id && college.website && !college.imageUrl && !isExtracting && !localImageUrl) {
        setIsExtracting(true)
        try {
          const result = await extractData({ collegeId: college._id, url: college.website })
          if (result.success) {
            if (result.imageUrl) setLocalImageUrl(result.imageUrl)
            if (result.description) setLocalDesc(result.description)
          }
        } catch (e) {
          console.error("Extraction failed", e)
        } finally {
          setIsExtracting(false)
        }
      }
    }
    performExtraction()
  }, [college, extractData, isExtracting, localImageUrl])

  if (college === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (college === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <h1 className="text-3xl font-black mb-4">College Not Found</h1>
        <Button onClick={() => router.push("/colleges")}>Back to Directory</Button>
      </div>
    )
  }

  const displayImage = localImageUrl || college.imageUrl || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  const displayDesc = localDesc || college.description || "A premier institution offering comprehensive degree programs."

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Hero Section with Image */}
      <div className="relative h-[40vh] md:h-[55vh] w-full bg-slate-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={displayImage}
            alt={college.name}
            fill
            className="object-cover opacity-50 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-end container mx-auto px-4 pb-12">
          <Button 
            variant="ghost" 
            className="w-fit text-white/70 hover:text-white hover:bg-white/10 mb-6 group transition-all"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Search
          </Button>
          
          <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
            <div className="space-y-4 max-w-4xl">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-primary text-[10px] md:text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/30">
                  {college.type || "Private"}
                </span>
                {college.nirfRank && (
                  <span className="px-3 py-1 rounded-full bg-orange-500 text-[10px] md:text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-orange-500/30 flex items-center gap-1">
                    <Trophy className="h-3 w-3" /> NIRF #{college.nirfRank}
                  </span>
                )}
                {isExtracting && (
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-[10px] md:text-xs font-black uppercase tracking-widest text-blue-200 border border-blue-500/30 flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" /> Live Extracting Data...
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                {college.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-300 font-medium text-sm md:text-base">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" />
                  {college.city ? `${college.city}, ${college.state}` : (college.location || "Location Unknown")}
                </div>
                {college.established && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" />
                    Est. {college.established}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button size="lg" className="h-14 px-8 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black shadow-xl">
                Add to Shortlist
              </Button>
              {college.website && (
                <Link href={college.website} target="_blank">
                  <Button size="lg" variant="outline" className="h-14 px-6 rounded-2xl border-white/20 text-white hover:bg-white/10 font-bold backdrop-blur-sm">
                    <Globe className="h-5 w-5 mr-2" /> Visit Site
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 p-8 md:p-10">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <Building2 className="h-6 w-6 text-primary" />
                About Institution
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-medium">
                {displayDesc}
              </p>
            </Card>

            <Card className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 p-8 md:p-10">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-primary" />
                Key Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> Annual Fee
                  </p>
                  <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                    {college.annualFee || "Contact for Info"}
                  </p>
                </div>
                <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
                  <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Trophy className="h-3 w-3" /> Average Package
                  </p>
                  <p className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {college.avgPackage || "Data Unavailable"}
                  </p>
                </div>
                <div className="col-span-2 md:col-span-1 p-6 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                  <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Target className="h-3 w-3" /> AI Prediction
                  </p>
                  <p className="text-xl md:text-2xl font-black text-blue-600 dark:text-blue-400">
                    High Chance
                  </p>
                </div>
              </div>
            </Card>

            {college.branches && college.branches.length > 0 && (
              <Card className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 p-8 md:p-10">
                <h2 className="text-2xl font-black mb-6">Available Branches</h2>
                <div className="flex flex-wrap gap-3">
                  {college.branches.map((branch: string, i: number) => (
                    <span key={i} className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                      {branch}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: Quick Actions */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="border-none rounded-[2.5rem] shadow-xl shadow-primary/5 bg-primary p-8 md:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles className="h-32 w-32" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-4">Want to Predict Admission?</h3>
                <p className="text-white/80 font-medium mb-8">
                  Check your exact chances of getting into {college.shortName || college.name} based on your rank and category using our AI.
                </p>
                <Link href="/predictor">
                  <Button className="w-full h-14 rounded-2xl bg-white text-primary hover:bg-slate-100 font-black text-lg shadow-lg">
                    Run Predictor <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 p-8">
              <h3 className="font-black mb-4 uppercase tracking-widest text-xs text-slate-400">Official Links</h3>
              <div className="space-y-3">
                {college.website ? (
                  <Link href={college.website} target="_blank" className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                    <span className="font-bold text-sm">Official Website</span>
                    <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                  </Link>
                ) : (
                  <p className="text-sm font-medium text-slate-500">No official links listed.</p>
                )}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
