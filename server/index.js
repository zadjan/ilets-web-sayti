require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const sitesRoutes = require('./routes/sites');
const hacksRoutes = require('./routes/hacks');
const booksRoutes = require('./routes/books');
const communityRoutes = require('./routes/community');
const usersRoutes = require('./routes/users');
const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sites', sitesRoutes);
app.use('/api/hacks', hacksRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/users', usersRoutes);

// Live statistika
app.get('/api/stats', (req, res) => {
  try {
    const userCount   = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
    const siteCount   = db.prepare("SELECT COUNT(*) as c FROM sites WHERE is_published = 1").get().c;
    const bookCount   = db.prepare('SELECT COUNT(*) as c FROM books WHERE is_published = 1').get().c;
    const questionCount = db.prepare('SELECT COUNT(*) as c FROM questions').get().c;
    const answeredCount = db.prepare('SELECT COUNT(*) as c FROM questions WHERE is_answered = 1').get().c;
    res.json({ userCount, siteCount, bookCount, questionCount, answeredCount });
  } catch {
    res.status(500).json({ message: 'Server xatosi.' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'IELTS Way API ishlayapti!' });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishlamoqda`);
});
