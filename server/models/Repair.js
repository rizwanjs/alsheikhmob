const mongoose = require('mongoose');
const repairSchema = new mongoose.Schema({
  jobSheetNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: String,
  deviceModel: { type: String, required: true },
  imei: String,
  issue: { type: String, required: true },
  status: { type: String, enum: ['Received', 'Diagnosing', 'Pending Parts', 'In Progress', 'Ready', 'Delivered', 'Cancelled'], default: 'Received' },
  estimatedCost: { type: Number, default: 0 },
  actualCost: { type: Number, default: 0 },
  charges: { type: Number, default: 0 },
  profit: { type: Number, default: 0 },
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  partsUsed: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number, cost: Number }],
  notes: String,
  receivedDate: { type: Date, default: Date.now },
  deliveryDate: Date,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Repair', repairSchema);
