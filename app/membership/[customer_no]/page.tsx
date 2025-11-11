'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import {
  getCustomerMembershipByNo,
  getMembershipTransactions
} from '@/lib/mock-data/customer-membership'
import { getActiveCampaigns } from '@/lib/mock-data/campaigns'
import { MembershipTier, TransactionType, TIER_BENEFITS } from '@/lib/types/membership'
import {
  ArrowLeft,
  Star,
  Award,
  TrendingUp,
  Calendar,
  Gift,
  CreditCard,
  Target,
  Users,
  CheckCircle,
  XCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  Package
} from 'lucide-react'

interface PageProps {
  params: { customer_no: string }
}

export default function MembershipDetailPage({ params }: PageProps) {
  const router = useRouter()

  const membership = useMemo(() => {
    return getCustomerMembershipByNo(params.customer_no)
  }, [params.customer_no])

  const transactions = useMemo(() => {
    return getMembershipTransactions(params.customer_no)
  }, [params.customer_no])

  const activeCampaigns = useMemo(() => {
    return getActiveCampaigns()
  }, [])

  const handleBack = () => {
    router.push('/membership')
  }

  if (!membership) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Customer Not Found
            </h3>
            <p className="text-gray-600 mb-4">
              The customer membership profile you're looking for doesn't exist.
            </p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition"
            >
              Back to Membership List
            </button>
          </div>
        </div>
      </MainLayout>
    )
  }

  const tierBenefits = TIER_BENEFITS[membership.current_tier]

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
      return <Star className="w-5 h-5" fill="currentColor" />
    }

    return <Award className="w-5 h-5" />
  }

  const getTransactionIcon = (type: TransactionType) => {
    if (type === TransactionType.PointsEarned) {
      return <ArrowUpCircle className="w-5 h-5 text-green-600" />
    }

    if (type === TransactionType.PointsRedeemed) {
      return <ArrowDownCircle className="w-5 h-5 text-red-600" />
    }

    if (type === TransactionType.PointsExpired) {
      return <XCircle className="w-5 h-5 text-gray-600" />
    }

    if (type === TransactionType.BenefitRedeemed) {
      return <Gift className="w-5 h-5 text-purple-600" />
    }

    if (type === TransactionType.CampaignJoined) {
      return <Target className="w-5 h-5 text-blue-600" />
    }

    if (type === TransactionType.TierUpgrade) {
      return <TrendingUp className="w-5 h-5 text-green-600" />
    }

    if (type === TransactionType.TierDowngrade) {
      return <ArrowDownCircle className="w-5 h-5 text-orange-600" />
    }

    return <Clock className="w-5 h-5 text-gray-600" />
  }

  const getTransactionColor = (type: TransactionType): string => {
    if (type === TransactionType.PointsEarned) {
      return 'bg-green-50 border-green-200'
    }

    if (type === TransactionType.PointsRedeemed) {
      return 'bg-red-50 border-red-200'
    }

    if (type === TransactionType.BenefitRedeemed) {
      return 'bg-purple-50 border-purple-200'
    }

    if (type === TransactionType.CampaignJoined) {
      return 'bg-blue-50 border-blue-200'
    }

    if (type === TransactionType.TierUpgrade) {
      return 'bg-green-50 border-green-200'
    }

    return 'bg-gray-50 border-gray-200'
  }

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-800">{membership.customer_name}</h1>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full border flex items-center gap-2 ${getTierColor(membership.current_tier)}`}>
                  {getTierIcon(membership.current_tier)}
                  {membership.current_tier} Member
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Customer No: {membership.customer_no}
              </p>
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-primary opacity-50" />
                <div>
                  <p className="text-xs text-gray-500">Points Balance</p>
                  <p className="text-xl font-bold text-primary">
                    {formatPoints(membership.points_balance)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-600 opacity-50" />
                <div>
                  <p className="text-xs text-gray-500">Lifetime Points</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatPoints(membership.points_lifetime)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-blue-600 opacity-50" />
                <div>
                  <p className="text-xs text-gray-500">Active Campaigns</p>
                  <p className="text-xl font-bold text-blue-600">
                    {membership.active_campaigns.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <Gift className="w-8 h-8 text-purple-600 opacity-50" />
                <div>
                  <p className="text-xs text-gray-500">Benefits Redeemed</p>
                  <p className="text-xl font-bold text-purple-600">
                    {membership.total_benefits_redeemed}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Membership Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Membership Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Member Since</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(membership.member_since)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Current Tier Since</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(membership.tier_since)}
                  </p>
                </div>
                {membership.next_tier && (
                  <>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Next Tier</p>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        {membership.next_tier}
                      </p>
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
                  </>
                )}
              </div>
            </div>

            {/* Tier Benefits */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Tier Benefits</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Discount</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {tierBenefits.discount_percentage}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Free Shipping</span>
                  {tierBenefits.free_shipping ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Extended Credit</span>
                  <span className="text-sm font-semibold text-gray-900">
                    +{tierBenefits.extended_credit_days} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Priority Support</span>
                  {tierBenefits.priority_support ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Points Multiplier</span>
                  <span className="text-sm font-semibold text-primary">
                    {tierBenefits.bonus_points_multiplier}x
                  </span>
                </div>
              </div>
            </div>

            {/* Active Campaigns */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Active Campaigns</h2>
              {membership.active_campaigns.length > 0 ? (
                <div className="space-y-2">
                  {membership.active_campaigns.map((campaignId) => {
                    const campaign = activeCampaigns.find(c => c.campaign_id === campaignId)

                    return campaign ? (
                      <div key={campaignId} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-900">{campaign.name}</p>
                        <p className="text-xs text-blue-600 mt-1">{campaign.type}</p>
                      </div>
                    ) : null
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No active campaigns</p>
              )}
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Transaction History</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <div
                  key={transaction.transaction_id}
                  className={`p-6 ${getTransactionColor(transaction.type)} border-l-4`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getTransactionIcon(transaction.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">
                            {transaction.description}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {formatDate(transaction.transaction_date)}
                            </span>
                          </div>
                        </div>

                        {transaction.points_change && (
                          <div className="text-right">
                            <p className={`text-lg font-bold ${
                              transaction.points_change > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.points_change > 0 ? '+' : ''}{formatPoints(transaction.points_change)}
                            </p>
                            {transaction.points_balance !== undefined && (
                              <p className="text-xs text-gray-500">
                                Balance: {formatPoints(transaction.points_balance)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-2 py-1 text-xs bg-white border border-gray-300 rounded text-gray-700">
                          {transaction.type}
                        </span>

                        {transaction.campaign_name && (
                          <span className="px-2 py-1 text-xs bg-blue-100 border border-blue-300 rounded text-blue-700">
                            {transaction.campaign_name}
                          </span>
                        )}

                        {transaction.order_no && (
                          <span className="px-2 py-1 text-xs bg-purple-100 border border-purple-300 rounded text-purple-700 flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {transaction.order_no}
                          </span>
                        )}

                        {transaction.benefit_type && (
                          <span className="px-2 py-1 text-xs bg-green-100 border border-green-300 rounded text-green-700">
                            {transaction.benefit_type}
                          </span>
                        )}
                      </div>

                      {transaction.benefit_value && (
                        <p className="text-sm text-gray-700 mt-2">
                          <span className="font-medium">Value:</span> {transaction.benefit_value}
                        </p>
                      )}

                      {transaction.notes && (
                        <p className="text-xs text-gray-600 mt-2 italic">
                          {transaction.notes}
                        </p>
                      )}

                      {(transaction.previous_tier || transaction.new_tier) && (
                        <div className="mt-2 flex items-center gap-2">
                          {transaction.previous_tier && (
                            <span className={`px-2 py-1 text-xs rounded ${getTierColor(transaction.previous_tier)}`}>
                              {transaction.previous_tier}
                            </span>
                          )}
                          <span className="text-gray-400">→</span>
                          {transaction.new_tier && (
                            <span className={`px-2 py-1 text-xs rounded ${getTierColor(transaction.new_tier)}`}>
                              {transaction.new_tier}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {transactions.length === 0 && (
                <div className="p-12 text-center">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Transactions Yet
                  </h3>
                  <p className="text-gray-600">
                    Transaction history will appear here
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
