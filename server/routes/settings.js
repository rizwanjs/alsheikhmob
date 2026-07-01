const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try { let settings = await Setting.findOne(); if (!settings) { settings = new Setting(); await settings.save(); } res.json(settings); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/', auth, async (req, res) => {
  try { let settings = await Setting.findOne(); if (!settings) { settings = new Setting(req.body); } else { Object.assign(settings, req.body); } settings.updatedAt = new Date(); await settings.save(); res.json(settings); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
