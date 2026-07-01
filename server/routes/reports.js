const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const Repair = require('../models/Repair');
const Customer = require('../models/Customer');
const { auth } = require('../middleware/auth');

router.get('/dashboard', auth, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0); const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);
    const todaySales = await Sale.find({ date: { $gte: today, $lt: tomorrow }, status: 'Completed' });
    const todayProfit = todaySales.reduce((sum, s) => sum + s.profit, 0);
    const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0);
    const todayPurchases = await Purchase.find({ date: { $gte: today, $lt: tomorrow } });
    const todayPurchaseTotal = todayPurchases.reduce((sum, p) => sum + p.total, 0);
    const products = await Product.find();
    const inventoryValue = products.reduce((sum, p) => sum + (p.purchasePrice * p.quantity), 0);
    const lowStock = products.filter(p => p.quantity <= p.lowStockThreshold && p.quantity > 0).length;
    const outOfStock = products.filter(p => p.quantity === 0).length;
    const pendingRepairs = await Repair.countDocuments({ status: { $nin: ['Delivered', 'Cancelled'] } });
    const thirtyDaysAgo = new Date(today); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthlySales = await Sale.find({ date: { $gte: thirtyDaysAgo, $lt: tomorrow }, status: 'Completed' });
    const chartData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today); date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
      const daySales = monthlySales.filter(s => new Date(s.date).toDateString() === date.toDateString());
      chartData.push({ date: dateStr, sales: daySales.reduce((sum, s) => sum + s.total, 0), profit: daySales.reduce((sum, s) => sum + s.profit, 0) });
    }
    res.json({ todaySales: todayTotal, todayProfit, todayPurchases: todayPurchaseTotal, inventoryValue, totalCustomers: await Customer.countDocuments(), pendingRepairs, lowStock, outOfStock, totalProducts: products.length, chartData });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/sales', auth, async (req, res) => {
  try {
    let query = { status: 'Completed' };
    if (req.query.startDate && req.query.endDate) query.date = { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) };
    const sales = await Sale.find(query).sort({ date: -1 });
    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
    const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);
    res.json({ sales, totalSales, totalProfit, count: sales.length });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
