"use client"

import { useState } from "react"
import { useQuery, useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Sparkles, 
  Search, 
  GraduationCap, 
  MapPin, 
  TrendingUp, 
  ChevronRight, 
  ArrowLeft,
  Filter,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const EXAMS = ['JEE Advanced', 'JEE Mains', 'MHT-CET', 'COMEDK', 'AKTU', 'BITSAT'];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];

export default function PredictorPage() {
  const [exam, setExam] = useState('JEE Advanced');
  const [rank, setRank] = useState('');
  const [percentile, setPercentile] = useState('');
  const [category, setCategory] = useState('General');
  const [isPredicting, setIsPredicting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [aiResults, setAiResults] = useState<any[] | null>(null);

  const predictAI = useAction(api.ai.predictAI);

  // Convex Query for prediction (data-based)
  const dbResults = useQuery(api.colleges.predict, showResults ? {
    exam,
    rank: rank ? parseInt(rank) : undefined,
    percentile: percentile ? parseFloat(percentile) : undefined,
    category,
  } : "skip");

  const results = aiResults || dbResults;

  const handlePredict = async () => {
    if (!rank && !percentile) return;
    setIsPredicting(true);
    setAiResults(null);
    
    try {
      const aiResponse = await predictAI({
        exam,
        rank: rank ? parseInt(rank) : 0,
        category,
      });
      
      if (aiResponse && aiResponse.length > 0) {
        setAiResults(aiResponse);
      }
      setShowResults(true);
    } catch (error) {
      console.error("AI Prediction failed:", error);
      setShowResults(true); // Fallback to DB
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-6 gap-2 text-slate-500 hover:text-primary rounded-xl">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <TrendingUp className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">College Predictor</h1>
              <p className="text-slate-500 font-medium">AI-powered admission probability for 2026</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          
          {/* Input Card */}
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-none rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden">
                  <CardContent className="p-8 sm:p-12 space-y-10">
                    
                    {/* Exam Selection */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Entrance Exam</label>
                      <div className="flex flex-wrap gap-3">
                        {EXAMS.map((e) => (
                          <button
                            key={e}
                            onClick={() => setExam(e)}
                            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                              exam === e 
                                ? "bg-primary text-white shadow-lg shadow-primary/30" 
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                            }`}
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Category</label>
                      <div className="flex flex-wrap gap-3">
                        {CATEGORIES.map((c) => (
                          <button
                            key={c}
                            onClick={() => setCategory(c)}
                            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                              category === c 
                                ? "bg-primary text-white shadow-lg shadow-primary/30" 
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rank/Percentile Input */}
                    <div className="grid sm:grid-cols-2 gap-8">
                      {exam === 'JEE Mains' && (
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Percentile Score</label>
                          <Input 
                            placeholder="e.g. 98.45" 
                            className="h-16 rounded-2xl text-lg font-bold border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6"
                            value={percentile}
                            onChange={(e) => setPercentile(e.target.value)}
                          />
                        </div>
                      )}
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {exam === 'JEE Mains' ? 'CRL Rank (Optional)' : 'AIR / State Rank'}
                        </label>
                        <Input 
                          placeholder="e.g. 12450" 
                          className="h-16 rounded-2xl text-lg font-bold border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6"
                          value={rank}
                          onChange={(e) => setRank(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handlePredict}
                      disabled={isPredicting || (!rank && !percentile)}
                      className="w-full h-20 rounded-[2rem] text-xl font-black bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all gap-3"
                    >
                      {isPredicting ? (
                        <>
                          <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                          Analyzing Admission Data...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-6 w-6" />
                          Predict My Colleges
                        </>
                      )}
                    </Button>

                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Result Header */}
                <div className="flex justify-between items-center px-4">
                  <h2 className="text-2xl font-black">
                    {results?.length || 0} {aiResults ? "AI-Powered Matches" : "Matches Found"}
                  </h2>
                  <Button variant="ghost" onClick={() => setShowResults(false)} className="font-bold text-primary hover:bg-primary/5">
                    Change Rank
                  </Button>
                </div>

                {/* Result List */}
                <div className="grid gap-6">
                  {results === undefined ? (
                    <div className="py-20 text-center space-y-4">
                       <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                       <p className="font-bold text-slate-500">AI is calculating your best matches...</p>
                    </div>
                  ) : !results || results.length === 0 ? (
                    <Card className="p-12 text-center rounded-[2.5rem] border-dashed border-2 border-slate-200 dark:border-slate-800 bg-white/50">
                       <AlertCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                       <h3 className="text-xl font-bold mb-2">No Matches Found</h3>
                       <p className="text-slate-500">Try a different rank or category to see more options.</p>
                    </Card>
                  ) : (
                    results.map((item: any, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Card className="border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden">
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                              {/* Probability Score */}
                              <div className="w-full md:w-32 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
                                <div className="text-3xl font-black text-primary">{item.probability}%</div>
                                <div className="text-[10px] font-black uppercase text-slate-400 mt-1">Chance</div>
                              </div>
                              
                              {/* Info Area */}
                              <div className="flex-1 p-8 space-y-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="text-xl font-black group-hover:text-primary transition-colors">{item.name}</h3>
                                    <div className="flex items-center gap-2 mt-2 text-slate-500 font-bold text-sm">
                                      <MapPin className="h-4 w-4" /> {item.state} · {item.type}
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="rounded-xl px-3 py-1 font-black text-[10px] bg-slate-50 dark:bg-slate-800">
                                    NIRF #{item.nirfRank}
                                  </Badge>
                                </div>
                                
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-4">
                                   <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-primary shadow-sm">
                                      <GraduationCap className="h-5 w-5" />
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Recommended Branch</p>
                                      <p className="font-bold text-slate-900 dark:text-white leading-none">{item.branch}</p>
                                   </div>
                                </div>

                                <div className="flex flex-wrap gap-6 pt-2">
                                  <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Package</p>
                                    <p className="font-bold">₹{item.avgPackage}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Cutoff</p>
                                    <p className="font-bold">{item.cutoffRank}</p>
                                  </div>
                                  <div className="ml-auto">
                                     <Button size="sm" variant="outline" className="rounded-xl font-bold gap-1 border-primary/20 text-primary hover:bg-primary hover:text-white">
                                       Details <ChevronRight className="h-4 w-4" />
                                     </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>

                <div className="p-8 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 text-center">
                   <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-black mb-2">
                      <CheckCircle2 className="h-5 w-5" />
                      AI Prediction Verified
                   </div>
                   <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                     These predictions are based on historical JoSAA/DTE data and current trends. 
                     Join our <Link href="#" className="text-primary hover:underline font-bold">WhatsApp Channel</Link> for real-time round alerts.
                   </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  )
}
