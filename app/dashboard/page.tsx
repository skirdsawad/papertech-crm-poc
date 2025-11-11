'use client'

import { useMemo } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { searchSAPCustomers } from '@/lib/mock-data/sap-customers'
import { getAllOrders } from '@/lib/mock-data/sap-orders'
import { getInvoicesByCustomer } from '@/lib/mock-data/sap-invoices'
import { getAllDeliveries } from '@/lib/mock-data/sap-deliveries'
import { OrderStatus, InvoiceStatus, DeliveryStatus } from '@/lib/types/enums'
import { CustomerSegment, Territory } from '@/lib/types/sap'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  PieChart,
  Target,
  Package,
  BarChart3
} from 'lucide-react'

interface DashboardMetrics {
  totalRevenue: number
  totalCustomers: number
  activeOrders: number
  outstandingAR: number
  revenueGrowth: number
  avgOrderValue: number
  totalOrders: number
  completedDeliveries: number
  pendingDeliveries: number
  failedDeliveries: number
  totalInvoices: number
  paidInvoices: number
  overdueInvoices: number
  totalOverdue: number
  segmentBreakdown: Array<{ segment: string; count: number; revenue: number }>
  territoryBreakdown: Array<{ territory: string; count: number; revenue: number }>
  topCustomers: Array<{ customer_no: string; name: string; revenue: number; orders: number }>
}

