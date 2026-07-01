const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.query.search) query.$or = [{ name: { $regex: req.query.search, $options: 'i' } }, { phone: { $regex: req.query.search, $options: 'i' } }];
    const customers = await Customer.find(query).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', auth, async (req, res) => {
  try { const customer = new Customer(req.body); await customer.save(); res.status(201).json(customer); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try { const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(customer); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try { await Customer.findByIdAndDelete(req.params.id); res.json({ message: 'Customer deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
