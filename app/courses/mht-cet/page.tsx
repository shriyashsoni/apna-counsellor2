"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CheckCircle, Gift, Phone, Mail, Calendar, FileText } from "lucide-react"
import { motion } from "framer-motion"

export default function MHTCETCoursePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/courses">
            <Button variant="ghost" className="mb-6 pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Courses
            </Button>
          </Link>

          <div className="mb-8">
            <div className="relative w-full h-auto rounded-lg overflow-hidden mb-6">
              <Image
                src="/images/mht-cet-counselling.png"
                alt="MHT CET Counselling Support 2025"
                width={1200}
                height={675}
                className="w-full object-contain"
                priority
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center md:text-left">
              MHT CET Counselling Support 2025
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4 text-center md:text-left">By Apna Counsellor</p>
            <p className="text-gray-700 dark:text-gray-300">
              Get end-to-end support for MHT CET 2025: from documentation to final college admission. Our expert team
              will guide you through every step of the counselling process to help you secure a seat in your dream
              college.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <CheckCircle className="h-6 w-6 text-primary mr-2" />
                What You'll Get
              </h2>
              <ul className="space-y-4">
                {[
                  "Complete guidance for CAP Rounds 1, 2 & 3",
                  "Personalised help in college selection",
                  "Detailed document checklist and formats",
                  "Latest cutoff data & PDFs for 2024",
                  "Help with choice filling strategy",
                  "Fee structure of top 100+ colleges",
                  "Scholarship eligibility & application help",
                  "Access to college reviews (Govt/Private/Autonomous)",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    className="flex items-start"
                  >
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Gift className="h-6 w-6 text-primary mr-2" />
                Additional Benefits
              </h2>
              <ul className="space-y-4 mb-8">
                {[
                  {
                    title: "Help with freeze/float/slide options",
                    description: "Get expert guidance on making the right decision for your preferences",
                  },
                  {
                    title: "Access to private & management quota insights",
                    description: "Learn about additional admission opportunities beyond the regular process",
                  },
                  {
                    title: "Live support via WhatsApp + Direct Calls",
                    description: "Get your queries resolved instantly throughout the counselling process",
                  },
                  {
                    title: "Free bonus: Roadmap PDF, Priority College List, Mistake Sheet",
                    description: "Exclusive resources to help you navigate the admission process efficiently",
                  },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                    className="flex items-start"
                  >
                    <FileText className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-4">Course Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Support throughout the entire counselling process
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="font-medium">Support</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">WhatsApp, call, and email assistance</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="font-medium">Updates</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Real-time alerts for important dates and events
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg mb-12">
            <h2 className="text-2xl font-bold mb-6">
              Course Fee: <span className="line-through">₹1999</span> ₹999
            </h2>
            <p className="mb-6">
              Invest in your future with our comprehensive MHT CET counselling support. Get expert guidance to secure
              admission in your dream college.
            </p>
            <div className="max-w-xs mx-auto">
              <Link
                href="https://pages.razorpay.com/pl_QX3SVcl6JWTzXx/view"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button className="w-full animated-gradient text-white hover:text-white mb-3">
                  Buy Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <p className="text-center text-sm text-gray-500 mt-2">Secure payment via Razorpay</p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Why Choose Apna Counsellor?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Expert Guidance",
                  description: "Our team has helped 1200+ students secure admissions in top colleges",
                },
                {
                  title: "Personalized Approach",
                  description: "We provide customized guidance based on your rank and preferences",
                },
                {
                  title: "Comprehensive Support",
                  description: "From document verification to final admission, we're with you at every step",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="card-hover"
                >
                  <Card className="p-6 border-primary/20 h-full">
                    <CardContent className="p-0">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
            <p className="text-lg mb-6">
              Contact us directly for any queries about our MHT CET counselling support or to discuss your specific
              needs.
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
          </div>
        </motion.div>
      </div>
    </div>
  )
}
