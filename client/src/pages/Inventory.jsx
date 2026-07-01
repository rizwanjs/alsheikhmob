import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Plus, Search, Package, AlertTriangle, XCircle } from 'lucide-react'
import api from '../lib/api'

const categories = ['All categories', 'Accessories', 'Earbuds', 'Laptop Accessories', 'New Mobiles', 'Power Banks', 'SIM Devices', 'Smart Watches', 'Speakers', 'Tablets', 'Used Mobiles']

export default function Inventory() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All categories')
  const [status, setStatus] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', sku: '', category: 'New Mobiles', purchasePrice: 0, salePrice: 0, minPrice: 0, quantity: 0, lowStockThreshold: 5 })
  const queryClient = useQueryClient()

  const { data: products } = useQuery(['products', search, category, status], () =>
    api.get(`/products?search=${search}&category=${category}&status=${status}`).then(res => res.data), { keepPreviousData: true }
  )

  const createProduct = useMutation((data) => api.post('/products', data), {
    onSuccess: () => { queryClient.invalidateQueries('products'); setShowModal(false); setForm({ name: '', sku: '', category: 'New Mobiles', purchasePrice: 0, salePrice: 0, minPrice: 0, quantity: 0, lowStockThreshold: 5 }) }
  })

  const stats = {
    totalProducts: products?.length || 0,
    stockValue: products?.reduce((sum, p) => sum + (p.purchasePrice * p.quantity), 0) || 0,
    lowStock: products?.filter(p => p.quantity <= p.lowStockThreshold && p.quantity > 0).length || 0,
    outOfStock: products?.filter(p => p.quantity === 0).length || 0,
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createProduct.mutate(form)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory</h1>
          <p className="text-gray-500 mt-1">Products, accessories and stock.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add product
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Products</span><Package className="w-4 h-4 text-gray-400" /></div>
          <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Stock value</span><Package className="w-4 h-4 text-accent-blue" /></div>
          <p className="text-2xl font-bold text-white">Rs {stats.stockValue.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Low stock</span><AlertTriangle className="w-4 h-4 text-accent-yellow" /></div>
          <p className="text-2xl font-bold text-white">{stats.lowStock}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Out of stock</span><XCircle className="w-4 h-4 text-accent-red" /></div>
          <p className="text-2xl font-bold text-white">{stats.outOfStock}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, SKU or barcode..." className="input-field pl-10" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'In stock', 'Low', 'Out'].map(s => (
            <button key={s} onClick={() => setStatus(s)} className={`tab ${status === s ? 'tab-active' : ''}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${category === cat ? 'bg-accent-blue text-white' : 'bg-dark-700 text-gray-400 border border-dark-500/50 hover:text-gray-200'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-dark-800 border-b border-dark-500/50">
            <tr>
              <th className="table-header">Product</th>
              <th className="table-header">Category</th>
              <th className="table-header">Variants</th>
              <th className="table-header text-right">Qty</th>
              <th className="table-header text-right">Price</th>
              <th className="table-header">Status</th>
            </tr>
          </thead>
          <tbody>
            {products?.length === 0 && (
              <tr><td colSpan={6} className="table-cell text-center py-12 text-gray-500">No products found. Click "Add product" to create one.</td></tr>
            )}
            {products?.map(product => (
              <tr key={product._id} className="border-b border-dark-500/30 hover:bg-dark-600/30 transition-colors">
                <td className="table-cell">
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sku}</p>
                  </div>
                </td>
                <td className="table-cell text-gray-400">{product.category}</td>
                <td className="table-cell text-gray-400">—</td>
                <td className="table-cell text-right text-white">{product.quantity}</td>
                <td className="table-cell text-right text-white">Rs {product.salePrice}</td>
                <td className="table-cell">
                  {product.quantity === 0 ? (
                    <span className="badge bg-accent-red/10 text-accent-red border border-accent-red/20">Out</span>
                  ) : product.quantity <= product.lowStockThreshold ? (
                    <span className="badge bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20">Low</span>
                  ) : (
                    <span className="badge bg-accent-green/10 text-accent-green border border-accent-green/20">In Stock</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-dark-500/50"><h2 className="text-lg font-semibold text-white">Add Product</h2></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="form-label">Name *</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" /></div>
                <div className="form-group"><label className="form-label">SKU *</label><input type="text" required value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} className="input-field" /></div>
              </div>
              <div className="form-group"><label className="form-label">Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field">
                  {categories.filter(c => c !== 'All categories').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="form-group"><label className="form-label">Purchase Price</label><input type="number" value={form.purchasePrice} onChange={e => setForm({...form, purchasePrice: Number(e.target.value)})} className="input-field" /></div>
                <div className="form-group"><label className="form-label">Sale Price</label><input type="number" value={form.salePrice} onChange={e => setForm({...form, salePrice: Number(e.target.value)})} className="input-field" /></div>
                <div className="form-group"><label className="form-label">Min Price</label><input type="number" value={form.minPrice} onChange={e => setForm({...form, minPrice: Number(e.target.value)})} className="input-field" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="form-label">Quantity</label><input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: Number(e.target.value)})} className="input-field" /></div>
                <div className="form-group"><label className="form-label">Low Stock Alert</label><input type="number" value={form.lowStockThreshold} onChange={e => setForm({...form, lowStockThreshold: Number(e.target.value)})} className="input-field" /></div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={createProduct.isLoading} className="btn-primary">{createProduct.isLoading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}