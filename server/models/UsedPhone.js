const mongoose = require('mongoose');
const usedPhoneSchema = new mongoose.Schema({
  imei: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  brand: String,
  condition: { type: String, enum: ['Excellent', 'Good', 'Fair', 'Poor'], default: 'Good' },
  batteryHealth: { type: Number, default: 100 },
  ptaStatus: { type: String, enum: ['Approved', 'Non-PTA', 'Pending'], default: 'Approved' },
  purchasePrice: { type: Number, default: 0 },
  expectedSalePrice: { type: Number, default: 0 },
  status: { type: String, enum: ['Available', 'Reserved', 'Sold', 'Returned'], default: 'Available' },
  notes: String,
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('UsedPhone', usedPhoneSchema);
