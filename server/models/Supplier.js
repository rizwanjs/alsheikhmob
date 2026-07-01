const mongoose = require('mongoose');
const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Individual', 'Company', 'Distributor'], default: 'Company' },
  phone: String,
  email: String,
  address: String,
  balance: { type: Number, default: 0 },
  totalPurchases: { type: Number, default: 0 },
  pendingInvoices: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Supplier', supplierSchema);
