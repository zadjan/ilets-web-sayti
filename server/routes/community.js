const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authMiddleware = require('../middleware/authMiddleware');

// ===== SAVOLLAR (Q&A) =====

// Barcha savollar (public - faqat javob berilganlar)
router.get('/questions', (req, res) => {
  try {
    const questions = db.prepare(
      'SELECT id, user_name, question, answer, is_answered, created_at FROM questions ORDER BY created_at DESC'
    ).all();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Foydalanuvchi savol qo'yadi (public)
router.post('/questions', (req, res) => {
  try {
    const { user_name, email, question } = req.body;
    if (!user_name || !question) {
      return res.status(400).json({ message: 'Ism va savol majburiy.' });
    }
    const result = db.prepare(
      'INSERT INTO questions (user_name, email, question) VALUES (?, ?, ?)'
    ).run(user_name, email || '', question);
    const newQuestion = db.prepare('SELECT * FROM questions WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Admin: barcha savollar
router.get('/admin/questions', authMiddleware, (req, res) => {
  try {
    const questions = db.prepare('SELECT * FROM questions ORDER BY created_at DESC').all();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Admin: savolga javob berish
router.put('/questions/:id/answer', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    if (!answer) return res.status(400).json({ message: 'Javob majburiy.' });
    const question = db.prepare('SELECT * FROM questions WHERE id = ?').get(id);
    if (!question) return res.status(404).json({ message: 'Savol topilmadi.' });
    db.prepare('UPDATE questions SET answer = ?, is_answered = 1 WHERE id = ?').run(answer, id);
    const updated = db.prepare('SELECT * FROM questions WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Admin: savolni o'chirish
router.delete('/questions/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const question = db.prepare('SELECT * FROM questions WHERE id = ?').get(id);
    if (!question) return res.status(404).json({ message: 'Savol topilmadi.' });
    db.prepare('DELETE FROM questions WHERE id = ?').run(id);
    res.json({ message: 'Savol o\'chirildi.' });
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// ===== MOTIVATSION POSTLAR =====

// Barcha postlar (public)
router.get('/posts', (req, res) => {
  try {
    const posts = db.prepare('SELECT * FROM motivational_posts ORDER BY created_at DESC').all();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Admin: post qo'shish
router.post('/posts', authMiddleware, (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Sarlavha va matn majburiy.' });
    const result = db.prepare('INSERT INTO motivational_posts (title, content) VALUES (?, ?)').run(title, content);
    const newPost = db.prepare('SELECT * FROM motivational_posts WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Admin: postni o'chirish
router.delete('/posts/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM motivational_posts WHERE id = ?').run(id);
    res.json({ message: 'Post o\'chirildi.' });
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// ===== TESTIMONIALLAR =====

// Barcha testimoniallar (public)
router.get('/testimonials', (req, res) => {
  try {
    const testimonials = db.prepare('SELECT * FROM testimonials ORDER BY created_at DESC').all();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Admin: testimonial qo'shish
router.post('/testimonials', authMiddleware, (req, res) => {
  try {
    const { name, text, rating } = req.body;
    if (!name || !text) return res.status(400).json({ message: 'Ism va matn majburiy.' });
    const result = db.prepare('INSERT INTO testimonials (name, text, rating) VALUES (?, ?, ?)').run(name, text, rating || 5);
    const newT = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newT);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Admin: testimonial o'chirish
router.delete('/testimonials/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM testimonials WHERE id = ?').run(id);
    res.json({ message: 'Testimonial o\'chirildi.' });
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// ===== STATISTIKA =====
router.get('/stats', (req, res) => {
  try {
    const questionCount = db.prepare('SELECT COUNT(*) as count FROM questions').get().count;
    const answeredCount = db.prepare('SELECT COUNT(*) as count FROM questions WHERE is_answered = 1').get().count;
    const testimonialCount = db.prepare('SELECT COUNT(*) as count FROM testimonials').get().count;
    res.json({ questionCount, answeredCount, testimonialCount });
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

module.exports = router;
