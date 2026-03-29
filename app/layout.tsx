import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BackgroundAnimation from "@/components/background-animation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Apna Counsellor - India's Trusted Counselling Platform for Admissions",
  description:
    "Get expert guidance for MHT CET, JEE (JoSAA), MP DTE & COMEDK counselling. Use free tools like college predictors, cutoff analysis & more.",
  keywords:
    "Apna Counsellor, college admission help, MHT CET counselling, JEE JoSAA 2025, MP DTE 2025, COMEDK counselling, college predictor, admission expert, CAP rounds guidance",
  icons: {
    icon: [
      {
        url: "/images/apna-counsellor-logo.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/images/apna-counsellor-logo.png",
        type: "image/png",
      },
    ],
  },
  verification: {
    google: "XiIvcBHSzEY9KT6NPb2TYpfz-KEgACNLUk_mb6qsd94",
  },
  other: {
    "google-site-verification": "XiIvcBHSzEY9KT6NPb2TYpfz-KEgACNLUk_mb6qsd94",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="XiIvcBHSzEY9KT6NPb2TYpfz-KEgACNLUk_mb6qsd94" />
        <link rel="icon" href="/images/apna-counsellor-logo.png" type="image/png" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5711051199759574"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex min-h-screen flex-col">
            <BackgroundAnimation />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
