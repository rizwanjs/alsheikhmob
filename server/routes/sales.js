const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const UsedPhone = require('../models/UsedPhone');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.query.search) query.$or = [{ invoiceNumber: { $regex: req.query.search, $options: 'i' } }, { customerName: { $regex: req.query.search, $options: 'i' } }];
    if (req.query.date) { const d = new Date(req.query.date); const e = new Date(d); e.setDate(e.getDate()+1); query.date = { $gte: d, $lt: e }; }
    const sales = await Sale.find(query).populate('items.product', 'name sku').populate('items.usedPhone', 'imei model').populate('customer', 'name phone').sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { invoiceNumber, customer, customerName, items, subtotal, discount, tax, total, profit, paymentMethod, notes } = req.body;
    for (const item of items) {
      if (item.product) await Product.findByIdAndUpdate(item.product, { $inc: { quantity: -item.quantity } });
      if (item.usedPhone) await UsedPhone.findByIdAndUpdate(item.usedPhone, { status: 'Sold' });
    }
    const sale = new Sale({ invoiceNumber, customer, customerName: customerName || 'Walk-in customer', items, subtotal, discount, tax, total, profit, paymentMethod, notes });
    await sale.save();
    res.status(201).json(sale);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/stats/today', auth, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0); const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);
    const sales = await Sale.find({ date: { $gte: today, $lt: tomorrow }, status: 'Completed' });
    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
    const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);
    res.json({ totalSales, totalProfit, invoiceCount: sales.length });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
