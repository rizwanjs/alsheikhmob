const express = require('express');
const router = express.Router();
const Repair = require('../models/Repair');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.query.status && req.query.status !== 'All') query.status = req.query.status;
    if (req.query.search) query.$or = [{ jobSheetNumber: { $regex: req.query.search, $options: 'i' } }, { customerName: { $regex: req.query.search, $options: 'i' } }, { deviceModel: { $regex: req.query.search, $options: 'i' } }];
    const repairs = await Repair.find(query).populate('technician', 'name').sort({ createdAt: -1 });
    res.json(repairs);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', auth, async (req, res) => {
  try { const repair = new Repair(req.body); await repair.save(); res.status(201).json(repair); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try { const repair = await Repair.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(repair); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try { await Repair.findByIdAndDelete(req.params.id); res.json({ message: 'Repair deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
