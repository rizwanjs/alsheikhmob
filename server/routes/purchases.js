const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.query.status && req.query.status !== 'All') query.status = req.query.status;
    if (req.query.search) query.$or = [{ reference: { $regex: req.query.search, $options: 'i' } }];
    const purchases = await Purchase.find(query).populate('supplier', 'name').populate('items.product', 'name sku').sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { reference, supplier, items, subtotal, discount, tax, total, paid, notes } = req.body;
    for (const item of items) {
      if (item.product) await Product.findByIdAndUpdate(item.product, { $inc: { quantity: item.quantity } });
    }
    const purchase = new Purchase({ reference, supplier, items, subtotal, discount, tax, total, paid, outstanding: total - paid, notes, status: paid >= total ? 'Completed' : (paid > 0 ? 'Partial' : 'Pending') });
    await purchase.save();
    res.status(201).json(purchase);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
