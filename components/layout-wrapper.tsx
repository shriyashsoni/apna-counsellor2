"use client"

import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BackgroundAnimation from "@/components/background-animation"
import { Toaster } from "sonner"

// Load chatbot ONLY on client side, NEVER during SSR
// This prevents @heyputer/puter.js from crashing on mobile browsers
const AIChatbot = dynamic(
  () => import("@/components/ai/chatbot").then(mod => ({ default: mod.AIChatbot })),
  { ssr: false }
)

export default function LayoutWrapper({ 
  children, 
  categorizedCounselling 
}: { 
  children: React.ReactNode, 
  categorizedCounselling: any 
}) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")

  return (
    <div className="flex min-h-screen flex-col">
      <BackgroundAnimation />
      {!isDashboard && <Navbar categorizedCounselling={categorizedCounselling} />}
      <main className="flex-1">{children}</main>
      {!isDashboard && <Footer />}
      <AIChatbot />
      <Toaster position="top-center" richColors />
    </div>
  )
}
