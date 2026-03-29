"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Bell, Calendar, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

export default function UpcomingPage() {
  const upcomingPlatforms = [
    {
      title: "COMEDK Counselling",
      description: "For engineering aspirants in Karnataka seeking admission through COMEDK UGET.",
      features: [
        "Karnataka engineering college guide",
        "COMEDK vs CET comparison",
        "College predictor tool",
        "Fee structure analysis",
        "Counselling process walkthrough",
      ],
      expectedLaunch: "May 2025",
      icon: "🏛️",
      logo: "/images/comedk-logo.png",
      link: "https://comedkcounselling.vercel.app/",
      isLaunched: true,
    },
    {
      title: "NEET UG 2025 Counselling",
      description:
        "Complete guidance for NEET UG aspirants seeking MBBS/BDS admissions across India through state counselling and AIQ.",
      features: [
        "State-wise counselling guides",
        "College predictor based on NEET score",
        "AIQ vs State Quota comparison",
        "Seat matrix for government and private colleges",
        "Round-wise cutoff analysis",
      ],
      expectedLaunch: "June 2025",
      icon: "🏥",
      isLaunched: false,
    },
    {
      title: "NEET PG Counselling",
      description: "For medical graduates pursuing MD/MS/PG Diploma courses through the NEET PG examination.",
      features: [
        "Specialty-wise seat distribution",
        "College and hospital rankings",
        "Previous year cutoffs by specialty",
        "Document verification guide",
        "Counselling round strategies",
      ],
      expectedLaunch: "July 2025",
      icon: "👨‍⚕️",
      isLaunched: false,
    },
    {
      title: "BITSAT Counselling",
      description: "For students targeting BITS Pilani, Goa, and Hyderabad campuses.",
      features: [
        "Campus and branch comparison",
        "Iteration-wise cutoffs",
        "Dual degree options",
        "Fee and scholarship details",
        "Admission process guide",
      ],
      expectedLaunch: "April 2025",
      icon: "🎓",
      isLaunched: false,
    },
    {
      title: "VITEEE Counselling",
      description: "For students seeking admission to VIT University campuses.",
      features: [
        "Campus comparison (Vellore, Chennai, AP, Bhopal)",
        "Category-wise rank analysis",
        "Scholarship eligibility",
        "Counselling procedure guide",
        "Document checklist",
      ],
      expectedLaunch: "April 2025",
      icon: "🏫",
      isLaunched: false,
    },
    {
      title: "SRMJEE Counselling",
      description: "For students targeting SRM University and its various campuses.",
      features: [
        "Campus and course comparison",
        "Rank-based college predictor",
        "Fee structure details",
        "Scholarship information",
        "Admission process walkthrough",
      ],
      expectedLaunch: "May 2025",
      icon: "🔬",
      isLaunched: false,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-6"
        >
          Upcoming & New Counselling Platforms
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg mb-12"
        >
          We're constantly expanding our services to cover more entrance exams and admission processes. Here's a preview
          of what's coming soon to Apna Counsellor, as well as our newest platforms.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {upcomingPlatforms.map((platform, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -10 }}
              className="card-hover"
            >
              <Card className={`${platform.isLaunched ? "border-primary/20" : "border-dashed border-gray-300"}`}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {platform.logo ? (
                        <div className="relative h-12 w-12 mr-3">
                          <Image
                            src={platform.logo || "/placeholder.svg"}
                            alt={`${platform.title} Logo`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-3xl mr-3">{platform.icon}</span>
                      )}
                      <CardTitle>{platform.title}</CardTitle>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {platform.expectedLaunch}
                    </span>
                  </div>
                  <CardDescription className="text-base mt-2">{platform.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-3 text-sm">
                    {platform.isLaunched ? "Key Features:" : "Planned Features:"}
                  </h3>
                  <ul className="space-y-1">
                    {platform.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {platform.isLaunched ? (
                    <Link href={platform.link} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="w-full animated-gradient text-white hover:text-white">
                        Visit Platform
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" className="w-full">
                      Get Notified When Launched
                      <Bell className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-6">
            Want to be the first to know when these platforms are launched? Join our WhatsApp channel to receive
            notifications and early access.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="https://whatsapp.com/channel/0029VabjCVD5PO11jeEupQ44"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="animated-gradient text-white hover:text-white">
                Join WhatsApp Channel
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/counselling">
              <Button variant="outline">
                Explore Current Platforms
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Have a Suggestion?</h2>
          <p className="text-lg mb-6">
            Is there a specific entrance exam or counselling process you'd like us to cover? Let us know!
          </p>
          <Link href="https://wa.link/cld3hu" target="_blank" rel="noopener noreferrer">
            <Button>
              Share Your Suggestion
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
