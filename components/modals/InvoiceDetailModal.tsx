'use client'

import { useEffect } from 'react'
import { SAPInvoice } from '@/lib/types/sap'
import { InvoiceStatus } from '@/lib/types/enums'
import { X, FileText, Calendar, User, DollarSign, CreditCard, AlertCircle } from 'lucide-react'

interface InvoiceDetailModalProps {
  invoice: SAPInvoice
  onClose: () => void
}

export default function InvoiceDetailModal({ invoice, onClose }: InvoiceDetailModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
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

  const paymentPercentage = (invoice.paid_amount / invoice.amount) * 100

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-primary px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-white" />
              <div>
                <h2 className="text-xl font-semibold text-white">Invoice Details</h2>
                <p className="text-primary-100 text-sm">{invoice.invoice_no}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-primary-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1">
            {/* Invoice Information */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-start space-x-3 mb-4">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-medium text-gray-900">{invoice.customer_name}</p>
                      <p className="text-sm text-gray-500">{invoice.customer_no}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 mb-4">
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Reference Order</p>
                      <p className="font-mono font-medium text-gray-900">
                        {invoice.reference_order || '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Payment Terms</p>
                      <p className="font-medium text-gray-900">{invoice.payment_terms}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start space-x-3 mb-4">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Invoice Date</p>
                      <p className="font-medium text-gray-900">{formatDate(invoice.invoice_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 mb-4">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p className="font-medium text-gray-900">{formatDate(invoice.due_date)}</p>
                    </div>
                  </div>

                  {invoice.days_overdue > 0 && (
                    <div className="flex items-start space-x-3 mb-4">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-red-600">Days Overdue</p>
                        <p className="font-bold text-red-600">{invoice.days_overdue} days</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`inline-block mt-1 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount Summary */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Amount Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Invoice Amount</span>
                  <span className="text-xl font-semibold text-gray-900">
                    {formatCurrency(invoice.amount)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Paid Amount</span>
                  <span className="text-xl font-semibold text-green-600">
                    {formatCurrency(invoice.paid_amount)}
                  </span>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700">Outstanding Balance</span>
                    <span className={`text-2xl font-bold ${invoice.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(invoice.balance)}
                    </span>
                  </div>
                </div>

                {/* Payment Progress Bar */}
                {invoice.amount > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Payment Progress</span>
                      <span>{paymentPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          paymentPercentage === 100 ? 'bg-green-600' :
                          paymentPercentage > 0 ? 'bg-yellow-500' :
                          'bg-gray-300'
                        }`}
                        style={{ width: `${paymentPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Overdue Alert */}
            {invoice.status === InvoiceStatus.Overdue && (
              <div className="p-6 bg-red-50 border-b border-red-100">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-1">
                      Payment Overdue
                    </h3>
                    <p className="text-sm text-red-700">
                      This invoice is {invoice.days_overdue} days past due. Outstanding balance: {formatCurrency(invoice.balance)}
                    </p>
                    <p className="text-sm text-red-600 mt-2">
                      Please contact the customer to arrange payment immediately.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Paid Confirmation */}
            {invoice.status === InvoiceStatus.Paid && (
              <div className="p-6 bg-green-50 border-b border-green-100">
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 mb-1">
                      Paid in Full
                    </h3>
                    <p className="text-sm text-green-700">
                      This invoice has been fully paid. Amount received: {formatCurrency(invoice.paid_amount)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex-shrink-0">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
