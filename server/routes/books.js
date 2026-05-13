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
  destination: (req, file, cb) => cb(null, uploadsDir),
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Faqat PDF fayl qabul qilinadi.'));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Barcha kitoblar (public)
router.get('/', (req, res) => {
  try {
    const { level, category } = req.query;
    let query = 'SELECT * FROM books WHERE is_published = 1';
    const params = [];
    if (level && level !== 'all') { query += ' AND level = ?'; params.push(level); }
    if (category && category !== 'all') { query += ' AND category = ?'; params.push(category); }
    query += ' ORDER BY created_at DESC';
    const books = db.prepare(query).all(...params);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Admin: barcha kitoblar
router.get('/admin/all', authMiddleware, (req, res) => {
  try {
    const books = db.prepare('SELECT * FROM books ORDER BY created_at DESC').all();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Yangi kitob qo'shish (admin) - PDF bilan
router.post('/', authMiddleware, upload.single('pdf'), (req, res) => {
  try {
    const { name, author, description, level, category, cover_url, is_published } = req.body;
    if (!name) return res.status(400).json({ message: 'Kitob nomi majburiy.' });
    const pdf_path = req.file ? `/uploads/${req.file.filename}` : null;
    const result = db.prepare(
      'INSERT INTO books (name, author, description, level, category, cover_url, pdf_path, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(name, author || '', description || '', level || 'beginner', category || 'General', cover_url || '', pdf_path, is_published !== undefined ? is_published : 1);
    const newBook = db.prepare('SELECT * FROM books WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi: ' + err.message });
  }
});

// Kitobni yangilash (admin)
router.put('/:id', authMiddleware, upload.single('pdf'), (req, res) => {
  try {
    const { id } = req.params;
    const { name, author, description, level, category, cover_url, is_published } = req.body;
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(id);
    if (!book) return res.status(404).json({ message: 'Kitob topilmadi.' });
    const pdf_path = req.file ? `/uploads/${req.file.filename}` : book.pdf_path;
    db.prepare(
      'UPDATE books SET name=?, author=?, description=?, level=?, category=?, cover_url=?, pdf_path=?, is_published=? WHERE id=?'
    ).run(
      name ?? book.name,
      author ?? book.author,
      description ?? book.description,
      level ?? book.level,
      category ?? book.category,
      cover_url ?? book.cover_url,
      pdf_path,
      is_published !== undefined ? is_published : book.is_published,
      id
    );
    const updated = db.prepare('SELECT * FROM books WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Kitobni o'chirish (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(id);
    if (!book) return res.status(404).json({ message: 'Kitob topilmadi.' });
    // PDF faylni o'chirish
    if (book.pdf_path) {
      const filePath = path.join(__dirname, '..', book.pdf_path);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    db.prepare('DELETE FROM books WHERE id = ?').run(id);
    res.json({ message: 'Kitob o\'chirildi.' });
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

module.exports = router;
