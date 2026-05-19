const express = require('express');
const router  = express.Router();
const db      = require('../db/database');
const authMiddleware = require('../middleware/authMiddleware');

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;

const ALLOWED_LEVELS = ['beginner', 'intermediate', 'advanced', ''];
const ALLOWED_SCORES = ['5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5+', ''];

// Ro'yhatdan o'tish (public)
router.post('/register', (req, res) => {
  try {
    const { name, email, goal_score, current_level } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Ism va email majburiy.' });
    }
    if (name.trim().length > 100) {
      return res.status(400).json({ message: 'Ism juda uzun (max 100 belgi).' });
    }
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return res.status(400).json({ message: "Email formati noto'g'ri." });
    }
    if (goal_score && !ALLOWED_SCORES.includes(goal_score)) {
      return res.status(400).json({ message: "Noto'g'ri maqsad ball." });
    }
    if (current_level && !ALLOWED_LEVELS.includes(current_level)) {
      return res.status(400).json({ message: "Noto'g'ri daraja." });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ message: "Bu email allaqachon ro'yhatdan o'tgan." });
    }

    const result = db.prepare(
      'INSERT INTO users (name, email, goal_score, current_level) VALUES (?, ?, ?, ?)'
    ).run(
      name.trim().slice(0, 100),
      email.toLowerCase(),
      goal_score || '',
      current_level || ''
    );

    res.status(201).json({
      message: "Muvaffaqiyatli ro'yhatdan o'tdingiz!",
      id: result.lastInsertRowid,
    });
  } catch (err) {
    console.error('POST /users/register:', err);
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Foydalanuvchilar soni (public)
router.get('/count', (_req, res) => {
  try {
    const { count } = db.prepare('SELECT COUNT(*) as count FROM users').get();
    res.json({ count });
  } catch (err) {
    console.error('GET /users/count:', err);
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Admin: barcha foydalanuvchilar
router.get('/', authMiddleware, (_req, res) => {
  try {
    res.json(
      db.prepare('SELECT id, name, email, goal_score, current_level, created_at FROM users ORDER BY created_at DESC').all()
    );
  } catch (err) {
    console.error('GET /users:', err);
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

module.exports = router;