export default function DashboardPage() {
  const metrics = useMemo((): DashboardMetrics => {
    const customers = searchSAPCustomers('')
    const orders = getAllOrders()
    const deliveries = getAllDeliveries()

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.net_value, 0)

    // Calculate revenue growth (last 3 months vs previous 3 months)
    const now = new Date()
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())

    const recentOrders = orders.filter(o => new Date(o.order_date) >= threeMonthsAgo)
    const previousOrders = orders.filter(o => {
      const orderDate = new Date(o.order_date)

      return orderDate >= sixMonthsAgo && orderDate < threeMonthsAgo
    })

    const recentRevenue = recentOrders.reduce((sum, o) => sum + o.net_value, 0)
    const previousRevenue = previousOrders.reduce((sum, o) => sum + o.net_value, 0)
    const revenueGrowth = previousRevenue > 0
      ? ((recentRevenue - previousRevenue) / previousRevenue) * 100
      : 0

    // Calculate active orders
    const activeOrders = orders.filter(o =>
      o.status === OrderStatus.Open ||
      o.status === OrderStatus.InProgress ||
      o.status === OrderStatus.PartiallyDelivered
    ).length

    // Calculate average order value
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

    // Calculate delivery metrics
    const completedDeliveries = deliveries.filter(d => d.status === DeliveryStatus.Delivered).length
    const pendingDeliveries = deliveries.filter(d =>
      d.status === DeliveryStatus.Planned ||
      d.status === DeliveryStatus.InTransit
    ).length
    const failedDeliveries = deliveries.filter(d => d.status === DeliveryStatus.Failed).length

    // Calculate invoice metrics
    const allInvoices: any[] = []
    let totalOverdue = 0
    let outstandingAR = 0

    customers.forEach(customer => {
      const invoices = getInvoicesByCustomer(customer.customer_no)
      allInvoices.push(...invoices)

      invoices.forEach(inv => {
        outstandingAR += inv.balance

        if (inv.status === InvoiceStatus.Overdue) {
          totalOverdue += inv.balance
        }
      })
    })

    const paidInvoices = allInvoices.filter(inv => inv.status === InvoiceStatus.Paid).length
    const overdueInvoices = allInvoices.filter(inv => inv.status === InvoiceStatus.Overdue).length

    // Calculate segment breakdown
    const segmentMap = new Map<string, { count: number; revenue: number }>()

    customers.forEach(customer => {
      const customerOrders = orders.filter(o => o.customer_no === customer.customer_no)
      const revenue = customerOrders.reduce((sum, o) => sum + o.net_value, 0)

      const existing = segmentMap.get(customer.segment)

      if (existing) {
        existing.count += 1
        existing.revenue += revenue
      } else {
        segmentMap.set(customer.segment, { count: 1, revenue })
      }
    })

    const segmentBreakdown = Array.from(segmentMap.entries())
      .map(([segment, data]) => ({ segment, ...data }))
      .sort((a, b) => b.revenue - a.revenue)

    // Calculate territory breakdown
    const territoryMap = new Map<string, { count: number; revenue: number }>()

    customers.forEach(customer => {
      const customerOrders = orders.filter(o => o.customer_no === customer.customer_no)
      const revenue = customerOrders.reduce((sum, o) => sum + o.net_value, 0)

      const existing = territoryMap.get(customer.territory)

      if (existing) {
        existing.count += 1
        existing.revenue += revenue
      } else {
        territoryMap.set(customer.territory, { count: 1, revenue })
      }
    })

    const territoryBreakdown = Array.from(territoryMap.entries())
      .map(([territory, data]) => ({ territory, ...data }))
      .sort((a, b) => b.revenue - a.revenue)

    // Calculate top customers
    const customerRevenueMap = new Map<string, { name: string; revenue: number; orders: number }>()

    orders.forEach(order => {
      const existing = customerRevenueMap.get(order.customer_no)

      if (existing) {
        existing.revenue += order.net_value
        existing.orders += 1
      } else {
        customerRevenueMap.set(order.customer_no, {
          name: order.customer_name,
          revenue: order.net_value,
          orders: 1
        })
      }
    })

    const topCustomers = Array.from(customerRevenueMap.entries())
      .map(([customer_no, data]) => ({ customer_no, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    return {
      totalRevenue,
      totalCustomers: customers.length,
      activeOrders,
      outstandingAR,
      revenueGrowth,
      avgOrderValue,
      totalOrders: orders.length,
      completedDeliveries,
      pendingDeliveries,
      failedDeliveries,
      totalInvoices: allInvoices.length,
      paidInvoices,
      overdueInvoices,
      totalOverdue,
      segmentBreakdown,
      territoryBreakdown,
      topCustomers
    }
  }, [])

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <MainLayout>
      <div>
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Customer Summary Insights & Analytics</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <BarChart3 className="w-4 h-4" />
              <span>Real-time data from SAP</span>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Revenue */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(metrics.totalRevenue)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {metrics.revenueGrowth >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600" />
                    )}
                    <span className={`text-xs ${
                      metrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metrics.revenueGrowth.toFixed(1)}% (3mo)
                    </span>
                  </div>
                </div>
                <DollarSign className="w-10 h-10 text-primary opacity-50" />
              </div>
            </div>

            {/* Total Customers */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase font-medium">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {metrics.totalCustomers}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Active accounts
                  </p>
                </div>
                <Users className="w-10 h-10 text-blue-600 opacity-50" />
              </div>
            </div>

            {/* Active Orders */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase font-medium">Active Orders</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {metrics.activeOrders}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    of {metrics.totalOrders} total
                  </p>
                </div>
                <ShoppingCart className="w-10 h-10 text-green-600 opacity-50" />
              </div>
            </div>

            {/* Outstanding AR */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase font-medium">Outstanding AR</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(metrics.outstandingAR)}
                  </p>
                  {metrics.totalOverdue > 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      {formatCurrency(metrics.totalOverdue)} overdue
                    </p>
                  )}
                </div>
                <FileText className="w-10 h-10 text-yellow-600 opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-6">
          {/* Revenue & Financial Metrics */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Revenue & Financial Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Order Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Orders</span>
                    <span className="text-sm font-medium text-gray-900">{metrics.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Order Value</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(metrics.avgOrderValue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Orders</span>
                    <span className="text-sm font-medium text-blue-600">{metrics.activeOrders}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Invoice Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Invoices</span>
                    <span className="text-sm font-medium text-gray-900">{metrics.totalInvoices}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Paid</span>
                    <span className="text-sm font-medium text-green-600">{metrics.paidInvoices}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Overdue</span>
                    <span className="text-sm font-medium text-red-600">{metrics.overdueInvoices}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">AR Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Outstanding</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(metrics.outstandingAR)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Overdue Amount</span>
                    <span className="text-sm font-medium text-red-600">
                      {formatCurrency(metrics.totalOverdue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Overdue Ratio</span>
                    <span className={`text-sm font-medium ${
                      metrics.outstandingAR > 0 && (metrics.totalOverdue / metrics.outstandingAR) > 0.3
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}>
                      {metrics.outstandingAR > 0
                        ? ((metrics.totalOverdue / metrics.outstandingAR) * 100).toFixed(1)
                        : '0.0'}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Segmentation */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Customer Segmentation
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* By Segment */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-800">By Business Segment</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {metrics.segmentBreakdown.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">{item.segment}</span>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-gray-900">
                              {formatCurrency(item.revenue)}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">({item.count} customers)</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${(item.revenue / metrics.totalRevenue) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* By Territory */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-800">By Territory</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {metrics.territoryBreakdown.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">{item.territory}</span>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-gray-900">
                              {formatCurrency(item.revenue)}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">({item.count} customers)</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(item.revenue / metrics.totalRevenue) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Performance & Operational Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Top Customers */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Top Customers by Revenue
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Orders</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {metrics.topCustomers.map((customer, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-gray-500 text-xs">{customer.customer_no}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {customer.orders}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                          {formatCurrency(customer.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Operational Metrics */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Operational Metrics
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Delivery Performance */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Delivery Performance</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-600">Completed</span>
                        </div>
                        <span className="text-sm font-medium text-green-600">
                          {metrics.completedDeliveries}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-600">Pending</span>
                        </div>
                        <span className="text-sm font-medium text-blue-600">
                          {metrics.pendingDeliveries}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-gray-600">Failed</span>
                        </div>
                        <span className="text-sm font-medium text-red-600">
                          {metrics.failedDeliveries}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Fulfillment Rate */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Order Fulfillment Rate</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {metrics.totalOrders > 0
                          ? ((metrics.completedDeliveries / metrics.totalOrders) * 100).toFixed(1)
                          : '0.0'}%
                      </span>
                      <span className="text-xs text-gray-500">
                        {metrics.completedDeliveries} of {metrics.totalOrders} orders
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full"
                        style={{
                          width: `${metrics.totalOrders > 0
                            ? (metrics.completedDeliveries / metrics.totalOrders) * 100
                            : 0}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Payment Collection Rate */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Payment Collection Rate</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {metrics.totalInvoices > 0
                          ? ((metrics.paidInvoices / metrics.totalInvoices) * 100).toFixed(1)
                          : '0.0'}%
                      </span>
                      <span className="text-xs text-gray-500">
                        {metrics.paidInvoices} of {metrics.totalInvoices} invoices
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full"
                        style={{
                          width: `${metrics.totalInvoices > 0
                            ? (metrics.paidInvoices / metrics.totalInvoices) * 100
                            : 0}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  )
}
