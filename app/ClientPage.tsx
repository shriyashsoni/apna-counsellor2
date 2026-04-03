"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, BookOpen, CheckCircle, MessageCircle, Phone, Calendar } from "lucide-react"
import HeroSection from "@/components/hero-section"
import CounsellingPlatforms from "@/components/counselling-platforms"
import TestimonialSection from "@/components/testimonial-section"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />

      {/* About Section */}
      <section className="py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">About Apna Counsellor</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Apna Counsellor was launched with a mission to make career counselling accessible, affordable, and
              effective for every student in India. Whether you're preparing for MHT CET, JEE Mains & Advanced (JoSAA
              Counselling), or MP DTE, our platform provides personalized counselling to help you secure admission to
              the best possible college.
            </p>
            <div className="space-y-2">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-1" />
                <p>Expert guidance for all major entrance exams</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-1" />
                <p>Verified data and college predictors</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-1" />
                <p>Personalized counselling sessions</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-1" />
                <p>Affordable pricing starting at just ₹250</p>
              </div>
            </div>
            <Link href="/about">
              <Button className="mt-6 animated-gradient text-white hover:text-white">
                Learn More About Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg"
          >
            <h3 className="text-2xl font-bold mb-4">Our Founder – Shriyash Soni</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Meet Shriyash Soni, the visionary behind Apna Counsellor. A first-year Data Science student at RGPV
              University, Shriyash has already helped 1200+ students with personalized counselling sessions and
              successfully completed 12+ direct admissions.
            </p>
            <Link href="/founder">
              <Button variant="outline">
                Read Founder's Story
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="py-12 bg-gray-50 dark:bg-gray-900 rounded-xl p-8"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Counselling Services in 2026</h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Apna Counsellor proudly provides guidance and live support for the following admission processes
          </p>
        </div>

        <CounsellingPlatforms />

        <div className="text-center mt-8">
          <Link href="/services">
            <Button size="lg" className="animated-gradient text-white hover:text-white">
              View All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="py-12"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
            <Card className="border-primary/20 h-full card-hover">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-6 w-6 mr-2 text-primary" />
                  Join Our WhatsApp Channel
                </CardTitle>
                <CardDescription>
                  Stay updated with all counselling-related announcements, live sessions, cutoffs, expert tips, and
                  college predictors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Benefits of joining:</p>
                <ul className="space-y-2 list-disc pl-5 mb-4">
                  <li>Real-time updates on counselling rounds</li>
                  <li>Free resources and guides</li>
                  <li>Connect with other students</li>
                  <li>Get your questions answered</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link
                  href="https://whatsapp.com/channel/0029VabjCVD5PO11jeEupQ44"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full">Join WhatsApp Channel</Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
            <Card className="border-primary/20 h-full card-hover">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-6 w-6 mr-2 text-primary" />
                  Book Your Counselling Call
                </CardTitle>
                <CardDescription>Want personalized help? Book a direct call with our expert now</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">What you'll get:</p>
                <ul className="space-y-2 list-disc pl-5 mb-4">
                  <li>One-on-one personalized guidance</li>
                  <li>College selection based on your rank</li>
                  <li>Document verification assistance</li>
                  <li>Step-by-step counselling process help</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="https://wa.link/cld3hu" target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button className="w-full animated-gradient text-white hover:text-white">Book a Call Now</Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <TestimonialSection />

      {/* Upcoming Features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="py-12 bg-gray-50 dark:bg-gray-900 rounded-xl p-8"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { icon: <BookOpen className="h-8 w-8 mb-2 text-primary" />, title: "College Prediction Bots" },
            { icon: <Calendar className="h-8 w-8 mb-2 text-primary" />, title: "Real-time Counselling Alerts" },
            { icon: <CheckCircle className="h-8 w-8 mb-2 text-primary" />, title: "Scholarship Alerts" },
            { icon: <BookOpen className="h-8 w-8 mb-2 text-primary" />, title: "Top Colleges List 2025" },
            { icon: <BookOpen className="h-8 w-8 mb-2 text-primary" />, title: "NEET UG/PG Websites" },
            { icon: <MessageCircle className="h-8 w-8 mb-2 text-primary" />, title: "Student Success Stories" },
            { icon: <BookOpen className="h-8 w-8 mb-2 text-primary" />, title: "Downloadable PDFs & Checklists" },
            { icon: <Phone className="h-8 w-8 mb-2 text-primary" />, title: "Video Counselling" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.05 }}
            >
              <Card className="text-center p-4 border-primary/10 card-hover">
                <CardContent className="p-4">
                  <div className="flex justify-center">{feature.icon}</div>
                  <h3 className="font-medium">{feature.title}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}
