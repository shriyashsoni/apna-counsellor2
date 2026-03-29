"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Award, BookOpen, Calendar, Users } from "lucide-react"
import { motion } from "framer-motion"

export default function FounderPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-6"
        >
          Our Founder
        </motion.h1>

        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative h-64 w-64 rounded-full overflow-hidden bg-white border-4 border-primary/20"
              >
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SHRIYASH%20SONI%20PICTURE.jpg-c5GaVmj4OmQTGnwqngVnEfMFzWodvl.jpeg"
                  alt="Shriyash Soni"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Shriyash Soni</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">Founder, Apna Counsellor</p>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  A passionate young entrepreneur and student mentor, dedicated to making career counselling accessible,
                  affordable, and effective for every student in India.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Student Entrepreneur</div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Career Counsellor</div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Tech Enthusiast</div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Data Science Student</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-4">The Journey</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Shriyash Soni, a first-year Data Science student at RGPV University, founded Apna Counsellor with a vision
              to transform how students approach college admissions in India.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Having experienced the confusion and lack of reliable guidance during his own admission process, Shriyash
              decided to create a platform that provides verified data, real guidance, and unbiased mentorship to help
              students make informed decisions.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              What started as helping a few friends with college selection has now grown into a platform that has guided
              over 5000+ students across India.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-4">Achievements</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Award className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                <p>Helped 1200+ students with personalized counselling sessions</p>
              </div>
              <div className="flex items-start">
                <Award className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                <p>Successfully completed 12+ direct admissions</p>
              </div>
              <div className="flex items-start">
                <Award className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                <p>Built 4 dedicated counselling platforms from scratch</p>
              </div>
              <div className="flex items-start">
                <Award className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                <p>Created a community of 5000+ students</p>
              </div>
              <div className="flex items-start">
                <Award className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                <p>Featured in local education forums and events</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Founder's Vision</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Users className="h-8 w-8 mb-4 text-primary" />,
                title: "Accessible Counselling",
                description:
                  "Make quality counselling accessible to every student regardless of their background or location.",
              },
              {
                icon: <BookOpen className="h-8 w-8 mb-4 text-primary" />,
                title: "Data-Driven Decisions",
                description:
                  "Empower students with verified data and insights to make informed decisions about their future.",
              },
              {
                icon: <Calendar className="h-8 w-8 mb-4 text-primary" />,
                title: "Nationwide Impact",
                description:
                  "Guide 100,000+ students by 2026 through comprehensive counselling platforms for all major exams.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card-hover"
              >
                <Card className="p-6 border-primary/20">
                  <CardContent className="p-0">
                    {item.icon}
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">A Message from Shriyash</h2>
          <blockquote className="border-l-4 border-primary pl-4 italic text-gray-700 dark:text-gray-300 mb-6">
            "I believe that every student deserves access to accurate information and personalized guidance when making
            one of the most important decisions of their life - choosing the right college and course. Through Apna
            Counsellor, I'm committed to bridging the gap between students and their dream colleges, one counselling
            session at a time."
          </blockquote>
          <p className="text-right">- Shriyash Soni, Founder</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Connect with Shriyash</h2>
          <p className="text-lg mb-6">Have questions or want to learn more about Apna Counsellor's journey?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="https://wa.link/cld3hu" target="_blank" rel="noopener noreferrer">
              <Button className="animated-gradient text-white hover:text-white">
                Book a Call with Shriyash
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
