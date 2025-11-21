"use client"

import { useState, useEffect } from "react"

interface PointsDisplayProps {
  points: number
  label?: string
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export default function PointsDisplay({
  points,
  label = "Points",
  size = 'md',
  animated = true
}: PointsDisplayProps) {
  const [displayPoints, setDisplayPoints] = useState(animated ? 0 : points)

  useEffect(() => {
    if (!animated) {
      setDisplayPoints(points)
      return
    }

    const duration = 1000
    const steps = 30
    const increment = points / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= points) {
        setDisplayPoints(points)
        clearInterval(timer)
      } else {
        setDisplayPoints(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [points, animated])

  const sizeClasses = {
    sm: 'text-3xl',
    md: 'text-5xl',
    lg: 'text-7xl',
  }

  const labelClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2">
        <span className={`font-barlow font-black ${sizeClasses[size]} text-cookies-yellow`}>
          {displayPoints.toLocaleString()}
        </span>
        <span className="text-cookies-yellow text-2xl">★</span>
      </div>
      <p className={`text-zinc-400 ${labelClasses[size]} font-bold uppercase tracking-wide`}>
        {label}
      </p>
    </div>
  )
}
