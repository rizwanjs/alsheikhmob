const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { auth, adminOnly } = require('../middleware/auth');
const backupDir = path.join(__dirname, '../backups');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.db')).map(f => { const stat = fs.statSync(path.join(backupDir, f)); return { name: f, created: stat.mtime, size: stat.size }; }).sort((a, b) => b.created - a.created);
    res.json(files);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/create', auth, adminOnly, async (req, res) => {
  try { const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); const filename = `manual-${timestamp}.db`; const filepath = path.join(backupDir, filename); const backup = { timestamp: new Date().toISOString(), collections: {} }; fs.writeFileSync(filepath, JSON.stringify(backup, null, 2)); res.json({ message: 'Backup created', filename }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
