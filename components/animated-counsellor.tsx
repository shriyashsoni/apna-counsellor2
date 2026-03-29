"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

const AnimatedCounsellor = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load the GIFER animation
    if (containerRef.current) {
      const iframe = document.createElement("iframe")
      iframe.src = "https://gifer.com/embed/9viJ"
      iframe.width = "100%"
      iframe.height = "300"
      iframe.style.border = "none"
      iframe.allowFullscreen = true

      containerRef.current.appendChild(iframe)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 p-4"
    >
      <div ref={containerRef} className="w-full h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading animation...</div>
      </div>
      <div className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
        <a href="https://gifer.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
          via GIFER
        </a>
      </div>
    </motion.div>
  )
}

export default AnimatedCounsellor
