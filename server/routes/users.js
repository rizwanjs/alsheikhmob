const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try { const users = await User.find().select('-password'); res.json(users); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role, phone });
    await user.save();
    res.status(201).json({ message: 'User created', user });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try { await User.findByIdAndDelete(req.params.id); res.json({ message: 'User deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
