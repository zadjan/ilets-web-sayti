require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const authRoutes      = require('./routes/auth');
const sitesRoutes     = require('./routes/sites');
const hacksRoutes     = require('./routes/hacks');
const booksRoutes     = require('./routes/books');
const communityRoutes = require('./routes/community');
const usersRoutes     = require('./routes/users');
const db              = require('./db/database');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Xavfsizlik headerlari ─────────────────────────────────────────
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ── CORS ──────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error('CORS: ruxsat etilmagan manba.'));
  },
  credentials: true,
}));

// ── Body parsing (1 MB cheklov) ───────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ── Statik fayllar ────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routelar ──────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/sites',     sitesRoutes);
app.use('/api/hacks',     hacksRoutes);
app.use('/api/books',     booksRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/users',     usersRoutes);

// ── Jonli statistika ──────────────────────────────────────────────
app.get('/api/stats', (_req, res) => {
  try {
    const userCount     = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
    const siteCount     = db.prepare('SELECT COUNT(*) as c FROM sites WHERE is_published = 1').get().c;
    const bookCount     = db.prepare('SELECT COUNT(*) as c FROM books WHERE is_published = 1').get().c;
    const questionCount = db.prepare('SELECT COUNT(*) as c FROM questions').get().c;
    const answeredCount = db.prepare('SELECT COUNT(*) as c FROM questions WHERE is_answered = 1').get().c;
    res.json({ userCount, siteCount, bookCount, questionCount, answeredCount });
  } catch (err) {
    console.error('GET /api/stats:', err);
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

app.get('/', (_req, res) => res.json({ message: 'IELTS Way API ishlayapti!' }));

// ── 404 ───────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Endpoint topilmadi.' }));

app.listen(PORT, () => console.log(`Server ${PORT}-portda ishlamoqda`));
