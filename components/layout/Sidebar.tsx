'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Home, Building2, Users, ShoppingCart, Truck, PanelLeftClose, PanelLeft } from 'lucide-react'

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
    },
    {
      name: 'SAP Customers',
      href: '/sap/customers',
      icon: <Building2 className="w-6 h-6" />
    }
  ]

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 fixed left-0 top-0 z-20`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/dashboard">
            <Image
              src="/logo.png"
              alt="C.A.S Paper Logo"
              width={140}
              height={56}
              className="h-auto"
            />
          </Link>
        )}
        {isCollapsed && (
          <Link href="/dashboard" className="mx-auto">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                {item.icon}
                {!isCollapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            )
          })}
        </div>

        {/* SAP Module Section */}
        <div className="mt-8">
          {!isCollapsed && (
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              ERP Integration
            </h3>
          )}
          <div className="space-y-1">
            <Link
              href="/sap/customers"
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-colors ${
                pathname === '/sap/customers'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title={isCollapsed ? 'Customers' : undefined}
            >
              <Users className="w-5 h-5" />
              {!isCollapsed && <span className="text-sm">Customers</span>}
            </Link>

            <Link
              href="/sap/orders"
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-colors ${
                pathname === '/sap/orders'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title={isCollapsed ? 'Orders' : undefined}
            >
              <ShoppingCart className="w-5 h-5" />
              {!isCollapsed && <span className="text-sm">Orders</span>}
            </Link>

            <Link
              href="/sap/deliveries"
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-colors ${
                pathname === '/sap/deliveries'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title={isCollapsed ? 'Deliveries & POD' : undefined}
            >
              <Truck className="w-5 h-5" />
              {!isCollapsed && <span className="text-sm">Deliveries & POD</span>}
            </Link>
          </div>
        </div>
      </nav>

      {/* Toggle Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-3 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-all group"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <PanelLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
          ) : (
            <PanelLeftClose className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>
    </aside>
  )
}
