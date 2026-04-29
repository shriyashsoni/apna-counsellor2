import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ConvexClientProvider } from "@/components/convex-client-provider"
import { getCategorizedCounselling } from "@/lib/counselling"
import LayoutWrapper from "@/components/layout-wrapper"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  themeColor: "#6d28d9",
  colorScheme: "light dark",
}

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let categorizedCounselling = { national: [], state: [], international: [] };
  try {
    categorizedCounselling = await getCategorizedCounselling()
  } catch (error) {
    console.error("Failed to fetch counselling data:", error);
  }
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
        <ConvexAuthNextjsServerProvider>
          <ConvexClientProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <LayoutWrapper categorizedCounselling={categorizedCounselling}>
                {children}
              </LayoutWrapper>
            </ThemeProvider>
          </ConvexClientProvider>
        </ConvexAuthNextjsServerProvider>
      </body>
    </html>
  )
}
