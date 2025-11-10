'use client'

import { useEffect } from 'react'
import { SAPDelivery } from '@/lib/types/sap'
import { X, Truck, Calendar, User, FileText, CheckCircle2, Image as ImageIcon, PenTool } from 'lucide-react'

interface DeliveryDetailModalProps {
  delivery: SAPDelivery
  onClose: () => void
}

export default function DeliveryDetailModal({ delivery, onClose }: DeliveryDetailModalProps) {
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const totalOrdered = delivery.items?.reduce((sum, item) => sum + item.qty_ordered, 0) || 0
  const totalShipped = delivery.items?.reduce((sum, item) => sum + item.qty_shipped, 0) || 0

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Truck className="w-6 h-6 text-white" />
              <div>
                <h2 className="text-xl font-semibold text-white">Delivery Details</h2>
                <p className="text-primary-100 text-sm">{delivery.delivery_no}</p>
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
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Delivery Information */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-start space-x-3 mb-4">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-medium text-gray-900">{delivery.customer_name}</p>
                      <p className="text-sm text-gray-500">{delivery.customer_no}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 mb-4">
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Order Number</p>
                      <p className="font-mono font-medium text-gray-900">{delivery.order_no}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Carrier & Route</p>
                      <p className="font-medium text-gray-900">{delivery.carrier}</p>
                      <p className="text-sm text-gray-500">{delivery.route}</p>
                      {delivery.tracking_no && (
                        <p className="text-xs text-gray-400 mt-1">Tracking: {delivery.tracking_no}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start space-x-3 mb-4">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Planned Date</p>
                      <p className="font-medium text-gray-900">{formatDate(delivery.planned_date)}</p>
                    </div>
                  </div>

                  {delivery.actual_date && (
                    <div className="flex items-start space-x-3 mb-4">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Actual Delivery Date</p>
                        <p className="font-medium text-gray-900">{formatDate(delivery.actual_date)}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`inline-block mt-1 px-3 py-1 text-sm font-medium rounded-full ${
                        delivery.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        delivery.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                        delivery.status === 'Planned' ? 'bg-gray-100 text-gray-800' :
                        delivery.status === 'Failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {delivery.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Items */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Items</h3>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Line
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Material
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Description
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Ordered
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Shipped
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {delivery.items?.map((item) => (
                      <tr key={item.line_no} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {item.line_no}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-mono font-medium text-primary">
                            {item.material_code}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{item.description_thai}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <div className="text-sm font-medium text-gray-900">{item.qty_ordered}</div>
                          <div className="text-xs text-gray-500">{item.uom}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <div className={`text-sm font-medium ${
                            item.qty_shipped === item.qty_ordered ? 'text-green-600' :
                            item.qty_shipped > 0 ? 'text-yellow-600' : 'text-gray-400'
                          }`}>
                            {item.qty_shipped}
                          </div>
                          <div className="text-xs text-gray-500">{item.uom}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right font-medium text-gray-700">
                        Total
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="text-sm font-bold text-gray-900">{totalOrdered}</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="text-sm font-bold text-gray-900">{totalShipped}</div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Proof of Delivery (POD) */}
            {delivery.pod_available && delivery.pod && (
              <div className="p-6 bg-green-50">
                <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Proof of Delivery
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* POD Information */}
                  <div className="space-y-4">
                    {delivery.pod.received_by && (
                      <div className="flex items-start space-x-3">
                        <User className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-green-700">Received By</p>
                          <p className="font-medium text-green-900">{delivery.pod.received_by}</p>
                        </div>
                      </div>
                    )}

                    {delivery.pod.received_date && (
                      <div className="flex items-start space-x-3">
                        <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-green-700">Received Date</p>
                          <p className="font-medium text-green-900">
                            {formatDate(delivery.pod.received_date)}
                          </p>
                        </div>
                      </div>
                    )}

                    {delivery.pod.notes && (
                      <div className="flex items-start space-x-3">
                        <FileText className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-green-700">Notes</p>
                          <p className="font-medium text-green-900">{delivery.pod.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* POD Attachments */}
                  <div className="space-y-4">
                    {delivery.pod.signature_url && (
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <PenTool className="w-4 h-4 text-green-600" />
                          <p className="text-sm font-medium text-green-700">Signature</p>
                        </div>
                        <div className="border-2 border-green-200 rounded-lg p-4 bg-white">
                          <div className="flex items-center justify-center h-32 bg-gray-50 rounded">
                            <p className="text-gray-500 text-sm">Signature image placeholder</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {delivery.pod.photo_url && (
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <ImageIcon className="w-4 h-4 text-green-600" />
                          <p className="text-sm font-medium text-green-700">Delivery Photo</p>
                        </div>
                        <div className="border-2 border-green-200 rounded-lg p-4 bg-white">
                          <div className="flex items-center justify-center h-32 bg-gray-50 rounded">
                            <p className="text-gray-500 text-sm">Photo placeholder</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
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
