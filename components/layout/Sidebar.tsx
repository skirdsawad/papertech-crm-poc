'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Home, Users, ShoppingCart, Truck, FileText, PanelLeftClose, PanelLeft, Target, Award } from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
}

interface SidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export default function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="w-6 h-6" />
    }
  ]

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-52'} bg-gray-900 border-r border-gray-800 h-screen flex flex-col transition-all duration-300 fixed left-0 top-0 z-20`} style={{ boxShadow: '4px 0 16px rgba(0, 0, 0, 0.3)' }}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/dashboard">
            <Image
              src="/logo.png"
              alt="C.A.S Paper Logo"
              width={120}
              height={48}
              className="h-auto"
            />
          </Link>
        )}
        {isCollapsed && (
          <Link href="/dashboard" className="mx-auto">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                {item.icon}
                {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            )
          })}
        </div>

        {/* CRM Section */}
        <div className="mt-6">
          {!isCollapsed && (
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              CRM
            </h3>
          )}
          <div className="space-y-1">
            <Link
              href="/membership"
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-3 py-2 rounded-lg transition-colors ${
                pathname.startsWith('/membership')
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              title={isCollapsed ? 'Membership & Loyalty' : undefined}
            >
              <Award className="w-5 h-5" />
              {!isCollapsed && <span className="text-sm font-medium">Membership & Loyalty</span>}
            </Link>
          </div>
        </div>

        {/* ERP Integration Section */}
        <div className="mt-6">
          {!isCollapsed && (
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              ERP Integration
            </h3>
          )}
          <div className="space-y-1">
            <Link
              href="/sap/customers"
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-3 py-2 rounded-lg transition-colors ${
                pathname === '/sap/customers'
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              title={isCollapsed ? 'Customers' : undefined}
            >
              <Users className="w-5 h-5" />
              {!isCollapsed && <span className="text-sm font-medium">Customers</span>}
            </Link>

            <Link
              href="/sap/orders"
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-3 py-2 rounded-lg transition-colors ${
                pathname === '/sap/orders'
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              title={isCollapsed ? 'Orders' : undefined}
            >
              <ShoppingCart className="w-5 h-5" />
              {!isCollapsed && <span className="text-sm font-medium">Orders</span>}
            </Link>

            <Link
              href="/sap/deliveries"
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-3 py-2 rounded-lg transition-colors ${
                pathname === '/sap/deliveries'
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              title={isCollapsed ? 'Deliveries & POD' : undefined}
            >
              <Truck className="w-5 h-5" />
              {!isCollapsed && <span className="text-sm font-medium">Deliveries & POD</span>}
            </Link>

            <Link
              href="/sap/invoices"
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-3 py-2 rounded-lg transition-colors ${
                pathname === '/sap/invoices'
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              title={isCollapsed ? 'Invoices & AR' : undefined}
            >
              <FileText className="w-5 h-5" />
              {!isCollapsed && <span className="text-sm font-medium">Invoices & AR</span>}
            </Link>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mt-6">
          {!isCollapsed && (
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Analytics
            </h3>
          )}
          <div className="space-y-1">
            <Link
              href="/analytics/customer-360"
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-3 py-2 rounded-lg transition-colors ${
                pathname === '/analytics/customer-360'
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              title={isCollapsed ? 'Customer 360°' : undefined}
            >
              <Target className="w-5 h-5" />
              {!isCollapsed && <span className="text-sm font-medium">Customer 360°</span>}
            </Link>
          </div>
        </div>
      </nav>

      {/* Toggle Button */}
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all group"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <PanelLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
          ) : (
            <PanelLeftClose className="w-4 h-4 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>
    </aside>
  )
}
