const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.query.search) query.$or = [{ name: { $regex: req.query.search, $options: 'i' } }, { phone: { $regex: req.query.search, $options: 'i' } }];
    const suppliers = await Supplier.find(query).sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', auth, async (req, res) => {
  try { const supplier = new Supplier(req.body); await supplier.save(); res.status(201).json(supplier); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try { const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(supplier); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try { await Supplier.findByIdAndDelete(req.params.id); res.json({ message: 'Supplier deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
