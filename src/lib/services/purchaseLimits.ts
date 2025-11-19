// Purchase Limit Tracking Service
// Ensures compliance with state cannabis purchase limits

export interface PurchaseLimitConfig {
  // Daily limits (in grams for flower, mg for edibles, etc.)
  recreational: {
    flower: number // grams
    concentrates: number // grams
    edibles: number // mg THC
    tinctures: number // mg THC
    topicals: number // mg THC
  }
  medical: {
    flower: number // grams
    concentrates: number // grams
    edibles: number // mg THC
    tinctures: number // mg THC
    topicals: number // mg THC
  }
  monthlyLimitMultiplier: number // Monthly limit = daily * multiplier
}

export interface Purchase {
  userId: string
  timestamp: string
  items: PurchaseItem[]
  userType: "recreational" | "medical"
  totalAmount: number
}

export interface PurchaseItem {
  productId: string
  productType: "flower" | "concentrates" | "edibles" | "tinctures" | "topicals"
  quantity: number
  unit: "grams" | "mg" | "units"
  thcContent?: number // Total THC in mg
}

export interface LimitCheck {
  allowed: boolean
  remaining: {
    flower: number
    concentrates: number
    edibles: number
    tinctures: number
    topicals: number
  }
  message: string
  dailyLimitReached: boolean
  monthlyLimitReached: boolean
}

// California limits (example - adjust per state)
const DEFAULT_LIMITS: PurchaseLimitConfig = {
  recreational: {
    flower: 28.5, // 1 ounce
    concentrates: 8, // grams
    edibles: 1000, // mg THC
    tinctures: 2000, // mg THC
    topicals: 2000, // mg THC
  },
  medical: {
    flower: 226.8, // 8 ounces
    concentrates: 56, // grams
    edibles: 5000, // mg THC
    tinctures: 10000, // mg THC
    topicals: 10000, // mg THC
  },
  monthlyLimitMultiplier: 30,
}

/**
 * Get purchase history for a user
 * In production, fetch from backend database
 */
export async function getPurchaseHistory(
  userId: string,
  timeRange: "daily" | "monthly"
): Promise<Purchase[]> {
  try {
    // In production, fetch from API
    const stored = localStorage.getItem(`purchase_history_${userId}`)
    if (!stored) return []

    const allPurchases: Purchase[] = JSON.parse(stored)

    // Filter based on time range
    const now = new Date()
    const startTime =
      timeRange === "daily"
        ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
        : new Date(now.getFullYear(), now.getMonth(), 1)

    return allPurchases.filter(
      (purchase) => new Date(purchase.timestamp) >= startTime
    )
  } catch (error) {
    console.error("Error fetching purchase history:", error)
    return []
  }
}

/**
 * Calculate totals from purchase history
 */
export function calculatePurchaseTotals(purchases: Purchase[]): {
  flower: number
  concentrates: number
  edibles: number
  tinctures: number
  topicals: number
} {
  const totals = {
    flower: 0,
    concentrates: 0,
    edibles: 0,
    tinctures: 0,
    topicals: 0,
  }

  purchases.forEach((purchase) => {
    purchase.items.forEach((item) => {
      switch (item.productType) {
        case "flower":
          totals.flower += item.quantity
          break
        case "concentrates":
          totals.concentrates += item.quantity
          break
        case "edibles":
          totals.edibles += item.thcContent || 0
          break
        case "tinctures":
          totals.tinctures += item.thcContent || 0
          break
        case "topicals":
          totals.topicals += item.thcContent || 0
          break
      }
    })
  })

  return totals
}

/**
 * Check if purchase is within limits
 */
