

# Core Domain (CRM data model)

## Account (B2B)

* account_id, sap_customer_no, legal_name, trade_name
* tax_id, branch_code, segment, territory, size_tier
* billing_address, shipping_addresses[]
* contacts[] (link to Contact)
* payment_terms_display (read-only from SAP)
* credit_status_display: limit, utilized, overdue_flag (read-only)
* negotiated_pricing_flag (display only)
* loyalty_tier? (if kept), csr_affinity_tags[]
* notes, status (active, on_hold, blacklisted)

## Contact

* contact_id, account_id, name, role (Procurement/AP/Warehouse/Management)
* phone, email, preferred_channel, consent_flags
* owner_user_id

## Lead

* lead_id, source, campaign_id?, company_name, contact_name/email/phone
* inferred_segment, score, owner_user_id, status (new, working, qualified, disqualified), reason

## Opportunity

* opp_id, account_id, name, stage (qualify/discover/propose/commit/won/lost)
* amount_thb (manual or model-assisted), close_date, probability
* products_interest[]: category/grade/gsm/size (free-form — **no ERP price**)
* competitors[], risks[], next_best_action
* owner_user_id, forecast_category (pipeline/best/commit)
* attachments[]

## Activity

* activity_id, type (call/visit/meeting/email/task/note)
* account_id, contact_id?, opp_id?
* subject, body, due_at/started_at/duration, outcome
* location (with geo), attachments[], created_by

## Campaign

* campaign_id, type (email/portal/field/CSR), audience_filters (segment/tier/territory)
* start/end, budget_cap, kpi_targets (leads, opps, revenue influence)
* assets[], utm_tags

## CSR Project

* csr_id, title, partner, location, description
* items_donated, volunteer_slots, photos[], outcomes/KPIs
* related_campaign_id?