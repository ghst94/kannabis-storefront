"use client"

import { useEffect, useState } from "react"
import { getLimitsSummary } from "@/lib/services/purchaseLimits"

interface PurchaseLimitsDisplayProps {
  userId: string
  userType: "recreational" | "medical"
}

export function PurchaseLimitsDisplay({
  userId,
  userType,
}: PurchaseLimitsDisplayProps) {
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getLimitsSummary(userId, userType)
        setSummary(data)
      } catch (error) {
        console.error("Error fetching limits summary:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [userId, userType])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!summary) return null

  const getPercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100)
  }

  const getColorClass = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 70) return "bg-yellow-500"
    return "bg-emerald-500"
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-barlow font-bold text-gray-900">
          Purchase Limits
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            userType === "medical"
              ? "bg-purple-100 text-purple-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {userType === "medical" ? "Medical" : "Recreational"}
        </span>
      </div>

      {/* Daily Limits */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-700 mb-3">Today&apos;s Limits</h4>
        <div className="space-y-3">
          {/* Flower */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Flower</span>
              <span className="font-semibold text-gray-900">
                {summary.daily.used.flower.toFixed(1)}g / {summary.daily.limit.flower}g
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getColorClass(
                  getPercentage(summary.daily.used.flower, summary.daily.limit.flower)
                )}`}
                style={{
                  width: `${getPercentage(
                    summary.daily.used.flower,
                    summary.daily.limit.flower
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Concentrates */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Concentrates</span>
              <span className="font-semibold text-gray-900">
                {summary.daily.used.concentrates.toFixed(1)}g /{" "}
                {summary.daily.limit.concentrates}g
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getColorClass(
                  getPercentage(
                    summary.daily.used.concentrates,
                    summary.daily.limit.concentrates
                  )
                )}`}
                style={{
                  width: `${getPercentage(
                    summary.daily.used.concentrates,
                    summary.daily.limit.concentrates
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Edibles */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Edibles (THC)</span>
              <span className="font-semibold text-gray-900">
                {summary.daily.used.edibles}mg / {summary.daily.limit.edibles}mg
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getColorClass(
                  getPercentage(summary.daily.used.edibles, summary.daily.limit.edibles)
                )}`}
                style={{
                  width: `${getPercentage(
                    summary.daily.used.edibles,
                    summary.daily.limit.edibles
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-bold text-gray-700 mb-2">This Month</h4>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-gray-50 rounded p-2">
            <div className="text-xs text-gray-600 mb-1">Flower</div>
            <div className="text-sm font-bold text-gray-900">
              {summary.monthly.used.flower.toFixed(0)}g
            </div>
            <div className="text-xs text-gray-500">
              of {summary.monthly.limit.flower}g
            </div>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <div className="text-xs text-gray-600 mb-1">Concentrates</div>
            <div className="text-sm font-bold text-gray-900">
              {summary.monthly.used.concentrates.toFixed(0)}g
            </div>
            <div className="text-xs text-gray-500">
              of {summary.monthly.limit.concentrates}g
            </div>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <div className="text-xs text-gray-600 mb-1">Edibles</div>
            <div className="text-sm font-bold text-gray-900">
              {summary.monthly.used.edibles}mg
            </div>
            <div className="text-xs text-gray-500">
              of {summary.monthly.limit.edibles}mg
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Limits reset daily at midnight. Compliance with state regulations is required.
      </p>
    </div>
  )
}
