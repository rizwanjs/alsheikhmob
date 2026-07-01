const mongoose = require('mongoose');
const settingSchema = new mongoose.Schema({
  shopName: { type: String, default: 'Al Sheikh Mobiles' },
  shopPhone: String,
  shopAddress: { type: String, default: 'Main Market' },
  taxNumber: String,
  invoicePrefix: { type: String, default: 'INV-' },
  currency: { type: String, default: 'Rs' },
  taxRate: { type: Number, default: 0 },
  theme: { type: String, default: 'dark' },
  lowStockAlert: { type: Number, default: 5 },
  updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Setting', settingSchema);
