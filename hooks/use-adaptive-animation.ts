"use client"

import { useEffect, useState } from "react"
import { scrollManager, type ScrollMetrics } from "@/lib/scroll-manager"

interface AdaptiveAnimationConfig {
  baseSpeed: number
  rapidMultiplier: number
  slowMultiplier: number
  threshold: number
}

export function useAdaptiveAnimation(
  config: AdaptiveAnimationConfig = {
    baseSpeed: 1,
    rapidMultiplier: 2.5,
    slowMultiplier: 0.7,
    threshold: 1.5,
  },
) {
  const [animationSpeed, setAnimationSpeed] = useState(config.baseSpeed)
  const [scrollMetrics, setScrollMetrics] = useState<ScrollMetrics | null>(null)

  useEffect(() => {
    scrollManager.start()

    const unsubscribe = scrollManager.subscribe((metrics) => {
      setScrollMetrics(metrics)

      let speed = config.baseSpeed

      if (metrics.isRapid || metrics.velocity > config.threshold) {
        speed = config.baseSpeed * config.rapidMultiplier
      } else if (metrics.velocity < 0.5) {
        speed = config.baseSpeed * config.slowMultiplier
      }

      setAnimationSpeed(speed)
    })

    return () => {
      unsubscribe()
      scrollManager.stop()
    }
  }, [config])

  return {
    animationSpeed,
    scrollMetrics,
    isRapidScrolling: scrollMetrics?.isRapid || false,
  }
}
