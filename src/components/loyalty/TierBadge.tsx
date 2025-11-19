"use client"

import { RewardTier } from "@/lib/loyalty/mock-data"

interface TierBadgeProps {
  tier: RewardTier
  size?: 'sm' | 'md' | 'lg'
  showBenefits?: boolean
}

export default function TierBadge({ tier, size = 'md', showBenefits = false }: TierBadgeProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  }

  const containerClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  return (
    <div className={`bg-gradient-to-br ${tier.color} rounded-lg ${containerClasses[size]} text-white`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={sizeClasses[size]}>{tier.icon}</div>
        <div>
          <h3 className="font-barlow font-black text-xl uppercase">{tier.name} Tier</h3>
          <p className="text-sm opacity-90">{tier.minPoints}+ points</p>
        </div>
      </div>

      {showBenefits && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs font-bold mb-2 uppercase opacity-90">Benefits:</p>
          <ul className="space-y-1">
            {tier.benefits.map((benefit, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-lime-300 mt-0.5">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
