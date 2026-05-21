import type { Metadata } from "next"
import CoursesClientPage from "./CoursesClientPage"

export const metadata: Metadata = {
  title: "Courses – Admission Preparation & Counselling Programs",
  description:
    "Discover affordable, expert-led courses to master college admissions – MHT CET, JEE, MP DTE, COMEDK and more. Learn to choose wisely & apply smartly.",
  keywords:
    "admission courses, CET prep, JEE counselling course, choice filling tutorial, how to apply for college, counselling training program, Apna Counsellor course",
  openGraph: {
    title: "Courses – Admission Preparation & Counselling Programs",
    description: "Discover affordable, expert-led courses to master college admissions – MHT CET, JEE, MP DTE, COMEDK and more.",
    url: "https://www.apnacounsellor.in/courses",
    siteName: "Apna Counsellor",
    images: [
      {
        url: "https://www.apnacounsellor.in/images/counseling-preview-v3.png",
        width: 1200,
        height: 630,
        alt: "Apna Counsellor Courses",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Courses – Admission Preparation & Counselling Programs",
    description: "Discover affordable, expert-led courses to master college admissions.",
    images: ["https://www.apnacounsellor.in/images/counseling-preview-v3.png"],
  }
}

export default function CoursesPage() {
  return <CoursesClientPage />
}
