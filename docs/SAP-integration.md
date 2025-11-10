# Read-Only SAP Surfaces (embedded in Account 360)

> All **read-only**; no mutation in CRM.

## SAP Customer Snapshot (pulled on view/open)

* master: customer_no, sales_org, tax data, payment_terms
* **credit**: limit, exposure, available, overdue aging buckets
* **pricing note**: show “Negotiated pricing active” (no price tables in CRM)

## Order History (header list + drill)

* list fields: order_no, order_date, doc_type, net_value, status
* lines on drill: material_code, description, qty, uom, net_price (display), schedule lines
* quick filters: last 30/90/365 days

## Delivery & POD

* list fields: delivery_no, planned_date, actual_date, status
* drill: items, qty_shipped, carrier/route, POD (signature/photo if available)

## Invoice & AR Aging

* list fields: invoice_no, date, amount, due_date, status (open/paid/overdue)
* aging summary: 0–30/31–60/61–90/90+
* download invoice PDF (link proxied from SAP DMS if allowed)
