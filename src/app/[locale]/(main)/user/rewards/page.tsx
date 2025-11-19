import { retrieveCustomer } from "@/lib/data/customer"
import { redirect } from "next/navigation"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

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

  // Mock rewards data - integrate with your actual rewards system
  const rewardsPoints = customer?.metadata?.rewards_points || 0
  const lifetimePoints = customer?.metadata?.lifetime_points || 0
  const rewardsTier = rewardsPoints >= 1000 ? 'Gold' : rewardsPoints >= 500 ? 'Silver' : 'Bronze'

  const availableRewards = [
    {
      id: 1,
      name: "$5 Off Your Next Order",
      points: 100,
      icon: "💵",
      description: "Get $5 off any order over $50",
      available: rewardsPoints >= 100,
    },
    {
      id: 2,
      name: "Free Pre-Roll",
      points: 250,
      icon: "🚬",
      description: "Choose any premium pre-roll on us",
      available: rewardsPoints >= 250,
    },
    {
      id: 3,
      name: "$10 Off Your Next Order",
      points: 500,
      icon: "💰",
      description: "Get $10 off any order over $100",
      available: rewardsPoints >= 500,
    },
    {
      id: 4,
      name: "Free Edible Pack",
      points: 750,
      icon: "🍪",
      description: "Choose any edible pack on us",
      available: rewardsPoints >= 750,
    },
    {
      id: 5,
      name: "$25 Off Your Next Order",
      points: 1000,
      icon: "💎",
      description: "Get $25 off any order",
      available: rewardsPoints >= 1000,
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "earned",
      points: 50,
      description: "Order #12345 completed",
      date: new Date().toISOString(),
    },
    {
      id: 2,
      type: "earned",
      points: 25,
      description: "Product review bonus",
      date: new Date(Date.now() - 86400000).toISOString(),
    },
  ]

  return (
    <div className="w-full bg-zinc-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <LocalizedClientLink href="/user/dashboard" className="text-lime-500 hover:text-lime-400 text-sm font-bold mb-2 inline-block">
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
          <div className="bg-gradient-to-br from-lime-500 to-lime-600 rounded-lg p-6 text-black">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-barlow font-bold text-lg">Current Points</h3>
              <div className="text-4xl">🌟</div>
            </div>
            <p className="text-5xl font-barlow font-black mb-2">{rewardsPoints}</p>
            <p className="text-black/70 text-sm">Available to redeem</p>
          </div>

          {/* Lifetime Points */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-barlow font-bold text-lg text-white">Lifetime Earned</h3>
              <div className="text-4xl">💫</div>
            </div>
            <p className="text-5xl font-barlow font-black text-white mb-2">{lifetimePoints}</p>
            <p className="text-zinc-400 text-sm">Total points earned</p>
          </div>

          {/* Tier Status */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-barlow font-bold text-lg text-white">Member Tier</h3>
              <div className="text-4xl">
                {rewardsTier === 'Gold' ? '👑' : rewardsTier === 'Silver' ? '⭐' : '🌱'}
              </div>
            </div>
            <p className="text-5xl font-barlow font-black text-lime-500 mb-2">{rewardsTier}</p>
            <p className="text-zinc-400 text-sm">
              {rewardsTier === 'Gold' ? 'Elite status' : `${1000 - rewardsPoints} pts to Gold`}
            </p>
          </div>
        </div>

        {/* How to Earn Section */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-barlow font-black text-white uppercase mb-4">How to Earn Points</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🛍️</div>
              <div>
                <p className="text-white font-bold mb-1">Make Purchases</p>
                <p className="text-zinc-400 text-sm">Earn 1 point per $1 spent</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">⭐</div>
              <div>
                <p className="text-white font-bold mb-1">Write Reviews</p>
                <p className="text-zinc-400 text-sm">Get 25 points per product review</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎂</div>
              <div>
                <p className="text-white font-bold mb-1">Birthday Bonus</p>
                <p className="text-zinc-400 text-sm">100 bonus points on your birthday</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Rewards */}
        <div className="mb-8">
          <h2 className="text-2xl font-barlow font-black text-white uppercase mb-6">Available Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRewards.map((reward) => (
              <div
                key={reward.id}
                className={`bg-zinc-800 border rounded-lg p-6 transition-all duration-300 ${
                  reward.available
                    ? 'border-lime-500 hover:shadow-lg hover:shadow-lime-500/20'
                    : 'border-zinc-700 opacity-60'
                }`}
              >
                <div className="text-5xl mb-4">{reward.icon}</div>
                <h3 className="text-white font-barlow font-bold text-lg mb-2">{reward.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{reward.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lime-500 font-bold text-lg">{reward.points} pts</span>
                  {reward.available ? (
                    <button className="px-4 py-2 bg-lime-500 text-black font-bold rounded-full hover:bg-lime-400 transition-colors text-sm">
                      Redeem
                    </button>
                  ) : (
                    <span className="px-4 py-2 bg-zinc-700 text-zinc-400 font-bold rounded-full text-sm">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h2 className="text-xl font-barlow font-black text-white uppercase mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'earned' ? 'bg-lime-500/20' : 'bg-red-500/20'
                  }`}>
                    {activity.type === 'earned' ? (
                      <svg className="w-5 h-5 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{activity.description}</p>
                    <p className="text-zinc-400 text-xs">
                      {new Date(activity.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <span className={`font-bold ${
                  activity.type === 'earned' ? 'text-lime-500' : 'text-red-500'
                }`}>
                  {activity.type === 'earned' ? '+' : '-'}{activity.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
