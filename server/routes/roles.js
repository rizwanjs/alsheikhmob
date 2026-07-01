const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try { const roles = await Role.find().sort({ createdAt: -1 }); res.json(roles); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try { const role = new Role(req.body); await role.save(); res.status(201).json(role); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try { const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(role); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try { await Role.findByIdAndDelete(req.params.id); res.json({ message: 'Role deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
