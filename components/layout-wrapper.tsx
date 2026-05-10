"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BackgroundAnimation from "@/components/background-animation"
import { AIChatbot } from "@/components/ai/chatbot"
import { Toaster } from "sonner"

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
