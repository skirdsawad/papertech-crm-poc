import {
  Campaign,
  CampaignType,
  CampaignStatus,
  BenefitType,
  MembershipTier
} from '../types/membership'

export const mockCampaigns: Campaign[] = [
  {
    campaign_id: 'CAMP-2024-001',
    name: 'Chinese New Year 2024 Promotion',
    description: 'Special discounts and bonus points for bulk orders during CNY season',
    type: CampaignType.Seasonal,
    status: CampaignStatus.Completed,
    start_date: new Date('2024-01-15'),
    end_date: new Date('2024-02-28'),
    target_segments: ['Publishing', 'Packaging'],
    target_tiers: [MembershipTier.Gold, MembershipTier.Platinum],
    benefits: [
      {
        benefit_type: BenefitType.Discount,
        description: '5% discount on orders above 500,000 THB',
        value: 5,
        conditions: 'Minimum order value 500,000 THB'
      },
      {
        benefit_type: BenefitType.BonusPoints,
        description: 'Double loyalty points on all orders',
        value: '2x',
        conditions: 'Valid for all orders during campaign period'
      }
    ],
    participants_count: 23,
    budget: 2000000,
    created_by: 'marketing@caspaper.com'
  },
  {
    campaign_id: 'CAMP-2024-002',
    name: 'New Customer Welcome Program',
    description: 'Onboarding incentives for new B2B customers',
    type: CampaignType.Loyalty,
    status: CampaignStatus.Active,
    start_date: new Date('2024-01-01'),
    end_date: new Date('2024-12-31'),
    target_segments: ['Publishing', 'Packaging', 'Converting', 'Printing'],
    target_tiers: [MembershipTier.Bronze],
    benefits: [
      {
        benefit_type: BenefitType.Discount,
        description: '3% discount on first 3 orders',
        value: 3,
        conditions: 'First 3 orders within 90 days of registration'
      },
      {
        benefit_type: BenefitType.FreeShipping,
        description: 'Free shipping on first order',
        value: 'Free',
        conditions: 'First order only'
      },
      {
        benefit_type: BenefitType.BonusPoints,
        description: '5,000 welcome bonus points',
        value: '5000',
        conditions: 'Upon first order completion'
      }
    ],
    participants_count: 12,
    created_by: 'sales@caspaper.com'
  },
  {
    campaign_id: 'CAMP-2024-003',
    name: 'Q2 Volume Incentive',
    description: 'Reward high-volume purchases with tier upgrades and exclusive benefits',
    type: CampaignType.VolumeDiscount,
    status: CampaignStatus.Active,
    start_date: new Date('2024-04-01'),
    end_date: new Date('2024-06-30'),
    target_segments: ['Publishing', 'Packaging', 'Converting'],
    target_tiers: [MembershipTier.Silver, MembershipTier.Gold],
    benefits: [
      {
        benefit_type: BenefitType.Discount,
        description: 'Progressive discount up to 10%',
        value: 10,
        conditions: '2M+ THB = 3%, 5M+ = 6%, 10M+ = 10%'
      },
      {
        benefit_type: BenefitType.PriorityService,
        description: 'Priority order processing and delivery',
        value: 'Priority',
        conditions: 'Orders above 2M THB'
      }
    ],
    participants_count: 34,
    budget: 5000000,
    created_by: 'sales@caspaper.com'
  },
  {
    campaign_id: 'CAMP-2024-004',
    name: 'Early Payment Rewards',
    description: 'Incentivize early payment with bonus points and benefits',
    type: CampaignType.EarlyPayment,
    status: CampaignStatus.Active,
    start_date: new Date('2024-03-01'),
    end_date: new Date('2024-12-31'),
    target_segments: ['Publishing', 'Packaging', 'Converting', 'Printing', 'Distribution'],
    target_tiers: [MembershipTier.Bronze, MembershipTier.Silver, MembershipTier.Gold, MembershipTier.Platinum],
    benefits: [
      {
        benefit_type: BenefitType.BonusPoints,
        description: 'Bonus points for early payment',
        value: '3x',
        conditions: 'Pay within 7 days: 3x points, 14 days: 2x points'
      },
      {
        benefit_type: BenefitType.Discount,
        description: '1% cash discount for payment within 7 days',
        value: 1,
        conditions: 'Invoice paid within 7 days'
      }
    ],
    participants_count: 45,
    created_by: 'finance@caspaper.com'
  },
  {
    campaign_id: 'CAMP-2024-005',
    name: 'Sustainable Paper Initiative',
    description: 'Promote eco-friendly paper products with special pricing',
    type: CampaignType.ProductLaunch,
    status: CampaignStatus.Upcoming,
    start_date: new Date('2024-07-01'),
    end_date: new Date('2024-09-30'),
    target_segments: ['Publishing', 'Printing'],
    target_tiers: [MembershipTier.Gold, MembershipTier.Platinum],
    benefits: [
      {
        benefit_type: BenefitType.ExclusiveProducts,
        description: 'Early access to new eco-friendly paper line',
        value: 'Exclusive',
        conditions: 'Gold and Platinum members only'
      },
      {
        benefit_type: BenefitType.Discount,
        description: '8% discount on eco-friendly products',
        value: 8,
        conditions: 'Valid on all eco-friendly paper products'
      },
      {
        benefit_type: BenefitType.BonusPoints,
        description: 'Triple points on sustainable products',
        value: '3x',
        conditions: 'Eco-friendly product purchases only'
      }
    ],
    participants_count: 0,
    budget: 3000000,
    created_by: 'product@caspaper.com'
  },
  {
    campaign_id: 'CAMP-2024-006',
    name: 'Referral Rewards Program',
    description: 'Earn rewards for referring new business customers',
    type: CampaignType.Referral,
    status: CampaignStatus.Active,
    start_date: new Date('2024-01-01'),
    end_date: new Date('2024-12-31'),
    target_segments: ['Publishing', 'Packaging', 'Converting', 'Printing', 'Distribution'],
    target_tiers: [MembershipTier.Silver, MembershipTier.Gold, MembershipTier.Platinum],
    benefits: [
      {
        benefit_type: BenefitType.BonusPoints,
        description: '10,000 points per successful referral',
        value: '10000',
        conditions: 'Referral must complete first order'
      },
      {
        benefit_type: BenefitType.Discount,
        description: '5% discount on next order after referral',
        value: 5,
        conditions: 'Applied after referred customer places first order'
      }
    ],
    participants_count: 18,
    created_by: 'marketing@caspaper.com'
  }
]

export function getAllCampaigns(): Campaign[] {
  return mockCampaigns
}

export function getCampaignById(campaignId: string): Campaign | undefined {
  return mockCampaigns.find(c => c.campaign_id === campaignId)
}

export function getActiveCampaigns(): Campaign[] {
  return mockCampaigns.filter(c => c.status === CampaignStatus.Active)
}

export function getCampaignsByStatus(status: CampaignStatus): Campaign[] {
  return mockCampaigns.filter(c => c.status === status)
}
