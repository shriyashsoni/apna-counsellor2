"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ExternalLink, Bell } from "lucide-react"
import { motion } from "framer-motion"

export default function CounsellingClientPage() {
  const platforms = [
    {
      id: "mhtcet",
      title: "MHT CET Counselling",
      description: "Complete guidance for Maharashtra's engineering and pharmacy admissions through CAP rounds.",
      link: "https://mht-cet.apnacounsellor.in/",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mht%20cet%20counselling%20logo-iAo3Zgvl5SBFGL1Y26jz5NMPynroZa.webp",
      features: [
        "College predictor based on your CET score",
        "CAP round guidance and alerts",
        "Institute-wise cutoffs from previous years",
        "Document verification checklist",
        "Choice filling strategy",
      ],
    },
    {
      id: "jossa",
      title: "JEE & JoSAA Counselling",
      description: "Expert guidance for JEE Main/Advanced students seeking admission to IITs, NITs, and GFTIs.",
      link: "https://jossa.apnacounsellor.in/",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/josssa%20counsellingn%20logo-atNsaGWHl9WWt67tNukFEAUWJVu4cC.png",
      features: [
        "JoSAA round-wise updates",
        "IIT/NIT/IIIT college predictor",
        "Branch-wise closing ranks",
        "CSAB special round guidance",
        "Seat matrix analysis",
      ],
    },
    {
      id: "mpdte",
      title: "MP DTE Counselling",
      description: "Complete support for engineering and pharmacy admissions in Madhya Pradesh.",
      link: "https://mpdte.apnacounsellor.in/",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mp%20dte%20counselling.jpg-Rc3eTqdZl7fpCmhiejovrdEF6EIa7a.jpeg",
      features: [
        "MP college predictor tool",
        "Round-wise cutoff analysis",
        "Fee structure comparison",
        "Document verification guide",
        "Choice filling assistance",
      ],
    },
    {
      id: "comedk",
      title: "COMEDK Counselling",
      description: "For engineering aspirants in Karnataka seeking admission through COMEDK UGET.",
      link: "https://comedk.apnacounsellor.in/",
      logo: "/images/comedk-logo.png",
      features: [
        "Karnataka engineering college guide",
        "COMEDK vs CET comparison",
        "College predictor tool",
        "Fee structure analysis",
        "Counselling process walkthrough",
      ],
    },
  ]

  const upcomingPlatforms = [
    {
      title: "NEET UG Counselling",
      description: "Coming soon for NEET UG aspirants seeking MBBS/BDS admissions across India.",
      expectedLaunch: "June 2025",
    },
    {
      title: "NEET PG Counselling",
      description: "For medical graduates pursuing MD/MS/PG Diploma courses.",
      expectedLaunch: "July 2025",
    },
    {
      title: "BITSAT, VITEEE & SRMJEE",
      description: "For students targeting private universities like BITS, VIT, and SRM.",
      expectedLaunch: "April 2025",
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
          All Counselling Platforms
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg mb-12"
        >
          Apna Counsellor provides dedicated platforms for different entrance exams and admission processes. Each
          platform is designed to provide comprehensive guidance and support throughout your admission journey.
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl font-bold mb-6"
        >
          Active Platforms
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -10 }}
              className="card-hover"
            >
              <Card className="flex flex-col h-full border-primary/20">
                <CardHeader className="pb-4">
                  <div className="relative h-16 w-16 mb-4 rounded-lg overflow-hidden bg-white p-2">
                    <Image
                      src={platform.logo || "/placeholder.svg"}
                      alt={`${platform.title} Logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <CardTitle>{platform.title}</CardTitle>
                  <CardDescription className="text-base">{platform.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <h3 className="font-semibold mb-2 text-sm">Key Features:</h3>
                  <ul className="space-y-1 text-sm">
                    {platform.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href={platform.link} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full">
                      Visit Platform
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-2xl font-bold mb-6"
        >
          Coming Soon
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {upcomingPlatforms.map((platform, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="card-hover"
            >
              <Card className="border-dashed border-gray-300">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{platform.title}</CardTitle>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {platform.expectedLaunch}
                    </span>
                  </div>
                  <CardDescription className="text-base">{platform.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link href="/upcoming" className="w-full">
                    <Button variant="outline" className="w-full">
                      Get Notified When Launched
                      <Bell className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="mb-6">
            Not sure which platform is right for you? Book a counselling call with our experts to get personalized
            guidance.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/book-call">
              <Button className="animated-gradient text-white hover:text-white">
                Book a Counselling Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link
              href="https://whatsapp.com/channel/0029VabjCVD5PO11jeEupQ44"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">
                Join WhatsApp Channel
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
