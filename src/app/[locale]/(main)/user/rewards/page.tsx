import { retrieveCustomer } from "@/lib/data/customer"
import { redirect } from "next/navigation"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { REWARD_TIERS, AVAILABLE_REWARDS } from "@/lib/loyalty/mock-data"
import { getFullLoyaltyData } from "@/lib/data/loyalty"
import TierBadge from "@/components/loyalty/TierBadge"
import ActivityTimeline from "@/components/loyalty/ActivityTimeline"

export default async function RewardsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const customer = await retrieveCustomer()

  if (!customer) {
    redirect(`/${locale}/user`)
  }

  // Get enhanced loyalty data from real API
  const loyaltyData = await getFullLoyaltyData(customer)

  return (
    <div className="w-full bg-zinc-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <LocalizedClientLink href="/user/dashboard" className="text-cookies-yellow hover:text-cookies-light-yellow text-sm font-bold mb-2 inline-block">
            ← Back to Dashboard
          </LocalizedClientLink>
          <h1 className="text-3xl font-barlow font-black text-white uppercase tracking-tight">
            Rewards & Points
          </h1>
          <p className="text-zinc-400 mt-1">Earn points with every purchase and redeem for exclusive rewards</p>
        </div>

        {/* Points Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Current Points */}
          <div className="bg-gradient-to-br from-cookies-yellow to-cookies-yellow rounded-lg p-6 text-black">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-barlow font-bold text-lg">Current Points</h3>
              <div className="text-4xl">🌟</div>
            </div>
            <p className="text-5xl font-barlow font-black mb-2">{loyaltyData.currentPoints}</p>
            <p className="text-black/70 text-sm">Available to redeem</p>
          </div>

          {/* Lifetime Points */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-barlow font-bold text-lg text-white">Lifetime Earned</h3>
              <div className="text-4xl">💫</div>
            </div>
            <p className="text-5xl font-barlow font-black text-white mb-2">{loyaltyData.lifetimePoints}</p>
            <p className="text-zinc-400 text-sm">Total points earned</p>
          </div>

          {/* Tier Status */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-barlow font-bold text-lg text-white">Member Tier</h3>
              <div className="text-4xl">{loyaltyData.currentTier.icon}</div>
            </div>
            <p className="text-5xl font-barlow font-black text-cookies-yellow mb-2">{loyaltyData.currentTier.name}</p>
            <p className="text-zinc-400 text-sm">
              {loyaltyData.nextTier
                ? `${loyaltyData.pointsToNextTier} pts to ${loyaltyData.nextTier.name}`
                : 'Maximum tier achieved!'}
            </p>
          </div>
        </div>

        {/* How to Earn Section */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-barlow font-black text-white uppercase mb-4">How to Earn Points</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 bg-zinc-900 rounded-lg">
              <div className="text-2xl">🛍️</div>
              <div>
                <p className="text-white font-bold mb-1">Make Purchases</p>
                <p className="text-zinc-400 text-sm">
                  Earn {loyaltyData.currentTier.name === 'Master' ? '2x' :
                        loyaltyData.currentTier.name === 'Cultivator' ? '1.5x' :
                        loyaltyData.currentTier.name === 'Grower' ? '1.25x' : '1x'} points per $1 spent
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-zinc-900 rounded-lg">
              <div className="text-2xl">⭐</div>
              <div>
                <p className="text-white font-bold mb-1">Write Reviews</p>
                <p className="text-zinc-400 text-sm">Get 25 points per product review</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-zinc-900 rounded-lg">
              <div className="text-2xl">🎂</div>
              <div>
                <p className="text-white font-bold mb-1">Birthday Bonus</p>
                <p className="text-zinc-400 text-sm">100 bonus points on your birthday</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards Tiers Showcase */}
        <div className="mb-8">
          <h2 className="text-2xl font-barlow font-black text-white uppercase mb-6">Membership Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REWARD_TIERS.map((tier) => {
              const isCurrentTier = tier.name === loyaltyData.currentTier.name
              const isLocked = tier.minPoints > loyaltyData.currentPoints

              return (
                <div
                  key={tier.name}
                  className={`relative rounded-lg p-6 transition-all duration-300 ${
                    isCurrentTier
                      ? 'ring-2 ring-cookies-yellow scale-105'
                      : isLocked
                      ? 'opacity-60'
                      : ''
                  }`}
                >
                  {isCurrentTier && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-cookies-yellow text-black text-xs font-bold rounded-full">
                      CURRENT TIER
                    </div>
                  )}
                  <TierBadge tier={tier} size="sm" showBenefits />
                  {isLocked && (
                    <div className="absolute inset-0 bg-zinc-900/80 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🔒</div>
                        <p className="text-white font-bold text-sm">
                          {tier.minPoints - loyaltyData.currentPoints} more points
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Available Rewards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-barlow font-black text-white uppercase">Available Rewards</h2>
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <span className="text-cookies-yellow font-bold">{loyaltyData.availableRewards.length}</span>
              <span>rewards unlocked</span>
            </div>
          </div>

          {loyaltyData.availableRewards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {loyaltyData.availableRewards.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-zinc-800 border-2 border-cookies-yellow rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:shadow-cookies-yellow/20"
                >
                  <div className="text-5xl mb-4">{reward.icon}</div>
                  <h3 className="text-white font-barlow font-bold text-lg mb-2">{reward.name}</h3>
                  <p className="text-zinc-400 text-sm mb-4">{reward.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-cookies-yellow font-bold text-lg">{reward.points} pts</span>
                    <button className="px-4 py-2 bg-cookies-yellow text-black font-bold rounded-full hover:bg-cookies-light-yellow transition-colors text-sm">
                      Redeem
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-zinc-800 border border-zinc-700 rounded-lg mb-6">
              <div className="text-zinc-600 text-6xl mb-4">🎁</div>
              <p className="text-zinc-400 mb-2">No rewards available yet</p>
              <p className="text-zinc-500 text-sm">Keep shopping to earn more points!</p>
            </div>
          )}

          {/* Locked Rewards */}
          {loyaltyData.lockedRewards.length > 0 && (
            <>
              <h3 className="text-xl font-barlow font-black text-white uppercase mb-4">Locked Rewards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loyaltyData.lockedRewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="relative bg-zinc-800 border border-zinc-700 rounded-lg p-6 opacity-60"
                  >
                    <div className="text-5xl mb-4 grayscale">{reward.icon}</div>
                    <h3 className="text-white font-barlow font-bold text-lg mb-2">{reward.name}</h3>
                    <p className="text-zinc-400 text-sm mb-4">{reward.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 font-bold text-lg">{reward.points} pts</span>
                      <span className="px-4 py-2 bg-zinc-700 text-zinc-400 font-bold rounded-full text-sm">
                        Locked
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 text-2xl">🔒</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Activity History */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h2 className="text-xl font-barlow font-black text-white uppercase mb-6">Activity History</h2>
          <ActivityTimeline activities={loyaltyData.activities} limit={20} />
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-cookies-yellow/10 to-cookies-yellow/5 border border-cookies-yellow/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div className="flex-1">
              <h3 className="text-white font-barlow font-bold text-lg mb-2">Points Never Expire</h3>
              <p className="text-zinc-300 text-sm">
                Your loyalty points never expire as long as your account remains active.
                Keep earning, keep redeeming, and enjoy exclusive benefits as you climb through our membership tiers!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
