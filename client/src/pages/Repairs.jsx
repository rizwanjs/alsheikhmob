import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Plus, Search, Wrench, CheckCircle, Clock, AlertCircle, Truck } from 'lucide-react'
import api from '../lib/api'

const statusConfig = {
  'Received': { color: 'bg-gray-500', icon: Clock },
  'Diagnosing': { color: 'bg-accent-blue', icon: Wrench },
  'Pending Parts': { color: 'bg-accent-yellow', icon: AlertCircle },
  'In Progress': { color: 'bg-accent-purple', icon: Wrench },
  'Ready': { color: 'bg-accent-green', icon: CheckCircle },
  'Delivered': { color: 'bg-gray-600', icon: Truck },
}

export default function Repairs() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('Board')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ customerName: '', customerPhone: '', deviceModel: '', imei: '', issue: '', estimatedCost: 0 })
  const queryClient = useQueryClient()

  const { data: repairs } = useQuery(['repairs', search], () =>
    api.get(`/repairs?search=${search}`).then(res => res.data), { keepPreviousData: true }
  )

  const createRepair = useMutation((data) => api.post('/repairs', data), {
    onSuccess: () => { queryClient.invalidateQueries('repairs'); setShowModal(false); setForm({ customerName: '', customerPhone: '', deviceModel: '', imei: '', issue: '', estimatedCost: 0 }) }
  })

  const updateStatus = useMutation(({ id, status }) => api.put(`/repairs/${id}`, { status }), {
    onSuccess: () => queryClient.invalidateQueries('repairs')
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const jobSheetNumber = 'JS-' + Date.now()
    createRepair.mutate({ ...form, jobSheetNumber })
  }

  const boardColumns = ['Received', 'Diagnosing', 'Pending Parts', 'In Progress']

  const stats = {
    activeJobs: repairs?.filter(r => !['Delivered', 'Cancelled'].includes(r.status)).length || 0,
    readyToDeliver: repairs?.filter(r => r.status === 'Ready').length || 0,
    repairProfit: repairs?.reduce((sum, r) => sum + (r.profit || 0), 0) || 0,
    deliveredMonth: repairs?.filter(r => r.status === 'Delivered').length || 0,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Repair Center</h1>
          <p className="text-gray-500 mt-1">Job sheets, technician workflow and repair profit.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Receive device
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Active jobs</span>
            <Wrench className="w-4 h-4 text-accent-blue" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.activeJobs}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Ready to deliver</span>
            <CheckCircle className="w-4 h-4 text-accent-green" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.readyToDeliver}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Repair profit (month)</span>
            <TrendIcon className="w-4 h-4 text-accent-green" />
          </div>
          <p className="text-2xl font-bold text-white">Rs {stats.repairProfit}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Delivered (month)</span>
            <Truck className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.deliveredMonth}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setActiveTab('Board')} className={`tab ${activeTab === 'Board' ? 'tab-active' : ''}`}>Board</button>
        <button onClick={() => setActiveTab('History')} className={`tab ${activeTab === 'History' ? 'tab-active' : ''}`}>History</button>
      </div>

      {activeTab === 'Board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {boardColumns.map(status => (
            <div key={status} className="bg-dark-700 rounded-xl border border-dark-500/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${statusConfig[status]?.color || 'bg-gray-500'}`}></div>
                <h3 className="text-sm font-semibold text-white">{status}</h3>
                <span className="ml-auto text-xs text-gray-500">{repairs?.filter(r => r.status === status).length || 0}</span>
              </div>
              <div className="space-y-2 min-h-[100px]">
                {repairs?.filter(r => r.status === status).map(repair => (
                  <div key={repair._id} className="bg-dark-800 rounded-lg p-3 border border-dark-500/30">
                    <p className="text-sm text-white font-medium">{repair.deviceModel}</p>
                    <p className="text-xs text-gray-500">{repair.customerName}</p>
                    <p className="text-xs text-gray-500 mt-1">{repair.issue}</p>
                  </div>
                ))}
                {(!repairs || repairs.filter(r => r.status === status).length === 0) && (
                  <p className="text-center text-gray-600 text-sm py-4">—</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'History' && (
        <div className="card overflow-hidden p-0">
          <div className="p-4 border-b border-dark-500/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search job sheet, customer or device..." className="input-field pl-10 max-w-md" />
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-dark-800 border-b border-dark-500/50">
              <tr>
                <th className="table-header">Job Sheet</th>
                <th className="table-header">Customer</th>
                <th className="table-header">Device</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right">Charges</th>
              </tr>
            </thead>
            <tbody>
              {repairs?.length === 0 && (
                <tr><td colSpan={5} className="table-cell text-center py-12 text-gray-500">No repairs yet.</td></tr>
              )}
              {repairs?.map(repair => (
                <tr key={repair._id} className="border-b border-dark-500/30 hover:bg-dark-600/30 transition-colors">
                  <td className="table-cell font-mono text-xs">{repair.jobSheetNumber}</td>
                  <td className="table-cell">{repair.customerName}</td>
                  <td className="table-cell">{repair.deviceModel}</td>
                  <td className="table-cell">
                    <span className={`badge ${statusConfig[repair.status]?.color.replace('bg-', 'bg-') + '/20 text-white' || 'bg-gray-500/20 text-gray-300'}`}>
                      {repair.status}
                    </span>
                  </td>
                  <td className="table-cell text-right">Rs {repair.charges || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-dark-500/50">
              <h2 className="text-lg font-semibold text-white">Receive Device</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Customer Name *</label>
                  <input type="text" required value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} className="input-field" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="text" value={form.customerPhone} onChange={e => setForm({...form, customerPhone: e.target.value})} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Device Model *</label>
                  <input type="text" required value={form.deviceModel} onChange={e => setForm({...form, deviceModel: e.target.value})} className="input-field" />
                </div>
                <div className="form-group">
                  <label className="form-label">IMEI</label>
                  <input type="text" value={form.imei} onChange={e => setForm({...form, imei: e.target.value})} className="input-field" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Issue *</label>
                <textarea required value={form.issue} onChange={e => setForm({...form, issue: e.target.value})} className="input-field min-h-[80px]" />
              </div>
              <div className="form-group">
                <label className="form-label">Estimated Cost</label>
                <input type="number" value={form.estimatedCost} onChange={e => setForm({...form, estimatedCost: Number(e.target.value)})} className="input-field" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={createRepair.isLoading} className="btn-primary">{createRepair.isLoading ? 'Saving...' : 'Receive'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function TrendIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}