import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';

function WaveSVG() {
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none wave-animation">
      <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" className="fill-gray-950 w-full">
        <path d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" />
      </svg>
    </div>
  );
}

function HackCard({ hack, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-950/80 to-cyan-950/80 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 group"
    >
      {/* Backdrop blur effekt */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-blue-500/5" />

      {/* To'lqin border effekt */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-lg shadow-blue-500/30">
            {index + 1}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-xl font-dm mb-1">{hack.name}</h3>
            <p className="text-blue-300/80 text-sm leading-relaxed">{hack.description}</p>
          </div>
        </div>

        {/* Yo'riqnoma (kengaytirib/toraytiriladigan) */}
        {hack.guide && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors mb-3"
            >
              <span className={`transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`}>▶</span>
              {expanded ? 'Yashirish' : "Qo'llanmani ko'rish"}
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white/5 rounded-xl p-4 border border-blue-500/20">
                    <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                      {hack.guide}
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Video link */}
        {hack.video_link && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <a
              href={hack.video_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm hover:bg-blue-600/30 hover:text-blue-200 transition-all duration-300 hover:scale-105"
            >
              <span>▶️</span> Video dars ko'rish
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Hacks() {
  const [hacks, setHacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/hacks')
      .then((res) => setHacks(res.data))
      .catch(() => setHacks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* Hero - Suv dizayni */}
      <section className="relative pt-28 pb-32 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-water-deep via-blue-950/80 to-gray-950" />
          {/* To'lqin effekti */}
          <div className="absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent blur-sm animate-pulse" />
          <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent blur-sm" />
          {/* Suv glow */}
          <div className="absolute top-20 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute top-10 right-1/4 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl" />
          {/* Bubble effekt */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-blue-400/20"
              style={{
                left: `${10 + i * 12}%`,
                bottom: `${20 + (i % 4) * 15}%`,
                width: `${20 + (i % 3) * 15}px`,
                height: `${20 + (i % 3) * 15}px`,
                animation: `wave ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </div>

        <WaveSVG />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-6xl mb-4 block" style={{ animation: 'wave 3s ease-in-out infinite' }}>💧</span>
            <h1 className="text-5xl md:text-6xl font-extrabold font-dm mb-4 text-white">
              O'rganish{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Usullari
              </span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">
              Ilmiy asosda isbotlangan texnikalar bilan IELTS o'rganishni 3 barobarga tezlashtiring.
              Har bir usul — o'z tajribasidan sinab ko'rilgan!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Hacks grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/5 h-48 animate-pulse" />
            ))}
          </div>
        ) : hacks.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-6xl mb-4 block">💧</span>
            <p className="text-gray-400 text-lg">Hozircha usul yo'q. Tez orada qo'shiladi!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hacks.map((hack, i) => (
              <HackCard key={hack.id} hack={hack} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Pro maslahat banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-8 md:p-12 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-cyan-950" />
          <div className="absolute inset-0 border border-blue-500/30 rounded-3xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-500/20 rounded-full blur-2xl" />
          <div className="relative z-10">
            <p className="text-4xl mb-4">💡</p>
            <h3 className="text-2xl font-bold text-white mb-3">Pro maslahat</h3>
            <p className="text-blue-200 max-w-lg mx-auto text-sm leading-relaxed">
              Eng samarali yo'l — <strong>Spaced Repetition + Shadowing</strong> kombinatsiyasi.
              Har kuni 30 daqiqa shadowing va 20 ta yangi so'z Anki bilan. 3 oyda natija ko'rinadi!
            </p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
