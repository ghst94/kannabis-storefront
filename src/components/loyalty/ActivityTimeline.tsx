"use client"

import { LoyaltyActivity } from "@/lib/loyalty/mock-data"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

interface ActivityTimelineProps {
  activities: LoyaltyActivity[]
  limit?: number
  showViewAll?: boolean
}

export default function ActivityTimeline({
  activities,
  limit = 10,
  showViewAll = false
}: ActivityTimelineProps) {
  const displayActivities = limit ? activities.slice(0, limit) : activities

  const getActivityIcon = (type: LoyaltyActivity['type']) => {
    switch (type) {
      case 'earned':
        return (
          <div className="p-2 rounded-full bg-lime-500/20">
            <svg className="w-4 h-4 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        )
      case 'redeemed':
        return (
          <div className="p-2 rounded-full bg-red-500/20">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </div>
        )
      case 'bonus':
        return (
          <div className="p-2 rounded-full bg-yellow-500/20">
            <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
        )
      case 'expired':
        return (
          <div className="p-2 rounded-full bg-zinc-600/20">
            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
    }
  }

  const getPointsColor = (type: LoyaltyActivity['type']) => {
    switch (type) {
      case 'earned':
      case 'bonus':
        return 'text-lime-500'
      case 'redeemed':
      case 'expired':
        return 'text-red-500'
    }
  }

  return (
    <div className="space-y-3">
      {displayActivities.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-zinc-600 text-4xl mb-2">📊</div>
          <p className="text-zinc-400">No activity yet</p>
          <p className="text-zinc-500 text-sm mt-1">Start shopping to earn points!</p>
        </div>
      ) : (
        <>
          {displayActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              {getActivityIcon(activity.type)}

              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-zinc-400 text-xs">
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {activity.orderId && (
                    <LocalizedClientLink
                      href={`/user/orders/${activity.orderId}`}
                      className="text-lime-500 text-xs hover:text-lime-400"
                    >
                      View Order →
                    </LocalizedClientLink>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className={`font-bold text-lg ${getPointsColor(activity.type)}`}>
                  {activity.points > 0 ? '+' : ''}{activity.points}
                </span>
                <p className="text-zinc-500 text-xs">pts</p>
              </div>
            </div>
          ))}

          {showViewAll && activities.length > limit && (
            <LocalizedClientLink
              href="/user/rewards"
              className="block text-center py-3 text-lime-500 hover:text-lime-400 font-bold text-sm"
            >
              View All Activity ({activities.length} total) →
            </LocalizedClientLink>
          )}
        </>
      )}
    </div>
  )
}
