const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authMiddleware = require('../middleware/authMiddleware');

// Ro'yhatdan o'tish (public)
router.post('/register', (req, res) => {
  try {
    const { name, email, goal_score, current_level } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Ism va email majburiy.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email formati noto'g'ri." });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ message: 'Bu email allaqachon ro\'yhatdan o\'tgan.' });
    }

    const result = db.prepare(
      'INSERT INTO users (name, email, goal_score, current_level) VALUES (?, ?, ?, ?)'
    ).run(name, email, goal_score || '', current_level || '');

    res.status(201).json({
      message: "Muvaffaqiyatli ro'yhatdan o'tdingiz!",
      id: result.lastInsertRowid,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Foydalanuvchilar soni (public)
router.get('/count', (req, res) => {
  try {
    const { count } = db.prepare('SELECT COUNT(*) as count FROM users').get();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Admin: barcha foydalanuvchilar
router.get('/', authMiddleware, (req, res) => {
  try {
    const users = db.prepare('SELECT id, name, email, goal_score, current_level, created_at FROM users ORDER BY created_at DESC').all();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

module.exports = router;
