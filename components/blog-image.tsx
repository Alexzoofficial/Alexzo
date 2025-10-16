"use client"

import { SafeImage } from "./safe-image"

interface BlogImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

export function BlogImage({ src, alt, className = "", width = 800, height = 400 }: BlogImageProps) {
  return (
    <SafeImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-lg object-cover ${className}`}
      fallbackSrc={`/placeholder.svg?height=${height}&width=${width}&text=Blog+Image`}
      fallbackText="Blog Image"
    />
  )
}
