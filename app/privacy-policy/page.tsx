"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/">
            <Button variant="ghost" className="mb-6 pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <h1 className="text-4xl font-bold mb-8">🔒 Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Effective Date: 19 May 2025</p>

          <div className="prose dark:prose-invert max-w-none">
            <p>
              At Apna Counsellor (
              <a href="https://www.apnacounsellor.site" className="text-primary">
                https://www.apnacounsellor.site
              </a>
              ), your privacy is very important to us. This Privacy Policy outlines how we collect, use, protect, and
              handle your personal information.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect:</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Personal Information:</strong> Name, email address, phone number, and other details you provide
                during registration, form submissions, or consultations.
              </li>
              <li>
                <strong>Usage Data:</strong> Pages visited, time spent on pages, IP address, and device/browser
                information.
              </li>
              <li>
                <strong>Third-Party Data:</strong> If you access our platform via social media or third-party links, we
                may receive certain profile information.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information:</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide counseling services and academic support.</li>
              <li>To personalize your experience.</li>
              <li>For internal analytics to improve our services.</li>
              <li>To contact you via email, WhatsApp, or phone regarding counseling or updates.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Sharing Your Information:</h2>
            <p>
              We <strong>do not</strong> sell, trade, or transfer your personal data to outside parties except trusted
              partners who assist us in operating our platform, conducting business, or servicing you — so long as they
              agree to keep the information confidential.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Cookies:</h2>
            <p>
              We use cookies to understand and save your preferences for future visits. You may choose to disable
              cookies through your browser settings.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Security:</h2>
            <p>We implement a variety of security measures to maintain the safety of your personal information.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Your Rights:</h2>
            <p>
              You may access, update, or delete your data by contacting us at{" "}
              <a href="mailto:apnacounsellor@gmail.com" className="text-primary">
                apnacounsellor@gmail.com
              </a>
              .
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Changes to This Policy:</h2>
            <p>
              We may update our Privacy Policy from time to time. Changes will be posted on this page with an updated
              "Effective Date."
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Contact Us:</h2>
            <p>
              If you have any questions, email us at{" "}
              <a href="mailto:apnacounsellor@gmail.com" className="text-primary">
                apnacounsellor@gmail.com
              </a>{" "}
              or WhatsApp us at <strong>+91 91098 81906</strong>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
