const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authMiddleware = require('../middleware/authMiddleware');

// Barcha kanallar (public) - faqat published
router.get('/', (req, res) => {
  try {
    const { type } = req.query;
    let sites;
    if (type && type !== 'all') {
      sites = db.prepare('SELECT * FROM sites WHERE is_published = 1 AND type = ? ORDER BY created_at DESC').all(type);
    } else {
      sites = db.prepare('SELECT * FROM sites WHERE is_published = 1 ORDER BY created_at DESC').all();
    }
    res.json(sites);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Admin: barcha kanallar
router.get('/admin/all', authMiddleware, (req, res) => {
  try {
    const sites = db.prepare('SELECT * FROM sites ORDER BY created_at DESC').all();
    res.json(sites);
  } catch (err) {
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
    const result = db.prepare(
      'INSERT INTO sites (type, name, description, link, image_url, members_count, is_published) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(type, name, description || '', link, image_url || '', members_count || '', is_published !== undefined ? is_published : 1);
    const newSite = db.prepare('SELECT * FROM sites WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newSite);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Kanalni yangilash (admin)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { type, name, description, link, image_url, members_count, is_published } = req.body;
    const site = db.prepare('SELECT * FROM sites WHERE id = ?').get(id);
    if (!site) return res.status(404).json({ message: 'Kanal topilmadi.' });
    db.prepare(
      'UPDATE sites SET type=?, name=?, description=?, link=?, image_url=?, members_count=?, is_published=? WHERE id=?'
    ).run(
      type ?? site.type,
      name ?? site.name,
      description ?? site.description,
      link ?? site.link,
      image_url ?? site.image_url,
      members_count ?? site.members_count,
      is_published !== undefined ? is_published : site.is_published,
      id
    );
    const updated = db.prepare('SELECT * FROM sites WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

// Kanalni o'chirish (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const site = db.prepare('SELECT * FROM sites WHERE id = ?').get(id);
    if (!site) return res.status(404).json({ message: 'Kanal topilmadi.' });
    db.prepare('DELETE FROM sites WHERE id = ?').run(id);
    res.json({ message: 'Kanal o\'chirildi.' });
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

module.exports = router;
