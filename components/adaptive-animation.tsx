"use client"

import { useEffect, useState, type ReactNode } from "react"
import { motion, type Variants } from "framer-motion"
import { useLazyLoad } from "@/hooks/use-lazy-load"
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
  const { isVisible, elementRef } = useLazyLoad<HTMLDivElement>({
    threshold,
    rootMargin,
    triggerOnce: true,
  })

  const { animationSpeed, isRapidScrolling } = useAdaptiveAnimation()
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const adaptiveDelay = isRapidScrolling ? delay * 0.3 : delay
      const timer = setTimeout(() => {
        setShouldAnimate(true)
      }, adaptiveDelay)

      return () => clearTimeout(timer)
    }
  }, [isVisible, delay, isRapidScrolling])

  return (
    <div ref={elementRef} className={className}>
      <motion.div
        initial="hidden"
        animate={shouldAnimate ? "visible" : "hidden"}
        variants={variants}
        transition={{
          duration: 0.6 / animationSpeed,
          ease: "easeOut",
          delay: 0,
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
