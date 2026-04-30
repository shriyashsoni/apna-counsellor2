"use client"

import { motion } from "framer-motion"
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Star, 
  Trophy, 
  ArrowRight,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PricingPage() {
  const plans = [
    {
      name: "Basic",
      price: "0",
      desc: "Perfect for exploring cutoffs and basic information.",
      features: [
        "70,000+ College Directory",
        "Basic State-wise Lists",
        "Community Support",
        "College Comparison"
      ],
      color: "slate",
      cta: "Continue Free",
      popular: false
    },
    {
      name: "Pro",
      price: "999",
      desc: "Unlock the full power of AI for your admissions.",
      features: [
        "100+ AI College Predictors",
        "Expert Cutoff Analysis",
        "Premium Blog & Insights",
        "Exclusive Resource Access",
        "Priority Chat Support"
      ],
      color: "primary",
      cta: "Upgrade to Pro",
      popular: true
    },
    {
      name: "Elite",
      price: "4,999",
      desc: "One-on-one expert guidance for top institutions.",
      features: [
        "Everything in Pro",
        "Personalized Preference List",
        "3 Personal Mentor Sessions",
        "WhatsApp Priority Support",
        "Application Review"
      ],
      color: "purple",
      cta: "Go Elite",
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <Sparkles className="h-4 w-4" /> Invest in your Future
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Premium <span className="text-primary">Membership.</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            Choose the plan that fits your admission journey. Unlock AI tools, expert mentors, and verified data.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`h-full border-none rounded-[3rem] shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden ${
                plan.popular 
                  ? "bg-primary text-white shadow-primary/20 scale-105 z-10" 
                  : "bg-white dark:bg-slate-900 shadow-slate-200/50 dark:shadow-none"
              }`}>
                {plan.popular && (
                  <div className="absolute top-6 right-6">
                    <Badge className="bg-white text-primary font-black px-4 py-1.5 rounded-xl uppercase text-[10px] tracking-widest border-none shadow-lg">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="p-10 pb-4">
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${plan.popular ? "text-white/60" : "text-slate-400"}`}>
                    {plan.name} Plan
                  </p>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-5xl font-black tracking-tighter">₹{plan.price}</span>
                    <span className={`text-sm font-bold ${plan.popular ? "text-white/60" : "text-slate-400"}`}>/ admission cycle</span>
                  </div>
                  <p className={`text-sm font-medium leading-relaxed ${plan.popular ? "text-white/80" : "text-slate-500"}`}>
                    {plan.desc}
                  </p>
                </CardHeader>

                <CardContent className="p-10 pt-6 flex-1 flex flex-col">
                  <div className="space-y-4 mb-10">
                    {plan.features.map(feat => (
                      <div key={feat} className="flex items-start gap-3">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          plan.popular ? "bg-white/20" : "bg-primary/10"
                        }`}>
                          <Check className={`h-3 w-3 ${plan.popular ? "text-white" : "text-primary"}`} />
                        </div>
                        <span className={`text-sm font-bold ${plan.popular ? "text-white/90" : "text-slate-600 dark:text-slate-300"}`}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button className={`w-full h-16 rounded-[1.5rem] font-black text-lg transition-all group mt-auto ${
                    plan.popular 
                      ? "bg-white text-primary hover:bg-slate-100 shadow-xl" 
                      : "bg-primary text-white shadow-xl shadow-primary/20"
                  }`}>
                    {plan.cta} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Security & Support */}
        <div className="flex flex-col md:flex-row justify-center gap-12 items-center text-slate-400">
           <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-500" />
              <span className="font-black uppercase tracking-widest text-[10px]">Secure 256-bit SSL Payment</span>
           </div>
           <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-orange-500" />
              <span className="font-black uppercase tracking-widest text-[10px]">Instant Access Activation</span>
           </div>
           <div className="flex items-center gap-3">
              <Star className="h-6 w-6 text-primary" />
              <span className="font-black uppercase tracking-widest text-[10px]">Money Back Guarantee</span>
           </div>
        </div>

      </div>
    </div>
  )
}
