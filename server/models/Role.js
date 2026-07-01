const mongoose = require('mongoose');
const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  permissions: {
    dashboard: { view: { type: Boolean, default: false } },
    sales: { view: { type: Boolean, default: false }, create: { type: Boolean, default: false }, refund: { type: Boolean, default: false }, overridePrice: { type: Boolean, default: false } },
    customers: { view: { type: Boolean, default: false }, manage: { type: Boolean, default: false } },
    inventory: { view: { type: Boolean, default: false }, manage: { type: Boolean, default: false } },
    usedPhones: { view: { type: Boolean, default: false }, manage: { type: Boolean, default: false } },
    purchases: { view: { type: Boolean, default: false }, create: { type: Boolean, default: false } },
    suppliers: { view: { type: Boolean, default: false }, manage: { type: Boolean, default: false } },
    repairs: { view: { type: Boolean, default: false }, manage: { type: Boolean, default: false } },
    expenses: { view: { type: Boolean, default: false }, manage: { type: Boolean, default: false } },
    reports: { view: { type: Boolean, default: false } },
    users: { view: { type: Boolean, default: false }, manage: { type: Boolean, default: false } },
    roles: { view: { type: Boolean, default: false }, manage: { type: Boolean, default: false } },
    settings: { view: { type: Boolean, default: false }, manage: { type: Boolean, default: false } },
    backup: { view: { type: Boolean, default: false }, manage: { type: Boolean, default: false } }
  },
  isSystem: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Role', roleSchema);
