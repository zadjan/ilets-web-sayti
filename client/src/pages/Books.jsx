import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';

const levels = [
  { key: 'all', label: 'Barchasi', color: 'bg-slate-500' },
  { key: 'beginner', label: 'Boshlang\'ich', color: 'bg-green-500' },
  { key: 'intermediate', label: 'O\'rta', color: 'bg-yellow-500' },
  { key: 'advanced', label: 'Yuqori', color: 'bg-red-500' },
];

const categories = [
  { key: 'all', label: 'Barchasi' },
  { key: 'General', label: 'Umumiy' },
  { key: 'Grammar', label: 'Grammar' },
  { key: 'Vocabulary', label: 'Vocabulary' },
  { key: 'Speaking', label: 'Speaking' },
  { key: 'Listening', label: 'Listening' },
  { key: 'Reading', label: 'Reading' },
  { key: 'Writing', label: 'Writing' },
];

const levelColors = {
  beginner: 'bg-green-500/20 text-green-300 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const levelLabels = {
  beginner: 'Boshlang\'ich',
  intermediate: 'O\'rta daraja',
  advanced: 'Yuqori daraja',
};

function BookCard({ book, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-sky-200/50 transition-all duration-300 hover:-translate-y-2 border border-sky-100"
    >
      {/* Muqova */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-sky-100 to-indigo-100">
        {book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : null}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Floating animation */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ animation: 'float 4s ease-in-out infinite' }}
        >
          <span className="text-6xl">📚</span>
        </div>
        {/* Level badge */}
        {book.level && (
          <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold border ${levelColors[book.level] || 'bg-gray-500/20 text-gray-300'}`}>
            {levelLabels[book.level] || book.level}
          </div>
        )}
        {/* Category badge */}
        {book.category && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/80 text-sky-700">
            {book.category}
          </div>
        )}
      </div>

      {/* Kontent */}
      <div className="p-5">
        <h3 className="text-air-dark font-bold text-lg mb-1 font-playfair line-clamp-2 leading-snug">{book.name}</h3>
        {book.author && (
          <p className="text-sky-600 text-sm mb-3 font-medium">✍️ {book.author}</p>
        )}
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{book.description}</p>

        {/* PDF tugma */}
        {book.pdf_path ? (
          <a
            href={book.pdf_path}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-sm font-semibold hover:from-sky-400 hover:to-indigo-400 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-sky-500/20"
          >
            <span>📥</span> PDF yuklab olish
          </a>
        ) : (
          <div className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 text-gray-400 text-sm font-semibold cursor-not-allowed">
            <span>🔒</span> PDF mavjud emas
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Books() {
  const [books, setBooks] = useState([]);
  const [level, setLevel] = useState('all');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (level !== 'all') params.set('level', level);
    if (category !== 'all') params.set('category', category);
    const query = params.toString() ? `?${params}` : '';
    setLoading(true);
    api.get(`/books${query}`)
      .then((res) => setBooks(res.data))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, [level, category]);

  return (
    <div className="min-h-screen bg-air-sky text-air-dark">
      <Navbar />

      {/* Hero - Havo dizayni */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden bg-gradient-to-b from-sky-100 via-white to-air-sky">
        {/* Bulut effekt */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/70 rounded-full blur-2xl"
              style={{
                width: `${150 + i * 60}px`,
                height: `${60 + i * 20}px`,
                left: `${10 + i * 22}%`,
                top: `${10 + (i % 2) * 15}%`,
                animation: `float ${4 + i}s ease-in-out ${i * 0.7}s infinite`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-6xl mb-4 block" style={{ animation: 'float 4s ease-in-out infinite' }}>🌤️</span>
            <h1 className="text-5xl md:text-6xl font-extrabold font-playfair mb-4 text-air-dark">
              IELTS{' '}
              <span className="text-sky-500">Kitoblari</span>
            </h1>
            <p className="text-sky-700 text-lg max-w-xl mx-auto">
              Eng yaxshi IELTS kitoblarini PDF ko'rinishida yuklab oling.
              Cambridge, Barron's va boshqa sertifikatlangan nashrlar.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filterlar */}
      <div className="sticky top-16 z-30 bg-air-sky/90 backdrop-blur border-b border-sky-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          {/* Daraja filter */}
          <div className="flex gap-2 justify-center flex-wrap mb-2">
            {levels.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setLevel(key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  level === key
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/30 scale-105'
                    : 'bg-white text-sky-700 hover:bg-sky-50 border border-sky-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {/* Kategoriya filter */}
          <div className="flex gap-2 justify-center flex-wrap">
            {categories.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                  category === key
                    ? 'bg-indigo-600 text-white shadow-md scale-105'
                    : 'bg-white/80 text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kitoblar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-sky-100 h-80 animate-pulse" />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-6xl mb-4 block">📚</span>
            <p className="text-sky-600 text-lg">Bu filtrlarda kitob topilmadi.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {books.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <Footer />
    </div>
  );
}
