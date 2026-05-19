const express = require('express');
const router  = express.Router();
const db      = require('../db/database');
const authMiddleware = require('../middleware/authMiddleware');

function toId(val) {
  const n = parseInt(val, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// Barcha usullar (public)
router.get('/', (_req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM hacks WHERE is_published = 1 ORDER BY created_at DESC').all());
  } catch (err) {
    console.error('GET /hacks:', err);
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Admin: barcha usullar
router.get('/admin/all', authMiddleware, (_req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM hacks ORDER BY created_at DESC').all());
  } catch (err) {
    console.error('GET /hacks/admin/all:', err);
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Yangi usul qo'shish (admin)
router.post('/', authMiddleware, (req, res) => {
  try {
    const { name, description, guide, video_link, image_url, is_published } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Nom majburiy.' });
    }
    const result = db.prepare(
      'INSERT INTO hacks (name, description, guide, video_link, image_url, is_published) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(
      name.trim().slice(0, 200),
      (description || '').slice(0, 500),
      (guide || '').slice(0, 2000),
      (video_link || '').slice(0, 500),
      (image_url || '').slice(0, 500),
      is_published !== undefined ? Number(is_published) : 1
    );
    res.status(201).json(db.prepare('SELECT * FROM hacks WHERE id = ?').get(result.lastInsertRowid));
  } catch (err) {
    console.error('POST /hacks:', err);
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Usulni yangilash (admin)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const id = toId(req.params.id);
    if (!id) return res.status(400).json({ message: "Noto'g'ri ID." });
    const hack = db.prepare('SELECT * FROM hacks WHERE id = ?').get(id);
    if (!hack) return res.status(404).json({ message: 'Usul topilmadi.' });
    const { name, description, guide, video_link, image_url, is_published } = req.body;
    db.prepare(
      'UPDATE hacks SET name=?, description=?, guide=?, video_link=?, image_url=?, is_published=? WHERE id=?'
    ).run(
      (name ?? hack.name).toString().slice(0, 200),
      (description ?? hack.description ?? '').toString().slice(0, 500),
      (guide ?? hack.guide ?? '').toString().slice(0, 2000),
      (video_link ?? hack.video_link ?? '').toString().slice(0, 500),
      (image_url ?? hack.image_url ?? '').toString().slice(0, 500),
      is_published !== undefined ? Number(is_published) : hack.is_published,
      id
    );
    res.json(db.prepare('SELECT * FROM hacks WHERE id = ?').get(id));
  } catch (err) {
    console.error('PUT /hacks/:id:', err);
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Usulni o'chirish (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const id = toId(req.params.id);
    if (!id) return res.status(400).json({ message: "Noto'g'ri ID." });
    const hack = db.prepare('SELECT * FROM hacks WHERE id = ?').get(id);
    if (!hack) return res.status(404).json({ message: 'Usul topilmadi.' });
    db.prepare('DELETE FROM hacks WHERE id = ?').run(id);
    res.json({ message: "Usul o'chirildi." });
  } catch (err) {
    console.error('DELETE /hacks/:id:', err);
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

module.exports = router;
