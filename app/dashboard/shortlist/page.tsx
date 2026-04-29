"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, MapPin, ArrowRight, Trash2, GraduationCap } from "lucide-react"
import Link from "next/link"

export default function ShortlistPage() {
  // Placeholder data for demonstration
  const shortlist = [
    { id: 1, name: "Indian Institute of Technology, Bombay", location: "Mumbai, Maharashtra", type: "IIT", package: "25 LPA+" },
    { id: 2, name: "National Institute of Technology, Trichy", location: "Tiruchirappalli, Tamil Nadu", type: "NIT", package: "18 LPA+" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight">My Shortlist</h1>
          <p className="text-slate-500 font-medium">Your curated list of top institutions for the 2026 admission cycle.</p>
        </div>
        <Link href="/colleges">
          <Button className="rounded-xl h-12 px-6 font-black gap-2">
            <Sparkles className="h-4 w-4" />
            Explore More
          </Button>
        </Link>
      </div>

      {shortlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shortlist.map((college) => (
            <Card key={college.id} className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 group overflow-hidden">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-300 hover:text-red-500 rounded-full h-10 w-10">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
                <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors">{college.name}</h3>
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-8">
                  <MapPin className="h-4 w-4" />
                  {college.location}
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Avg Package</p>
                    <p className="text-lg font-black">{college.package}</p>
                  </div>
                  <Link href={`/college/${college.id}`}>
                    <Button variant="ghost" className="rounded-xl font-black text-primary hover:bg-primary/5">
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 rounded-[3rem] bg-transparent p-20 flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-6">
            <Sparkles className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black mb-2">Your shortlist is empty</h2>
          <p className="text-slate-500 font-medium max-w-sm mb-8">Start exploring colleges and add them to your shortlist to compare them later.</p>
          <Link href="/colleges">
            <Button size="lg" className="rounded-2xl h-14 px-10 font-black shadow-xl shadow-primary/20">
              Browse Colleges
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
