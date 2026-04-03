import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Services – Counselling, College Selection, Choice Filling & More",
  description:
    "Explore all services offered by Apna Counsellor – including college predictors, document support, one-on-one guidance, and dedicated entrance exam platforms.",
  keywords:
    "college admission services, counselling support, document help, choice filling, CAP round strategy, JoSAA counselling, personalized guidance",
}

export default function ServicesPage() {
  const services = [
    {
      id: "mhtcet",
      title: "MHT CET Counselling",
      description: "Explore Maharashtra's top engineering, pharmacy, and BTech colleges based on your CET rank.",
      link: "https://mht-cet.apnacounsellor.in/",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mht%20cet%20counselling%20logo-iAo3Zgvl5SBFGL1Y26jz5NMPynroZa.webp",
      features: [
        "College Predictor Tool",
        "Institute-Wise Cutoffs",
        "Seat Matrix & Fee Structures",
        "Live 1-on-1 Counselling Support",
        "Documents Required Guide",
        "Expert Guidance for CAP Rounds",
      ],
    },
    {
      id: "jossa",
      title: "JEE Mains & Advanced – JoSAA Counselling",
      description: "Get help with NITs, IIITs, GFTIs, and IIT admissions via JoSAA & CSAB.",
      link: "https://jossa.apnacounsellor.in/",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/josssa%20counsellingn%20logo-atNsaGWHl9WWt67tNukFEAUWJVu4cC.png",
      features: [
        "AI-Based College Predictor",
        "Branch-Wise Cutoff Data",
        "Institute Comparison Tool",
        "Category-wise Seat Matrix",
        "Documents Checklist & Guidance",
        "CSAB Special Round Insights",
      ],
    },
    {
      id: "mpdte",
      title: "MP DTE Counselling",
      description: "Your complete guide for engineering and pharmacy colleges in Madhya Pradesh through DTE MP.",
      link: "https://mpdte.apnacounsellor.in/",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mp%20dte%20counselling.jpg-Rc3eTqdZl7fpCmhiejovrdEF6EIa7a.jpeg",
      features: [
        "MP College Predictor",
        "Round-Wise Cutoffs",
        "Fee Structures and Admission Criteria",
        "Documents List for Verification",
        "Live Help for Registration and Locking Choices",
      ],
    },
    {
      id: "comedk",
      title: "COMEDK Counselling",
      description: "Complete guidance for engineering aspirants in Karnataka seeking admission through COMEDK UGET.",
      link: "https://comedk.apnacounsellor.in/",
      logo: "/images/comedk-logo.png",
      features: [
        "Karnataka Engineering College Guide",
        "COMEDK vs CET Comparison",
        "College Predictor Tool",
        "Fee Structure Analysis",
        "Counselling Process Walkthrough",
        "Document Verification Assistance",
      ],
    },
  ]

  const upcomingServices = ["NEET UG 2025 Counselling", "NEET PG Counselling", "BITSAT, VITEEE & SRMJEE Guidance"]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Our Counselling Services</h1>
        <p className="text-lg mb-12">
          Apna Counsellor proudly provides guidance and live support for the following admission processes in 2025. Each
          platform is designed to help you navigate the complex admission process with ease.
        </p>

        <div className="space-y-12">
          {services.map((service) => (
            <Card key={service.id} className="border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-white p-2 flex-shrink-0">
                    <Image
                      src={service.logo || "/placeholder.svg"}
                      alt={`${service.title} Logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                    <CardDescription className="text-base mt-2">{service.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-3">Services Offered:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <p>{feature}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href={service.link} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button className="w-full">
                    Visit {service.title} Platform
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Coming Soon</h2>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Counselling Services</CardTitle>
              <CardDescription>
                We're constantly expanding our platforms to cover more entrance exams and admission processes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {upcomingServices.map((service, index) => (
                  <li key={index} className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-primary mr-3"></div>
                    {service}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/upcoming">
                <Button variant="outline">
                  Learn More About Upcoming Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Need Personalized Help?</h2>
          <p className="mb-6">
            Book a one-on-one counselling session with our experts to get personalized guidance for your specific
            situation.
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
        </div>
      </div>
    </div>
  )
}
