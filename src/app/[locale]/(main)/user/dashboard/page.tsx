import { retrieveCustomer } from "@/lib/data/customer"
import { retrieveCart } from "@/lib/data/cart"
import { listCustomerOrders } from "@/lib/data/orders"
import { redirect } from "next/navigation"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { UserButton } from "@clerk/nextjs"

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const customer = await retrieveCustomer()

  if (!customer) {
    redirect(`/${locale}/user`)
  }

  const orders = await listCustomerOrders(0, 5)
  const activeOrders = orders?.filter(
    (order: any) => order.fulfillment_status !== "fulfilled"
  ) || []
  const recentOrders = orders?.slice(0, 3) || []

  // Mock rewards data - integrate with your actual rewards system
  const rewardsPoints = customer?.metadata?.rewards_points || 0
  const nextRewardAt = 500
  const rewardsProgress = (rewardsPoints / nextRewardAt) * 100

  return (
    <div className="w-full bg-zinc-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-barlow font-black text-white uppercase tracking-tight">
              Welcome back, {customer.first_name}!
            </h1>
            <p className="text-zinc-400 mt-1">Your cannabis shopping dashboard</p>
          </div>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-12 h-12",
                userButtonPopoverCard: "bg-zinc-900 border border-zinc-800",
              }
            }}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Deliveries */}
          <LocalizedClientLink href="/user/orders">
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 hover:border-lime-500 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-lime-500/10 rounded-lg">
                  <svg className="w-6 h-6 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <span className="text-3xl font-barlow font-black text-white group-hover:text-lime-500 transition-colors">
                  {activeOrders.length}
                </span>
              </div>
              <h3 className="text-white font-barlow font-bold text-lg mb-1">Active Orders</h3>
              <p className="text-zinc-400 text-sm">Track your deliveries</p>
            </div>
          </LocalizedClientLink>

          {/* Rewards Points */}
          <LocalizedClientLink href="/user/rewards">
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 hover:border-lime-500 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-lime-500/10 rounded-lg">
                  <svg className="w-6 h-6 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-3xl font-barlow font-black text-white group-hover:text-lime-500 transition-colors">
                  {rewardsPoints}
                </span>
              </div>
              <h3 className="text-white font-barlow font-bold text-lg mb-1">Rewards Points</h3>
              <p className="text-zinc-400 text-sm">{nextRewardAt - rewardsPoints} to next reward</p>
              {/* Progress bar */}
              <div className="mt-3 w-full bg-zinc-700 rounded-full h-2">
                <div
                  className="bg-lime-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${rewardsProgress}%` }}
                />
              </div>
            </div>
          </LocalizedClientLink>

          {/* Total Orders */}
          <LocalizedClientLink href="/user/orders">
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 hover:border-lime-500 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-lime-500/10 rounded-lg">
                  <svg className="w-6 h-6 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-3xl font-barlow font-black text-white group-hover:text-lime-500 transition-colors">
                  {orders?.length || 0}
                </span>
              </div>
              <h3 className="text-white font-barlow font-bold text-lg mb-1">Total Orders</h3>
              <p className="text-zinc-400 text-sm">View order history</p>
            </div>
          </LocalizedClientLink>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-barlow font-black text-white uppercase">Recent Orders</h2>
              <LocalizedClientLink href="/user/orders" className="text-lime-500 hover:text-lime-400 text-sm font-bold">
                View All →
              </LocalizedClientLink>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order: any) => (
                  <LocalizedClientLink
                    key={order.id}
                    href={`/user/orders/${order.id}`}
                    className="block"
                  >
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 hover:border-lime-500 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-bold text-sm">Order #{order.display_id}</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          order.fulfillment_status === 'fulfilled'
                            ? 'bg-lime-500/20 text-lime-500'
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {order.fulfillment_status === 'fulfilled' ? 'Delivered' : 'In Transit'}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-sm mb-2">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-white font-bold">
                        {order.total ? `$${(order.total / 100).toFixed(2)}` : 'N/A'}
                      </p>
                    </div>
                  </LocalizedClientLink>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-zinc-600 text-6xl mb-4">🌿</div>
                <p className="text-zinc-400">No orders yet</p>
                <LocalizedClientLink href="/categories" className="inline-block mt-4 px-6 py-2 bg-lime-500 text-black font-bold rounded-full hover:bg-lime-400 transition-colors">
                  Start Shopping
                </LocalizedClientLink>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <h2 className="text-xl font-barlow font-black text-white uppercase mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <LocalizedClientLink href="/categories">
                <button className="w-full flex items-center gap-3 bg-lime-500 hover:bg-lime-400 text-black font-barlow font-bold py-3 px-4 rounded-lg transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Shop Products
                </button>
              </LocalizedClientLink>

              <LocalizedClientLink href="/user/orders">
                <button className="w-full flex items-center gap-3 bg-zinc-900 hover:bg-zinc-700 text-white font-barlow font-bold py-3 px-4 rounded-lg border border-zinc-700 hover:border-lime-500 transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Track Orders
                </button>
              </LocalizedClientLink>

              <LocalizedClientLink href="/user/rewards">
                <button className="w-full flex items-center gap-3 bg-zinc-900 hover:bg-zinc-700 text-white font-barlow font-bold py-3 px-4 rounded-lg border border-zinc-700 hover:border-lime-500 transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  Redeem Rewards
                </button>
              </LocalizedClientLink>

              <LocalizedClientLink href="/user/settings">
                <button className="w-full flex items-center gap-3 bg-zinc-900 hover:bg-zinc-700 text-white font-barlow font-bold py-3 px-4 rounded-lg border border-zinc-700 hover:border-lime-500 transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Account Settings
                </button>
              </LocalizedClientLink>
            </div>
          </div>
        </div>

        {/* Cannabis Education Banner */}
        <div className="mt-8 bg-gradient-to-r from-lime-500/10 to-lime-500/5 border border-lime-500/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🌿</div>
            <div className="flex-1">
              <h3 className="text-white font-barlow font-bold text-lg mb-2">Cannabis Consumption Tip</h3>
              <p className="text-zinc-300 text-sm">
                Start low and go slow. Wait at least 2 hours before consuming more edibles to gauge the full effect.
                For flower, remember that THC content isn't everything – terpene profiles contribute significantly to the experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
