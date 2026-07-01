const mongoose = require('mongoose');
const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['Rent', 'Salary', 'Utilities', 'Maintenance', 'Marketing', 'Other'], default: 'Other' },
  amount: { type: Number, required: true },
  description: String,
  date: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Expense', expenseSchema);
