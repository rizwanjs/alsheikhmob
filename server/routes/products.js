const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.query.category && req.query.category !== 'All categories') query.category = req.query.category;
    if (req.query.search) query.$or = [{ name: { $regex: req.query.search, $options: 'i' } }, { sku: { $regex: req.query.search, $options: 'i' } }, { barcode: { $regex: req.query.search, $options: 'i' } }];
    if (req.query.status) {
      if (req.query.status === 'In stock') query.quantity = { $gt: 0 };
      if (req.query.status === 'Low') query.$expr = { $lte: ['$quantity', '$lowStockThreshold'] };
      if (req.query.status === 'Out') query.quantity = 0;
    }
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', auth, async (req, res) => {
  try { const product = new Product(req.body); await product.save(); res.status(201).json(product); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try { const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(product); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try { await Product.findByIdAndDelete(req.params.id); res.json({ message: 'Product deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
