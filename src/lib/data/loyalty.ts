/**
 * Loyalty Points API Functions
 *
 * These functions interact with the Medusa backend loyalty module
 */

import { sdk } from "../config"
import { getAuthHeaders } from "./cookies"
import { LoyaltyActivity, getMockLoyaltyData } from "../loyalty/mock-data"

export interface LoyaltyData {
  points: number
  lifetime_points: number
  tier: string
}

/**
 * Fetch customer's loyalty points from the backend
 */
export const getLoyaltyPoints = async (): Promise<LoyaltyData | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<LoyaltyData>(`/store/customers/me/loyalty-points`, {
      method: "GET",
      headers,
    })
    .then((data) => data)
    .catch(() => null)
}

/**
 * Get full loyalty data for customer including activity history
 * This combines real API data with generated activity history
 */
export const getFullLoyaltyData = async (customer: any) => {
  try {
    // Fetch real points data from backend
    const loyaltyData = await getLoyaltyPoints()

    if (!loyaltyData) {
      // Fallback to mock data if API fails
      return getMockLoyaltyData(customer)
    }

    // Use real data but generate mock activity history
    // In future, you can add an API endpoint to fetch real activity
    const mockData = getMockLoyaltyData({
      ...customer,
      metadata: {
        ...customer.metadata,
        rewards_points: loyaltyData.points,
        lifetime_points: loyaltyData.lifetime_points,
      }
    })

    return {
      ...mockData,
      currentPoints: loyaltyData.points,
      lifetimePoints: loyaltyData.lifetime_points,
      currentTier: mockData.currentTier, // Tier is calculated from points
    }
  } catch (error) {
    console.error('Error fetching loyalty data:', error)
    // Fallback to mock data
    return getMockLoyaltyData(customer)
  }
}
