'use client'

import { useState, useMemo, ChangeEvent } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { mockSAPOrders, getOrderStats } from '@/lib/mock-data/sap-orders'
import { getOrderLines } from '@/lib/mock-data/sap-order-lines'
import { SAPOrderHeader } from '@/lib/types/sap'
import { OrderStatus, DocumentType } from '@/lib/types/enums'
import OrderDetailModal from '@/components/modals/OrderDetailModal'
import { Search, RefreshCw, Database, Filter, Package } from 'lucide-react'

export default function SAPOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedDocType, setSelectedDocType] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('all')
  const [lastRefreshed, setLastRefreshed] = useState(new Date())
  const [selectedOrder, setSelectedOrder] = useState<SAPOrderHeader | null>(null)

  const stats = getOrderStats()

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value)
  }

  const handleDocTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDocType(e.target.value)
  }

  const handleDateRangeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDateRange(e.target.value)
  }

  const handleRefresh = () => {
    setLastRefreshed(new Date())
  }

  const handleRowClick = (order: SAPOrderHeader) => {
    setSelectedOrder(order)
  }

  const handleCloseModal = () => {
    setSelectedOrder(null)
  }

  const filteredOrders = useMemo(() => {
    let filtered = mockSAPOrders

    // Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.order_no.toLowerCase().includes(lowerQuery) ||
          order.customer_no.toLowerCase().includes(lowerQuery) ||
          order.customer_name.toLowerCase().includes(lowerQuery)
      )
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((order) => order.status === selectedStatus)
    }

    // Document type filter
    if (selectedDocType !== 'all') {
      filtered = filtered.filter((order) => order.doc_type === selectedDocType)
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date()
      const daysBack = parseInt(dateRange)
      const cutoffDate = new Date(now)
      cutoffDate.setDate(cutoffDate.getDate() - daysBack)

      filtered = filtered.filter((order) => order.order_date >= cutoffDate)
    }

    return filtered
  }, [searchQuery, selectedStatus, selectedDocType, dateRange])

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
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

  const getStatusColor = (status: string): string => {
    switch (status) {
      case OrderStatus.Open:
        return 'bg-blue-100 text-blue-800'
      case OrderStatus.InProgress:
        return 'bg-yellow-100 text-yellow-800'
      case OrderStatus.Delivered:
        return 'bg-green-100 text-green-800'
      case OrderStatus.Cancelled:
        return 'bg-red-100 text-red-800'
      case OrderStatus.PartiallyDelivered:
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <MainLayout>
      <div>
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">SAP Order History</h1>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <Database className="w-4 h-4 mr-1" />
                <span className="font-medium">Source: SAP</span>
                <span className="mx-2">•</span>
                <span>Last updated: {getTimeSinceUpdate(lastRefreshed)}</span>
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

        {/* Statistics Cards */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
                </div>
                <Package className="w-8 h-8 text-primary opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(stats.totalValue)}
                  </p>
                </div>
                <Package className="w-8 h-8 text-green-600 opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Open Orders</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{stats.openOrders}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600 opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Avg Order Value</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {formatCurrency(stats.averageOrderValue)}
                  </p>
                </div>
                <Package className="w-8 h-8 text-purple-600 opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search order no, customer..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none bg-white text-gray-900"
              >
                <option value="all">All Statuses</option>
                {Object.values(OrderStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Document Type Filter */}
            <div>
              <select
                value={selectedDocType}
                onChange={handleDocTypeChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none bg-white text-gray-900"
              >
                <option value="all">All Document Types</option>
                {Object.values(DocumentType).map((docType) => (
                  <option key={docType} value={docType}>
                    {docType}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <select
                value={dateRange}
                onChange={handleDateRangeChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none bg-white text-gray-900"
              >
                <option value="all">All Time</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="180">Last 6 months</option>
                <option value="365">Last year</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredOrders.length}</span> of{' '}
            <span className="font-semibold">{mockSAPOrders.length}</span> orders
          </div>
        </div>

        {/* Table */}
        <main className="p-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.order_no}
                      onClick={() => handleRowClick(order)}
                      className="hover:bg-primary-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-primary">{order.order_no}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{order.customer_name}</div>
                        <div className="text-xs text-gray-500">{order.customer_no}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(order.order_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          {order.doc_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {order.items_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.net_value)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.delivery_date ? formatDate(order.delivery_date) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No orders found matching your criteria.</p>
              </div>
            )}
          </div>
        </main>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            lines={getOrderLines(selectedOrder.order_no)}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </MainLayout>
  )
}
