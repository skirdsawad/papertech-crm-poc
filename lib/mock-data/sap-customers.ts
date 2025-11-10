import { SAPCustomerSnapshot } from '../types/sap'
import customersData from './customers.json'

export const mockSAPCustomers: SAPCustomerSnapshot[] = customersData.map(customer => ({
  ...customer,
  lastUpdated: new Date()
}))

// Helper function to get customer by customer_no
export function getSAPCustomerByNo(customerNo: string): SAPCustomerSnapshot | undefined {
  return mockSAPCustomers.find(c => c.customer_no === customerNo)
}

// Helper function to search customers
export function searchSAPCustomers(query: string): SAPCustomerSnapshot[] {
  const lowerQuery = query.toLowerCase()

  return mockSAPCustomers.filter(c =>
    c.customer_no.toLowerCase().includes(lowerQuery) ||
    c.legal_name.toLowerCase().includes(lowerQuery) ||
    c.tax_id.includes(query)
  )
}
