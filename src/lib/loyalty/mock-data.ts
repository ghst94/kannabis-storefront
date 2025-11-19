/**
 * Mock Loyalty System Utilities
 *
 * This file provides mock data and utilities for the loyalty points system.
 * When ready to integrate with real backend, replace these functions with API calls.
 */

export interface LoyaltyActivity {
  id: string
  type: 'earned' | 'redeemed' | 'bonus' | 'expired'
  points: number
  description: string
  date: string
  orderId?: string
}

export interface RewardTier {
  name: string
  minPoints: number
  benefits: string[]
  icon: string
  color: string
}

export interface AvailableReward {
  id: string
  name: string
  points: number
  icon: string
  description: string
  category: 'discount' | 'product' | 'exclusive'
}

// Reward Tiers Configuration
export const REWARD_TIERS: RewardTier[] = [
  {
    name: 'Seedling',
    minPoints: 0,
    benefits: ['1 point per $1 spent', 'Birthday bonus', 'Early access to sales'],
    icon: '🌱',
    color: 'from-zinc-600 to-zinc-700',
  },
  {
    name: 'Grower',
    minPoints: 500,
    benefits: ['1.25 points per $1 spent', 'Free shipping', 'Priority support'],
    icon: '🌿',
    color: 'from-green-600 to-green-700',
  },
  {
    name: 'Cultivator',
    minPoints: 1500,
    benefits: ['1.5 points per $1 spent', 'Exclusive products', 'VIP events'],
    icon: '⭐',
    color: 'from-lime-500 to-lime-600',
  },
  {
    name: 'Master',
    minPoints: 3000,
    benefits: ['2x points per $1 spent', 'Personal concierge', 'Premium gifts'],
    icon: '👑',
    color: 'from-yellow-500 to-yellow-600',
  },
]

// Available Rewards Catalog
export const AVAILABLE_REWARDS: AvailableReward[] = [
  {
    id: 'reward-1',
    name: '$5 Off Your Next Order',
    points: 100,
    icon: '💵',
    description: 'Get $5 off any order over $50',
    category: 'discount',
  },
  {
    id: 'reward-2',
    name: '$10 Off Your Next Order',
    points: 200,
    icon: '💰',
    description: 'Get $10 off any order over $100',
    category: 'discount',
  },
  {
    id: 'reward-3',
    name: 'Free Premium Pre-Roll',
    points: 300,
    icon: '🚬',
    description: 'Choose any premium pre-roll on us',
    category: 'product',
  },
  {
    id: 'reward-4',
    name: '$25 Off Your Next Order',
    points: 500,
    icon: '💎',
    description: 'Get $25 off any order',
    category: 'discount',
  },
  {
    id: 'reward-5',
    name: 'Free Edible Pack',
    points: 750,
    icon: '🍪',
    description: 'Choose any edible pack valued up to $30',
    category: 'product',
  },
  {
    id: 'reward-6',
    name: '$50 Off Your Next Order',
    points: 1000,
    icon: '🎁',
    description: 'Get $50 off any order',
    category: 'discount',
  },
  {
    id: 'reward-7',
    name: 'Exclusive Strain Access',
    points: 1500,
    icon: '🌟',
    description: 'Get early access to new and exclusive strains',
    category: 'exclusive',
  },
  {
    id: 'reward-8',
    name: 'VIP Tasting Event Ticket',
    points: 2000,
    icon: '🎫',
    description: 'Attend exclusive VIP cannabis tasting events',
    category: 'exclusive',
  },
]

/**
 * Generate mock activity history based on customer lifetime points
 */
export function generateMockActivity(lifetimePoints: number): LoyaltyActivity[] {
  const activities: LoyaltyActivity[] = []
  const now = new Date()

  // Generate activities that add up to lifetime points
  let pointsGenerated = 0
  let activityCount = 0

  while (pointsGenerated < lifetimePoints && activityCount < 20) {
    const daysAgo = Math.floor(Math.random() * 90) + 1
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)

    const types = ['earned', 'bonus', 'redeemed'] as const
    const type = types[Math.floor(Math.random() * types.length)]

    let points = 0
    let description = ''

    switch (type) {
      case 'earned':
        points = Math.floor(Math.random() * 100) + 25
        description = `Order #${10000 + activityCount} completed`
        break
      case 'bonus':
        points = Math.floor(Math.random() * 50) + 10
        description = 'Product review bonus'
        break
      case 'redeemed':
        points = -(Math.floor(Math.random() * 200) + 50)
        description = 'Redeemed for discount'
        break
    }

    if (pointsGenerated + points <= lifetimePoints || type === 'redeemed') {
      activities.push({
        id: `activity-${activityCount}`,
        type,
        points,
        description,
        date: date.toISOString(),
        orderId: type === 'earned' ? `${10000 + activityCount}` : undefined,
      })
      pointsGenerated += type === 'redeemed' ? 0 : points
    }

    activityCount++
  }

  // Sort by date (most recent first)
  return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Get customer's current tier based on points
 */
export function getCurrentTier(points: number): RewardTier {
  // Find the highest tier the customer qualifies for
  const qualifyingTiers = REWARD_TIERS.filter(tier => points >= tier.minPoints)
  return qualifyingTiers[qualifyingTiers.length - 1] || REWARD_TIERS[0]
}

/**
 * Get next tier and points needed
 */
export function getNextTier(points: number): { tier: RewardTier | null; pointsNeeded: number } {
  const currentTierIndex = REWARD_TIERS.findIndex(
    tier => points >= tier.minPoints &&
    (REWARD_TIERS[REWARD_TIERS.indexOf(tier) + 1]?.minPoints > points || !REWARD_TIERS[REWARD_TIERS.indexOf(tier) + 1])
  )

  const nextTier = REWARD_TIERS[currentTierIndex + 1]

  if (!nextTier) {
    return { tier: null, pointsNeeded: 0 }
  }

  return {
    tier: nextTier,
    pointsNeeded: nextTier.minPoints - points,
  }
}

/**
 * Calculate points from order amount
 */
export function calculatePointsFromAmount(amount: number, currentPoints: number = 0): number {
  const currentTier = getCurrentTier(currentPoints)

  // Base rate: 1 point per dollar
  let multiplier = 1

  // Apply tier multipliers
  if (currentTier.name === 'Grower') multiplier = 1.25
  if (currentTier.name === 'Cultivator') multiplier = 1.5
  if (currentTier.name === 'Master') multiplier = 2

  return Math.floor(amount * multiplier)
}

/**
 * Get mock points data from customer metadata
 * In production, this would fetch from the loyalty module API
 */
export function getMockLoyaltyData(customer: any) {
  // Try to get from metadata, otherwise generate mock data
  const currentPoints = Number(customer?.metadata?.rewards_points) || 250
  const lifetimePoints = Number(customer?.metadata?.lifetime_points) || 750

  const currentTier = getCurrentTier(currentPoints)
  const nextTierInfo = getNextTier(currentPoints)
  const activities = generateMockActivity(lifetimePoints)

  return {
    currentPoints,
    lifetimePoints,
    currentTier,
    nextTier: nextTierInfo.tier,
    pointsToNextTier: nextTierInfo.pointsNeeded,
    activities,
    availableRewards: AVAILABLE_REWARDS.filter(reward => reward.points <= currentPoints),
    lockedRewards: AVAILABLE_REWARDS.filter(reward => reward.points > currentPoints),
  }
}
