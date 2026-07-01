import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Plus, Search, Wallet, Calendar } from 'lucide-react'
import api from '../lib/api'

export default function Expenses() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'Other', amount: 0, description: '', date: new Date().toISOString().split('T')[0] })
  const queryClient = useQueryClient()

  const { data: expenses } = useQuery(['expenses', search], () =>
    api.get(`/expenses?search=${search}`).then(res => res.data), { keepPreviousData: true }
  )

  const createExpense = useMutation((data) => api.post('/expenses', data), {
    onSuccess: () => { queryClient.invalidateQueries('expenses'); setShowModal(false); setForm({ title: '', category: 'Other', amount: 0, description: '', date: new Date().toISOString().split('T')[0] }) }
  })

  const totalExpenses = expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0

  const handleSubmit = (e) => {
    e.preventDefault()
    createExpense.mutate(form)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Expenses</h1>
          <p className="text-gray-500 mt-1">Track where your money goes.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add expense
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Total expenses</span><Wallet className="w-4 h-4 text-accent-red" /></div>
          <p className="text-2xl font-bold text-white">Rs {totalExpenses.toLocaleString()}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search expenses..." className="input-field pl-10 max-w-md" />
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-dark-800 border-b border-dark-500/50">
            <tr>
              <th className="table-header">Title</th>
              <th className="table-header">Category</th>
              <th className="table-header">Date</th>
              <th className="table-header text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses?.length === 0 && (
              <tr><td colSpan={4} className="table-cell text-center py-12 text-gray-500">No expenses yet.</td></tr>
            )}
            {expenses?.map(expense => (
              <tr key={expense._id} className="border-b border-dark-500/30 hover:bg-dark-600/30 transition-colors">
                <td className="table-cell text-white font-medium">{expense.title}</td>
                <td className="table-cell"><span className="badge bg-dark-600 text-gray-400">{expense.category}</span></td>
                <td className="table-cell text-gray-400">{new Date(expense.date).toLocaleDateString()}</td>
                <td className="table-cell text-right text-accent-red font-semibold">Rs {expense.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-dark-500/50"><h2 className="text-lg font-semibold text-white">Add Expense</h2></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="form-group"><label className="form-label">Title *</label><input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="form-label">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field">
                    <option>Rent</option><option>Salary</option><option>Utilities</option><option>Maintenance</option><option>Marketing</option><option>Other</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Amount *</label><input type="number" required value={form.amount} onChange={e => setForm({...form, amount: Number(e.target.value)})} className="input-field" /></div>
              </div>
              <div className="form-group"><label className="form-label">Date</label><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="input-field" /></div>
              <div className="form-group"><label className="form-label">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field min-h-[60px]" /></div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={createExpense.isLoading} className="btn-primary">{createExpense.isLoading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}