'use client'

import { useState, useMemo, ChangeEvent } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { mockSAPCustomers } from '@/lib/mock-data/sap-customers'
import { SAPCustomerSnapshot, CustomerSegment, Territory } from '@/lib/types/sap'
import { Search, RefreshCw, Database, Filter } from 'lucide-react'

export default function SAPCustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSegment, setSelectedSegment] = useState<string>('all')
  const [selectedTerritory, setSelectedTerritory] = useState<string>('all')
  const [lastRefreshed, setLastRefreshed] = useState(new Date())

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSegmentChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedSegment(e.target.value)
  }

  const handleTerritoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTerritory(e.target.value)
  }

  const handleRefresh = () => {
    setLastRefreshed(new Date())
  }

  const filteredCustomers = useMemo(() => {
    let filtered = mockSAPCustomers

    // Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (customer) =>
          customer.customer_no.toLowerCase().includes(lowerQuery) ||
          customer.legal_name.toLowerCase().includes(lowerQuery) ||
          customer.tax_id.includes(searchQuery)
      )
    }

    // Segment filter
    if (selectedSegment !== 'all') {
      filtered = filtered.filter((customer) => customer.segment === selectedSegment)
    }

    // Territory filter
    if (selectedTerritory !== 'all') {
      filtered = filtered.filter((customer) => customer.territory === selectedTerritory)
    }

    return filtered
  }, [searchQuery, selectedSegment, selectedTerritory])

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDateTime = (date: Date): string => {
    return new Intl.DateTimeFormat('th-TH', {
      dateStyle: 'medium',
      timeStyle: 'short'
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

  return (
    <MainLayout>
      <div>
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">SAP Customers</h1>
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

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by customer no, name, or tax ID..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Segment Filter */}
            <div className="w-full md:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedSegment}
                  onChange={handleSegmentChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none bg-white text-gray-900"
                >
                  <option value="all">All Segments</option>
                  {Object.values(CustomerSegment).map((segment) => (
                    <option key={segment} value={segment}>
                      {segment}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Territory Filter */}
            <div className="w-full md:w-48">
              <select
                value={selectedTerritory}
                onChange={handleTerritoryChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none bg-white text-gray-900"
              >
                <option value="all">All Territories</option>
                {Object.values(Territory).map((territory) => (
                  <option key={territory} value={territory}>
                    {territory}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredCustomers.length}</span> of{' '}
            <span className="font-semibold">{mockSAPCustomers.length}</span> customers
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
                      Customer No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Legal Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Segment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Territory
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credit Limit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Available Credit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Terms
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => {
                    const hasOverdue =
                      customer.overdue_aging.bucket_61_90 > 0 ||
                      customer.overdue_aging.bucket_90_plus > 0

                    return (
                      <tr
                        key={customer.customer_no}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-primary">
                            {customer.customer_no}
                          </div>
                          <div className="text-xs text-gray-500">{customer.tax_id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{customer.legal_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {customer.segment}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.territory}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(customer.credit_limit)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(customer.credit_available)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.round((customer.credit_available / customer.credit_limit) * 100)}%
                            available
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.payment_terms}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {hasOverdue ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Overdue
                            </span>
                          ) : (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Good
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredCustomers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No customers found matching your criteria.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </MainLayout>
  )
}
