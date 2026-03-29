import Link from "next/link"
import { articles } from "@/lib/articles"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Apna Counsellor Blog - Expert Guidance for Engineering Aspirants",
  description:
    "Explore articles on JEE, MHT CET, college admissions, scholarships, and career tips. Get expert insights from Apna Counsellor to ace your engineering journey.",
  keywords:
    "engineering blog, JEE preparation, MHT CET guidance, college admissions, career tips, Apna Counsellor articles",
}

export default function BlogPage() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Latest Insights & Guides</h1>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Stay updated with expert advice, preparation strategies, and college insights from Apna Counsellor.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          {articles.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`} passHref>
              <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col justify-between p-6 h-full">
                  <div className="space-y-2">
                    <CardTitle className="text-xl font-bold">{article.title}</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      {article.seoDescription.split(" - ")[0]}
                    </CardDescription>
                  </div>
                  <div className="text-sm text-gray-400 dark:text-gray-500 mt-4">
                    Published:{" "}
                    {new Date(article.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
