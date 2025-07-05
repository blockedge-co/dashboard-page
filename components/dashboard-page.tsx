"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LazyDashboard } from "./lazy-components"
import { LoadingScreen } from "./loading-screen"
import { ErrorBoundaryWrapper } from "./error-boundary"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Optimize loading time - reduce artificial delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <ErrorBoundaryWrapper name="Dashboard Page">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingScreen key="loading" />
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen"
            >
              <LazyDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundaryWrapper>
  )
}
