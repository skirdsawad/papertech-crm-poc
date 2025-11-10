'use client'

import { useState, useMemo, ChangeEvent } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { mockSAPInvoices, getInvoiceStats } from '@/lib/mock-data/sap-invoices'
import { SAPInvoice } from '@/lib/types/sap'
import { InvoiceStatus } from '@/lib/types/enums'
import InvoiceDetailModal from '@/components/modals/InvoiceDetailModal'
import { Search, RefreshCw, Database, Filter, FileText, AlertCircle, DollarSign, TrendingUp } from 'lucide-react'

export default function SAPInvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [agingFilter, setAgingFilter] = useState<string>('all')
  const [lastRefreshed, setLastRefreshed] = useState(new Date())
  const [selectedInvoice, setSelectedInvoice] = useState<SAPInvoice | null>(null)

  const stats = getInvoiceStats()

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value)
  }

  const handleAgingFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setAgingFilter(e.target.value)
  }

  const handleRefresh = () => {
    setLastRefreshed(new Date())
  }

  const handleRowClick = (invoice: SAPInvoice) => {
    setSelectedInvoice(invoice)
  }

  const handleCloseModal = () => {
    setSelectedInvoice(null)
  }

  const filteredInvoices = useMemo(() => {
    let filtered = mockSAPInvoices

    // Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()

      filtered = filtered.filter(
        (invoice) =>
          invoice.invoice_no.toLowerCase().includes(lowerQuery) ||
          invoice.customer_no.toLowerCase().includes(lowerQuery) ||
          invoice.customer_name.toLowerCase().includes(lowerQuery) ||
          invoice.reference_order?.toLowerCase().includes(lowerQuery)
      )
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((invoice) => invoice.status === selectedStatus)
    }

    // Aging filter
    if (agingFilter !== 'all') {
      filtered = filtered.filter((invoice) => {
        if (agingFilter === '0-30') {
          return invoice.days_overdue <= 30
        }

        if (agingFilter === '31-60') {
          return invoice.days_overdue > 30 && invoice.days_overdue <= 60
        }

        if (agingFilter === '61-90') {
          return invoice.days_overdue > 60 && invoice.days_overdue <= 90
        }

        if (agingFilter === '90+') {
          return invoice.days_overdue > 90
        }

        return true
      })
    }

    return filtered
  }, [searchQuery, selectedStatus, agingFilter])

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2
    }).format(amount)
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
      case InvoiceStatus.Open:
        return 'bg-blue-100 text-blue-800'
      case InvoiceStatus.Paid:
        return 'bg-green-100 text-green-800'
      case InvoiceStatus.Overdue:
        return 'bg-red-100 text-red-800'
      case InvoiceStatus.PartiallyPaid:
        return 'bg-yellow-100 text-yellow-800'
      case InvoiceStatus.Cancelled:
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
              <h1 className="text-2xl font-semibold text-gray-800">Invoices & AR Aging</h1>
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
                  <p className="text-xs text-gray-500 uppercase font-medium">Total Receivable</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(stats.totalReceivable)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-primary opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Overdue Amount</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {formatCurrency(stats.overdueAmount)}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600 opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Total Invoices</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalInvoices}</p>
                </div>
                <FileText className="w-8 h-8 text-primary opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Overdue Invoices</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{stats.overdueInvoices}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-600 opacity-50" />
              </div>
            </div>
          </div>

          {/* AR Aging Buckets */}
          <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">AR Aging Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">0-30 Days</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(stats.aging.bucket_0_30)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">31-60 Days</p>
                <p className="text-lg font-semibold text-yellow-600">
                  {formatCurrency(stats.aging.bucket_31_60)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">61-90 Days</p>
                <p className="text-lg font-semibold text-orange-600">
                  {formatCurrency(stats.aging.bucket_61_90)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">90+ Days</p>
                <p className="text-lg font-semibold text-red-600">
                  {formatCurrency(stats.aging.bucket_90_plus)}
                </p>
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
                placeholder="Search invoice no, customer, order..."
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
                {Object.values(InvoiceStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Aging Filter */}
            <div>
              <select
                value={agingFilter}
                onChange={handleAgingFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none bg-white text-gray-900"
              >
                <option value="all">All Aging Periods</option>
                <option value="0-30">0-30 Days</option>
                <option value="31-60">31-60 Days</option>
                <option value="61-90">61-90 Days</option>
                <option value="90+">90+ Days</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredInvoices.length}</span> of{' '}
            <span className="font-semibold">{mockSAPInvoices.length}</span> invoices
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
                      Invoice No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days Overdue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice.invoice_no}
                      onClick={() => handleRowClick(invoice)}
                      className="hover:bg-primary-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-primary">{invoice.invoice_no}</div>
                        <div className="text-xs text-gray-500">{invoice.reference_order}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{invoice.customer_name}</div>
                        <div className="text-xs text-gray-500">{invoice.customer_no}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(invoice.invoice_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(invoice.due_date)}</div>
                        <div className="text-xs text-gray-500">{invoice.payment_terms}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div
                          className={`text-sm font-bold ${
                            invoice.balance > 0 ? 'text-red-600' : 'text-green-600'
                          }`}
                        >
                          {formatCurrency(invoice.balance)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {invoice.days_overdue > 0 ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            {invoice.days_overdue}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            invoice.status
                          )}`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredInvoices.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No invoices found matching your criteria.</p>
              </div>
            )}
          </div>
        </main>

        {/* Invoice Detail Modal */}
        {selectedInvoice && (
          <InvoiceDetailModal
            invoice={selectedInvoice}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </MainLayout>
  )
}
