'use client'

import { useState, useMemo, ChangeEvent } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { mockSAPDeliveries, getDeliveryStats } from '@/lib/mock-data/sap-deliveries'
import { SAPDelivery } from '@/lib/types/sap'
import { DeliveryStatus } from '@/lib/types/enums'
import DeliveryDetailModal from '@/components/modals/DeliveryDetailModal'
import { Search, RefreshCw, Database, Filter, Truck, CheckCircle2 } from 'lucide-react'

export default function SAPDeliveriesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('all')
  const [lastRefreshed, setLastRefreshed] = useState(new Date())
  const [selectedDelivery, setSelectedDelivery] = useState<SAPDelivery | null>(null)

  const stats = getDeliveryStats()

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value)
  }

  const handleDateRangeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDateRange(e.target.value)
  }

  const handleRefresh = () => {
    setLastRefreshed(new Date())
  }

  const handleRowClick = (delivery: SAPDelivery) => {
    setSelectedDelivery(delivery)
  }

  const handleCloseModal = () => {
    setSelectedDelivery(null)
  }

  const filteredDeliveries = useMemo(() => {
    let filtered = mockSAPDeliveries

    // Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (delivery) =>
          delivery.delivery_no.toLowerCase().includes(lowerQuery) ||
          delivery.order_no.toLowerCase().includes(lowerQuery) ||
          delivery.customer_no.toLowerCase().includes(lowerQuery) ||
          delivery.customer_name.toLowerCase().includes(lowerQuery) ||
          delivery.tracking_no?.toLowerCase().includes(lowerQuery)
      )
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((delivery) => delivery.status === selectedStatus)
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date()
      const daysBack = parseInt(dateRange)
      const cutoffDate = new Date(now)
      cutoffDate.setDate(cutoffDate.getDate() - daysBack)

      filtered = filtered.filter((delivery) => delivery.planned_date >= cutoffDate)
    }

    return filtered
  }, [searchQuery, selectedStatus, dateRange])

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
      case DeliveryStatus.Planned:
        return 'bg-gray-100 text-gray-800'
      case DeliveryStatus.InTransit:
        return 'bg-blue-100 text-blue-800'
      case DeliveryStatus.Delivered:
        return 'bg-green-100 text-green-800'
      case DeliveryStatus.Failed:
        return 'bg-red-100 text-red-800'
      case DeliveryStatus.Cancelled:
        return 'bg-gray-100 text-gray-600'
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
              <h1 className="text-2xl font-semibold text-gray-800">SAP Deliveries & POD</h1>
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
                  <p className="text-xs text-gray-500 uppercase font-medium">Total Deliveries</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalDeliveries}</p>
                </div>
                <Truck className="w-8 h-8 text-primary opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Delivered</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.delivered}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600 opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">In Transit</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{stats.inTransit}</p>
                </div>
                <Truck className="w-8 h-8 text-blue-600 opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">POD Rate</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">{stats.podRate}%</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-purple-600 opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search delivery no, order no, tracking..."
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
                {Object.values(DeliveryStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
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
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredDeliveries.length}</span> of{' '}
            <span className="font-semibold">{mockSAPDeliveries.length}</span> deliveries
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
                      Delivery No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Planned Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actual Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Carrier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      POD
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDeliveries.map((delivery) => (
                    <tr
                      key={delivery.delivery_no}
                      onClick={() => handleRowClick(delivery)}
                      className="hover:bg-primary-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-primary">{delivery.delivery_no}</div>
                        <div className="text-xs text-gray-500">{delivery.tracking_no}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">{delivery.order_no}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{delivery.customer_name}</div>
                        <div className="text-xs text-gray-500">{delivery.customer_no}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(delivery.planned_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {delivery.actual_date ? formatDate(delivery.actual_date) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{delivery.carrier}</div>
                        <div className="text-xs text-gray-500">{delivery.route}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            delivery.status
                          )}`}
                        >
                          {delivery.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {delivery.pod_available ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 inline-block" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDeliveries.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No deliveries found matching your criteria.</p>
              </div>
            )}
          </div>
        </main>

        {/* Delivery Detail Modal */}
        {selectedDelivery && (
          <DeliveryDetailModal
            delivery={selectedDelivery}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </MainLayout>
  )
}
