import { SAPOrderHeader } from '../types/sap'
import { OrderStatus } from '../types/enums'
import ordersData from './orders.json'

export const mockSAPOrders: SAPOrderHeader[] = ordersData.map(order => ({
  ...order,
  order_date: new Date(order.order_date),
  delivery_date: order.delivery_date ? new Date(order.delivery_date) : undefined
}))

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
