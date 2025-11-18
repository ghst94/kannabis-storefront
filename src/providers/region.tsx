"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@/lib/config"

type RegionContextType = {
  region?: HttpTypes.StoreRegion
  regions: HttpTypes.StoreRegion[]
  setRegion: React.Dispatch<React.SetStateAction<HttpTypes.StoreRegion | undefined>>
}

const RegionContext = createContext<RegionContextType | null>(null)

export const RegionProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [regions, setRegions] = useState<HttpTypes.StoreRegion[]>([])
  const [region, setRegion] = useState<HttpTypes.StoreRegion>()

  useEffect(() => {
    if (regions.length) {
      return
    }
    sdk.store.region
      .list()
      .then(({ regions: dataRegions }) => {
        setRegions(dataRegions)
      })
      .catch((error) => {
        console.error("Failed to fetch regions:", error)
      })
  }, [regions.length])

  useEffect(() => {
    if (region) {
      localStorage.setItem("region_id", region.id)
      return
    }

    const regionId = localStorage.getItem("region_id")
    if (!regionId) {
      if (regions.length) {
        setRegion(regions[0])
      }
    } else {
      sdk.store.region
        .retrieve(regionId)
        .then(({ region: dataRegion }) => {
          setRegion(dataRegion)
        })
        .catch((error) => {
          console.error("Failed to retrieve region:", error)
          if (regions.length) {
            setRegion(regions[0])
          }
        })
    }
  }, [region, regions])

  return (
    <RegionContext.Provider
      value={{
        region,
        regions,
        setRegion,
      }}
    >
      {children}
    </RegionContext.Provider>
  )
}

export const useRegion = () => {
  const context = useContext(RegionContext)
  if (!context) {
    throw new Error("useRegion must be used within a RegionProvider")
  }
  return context
}
