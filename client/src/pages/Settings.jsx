import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Save, Store, Globe, Package, Palette } from 'lucide-react'
import api from '../lib/api'

const tabs = [
  { id: 'shop', label: 'Shop', icon: Store },
  { id: 'region', label: 'Region & Tax', icon: Globe },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'appearance', label: 'Appearance', icon: Palette },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState('shop')
  const [form, setForm] = useState({ shopName: '', shopPhone: '', shopAddress: '', taxNumber: '', invoicePrefix: 'INV-', currency: 'Rs', taxRate: 0, lowStockAlert: 5 })
  const queryClient = useQueryClient()

  const { data: settings } = useQuery('settings', () => api.get('/settings').then(res => res.data), {
    onSuccess: (data) => setForm(data)
  })

  const updateSettings = useMutation((data) => api.put('/settings', data), {
    onSuccess: () => queryClient.invalidateQueries('settings')
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    updateSettings.mutate(form)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-500 mt-1">Shop profile, region, inventory rules, and appearance.</p>
        </div>
        <button onClick={handleSubmit} disabled={updateSettings.isLoading} className="btn-primary">
          <Save className="w-4 h-4" /> {updateSettings.isLoading ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      <div className="flex gap-2">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}>
            <tab.icon className="w-4 h-4 inline mr-1" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="card max-w-3xl">
        {activeTab === 'shop' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Shop profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Shop name</label>
                <input type="text" value={form.shopName} onChange={e => setForm({...form, shopName: e.target.value})} className="input-field" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input type="text" value={form.shopPhone || ''} onChange={e => setForm({...form, shopPhone: e.target.value})} className="input-field" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input type="text" value={form.shopAddress} onChange={e => setForm({...form, shopAddress: e.target.value})} className="input-field" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Tax / NTN number</label>
                <input type="text" value={form.taxNumber || ''} onChange={e => setForm({...form, taxNumber: e.target.value})} className="input-field" />
              </div>
              <div className="form-group">
                <label className="form-label">Invoice prefix</label>
                <input type="text" value={form.invoicePrefix} onChange={e => setForm({...form, invoicePrefix: e.target.value})} className="input-field" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'region' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Region & Tax</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Currency</label>
                <input type="text" value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} className="input-field" />
              </div>
              <div className="form-group">
                <label className="form-label">Tax rate (%)</label>
                <input type="number" value={form.taxRate} onChange={e => setForm({...form, taxRate: Number(e.target.value)})} className="input-field" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Inventory Rules</h3>
            <div className="form-group">
              <label className="form-label">Low stock alert threshold</label>
              <input type="number" value={form.lowStockAlert} onChange={e => setForm({...form, lowStockAlert: Number(e.target.value)})} className="input-field" />
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
            <p className="text-gray-500 text-sm">Theme settings will be available in future updates.</p>
          </div>
        )}
      </div>
    </div>
  )
}