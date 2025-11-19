"use client"

import { useState } from "react"
import { Button } from "@/components/atoms"
import {
  validateDeliveryAddress,
  geocodeAddress,
  type DeliveryZone,
} from "@/lib/services/geofencing"

interface DeliveryZoneSelectorProps {
  onZoneSelected: (zone: DeliveryZone) => void
}

export function DeliveryZoneSelector({ onZoneSelected }: DeliveryZoneSelectorProps) {
  const [address, setAddress] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    zone?: DeliveryZone
    message: string
  } | null>(null)

  const handleValidateAddress = async () => {
    if (!address.trim()) {
      setValidationResult({
        isValid: false,
        message: "Please enter a delivery address",
      })
      return
    }

    setIsValidating(true)

    try {
      // Geocode the address
      const coordinates = await geocodeAddress(address)

      if (!coordinates) {
        setValidationResult({
          isValid: false,
          message: "Unable to find this address. Please check and try again.",
        })
        setIsValidating(false)
        return
      }

      // Validate if address is in delivery zone
      const result = validateDeliveryAddress(coordinates.lat, coordinates.lng)
      setValidationResult(result)

      if (result.isValid && result.zone) {
        // Store address in localStorage
        localStorage.setItem(
          "delivery_address",
          JSON.stringify({
            address,
            coordinates,
            zone: result.zone,
          })
        )
        onZoneSelected(result.zone)
      }
    } catch (error) {
      console.error("Address validation error:", error)
      setValidationResult({
        isValid: false,
        message: "An error occurred while validating your address. Please try again.",
      })
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-barlow font-bold text-gray-900 mb-2">
          Delivery Address
        </h2>
        <p className="text-gray-600">
          Enter your delivery address to check availability and see delivery fees
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Street Address
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St, San Francisco, CA 94102"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-barlow"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleValidateAddress()
              }
            }}
          />
          <Button
            onClick={handleValidateAddress}
            disabled={isValidating}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-barlow font-bold px-6 py-3 rounded-lg"
          >
            {isValidating ? "Checking..." : "Check"}
          </Button>
        </div>
      </div>

      {/* Validation Result */}
      {validationResult && (
        <div
          className={`p-4 rounded-lg ${
            validationResult.isValid
              ? "bg-emerald-50 border border-emerald-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 text-2xl">
              {validationResult.isValid ? "✅" : "❌"}
            </div>
            <div className="flex-1">
              <p
                className={`font-semibold mb-1 ${
                  validationResult.isValid ? "text-emerald-800" : "text-red-800"
                }`}
              >
                {validationResult.isValid ? "Delivery Available!" : "Delivery Unavailable"}
              </p>
              <p
                className={validationResult.isValid ? "text-emerald-700" : "text-red-700"}
              >
                {validationResult.message}
              </p>

              {/* Zone Details */}
              {validationResult.isValid && validationResult.zone && (
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between items-center py-2 border-t border-emerald-200">
                    <span className="text-emerald-700 font-semibold">Delivery Fee:</span>
                    <span className="text-emerald-900 font-bold">
                      ${validationResult.zone.deliveryFee === 0
                        ? "FREE"
                        : validationResult.zone.deliveryFee}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-emerald-200">
                    <span className="text-emerald-700 font-semibold">Minimum Order:</span>
                    <span className="text-emerald-900 font-bold">
                      ${validationResult.zone.minimumOrder}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-emerald-200">
                    <span className="text-emerald-700 font-semibold">Estimated Time:</span>
                    <span className="text-emerald-900 font-bold">
                      {validationResult.zone.estimatedTime}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Map placeholder */}
      <div className="mt-6 bg-gray-100 rounded-lg h-64 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <svg
            className="w-16 h-16 mx-auto mb-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="font-semibold">Delivery Zone Map</p>
          <p className="text-sm">(Integrate Google Maps here)</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        Delivery is available 7 days a week from 9:00 AM to 9:00 PM
      </p>
    </div>
  )
}
