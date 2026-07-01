const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.query.search) query.$or = [{ action: { $regex: req.query.search, $options: 'i' } }, { userName: { $regex: req.query.search, $options: 'i' } }];
    if (req.query.entity && req.query.entity !== 'All entities') query.entity = req.query.entity;
    const logs = await ActivityLog.find(query).populate('user', 'name').sort({ createdAt: -1 }).limit(500);
    res.json(logs);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', auth, async (req, res) => {
  try { const log = new ActivityLog({ ...req.body, user: req.user.id, userName: req.user.name }); await log.save(); res.status(201).json(log); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
