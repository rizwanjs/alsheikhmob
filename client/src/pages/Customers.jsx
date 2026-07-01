import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Plus, Search, Phone, ShoppingBag, Wallet } from 'lucide-react'
import api from '../lib/api'

export default function Customers() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', cnic: '' })
  const queryClient = useQueryClient()

  const { data: customers } = useQuery(['customers', search], () =>
    api.get(`/customers?search=${search}`).then(res => res.data), { keepPreviousData: true }
  )

  const createCustomer = useMutation((data) => api.post('/customers', data), {
    onSuccess: () => { queryClient.invalidateQueries('customers'); setShowModal(false); setForm({ name: '', phone: '', email: '', address: '', cnic: '' }) }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createCustomer.mutate(form)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-gray-500 mt-1">Buyers, credit accounts and history.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add customer
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or phone..." className="input-field pl-10 max-w-md" />
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-dark-800 border-b border-dark-500/50">
            <tr>
              <th className="table-header">Customer</th>
              <th className="table-header">Phone</th>
              <th className="table-header text-right">Purchases</th>
              <th className="table-header text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {customers?.length === 0 && (
              <tr><td colSpan={4} className="table-cell text-center py-12 text-gray-500">No customers yet.</td></tr>
            )}
            {customers?.map(customer => (
              <tr key={customer._id} className="border-b border-dark-500/30 hover:bg-dark-600/30 transition-colors">
                <td className="table-cell">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-dark-600 flex items-center justify-center text-sm font-medium text-gray-300">
                      {customer.name.charAt(0)}
                    </div>
                    <span className="text-white font-medium">{customer.name}</span>
                  </div>
                </td>
                <td className="table-cell text-gray-400">{customer.phone}</td>
                <td className="table-cell text-right text-gray-400">{customer.totalPurchases}</td>
                <td className="table-cell text-right">
                  <span className={customer.balance > 0 ? 'text-accent-red' : 'text-gray-400'}>Rs {customer.balance}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-dark-500/50">
              <h2 className="text-lg font-semibold text-white">Add Customer</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input type="text" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="input-field" />
              </div>
              <div className="form-group">
                <label className="form-label">CNIC</label>
                <input type="text" value={form.cnic} onChange={e => setForm({...form, cnic: e.target.value})} className="input-field" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={createCustomer.isLoading} className="btn-primary">{createCustomer.isLoading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}