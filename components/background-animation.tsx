"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export const BackgroundAnimation = () => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="fixed inset-0 w-full h-full overflow-hidden z-[-1] bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800" />
    )
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-[-1] bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 opacity-40" />
  )
}

export default BackgroundAnimation
