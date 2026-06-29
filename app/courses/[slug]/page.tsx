import { createClient } from "@/lib/supabase/server"
import { Metadata } from "next"
import CourseDetailClient from "./CourseDetailClient"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic";

interface CoursePageProps {
  params: {
    slug: string
  }
}

// ── Helper: strip HTML tags ───────────────────────────────────────────────────
const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();

// ── Per-course SEO data for the 3 featured products ──────────────────────────
const COURSE_SEO: Record<
  string,
  { titleSuffix: string; extraKeywords: string[]; faq: { q: string; a: string }[] }
> = {
  // Match by slug substring – keys are checked with .includes()
  mpdte: {
    titleSuffix: "MPDTE 2026 Choice Filling List – Personalized College Preference Order",
    extraKeywords: [
      "MPDTE 2026", "MP DTE choice filling", "MPDTE counselling 2026",
      "MP DTE college preference list", "MPDTE 2026 cutoff analysis",
      "MP DTE engineering admission 2026", "MPDTE rank wise college list",
      "MPDTE seat matrix 2026", "Madhya Pradesh engineering counselling",
      "MPDTE 2026 choice filling guidance",
    ],
    faq: [
      { q: "What is MPDTE 2026 Choice Filling List?", a: "It is a personalized PDF report prepared by Apna Counsellor that gives you Dream, Target, and Safe college recommendations for MPDTE 2026 counselling based on your rank, category, quota, and branch preferences." },
      { q: "How is the MPDTE choice filling list prepared?", a: "The list is prepared using 5-year cutoff analysis, rank trend data, seat matrix, and counselling insights specifically for Madhya Pradesh engineering admissions." },
      { q: "What is the price of MPDTE 2026 Choice Filling List?", a: "The MPDTE 2026 Choice Filling List is priced at ₹499 only." },
      { q: "How many college recommendations are included?", a: "The report includes Dream colleges, Target colleges, and Safe colleges arranged in a proper preference order to maximize your admission chances." },
      { q: "When should I buy the MPDTE 2026 choice filling list?", a: "You should get it before MPDTE counselling rounds begin so you can submit your choices with maximum data-driven confidence." },
    ],
  },
  comedk: {
    titleSuffix: "COMEDK 2026 Choice Filling List – Dream, Target & Safe Colleges PDF",
    extraKeywords: [
      "COMEDK 2026", "COMEDK choice filling list 2026", "COMEDK counselling 2026",
      "COMEDK college preference order", "COMEDK cutoff 2026",
      "COMEDK engineering admission 2026", "COMEDK rank wise colleges",
      "COMEDK 2026 seat allotment", "Karnataka engineering admission",
      "COMEDK choice filling guidance PDF",
    ],
    faq: [
      { q: "What is the COMEDK 2026 Choice Filling List?", a: "It is a professionally prepared personalized PDF report by Apna Counsellor that includes Dream, Target, and Safe college recommendations for COMEDK 2026 counselling based on your rank and preferences." },
      { q: "What does the COMEDK choice filling report include?", a: "The report includes Dream Colleges List, Target Colleges List, Safe Colleges List, Personalized Preference Order, PDF Report, and Choice Filling Guidance." },
      { q: "How much does the COMEDK 2026 Choice Filling List cost?", a: "The COMEDK 2026 Choice Filling List is priced at ₹799 only." },
      { q: "Is COMEDK counselling difficult to navigate?", a: "COMEDK counselling involves multiple rounds and a large number of colleges. A personalized choice filling list helps you pick the right colleges in the right order to maximize your admission chances." },
      { q: "How do I get my COMEDK choice filling list?", a: "After purchasing, Apna Counsellor prepares your personalized PDF report based on your submitted rank, branch preferences, and admission goals." },
    ],
  },
  josaa: {
    titleSuffix: "JoSAA 2026 Choice Filling List – IIT NIT IIIT GFTI Personalized Report",
    extraKeywords: [
      "JoSAA 2026", "JoSAA choice filling list 2026", "JoSAA counselling 2026",
      "JoSAA college preference order", "JoSAA cutoff 2026",
      "JEE Main counselling 2026", "JEE Advanced counselling 2026",
      "IIT admission 2026", "NIT admission 2026", "IIIT admission 2026",
      "GFTI admission 2026", "JoSAA seat allotment 2026",
      "JoSAA choice filling guidance PDF", "JEE Main rank based college list",
    ],
    faq: [
      { q: "What is JoSAA 2026 Choice Filling List?", a: "It is a personalized PDF report by Apna Counsellor that gives you IIT, NIT, IIIT, and GFTI college recommendations based on your JEE Main rank, JEE Advanced rank (if applicable), category, gender, home state, and branch preferences." },
      { q: "What is included in the JoSAA 2026 choice filling report?", a: "The report includes Dream, Target, and Safe College recommendations for IITs, NITs, IIITs, and GFTIs arranged in a proper preference order based on rank-based analysis." },
      { q: "What is the price of JoSAA 2026 Choice Filling List?", a: "The JoSAA 2026 Choice Filling List is priced at ₹799 only." },
      { q: "Do I need JEE Advanced rank for JoSAA choice filling?", a: "If you are targeting IITs, your JEE Advanced rank is used. For NITs, IIITs, and GFTIs, your JEE Main rank is sufficient. Apna Counsellor prepares recommendations accordingly." },
      { q: "How many rounds does JoSAA counselling have?", a: "JoSAA typically has 5–6 rounds of seat allotment. Having a well-planned choice filling list is critical to secure the best possible seat in the first round itself." },
    ],
  },
};

