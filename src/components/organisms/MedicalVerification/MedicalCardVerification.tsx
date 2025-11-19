"use client"

import { useState } from "react"
import { Button } from "@/components/atoms"
import Image from "next/image"

interface MedicalCardData {
  cardNumber: string
  expirationDate: string
  state: string
  patientName: string
  issueDate: string
  cardImage?: string
}

interface MedicalVerificationProps {
  onVerified: (data: MedicalCardData) => void
  onCancel: () => void
}

export function MedicalCardVerification({
  onVerified,
  onCancel,
}: MedicalVerificationProps) {
  const [step, setStep] = useState<"upload" | "details" | "verifying" | "verified">("upload")
  const [cardImage, setCardImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<MedicalCardData>>({
    cardNumber: "",
    expirationDate: "",
    state: "",
    patientName: "",
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCardImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (field: keyof MedicalCardData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setStep("verifying")

    try {
      // Simulate API call to verify medical card
      // In production, integrate with state medical cannabis registries
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const medicalData: MedicalCardData = {
        cardNumber: formData.cardNumber || "",
        expirationDate: formData.expirationDate || "",
        state: formData.state || "",
        patientName: formData.patientName || "",
        issueDate: new Date().toISOString(),
        cardImage: previewUrl || undefined,
      }

      // Store in localStorage (in production, store in backend)
      localStorage.setItem("medical_verification", JSON.stringify(medicalData))

      setStep("verified")
      setTimeout(() => {
        onVerified(medicalData)
      }, 2000)
    } catch (error) {
      console.error("Medical card verification failed:", error)
      alert("Verification failed. Please check your information and try again.")
      setStep("details")
    }
  }

  const isFormValid = () => {
    return (
      formData.cardNumber &&
      formData.expirationDate &&
      formData.state &&
      formData.patientName &&
      cardImage
    )
  }

  const states = [
    "California", "Colorado", "Washington", "Oregon", "Nevada", "Arizona",
    "New Mexico", "Illinois", "Michigan", "Massachusetts", "New York",
    "New Jersey", "Pennsylvania", "Maryland", "Virginia", "Florida",
  ]

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-barlow font-bold text-gray-900 mb-2">
          Medical Card Verification
        </h2>
        <p className="text-gray-600">
          Verify your medical cannabis card to access medical pricing and products
        </p>
      </div>

      {/* Upload Step */}
      {step === "upload" && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Upload Medical Card
            </label>
            <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-emerald-500 rounded-lg cursor-pointer bg-emerald-50 hover:bg-emerald-100 transition-colors">
              <label htmlFor="medical-card-upload" className="cursor-pointer w-full h-full flex items-center justify-center">
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={previewUrl}
                      alt="Medical card preview"
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-16 h-16 mb-4 text-emerald-600"
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
                    <p className="mb-2 text-gray-700 font-semibold">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, or PDF (MAX. 10MB)
                    </p>
                  </div>
                )}
              </label>
              <input
                id="medical-card-upload"
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setStep("details")}
              disabled={!cardImage}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg"
            >
              Continue
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Your medical information is protected under HIPAA and state privacy laws
          </p>
        </>
      )}

      {/* Details Step */}
      {step === "details" && (
        <>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Patient Name (as shown on card)
              </label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => handleInputChange("patientName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Medical Card Number
              </label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="MC-123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                State
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Expiration Date
              </label>
              <input
                type="date"
                value={formData.expirationDate}
                onChange={(e) => handleInputChange("expirationDate", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setStep("upload")}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg"
            >
              Verify Card
            </Button>
          </div>
        </>
      )}

      {/* Verifying Step */}
      {step === "verifying" && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600 mb-6"></div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Verifying Medical Card
          </h3>
          <p className="text-gray-600">
            Please wait while we verify your medical cannabis card...
          </p>
        </div>
      )}

      {/* Verified Step */}
      {step === "verified" && (
        <div className="text-center py-12">
          <div className="text-6xl mb-6">✅</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Medical Card Verified!
          </h3>
          <p className="text-gray-600 mb-4">
            You now have access to medical pricing and products
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full">
            <span className="font-semibold">Medical Patient Status: Active</span>
          </div>
        </div>
      )}
    </div>
  )
}
