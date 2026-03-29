import { articles } from "@/lib/articles"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { Facebook, Twitter, Linkedin, PhoneIcon as Whatsapp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card" // Import Card components

// Generate static params for all blog posts
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

// Generate metadata for each blog post
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const article = articles.find((a) => a.slug === params.slug)

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested blog article could not be found.",
    }
  }

  return {
    title: article.seoDescription.split(" - ")[0], // Use the first part of the description as title
    description: article.seoDescription,
    keywords: article.seoKeywords,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug)

  if (!article) {
    notFound()
  }

  // Get related articles (e.g., first 3 different from current)
  const relatedArticles = articles.filter((a) => a.slug !== article.slug).slice(0, 3)

  // Replace with your actual domain for social sharing
  const currentUrl = `https://apnacounsellor.com/blog/${article.slug}`

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <article className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">{article.title}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Published on{" "}
              {new Date(article.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* Social Share Buttons */}
          <div className="flex justify-center gap-4 py-4 border-y border-gray-200 dark:border-gray-800">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              aria-label="Share on Facebook"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              aria-label="Share on Twitter"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + " " + currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-50"
              aria-label="Share on WhatsApp"
            >
              <Whatsapp className="h-6 w-6" />
            </a>
          </div>

          <div className="prose prose-gray max-w-none dark:prose-invert">
            {/* Placeholder for AdSense ad unit */}
            {/* To display ads, you'll need to generate an ad unit from your Google AdSense account
                and paste its code here. For example:
                <div className="my-8 text-center">
                  <ins className="adsbygoogle"
                       style={{ display: 'block' }}
                       data-ad-client="ca-pub-5711051199759574"
                       data-ad-slot="YOUR_AD_SLOT_ID"
                       data-ad-format="auto"
                       data-full-width-responsive="true"></ins>
                  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
                </div>
            */}
            <p>{article.content}</p>
            {/* SEO Tips for content:
                - Use H2 for major subheadings within the content (e.g., `<h2>Section Title</h2>`).
                - Use H3 for minor subheadings (e.g., `<h3>Subsection Title</h3>`).
                - Add alt text to any images if you include them: `<img src="/path/to/image.jpg" alt="Descriptive alt text for image" />`
                - Insert internal links to other relevant articles or pages on your site using `<Link href="/path/to/other-page">Link Text</Link>`.
                - Consider adding a FAQ section at the end of relevant articles for rich snippet opportunities.
                - For advanced SEO, explore structured data (JSON-LD) for articles to provide more context to search engines.
            */}
          </div>

          {/* Call to Action */}
          <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg text-center space-y-4">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              Ready to Boost Your Engineering Journey?
            </h2>
            <p className="text-blue-700 dark:text-blue-300">
              Connect with Apna Counsellor for personalized guidance, mock tests, and admission support.
            </p>
            <Link href="/book-call" passHref>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Book a Free Counselling Session</Button>
            </Link>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold">Related Articles</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map((related) => (
                  <Link key={related.slug} href={`/blog/${related.slug}`} passHref>
                    <Card className="p-4 hover:shadow-lg transition-shadow">
                      <CardContent className="space-y-2">
                        <CardTitle className="text-lg font-semibold">{related.title}</CardTitle>
                        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                          {related.seoDescription.split(" - ")[0]}...
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </section>
  )
}
