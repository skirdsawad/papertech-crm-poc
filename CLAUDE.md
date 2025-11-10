# PaperTech CRM POC - Project Instructions

## Project Overview

This is a **Proof of Concept (POC)** for a B2B Paper CRM system designed for the paper manufacturing and distribution industry. The CRM integrates with SAP for read-only transactional data while managing sales activities, leads, opportunities, and customer relationships.

**Critical Context:**
- This is a POC with **NO DATABASE** - use in-memory data structures or mock data
- All SAP integration is **READ-ONLY** - no mutations allowed
- Focus on demonstrating UX and workflows, not production-ready data persistence

## Technology Stack

- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data**: In-memory/mock data (no database for POC)

## Architecture Principles

### 1. No Database Persistence
- Use in-memory data structures (arrays, objects)
- Mock SAP API responses with realistic data
- Data resets on server restart (acceptable for POC)
- Use TypeScript interfaces to model domain entities

### 2. SAP Integration (Read-Only)
- All SAP data is **display-only** - never mutate
- Show clear "Source: SAP" badges on SAP-sourced data
- Display cache timestamps and "last updated" times
- Implement lazy loading for SAP widgets
- Handle errors gracefully with fallback to cached data
- Cache TTLs: Customer snapshot (15m), Orders/Deliveries/Invoices (30-60m)

### 3. Domain Separation
- **CRM Domain**: Account, Contact, Lead, Opportunity, Activity, Campaign, CSR Project
- **SAP Domain**: Customer master, Orders, Deliveries, Invoices, AR Aging (read-only)
- Never mix pricing/ERP data into CRM entities

## Core Data Model

### CRM Entities

**Account (B2B)**
```typescript
{
  account_id: string
  sap_customer_no?: string  // Soft link to SAP
  legal_name: string
  trade_name?: string
  tax_id: string
  branch_code?: string
  segment: string  // e.g., "Publishing", "Packaging"
  territory: string
  size_tier: string  // "SME", "Mid-Market", "Enterprise"
  billing_address: Address
  shipping_addresses: Address[]
  contacts: Contact[]
  payment_terms_display?: string  // Read-only from SAP
  credit_status_display?: CreditStatus  // Read-only from SAP
  negotiated_pricing_flag: boolean
  loyalty_tier?: string
  csr_affinity_tags: string[]
  notes: string
  status: AccountStatus  // Enum: active, on_hold, blacklisted
}
```

**Contact**
```typescript
{
  contact_id: string
  account_id: string
  name: string
  role: ContactRole  // Enum: Procurement, AP, Warehouse, Management
  phone: string
  email: string
  preferred_channel: string
  consent_flags: ConsentFlags
  owner_user_id: string
}
```

**Lead**
```typescript
{
  lead_id: string
  source: string
  campaign_id?: string
  company_name: string
  contact_name: string
  email: string
  phone: string
  inferred_segment?: string
  score: number  // 0-100
  owner_user_id: string
  status: LeadStatus  // Enum: new, working, qualified, disqualified
  reason?: string
}
```

**Opportunity**
```typescript
{
  opp_id: string
  account_id: string
  name: string
  stage: OpportunityStage  // Enum: qualify, discover, propose, commit, won, lost
  amount_thb: number
  close_date: Date
  probability: number
  products_interest: ProductInterest[]  // NO ERP pricing
  competitors: string[]
  risks: string[]
  next_best_action: string
  owner_user_id: string
  forecast_category: ForecastCategory  // Enum: pipeline, best, commit
  attachments: Attachment[]
}
```

**Activity**
```typescript
{
  activity_id: string
  type: ActivityType  // Enum: call, visit, meeting, email, task, note
  account_id: string
  contact_id?: string
  opp_id?: string
  subject: string
  body: string
  due_at?: Date
  started_at?: Date
  duration?: number
  outcome?: string
  location?: Location
  attachments: Attachment[]
  created_by: string
}
```

### SAP Read-Only Surfaces

**Customer Snapshot**
```typescript
{
  customer_no: string
  sales_org: string
  payment_terms: string
  credit_limit: number
  credit_exposure: number
  credit_available: number
  overdue_aging: {
    bucket_0_30: number
    bucket_31_60: number
    bucket_61_90: number
    bucket_90_plus: number
  }
  negotiated_pricing_active: boolean
}
```

**Order Header**
```typescript
{
  order_no: string
  order_date: Date
  doc_type: string
  net_value: number
  status: string
  lines?: OrderLine[]  // On drill-down
}
```

## Coding Standards

### TypeScript Conventions

