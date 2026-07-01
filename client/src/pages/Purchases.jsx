import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Plus, Search, ClipboardList, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react'
import api from '../lib/api'

export default function Purchases() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ reference: '', supplier: '', items: [], subtotal: 0, discount: 0, tax: 0, total: 0, paid: 0, notes: '' })
  const queryClient = useQueryClient()

  const { data: purchases } = useQuery(['purchases', search, status], () =>
    api.get(`/purchases?search=${search}&status=${status}`).then(res => res.data), { keepPreviousData: true }
  )

  const { data: suppliers } = useQuery('suppliers', () => api.get('/suppliers').then(res => res.data))
  const { data: products } = useQuery('products-list', () => api.get('/products').then(res => res.data))

  const createPurchase = useMutation((data) => api.post('/purchases', data), {
    onSuccess: () => { queryClient.invalidateQueries('purchases'); setShowModal(false) }
  })

  const stats = {
    totalPayable: purchases?.reduce((sum, p) => sum + (p.outstanding || 0), 0) || 0,
    pendingInvoices: purchases?.filter(p => p.status === 'Pending' || p.status === 'Partial').length || 0,
    monthTotal: purchases?.reduce((sum, p) => sum + (p.total || 0), 0) || 0,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Purchases</h1>
          <p className="text-gray-500 mt-1">Stock received and supplier invoices.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> New purchase
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Total payable</span><ClipboardList className="w-4 h-4 text-accent-yellow" /></div>
          <p className="text-2xl font-bold text-white">Rs {stats.totalPayable.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Pending invoices</span><AlertCircle className="w-4 h-4 text-accent-red" /></div>
          <p className="text-2xl font-bold text-white">{stats.pendingInvoices}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Purchases (month)</span><ClipboardList className="w-4 h-4 text-accent-blue" /></div>
          <p className="text-2xl font-bold text-white">Rs {stats.monthTotal.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ref, invoice or supplier..." className="input-field pl-10" />
        </div>
        <div className="flex gap-2">
          {['All', 'Completed', 'Returned'].map(s => (
            <button key={s} onClick={() => setStatus(s)} className={`tab ${status === s ? 'tab-active' : ''}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-dark-800 border-b border-dark-500/50">
            <tr>
              <th className="table-header">Ref</th>
              <th className="table-header">Supplier</th>
              <th className="table-header">Date</th>
              <th className="table-header text-right">Total</th>
              <th className="table-header text-right">Outstanding</th>
              <th className="table-header">Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases?.length === 0 && (
              <tr><td colSpan={6} className="table-cell text-center py-12 text-gray-500">No purchases yet. Click &quot;New purchase&quot;.</td></tr>
            )}
            {purchases?.map(purchase => (
              <tr key={purchase._id} className="border-b border-dark-500/30 hover:bg-dark-600/30 transition-colors">
                <td className="table-cell font-mono text-xs">{purchase.reference}</td>
                <td className="table-cell">{purchase.supplier?.name}</td>
                <td className="table-cell text-gray-400">{new Date(purchase.date).toLocaleDateString()}</td>
                <td className="table-cell text-right text-white">Rs {purchase.total}</td>
                <td className="table-cell text-right text-accent-red">Rs {purchase.outstanding}</td>
                <td className="table-cell">
                  <span className={`badge ${purchase.status === 'Completed' ? 'bg-accent-green/10 text-accent-green' : purchase.status === 'Partial' ? 'bg-accent-yellow/10 text-accent-yellow' : purchase.status === 'Returned' ? 'bg-accent-red/10 text-accent-red' : 'bg-accent-yellow/10 text-accent-yellow'}`}>{purchase.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}