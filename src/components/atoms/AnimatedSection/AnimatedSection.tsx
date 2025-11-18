"use client"

import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { cn } from "@/lib/utils"

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "left" | "right"
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up"
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation(0.1)

  const animationClass = {
    up: "animate-fadeInUp",
    left: "animate-slideInLeft",
    right: "animate-slideInRight"
  }[direction]

  return (
    <div
      ref={ref}
      className={cn(
        "opacity-0 transition-opacity duration-700",
        isVisible && "opacity-100",
        isVisible && animationClass,
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
