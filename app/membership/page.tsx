'use client'

import { useState, ChangeEvent, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { getCustomerMemberships, getTierStatistics } from '@/lib/mock-data/customer-membership'
import { getActiveCampaigns } from '@/lib/mock-data/campaigns'
import { MembershipTier, TIER_BENEFITS } from '@/lib/types/membership'
import {
  Search,
  Users,
  Award,
  TrendingUp,
  Star,
  Gift,
  ChevronRight,
  Filter
} from 'lucide-react'

export default function MembershipPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTier, setFilterTier] = useState<string>('all')

  const memberships = useMemo(() => {
    return getCustomerMemberships()
  }, [])

  const activeCampaigns = useMemo(() => {
    return getActiveCampaigns()
  }, [])

  const tierStats = useMemo(() => {
    return getTierStatistics()
  }, [])

  const filteredMemberships = useMemo(() => {
    let filtered = memberships

    if (searchQuery) {
      const query = searchQuery.toLowerCase()

      filtered = filtered.filter(m =>
        m.customer_name.toLowerCase().includes(query) ||
        m.customer_no.toLowerCase().includes(query)
      )
    }

    if (filterTier !== 'all') {
      filtered = filtered.filter(m => m.current_tier === filterTier)
    }

    return filtered.sort((a, b) => b.points_balance - a.points_balance)
  }, [memberships, searchQuery, filterTier])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleTierFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilterTier(e.target.value)
  }

  const handleViewDetails = (customerNo: string) => {
    router.push(`/membership/${customerNo}`)
  }

  const getTierColor = (tier: MembershipTier): string => {
    if (tier === MembershipTier.Platinum) {
      return 'bg-purple-100 text-purple-800 border-purple-300'
    }

    if (tier === MembershipTier.Gold) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    }

    if (tier === MembershipTier.Silver) {
      return 'bg-gray-100 text-gray-800 border-gray-300'
    }

    return 'bg-orange-100 text-orange-800 border-orange-300'
  }

  const getTierIcon = (tier: MembershipTier) => {
    if (tier === MembershipTier.Platinum || tier === MembershipTier.Gold) {
      return <Star className="w-4 h-4" fill="currentColor" />
    }

    return <Award className="w-4 h-4" />
  }

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatPoints = (points: number): string => {
    return new Intl.NumberFormat('en-US').format(points)
  }

  return (
    <MainLayout>
      <div>
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Customer Membership & Loyalty</h1>
            <p className="text-sm text-gray-500 mt-1">Manage customer memberships, campaigns, and loyalty programs</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase font-medium">Platinum Members</p>
                  <p className="text-2xl font-bold text-purple-700 mt-1">
                    {tierStats[MembershipTier.Platinum]}
                  </p>
                </div>
                <Star className="w-8 h-8 text-purple-600 opacity-50" fill="currentColor" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-yellow-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase font-medium">Gold Members</p>
                  <p className="text-2xl font-bold text-yellow-700 mt-1">
                    {tierStats[MembershipTier.Gold]}
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-600 opacity-50" fill="currentColor" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase font-medium">Silver Members</p>
                  <p className="text-2xl font-bold text-gray-700 mt-1">
                    {tierStats[MembershipTier.Silver]}
                  </p>
                </div>
                <Award className="w-8 h-8 text-gray-600 opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-orange-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase font-medium">Bronze Members</p>
                  <p className="text-2xl font-bold text-orange-700 mt-1">
                    {tierStats[MembershipTier.Bronze]}
                  </p>
                </div>
                <Users className="w-8 h-8 text-orange-600 opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Campaigns Banner */}
        <div className="bg-primary-50 border-b border-primary-200 px-6 py-3">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary-800">
              {activeCampaigns.length} Active Campaigns Running
            </span>
            <span className="text-sm text-primary-600">
              {activeCampaigns.map(c => c.name).join(' • ')}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-6">
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by customer name or number..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterTier}
                  onChange={handleTierFilterChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none bg-white text-gray-900"
                >
                  <option value="all">All Tiers</option>
                  <option value={MembershipTier.Platinum}>Platinum</option>
                  <option value={MembershipTier.Gold}>Gold</option>
                  <option value={MembershipTier.Silver}>Silver</option>
                  <option value={MembershipTier.Bronze}>Bronze</option>
                </select>
              </div>
            </div>
          </div>

          {/* Membership List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Customer Memberships ({filteredMemberships.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredMemberships.map((membership) => (
                <div
                  key={membership.customer_no}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => {
                    handleViewDetails(membership.customer_no)
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {membership.customer_name}
                        </h3>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-1 ${getTierColor(membership.current_tier)}`}>
                          {getTierIcon(membership.current_tier)}
                          {membership.current_tier}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mb-3">
                        Customer No: {membership.customer_no} • Member since {formatDate(membership.member_since)}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Points Balance</p>
                          <p className="text-lg font-semibold text-primary">
                            {formatPoints(membership.points_balance)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Lifetime Points</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatPoints(membership.points_lifetime)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Active Campaigns</p>
                          <p className="text-lg font-semibold text-green-600">
                            {membership.active_campaigns.length}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Benefits Redeemed</p>
                          <p className="text-lg font-semibold text-blue-600">
                            {membership.total_benefits_redeemed}
                          </p>
                        </div>
                      </div>

                      {membership.next_tier && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-blue-700 font-medium">
                              Progress to {membership.next_tier}
                            </p>
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${membership.points_to_next_tier
                                  ? ((membership.points_balance / (membership.points_balance + membership.points_to_next_tier)) * 100)
                                  : 0}%`
                              }}
                            />
                          </div>
                          <p className="text-xs text-blue-600 mt-1">
                            {formatPoints(membership.points_to_next_tier || 0)} points needed
                          </p>
                        </div>
                      )}
                    </div>

                    <ChevronRight className="w-6 h-6 text-gray-400 ml-4" />
                  </div>
                </div>
              ))}

              {filteredMemberships.length === 0 && (
                <div className="p-12 text-center">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Customers Found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  )
}
