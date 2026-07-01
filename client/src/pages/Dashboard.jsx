import React from 'react'
import { useQuery } from 'react-query'
import { ShoppingCart, TrendingUp, Package, Users, Wrench, Plus, Smartphone, ClipboardList, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../lib/api'

function StatCard({ icon: Icon, label, value, iconColor, iconBg }) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: stats, isLoading } = useQuery('dashboard-stats', () => api.get('/reports/dashboard').then(res => res.data))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, Al Sheikh Mobiles</h1>
          <p className="text-gray-500 mt-1">Here's what's happening in your shop today.</p>
        </div>
        <button onClick={() => navigate('/pos')} className="btn-primary">
          <Plus className="w-4 h-4" /> New Sale
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={ShoppingCart} label="Today's Sales" value={`Rs ${stats?.todaySales?.toLocaleString() || 0}`} iconColor="text-accent-blue" iconBg="bg-accent-blue/10" />
        <StatCard icon={TrendingUp} label="Today's Profit" value={`Rs ${stats?.todayProfit?.toLocaleString() || 0}`} iconColor="text-accent-green" iconBg="bg-accent-green/10" />
        <StatCard icon={ClipboardList} label="Today's Purchases" value={`Rs ${stats?.todayPurchases?.toLocaleString() || 0}`} iconColor="text-gray-400" iconBg="bg-dark-600" />
        <StatCard icon={Package} label="Inventory Value" value={`Rs ${stats?.inventoryValue?.toLocaleString() || 0}`} iconColor="text-accent-purple" iconBg="bg-accent-purple/10" />
        <StatCard icon={Users} label="Customers" value={stats?.totalCustomers || 0} iconColor="text-gray-400" iconBg="bg-dark-600" />
        <StatCard icon={Wrench} label="Pending Repairs" value={stats?.pendingRepairs || 0} iconColor="text-accent-yellow" iconBg="bg-accent-yellow/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold text-white mb-4">Sales & profit — last 30 days</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3d" />
                <XAxis dataKey="date" stroke="#5a5a7a" fontSize={12} />
                <YAxis stroke="#5a5a7a" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid #2d2d3d', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => navigate('/pos')} className="btn-secondary justify-center flex-col py-4">
                <ShoppingCart className="w-5 h-5 mb-1" /> New Sale
              </button>
              <button onClick={() => navigate('/used-phones')} className="btn-secondary justify-center flex-col py-4">
                <Smartphone className="w-5 h-5 mb-1" /> Used Phone
              </button>
              <button onClick={() => navigate('/purchases')} className="btn-secondary justify-center flex-col py-4">
                <ClipboardList className="w-5 h-5 mb-1" /> Purchase
              </button>
              <button onClick={() => navigate('/repairs')} className="btn-secondary justify-center flex-col py-4">
                <Wrench className="w-5 h-5 mb-1" /> Repair
              </button>
              <button onClick={() => navigate('/expenses')} className="btn-secondary justify-center flex-col py-4 col-span-2">
                <Package className="w-5 h-5 mb-1" /> Expense
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-3">Needs Attention</h3>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-accent-yellow" />
                <span className="text-sm text-gray-400">Low stock items</span>
              </div>
              <span className="text-white font-semibold">{stats?.lowStock || 0}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-accent-red" />
                <span className="text-sm text-gray-400">Out of stock</span>
              </div>
              <span className="text-white font-semibold">{stats?.outOfStock || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}