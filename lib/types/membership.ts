// Membership and Campaign Types

export enum MembershipTier {
  Bronze = 'Bronze',
  Silver = 'Silver',
  Gold = 'Gold',
  Platinum = 'Platinum'
}

export enum CampaignType {
  Seasonal = 'Seasonal',
  ProductLaunch = 'Product Launch',
  VolumeDiscount = 'Volume Discount',
  EarlyPayment = 'Early Payment',
  Loyalty = 'Loyalty',
  Referral = 'Referral'
}

export enum CampaignStatus {
  Active = 'Active',
  Upcoming = 'Upcoming',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum BenefitType {
  Discount = 'Discount',
  FreeShipping = 'Free Shipping',
  ExtendedCredit = 'Extended Credit',
  PriorityService = 'Priority Service',
  ExclusiveProducts = 'Exclusive Products',
  BonusPoints = 'Bonus Points'
}

export enum TransactionType {
  PointsEarned = 'Points Earned',
  PointsRedeemed = 'Points Redeemed',
  PointsExpired = 'Points Expired',
  BenefitRedeemed = 'Benefit Redeemed',
  CampaignJoined = 'Campaign Joined',
  TierUpgrade = 'Tier Upgrade',
  TierDowngrade = 'Tier Downgrade'
}

export interface Campaign {
  campaign_id: string
  name: string
  description: string
  type: CampaignType
  status: CampaignStatus
  start_date: Date
  end_date: Date
  target_segments: string[]
  target_tiers: MembershipTier[]
  benefits: CampaignBenefit[]
  participants_count: number
  budget?: number
  created_by: string
}

export interface CampaignBenefit {
  benefit_type: BenefitType
  description: string
  value: number | string
  conditions?: string
}

export interface CustomerMembership {
  customer_no: string
  customer_name: string
  current_tier: MembershipTier
  points_balance: number
  points_lifetime: number
  member_since: Date
  tier_since: Date
  next_tier?: MembershipTier
  points_to_next_tier?: number
  active_campaigns: string[]
  total_benefits_redeemed: number
}

export interface MembershipTransaction {
  transaction_id: string
  customer_no: string
  transaction_date: Date
  type: TransactionType
  description: string
  points_change?: number
  points_balance?: number
  campaign_id?: string
  campaign_name?: string
  benefit_type?: BenefitType
  benefit_value?: string
  order_no?: string
  previous_tier?: MembershipTier
  new_tier?: MembershipTier
  notes?: string
}

export interface TierBenefits {
  tier: MembershipTier
  points_required: number
  discount_percentage: number
  free_shipping: boolean
  extended_credit_days: number
  priority_support: boolean
  exclusive_products: boolean
  bonus_points_multiplier: number
}

export const TIER_BENEFITS: Record<MembershipTier, TierBenefits> = {
  [MembershipTier.Bronze]: {
    tier: MembershipTier.Bronze,
    points_required: 0,
    discount_percentage: 0,
    free_shipping: false,
    extended_credit_days: 0,
    priority_support: false,
    exclusive_products: false,
    bonus_points_multiplier: 1
  },
  [MembershipTier.Silver]: {
    tier: MembershipTier.Silver,
    points_required: 10000,
    discount_percentage: 2,
    free_shipping: false,
    extended_credit_days: 7,
    priority_support: false,
    exclusive_products: false,
    bonus_points_multiplier: 1.2
  },
  [MembershipTier.Gold]: {
    tier: MembershipTier.Gold,
    points_required: 50000,
    discount_percentage: 5,
    free_shipping: true,
    extended_credit_days: 15,
    priority_support: true,
    exclusive_products: true,
    bonus_points_multiplier: 1.5
  },
  [MembershipTier.Platinum]: {
    tier: MembershipTier.Platinum,
    points_required: 150000,
    discount_percentage: 8,
    free_shipping: true,
    extended_credit_days: 30,
    priority_support: true,
    exclusive_products: true,
    bonus_points_multiplier: 2
  }
}
