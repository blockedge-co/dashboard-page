"use client"

import { useState, useEffect } from 'react'

interface PerformanceMetrics {
  shouldReduceAnimations: boolean
  deviceMemory: number | undefined
  hardwareConcurrency: number
  connectionType: string | undefined
}

export function usePerformance(): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    shouldReduceAnimations: false,
    deviceMemory: undefined,
    hardwareConcurrency: navigator.hardwareConcurrency || 4,
    connectionType: undefined
  })

  useEffect(() => {
    const checkPerformance = () => {
      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Get device memory if available (Chrome only)
      const deviceMemory = (navigator as any).deviceMemory

      // Get connection information if available
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
      const connectionType = connection?.effectiveType

      // Determine if we should reduce animations based on various factors
      let shouldReduceAnimations = prefersReducedMotion

      // Reduce animations on low-end devices
      if (deviceMemory && deviceMemory <= 4) {
        shouldReduceAnimations = true
      }

      // Reduce animations on slow connections
      if (connectionType && (connectionType === 'slow-2g' || connectionType === '2g')) {
        shouldReduceAnimations = true
      }

      // Reduce animations on devices with few CPU cores
      if (navigator.hardwareConcurrency <= 2) {
        shouldReduceAnimations = true
      }

      setMetrics({
        shouldReduceAnimations,
        deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency || 4,
        connectionType
      })
    }

    checkPerformance()

    // Listen for changes in user preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', checkPerformance)

    return () => {
      mediaQuery.removeEventListener('change', checkPerformance)
    }
  }, [])

  return metrics
}

// Hook for conditional animation props
export function useAnimationProps(shouldAnimate: boolean = true) {
  const { shouldReduceAnimations } = usePerformance()
  
  const animate = shouldAnimate && !shouldReduceAnimations

  return {
    animate,
    initial: animate ? { opacity: 0, y: 20 } : false,
    whileHover: animate ? { y: -5 } : undefined,
    transition: animate ? { duration: 0.3 } : { duration: 0 }
  }
}