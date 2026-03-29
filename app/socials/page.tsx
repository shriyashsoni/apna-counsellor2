import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Facebook, Instagram, MessageCircle, Youtube } from "lucide-react"

export default function SocialsPage() {
  const socialPlatforms = [
    {
      name: "YouTube",
      handle: "@ApnaCounsellor",
      url: "https://www.youtube.com/@ApnaCounsellor",
      icon: <Youtube className="h-8 w-8 text-primary" />,
      description: "Video guides, college reviews, and counselling tips",
      content: [
        "Step-by-step counselling tutorials",
        "College campus tours and reviews",
        "Live Q&A sessions",
        "Rank vs college prediction videos",
        "Success stories and testimonials",
      ],
    },
    {
      name: "Instagram",
      handle: "@counsellorapna",
      url: "https://www.instagram.com/counsellorapna/",
      icon: <Instagram className="h-8 w-8 text-primary" />,
      description: "Daily updates, tips, and infographics",
      content: [
        "Daily counselling tips",
        "Important dates and deadlines",
        "College comparison infographics",
        "Student success stories",
        "Live sessions and Q&A",
      ],
    },
    {
      name: "Facebook",
      handle: "Apna Counsellor",
      url: "https://www.facebook.com/profile.php?id=61560390726245&mibextid=ZbWKwL",
      icon: <Facebook className="h-8 w-8 text-primary" />,
      description: "Community updates and detailed guides",
      content: [
        "Detailed counselling guides",
        "Community discussions",
        "Event announcements",
        "Success stories",
        "Live sessions",
      ],
    },
    {
      name: "WhatsApp",
      handle: "Apna Counsellor Community",
      url: "https://chat.whatsapp.com/LlfJI9MPk3834p4sUvRwaa",
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      description: "Real-time updates and direct support",
      content: [
        "Real-time counselling updates",
        "Important alerts and notifications",
        "Document verification reminders",
        "Direct access to counsellors",
        "Community support",
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Social Media Hub</h1>
        <p className="text-lg mb-12">
          Connect with Apna Counsellor across various social media platforms to stay updated with the latest counselling
          news, tips, and resources.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {socialPlatforms.map((platform, index) => (
            <Card key={index} className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-4">
                  {platform.icon}
                  <div>
                    <CardTitle>{platform.name}</CardTitle>
                    <CardDescription className="text-base">{platform.handle}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{platform.description}</p>
                <h3 className="font-semibold mb-2 text-sm">What you'll find:</h3>
                <ul className="space-y-1">
                  {platform.content.map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={platform.url} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button className="w-full">
                    Follow on {platform.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="bg-gray-50 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Follow Us?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Stay Updated",
                description: "Get real-time updates on counselling rounds, important dates, and admission processes.",
              },
              {
                title: "Exclusive Content",
                description: "Access guides, tips, and resources that are only shared on our social media platforms.",
              },
              {
                title: "Community Support",
                description: "Connect with other students and share experiences to make better decisions.",
              },
            ].map((item, index) => (
              <div key={index} className="p-4">
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
          <p className="text-lg mb-6">
            For direct assistance, you can always reach out to us through WhatsApp or book a counselling call.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="https://wa.link/cld3hu" target="_blank" rel="noopener noreferrer">
              <Button>
                WhatsApp Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/book-call">
              <Button variant="outline">
                Book a Counselling Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
