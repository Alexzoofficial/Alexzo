"use client"

import { useState, useEffect } from "react"
import { SafeImage } from "./safe-image"
import { useLazyLoad } from "@/hooks/use-lazy-load"

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  quality?: number
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  quality = 75,
}: OptimizedImageProps) {
  const { isVisible, elementRef } = useLazyLoad<HTMLDivElement>()
  const [isLoaded, setIsLoaded] = useState(false)

  // Skip lazy loading if priority is true
  useEffect(() => {
    if (priority) {
      setIsLoaded(true)
    }
  }, [priority])

  return (
    <div ref={elementRef} className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {(isVisible || priority) && (
        <SafeImage
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          className={`transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setIsLoaded(true)}
          priority={priority}
          fallbackSrc="/placeholder.svg"
        />
      )}
      {!isLoaded && <div className="absolute inset-0 bg-gray-800 animate-pulse" style={{ width, height }} />}
    </div>
  )
}
