import {
  CustomerMembership,
  MembershipTransaction,
  MembershipTier,
  TransactionType,
  BenefitType,
  TIER_BENEFITS
} from '../types/membership'

export const mockCustomerMemberships: CustomerMembership[] = [
  {
    customer_no: '1000001',
    customer_name: 'Bangkok Publishing House Co., Ltd.',
    current_tier: MembershipTier.Platinum,
    points_balance: 185000,
    points_lifetime: 320000,
    member_since: new Date('2020-03-15'),
    tier_since: new Date('2023-06-10'),
    active_campaigns: ['CAMP-2024-003', 'CAMP-2024-004', 'CAMP-2024-006'],
    total_benefits_redeemed: 12
  },
  {
    customer_no: '1000002',
    customer_name: 'Thai Packaging Solutions Ltd.',
    current_tier: MembershipTier.Gold,
    points_balance: 72000,
    points_lifetime: 145000,
    member_since: new Date('2021-01-20'),
    tier_since: new Date('2023-08-15'),
    next_tier: MembershipTier.Platinum,
    points_to_next_tier: 78000,
    active_campaigns: ['CAMP-2024-003', 'CAMP-2024-004'],
    total_benefits_redeemed: 8
  },
  {
    customer_no: '1000003',
    customer_name: 'Central Printing Press',
    current_tier: MembershipTier.Gold,
    points_balance: 95000,
    points_lifetime: 180000,
    member_since: new Date('2019-11-05'),
    tier_since: new Date('2022-05-20'),
    next_tier: MembershipTier.Platinum,
    points_to_next_tier: 55000,
    active_campaigns: ['CAMP-2024-004', 'CAMP-2024-006'],
    total_benefits_redeemed: 15
  },
  {
    customer_no: '1000004',
    customer_name: 'Modern Office Supply Co.',
    current_tier: MembershipTier.Silver,
    points_balance: 18000,
    points_lifetime: 35000,
    member_since: new Date('2022-08-10'),
    tier_since: new Date('2023-11-01'),
    next_tier: MembershipTier.Gold,
    points_to_next_tier: 32000,
    active_campaigns: ['CAMP-2024-004'],
    total_benefits_redeemed: 3
  },
  {
    customer_no: '1000005',
    customer_name: 'Chiangmai Book Center',
    current_tier: MembershipTier.Bronze,
    points_balance: 5200,
    points_lifetime: 8500,
    member_since: new Date('2023-09-15'),
    tier_since: new Date('2023-09-15'),
    next_tier: MembershipTier.Silver,
    points_to_next_tier: 4800,
    active_campaigns: ['CAMP-2024-002', 'CAMP-2024-004'],
    total_benefits_redeemed: 1
  }
]

