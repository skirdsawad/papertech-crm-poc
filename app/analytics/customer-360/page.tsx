'use client'

import { useState, useMemo, ChangeEvent } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { searchSAPCustomers } from '@/lib/mock-data/sap-customers'
import { getOrdersByCustomer } from '@/lib/mock-data/sap-orders'
import { getInvoicesByCustomer } from '@/lib/mock-data/sap-invoices'
import { getAllDeliveries } from '@/lib/mock-data/sap-deliveries'
import { OrderStatus, InvoiceStatus, DeliveryStatus } from '@/lib/types/enums'
import {
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  FileText,
  Truck,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Package,
  Calendar,
  Target,
  Activity,
  Database,
  RefreshCw
} from 'lucide-react'

interface CustomerMetrics {
  totalOrders: number
  totalRevenue: number
  avgOrderValue: number
  totalInvoices: number
  totalPaid: number
  totalOutstanding: number
  overdueAmount: number
  completedDeliveries: number
  pendingDeliveries: number
  avgPaymentDays: number
  orderGrowthRate: number
  topProducts: Array<{ material: string; description: string; quantity: number; revenue: number }>
  recentActivity: Array<{ date: string; type: string; description: string; amount?: number }>
  paymentBehavior: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  creditUtilization: number
}

export default function Customer360Page() {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const customers = useMemo(() => {
    return searchSAPCustomers(searchQuery)
  }, [searchQuery])

  const customerData = useMemo(() => {
    if (!selectedCustomer) {
      return null
    }

    return customers.find(c => c.customer_no === selectedCustomer)
  }, [selectedCustomer, customers])

  const metrics = useMemo((): CustomerMetrics | null => {
    if (!selectedCustomer || !customerData) {
      return null
    }

    const orders = getOrdersByCustomer(selectedCustomer)
    const invoices = getInvoicesByCustomer(selectedCustomer)
    const allDeliveries = getAllDeliveries()
    const deliveries = allDeliveries.filter(d => d.customer_no === selectedCustomer)

    // Calculate total orders and revenue
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.net_value, 0)
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Calculate invoice metrics
    const totalInvoices = invoices.length
    const totalPaid = invoices.reduce((sum, inv) => sum + inv.paid_amount, 0)
    const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balance, 0)
    const overdueAmount = invoices
      .filter(inv => inv.status === InvoiceStatus.Overdue)
      .reduce((sum, inv) => sum + inv.balance, 0)

    // Calculate delivery metrics
    const completedDeliveries = deliveries.filter(d => d.status === DeliveryStatus.Delivered).length
    const pendingDeliveries = deliveries.filter(d =>
      d.status === DeliveryStatus.Planned || d.status === DeliveryStatus.InTransit
    ).length

    // Calculate average payment days
    // For paid invoices, estimate they were paid within payment terms (simulate good payment behavior)
    const paidInvoices = invoices.filter(inv => inv.status === InvoiceStatus.Paid)
    const avgPaymentDays = paidInvoices.length > 0
      ? paidInvoices.reduce((sum, inv) => {
          const invoiceDate = new Date(inv.invoice_date)
          const dueDate = new Date(inv.due_date)
          const termDays = Math.floor((dueDate.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24))
          // Estimate paid invoices were paid at 70-95% of payment term
          const estimatedPaymentDays = Math.floor(termDays * (0.7 + Math.random() * 0.25))

          return sum + estimatedPaymentDays
        }, 0) / paidInvoices.length
      : 0

    // Calculate order growth rate
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
    const orderGrowthRate = previousRevenue > 0
      ? ((recentRevenue - previousRevenue) / previousRevenue) * 100
      : 0

    // Calculate top products
    const productMap = new Map<string, { description: string; quantity: number; revenue: number }>()

    orders.forEach(order => {
      const productKey = `PROD-${order.order_no.substring(0, 6)}`
      const existing = productMap.get(productKey)

      if (existing) {
        existing.quantity += order.items_count
        existing.revenue += order.net_value
      } else {
        productMap.set(productKey, {
          description: `Paper Product ${productKey}`,
          quantity: order.items_count,
          revenue: order.net_value
        })
      }
    })

    const topProducts = Array.from(productMap.entries())
      .map(([material, data]) => ({ material, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Build recent activity timeline
    const recentActivity: Array<{ date: string; type: string; description: string; amount?: number }> = []

    orders.slice(0, 10).forEach(order => {
      recentActivity.push({
        date: order.order_date.toISOString(),
        type: 'order',
        description: `Order ${order.order_no}`,
        amount: order.net_value
      })
    })

    invoices.slice(0, 10).forEach(invoice => {
      recentActivity.push({
        date: invoice.invoice_date,
        type: 'invoice',
        description: `Invoice ${invoice.invoice_no}`,
        amount: invoice.amount
      })
    })

    deliveries.slice(0, 10).forEach(delivery => {
      if (delivery.actual_date) {
        recentActivity.push({
          date: delivery.actual_date.toISOString(),
          type: 'delivery',
          description: `Delivery ${delivery.delivery_no}`
        })
      }
    })

    recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const limitedActivity = recentActivity.slice(0, 15)

    // Determine payment behavior
    let paymentBehavior: 'Excellent' | 'Good' | 'Fair' | 'Poor'

    // Calculate overdue ratio relative to total invoice amount, not just outstanding
    const totalInvoiceAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0)
    const overdueRatio = totalInvoiceAmount > 0 ? overdueAmount / totalInvoiceAmount : 0

    // Payment behavior scoring based on overdue ratio and payment speed
    if (overdueRatio === 0 && avgPaymentDays <= 30) {
      paymentBehavior = 'Excellent'
    } else if (overdueRatio < 0.05 && avgPaymentDays <= 35) {
      paymentBehavior = 'Excellent'
    } else if (overdueRatio < 0.15 && avgPaymentDays <= 45) {
      paymentBehavior = 'Good'
    } else if (overdueRatio < 0.25 && avgPaymentDays <= 50) {
      paymentBehavior = 'Good'
    } else if (overdueRatio < 0.40 && avgPaymentDays <= 60) {
      paymentBehavior = 'Fair'
    } else if (overdueRatio < 0.50 || avgPaymentDays <= 70) {
      paymentBehavior = 'Fair'
    } else {
      paymentBehavior = 'Poor'
    }

    // Calculate credit utilization
    const creditUtilization = customerData.credit_limit > 0
      ? (customerData.credit_exposure / customerData.credit_limit) * 100
      : 0

    return {
      totalOrders,
      totalRevenue,
      avgOrderValue,
      totalInvoices,
      totalPaid,
      totalOutstanding,
      overdueAmount,
      completedDeliveries,
      pendingDeliveries,
      avgPaymentDays,
      orderGrowthRate,
      topProducts,
      recentActivity: limitedActivity,
      paymentBehavior,
      creditUtilization
    }
  }, [selectedCustomer, customerData])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleCustomerSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCustomer(e.target.value)
  }

  const handleRefresh = () => {
    setLastUpdated(new Date())
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getTimeSinceUpdate = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    if (seconds < 60) {
      return `${seconds} seconds ago`
    }

    const minutes = Math.floor(seconds / 60)

    if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    }

    const hours = Math.floor(minutes / 60)

    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }

  return (
    <MainLayout>
      <div>
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Customer 360° Analytics</h1>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <Database className="w-4 h-4 mr-1" />
                <span className="font-medium">Source: SAP</span>
                <span className="mx-2">•</span>
                <span>Last updated: {getTimeSinceUpdate(lastUpdated)}</span>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh from SAP</span>
            </button>
          </div>
        </div>

        {/* Customer Selection */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by name, customer number, or tax ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="relative">
              <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCustomer}
                onChange={handleCustomerSelect}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none bg-white text-gray-900"
              >
                <option value="">-- Select a customer --</option>
                {customers.map(customer => (
                  <option key={customer.customer_no} value={customer.customer_no}>
                    {customer.customer_no} - {customer.legal_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedCustomer && customerData && (
            <div className="mt-3 text-sm text-gray-600">
              Analyzing customer: <span className="font-semibold">{customerData.legal_name}</span>
            </div>
          )}
        </div>

        {/* Key Metrics Statistics */}
        {customerData && metrics && (
          <>
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {formatCurrency(metrics.totalRevenue)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {metrics.orderGrowthRate >= 0 ? (
                          <TrendingUp className="w-3 h-3 text-green-600" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-600" />
                        )}
                        <span className={`text-xs ${
                          metrics.orderGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metrics.orderGrowthRate.toFixed(1)}% (3mo)
                        </span>
                      </div>
                    </div>
                    <DollarSign className="w-8 h-8 text-primary opacity-50" />
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.totalOrders}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Avg: {formatCurrency(metrics.avgOrderValue)}
                      </p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-green-600 opacity-50" />
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium">Outstanding</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {formatCurrency(metrics.totalOutstanding)}
                      </p>
                      {metrics.overdueAmount > 0 && (
                        <p className="text-xs text-red-600 mt-1">
                          {formatCurrency(metrics.overdueAmount)} overdue
                        </p>
                      )}
                    </div>
                    <FileText className="w-8 h-8 text-yellow-600 opacity-50" />
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium">Payment Rating</p>
                      <p className={`text-2xl font-bold mt-1 ${
                        metrics.paymentBehavior === 'Excellent' ? 'text-green-600' :
                        metrics.paymentBehavior === 'Good' ? 'text-blue-600' :
                        metrics.paymentBehavior === 'Fair' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {metrics.paymentBehavior}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Avg: {metrics.avgPaymentDays.toFixed(0)} days
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-600 opacity-50" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <main className="p-6">
              {/* Customer Overview */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Overview</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Basic Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Legal Name</span>
                        <span className="text-sm font-medium text-gray-900">{customerData.legal_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Customer No</span>
                        <span className="text-sm font-medium text-gray-900">{customerData.customer_no}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tax ID</span>
                        <span className="text-sm font-medium text-gray-900">{customerData.tax_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Segment</span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                          {customerData.segment}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Territory</span>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                          {customerData.territory}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Credit & Payment</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Credit Limit</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(customerData.credit_limit)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Credit Available</span>
                        <span className="text-sm font-medium text-green-600">
                          {formatCurrency(customerData.credit_available)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Payment Terms</span>
                        <span className="text-sm font-medium text-gray-900">{customerData.payment_terms}</span>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Credit Utilization</span>
                          <span className={`text-sm font-medium ${
                            metrics.creditUtilization > 90 ? 'text-red-600' :
                            metrics.creditUtilization > 70 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {metrics.creditUtilization.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              metrics.creditUtilization > 90 ? 'bg-red-600' :
                              metrics.creditUtilization > 70 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(metrics.creditUtilization, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* AR Aging */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">AR Aging Breakdown</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">0-30 days</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(customerData.overdue_aging.bucket_0_30)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">31-60 days</span>
                      <span className="text-sm font-medium text-yellow-600">
                        {formatCurrency(customerData.overdue_aging.bucket_31_60)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">61-90 days</span>
                      <span className="text-sm font-medium text-orange-600">
                        {formatCurrency(customerData.overdue_aging.bucket_61_90)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">90+ days</span>
                      <span className="text-sm font-medium text-red-600">
                        {formatCurrency(customerData.overdue_aging.bucket_90_plus)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Performance */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Performance</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completed Deliveries</span>
                      <span className="text-sm font-medium text-green-600">
                        {metrics.completedDeliveries}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending Deliveries</span>
                      <span className="text-sm font-medium text-blue-600">
                        {metrics.pendingDeliveries}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Invoices</span>
                      <span className="text-sm font-medium text-gray-900">
                        {metrics.totalInvoices}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Paid</span>
                      <span className="text-sm font-medium text-green-600">
                        {formatCurrency(metrics.totalPaid)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Top Products by Revenue</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {metrics.topProducts.map((product, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                            {product.material}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {product.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            {product.quantity.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                            {formatCurrency(product.revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Activity Timeline */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Recent Activity Timeline</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {metrics.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                        <div className="flex-shrink-0 mt-1">
                          {activity.type === 'order' && (
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <ShoppingCart className="w-4 h-4 text-blue-600" />
                            </div>
                          )}
                          {activity.type === 'invoice' && (
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                              <FileText className="w-4 h-4 text-yellow-600" />
                            </div>
                          )}
                          {activity.type === 'delivery' && (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.description}
                            </p>
                            {activity.amount && (
                              <span className="text-sm font-semibold text-gray-900">
                                {formatCurrency(activity.amount)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {formatDate(activity.date)}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              activity.type === 'order' ? 'bg-blue-50 text-blue-600' :
                              activity.type === 'invoice' ? 'bg-yellow-50 text-yellow-600' :
                              'bg-green-50 text-green-600'
                            }`}>
                              {activity.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>
          </>
        )}

        {/* Empty State */}
        {!selectedCustomer && (
          <main className="p-6">
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a Customer to View Analytics
              </h3>
              <p className="text-gray-600">
                Choose a customer from the dropdown above to see comprehensive insights, transaction history, and behavioral analytics.
              </p>
            </div>
          </main>
        )}
      </div>
    </MainLayout>
  )
}
