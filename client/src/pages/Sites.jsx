import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { useLanguage } from '../contexts/LanguageContext';

// YouTube video ID ni URL dan ajratib olish
function getVideoId(url) {
  if (!url) return null;
  const match =
    url.match(/[?&]v=([^&#]+)/) ||
    url.match(/youtu\.be\/([^?&#]+)/) ||
    url.match(/embed\/([^?&#]+)/);
  return match ? match[1] : null;
}

function isVideoUrl(url) {
  return !!getVideoId(url);
}

function FireParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${8 + i * 9}%`,
            bottom: `${5 + (i % 3) * 10}%`,
            width: `${3 + (i % 4) * 2}px`,
            height: `${3 + (i % 4) * 2}px`,
            background: i % 2 === 0 ? '#FF4500' : '#FF8C00',
            opacity: 0.5,
            animation: `riseUp ${1 + (i % 3) * 0.5}s ease-in ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// Video karta
function VideoCard({ site }) {
  const videoId = getVideoId(site.link);
  const [thumbSrc, setThumbSrc] = useState(
    videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  );
  const [thumbFailed, setThumbFailed] = useState(false);

  const handleThumbError = () => {
    if (!thumbFailed && videoId && thumbSrc?.includes('maxresdefault')) {
      // maxresdefault yo'q bo'lsa hqdefault ga tush
      setThumbSrc(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
      setThumbFailed(true);
    }
  };

  const [channel, ...titleParts] = site.name.split(' — ');
  const videoTitle = titleParts.join(' — ') || site.name;
  const hasChannelPrefix = titleParts.length > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group rounded-2xl overflow-hidden bg-gray-900 border border-white/10 hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10"
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        {/* Har doim gradient fonni ko'rsatib turadi */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-orange-950 to-gray-900" />
        {thumbSrc && (
          <img
            src={thumbSrc}
            alt={videoTitle}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={handleThumbError}
          />
        )}
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
          <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <svg className="w-5 h-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* YouTube badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded text-white text-xs font-bold">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z"/>
          </svg>
          Video
        </div>
      </div>

      {/* Kontent */}
      <div className="p-4">
        {hasChannelPrefix && (
          <span className="text-orange-400/80 text-xs font-medium mb-1 block">{channel}</span>
        )}
        <h3 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2">
          {hasChannelPrefix ? videoTitle : site.name}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{site.description}</p>

        <a
          href={site.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          Ko'rish
        </a>
      </div>
    </motion.div>
  );
}

// Kanal karta (YouTube / Telegram)
function ChannelCard({ site, t }) {
  const isYoutube = site.type === 'youtube';
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group rounded-2xl overflow-hidden bg-gray-900 border border-white/10 hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10"
    >
      {/* Header bar */}
      <div className={`h-24 flex items-center justify-center relative overflow-hidden ${
        isYoutube
          ? 'bg-gradient-to-br from-red-900/80 to-orange-900/60'
          : 'bg-gradient-to-br from-blue-900/80 to-cyan-900/60'
      }`}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
        {isYoutube ? (
          <svg className="w-10 h-10 text-red-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z"/>
          </svg>
        ) : (
          <svg className="w-10 h-10 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        )}
        <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-bold ${isYoutube ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
          {isYoutube ? 'YouTube' : 'Telegram'}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-bold text-base mb-1 truncate">{site.name}</h3>
        {site.members_count && (
          <p className="text-orange-400/80 text-xs mb-2">
            {site.members_count} {t.members}
          </p>
        )}
        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{site.description}</p>

        <a
          href={site.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
            isYoutube
              ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500'
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500'
          }`}
        >
          {isYoutube ? t.visitBtn : t.joinBtn} →
        </a>
      </div>
    </motion.div>
  );
}

const FILTERS = [
  { key: 'all', labelUz: 'Barchasi', labelEn: 'All' },
  { key: 'video', labelUz: 'Videolar', labelEn: 'Videos' },
  { key: 'youtube', labelUz: 'Kanallar', labelEn: 'Channels' },
  { key: 'telegram', labelUz: 'Telegram', labelEn: 'Telegram' },
];

export default function Sites() {
  const [sites, setSites] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { t, lang } = useLanguage();
  const ts = t.sites;

  useEffect(() => {
    setLoading(true);
    // video filtri uchun youtube ni so'raymiz va frontendda filter qilamiz
    const apiFilter = filter === 'video' ? 'youtube' : filter;
    const params = apiFilter !== 'all' ? `?type=${apiFilter}` : '';
    api.get(`/sites${params}`)
      .then((res) => {
        let data = res.data;
        if (filter === 'video') {
          data = data.filter(s => isVideoUrl(s.link));
        } else if (filter === 'youtube') {
          data = data.filter(s => !isVideoUrl(s.link));
        }
        setSites(data);
      })
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl md:text-6xl font-extrabold font-oswald mb-4 text-white">
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                {ts.title}
              </span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">{ts.subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-16 z-30 bg-gray-950/90 backdrop-blur py-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex gap-2 justify-center flex-wrap">
          {FILTERS.map(({ key, labelUz, labelEn }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-5 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                filter === key
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30 scale-105'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {lang === 'uz' ? labelUz : labelEn}
            </button>
          ))}
        </div>
      </section>

      {/* Kontent */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/5 h-64 animate-pulse" />
            ))}
          </div>
        ) : sites.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg">{ts.empty}</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {sites.map((site) =>
                isVideoUrl(site.link) ? (
                  <VideoCard key={site.id} site={site} />
                ) : (
                  <ChannelCard key={site.id} site={site} t={ts} />
                )
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <Footer />
    </div>
  );
}
