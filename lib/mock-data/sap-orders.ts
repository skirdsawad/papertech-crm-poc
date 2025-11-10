import { SAPOrderHeader } from '../types/sap'
import { OrderStatus, DocumentType } from '../types/enums'
import { mockSAPCustomers } from './sap-customers'

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomEnum<T extends object>(enumObj: T): T[keyof T] {
  const values = Object.values(enumObj) as T[keyof T][]

  return values[randomNumber(0, values.length - 1)]
}

function generateOrderNo(index: number): string {
  return `SO${String(index + 1).padStart(7, '0')}`
}

function getRandomDate(daysBack: number): Date {
  const now = new Date()
  const randomDays = randomNumber(0, daysBack)
  const date = new Date(now)
  date.setDate(date.getDate() - randomDays)

  return date
}

function getDeliveryDate(orderDate: Date, status: string): Date | undefined {
  if (status === OrderStatus.Cancelled) {
    return undefined
  }

  const deliveryDate = new Date(orderDate)
  deliveryDate.setDate(deliveryDate.getDate() + randomNumber(7, 21))

  return deliveryDate
}

// Generate 200 orders distributed across customers
const generateOrders = (): SAPOrderHeader[] => {
  const orders: SAPOrderHeader[] = []

  for (let i = 0; i < 200; i++) {
    const customer = mockSAPCustomers[randomNumber(0, mockSAPCustomers.length - 1)]
    const orderDate = getRandomDate(365) // Orders within last year
    const status = randomEnum(OrderStatus)
    const docType = randomEnum(DocumentType)
    const itemsCount = randomNumber(1, 15)
    const netValue = randomNumber(50000, 5000000)

    orders.push({
      order_no: generateOrderNo(i),
      order_date: orderDate,
      doc_type: docType,
      net_value: netValue,
      status: status,
      customer_no: customer.customer_no,
      customer_name: customer.legal_name,
      delivery_date: getDeliveryDate(orderDate, status),
      items_count: itemsCount
    })
  }

  // Sort by order date descending (newest first)
  return orders.sort((a, b) => b.order_date.getTime() - a.order_date.getTime())
}

export const mockSAPOrders: SAPOrderHeader[] = generateOrders()

// Helper function to get orders by customer
export function getOrdersByCustomer(customerNo: string): SAPOrderHeader[] {
  return mockSAPOrders.filter(order => order.customer_no === customerNo)
}

// Helper function to search orders
export function searchOrders(query: string): SAPOrderHeader[] {
  const lowerQuery = query.toLowerCase()

  return mockSAPOrders.filter(order =>
    order.order_no.toLowerCase().includes(lowerQuery) ||
    order.customer_no.toLowerCase().includes(lowerQuery) ||
    order.customer_name.toLowerCase().includes(lowerQuery)
  )
}

// Helper function to get order statistics
export function getOrderStats() {
  const totalOrders = mockSAPOrders.length
  const totalValue = mockSAPOrders.reduce((sum, order) => sum + order.net_value, 0)
  const openOrders = mockSAPOrders.filter(o => o.status === OrderStatus.Open).length
  const deliveredOrders = mockSAPOrders.filter(o => o.status === OrderStatus.Delivered).length

  return {
    totalOrders,
    totalValue,
    openOrders,
    deliveredOrders,
    averageOrderValue: totalValue / totalOrders
  }
}
