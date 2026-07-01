import React from 'react'
import { useQuery } from 'react-query'
import { BarChart3, TrendingUp, ShoppingCart, Package } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import api from '../lib/api'

export default function Reports() {
  const { data: stats } = useQuery('dashboard-stats', () => api.get('/reports/dashboard').then(res => res.data))

  const pieData = [
    { name: 'Sales', value: stats?.todaySales || 0, color: '#3b82f6' },
    { name: 'Purchases', value: stats?.todayPurchases || 0, color: '#f59e0b' },
    { name: 'Expenses', value: 0, color: '#ef4444' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Reports</h1>
        <p className="text-gray-500 mt-1">Business analytics and insights.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Total Sales</span><ShoppingCart className="w-4 h-4 text-accent-blue" /></div>
          <p className="text-2xl font-bold text-white">Rs {stats?.todaySales?.toLocaleString() || 0}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Total Profit</span><TrendingUp className="w-4 h-4 text-accent-green" /></div>
          <p className="text-2xl font-bold text-white">Rs {stats?.todayProfit?.toLocaleString() || 0}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Inventory Value</span><Package className="w-4 h-4 text-accent-purple" /></div>
          <p className="text-2xl font-bold text-white">Rs {stats?.inventoryValue?.toLocaleString() || 0}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Customers</span><BarChart3 className="w-4 h-4 text-gray-400" /></div>
          <p className="text-2xl font-bold text-white">{stats?.totalCustomers || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Sales Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.chartData?.slice(-7) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3d" />
                <XAxis dataKey="date" stroke="#5a5a7a" fontSize={12} />
                <YAxis stroke="#5a5a7a" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid #2d2d3d', borderRadius: '8px' }} />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid #2d2d3d', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-400">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}