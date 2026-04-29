import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, CheckCircle, Sparkles, Zap, Shield, Crown } from "lucide-react"
import type { Metadata } from "next"
import { getAllCounsellingData } from "@/lib/counselling"

export const metadata: Metadata = {
  title: "Premium Counselling Services 2026 – Apna Counsellor",
  description:
    "Explore 200+ AI-optimized counselling services and premium mentorship plans starting at ₹250. National and international admission support.",
}

export default async function ServicesPage() {
  const platforms = await getAllCounsellingData()
  const featuredPlatforms = platforms.slice(0, 6)

  const paidPlans = [
    {
      name: "Starter Support",
      price: "₹250",
      description: "Perfect for initial guidance and basic college prediction.",
      features: ["Single Call Session", "College Predictor Access", "Basic Document Checklist", "WhatsApp Group Support"],
      icon: Zap,
      color: "blue"
    },
    {
      name: "Expert Mentorship",
      price: "₹999",
      description: "Comprehensive guidance throughout the CAP rounds.",
      features: ["Unlimited Call Support", "Personalized Choice Filling", "Document Verification", "Branch Selection Guide", "Premium AI Predictor"],
      icon: Shield,
      color: "purple",
      popular: true
    },
    {
      name: "Premium Concierge",
      price: "₹2499",
      description: "Dedicated expert to handle your entire admission process.",
      features: ["Direct Expert Access", "End-to-End Application Help", "Preference List Management", "Physical Visit Guidance", "Scholarship Assistance"],
      icon: Crown,
      color: "amber"
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute top-0 right-0 p-20 opacity-10 blur-3xl bg-primary/30 rounded-full" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl">
            <Badge className="bg-primary/10 text-primary border-none mb-6">SOLUTIONS 2026</Badge>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
              Strategic Admissions Support & <br/><span className="text-primary">AI-Optimized Mentorship</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
              We provide AI-optimized admission support for over 200+ national and international counselling platforms.
            </p>
          </div>
        </div>
      </section>

      {/* Platforms Grid */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Admission Portals</h2>
            <p className="text-slate-500">Recently updated with 2026 data and AI optimization.</p>
          </div>
          <Link href="/counselling">
            <Button variant="ghost" className="text-primary font-bold">
              View All 200+ Portals <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {featuredPlatforms.map((platform) => (
            <Card key={platform.id} className="group h-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-bold">{platform.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  Complete database for {platform?.name} including {platform?.colleges?.length || 0} colleges.
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-8 pt-0">
                <Link href={`/counselling/${platform.id}`} className="w-full">
                  <Button className="w-full rounded-xl font-bold h-11">Explore Platform</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Paid Counselling Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Upgrade to Premium Counselling</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Get personalized one-on-one mentorship from experts who have helped 1200+ students secure their dream college.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {paidPlans.map((plan, i) => (
              <Card key={i} className={`relative h-full flex flex-col bg-white dark:bg-slate-900 border-2 rounded-[2rem] overflow-hidden transition-all hover:-translate-y-2 ${
                plan.popular ? 'border-primary shadow-2xl shadow-primary/10' : 'border-slate-100 dark:border-slate-800 shadow-sm'
              }`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-6 py-1.5 rounded-bl-2xl text-xs font-black uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <CardHeader className="p-10 pb-6">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-8 ${
                    plan.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    plan.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    <plan.icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-3xl font-black">{plan.name}</CardTitle>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-5xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                    <span className="ml-2 text-slate-400 font-medium">/ session</span>
                  </div>
                  <CardDescription className="mt-4 text-base leading-relaxed">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-0 flex-grow">
                  <div className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className={`h-5 w-5 ${plan.popular ? 'text-primary' : 'text-slate-400'}`} />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-10 pt-0">
                  <Link href="/book-call" className="w-full">
                    <Button className={`w-full h-14 rounded-2xl font-black text-lg ${
                      plan.popular ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20' : 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white'
                    }`}>
                      Get Started Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Mentorship Support Section */}
        <div className="mt-32 p-12 sm:p-20 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-20">
            <Sparkles className="h-60 w-60 text-primary" />
          </div>
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black mb-8 leading-tight">Upgraded Mentorship <br/><span className="text-primary">Support 2026</span></h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">AI-Powered Insights</h3>
                    <p className="text-slate-400">Our mentors use advanced predictive modeling to find the best colleges for your specific rank.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">24/7 Priority Support</h3>
                    <p className="text-slate-400">Never miss a deadline with our real-time alert system and dedicated WhatsApp support.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-8 sm:p-12 rounded-[2rem] border border-white/10">
              <h3 className="text-2xl font-bold mb-6">Need a custom plan?</h3>
              <p className="text-slate-400 mb-10">We offer specialized plans for international admissions and medical PG entries. Talk to us directly.</p>
              <Link href="https://wa.link/cld3hu" target="_blank">
                <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg">
                  Chat with Shriyash Soni
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${className}`}>
      {children}
    </span>
  )
}
