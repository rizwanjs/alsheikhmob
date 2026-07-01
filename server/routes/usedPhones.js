const express = require('express');
const router = express.Router();
const UsedPhone = require('../models/UsedPhone');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.query.status && req.query.status !== 'All') query.status = req.query.status;
    if (req.query.search) query.$or = [{ imei: { $regex: req.query.search, $options: 'i' } }, { model: { $regex: req.query.search, $options: 'i' } }, { brand: { $regex: req.query.search, $options: 'i' } }];
    const phones = await UsedPhone.find(query).populate('supplier', 'name').sort({ createdAt: -1 });
    res.json(phones);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', auth, async (req, res) => {
  try { const phone = new UsedPhone(req.body); await phone.save(); res.status(201).json(phone); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try { const phone = await UsedPhone.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(phone); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try { await UsedPhone.findByIdAndDelete(req.params.id); res.json({ message: 'Phone deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
