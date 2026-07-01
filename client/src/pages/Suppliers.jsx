import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Plus, Search, Users, Wallet, ClipboardList, ShoppingCart } from 'lucide-react'
import api from '../lib/api'

export default function Suppliers() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'Company', phone: '', email: '', address: '' })
  const queryClient = useQueryClient()

  const { data: suppliers } = useQuery(['suppliers', search], () =>
    api.get(`/suppliers?search=${search}`).then(res => res.data), { keepPreviousData: true }
  )

  const createSupplier = useMutation((data) => api.post('/suppliers', data), {
    onSuccess: () => { queryClient.invalidateQueries('suppliers'); setShowModal(false); setForm({ name: '', type: 'Company', phone: '', email: '', address: '' }) }
  })

  const stats = {
    total: suppliers?.length || 0,
    payable: suppliers?.reduce((sum, s) => sum + (s.balance || 0), 0) || 0,
    pending: suppliers?.reduce((sum, s) => sum + (s.pendingInvoices || 0), 0) || 0,
    monthPurchases: suppliers?.reduce((sum, s) => sum + (s.totalPurchases || 0), 0) || 0,
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createSupplier.mutate(form)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Suppliers</h1>
          <p className="text-gray-500 mt-1">Vendors and what you owe them.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add supplier
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Suppliers</span><Users className="w-4 h-4 text-gray-400" /></div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Total payable</span><Wallet className="w-4 h-4 text-accent-yellow" /></div>
          <p className="text-2xl font-bold text-white">Rs {stats.payable.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Pending invoices</span><ClipboardList className="w-4 h-4 text-accent-red" /></div>
          <p className="text-2xl font-bold text-white">{stats.pending}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Purchases (month)</span><ShoppingCart className="w-4 h-4 text-accent-blue" /></div>
          <p className="text-2xl font-bold text-white">Rs {stats.monthPurchases.toLocaleString()}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search supplier..." className="input-field pl-10 max-w-md" />
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-dark-800 border-b border-dark-500/50">
            <tr>
              <th className="table-header">Supplier</th>
              <th className="table-header">Type</th>
              <th className="table-header">Phone</th>
              <th className="table-header text-right">Purchases</th>
              <th className="table-header text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {suppliers?.length === 0 && (
              <tr><td colSpan={5} className="table-cell text-center py-12 text-gray-500">No suppliers yet. Click &quot;Add supplier&quot;.</td></tr>
            )}
            {suppliers?.map(supplier => (
              <tr key={supplier._id} className="border-b border-dark-500/30 hover:bg-dark-600/30 transition-colors">
                <td className="table-cell text-white font-medium">{supplier.name}</td>
                <td className="table-cell text-gray-400">{supplier.type}</td>
                <td className="table-cell text-gray-400">{supplier.phone || '—'}</td>
                <td className="table-cell text-right text-gray-400">{supplier.totalPurchases}</td>
                <td className="table-cell text-right text-accent-red">Rs {supplier.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-dark-500/50"><h2 className="text-lg font-semibold text-white">Add Supplier</h2></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="form-group"><label className="form-label">Name *</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" /></div>
              <div className="form-group"><label className="form-label">Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="input-field">
                  <option>Individual</option><option>Company</option><option>Distributor</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="form-label">Phone</label><input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" /></div>
                <div className="form-group"><label className="form-label">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" /></div>
              </div>
              <div className="form-group"><label className="form-label">Address</label><input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="input-field" /></div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={createSupplier.isLoading} className="btn-primary">{createSupplier.isLoading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}