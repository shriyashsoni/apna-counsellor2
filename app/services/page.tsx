import CoursesClientPage from "../courses/CoursesClientPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Counselling Support Courses 2026 – Apna Counsellor",
  description:
    "Discover affordable, expert-led courses to master college admissions – MHT CET, JEE, MP DTE, COMEDK and more. Learn to choose wisely & apply smartly.",
  keywords:
    "admission courses, CET prep, JEE counselling course, choice filling tutorial, how to apply for college, counselling training program, Apna Counsellor course",
}

import { redirect } from "next/navigation"

export default function ServicesPage() {
  redirect("/courses")
}
