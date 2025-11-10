'use client'

import MainLayout from '@/components/layout/MainLayout'
import { CheckCircle } from 'lucide-react'

export default function DashboardPage() {

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to PaperTech CRM!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              You have successfully logged in to the POC application.
            </p>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-primary-800 mb-3">
                Available Features
              </h3>
              <ul className="text-left space-y-2 text-sm text-primary-700">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>SAP Customers (View customer data from ERP)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Account & Contact 360 (Coming Soon)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Lead & Opportunity Management (Coming Soon)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Activities & Visit Planning (Coming Soon)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Campaign Management & CSR Projects (Coming Soon)</span>
                </li>
              </ul>
            </div>

            <p className="text-sm text-gray-500">
              This is a proof-of-concept application. All data is stored in-memory
              and will be reset on page refresh.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
