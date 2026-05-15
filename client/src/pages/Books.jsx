import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { useLanguage } from '../contexts/LanguageContext';

const levelColors = {
  beginner:     'bg-green-500/20 text-green-300 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  advanced:     'bg-red-500/20 text-red-300 border-red-500/30',
};

const levelKeys    = ['all', 'beginner', 'intermediate', 'advanced'];
const categoryKeys = ['all', 'General', 'Grammar', 'Vocabulary', 'Speaking', 'Listening', 'Reading', 'Writing'];

function WindParticles() {
  const streaks = [
    { top: '8%',  left: '-5%', w: 120, delay: 0,    dur: 2.4 },
    { top: '18%', left: '15%', w: 80,  delay: 0.6,  dur: 2.0 },
    { top: '30%', left: '-8%', w: 160, delay: 0.2,  dur: 3.0 },
    { top: '42%', left: '5%',  w: 60,  delay: 1.1,  dur: 1.8 },
    { top: '55%', left: '-3%', w: 110, delay: 0.4,  dur: 2.6 },
    { top: '66%', left: '20%', w: 90,  delay: 0.9,  dur: 2.2 },
    { top: '75%', left: '-6%', w: 140, delay: 0.15, dur: 2.8 },
    { top: '88%', left: '10%', w: 70,  delay: 0.7,  dur: 2.0 },
    { top: '12%', left: '60%', w: 100, delay: 0.3,  dur: 2.5 },
    { top: '35%', left: '70%', w: 75,  delay: 0.85, dur: 2.1 },
    { top: '60%', left: '55%', w: 130, delay: 0.5,  dur: 2.9 },
    { top: '80%', left: '75%', w: 55,  delay: 1.2,  dur: 1.9 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {streaks.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: s.top,
            left: s.left,
            width: `${s.w}px`,
            height: '1.5px',
            borderRadius: '4px',
            background: `linear-gradient(90deg, transparent, rgba(147,210,250,${0.12 + (i % 3) * 0.06}), transparent)`,
            animation: `windFlow ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      {/* Yumaloq shamol zarrachalari */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`dot-${i}`}
          style={{
            position: 'absolute',
            top: `${10 + i * 11}%`,
            left: `${(i * 14) % 90}%`,
            width: `${2 + (i % 2)}px`,
            height: `${2 + (i % 2)}px`,
            borderRadius: '50%',
            background: `rgba(147,210,250,${0.08 + (i % 3) * 0.04})`,
            animation: `windDot ${2.2 + (i % 3) * 0.5}s ease-in-out ${i * 0.4}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function BookCard({ book, index, t }) {
  const ts = t.books;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="group bg-gray-900 rounded-2xl overflow-hidden border border-white/8 hover:border-sky-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/10"
    >
      {/* Muqova */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-indigo-950 to-sky-950">
        {book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-14 h-14 text-sky-800/50 group-hover:text-sky-700/70 transition-colors duration-300"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <line x1="12" y1="7" x2="16" y2="7" />
              <line x1="12" y1="11" x2="16" y2="11" />
              <line x1="8"  y1="7" x2="9"  y2="7" />
              <line x1="8"  y1="11" x2="9" y2="11" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent" />

        {book.level && (
          <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold border ${levelColors[book.level] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
            {ts.levels[book.level] || book.level}
          </span>
        )}
        {book.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-900/80 text-sky-300 border border-sky-500/30 backdrop-blur-sm">
            {ts.categories[book.category] || book.category}
          </span>
        )}
      </div>

      {/* Matn */}
      <div className="p-5">
        <h3 className="text-white font-bold text-base mb-1 line-clamp-2 leading-snug">{book.name}</h3>
        {book.author && (
          <p className="text-sky-400/70 text-xs mb-3">{ts.author}: {book.author}</p>
        )}
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{book.description}</p>

        {book.pdf_path ? (
          <a
            href={book.pdf_path}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-md shadow-sky-900/30"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {ts.downloadBtn}
          </a>
        ) : (
          <div className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 text-gray-600 text-sm font-medium cursor-not-allowed border border-white/5">
            {ts.noFile}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Books() {
  const [books, setBooks]       = useState([]);
  const [level, setLevel]       = useState('all');
  const [category, setCategory] = useState('all');
  const [loading, setLoading]   = useState(true);
  const { t } = useLanguage();
  const ts = t.books;

  useEffect(() => {
    const params = new URLSearchParams();
    if (level    !== 'all') params.set('level',    level);
    if (category !== 'all') params.set('category', category);
    const query = params.toString() ? `?${params}` : '';
    setLoading(true);
    api.get(`/books${query}`)
      .then((res) => setBooks(res.data))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, [level, category]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <style>{`
        @keyframes windFlow {
          0%   { transform: translateX(-40px) scaleX(0.5); opacity: 0; }
          35%  { opacity: 1; }
          100% { transform: translateX(90px)  scaleX(1.3); opacity: 0; }
        }
        @keyframes windDot {
          0%   { transform: translateX(-20px); opacity: 0; }
          40%  { opacity: 0.8; }
          100% { transform: translateX(50px);  opacity: 0; }
        }
      `}</style>

      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/60 via-sky-950/40 to-gray-950" />
          <WindParticles />
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-sky-500/6 rounded-full blur-3xl" />
          <div className="absolute top-16 right-1/4 w-72 h-72 bg-indigo-500/6 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-24 bg-sky-500/5 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl md:text-6xl font-extrabold font-oswald mb-4">
              <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                {ts.title}
              </span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">{ts.subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Filterlar */}
      <div className="sticky top-16 z-30 bg-gray-950/90 backdrop-blur border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4">
          {/* Daraja filtri */}
          <div className="flex gap-2 justify-center flex-wrap mb-3">
            {levelKeys.map((key) => (
              <button
                key={key}
                onClick={() => setLevel(key)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  level === key
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25 scale-105'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {ts.levels[key]}
              </button>
            ))}
          </div>
          {/* Kategoriya filtri */}
          <div className="flex gap-2 justify-center flex-wrap">
            {categoryKeys.map((key) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                  category === key
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 scale-105'
                    : 'bg-white/5 text-gray-500 hover:bg-white/8 hover:text-gray-300 border border-white/8'
                }`}
              >
                {ts.categories[key] || key}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kitoblar ro'yxati */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/5 h-80 animate-pulse" />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg">{ts.empty}</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {books.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} t={t} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <Footer />
    </div>
  );
}