function getCourseSeoByCourseSlug(slug: string) {
  const s = slug.toLowerCase();
  if (s.includes('josaa') || s.includes('jee')) return COURSE_SEO.josaa;
  if (s.includes('comedk')) return COURSE_SEO.comedk;
  if (s.includes('mpdte') || s.includes('mp-dte') || s.includes('mp_dte')) return COURSE_SEO.mpdte;
  return null;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  try {
    const supabase = createClient()
    const { data: course, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (error || !course) {
      return {
        title: "Course Not Found | Apna Counsellor",
        description: "The requested course could not be found."
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.apnacounsellor.in';
    const courseUrl = `${baseUrl}/courses/${course.slug}`;
    const courseSpecific = getCourseSeoByCourseSlug(course.slug);

    let ogImageUrl = `${baseUrl}/images/default-course-og.png`;
    if (course.thumbnail_url) {
      ogImageUrl = course.thumbnail_url.startsWith('http')
        ? course.thumbnail_url
        : `${baseUrl}${course.thumbnail_url.startsWith('/') ? '' : '/'}${course.thumbnail_url}`;
    }

    const cleanDescription =
      course.tagline ||
      (course.description ? stripHtml(course.description).substring(0, 200) : null) ||
      `Get personalized ${course.title} prepared by Apna Counsellor. Includes Dream, Target & Safe college recommendations.`;

    // ── Title: rich, keyword-first for the 3 featured courses ────────────────
    const pageTitle = courseSpecific
      ? `${courseSpecific.titleSuffix} | Apna Counsellor`
      : `${course.title} | Apna Counsellor – Expert Counselling Guidance 2026`;

    // ── Keywords: global base + category + course-specific extras ─────────────
    const baseKeywords = [
      course.title,
      "choice filling list 2026",
      "college counselling 2026",
      "personalized college preference order",
      "Apna Counsellor",
      "Dream Target Safe college list",
      "engineering admission 2026",
      course.category,
    ];
    const keywords = [...baseKeywords, ...(courseSpecific?.extraKeywords || [])]
      .filter(Boolean)
      .join(", ");

    return {
      title: pageTitle,
      description: cleanDescription,
      keywords,
      alternates: { canonical: courseUrl },
      openGraph: {
        title: pageTitle,
        description: cleanDescription,
        url: courseUrl,
        siteName: 'Apna Counsellor',
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: course.title }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description: cleanDescription,
        images: [ogImageUrl],
        site: "@apnacounsellor",
        creator: "@apnacounsellor",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
      },
    };
  } catch (err) {
    console.error("Error generating course metadata:", err);
    return {
      title: "Course Details | Apna Counsellor",
      description: "Explore our premium counselling support courses."
    };
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  let course = null;

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (error) {
      console.error("Supabase query error on course details:", error)
    } else {
      course = data
    }
  } catch (err) {
    console.error("Failed to fetch course details from Supabase:", err)
  }

  if (!course) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.apnacounsellor.in';
  const courseUrl = `${baseUrl}/courses/${course.slug}`;
  const courseSpecific = getCourseSeoByCourseSlug(course.slug);
  const cleanDesc = course.tagline || (course.description ? stripHtml(course.description).substring(0, 250) : course.title);

  // ── 1. Course + Product schema (enables pricing in Google results) ──────────
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": cleanDesc,
    "url": courseUrl,
    "provider": {
      "@type": "Organization",
      "name": "Apna Counsellor",
      "url": baseUrl,
      "logo": `${baseUrl}/images/apna-counsellor-logo.png`,
      "sameAs": [
        "https://www.instagram.com/apnacounsellor",
        "https://twitter.com/apnacounsellor",
      ]
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "PT1H",
      "inLanguage": ["en", "hi"]
    },
    "offers": {
      "@type": "Offer",
      "price": String(course.price || 499),
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": courseUrl,
      "seller": { "@type": "Organization", "name": "Apna Counsellor" }
    }
  };

  // ── 2. FAQ schema for 3 featured courses (major Google rich-result signal) ──
  const faqSchema = courseSpecific?.faq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": courseSpecific.faq.map((item) => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": { "@type": "Answer", "text": item.a }
        }))
      }
    : null;

  // ── 3. BreadcrumbList schema ────────────────────────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Courses", "item": `${baseUrl}/courses` },
      { "@type": "ListItem", "position": 3, "name": course.title, "item": courseUrl }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <CourseDetailClient slug={params.slug} initialCourse={course} />
    </>
  );
}
