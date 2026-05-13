require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const sitesRoutes = require('./routes/sites');
const hacksRoutes = require('./routes/hacks');
const booksRoutes = require('./routes/books');
const communityRoutes = require('./routes/community');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - PDF uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sites', sitesRoutes);
app.use('/api/hacks', hacksRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/community', communityRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'IELTS Hub UZ API ishlayapti!' });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishlamoqda`);
});
