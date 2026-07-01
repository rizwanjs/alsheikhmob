import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import { Plus, Minus, Trash2, ShoppingCart, User, Search, CreditCard, Banknote } from 'lucide-react'
import api from '../lib/api'

export default function POS() {
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [customerName, setCustomerName] = useState('Walk-in customer')
  const [discount, setDiscount] = useState(0)
  const [tax, setTax] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [activeTab, setActiveTab] = useState('Counter')

  const { data: products } = useQuery(['products', search], () =>
    api.get(`/products?search=${search}`).then(res => res.data), { enabled: search.length > 0 }
  )

  const createSale = useMutation((data) => api.post('/sales', data), {
    onSuccess: () => { setCart([]); setDiscount(0); setTax(0); setCustomerName('Walk-in customer') }
  })

  const addToCart = (product) => {
    const existing = cart.find(item => item._id === product._id)
    if (existing) {
      setCart(cart.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      setCart([...cart, { ...product, quantity: 1, unitPrice: product.salePrice }])
    }
  }

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item._id === id) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const removeItem = (id) => setCart(cart.filter(item => item._id !== id))

  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
  const total = subtotal - discount + tax

  const handleCheckout = () => {
    if (cart.length === 0) return
    const invoiceNumber = 'INV-' + Date.now()
    const items = cart.map(item => ({
      product: item._id,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.unitPrice * item.quantity
    }))
    const profit = cart.reduce((sum, item) => sum + ((item.unitPrice - item.purchasePrice) * item.quantity), 0)
    createSale.mutate({ invoiceNumber, customerName, items, subtotal, discount, tax, total, profit, paymentMethod })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Point of Sale</h1>
          <p className="text-gray-500 mt-1">Scan, search and sell.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('Counter')} className={`tab ${activeTab === 'Counter' ? 'tab-active' : ''}`}>Counter</button>
            <button onClick={() => setActiveTab('History')} className={`tab ${activeTab === 'History' ? 'tab-active' : ''}`}>History</button>
          </div>

          {activeTab === 'Counter' && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Scan barcode, type IMEI or search product..."
                  className="input-field pl-10" />
              </div>

              {products && products.length > 0 && (
                <div className="bg-dark-700 rounded-xl border border-dark-500/50 max-h-64 overflow-y-auto">
                  {products.map(product => (
                    <button key={product._id} onClick={() => addToCart(product)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-dark-600 border-b border-dark-500/30 last:border-0 text-left">
                      <div>
                        <p className="text-sm text-white font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sku} | Stock: {product.quantity}</p>
                      </div>
                      <p className="text-sm text-accent-blue font-semibold">Rs {product.salePrice}</p>
                    </button>
                  ))}
                </div>
              )}

              <div className="card min-h-[300px]">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mb-2 opacity-30" />
                    <p>Cart is empty</p>
                    <p className="text-sm">Start typing or scan a barcode to find items.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item._id} className="flex items-center justify-between bg-dark-800 rounded-lg p-3">
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">Rs {item.unitPrice} each</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQty(item._id, -1)} className="w-7 h-7 rounded-lg bg-dark-600 flex items-center justify-center text-gray-400 hover:text-white">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm text-white w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQty(item._id, 1)} className="w-7 h-7 rounded-lg bg-dark-600 flex items-center justify-center text-gray-400 hover:text-white">
                            <Plus className="w-3 h-3" />
                          </button>
                          <p className="text-sm text-white font-semibold w-20 text-right">Rs {item.unitPrice * item.quantity}</p>
                          <button onClick={() => removeItem(item._id)} className="text-gray-500 hover:text-accent-red">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="card h-fit">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-dark-500/50">
            <User className="w-4 h-4 text-gray-400" />
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-gray-200 w-full" />
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white">Rs {subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Discount</span>
              <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-20 bg-dark-800 border border-dark-500 rounded px-2 py-1 text-right text-sm" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tax</span>
              <input type="number" value={tax} onChange={(e) => setTax(Number(e.target.value))}
                className="w-20 bg-dark-800 border border-dark-500 rounded px-2 py-1 text-right text-sm" />
            </div>
            <div className="flex justify-between text-lg font-bold pt-3 border-t border-dark-500/50">
              <span className="text-white">Total</span>
              <span className="text-white">Rs {total}</span>
            </div>
            <div className="flex justify-between text-sm text-accent-green">
              <span>Profit</span>
              <span>Rs {cart.reduce((sum, item) => sum + ((item.unitPrice - item.purchasePrice) * item.quantity), 0)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button onClick={() => setPaymentMethod('Cash')} className={`btn-secondary justify-center text-xs ${paymentMethod === 'Cash' ? 'border-accent-blue text-accent-blue' : ''}`}>
              <Banknote className="w-3 h-3" /> Cash
            </button>
            <button onClick={() => setPaymentMethod('Card')} className={`btn-secondary justify-center text-xs ${paymentMethod === 'Card' ? 'border-accent-blue text-accent-blue' : ''}`}>
              <CreditCard className="w-3 h-3" /> Card
            </button>
          </div>

          <button onClick={handleCheckout} disabled={cart.length === 0 || createSale.isLoading}
            className="w-full btn-primary justify-center py-3 disabled:opacity-50">
            {createSale.isLoading ? 'Processing...' : 'Complete Sale'}
          </button>
        </div>
      </div>
    </div>
  )
}