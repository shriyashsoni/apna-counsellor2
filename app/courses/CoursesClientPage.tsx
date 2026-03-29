"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle, Gift, Phone, Mail, MapPin, Instagram } from "lucide-react"
import { motion } from "framer-motion"

export default function CoursesClientPage() {
  const courses = [
    {
      id: "mhtcet",
      title: "MHT CET Counselling Support 2025",
      description: "Get end-to-end support for MHT CET 2025: from documentation to final college admission.",
      logo: "/images/mht-cet-logo.webp",
      highlights: [
        "Expert Guidance",
        "Personalized 1-on-1 Sessions",
        "Strategic Help with CAP Rounds, Choice Filling",
        "Cutoff Analysis, College Reviews",
        "Scholarship + Management Quota Support",
      ],
      bonuses: ["Roadmap PDF", "Mistake Sheet", "Priority List"],
      fee: "₹1000",
      paymentLink: "https://pages.razorpay.com/pl_QX3SVcl6JWTzXx/view",
    },
    {
      id: "josaa",
      title: "JoSAA Counselling Support 2025",
      description: "Full guidance for JoSAA 2025 – including NITs, IIITs, GFTIs, and IITs.",
      logo: "/images/josaa-logo.png",
      highlights: [
        "Rank-based Counseling",
        "Freeze/Float/Slide Support",
        "Cutoff Data for IITs/NITs",
        "College & Branch Prediction",
        "Fee Matrix, Category Quota Assistance",
      ],
      bonuses: ["Smart Roadmap", "Mistake Sheet", "Cutoff Chart"],
      fee: "₹1000",
      paymentLink: "https://rzp.io/rzp/LCzbmwuB",
    },
    {
      id: "mpdte",
      title: "MP DTE Counselling Support 2025",
      description: "Complete help for students applying through MP DTE 2025 portal.",
      logo: "/images/mp-dte-logo.jpeg",
      highlights: [
        "College Prediction for Round 1, 2, CLC",
        "Document Support & Choice Filling",
        "Fee Structures & Cutoff Insights",
        "Scholarship & Management Quota Assistance",
        "Real-Time WhatsApp + Call Support",
      ],
      bonuses: ["Alerts", "Mistake Guide", "College Review PDF"],
      fee: "₹1000",
      paymentLink: "https://rzp.io/rzp/EkwtGHQr",
    },
    {
      id: "comedk",
      title: "COMEDK Counselling Support 2025",
      description: "Expert assistance for all COMEDK counselling rounds in 2025.",
      logo: "/images/comedk-logo.png",
      highlights: [
        "College List Based on Your Rank",
        "Spot Round + Management Quota Guidance",
        "Fee Structure & Scholarship Help",
        "Live Counseling on WhatsApp / Call",
        "Document Verification, Choice Filling Help",
      ],
      bonuses: ["Mistakes Sheet", "College Guide", "PDF Materials"],
      fee: "₹1000",
      paymentLink: "https://rzp.io/rzp/PRpyJv9",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">🎓 Counselling Support Courses 2025</h1>
          <p className="text-lg max-w-3xl mx-auto">
            We provide personalized, expert guidance to help you navigate the entire counseling process for engineering
            admissions in 2025. Whether you're appearing for <strong>MHT CET</strong>, <strong>JoSAA</strong>,{" "}
            <strong>MP DTE</strong>, or <strong>COMEDK</strong>, we're here to ensure you take the{" "}
            <strong>right steps at the right time</strong> and get into your dream college confidently.
          </p>
        </motion.div>

        <div className="space-y-16">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-primary/20 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="relative h-32 w-32 rounded-lg overflow-hidden bg-white p-2 flex-shrink-0 mx-auto md:mx-0">
                      <Image
                        src={course.logo || "/placeholder.svg"}
                        alt={`${course.title} Logo`}
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <CardTitle className="text-2xl md:text-3xl">{course.title}</CardTitle>
                      <CardDescription className="text-base mt-2">
                        <span className="font-medium">By Apna Counsellor</span>
                      </CardDescription>
                      <p className="mt-2 text-gray-700 dark:text-gray-300">{course.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary mr-2" />
                        Key Highlights:
                      </h3>
                      <ul className="space-y-2">
                        {course.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-2"></div>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center">
                          <Gift className="h-5 w-5 text-primary mr-2" />
                          Bonuses:
                        </h3>
                        <ul className="space-y-2">
                          {course.bonuses.map((bonus, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-2"></div>
                              <span>{bonus}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Course Fee:</h3>
                        <p className="text-2xl font-bold text-primary">{course.fee}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 p-6">
                  <div className="w-full max-w-xs">
                    <Link href={course.paymentLink} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="w-full animated-gradient text-white hover:text-white mb-3">
                        Buy Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <p className="text-center text-sm text-gray-500 mt-2">Secure payment via Razorpay</p>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 bg-gray-50 dark:bg-gray-800 p-8 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-6">📞 Contact Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-primary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">WhatsApp</h3>
                  <a href="https://wa.me/919109881906" className="text-primary hover:underline">
                    +91 9109881906
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <a href="mailto:apnacounsellor@gmail.com" className="text-primary hover:underline">
                    apnacounsellor@gmail.com
                  </a>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p>Mumbai, Maharashtra</p>
                </div>
              </div>
              <div className="flex items-start">
                <Instagram className="h-5 w-5 text-primary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Instagram</h3>
                  <a
                    href="https://www.instagram.com/counsellorapna/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    @counsellorapna
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="mb-6">
            Contact us directly for any queries about our counselling support courses or to discuss your specific needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="https://wa.link/cld3hu" target="_blank" rel="noopener noreferrer">
              <Button className="animated-gradient text-white hover:text-white">
                Chat on WhatsApp
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
