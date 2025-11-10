// Order Status
export enum OrderStatus {
  Open = 'Open',
  InProgress = 'In Progress',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
  PartiallyDelivered = 'Partially Delivered'
}

// Document Types
export enum DocumentType {
  StandardOrder = 'Standard Order',
  RushOrder = 'Rush Order',
  ConsignmentOrder = 'Consignment Order',
  CreditMemo = 'Credit Memo',
  DebitMemo = 'Debit Memo'
}

// Delivery Status
export enum DeliveryStatus {
  Planned = 'Planned',
  InTransit = 'In Transit',
  Delivered = 'Delivered',
  Failed = 'Failed',
  Cancelled = 'Cancelled'
}
