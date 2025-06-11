"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { AlertTriangle, Home, RefreshCw, ArrowLeft, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ErrorPageProps {
  errorCode: string
  title: string
  description: string
  suggestion: string
}

export function ErrorPage({ errorCode, title, description, suggestion }: ErrorPageProps) {
  const handleRefresh = () => {
    window.location.reload()
  }

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
          <CardContent className="p-12 text-center">
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            {/* Error Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-6"
            >
              <h1 className="text-6xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
                {errorCode}
              </h1>
              <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
              <p className="text-slate-400 text-lg mb-2">{description}</p>
              <p className="text-slate-300">{suggestion}</p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 w-full sm:w-auto">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="border-slate-700 text-slate-300 hover:bg-slate-700/50 w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="border-slate-700 text-slate-300 hover:bg-slate-700/50 w-full sm:w-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
            </motion.div>

            {/* Additional Help */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-12 pt-8 border-t border-slate-700"
            >
              <p className="text-slate-400 text-sm mb-4">If the problem persists, please contact our support team</p>
              <Button variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute -top-20 -left-20 w-40 h-40 bg-red-500/20 rounded-full blur-xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.15, 0.1],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-20 -right-20 w-60 h-60 bg-orange-500/20 rounded-full blur-xl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-slate-500 text-sm">© 2024 Blockedge. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
