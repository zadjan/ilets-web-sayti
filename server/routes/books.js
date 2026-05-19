const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../db/database');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, _file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '.pdf');
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Faqat PDF fayl qabul qilinadi.'));
  },
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

const ALLOWED_LEVELS = ['beginner', 'intermediate', 'advanced'];
const ALLOWED_CATEGORIES = ['General', 'Grammar', 'Vocabulary', 'Speaking', 'Listening', 'Reading', 'Writing'];

function toId(val) {
  const n = parseInt(val, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// Barcha kitoblar (public)
router.get('/', (req, res) => {
  try {
    const { level, category } = req.query;
    let query = 'SELECT * FROM books WHERE is_published = 1';
    const params = [];
    if (level && level !== 'all' && ALLOWED_LEVELS.includes(level)) {
      query += ' AND level = ?'; params.push(level);
    }
    if (category && category !== 'all' && ALLOWED_CATEGORIES.includes(category)) {
      query += ' AND category = ?'; params.push(category);
    }
    query += ' ORDER BY created_at DESC';
    res.json(db.prepare(query).all(...params));
  } catch (err) {
    console.error('GET /books:', err);
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Admin: barcha kitoblar
router.get('/admin/all', authMiddleware, (req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM books ORDER BY created_at DESC').all());
  } catch (err) {
    console.error('GET /books/admin/all:', err);
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Yangi kitob qo'shish (admin)
router.post('/', authMiddleware, upload.single('pdf'), (req, res) => {
  try {
    const { name, author, description, level, category, cover_url, is_published } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Kitob nomi majburiy.' });
    }
    const pdf_path = req.file ? `/uploads/${req.file.filename}` : null;
    const result = db.prepare(
      'INSERT INTO books (name, author, description, level, category, cover_url, pdf_path, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(
      name.trim().slice(0, 200),
      (author || '').slice(0, 100),
      (description || '').slice(0, 1000),
      ALLOWED_LEVELS.includes(level) ? level : 'beginner',
      ALLOWED_CATEGORIES.includes(category) ? category : 'General',
      (cover_url || '').slice(0, 500),
      pdf_path,
      is_published !== undefined ? Number(is_published) : 1
    );
    res.status(201).json(db.prepare('SELECT * FROM books WHERE id = ?').get(result.lastInsertRowid));
  } catch (err) {
    console.error('POST /books:', err);
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Kitobni yangilash (admin)
router.put('/:id', authMiddleware, upload.single('pdf'), (req, res) => {
  try {
    const id = toId(req.params.id);
    if (!id) return res.status(400).json({ message: "Noto'g'ri ID." });
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(id);
    if (!book) return res.status(404).json({ message: 'Kitob topilmadi.' });
    const { name, author, description, level, category, cover_url, is_published } = req.body;
    const pdf_path = req.file ? `/uploads/${req.file.filename}` : book.pdf_path;
    db.prepare(
      'UPDATE books SET name=?, author=?, description=?, level=?, category=?, cover_url=?, pdf_path=?, is_published=? WHERE id=?'
    ).run(
      (name ?? book.name).toString().slice(0, 200),
      (author ?? book.author ?? '').toString().slice(0, 100),
      (description ?? book.description ?? '').toString().slice(0, 1000),
      ALLOWED_LEVELS.includes(level) ? level : book.level,
      ALLOWED_CATEGORIES.includes(category) ? category : book.category,
      (cover_url ?? book.cover_url ?? '').toString().slice(0, 500),
      pdf_path,
      is_published !== undefined ? Number(is_published) : book.is_published,
      id
    );
    res.json(db.prepare('SELECT * FROM books WHERE id = ?').get(id));
  } catch (err) {
    console.error('PUT /books/:id:', err);
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Kitobni o'chirish (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const id = toId(req.params.id);
    if (!id) return res.status(400).json({ message: "Noto'g'ri ID." });
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(id);
    if (!book) return res.status(404).json({ message: 'Kitob topilmadi.' });
    if (book.pdf_path && book.pdf_path.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', book.pdf_path);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    db.prepare('DELETE FROM books WHERE id = ?').run(id);
    res.json({ message: "Kitob o'chirildi." });
  } catch (err) {
    console.error('DELETE /books/:id:', err);
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

module.exports = router;
