"use client"

import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BackgroundAnimation from "@/components/background-animation"
import { Toaster } from "sonner"



export default function LayoutWrapper({ 
  children, 
  categorizedCounselling 
}: { 
  children: React.ReactNode, 
  categorizedCounselling: any 
}) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard") || 
                      pathname?.startsWith("/admin") ||
                      pathname?.startsWith("/mentor/dashboard") ||
                      pathname?.startsWith("/mentor/availability") ||
                      pathname?.startsWith("/mentor/services") ||
                      pathname?.startsWith("/mentor/settings")

  return (
    <div className="flex min-h-screen flex-col">
      <BackgroundAnimation />
      {!isDashboard && <Navbar categorizedCounselling={categorizedCounselling} />}
      <main className="flex-1">{children}</main>
      {!isDashboard && <Footer />}

      <Toaster position="top-center" richColors />
    </div>
  )
}
