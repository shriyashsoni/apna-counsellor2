"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

const CounsellingPlatforms = () => {
  const platforms = [
    {
      id: "mhtcet",
      title: "MHT CET Counselling",
      description: "Explore Maharashtra's top engineering, pharmacy, and BTech colleges based on your CET rank.",
      link: "https://mht-apnacounsellor.vercel.app/",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mht%20cet%20counselling%20logo-iAo3Zgvl5SBFGL1Y26jz5NMPynroZa.webp",
      features: ["College Predictor Tool", "Institute-Wise Cutoffs", "Seat Matrix & Fee Structures"],
    },
    {
      id: "jossa",
      title: "JEE Mains & Advanced – JoSAA Counselling",
      description: "Get help with NITs, IIITs, GFTIs, and IIT admissions via JoSAA & CSAB.",
      link: "https://apnacounsellorjossa.vercel.app/",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/josssa%20counsellingn%20logo-atNsaGWHl9WWt67tNukFEAUWJVu4cC.png",
      features: ["AI-Based College Predictor", "Branch-Wise Cutoff Data", "Institute Comparison Tool"],
    },
    {
      id: "mpdte",
      title: "MP DTE Counselling",
      description: "Your complete guide for engineering and pharmacy colleges in Madhya Pradesh through DTE MP.",
      link: "https://apnacounsellormpdte.vercel.app/",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mp%20dte%20counselling.jpg-Rc3eTqdZl7fpCmhiejovrdEF6EIa7a.jpeg",
      features: ["MP College Predictor", "Round-Wise Cutoffs", "Fee Structures and Admission Criteria"],
    },
    {
      id: "comedk",
      title: "COMEDK Counselling",
      description: "Complete guidance for engineering aspirants in Karnataka seeking admission through COMEDK UGET.",
      link: "https://comedkcounselling.vercel.app/",
      logo: "/images/comedk-logo.png",
      features: ["College Predictor Tool", "COMEDK vs CET Comparison", "Fee Structure Analysis"],
    },
  ]

  // We'll show only the first 3 platforms on the homepage to maintain the layout
  const displayedPlatforms = platforms.slice(0, 3)

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {displayedPlatforms.map((platform, index) => (
        <motion.div
          key={platform.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -10 }}
        >
          <Card className="flex flex-col h-full border-primary/20 card-hover">
            <CardHeader className="pb-4">
              <motion.div
                className="relative h-16 w-16 mb-4 rounded-lg overflow-hidden bg-white p-2"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Image
                  src={platform.logo || "/placeholder.svg"}
                  alt={`${platform.title} Logo`}
                  fill
                  className="object-contain"
                />
              </motion.div>
              <CardTitle>{platform.title}</CardTitle>
              <CardDescription className="text-base">{platform.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {platform.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                    <span>{feature}</span>
                  </motion.li>
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
  )
}

export default CounsellingPlatforms
