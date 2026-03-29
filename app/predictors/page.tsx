import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BarChart, Calculator, ExternalLink } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "College Predictor Tools – MHT CET, JEE, COMEDK, MP",
  description:
    "Use our smart college predictor tools to know your best college options for MHT CET, JEE, MP DTE & COMEDK based on your rank, score & preferences.",
  keywords:
    "college predictor tool, MHT CET predictor 2025, JEE college predictor, COMEDK tool, MP DTE admission predictor, best college after CET",
}

export default function PredictorsPage() {
  const predictors = [
    {
      title: "MHT CET College Predictor",
      description: "Predict engineering and pharmacy colleges in Maharashtra based on your CET score and category.",
      platform: "MHT CET Counselling",
      url: "https://mht-apnacounsellor.vercel.app/predictor",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mht%20cet%20counselling%20logo-iAo3Zgvl5SBFGL1Y26jz5NMPynroZa.webp",
      features: [
        "Branch-wise predictions",
        "Category-wise analysis",
        "Home university factor",
        "Previous year cutoffs",
        "Accurate for all CAP rounds",
      ],
    },
    {
      title: "JoSAA College Predictor",
      description: "Predict IITs, NITs, IIITs, and GFTIs based on your JEE Main/Advanced rank and category.",
      platform: "JEE/JoSAA Counselling",
      url: "https://apnacounsellorjossa.vercel.app/predictor",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/josssa%20counsellingn%20logo-atNsaGWHl9WWt67tNukFEAUWJVu4cC.png",
      features: [
        "IIT, NIT, IIIT, and GFTI predictions",
        "Category-wise closing ranks",
        "Round-wise analysis",
        "Branch comparison",
        "Gender-neutral and female-only seat analysis",
      ],
    },
    {
      title: "MP DTE College Predictor",
      description: "Predict engineering and pharmacy colleges in Madhya Pradesh based on your rank and category.",
      platform: "MP DTE Counselling",
      url: "https://apnacounsellormpdte.vercel.app/predictor",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mp%20dte%20counselling.jpg-Rc3eTqdZl7fpCmhiejovrdEF6EIa7a.jpeg",
      features: [
        "College-wise predictions",
        "Category-wise analysis",
        "Fee structure comparison",
        "Previous year trends",
        "Round-wise predictions",
      ],
    },
    {
      title: "COMEDK College Predictor",
      description: "Predict engineering colleges in Karnataka based on your COMEDK UGET rank and category.",
      platform: "COMEDK Counselling",
      url: "https://comedkcounselling.vercel.app/predictor",
      logo: "/images/comedk-logo.png",
      features: [
        "College-wise predictions for Karnataka",
        "Branch-wise analysis",
        "COMEDK vs CET comparison",
        "Fee structure details",
        "Previous year cutoff trends",
      ],
    },
  ]

  const upcomingPredictors = [
    {
      title: "NEET UG College Predictor",
      description: "For MBBS/BDS admissions across India through state counselling and AIQ.",
      expectedLaunch: "June 2025",
    },
    {
      title: "NEET PG Specialty Predictor",
      description: "For MD/MS/PG Diploma course predictions based on NEET PG rank.",
      expectedLaunch: "July 2025",
    },
    {
      title: "BITSAT/VITEEE/SRMJEE Predictor",
      description: "For private universities like BITS, VIT, and SRM.",
      expectedLaunch: "April 2025",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">College Predictors</h1>
        <p className="text-lg mb-12">
          Our college predictors use verified data from previous counselling rounds to help you estimate which colleges
          and branches you can get based on your rank, category, and preferences.
        </p>

        <h2 className="text-2xl font-bold mb-6">Available Predictors</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {predictors.map((predictor, index) => (
            <Card key={index} className="flex flex-col h-full border-primary/20 card-hover">
              <CardHeader className="pb-4">
                <div className="relative h-16 w-16 mb-4 rounded-lg overflow-hidden bg-white p-2">
                  <Image
                    src={predictor.logo || "/placeholder.svg"}
                    alt={`${predictor.platform} Logo`}
                    fill
                    className="object-contain"
                  />
                </div>
                <CardTitle>{predictor.title}</CardTitle>
                <CardDescription className="text-base">{predictor.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <h3 className="font-semibold mb-2 text-sm">Features:</h3>
                <ul className="space-y-1 text-sm">
                  {predictor.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={predictor.url} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button className="w-full">
                    Use Predictor
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg mb-12">
          <div className="flex items-start gap-6">
            <div className="hidden md:block">
              <Calculator className="h-16 w-16 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">How Our Predictors Work</h2>
              <p className="mb-4">
                Our college predictors are built using verified data from previous years' counselling rounds. We analyze
                trends, closing ranks, and seat matrices to provide accurate predictions.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white font-bold mr-3 text-xs">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Enter Your Details</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Input your rank, category, and preferences
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white font-bold mr-3 text-xs">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Data Analysis</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Our algorithm analyzes previous year trends
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white font-bold mr-3 text-xs">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Get Predictions</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      View colleges and branches you can likely get
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white font-bold mr-3 text-xs">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium">Make Informed Choices</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Use predictions to fill your choice form strategically
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Coming Soon</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {upcomingPredictors.map((predictor, index) => (
            <Card key={index} className="border-dashed border-gray-300">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">{predictor.title}</CardTitle>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {predictor.expectedLaunch}
                  </span>
                </div>
                <CardDescription className="text-base">{predictor.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                  <BarChart className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Need Personalized Predictions?</h2>
          <p className="text-lg mb-6">
            For more accurate and personalized college predictions based on your specific situation, book a counselling
            call with our experts.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/book-call">
              <Button className="animated-gradient text-white hover:text-white">
                Book a Counselling Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/counselling">
              <Button variant="outline">
                Explore Counselling Platforms
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
