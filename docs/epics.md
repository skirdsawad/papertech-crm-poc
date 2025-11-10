# EPICs & User Stories (CRM-only)

## EPIC A — Account & Contact 360

* **A1. Sync & Link Accounts**
  As Admin, I can link CRM accounts to SAP customers by `sap_customer_no`.
  **Acceptance**: prevent duplicates; detect candidate matches (tax_id, name similarity); manual confirm.
* **A2. Account 360 with SAP Widgets**
  As Sales, I see SAP credit, orders, deliveries, invoices in tabs.
  **Acceptance**: load SAP widgets lazily; retry/backoff; offline fallback shows last cache timestamp.
* **A3. Multi-site & Contacts**
  As Sales, I manage multiple shipping sites and role-based contacts.
  **Acceptance**: default shipping site; contact roles; change history.

## EPIC B — Activities & Visit Planning

* **B1. Log Calls/Visits/Notes**
  As Sales, I log activities with outcomes and attachments.
  **Acceptance**: quick actions; templates; voice-to-text note.
* **B2. Route & Check-ins**
  As Sales, I plan routes and check in/out at customer sites.
  **Acceptance**: geo capture, time window, late/skip reasons.

## EPIC C — Leads & Opportunities

* **C1. Lead Intake & Scoring**
  As Marketing/Sales, I capture leads from forms, events, imports; auto-score by segment/intent.
  **Acceptance**: duplicate detection; GDPR/consent flags.
* **C2. Opportunity Stages & Forecast**
  As Sales, I move opps through stages and forecast quarterly pipeline.
  **Acceptance**: weighted pipeline; stage-exit checklist; next best action suggestions.
* **C3. Product Interest (Non-ERP)**
  As Sales, I capture interest attributes (category/grade/gsm/size) without pricing.
  **Acceptance**: controlled vocab; free-text allowed; map to SAP material families for analytics.

## EPIC D — Campaigns & CSR

* **D1. Audience Builder**
  As Marketing, I target accounts by segment/tier/territory/engagement.
  **Acceptance**: AND/OR filters; suppression lists; export CSV.
* **D2. Execution & Tracking**
  As Marketing, I publish content (email/portal) and track opens/clicks → influenced leads/opps.
  **Acceptance**: UTM tagging; basic attribution model.
* **D3. CSR Showcase**
  As CSR, I publish projects and report impact to management.
  **Acceptance**: photos before/after; KPI summary.

## EPIC E — Analytics

* **E1. Sales Performance (CRM)**
  Opp pipeline, win rate, cycle time, activity heatmaps.
* **E2. SAP-Informed Insights**
  Revenue trend by account/segment (read from SAP), AR risk flags, reorder propensity.
  **Acceptance**: clear source badge “SAP” vs “CRM”; refresh timestamps.