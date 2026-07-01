import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Plus, Search, Shield, Mail, Phone } from 'lucide-react'
import api from '../lib/api'

export default function Users() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Salesman', phone: '' })
  const queryClient = useQueryClient()

  const { data: users } = useQuery(['users', search], () =>
    api.get(`/users?search=${search}`).then(res => res.data), { keepPreviousData: true }
  )

  const createUser = useMutation((data) => api.post('/users', data), {
    onSuccess: () => { queryClient.invalidateQueries('users'); setShowModal(false); setForm({ name: '', email: '', password: '', role: 'Salesman', phone: '' }) }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createUser.mutate(form)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-500 mt-1">Staff accounts and access control.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add user
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..." className="input-field pl-10 max-w-md" />
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-dark-800 border-b border-dark-500/50">
            <tr>
              <th className="table-header">User</th>
              <th className="table-header">Role</th>
              <th className="table-header">Contact</th>
              <th className="table-header">Status</th>
            </tr>
          </thead>
          <tbody>
            {users?.length === 0 && (
              <tr><td colSpan={4} className="table-cell text-center py-12 text-gray-500">No users yet.</td></tr>
            )}
            {users?.map(user => (
              <tr key={user._id} className="border-b border-dark-500/30 hover:bg-dark-600/30 transition-colors">
                <td className="table-cell">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-blue flex items-center justify-center text-white text-sm font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="table-cell"><span className="badge bg-dark-600 text-gray-400">{user.role}</span></td>
                <td className="table-cell text-gray-400">{user.phone || '—'}</td>
                <td className="table-cell">
                  <span className={`badge ${user.isActive ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-dark-500/50"><h2 className="text-lg font-semibold text-white">Add User</h2></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="form-group"><label className="form-label">Name *</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" /></div>
              <div className="form-group"><label className="form-label">Email *</label><input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" /></div>
              <div className="form-group"><label className="form-label">Password *</label><input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="input-field" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="form-label">Role</label>
                  <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="input-field">
                    <option>Admin</option><option>Manager</option><option>Salesman</option><option>Cashier</option><option>Technician</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Phone</label><input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" /></div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={createUser.isLoading} className="btn-primary">{createUser.isLoading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}