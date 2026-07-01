const mongoose = require('mongoose');
const saleItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  usedPhone: { type: mongoose.Schema.Types.ObjectId, ref: 'UsedPhone' },
  quantity: { type: Number, default: 1 },
  unitPrice: Number,
  discount: { type: Number, default: 0 },
  total: Number
});
const saleSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  customerName: { type: String, default: 'Walk-in customer' },
  items: [saleItemSchema],
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  profit: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['Cash', 'Card', 'Bank Transfer', 'Credit'], default: 'Cash' },
  status: { type: String, enum: ['Completed', 'Pending', 'Returned', 'Cancelled'], default: 'Completed' },
  notes: String,
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Sale', saleSchema);