export async function checkPurchaseLimits(
  userId: string,
  items: PurchaseItem[],
  userType: "recreational" | "medical",
  config: PurchaseLimitConfig = DEFAULT_LIMITS
): Promise<LimitCheck> {
  // Get purchase history
  const dailyHistory = await getPurchaseHistory(userId, "daily")
  const monthlyHistory = await getPurchaseHistory(userId, "monthly")

  // Calculate current totals
  const dailyTotals = calculatePurchaseTotals(dailyHistory)
  const monthlyTotals = calculatePurchaseTotals(monthlyHistory)

  // Calculate new purchase totals
  const newPurchaseTotals = calculatePurchaseTotals([
    {
      userId,
      timestamp: new Date().toISOString(),
      items,
      userType,
      totalAmount: 0,
    },
  ])

  // Get limits for user type
  const limits = config[userType]
  const monthlyLimits = {
    flower: limits.flower * config.monthlyLimitMultiplier,
    concentrates: limits.concentrates * config.monthlyLimitMultiplier,
    edibles: limits.edibles * config.monthlyLimitMultiplier,
    tinctures: limits.tinctures * config.monthlyLimitMultiplier,
    topicals: limits.topicals * config.monthlyLimitMultiplier,
  }

  // Check daily limits
  const dailyCheck = {
    flower: dailyTotals.flower + newPurchaseTotals.flower <= limits.flower,
    concentrates:
      dailyTotals.concentrates + newPurchaseTotals.concentrates <= limits.concentrates,
    edibles: dailyTotals.edibles + newPurchaseTotals.edibles <= limits.edibles,
    tinctures: dailyTotals.tinctures + newPurchaseTotals.tinctures <= limits.tinctures,
    topicals: dailyTotals.topicals + newPurchaseTotals.topicals <= limits.topicals,
  }

  // Check monthly limits
  const monthlyCheck = {
    flower: monthlyTotals.flower + newPurchaseTotals.flower <= monthlyLimits.flower,
    concentrates:
      monthlyTotals.concentrates + newPurchaseTotals.concentrates <=
      monthlyLimits.concentrates,
    edibles: monthlyTotals.edibles + newPurchaseTotals.edibles <= monthlyLimits.edibles,
    tinctures:
      monthlyTotals.tinctures + newPurchaseTotals.tinctures <= monthlyLimits.tinctures,
    topicals: monthlyTotals.topicals + newPurchaseTotals.topicals <= monthlyLimits.topicals,
  }

  const dailyLimitReached = Object.values(dailyCheck).some((v) => !v)
  const monthlyLimitReached = Object.values(monthlyCheck).some((v) => !v)

  // Calculate remaining amounts
  const remaining = {
    flower: Math.max(0, limits.flower - dailyTotals.flower),
    concentrates: Math.max(0, limits.concentrates - dailyTotals.concentrates),
    edibles: Math.max(0, limits.edibles - dailyTotals.edibles),
    tinctures: Math.max(0, limits.tinctures - dailyTotals.tinctures),
    topicals: Math.max(0, limits.topicals - dailyTotals.topicals),
  }

  let message = ""
  if (dailyLimitReached) {
    message = "This purchase would exceed your daily purchase limit. "
    if (newPurchaseTotals.flower > 0 && !dailyCheck.flower) {
      message += `Flower limit: ${limits.flower}g/day. `
    }
    if (newPurchaseTotals.concentrates > 0 && !dailyCheck.concentrates) {
      message += `Concentrates limit: ${limits.concentrates}g/day. `
    }
    if (newPurchaseTotals.edibles > 0 && !dailyCheck.edibles) {
      message += `Edibles limit: ${limits.edibles}mg THC/day. `
    }
  } else if (monthlyLimitReached) {
    message = "This purchase would exceed your monthly purchase limit. Please try again later."
  } else {
    message = "Purchase approved. Within legal limits."
  }

  return {
    allowed: !dailyLimitReached && !monthlyLimitReached,
    remaining,
    message,
    dailyLimitReached,
    monthlyLimitReached,
  }
}

/**
 * Record a purchase
 */
export async function recordPurchase(purchase: Purchase): Promise<void> {
  try {
    // In production, save to backend
    const stored = localStorage.getItem(`purchase_history_${purchase.userId}`)
    const history: Purchase[] = stored ? JSON.parse(stored) : []

    history.push(purchase)

    // Keep only last 90 days of history
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    const filteredHistory = history.filter(
      (p) => new Date(p.timestamp) >= ninetyDaysAgo
    )

    localStorage.setItem(
      `purchase_history_${purchase.userId}`,
      JSON.stringify(filteredHistory)
    )
  } catch (error) {
    console.error("Error recording purchase:", error)
  }
}

/**
 * Get user's current limits summary
 */
export async function getLimitsSummary(
  userId: string,
  userType: "recreational" | "medical"
): Promise<{
  daily: { used: any; limit: any; remaining: any }
  monthly: { used: any; limit: any; remaining: any }
}> {
  const config = DEFAULT_LIMITS
  const limits = config[userType]
  const monthlyLimits = {
    flower: limits.flower * config.monthlyLimitMultiplier,
    concentrates: limits.concentrates * config.monthlyLimitMultiplier,
    edibles: limits.edibles * config.monthlyLimitMultiplier,
    tinctures: limits.tinctures * config.monthlyLimitMultiplier,
    topicals: limits.topicals * config.monthlyLimitMultiplier,
  }

  const dailyHistory = await getPurchaseHistory(userId, "daily")
  const monthlyHistory = await getPurchaseHistory(userId, "monthly")

  const dailyTotals = calculatePurchaseTotals(dailyHistory)
  const monthlyTotals = calculatePurchaseTotals(monthlyHistory)

  return {
    daily: {
      used: dailyTotals,
      limit: limits,
      remaining: {
        flower: Math.max(0, limits.flower - dailyTotals.flower),
        concentrates: Math.max(0, limits.concentrates - dailyTotals.concentrates),
        edibles: Math.max(0, limits.edibles - dailyTotals.edibles),
        tinctures: Math.max(0, limits.tinctures - dailyTotals.tinctures),
        topicals: Math.max(0, limits.topicals - dailyTotals.topicals),
      },
    },
    monthly: {
      used: monthlyTotals,
      limit: monthlyLimits,
      remaining: {
        flower: Math.max(0, monthlyLimits.flower - monthlyTotals.flower),
        concentrates: Math.max(0, monthlyLimits.concentrates - monthlyTotals.concentrates),
        edibles: Math.max(0, monthlyLimits.edibles - monthlyTotals.edibles),
        tinctures: Math.max(0, monthlyLimits.tinctures - monthlyTotals.tinctures),
        topicals: Math.max(0, monthlyLimits.topicals - monthlyTotals.topicals),
      },
    },
  }
}
