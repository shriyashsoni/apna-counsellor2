import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="text-lg mb-12">
          Have questions or need assistance? Reach out to us through any of the following channels.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Contact Information</CardTitle>
              <CardDescription className="text-base">Reach out to us directly through these channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-primary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-gray-600">
                    <a href="tel:+919109881906" className="hover:text-primary">
                      +91 9109881906
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-600">
                    <a href="mailto:apnacounsellor@gmail.com" className="hover:text-primary">
                      apnacounsellor@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-gray-600">Mumbai, Maharashtra, India</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-4">
              <h3 className="font-medium">Quick Actions:</h3>
              <div className="flex flex-wrap gap-3">
                <Link href="https://wa.link/cld3hu" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    WhatsApp Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="tel:+919109881906">
                  <Button variant="outline" size="sm">
                    Call Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="mailto:apnacounsellor@gmail.com">
                  <Button variant="outline" size="sm">
                    Email Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Social Media</CardTitle>
              <CardDescription className="text-base">Connect with us on social platforms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start">
                <Youtube className="h-5 w-5 text-primary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">YouTube</h3>
                  <p className="text-gray-600">
                    <a
                      href="https://www.youtube.com/@ApnaCounsellor"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      @ApnaCounsellor
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Instagram className="h-5 w-5 text-primary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Instagram</h3>
                  <p className="text-gray-600">
                    <a
                      href="https://www.instagram.com/counsellorapna/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      @counsellorapna
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Facebook className="h-5 w-5 text-primary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Facebook</h3>
                  <p className="text-gray-600">
                    <a
                      href="https://www.facebook.com/profile.php?id=61560390726245&mibextid=ZbWKwL"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      Apna Counsellor
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/socials" className="w-full">
                <Button variant="outline" className="w-full">
                  View All Social Media
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
          <p className="mb-6">
            Stay updated with all counselling-related announcements, live sessions, cutoffs, expert tips, and college
            predictors by joining our WhatsApp Group.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="https://chat.whatsapp.com/LlfJI9MPk3834p4sUvRwaa" target="_blank" rel="noopener noreferrer">
              <Button>
                Join WhatsApp Group
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

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Need Immediate Assistance?</h2>
          <p className="text-lg mb-6">For urgent queries, WhatsApp or call us directly.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="https://wa.link/cld3hu" target="_blank" rel="noopener noreferrer">
              <Button size="lg">
                WhatsApp Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="tel:+919109881906">
              <Button variant="outline" size="lg">
                Call +91 9109881906
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
