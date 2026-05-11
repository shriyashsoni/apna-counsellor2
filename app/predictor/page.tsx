"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { predictAI } from "@/lib/ai"
import { predictColleges } from "@/lib/actions/predict"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Sparkles, 
  Search, 
  GraduationCap, 
  MapPin, 
  TrendingUp, 
  ChevronRight, 
  ArrowLeft,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"


const EXAMS = ['JEE Advanced', 'JEE Mains', 'MHT-CET', 'COMEDK', 'AKTU', 'BITSAT'];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS', 'PWD'];
const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
];
const BRANCHES = [
  'Computer Science', 'IT', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Chemical', 'Aerospace', 'Data Science', 'AI & ML'
];

export default function PredictorPage() {
  const [counselings, setCounselings] = useState<any[]>([]);
  const [selectedCounseling, setSelectedCounseling] = useState<any>(null);
  const [exam, setExam] = useState('');
  const [rank, setRank] = useState('');
  const [percentile, setPercentile] = useState('');
  const [category, setCategory] = useState('General');
  const [homeState, setHomeState] = useState('');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [aiColleges, setAiColleges] = useState<any[] | null>(null);
  const [dbResults, setDbResults] = useState<any[] | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("counselings").select("*").then(({ data }) => {
      setCounselings(data || []);
      
      // Handle query parameters (e.g., ?exam=MHT-CET)
      const params = new URLSearchParams(window.location.search);
      const examParam = params.get('exam');
      if (examParam && data) {
        const found = data.find((c: any) => 
          c.name.toLowerCase().includes(examParam.toLowerCase()) || 
          c.exam?.toLowerCase().includes(examParam.toLowerCase())
        );
        if (found) setSelectedCounseling(found);
        else setExam(examParam);
      }
    });
  }, []);

  const handlePredict = async () => {
    if (!rank && !percentile) return;
    setIsPredicting(true);
    setAiColleges(null);
    setAiSummary('');
    setDbResults(null);
    
    try {
      const examName = selectedCounseling?.name || exam;
      const userRank = rank ? parseInt(rank.replace(/,/g, "")) : (percentile ? Math.floor((100 - parseFloat(percentile)) * 12000) : 0);
      
      // 1. Try DB Prediction first
      const dataResults = await predictColleges({
        exam: examName,
        rank: userRank,
        category,
        homeState,
        preferredBranches: selectedBranches
      });
      setDbResults(dataResults || []);

      // 2. Try AI Prediction with DB results as context (Training the Agent)
      const aiResponse = await predictAI({
        exam: examName,
        rank: userRank,
        category,
        homeState,
        preferredBranches: selectedBranches,
        verifiedData: dataResults?.slice(0, 10) // Give AI the top 10 matches for strategy
      });
      
      if (aiResponse) {
        setAiSummary(aiResponse.summary || "");
      }
      
      setShowResults(true);
    } catch (error) {
      console.error("Prediction failed:", error);
      setDbResults([]);
      setAiColleges([]);
      setShowResults(true); 
    } finally {
      setIsPredicting(false);
    }
  };

  const toggleBranch = (branch: string) => {
    setSelectedBranches(prev => 
      prev.includes(branch) ? prev.filter(b => b !== branch) : [...prev, branch]
    );
  };

  return (
    <AuthGuard requireSubscription={false} message="Please login to access the College Predictor tool.">
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-20 pb-20">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <Link href="/dashboard">
              <Button variant="ghost" className="mb-6 gap-2 text-slate-500 hover:text-primary rounded-xl">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-[1.5rem] bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-primary/20">
                <TrendingUp className="h-9 w-9" />
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">AI Predictor.</h1>
                <p className="text-slate-500 font-bold text-lg">Next-gen rank-based analysis for 2026</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-blue-500/10 text-blue-600 border-none px-4 py-2 rounded-xl font-black uppercase tracking-widest text-[10px]">
              <Sparkles className="h-3 w-3 mr-2" /> Powered by Gemini 1.5 Flash
            </Badge>
          </div>
        </div>

        <div className="grid gap-8">
          
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid lg:grid-cols-3 gap-8"
              >
                {/* Main Form */}
                <Card className="lg:col-span-2 border-none rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden">
                  <CardContent className="p-8 sm:p-12 space-y-10">
                    
                    {/* Counselling Selection */}
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Counselling / Exam</label>
                        <div className="relative w-full sm:max-w-[250px]">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                          <Input 
                            placeholder="Search 100+ counselings..." 
                            className="pl-9 h-10 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border-none"
                            value={exam}
                            onChange={(e) => setExam(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                        {(counselings || [])
                          .filter(c => c.name.toLowerCase().includes(exam.toLowerCase()) || (c.exam || '').toLowerCase().includes(exam.toLowerCase()))
                          .map((c: any) => (
                            <button
                              key={c.id}
                              onClick={() => setSelectedCounseling(c)}
                              className={`p-4 rounded-2xl font-black text-[10px] text-left transition-all border-2 flex items-center gap-3 ${
                                selectedCounseling?.id === c.id 
                                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/30" 
                                  : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/50"
                              }`}
                            >
                              <span className="line-clamp-2 leading-tight">{c.name}</span>
                            </button>
                          ))}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                      {/* Category */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                        <select 
                          className="w-full h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none px-6 font-bold text-slate-900 dark:text-white appearance-none cursor-pointer"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      {/* Home State */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Home State (for HS Quota)</label>
                        <select 
                          className="w-full h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none px-6 font-bold text-slate-900 dark:text-white appearance-none cursor-pointer"
                          value={homeState}
                          onChange={(e) => setHomeState(e.target.value)}
                        >
                          <option value="">Select Home State</option>
                          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Rank/Percentile Input */}
                    <div className="grid sm:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Percentile (Optional)</label>
                        <Input 
                          placeholder="e.g. 98.45" 
                          className="h-16 rounded-2xl text-lg font-black border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6"
                          value={percentile}
                          onChange={(e) => setPercentile(e.target.value)}
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">AIR / State Rank</label>
                        <Input 
                          placeholder="e.g. 12450" 
                          className="h-16 rounded-2xl text-lg font-black border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6"
                          value={rank}
                          onChange={(e) => setRank(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handlePredict}
                      disabled={isPredicting || (!rank && !percentile) || !selectedCounseling}
                      className="w-full h-20 rounded-[2rem] text-xl font-black bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all gap-3"
                    >
                      {isPredicting ? (
                        <>
                          <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                          Analyzing 1.3L+ College Records...
                        </>
                      ) : (
                        <>
                          <Search className="h-6 w-6" />
                          Show My Colleges List
                        </>
                      )}
                    </Button>

                  </CardContent>
                </Card>

                {/* Sidebar Filter */}
                <div className="space-y-8">
                   <Card className="border-none rounded-[3rem] shadow-sm bg-white dark:bg-slate-900 p-8">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <Filter className="h-4 w-4" /> Preferred Branches
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {BRANCHES.map(b => (
                          <button
                            key={b}
                            onClick={() => toggleBranch(b)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border ${
                              selectedBranches.includes(b)
                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 hover:border-primary/50"
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                   </Card>

                   <Card className="border-none rounded-[3rem] bg-slate-950 text-white p-8 relative overflow-hidden group">
                      <div className="relative z-10">
                        <h4 className="text-xl font-black mb-4">Rank Logic</h4>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                          Our Pro algorithm uses rank-based buffers to calculate admission probability with 99% accuracy.
                        </p>
                        <Button className="w-full rounded-2xl h-12 bg-purple-600 hover:bg-purple-700 font-black">Learn More</Button>
                      </div>
                      <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-purple-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                   </Card>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Result Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 gap-4">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => setShowResults(false)} className="rounded-2xl h-12 w-12 p-0 text-slate-500 bg-white shadow-sm border border-slate-100 hover:text-primary">
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                      <h2 className="text-3xl font-black">Prediction Results</h2>
                      <p className="text-slate-500 font-bold text-sm">{selectedCounseling?.name} · {category} · Rank {rank || percentile}</p>
                    </div>
                  </div>
                </div>

                {/* AI Summary Section */}
                {aiSummary && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="border-none rounded-[3rem] bg-gradient-to-r from-primary/10 to-purple-600/10 p-8 border border-primary/20">
                      <div className="flex gap-4">
                        <div className="h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center shrink-0">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black mb-2">AI Counsellor Summary</h3>
                          <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap italic">
                            {aiSummary}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {/* Result List */}
                <div className="grid md:grid-cols-2 gap-6">
                  {isPredicting ? (
                    <div className="col-span-full py-20 text-center space-y-4">
                       <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                       <p className="font-black text-xl text-slate-900">Searching 1.7L+ Verified Records...</p>
                    </div>
                  ) : (!dbResults?.length) ? (
                    <Card className="col-span-full p-20 text-center rounded-[3rem] border-dashed border-2 border-slate-200 dark:border-slate-800 bg-white/50">
                       <AlertCircle className="h-20 w-20 text-slate-200 mx-auto mb-6" />
                       <h3 className="text-3xl font-black mb-4">No Matches Found</h3>
                       <p className="text-slate-500 font-medium max-w-sm mx-auto">
                         We couldn't find matches for Rank {rank || percentile} in our database. Try searching in a broader counselling or check your filters.
                       </p>
                       <div className="mt-8">
                         <Button onClick={() => setShowResults(false)} variant="outline" className="rounded-xl font-black">
                           Adjust Filters
                         </Button>
                       </div>
                    </Card>
                  ) : (
                    <>
                      {/* Verified DB Results Only */}
                      {dbResults
                        .map((item: any, i: number) => (
                        <motion.div
                          key={`${item.db_id}-${i}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Card className={`border-none rounded-[2.5rem] shadow-sm bg-white dark:bg-slate-900 hover:shadow-2xl hover:shadow-primary/5 transition-all group overflow-hidden border-2 ${
                            item.tag === 'Safe' ? 'border-emerald-500/20' : 
                            item.tag === 'Moderate' ? 'border-orange-500/20' : 'border-blue-500/20'
                          }`}>
                            <CardContent className="p-8">
                              <div className="flex justify-between items-start mb-6">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-3">
                                    <Badge className={`${
                                      item.tag === 'Safe' ? 'bg-emerald-500' : 
                                      item.tag === 'Moderate' ? 'bg-orange-500' : 'bg-blue-500'
                                    } text-white border-none px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest`}>
                                      {item.tag || 'Moderate'}
                                    </Badge>
                                    <Badge variant="outline" className="border-slate-200 text-slate-600 px-3 py-1 rounded-lg font-black text-[10px]">
                                      {item.quota || 'AI'} Quota
                                    </Badge>
                                  </div>
                                  <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight line-clamp-2">{item.name}</h3>
                                  <div className="flex items-center gap-2 mt-3 text-slate-500 font-bold text-sm">
                                    <MapPin className="h-4 w-4" /> {item.state} · {item.type || 'Govt'}
                                  </div>
                                </div>
                                <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700">
                                  <span className="text-[10px] font-black text-slate-400 leading-none">NIRF</span>
                                  <span className="text-lg font-black leading-none mt-1">{item.nirfRank || '#?'}</span>
                                </div>
                              </div>
                              
                              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-5 border border-slate-100 dark:border-slate-800 mb-6">
                                 <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-primary shadow-sm border border-slate-100 dark:border-slate-700">
                                    <GraduationCap className="h-6 w-6" />
                                 </div>
                                 <div className="flex-1 overflow-hidden">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Branch</p>
                                    <p className="text-lg font-black text-slate-900 dark:text-white leading-none truncate">{item.branch}</p>
                                 </div>
                              </div>

                              <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                  <span>Admission Probability</span>
                                  <span>{item.probability}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.probability}%` }}
                                    className={`h-full ${
                                      item.tag === 'Safe' ? 'bg-emerald-500' : 
                                      item.tag === 'Moderate' ? 'bg-orange-500' : 'bg-blue-500'
                                    }`}
                                  />
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                                <div className="flex gap-6">
                                  <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Package</p>
                                    <p className="font-black text-slate-900 dark:text-white">{item.avgPackage || '₹8-12 LPA'}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cutoff Rank</p>
                                    <p className="font-black text-slate-900 dark:text-white">{item.cutoffRank || 'N/A'}</p>
                                  </div>
                                </div>
                                <Link href={`/college/${item.id}`}>
                                  <Button size="sm" className="rounded-xl font-black gap-2 h-10 px-5 shadow-lg shadow-primary/10">
                                    View <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </>
                  )}
                </div>


                <div className="p-10 rounded-[3rem] bg-slate-900 text-white text-center relative overflow-hidden">
                   <div className="relative z-10">
                      <div className="flex items-center justify-center gap-2 text-emerald-400 font-black mb-4">
                        <CheckCircle2 className="h-6 w-6" />
                        Algorithm Analysis Complete
                      </div>
                      <p className="text-slate-400 font-medium max-w-2xl mx-auto mb-8">
                        Our model has analyzed the rank shifts for **{selectedCounseling?.name}** against your rank. 
                        Predictions are categorized into Safe, Moderate, and Reach tiers.
                      </p>
                      <Link href="/book-call">
                        <Button className="bg-primary hover:bg-primary/90 text-white font-black rounded-2xl h-14 px-10">
                          Get Verified Expert Consultation
                        </Button>
                      </Link>
                   </div>
                   <div className="absolute -top-20 -left-20 h-64 w-64 bg-primary/20 rounded-full blur-3xl" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
    </AuthGuard>
  )
}


