const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  barcode: String,
  category: { type: String, enum: ['Accessories', 'Earbuds', 'Laptop Accessories', 'New Mobiles', 'Power Banks', 'SIM Devices', 'Smart Watches', 'Speakers', 'Tablets', 'Used Mobiles'] },
  description: String,
  purchasePrice: { type: Number, default: 0 },
  salePrice: { type: Number, default: 0 },
  minPrice: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  lowStockThreshold: { type: Number, default: 5 },
  images: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Product', productSchema);
