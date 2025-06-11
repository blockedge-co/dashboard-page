"use client"

import { motion } from "framer-motion"

interface LoadingSkeletonProps {
  className?: string
  animated?: boolean
}

export function LoadingSkeleton({ className = "", animated = true }: LoadingSkeletonProps) {
  return (
    <motion.div
      className={`bg-slate-700 rounded ${className}`}
      animate={animated ? {
        opacity: [0.4, 0.8, 0.4],
      } : {}}
      transition={animated ? {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
    />
  )
}

export function LoadingText({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-400">
      <motion.div
        className="flex gap-1"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-1 h-1 bg-emerald-400 rounded-full" />
        <div className="w-1 h-1 bg-emerald-400 rounded-full" />
        <div className="w-1 h-1 bg-emerald-400 rounded-full" />
      </motion.div>
      <span>{text}</span>
    </div>
  )
}

export function LoadingMetric({ title }: { title: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <div className="h-8 flex items-center">
        <LoadingText text="Loading..." />
      </div>
      <div className="flex items-center gap-1 mt-2">
        <LoadingSkeleton className="w-4 h-4" />
        <LoadingSkeleton className="w-16 h-3" />
      </div>
    </div>
  )
}