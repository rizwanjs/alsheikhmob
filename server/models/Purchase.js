const mongoose = require('mongoose');
const purchaseItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  usedPhone: { type: mongoose.Schema.Types.ObjectId, ref: 'UsedPhone' },
  quantity: { type: Number, default: 1 },
  unitPrice: Number,
  total: Number
});
const purchaseSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  items: [purchaseItemSchema],
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  paid: { type: Number, default: 0 },
  outstanding: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'Completed', 'Returned', 'Partial'], default: 'Pending' },
  notes: String,
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Purchase', purchaseSchema);
