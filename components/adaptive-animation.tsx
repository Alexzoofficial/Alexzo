"use client"

import { useEffect, useState, useRef, type ReactNode } from "react"
import { motion, type Variants } from "framer-motion"
import { useAdaptiveAnimation } from "@/hooks/use-adaptive-animation"

interface AdaptiveAnimationProps {
  children: ReactNode
  className?: string
  variants?: Variants
  delay?: number
  threshold?: number
  rootMargin?: string
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
}

export function AdaptiveAnimation({
  children,
  className = "",
  variants = defaultVariants,
  delay = 0,
  threshold = 0.1,
  rootMargin = "0px",
}: AdaptiveAnimationProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const { animationSpeed, isRapidScrolling } = useAdaptiveAnimation()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !elementRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (elementRef.current) {
            observer.unobserve(elementRef.current)
          }
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(elementRef.current)
    return () => observer.disconnect()
  }, [isMounted, threshold, rootMargin])

  useEffect(() => {
    if (isVisible && isMounted) {
      const adaptiveDelay = isRapidScrolling ? delay * 0.3 : delay
      const timer = setTimeout(() => {
        setShouldAnimate(true)
      }, adaptiveDelay)
      return () => clearTimeout(timer)
    }
  }, [isVisible, delay, isMounted, isRapidScrolling])

  return (
    <div ref={elementRef} className={className} suppressHydrationWarning>
      <motion.div
        initial="hidden"
        animate={shouldAnimate ? "visible" : "hidden"}
        variants={variants}
        transition={{
          duration: 0.6 / animationSpeed,
          ease: "easeOut",
          delay: 0,
        }}
        suppressHydrationWarning
      >
        {children}
      </motion.div>
    </div>
  )
}
