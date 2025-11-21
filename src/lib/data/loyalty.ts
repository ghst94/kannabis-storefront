"use server"

import { HttpTypes } from "@medusajs/types"

export const getFullLoyaltyData = async (customer: HttpTypes.StoreCustomer | null) => {
  if (!customer) {
    return {
      points: 0,
      tier: "bronze",
      activities: [],
    }
  }

  // Stub implementation - replace with actual loyalty API calls
  return {
    points: 0,
    tier: "bronze",
    activities: [],
  }
}
