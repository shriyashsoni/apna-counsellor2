"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function AboutClientPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-6"
        >
          About Us
        </motion.h1>

        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative h-64 w-full mb-6 rounded-lg overflow-hidden"
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/add%20this%20website%20icon%20and%20logo.jpg-b0JRqyahhgtZntLcmUuuMxEERrMRvz.jpeg"
              alt="Apna Counsellor Logo"
              fill
              className="object-contain"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg mb-6"
          >
            <strong>Apna Counsellor</strong> was launched with a mission to make{" "}
            <strong>career counselling accessible, affordable, and effective</strong> for every student in India.
            Whether you're preparing for{" "}
            <strong>MHT CET, JEE Mains & Advanced (JoSAA Counselling), MP DTE, or COMEDK</strong>, our platform provides
            personalized counselling to help you secure admission to the best possible college based on your scores,
            preferences, and career goals.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg"
            >
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-gray-700 dark:text-gray-300">
                To empower students with verified data, real guidance, and unbiased mentorship to help them make
                informed decisions for a brighter future.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg"
            >
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We aim to guide <strong>100,000+ students</strong> by 2026 through our counselling platforms, online
                resources, and expert support. Our counselling covers every major Indian entrance exam and state-level
                admission process, with upcoming expansions into <strong>NEET UG, PG</strong>, and other fields.
              </p>
            </motion.div>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl font-bold mb-4"
          >
            Why Choose Apna Counsellor?
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              "Affordable Counselling: Starting from just ₹250 per session",
              "Verified Resources: Official PDFs, cutoffs, and data only",
              "College Predictor Tools: Built using actual counselling round data",
              "Direct College Admission Support: For management quota seats",
              "Live WhatsApp and Call Support: 24x7 availability for booked students",
              "Multi-language Counselling: Hindi, English, and Marathi options",
              "Expert Counsellors: Experienced team & trained by top universities",
            ].map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                className="flex items-start"
              >
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                <p>{point}</p>
              </motion.div>
            ))}
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-2xl font-bold mb-4"
          >
            Our Impact
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-lg mb-6"
          >
            Over <strong>5000+ students</strong> have already connected with us. Our founder, Shriyash Soni, has
            personally helped <strong>1200+ students</strong> with personalized counselling sessions and successfully
            completed <strong>12+ direct admissions</strong>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            <Link href="/founder">
              <Button className="animated-gradient text-white hover:text-white">
                Meet Our Founder
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/services">
              <Button variant="outline">
                Explore Our Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/contact">
              <Button variant="outline">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
