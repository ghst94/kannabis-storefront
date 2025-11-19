"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/atoms"
import Image from "next/image"

export function AgeGate() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check if user has already verified age
    const isVerified = localStorage.getItem("age_verified")
    if (!isVerified) {
      setIsOpen(true)
      setIsAnimating(true)
    }
  }, [])

  const handleVerify = (isOfAge: boolean) => {
    if (isOfAge) {
      localStorage.setItem("age_verified", "true")
      setIsAnimating(false)
      setTimeout(() => setIsOpen(false), 300)
    } else {
      // Redirect to a safe page or show error
      window.location.href = "https://www.samhsa.gov/"
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`relative max-w-md w-full mx-4 bg-gradient-to-br from-emerald-900 via-purple-900 to-black border-2 border-emerald-500/30 rounded-2xl p-8 shadow-2xl shadow-emerald-500/20 transition-transform duration-300 ${
          isAnimating ? "scale-100" : "scale-95"
        }`}
      >
        {/* Logo/Brand */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white tracking-widest mb-2">
            KANNABIS
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-purple-500 mx-auto rounded-full" />
        </div>

        {/* Cannabis leaf decoration */}
        <div className="text-center mb-6 opacity-40">
          <div className="text-6xl">🌿</div>
        </div>

        {/* Age verification message */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">
            Age Verification Required
          </h2>
          <p className="text-neutral-300 text-sm leading-relaxed">
            You must be 21 years or older to access this website. Cannabis products are for adults only.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <Button
            onClick={() => handleVerify(true)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50"
            size="large"
          >
            I&apos;M 21+
          </Button>
          <Button
            onClick={() => handleVerify(false)}
            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-4 rounded-lg transition-all duration-300"
            size="large"
          >
            UNDER 21
          </Button>
        </div>

        {/* Legal disclaimer */}
        <p className="text-xs text-neutral-500 text-center mt-6 leading-relaxed">
          By entering this site, you accept our terms and confirm you are of legal age in your jurisdiction.
        </p>
      </div>
    </div>
  )
}
