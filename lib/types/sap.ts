// SAP Read-Only Types

export interface SAPCustomerSnapshot {
  customer_no: string
  sales_org: string
  legal_name: string
  tax_id: string
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
  segment: string
  territory: string
  lastUpdated?: Date
}

export interface SAPOrderHeader {
  order_no: string
  order_date: Date
  doc_type: string
  net_value: number
  status: string
  customer_no: string
  customer_name: string
  delivery_date?: Date
  items_count: number
}

export interface SAPOrderLine {
  line_no: number
  material_code: string
  description: string
  description_thai: string
  qty: number
  uom: string
  unit_price: number
  net_price: number
  gsm?: number
  size?: string
}

export interface SAPDeliveryItem {
  line_no: number
  material_code: string
  description: string
  description_thai: string
  qty_ordered: number
  qty_shipped: number
  uom: string
}

export interface SAPPOD {
  signature_url?: string
  photo_url?: string
  received_by?: string
  received_date?: Date
  notes?: string
}

export interface GPSCoordinates {
  lat: number
  lng: number
}

export interface DeliveryTracking {
  origin: GPSCoordinates
  destination: GPSCoordinates
  current_location?: GPSCoordinates
  last_updated?: Date
}

export interface SAPDelivery {
  delivery_no: string
  order_no: string
  customer_no: string
  customer_name: string
  planned_date: Date
  actual_date?: Date
  status: string
  carrier?: string
  route?: string
  tracking_no?: string
  pod_available: boolean
  pod?: SAPPOD
  items?: SAPDeliveryItem[]
  tracking?: DeliveryTracking
}

export interface SAPInvoice {
  invoice_no: string
  customer_no: string
  customer_name: string
  invoice_date: Date
  due_date: Date
  amount: number
  paid_amount: number
  balance: number
  status: string
  payment_terms: string
  reference_order?: string
  days_overdue: number
}

export enum CustomerSegment {
  Publishing = 'Publishing',
  Packaging = 'Packaging',
  Converting = 'Converting',
  Printing = 'Printing',
  Distribution = 'Distribution'
}

export enum Territory {
  Bangkok = 'Bangkok',
  Central = 'Central',
  North = 'North',
  Northeast = 'Northeast',
  East = 'East',
  South = 'South'
}

export enum PaymentTerms {
  Net30 = 'NET 30',
  Net45 = 'NET 45',
  Net60 = 'NET 60',
  Net90 = 'NET 90',
  COD = 'Cash on Delivery',
  LC = 'Letter of Credit'
}
