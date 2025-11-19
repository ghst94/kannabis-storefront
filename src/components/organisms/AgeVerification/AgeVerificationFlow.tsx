"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/atoms"
import Image from "next/image"

type VerificationStep = "age-gate" | "id-upload" | "verification" | "verified"

interface VerificationData {
  isVerified: boolean
  verificationType: "basic" | "id-verified" | "medical"
  verifiedAt?: string
  expiresAt?: string
}

export function AgeVerificationFlow() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<VerificationStep>("age-gate")
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    // Check if user has already verified age
    const verificationData = localStorage.getItem("age_verification")
    if (verificationData) {
      const data: VerificationData = JSON.parse(verificationData)
      if (data.isVerified) {
        // Check if verification is expired
        if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
          localStorage.removeItem("age_verification")
          setIsOpen(true)
          setIsAnimating(true)
        }
      } else {
        setIsOpen(true)
        setIsAnimating(true)
      }
    } else {
      setIsOpen(true)
      setIsAnimating(true)
    }
  }, [])

  const handleBasicVerification = (isOfAge: boolean) => {
    if (isOfAge) {
      // Basic verification - just stores that user clicked "I'm 21+"
      // For production, you'd want to integrate with a third-party service
      const verificationData: VerificationData = {
        isVerified: true,
        verificationType: "basic",
        verifiedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      }
      localStorage.setItem("age_verification", JSON.stringify(verificationData))
      setIsAnimating(false)
      setTimeout(() => setIsOpen(false), 300)
    } else {
      // Redirect to a safe page
      window.location.href = "https://www.samhsa.gov/"
    }
  }

  const handleIDVerification = () => {
    setStep("id-upload")
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleIDSubmit = async () => {
    if (!selectedFile) return

    setStep("verification")

    // Simulate API call to third-party verification service
    // In production, integrate with services like:
    // - Jumio
    // - Onfido
    // - Veratad
    // - AgeChecker.Net

    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store ID-verified status
      const verificationData: VerificationData = {
        isVerified: true,
        verificationType: "id-verified",
        verifiedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      }
      localStorage.setItem("age_verification", JSON.stringify(verificationData))

      setStep("verified")
      setTimeout(() => {
        setIsAnimating(false)
        setTimeout(() => setIsOpen(false), 300)
      }, 2000)
    } catch (error) {
      console.error("Verification failed:", error)
      alert("Verification failed. Please try again.")
      setStep("id-upload")
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
        {/* Age Gate Step */}
        {step === "age-gate" && (
          <>
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
              <p className="text-neutral-300 text-sm leading-relaxed mb-4">
                You must be 21 years or older to access this website. Cannabis products are for adults only.
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => handleBasicVerification(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50"
                size="large"
              >
                I&apos;M 21+
              </Button>

              <Button
                onClick={handleIDVerification}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-lg transition-all duration-300"
                size="large"
              >
                VERIFY WITH ID
              </Button>

              <Button
                onClick={() => handleBasicVerification(false)}
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-4 rounded-lg transition-all duration-300"
                size="large"
              >
                UNDER 21
              </Button>
            </div>

            {/* Legal disclaimer */}
            <p className="text-xs text-neutral-500 text-center mt-6 leading-relaxed">
              By entering this site, you accept our terms and confirm you are of legal age in your jurisdiction.
            </p>
          </>
        )}

        {/* ID Upload Step */}
        {step === "id-upload" && (
          <>
            <button
              onClick={() => setStep("age-gate")}
              className="absolute top-4 left-4 text-neutral-400 hover:text-white transition-colors"
            >
              ← Back
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-3">
                Upload Government ID
              </h2>
              <p className="text-neutral-300 text-sm">
                Please upload a clear photo of your government-issued ID
              </p>
            </div>

            {/* File upload area */}
            <div className="mb-6">
              <label
                htmlFor="id-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-emerald-500/50 rounded-lg cursor-pointer bg-emerald-900/20 hover:bg-emerald-900/30 transition-colors"
              >
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={previewUrl}
                      alt="ID preview"
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-12 h-12 mb-3 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-neutral-300">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-neutral-500">PNG, JPG (MAX. 10MB)</p>
                  </div>
                )}
                <input
                  id="id-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
            </div>

            <Button
              onClick={handleIDSubmit}
              disabled={!selectedFile}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all duration-300"
              size="large"
            >
              VERIFY ID
            </Button>

            <p className="text-xs text-neutral-500 text-center mt-4">
              Your information is encrypted and secure. We comply with all privacy regulations.
            </p>
          </>
        )}

        {/* Verification Processing Step */}
        {step === "verification" && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Verifying Your ID
            </h2>
            <p className="text-neutral-300 text-sm">
              Please wait while we verify your information...
            </p>
          </div>
        )}

        {/* Verified Step */}
        {step === "verified" && (
          <div className="text-center py-8">
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Verification Complete!
            </h2>
            <p className="text-neutral-300 text-sm">
              You&apos;re all set. Redirecting you to the store...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
