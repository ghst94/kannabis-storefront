"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/atoms"

interface COAData {
  labName: string
  testDate: string
  batchNumber: string
  cannabinoids: {
    thc: number
    cbd: number
    cbg?: number
    cbn?: number
    thca?: number
    cbda?: number
  }
  terpenes?: {
    name: string
    percentage: number
  }[]
  contaminants: {
    pesticides: "Pass" | "Fail"
    heavyMetals: "Pass" | "Fail"
    microbials: "Pass" | "Fail"
    residualSolvents: "Pass" | "Fail"
  }
  pdfUrl?: string
  qrCodeData?: string
}

interface COADisplayProps {
  coa: COAData
  productName: string
}

export function COADisplay({ coa, productName }: COADisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showQR, setShowQR] = useState(false)

  // Generate QR code data URL (in production, use a proper QR library like 'qrcode')
  const generateQRCode = (data: string) => {
    // Placeholder - in production, use a QR code generation library
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      data
    )}`
  }

  const allTestsPassed = Object.values(coa.contaminants).every((test) => test === "Pass")

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div
        className={`p-6 ${
          allTestsPassed ? "bg-gradient-to-r from-emerald-600 to-green-600" : "bg-gradient-to-r from-yellow-600 to-orange-600"
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-barlow font-bold text-white mb-2">
              Certificate of Analysis
            </h3>
            <p className="text-white/90 text-sm">
              Lab-tested for safety and potency
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full ${
            allTestsPassed ? "bg-white/20" : "bg-white/30"
          }`}>
            <span className="text-white font-bold text-sm">
              {allTestsPassed ? "✓ VERIFIED" : "⚠ REVIEW"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-gray-50">
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-600">{coa.cannabinoids.thc}%</div>
          <div className="text-sm text-gray-600 font-semibold">THC</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{coa.cannabinoids.cbd}%</div>
          <div className="text-sm text-gray-600 font-semibold">CBD</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">{coa.labName}</div>
          <div className="text-xs text-gray-600">Lab</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">{new Date(coa.testDate).toLocaleDateString()}</div>
          <div className="text-xs text-gray-600">Test Date</div>
        </div>
      </div>

      {/* Expandable Details */}
      <div className="border-t border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <span className="font-barlow font-bold text-gray-900">
            {isExpanded ? "Hide" : "View"} Detailed Results
          </span>
          <svg
            className={`w-5 h-5 text-gray-600 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isExpanded && (
          <div className="p-6 space-y-6 border-t border-gray-200">
            {/* Full Cannabinoid Profile */}
            <div>
              <h4 className="font-barlow font-bold text-gray-900 mb-3">Cannabinoid Profile</h4>
              <div className="space-y-2">
                {Object.entries(coa.cannabinoids).map(([cannabinoid, value]) => (
                  <div key={cannabinoid} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700 font-semibold uppercase">{cannabinoid}</span>
                    <span className="text-gray-900 font-bold">{value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terpene Profile */}
            {coa.terpenes && coa.terpenes.length > 0 && (
              <div>
                <h4 className="font-barlow font-bold text-gray-900 mb-3">Terpene Profile</h4>
                <div className="space-y-2">
                  {coa.terpenes.map((terpene) => (
                    <div key={terpene.name} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-gray-700">{terpene.name}</span>
                          <span className="text-sm text-gray-600">{terpene.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${Math.min(terpene.percentage * 10, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contaminant Testing */}
            <div>
              <h4 className="font-barlow font-bold text-gray-900 mb-3">Safety Testing</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(coa.contaminants).map(([test, result]) => (
                  <div
                    key={test}
                    className={`p-3 rounded-lg border-2 ${
                      result === "Pass"
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">
                        {result === "Pass" ? "✓" : "✗"}
                      </span>
                      <span className={`text-sm font-bold ${
                        result === "Pass" ? "text-emerald-800" : "text-red-800"
                      }`}>
                        {result}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 capitalize">
                      {test.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Batch Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-600 mb-1">Batch Number</div>
              <div className="font-mono font-bold text-gray-900">{coa.batchNumber}</div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
        {coa.pdfUrl && (
          <Button
            onClick={() => window.open(coa.pdfUrl, "_blank")}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </Button>
        )}
        <Button
          onClick={() => setShowQR(!showQR)}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          QR Code
        </Button>
      </div>

      {/* QR Code Modal */}
      {showQR && coa.qrCodeData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setShowQR(false)}>
          <div className="bg-white rounded-lg p-8 max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h4 className="font-barlow font-bold text-gray-900 text-center mb-4">
              Scan for COA Details
            </h4>
            <div className="bg-white p-4 rounded-lg border-4 border-emerald-500">
              <Image
                src={generateQRCode(coa.qrCodeData)}
                alt="COA QR Code"
                width={300}
                height={300}
                className="w-full h-auto"
                unoptimized
              />
            </div>
            <p className="text-xs text-gray-600 text-center mt-4">
              Scan this code to verify lab results
            </p>
            <Button
              onClick={() => setShowQR(false)}
              className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 rounded-lg"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
