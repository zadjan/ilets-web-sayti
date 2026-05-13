const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authMiddleware = require('../middleware/authMiddleware');

// Barcha usullar (public)
router.get('/', (req, res) => {
  try {
    const hacks = db.prepare('SELECT * FROM hacks WHERE is_published = 1 ORDER BY created_at DESC').all();
    res.json(hacks);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Admin: barcha usullar
router.get('/admin/all', authMiddleware, (req, res) => {
  try {
    const hacks = db.prepare('SELECT * FROM hacks ORDER BY created_at DESC').all();
    res.json(hacks);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Yangi usul qo'shish (admin)
router.post('/', authMiddleware, (req, res) => {
  try {
    const { name, description, guide, video_link, image_url, is_published } = req.body;
    if (!name) return res.status(400).json({ message: 'Nom majburiy.' });
    const result = db.prepare(
      'INSERT INTO hacks (name, description, guide, video_link, image_url, is_published) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(name, description || '', guide || '', video_link || '', image_url || '', is_published !== undefined ? is_published : 1);
    const newHack = db.prepare('SELECT * FROM hacks WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newHack);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Usulni yangilash (admin)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, guide, video_link, image_url, is_published } = req.body;
    const hack = db.prepare('SELECT * FROM hacks WHERE id = ?').get(id);
    if (!hack) return res.status(404).json({ message: 'Usul topilmadi.' });
    db.prepare(
      'UPDATE hacks SET name=?, description=?, guide=?, video_link=?, image_url=?, is_published=? WHERE id=?'
    ).run(
      name ?? hack.name,
      description ?? hack.description,
      guide ?? hack.guide,
      video_link ?? hack.video_link,
      image_url ?? hack.image_url,
      is_published !== undefined ? is_published : hack.is_published,
      id
    );
    const updated = db.prepare('SELECT * FROM hacks WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Usulni o'chirish (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const hack = db.prepare('SELECT * FROM hacks WHERE id = ?').get(id);
    if (!hack) return res.status(404).json({ message: 'Usul topilmadi.' });
    db.prepare('DELETE FROM hacks WHERE id = ?').run(id);
    res.json({ message: 'Usul o\'chirildi.' });
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

module.exports = router;
