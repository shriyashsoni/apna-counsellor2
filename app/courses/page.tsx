import type { Metadata } from "next"
import CoursesClientPage from "./CoursesClientPage"

export const metadata: Metadata = {
  title: "Courses – Admission Preparation & Counselling Programs",
  description:
    "Discover affordable, expert-led courses to master college admissions – MHT CET, JEE, MP DTE, COMEDK and more. Learn to choose wisely & apply smartly.",
  keywords:
    "admission courses, CET prep, JEE counselling course, choice filling tutorial, how to apply for college, counselling training program, Apna Counsellor course",
}

export default function CoursesPage() {
  return <CoursesClientPage />
}