export const mockMembershipTransactions: MembershipTransaction[] = [
  // Platinum customer transactions
  {
    transaction_id: 'TXN-2024-001',
    customer_no: '1000001',
    transaction_date: new Date('2024-05-15'),
    type: TransactionType.PointsEarned,
    description: 'Points earned from Order SO-2024-1234',
    points_change: 12500,
    points_balance: 185000,
    order_no: 'SO-2024-1234',
    notes: 'Regular order points (2x multiplier applied)'
  },
  {
    transaction_id: 'TXN-2024-002',
    customer_no: '1000001',
    transaction_date: new Date('2024-05-10'),
    type: TransactionType.BenefitRedeemed,
    description: 'Priority service benefit applied',
    campaign_id: 'CAMP-2024-003',
    campaign_name: 'Q2 Volume Incentive',
    benefit_type: BenefitType.PriorityService,
    benefit_value: 'Express delivery - 2 days',
    order_no: 'SO-2024-1234'
  },
  {
    transaction_id: 'TXN-2024-003',
    customer_no: '1000001',
    transaction_date: new Date('2024-04-20'),
    type: TransactionType.PointsEarned,
    description: 'Bonus points from early payment',
    points_change: 8500,
    points_balance: 172500,
    campaign_id: 'CAMP-2024-004',
    campaign_name: 'Early Payment Rewards',
    notes: 'Invoice paid 5 days early - 3x multiplier'
  },
  {
    transaction_id: 'TXN-2024-004',
    customer_no: '1000001',
    transaction_date: new Date('2024-03-15'),
    type: TransactionType.BenefitRedeemed,
    description: 'Referral bonus - New customer referred',
    points_change: 10000,
    points_balance: 164000,
    campaign_id: 'CAMP-2024-006',
    campaign_name: 'Referral Rewards Program',
    benefit_type: BenefitType.BonusPoints,
    benefit_value: '10,000 points',
    notes: 'Referred: Modern Office Supply Co.'
  },
  {
    transaction_id: 'TXN-2024-005',
    customer_no: '1000001',
    transaction_date: new Date('2024-02-28'),
    type: TransactionType.PointsRedeemed,
    description: 'Redeemed points for discount voucher',
    points_change: -15000,
    points_balance: 154000,
    benefit_type: BenefitType.Discount,
    benefit_value: '5% discount on next order'
  },

  // Gold customer transactions
  {
    transaction_id: 'TXN-2024-006',
    customer_no: '1000002',
    transaction_date: new Date('2024-05-18'),
    type: TransactionType.PointsEarned,
    description: 'Points earned from Order SO-2024-2156',
    points_change: 7200,
    points_balance: 72000,
    order_no: 'SO-2024-2156',
    notes: 'Regular order points (1.5x Gold multiplier)'
  },
  {
    transaction_id: 'TXN-2024-007',
    customer_no: '1000002',
    transaction_date: new Date('2024-05-05'),
    type: TransactionType.BenefitRedeemed,
    description: 'Free shipping benefit applied',
    benefit_type: BenefitType.FreeShipping,
    benefit_value: '2,500 THB shipping waived',
    order_no: 'SO-2024-2098',
    notes: 'Gold tier benefit'
  },
  {
    transaction_id: 'TXN-2024-008',
    customer_no: '1000002',
    transaction_date: new Date('2024-04-15'),
    type: TransactionType.PointsEarned,
    description: 'Campaign participation bonus',
    points_change: 5000,
    points_balance: 64800,
    campaign_id: 'CAMP-2024-003',
    campaign_name: 'Q2 Volume Incentive',
    benefit_type: BenefitType.BonusPoints,
    benefit_value: '5,000 bonus points'
  },
  {
    transaction_id: 'TXN-2024-009',
    customer_no: '1000002',
    transaction_date: new Date('2023-08-15'),
    type: TransactionType.TierUpgrade,
    description: 'Upgraded from Silver to Gold',
    previous_tier: MembershipTier.Silver,
    new_tier: MembershipTier.Gold,
    notes: 'Reached 50,000 lifetime points'
  },

  // Gold customer 2 transactions
  {
    transaction_id: 'TXN-2024-010',
    customer_no: '1000003',
    transaction_date: new Date('2024-05-12'),
    type: TransactionType.PointsEarned,
    description: 'Points earned from Order SO-2024-3421',
    points_change: 9500,
    points_balance: 95000,
    order_no: 'SO-2024-3421',
    notes: 'Regular order points (1.5x Gold multiplier)'
  },
  {
    transaction_id: 'TXN-2024-011',
    customer_no: '1000003',
    transaction_date: new Date('2024-04-28'),
    type: TransactionType.PointsRedeemed,
    description: 'Redeemed points for extended credit terms',
    points_change: -8000,
    points_balance: 85500,
    benefit_type: BenefitType.ExtendedCredit,
    benefit_value: 'NET 60 for next 3 orders'
  },
  {
    transaction_id: 'TXN-2024-012',
    customer_no: '1000003',
    transaction_date: new Date('2024-04-10'),
    type: TransactionType.BenefitRedeemed,
    description: 'Referral bonus earned',
    points_change: 10000,
    points_balance: 93500,
    campaign_id: 'CAMP-2024-006',
    campaign_name: 'Referral Rewards Program',
    benefit_type: BenefitType.BonusPoints,
    benefit_value: '10,000 points'
  },

  // Silver customer transactions
  {
    transaction_id: 'TXN-2024-013',
    customer_no: '1000004',
    transaction_date: new Date('2024-05-16'),
    type: TransactionType.PointsEarned,
    description: 'Points earned from Order SO-2024-4567',
    points_change: 3600,
    points_balance: 18000,
    order_no: 'SO-2024-4567',
    notes: 'Regular order points (1.2x Silver multiplier)'
  },
  {
    transaction_id: 'TXN-2024-014',
    customer_no: '1000004',
    transaction_date: new Date('2024-05-02'),
    type: TransactionType.PointsEarned,
    description: 'Early payment bonus',
    points_change: 2400,
    points_balance: 14400,
    campaign_id: 'CAMP-2024-004',
    campaign_name: 'Early Payment Rewards',
    benefit_type: BenefitType.BonusPoints,
    benefit_value: '2x points for 14-day payment'
  },
  {
    transaction_id: 'TXN-2024-015',
    customer_no: '1000004',
    transaction_date: new Date('2023-11-01'),
    type: TransactionType.TierUpgrade,
    description: 'Upgraded from Bronze to Silver',
    previous_tier: MembershipTier.Bronze,
    new_tier: MembershipTier.Silver,
    notes: 'Reached 10,000 lifetime points'
  },

  // Bronze customer transactions
  {
    transaction_id: 'TXN-2024-016',
    customer_no: '1000005',
    transaction_date: new Date('2024-05-14'),
    type: TransactionType.PointsEarned,
    description: 'Points earned from Order SO-2024-5678',
    points_change: 1800,
    points_balance: 5200,
    order_no: 'SO-2024-5678',
    notes: 'Regular order points'
  },
  {
    transaction_id: 'TXN-2024-017',
    customer_no: '1000005',
    transaction_date: new Date('2024-04-20'),
    type: TransactionType.CampaignJoined,
    description: 'Joined New Customer Welcome Program',
    campaign_id: 'CAMP-2024-002',
    campaign_name: 'New Customer Welcome Program',
    notes: 'Eligible for welcome benefits'
  },
  {
    transaction_id: 'TXN-2024-018',
    customer_no: '1000005',
    transaction_date: new Date('2024-03-15'),
    type: TransactionType.BenefitRedeemed,
    description: 'Welcome bonus applied',
    points_change: 5000,
    points_balance: 3400,
    campaign_id: 'CAMP-2024-002',
    campaign_name: 'New Customer Welcome Program',
    benefit_type: BenefitType.BonusPoints,
    benefit_value: '5,000 welcome points'
  },
  {
    transaction_id: 'TXN-2024-019',
    customer_no: '1000005',
    transaction_date: new Date('2024-02-10'),
    type: TransactionType.BenefitRedeemed,
    description: 'Free shipping on first order',
    campaign_id: 'CAMP-2024-002',
    campaign_name: 'New Customer Welcome Program',
    benefit_type: BenefitType.FreeShipping,
    benefit_value: '1,200 THB shipping waived',
    order_no: 'SO-2024-5001'
  },
  {
    transaction_id: 'TXN-2024-020',
    customer_no: '1000005',
    transaction_date: new Date('2024-01-08'),
    type: TransactionType.PointsExpired,
    description: 'Promotional points expired',
    points_change: -500,
    points_balance: -1600,
    notes: 'Unused promotional points from trial period'
  }
]

export function getCustomerMemberships(): CustomerMembership[] {
  return mockCustomerMemberships
}

export function getCustomerMembershipByNo(customerNo: string): CustomerMembership | undefined {
  return mockCustomerMemberships.find(m => m.customer_no === customerNo)
}

export function getMembershipTransactions(customerNo: string): MembershipTransaction[] {
  return mockMembershipTransactions
    .filter(t => t.customer_no === customerNo)
    .sort((a, b) => b.transaction_date.getTime() - a.transaction_date.getTime())
}

export function getCustomersByTier(tier: MembershipTier): CustomerMembership[] {
  return mockCustomerMemberships.filter(m => m.current_tier === tier)
}

export function getTierStatistics() {
  const stats = {
    [MembershipTier.Bronze]: 0,
    [MembershipTier.Silver]: 0,
    [MembershipTier.Gold]: 0,
    [MembershipTier.Platinum]: 0
  }

  mockCustomerMemberships.forEach(m => {
    stats[m.current_tier]++
  })

  return stats
}
