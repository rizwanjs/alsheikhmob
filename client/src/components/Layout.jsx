import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingCart, Users, Wrench, Package, Smartphone,
  ClipboardList, Truck, Wallet, Landmark, BarChart3, UserCog, Shield,
  Settings, Database, ClipboardCheck, ChevronLeft, ChevronRight,
  Bell, Sun, Search, LogOut, Menu, X
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const sidebarItems = [
  { section: 'OVERVIEW', items: [{ icon: LayoutDashboard, label: 'Dashboard', path: '/' }] },
  { section: 'SELL', items: [
    { icon: ShoppingCart, label: 'POS / Sales', path: '/pos' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: Wrench, label: 'Repairs', path: '/repairs' },
  ]},
  { section: 'STOCK', items: [
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: Smartphone, label: 'Used Phones', path: '/used-phones' },
    { icon: ClipboardList, label: 'Purchases', path: '/purchases' },
    { icon: Truck, label: 'Suppliers', path: '/suppliers' },
  ]},
  { section: 'MONEY', items: [
    { icon: Wallet, label: 'Expenses', path: '/expenses' },
    { icon: Landmark, label: 'Cash & Bank', path: '/cash-bank' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
  ]},
  { section: 'SYSTEM', items: [
    { icon: UserCog, label: 'Users', path: '/users' },
    { icon: Shield, label: 'Roles', path: '/roles' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Database, label: 'Backup', path: '/backup' },
    { icon: ClipboardCheck, label: 'Activity Log', path: '/activity-log' },
  ]},
]

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden">
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 bg-dark-800 border-r border-dark-600/50 flex flex-col transition-all duration-300
        ${collapsed ? 'w-16' : 'w-64'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        <div className="flex items-center gap-3 px-4 py-4 border-b border-dark-600/50">
          <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-white font-bold text-sm leading-tight">Al Sheikh</h1>
              <p className="text-gray-500 text-xs">Mobiles POS</p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {sidebarItems.map((section, idx) => (
            <div key={idx} className="mb-4">
              {!collapsed && (
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">{section.section}</p>
              )}
              {section.items.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <button key={item.path} onClick={() => { navigate(item.path); setMobileOpen(false) }}
                    className={`w-full sidebar-item mb-0.5 ${isActive ? 'sidebar-item-active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
                    title={collapsed ? item.label : ''}>
                    <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-accent-blue' : ''}`} />
                    {!collapsed && <span className="text-sm">{item.label}</span>}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex items-center justify-center p-3 border-t border-dark-600/50 text-gray-500 hover:text-gray-300">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <button onClick={() => setMobileOpen(false)} className="lg:hidden absolute top-4 right-4 text-gray-400">
          <X className="w-5 h-5" />
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-dark-800/80 backdrop-blur border-b border-dark-600/50 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-gray-400 hover:text-gray-200">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center bg-dark-700 rounded-lg border border-dark-500/50 px-3 py-2 w-80">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input type="text" placeholder="Search products, IMEI, customers..."
                className="bg-transparent border-none outline-none text-sm text-gray-300 w-full placeholder-gray-500" />
              <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs text-gray-500 bg-dark-600 rounded border border-dark-500">Ctrl K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-200 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-red rounded-full"></span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-200">
              <Sun className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-dark-600/50">
              <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <button onClick={logout} className="text-gray-400 hover:text-accent-red transition-colors" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}