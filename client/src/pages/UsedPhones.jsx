import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Plus, Search, Smartphone, Battery, Shield } from 'lucide-react'
import api from '../lib/api'

const statuses = ['All', 'Available', 'Reserved', 'Sold', 'Returned']

export default function UsedPhones() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ imei: '', model: '', brand: '', condition: 'Good', batteryHealth: 100, ptaStatus: 'Approved', purchasePrice: 0, expectedSalePrice: 0, notes: '' })
  const queryClient = useQueryClient()

  const { data: phones } = useQuery(['used-phones', search, status], () =>
    api.get(`/used-phones?search=${search}&status=${status}`).then(res => res.data), { keepPreviousData: true }
  )

  const createPhone = useMutation((data) => api.post('/used-phones', data), {
    onSuccess: () => { queryClient.invalidateQueries('used-phones'); setShowModal(false); setForm({ imei: '', model: '', brand: '', condition: 'Good', batteryHealth: 100, ptaStatus: 'Approved', purchasePrice: 0, expectedSalePrice: 0, notes: '' }) }
  })

  const stats = {
    available: phones?.filter(p => p.status === 'Available').length || 0,
    reserved: phones?.filter(p => p.status === 'Reserved').length || 0,
    stockValue: phones?.reduce((sum, p) => sum + (p.purchasePrice || 0), 0) || 0,
    expectedProfit: phones?.reduce((sum, p) => sum + ((p.expectedSalePrice || 0) - (p.purchasePrice || 0)), 0) || 0,
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createPhone.mutate(form)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Used Phones</h1>
          <p className="text-gray-500 mt-1">Every used device tracked individually by IMEI.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> New intake
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Available</span><Smartphone className="w-4 h-4 text-accent-green" /></div>
          <p className="text-2xl font-bold text-white">{stats.available}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Reserved</span><Smartphone className="w-4 h-4 text-accent-yellow" /></div>
          <p className="text-2xl font-bold text-white">{stats.reserved}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Stock value</span><PackageIcon className="w-4 h-4 text-accent-blue" /></div>
          <p className="text-2xl font-bold text-white">Rs {stats.stockValue.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Expected profit</span><TrendIcon className="w-4 h-4 text-accent-green" /></div>
          <p className="text-2xl font-bold text-white">Rs {stats.expectedProfit.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search IMEI or model..." className="input-field pl-10" />
        </div>
        <div className="flex gap-2">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatus(s)} className={`tab ${status === s ? 'tab-active' : ''}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-dark-800 border-b border-dark-500/50">
            <tr>
              <th className="table-header">Device</th>
              <th className="table-header">Condition</th>
              <th className="table-header">Battery</th>
              <th className="table-header">PTA</th>
              <th className="table-header text-right">Purchase</th>
              <th className="table-header text-right">Expected</th>
              <th className="table-header">Status</th>
            </tr>
          </thead>
          <tbody>
            {phones?.length === 0 && (
              <tr><td colSpan={7} className="table-cell text-center py-12 text-gray-500">No used phones yet. Click "New intake" to add one.</td></tr>
            )}
            {phones?.map(phone => (
              <tr key={phone._id} className="border-b border-dark-500/30 hover:bg-dark-600/30 transition-colors">
                <td className="table-cell">
                  <div>
                    <p className="text-white font-medium">{phone.model}</p>
                    <p className="text-xs text-gray-500 font-mono">{phone.imei}</p>
                  </div>
                </td>
                <td className="table-cell"><span className={`badge ${phone.condition === 'Excellent' ? 'bg-accent-green/10 text-accent-green' : phone.condition === 'Good' ? 'bg-accent-blue/10 text-accent-blue' : 'bg-accent-yellow/10 text-accent-yellow'}`}>{phone.condition}</span></td>
                <td className="table-cell"><div className="flex items-center gap-1 text-gray-400"><Battery className="w-3 h-3" /> {phone.batteryHealth}%</div></td>
                <td className="table-cell"><div className="flex items-center gap-1 text-gray-400"><Shield className="w-3 h-3" /> {phone.ptaStatus}</div></td>
                <td className="table-cell text-right text-gray-400">Rs {phone.purchasePrice}</td>
                <td className="table-cell text-right text-white">Rs {phone.expectedSalePrice}</td>
                <td className="table-cell">
                  <span className={`badge ${phone.status === 'Available' ? 'bg-accent-green/10 text-accent-green' : phone.status === 'Reserved' ? 'bg-accent-yellow/10 text-accent-yellow' : phone.status === 'Sold' ? 'bg-accent-blue/10 text-accent-blue' : 'bg-accent-red/10 text-accent-red'}`}>{phone.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-dark-500/50"><h2 className="text-lg font-semibold text-white">New Intake</h2></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="form-label">IMEI *</label><input type="text" required value={form.imei} onChange={e => setForm({...form, imei: e.target.value})} className="input-field" /></div>
                <div className="form-group"><label className="form-label">Model *</label><input type="text" required value={form.model} onChange={e => setForm({...form, model: e.target.value})} className="input-field" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="form-label">Brand</label><input type="text" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="input-field" /></div>
                <div className="form-group"><label className="form-label">Condition</label>
                  <select value={form.condition} onChange={e => setForm({...form, condition: e.target.value})} className="input-field">
                    <option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="form-label">Battery Health (%)</label><input type="number" value={form.batteryHealth} onChange={e => setForm({...form, batteryHealth: Number(e.target.value)})} className="input-field" /></div>
                <div className="form-group"><label className="form-label">PTA Status</label>
                  <select value={form.ptaStatus} onChange={e => setForm({...form, ptaStatus: e.target.value})} className="input-field">
                    <option>Approved</option><option>Non-PTA</option><option>Pending</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="form-label">Purchase Price</label><input type="number" value={form.purchasePrice} onChange={e => setForm({...form, purchasePrice: Number(e.target.value)})} className="input-field" /></div>
                <div className="form-group"><label className="form-label">Expected Sale Price</label><input type="number" value={form.expectedSalePrice} onChange={e => setForm({...form, expectedSalePrice: Number(e.target.value)})} className="input-field" /></div>
              </div>
              <div className="form-group"><label className="form-label">Notes</label><textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="input-field min-h-[60px]" /></div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={createPhone.isLoading} className="btn-primary">{createPhone.isLoading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function PackageIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
}

function TrendIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
}