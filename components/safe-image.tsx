"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string
  fallbackText?: string
}

export function SafeImage({
  src,
  alt,
  fallbackSrc = "/placeholder.svg?height=400&width=400&text=Image",
  fallbackText,
  className = "",
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)
  const [showFallbackText, setShowFallbackText] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc)
      setHasError(true)
    } else {
      setShowFallbackText(true)
    }
  }

  if (showFallbackText && fallbackText) {
    return (
      <div className={`flex items-center justify-center bg-gray-800 text-gray-400 ${className}`} {...props}>
        <span className="text-sm">{fallbackText}</span>
      </div>
    )
  }

  return <Image {...props} src={imgSrc || "/placeholder.svg"} alt={alt} className={className} onError={handleError} />
}
