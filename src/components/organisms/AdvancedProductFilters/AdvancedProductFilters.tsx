"use client"

import { useState } from "react"
import { cannabisEffects, terpenes, strainTypes } from "@/lib/data/cannabisData"
import { Button } from "@/components/atoms"

interface AdvancedProductFiltersProps {
  onFiltersChange: (filters: ProductFilters) => void
}

export interface ProductFilters {
  effects: string[]
  terpenes: string[]
  strainTypes: string[]
  thcRange: { min: number; max: number }
  cbdRange: { min: number; max: number }
  priceRange: { min: number; max: number }
}

export function AdvancedProductFilters({ onFiltersChange }: AdvancedProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<ProductFilters>({
    effects: [],
    terpenes: [],
    strainTypes: [],
    thcRange: { min: 0, max: 40 },
    cbdRange: { min: 0, max: 30 },
    priceRange: { min: 0, max: 200 },
  })

  const toggleEffect = (effectId: string) => {
    const newEffects = filters.effects.includes(effectId)
      ? filters.effects.filter((e) => e !== effectId)
      : [...filters.effects, effectId]

    const newFilters = { ...filters, effects: newEffects }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const toggleTerpene = (terpeneId: string) => {
    const newTerpenes = filters.terpenes.includes(terpeneId)
      ? filters.terpenes.filter((t) => t !== terpeneId)
      : [...filters.terpenes, terpeneId]

    const newFilters = { ...filters, terpenes: newTerpenes }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const toggleStrainType = (strainTypeId: string) => {
    const newStrainTypes = filters.strainTypes.includes(strainTypeId)
      ? filters.strainTypes.filter((s) => s !== strainTypeId)
      : [...filters.strainTypes, strainTypeId]

    const newFilters = { ...filters, strainTypes: newStrainTypes }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const newFilters: ProductFilters = {
      effects: [],
      terpenes: [],
      strainTypes: [],
      thcRange: { min: 0, max: 40 },
      cbdRange: { min: 0, max: 30 },
      priceRange: { min: 0, max: 200 },
    }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const activeFiltersCount =
    filters.effects.length + filters.terpenes.length + filters.strainTypes.length

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span className="font-barlow font-bold text-gray-900">Advanced Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filter Content */}
      {isOpen && (
        <div className="border-t border-gray-200 p-4 space-y-6">
          {/* Strain Types */}
          <div>
            <h3 className="font-barlow font-bold text-gray-900 mb-3">Strain Type</h3>
            <div className="flex flex-wrap gap-2">
              {strainTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => toggleStrainType(type.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    filters.strainTypes.includes(type.id)
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type.icon} {type.name}
                </button>
              ))}
            </div>
          </div>

          {/* Effects */}
          <div>
            <h3 className="font-barlow font-bold text-gray-900 mb-3">Effects</h3>
            <div className="flex flex-wrap gap-2">
              {cannabisEffects
                .filter((effect) => effect.category === "positive" || effect.category === "medical")
                .map((effect) => (
                  <button
                    key={effect.id}
                    onClick={() => toggleEffect(effect.id)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold transition-all ${
                      filters.effects.includes(effect.id)
                        ? effect.category === "medical"
                          ? "bg-purple-600 text-white"
                          : "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {effect.icon} {effect.name}
                  </button>
                ))}
            </div>
          </div>

          {/* Terpenes */}
          <div>
            <h3 className="font-barlow font-bold text-gray-900 mb-3">Terpenes</h3>
            <div className="space-y-2">
              {terpenes.slice(0, 5).map((terpene) => (
                <label
                  key={terpene.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.terpenes.includes(terpene.id)}
                    onChange={() => toggleTerpene(terpene.id)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">{terpene.name}</div>
                    <div className="text-xs text-gray-500">{terpene.aroma.slice(0, 3).join(", ")}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* THC Range */}
          <div>
            <h3 className="font-barlow font-bold text-gray-900 mb-3">THC Percentage</h3>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="40"
                value={filters.thcRange.max}
                onChange={(e) => {
                  const newFilters = {
                    ...filters,
                    thcRange: { ...filters.thcRange, max: parseInt(e.target.value) },
                  }
                  setFilters(newFilters)
                  onFiltersChange(newFilters)
                }}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-semibold text-gray-900 min-w-[60px]">
                0% - {filters.thcRange.max}%
              </span>
            </div>
          </div>

          {/* CBD Range */}
          <div>
            <h3 className="font-barlow font-bold text-gray-900 mb-3">CBD Percentage</h3>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="30"
                value={filters.cbdRange.max}
                onChange={(e) => {
                  const newFilters = {
                    ...filters,
                    cbdRange: { ...filters.cbdRange, max: parseInt(e.target.value) },
                  }
                  setFilters(newFilters)
                  onFiltersChange(newFilters)
                }}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-semibold text-gray-900 min-w-[60px]">
                0% - {filters.cbdRange.max}%
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={clearFilters}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg"
            >
              Clear All
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
