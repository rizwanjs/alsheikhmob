const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.query.category) query.category = req.query.category;
    if (req.query.startDate && req.query.endDate) query.date = { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) };
    const expenses = await Expense.find(query).populate('createdBy', 'name').sort({ date: -1 });
    res.json(expenses);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', auth, async (req, res) => {
  try { const expense = new Expense({ ...req.body, createdBy: req.user.id }); await expense.save(); res.status(201).json(expense); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try { const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(expense); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try { await Expense.findByIdAndDelete(req.params.id); res.json({ message: 'Expense deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
