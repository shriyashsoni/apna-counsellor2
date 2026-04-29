"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Sparkles, ShieldCheck, MapPin, Building2, CheckCircle2, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import { CounsellingInfo } from "@/lib/counselling"

interface Props {
  data: CounsellingInfo
}

export default function CounsellingDetailClient({ data }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-12 pb-16">
        <div className="container mx-auto px-4">
          <Link href="/counselling" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all platforms
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  National Database
                </Badge>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-bold">
                  <Sparkles className="h-3 w-3" />
                  AI OPTIMIZED
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                {data.name} <span className="text-primary text-2xl font-normal ml-2">Counselling 2026</span>
              </h1>
              <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                Complete admission support, round-wise analysis, and document verification for {data?.colleges?.length || 0} institutions across India.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href={data.url} target="_blank">
                <Button className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:-translate-y-1">
                  Official Portal
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/book-call">
                <Button variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-2xl border-slate-200 dark:border-slate-700 font-bold text-lg bg-white dark:bg-slate-800 transition-all hover:-translate-y-1">
                  Book 1-on-1 Help
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Institutes', value: data?.colleges?.length || 0, icon: Building2 },
                { label: 'Verified', value: '100%', icon: ShieldCheck },
                { label: 'Success Rate', value: '98%', icon: CheckCircle2 },
                { label: 'AI Score', value: '9.8', icon: Sparkles },
              ].map((stat, i) => (
                <Card key={i} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <stat.icon className="h-5 w-5 text-primary mb-2" />
                    <div className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* College List */}
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
              <CardHeader className="p-8 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-2xl">Participating Institutions</CardTitle>
                <CardDescription>Verified list of colleges and universities under {data.name}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <TableRow>
                      <TableHead className="font-bold py-4 px-8">Institute Name</TableHead>
                      <TableHead className="font-bold py-4">Type</TableHead>
                      <TableHead className="font-bold py-4">Location</TableHead>
                      <TableHead className="font-bold py-4 pr-8 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(data?.colleges || []).map((college, idx) => (
                      <TableRow key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-100 dark:border-slate-800">
                        <TableCell className="py-4 px-8 font-medium">{college.name}</TableCell>
                        <TableCell className="py-4">
                          <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                            {college.type}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center text-slate-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            {college.location}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 pr-8 text-right">
                          <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/10">
                            Predictor
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl border-none shadow-2xl overflow-hidden sticky top-8">
              <CardHeader className="p-8 pb-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/30">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">AI Admission Assistant</CardTitle>
                <CardDescription className="text-slate-400">
                  Let our AI analyze your rank and suggest the best strategy for {data.name}.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <p className="text-sm">Personalized college recommendations</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <p className="text-sm">Cutoff trends for the last 5 years</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <p className="text-sm">Choice filling order optimization</p>
                  </div>
                </div>
                
                <Link href="/book-call" className="block w-full">
                  <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg mb-4">
                    Upgrade to Premium
                  </Button>
                </Link>
                <p className="text-center text-xs text-slate-500">
                  Trusted by 50,000+ students nationwide
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-lg">Need Immediate Help?</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 mb-4">
                  <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <div>
                    <div className="font-bold text-green-800 dark:text-green-400">WhatsApp Expert</div>
                    <div className="text-xs text-green-600/70">Typical response: 5 mins</div>
                  </div>
                </div>
                <Link href="https://wa.link/cld3hu" target="_blank" className="block w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 dark:border-slate-700 font-bold">
                    Start Chatting
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
