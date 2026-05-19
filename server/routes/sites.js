const express = require('express');
const router  = express.Router();
const db      = require('../db/database');
const authMiddleware = require('../middleware/authMiddleware');

const ALLOWED_TYPES = ['youtube', 'telegram'];

function toId(val) {
  const n = parseInt(val, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// Barcha kanallar (public)
router.get('/', (req, res) => {
  try {
    const { type } = req.query;
    if (type && type !== 'all' && !ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({ message: "Noto'g'ri tur." });
    }
    const sites = (type && type !== 'all')
      ? db.prepare('SELECT * FROM sites WHERE is_published = 1 AND type = ? ORDER BY created_at DESC').all(type)
      : db.prepare('SELECT * FROM sites WHERE is_published = 1 ORDER BY created_at DESC').all();
    res.json(sites);
  } catch (err) {
    console.error('GET /sites:', err);
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Admin: barcha kanallar
router.get('/admin/all', authMiddleware, (_req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM sites ORDER BY created_at DESC').all());
  } catch (err) {
    console.error('GET /sites/admin/all:', err);
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Yangi kanal qo'shish (admin)
router.post('/', authMiddleware, (req, res) => {
  try {
    const { type, name, description, link, image_url, members_count, is_published } = req.body;
    if (!type || !name || !link) {
      return res.status(400).json({ message: 'Tur, nom va link majburiy.' });
    }
    if (!ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({ message: "Noto'g'ri tur. 'youtube' yoki 'telegram' bo'lishi kerak." });
    }
    const result = db.prepare(
      'INSERT INTO sites (type, name, description, link, image_url, members_count, is_published) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(
      type,
      name.toString().slice(0, 200),
      (description || '').toString().slice(0, 500),
      link.toString().slice(0, 500),
      (image_url || '').toString().slice(0, 500),
      (members_count || '').toString().slice(0, 20),
      is_published !== undefined ? Number(is_published) : 1
    );
    res.status(201).json(db.prepare('SELECT * FROM sites WHERE id = ?').get(result.lastInsertRowid));
  } catch (err) {
    console.error('POST /sites:', err);
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Kanalni yangilash (admin)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const id = toId(req.params.id);
    if (!id) return res.status(400).json({ message: "Noto'g'ri ID." });
    const site = db.prepare('SELECT * FROM sites WHERE id = ?').get(id);
    if (!site) return res.status(404).json({ message: 'Kanal topilmadi.' });
    const { type, name, description, link, image_url, members_count, is_published } = req.body;
    if (type && !ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({ message: "Noto'g'ri tur." });
    }
    db.prepare(
      'UPDATE sites SET type=?, name=?, description=?, link=?, image_url=?, members_count=?, is_published=? WHERE id=?'
    ).run(
      type ?? site.type,
      (name ?? site.name).toString().slice(0, 200),
      (description ?? site.description ?? '').toString().slice(0, 500),
      (link ?? site.link).toString().slice(0, 500),
      (image_url ?? site.image_url ?? '').toString().slice(0, 500),
      (members_count ?? site.members_count ?? '').toString().slice(0, 20),
      is_published !== undefined ? Number(is_published) : site.is_published,
      id
    );
    res.json(db.prepare('SELECT * FROM sites WHERE id = ?').get(id));
  } catch (err) {
    console.error('PUT /sites/:id:', err);
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Kanalni o'chirish (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const id = toId(req.params.id);
    if (!id) return res.status(400).json({ message: "Noto'g'ri ID." });
    const site = db.prepare('SELECT * FROM sites WHERE id = ?').get(id);
    if (!site) return res.status(404).json({ message: 'Kanal topilmadi.' });
    db.prepare('DELETE FROM sites WHERE id = ?').run(id);
    res.json({ message: "Kanal o'chirildi." });
  } catch (err) {
    console.error('DELETE /sites/:id:', err);
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

module.exports = router;
