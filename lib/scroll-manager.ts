"use client"

import { throttle } from "./performance"

export interface ScrollMetrics {
  velocity: number
  direction: "up" | "down" | "none"
  acceleration: number
  isRapid: boolean
}

export class DynamicScrollManager {
  private lastScrollY = 0
  private lastTimestamp = 0
  private velocityHistory: number[] = []
  private callbacks: ((metrics: ScrollMetrics) => void)[] = []
  private animationFrame: number | null = null

  constructor() {
    this.handleScroll = throttle(this.handleScroll.bind(this), 16) // 60fps
  }

  subscribe(callback: (metrics: ScrollMetrics) => void) {
    this.callbacks.push(callback)
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback)
    }
  }

  start() {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", this.handleScroll, { passive: true })
    }
  }

  stop() {
    if (typeof window !== "undefined") {
      window.removeEventListener("scroll", this.handleScroll)
    }
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }
  }

  private handleScroll() {
    const currentScrollY = window.scrollY
    const currentTimestamp = performance.now()

    if (this.lastTimestamp === 0) {
      this.lastScrollY = currentScrollY
      this.lastTimestamp = currentTimestamp
      return
    }

    const deltaY = currentScrollY - this.lastScrollY
    const deltaTime = currentTimestamp - this.lastTimestamp
    const velocity = Math.abs(deltaY) / deltaTime

    // Keep velocity history for acceleration calculation
    this.velocityHistory.push(velocity)
    if (this.velocityHistory.length > 5) {
      this.velocityHistory.shift()
    }

    const avgVelocity = this.velocityHistory.reduce((a, b) => a + b, 0) / this.velocityHistory.length
    const acceleration = velocity - avgVelocity

    const metrics: ScrollMetrics = {
      velocity,
      direction: deltaY > 0 ? "down" : deltaY < 0 ? "up" : "none",
      acceleration,
      isRapid: velocity > 2, // Threshold for rapid scrolling
    }

    this.callbacks.forEach((callback) => callback(metrics))

    this.lastScrollY = currentScrollY
    this.lastTimestamp = currentTimestamp
  }
}

export const scrollManager = new DynamicScrollManager()
