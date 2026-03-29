"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TermsConditionsPage() {
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

          <h1 className="text-4xl font-bold mb-8">📜 Terms and Conditions</h1>
          <p className="text-sm text-gray-500 mb-8">Effective Date: 19 May 2025</p>

          <div className="prose dark:prose-invert max-w-none">
            <p>These Terms & Conditions govern your use of the Apna Counsellor platform and services.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms:</h2>
            <p>
              By accessing this website or using our services, you agree to abide by these terms and all applicable
              laws.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Services:</h2>
            <p>
              Apna Counsellor offers academic counseling, admission guidance, career mentorship, and support for
              entrance exams such as MHT CET, JEE, CUET, etc.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. User Responsibilities:</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate personal and academic details.</li>
              <li>Do not share false or misleading information.</li>
              <li>You are responsible for maintaining the confidentiality of your login details.</li>
              <li>Respect other users and refrain from spamming or misuse of the platform.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Payment & Refund Policy:</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Counseling sessions, form support, and paid services are chargeable.</li>
              <li>Once booked, counseling sessions are non-refundable unless canceled 24 hours in advance.</li>
              <li>Custom refund situations will be handled on a case-by-case basis.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Intellectual Property:</h2>
            <p>
              All content (logos, videos, designs, content, etc.) on this website belongs to Apna Counsellor. You may
              not copy, reproduce, or distribute any materials without our written permission.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Third-party Links:</h2>
            <p>
              Our site may contain links to third-party websites. We are not responsible for their content or privacy
              practices.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Termination:</h2>
            <p>
              We reserve the right to suspend or terminate user access for violating our terms or engaging in harmful
              behavior.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Changes to Terms:</h2>
            <p>
              Apna Counsellor reserves the right to change or modify these terms at any time. Your continued use of the
              site means you accept those changes.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">9. Contact:</h2>
            <p>
              For any questions or complaints, email us at{" "}
              <a href="mailto:apnacounsellor@gmail.com" className="text-primary">
                apnacounsellor@gmail.com
              </a>{" "}
              or message us at <strong>+91 91098 81906</strong>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
