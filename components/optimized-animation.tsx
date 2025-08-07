"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useLazyLoad } from "@/hooks/use-lazy-load"

interface OptimizedAnimationProps {
  children: ReactNode
  className?: string
  animationClass: string
  delay?: number
  threshold?: number
  rootMargin?: string
}

export function OptimizedAnimation({
  children,
  className = "",
  animationClass,
  delay = 0,
  threshold = 0.1,
  rootMargin = "0px",
}: OptimizedAnimationProps) {
  const { isVisible, elementRef } = useLazyLoad<HTMLDivElement>({
    threshold,
    rootMargin,
    triggerOnce: true,
  })

  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShouldAnimate(true)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [isVisible, delay])

  return (
    <div ref={elementRef} className={`${className} ${shouldAnimate ? animationClass : ""}`}>
      {children}
    </div>
  )
}
