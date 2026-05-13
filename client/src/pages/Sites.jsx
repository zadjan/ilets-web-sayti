import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';

const filterBtns = [
  { key: 'all', label: 'Barchasi' },
  { key: 'youtube', label: '▶ YouTube' },
  { key: 'telegram', label: '✈️ Telegram' },
];

function FireParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${10 + i * 8}%`,
            bottom: `${5 + (i % 3) * 10}%`,
            width: `${4 + (i % 4) * 2}px`,
            height: `${4 + (i % 4) * 2}px`,
            background: i % 2 === 0 ? '#FF4500' : '#FF8C00',
            opacity: 0.6,
            animation: `riseUp ${1 + (i % 3) * 0.5}s ease-in ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function SiteCard({ site }) {
  const isYoutube = site.type === 'youtube';
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="relative group rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 hover:border-orange-500/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/20"
    >
      {/* Olov border animatsiyasi */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-2xl border-2 border-orange-500/0 group-hover:border-orange-500/40 transition-all duration-300" />
      </div>

      {/* Thumbnail/Rasm */}
      <div className="relative h-44 overflow-hidden">
        {site.image_url ? (
          <img
            src={site.image_url}
            alt={site.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : null}
        <div className={`absolute inset-0 ${isYoutube ? 'bg-gradient-to-br from-red-900/80 to-orange-900/80' : 'bg-gradient-to-br from-blue-900/80 to-cyan-900/80'} flex items-center justify-center`}>
          <span className="text-5xl">{isYoutube ? '▶️' : '✈️'}</span>
        </div>
        {/* Tur belgisi */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${isYoutube ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
          {isYoutube ? 'YouTube' : 'Telegram'}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-white font-bold text-lg mb-2 font-oswald truncate">{site.name}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{site.description}</p>

        <div className="flex items-center justify-between">
          {site.members_count && (
            <span className="text-orange-400 text-sm font-medium">
              👥 {site.members_count}
            </span>
          )}
          <a
            href={site.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95 ${
              isYoutube
                ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-lg shadow-red-500/20'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/20'
            }`}
          >
            {isYoutube ? 'Kanalga o\'tish →' : 'Kanalga kirish →'}
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Sites() {
  const [sites, setSites] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = filter !== 'all' ? `?type=${filter}` : '';
    api.get(`/sites${params}`)
      .then((res) => setSites(res.data))
      .catch(() => setSites([]))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-red-950/60 via-orange-950/40 to-gray-950" />
          <FireParticles />
          {/* Olov glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-6xl mb-4 block animate-bounce">🔥</span>
            <h1 className="text-5xl md:text-6xl font-extrabold font-oswald mb-4 text-white">
              Foydali{' '}
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Kanallar
              </span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">
              IELTS o'rganish uchun eng yaxshi YouTube va Telegram kanallar.
              Eng samarali o'qituvchilardan to'g'ridan-to'g'ri o'rganing!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-16 z-30 bg-gray-950/90 backdrop-blur py-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex gap-3 justify-center">
          {filterBtns.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                filter === key
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30 scale-105'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Kanallar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/5 h-64 animate-pulse" />
            ))}
          </div>
        ) : sites.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-6xl mb-4 block">🔥</span>
            <p className="text-gray-400 text-lg">Hozircha kanal yo'q. Tez orada qo'shiladi!</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {sites.map((site) => (
                <SiteCard key={site.id} site={site} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <Footer />
    </div>
  );
}
