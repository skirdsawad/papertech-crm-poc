import { SAPInvoice } from '../types/sap'
import { InvoiceStatus } from '../types/enums'
import invoicesData from './invoices.json'

export const mockSAPInvoices: SAPInvoice[] = invoicesData.map(invoice => ({
  ...invoice,
  invoice_date: new Date(invoice.invoice_date),
  due_date: new Date(invoice.due_date)
}))

// Helper functions
export function getInvoiceByNo(invoiceNo: string): SAPInvoice | undefined {
  return mockSAPInvoices.find(i => i.invoice_no === invoiceNo)
}

export function getInvoicesByCustomer(customerNo: string): SAPInvoice[] {
  return mockSAPInvoices.filter(i => i.customer_no === customerNo)
}

export function searchInvoices(query: string): SAPInvoice[] {
  const lowerQuery = query.toLowerCase()

  return mockSAPInvoices.filter(i =>
    i.invoice_no.toLowerCase().includes(lowerQuery) ||
    i.customer_no.toLowerCase().includes(lowerQuery) ||
    i.customer_name.toLowerCase().includes(lowerQuery) ||
    i.reference_order?.toLowerCase().includes(lowerQuery)
  )
}

export function getInvoiceStats() {
  const totalInvoices = mockSAPInvoices.length
  const totalReceivable = mockSAPInvoices.reduce((sum, i) => sum + i.balance, 0)
  const overdueInvoices = mockSAPInvoices.filter(i => i.status === InvoiceStatus.Overdue).length
  const overdueAmount = mockSAPInvoices
    .filter(i => i.status === InvoiceStatus.Overdue)
    .reduce((sum, i) => sum + i.balance, 0)

  // Calculate aging buckets
  const aging = {
    bucket_0_30: 0,
    bucket_31_60: 0,
    bucket_61_90: 0,
    bucket_90_plus: 0
  }

  mockSAPInvoices.forEach(invoice => {
    if (invoice.balance > 0 && invoice.status !== InvoiceStatus.Cancelled) {
      if (invoice.days_overdue === 0) {
        aging.bucket_0_30 += invoice.balance
      } else if (invoice.days_overdue <= 30) {
        aging.bucket_0_30 += invoice.balance
      } else if (invoice.days_overdue <= 60) {
        aging.bucket_31_60 += invoice.balance
      } else if (invoice.days_overdue <= 90) {
        aging.bucket_61_90 += invoice.balance
      } else {
        aging.bucket_90_plus += invoice.balance
      }
    }
  })

  return {
    totalInvoices,
    totalReceivable,
    overdueInvoices,
    overdueAmount,
    aging
  }
}
