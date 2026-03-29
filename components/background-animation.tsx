"use client"

import { useTheme } from "next-themes"
import { useEffect, useRef } from "react"

export const BackgroundAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!containerRef.current) return

    // Clear previous content
    containerRef.current.innerHTML = ""

    // Create iframe element
    const iframe = document.createElement("iframe")

    // Set the animation source based on theme
    iframe.src = theme === "dark" ? "https://gifer.com/embed/1ktC" : "https://gifer.com/embed/J59"

    iframe.width = "100%"
    iframe.height = "100%"
    iframe.style.position = "absolute"
    iframe.style.top = "0"
    iframe.style.left = "0"
    iframe.style.border = "none"
    iframe.style.pointerEvents = "none"
    iframe.style.zIndex = "-1"
    iframe.allowFullscreen = true

    // Append iframe to container
    containerRef.current.appendChild(iframe)

    // Add attribution
    const attribution = document.createElement("p")
    attribution.innerHTML =
      '<a href="https://gifer.com" class="text-xs text-gray-400 absolute bottom-2 right-2 opacity-50 hover:opacity-100">via GIFER</a>'
    containerRef.current.appendChild(attribution)

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [theme])

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden z-[-1]" style={{ opacity: 0.15 }} />
  )
}

export default BackgroundAnimation
