const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Brute-force himoya: IP bo'yicha urinishlarni kuzatish
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 daqiqa

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip) || { count: 0, resetAt: now + WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + WINDOW_MS;
  }
  return entry;
}

// Admin login
router.post('/login', (req, res) => {
  const ip = req.ip;
  const entry = checkRateLimit(ip);

  if (entry.count >= MAX_ATTEMPTS) {
    return res.status(429).json({
      message: "Juda ko'p urinish. 15 daqiqadan keyin qayta urinib ko'ring.",
    });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username va parol kiritilishi shart.' });
  }

  if (username.length > 50 || password.length > 100) {
    return res.status(400).json({ message: "Noto'g'ri ma'lumot." });
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword || !process.env.JWT_SECRET) {
    console.error('MUHIM: ADMIN_USERNAME, ADMIN_PASSWORD yoki JWT_SECRET .env da topilmadi!');
    return res.status(500).json({ message: 'Server konfiguratsiyasi xatosi.' });
  }

  if (username !== adminUsername || password !== adminPassword) {
    entry.count++;
    loginAttempts.set(ip, entry);
    return res.status(401).json({ message: "Username yoki parol noto'g'ri." });
  }

  // Muvaffaqiyatli kirish — urinishlarni tozalash
  loginAttempts.delete(ip);

  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    message: 'Muvaffaqiyatli kirildi!',
    token,
    user: { username, role: 'admin' },
  });
});

// Token tekshirish
router.get('/verify', (req, res) => {
  const token = (req.headers['authorization'] || '').split(' ')[1];
  if (!token) return res.status(401).json({ valid: false });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch {
    res.status(403).json({ valid: false });
  }
});

module.exports = router;