**1. Use Enums for Constants**
```typescript
// ✅ GOOD
enum AccountStatus {
  Active = 'active',
  OnHold = 'on_hold',
  Blacklisted = 'blacklisted'
}

if (account.status === AccountStatus.Active) {
  // ...
}

// ❌ BAD - Direct string comparison
if (account.status === 'active') {
  // ...
}
```

**2. Always Use Braces for If Blocks**
```typescript
// ✅ GOOD
if (condition) {
  doSomething()
}

// ❌ BAD
if (condition) doSomething()
```

**3. Empty Line Before Return**
```typescript
// ✅ GOOD
function calculate() {
  const result = a + b

  return result
}

// ❌ BAD
function calculate() {
  const result = a + b
  return result
}
```

### React/Next.js Conventions

**4. Avoid Inline Event Handlers**
```typescript
// ✅ GOOD
function MyComponent() {
  const handleClick = () => {
    console.log('clicked')
  }

  return <button onClick={handleClick}>Click</button>
}

// ❌ BAD
function MyComponent() {
  return <button onClick={() => console.log('clicked')}>Click</button>
}
```

**5. Define Event Handler Functions**
Always define event handlers as named functions, not inline arrow functions.

### API & Integration

**6. SAP Endpoint Patterns**
```typescript
// Mock endpoints for POC
GET /api/sap/customers
GET /api/sap/customers/{customer_no}
GET /api/sap/orders?customer_no=&from=&to=&page=
GET /api/sap/orders/{order_no}
GET /api/sap/deliveries?customer_no=&from=&to=
GET /api/sap/invoices?customer_no=&status=
```

**7. Cache Indicators**
Always show:
- "Source: SAP" badge
- Last updated timestamp
- Refresh button with rate limiting

**8. Error Handling**
```typescript
// Show graceful fallback
if (sapDataError) {
  return (
    <div>
      <SkeletonLoader />
      <Banner>Using cached data from {lastUpdated}</Banner>
      <RetryButton />
    </div>
  )
}
```

## Feature Epics

### Epic A - Account & Contact 360
- Link CRM accounts to SAP customers via `sap_customer_no`
- Display SAP widgets: credit, orders, deliveries, invoices
- Manage contacts with roles (Procurement, AP, Warehouse, Management)
- Multi-site shipping addresses

### Epic B - Activities & Visit Planning
- Log calls, visits, meetings, notes with outcomes
- Activity timeline view
- Route planning and geo check-in/check-out

### Epic C - Leads & Opportunities
- Lead intake, scoring, conversion to Account/Contact
- Opportunity stages: qualify → discover → propose → commit → won/lost
- Product interest tracking (NO pricing)
- Weighted pipeline forecast

### Epic D - Campaigns & CSR
- Audience builder by segment/tier/territory
- Campaign execution and attribution
- CSR project showcase

### Epic E - Analytics
- Pipeline dashboard by stage/rep/territory
- Activity heatmaps
- Revenue trends (SAP-sourced, clearly labeled)
- AR risk flags

## Security & Performance

### Security Requirements
- **RBAC/ABAC**: Territory-based access control
- **PII Protection**: Mask sensitive fields (phone, email)
- **Field-level permissions**: Hide/show based on role
- **Audit trail**: Track who accessed what

### Performance Budgets
- Account header load: **< 300ms**
- SAP widgets from cache: **< 1.8s**
- Activity create: **< 500ms**
- Show loading skeletons after 300ms

### UX Patterns
- Lazy load SAP widgets
- Skeleton loaders for 300-1500ms delays
- Clear error states with retry options
- Offline/cached data fallback with timestamps

## File Organization

```
app/
  accounts/
    [id]/
      page.tsx           # Account 360 view
      _components/       # Account-specific components
  leads/
  opportunities/
  activities/
  campaigns/
lib/
  types/
    account.ts           # Domain types
    lead.ts
    opportunity.ts
    sap.ts              # SAP read-only types
  mock-data/
    accounts.ts         # In-memory mock data
    sap-responses.ts    # Mock SAP API responses
  utils/
    enums.ts            # All enums
components/
  sap-widgets/          # Reusable SAP display components
  ui/                   # Shared UI components
```

## Testing Considerations

For POC, focus on:
- TypeScript type safety
- UI/UX validation
- SAP integration error states
- Role-based access display (mock roles)

## Important Reminders

1. **NO DATABASE** - All data is in-memory for this POC
2. **NO SAP MUTATIONS** - Only read/display SAP data
3. **NO PRICING IN CRM** - Products interest is descriptive only
4. **USE ENUMS** - Avoid string literals for status/types
5. **SHOW DATA SOURCE** - Always label SAP vs CRM data
6. **CACHE TIMESTAMPS** - Display when data was last refreshed
7. **GRACEFUL ERRORS** - Never show raw errors, always fallback UX
