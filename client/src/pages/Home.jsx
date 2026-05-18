import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { useLanguage } from '../contexts/LanguageContext';

// ─── 4 ta unsur effekti ───────────────────────────────────────────

// Olov (Foydali kanallar)
function FireQuadrant() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${6 + i * 8}%`,
            bottom: `${4 + (i % 4) * 14}%`,
            width: `${3 + (i % 3) * 2}px`,
            height: `${3 + (i % 3) * 2}px`,
            background: i % 2 === 0 ? '#FF4500' : '#FF8C00',
            opacity: 0.55,
            animation: `riseUp ${1.1 + (i % 3) * 0.45}s ease-in ${i * 0.16}s infinite`,
          }}
        />
      ))}
      <div className="absolute bottom-0 left-0 right-0 h-1/2"
        style={{ background: 'linear-gradient(to top, rgba(239,68,68,0.08), transparent)' }} />
      <div className="absolute top-5 left-5 text-orange-500/12 font-extrabold select-none"
        style={{ fontSize: 96, lineHeight: 1, fontFamily: 'serif' }}>炎</div>
    </div>
  );
}

// Suv (O'rganish usullari)
function WaterQuadrant() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-blue-400/25"
          style={{
            right: `${4 + i * 11}%`,
            bottom: `${12 + (i % 3) * 18}%`,
            width: `${16 + i * 11}px`,
            height: `${16 + i * 11}px`,
            animation: `wave ${2.4 + i * 0.45}s ease-in-out ${i * 0.3}s infinite`,
          }}
        />
      ))}
      <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-600/8 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 left-0 h-1/2"
        style={{ background: 'linear-gradient(to top, rgba(6,182,212,0.07), transparent)' }} />
      <div className="absolute top-5 right-5 text-blue-500/10 font-extrabold select-none"
        style={{ fontSize: 96, lineHeight: 1, fontFamily: 'serif' }}>水</div>
    </div>
  );
}

// Havo / Shamol (Kitoblar)
function WindQuadrant() {
  const streaks = [
    { top: '12%', left: '2%',  w: 70,  dur: 2.2, delay: 0    },
    { top: '26%', left: '15%', w: 95,  dur: 2.6, delay: 0.5  },
    { top: '40%', left: '0%',  w: 55,  dur: 2.0, delay: 0.2  },
    { top: '55%', left: '20%', w: 80,  dur: 2.8, delay: 0.8  },
    { top: '68%', left: '5%',  w: 110, dur: 2.4, delay: 0.35 },
    { top: '80%', left: '12%', w: 65,  dur: 2.1, delay: 0.6  },
    { top: '90%', left: '0%',  w: 90,  dur: 2.5, delay: 0.15 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
            background: `linear-gradient(90deg, transparent, rgba(147,210,250,${0.14 + (i % 3) * 0.06}), transparent)`,
            animation: `windFlow ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      <div className="absolute bottom-0 left-0 right-0 h-1/2"
        style={{ background: 'linear-gradient(to top, rgba(99,102,241,0.07), transparent)' }} />
      <div className="absolute top-5 left-5 text-sky-500/10 font-extrabold select-none"
        style={{ fontSize: 96, lineHeight: 1, fontFamily: 'serif' }}>風</div>
    </div>
  );
}

// Yer (Jamiyat)
function EarthQuadrant() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            right: `${6 + i * 9}%`,
            bottom: `${6 + (i % 4) * 12}%`,
            width: `${3 + (i % 3) * 2}px`,
            height: `${3 + (i % 3) * 2}px`,
            background: i % 2 === 0 ? '#4ade80' : '#34d399',
            opacity: 0.35,
            animation: `riseUp ${1.8 + (i % 3) * 0.55}s ease-in ${i * 0.22}s infinite`,
          }}
        />
      ))}
      <div className="absolute top-0 right-0 w-36 h-36 bg-green-700/8 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2"
        style={{ background: 'linear-gradient(to top, rgba(34,197,94,0.07), transparent)' }} />
      <div className="absolute top-5 right-5 text-green-500/10 font-extrabold select-none"
        style={{ fontSize: 96, lineHeight: 1, fontFamily: 'serif' }}>土</div>
    </div>
  );
}

// ─── Kartalar va benefitlar ───────────────────────────────────────

const cardStyles = [
  {
    path: '/sites',
    gradient: 'from-red-900 via-orange-800 to-red-950',
    glow: 'shadow-orange-500/30',
    border: 'border-orange-500/40',
    tag: 'bg-orange-500/20 text-orange-300',
    btnClass: 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500',
  },
  {
    path: '/hacks',
    gradient: 'from-blue-950 via-blue-900 to-cyan-950',
    glow: 'shadow-blue-500/30',
    border: 'border-blue-500/40',
    tag: 'bg-blue-500/20 text-blue-300',
    btnClass: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500',
  },
  {
    path: '/books',
    gradient: 'from-sky-900 via-sky-800 to-indigo-950',
    glow: 'shadow-sky-500/30',
    border: 'border-sky-400/40',
    tag: 'bg-sky-500/20 text-sky-300',
    btnClass: 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500',
  },
  {
    path: '/community',
    gradient: 'from-green-950 via-emerald-900 to-stone-950',
    glow: 'shadow-green-500/30',
    border: 'border-green-500/40',
    tag: 'bg-green-500/20 text-green-300',
    btnClass: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500',
  },
];

const BenefitIcons = [
  ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M14.5 9a3.5 2.5 0 0 0-5 0v.5a2.5 2.5 0 0 0 5 0v-.5" />
      <line x1="9" y1="15" x2="15" y2="9" />
      <path d="M9.5 15a3.5 2.5 0 0 0 5 0v-.5a2.5 2.5 0 0 0-5 0v.5" />
    </svg>
  ),
  ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h7M9 3v2c0 4.418-2.239 8-5 8" />
      <path d="M11 18L7 10l-4 8" /><path d="M9.2 16h-4.4" />
      <path d="M15 15l2-4 2 4" /><path d="M14 13.5h6" />
      <path d="M13 19h8" /><path d="M17 11v8" />
    </svg>
  ),
  ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  ),
  ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="9" y1="10" x2="15" y2="10" /><line x1="9" y1="14" x2="13" y2="14" />
    </svg>
  ),
  ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
];

const container = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ─── Bosh komponent ───────────────────────────────────────────────

export default function Home() {
  const { t, lang } = useLanguage();
  const [liveStats, setLiveStats] = useState(null);

  useEffect(() => {
    api.get('/stats').then(res => setLiveStats(res.data)).catch(() => {});
  }, []);

  const stats = lang === 'uz'
    ? [
        { num: liveStats ? `${liveStats.userCount}+` : '...', label: "O'quvchi" },
        { num: liveStats ? `${liveStats.siteCount}+` : '...', label: 'Kanal' },
        { num: liveStats ? `${liveStats.bookCount}+` : '...', label: 'Kitob' },
        { num: '7+', label: "O'rtacha ball" },
      ]
    : [
        { num: liveStats ? `${liveStats.userCount}+` : '...', label: 'Students' },
        { num: liveStats ? `${liveStats.siteCount}+` : '...', label: 'Channels' },
        { num: liveStats ? `${liveStats.bookCount}+` : '...', label: 'Books' },
        { num: '7+', label: 'Avg. Score' },
      ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <style>{`
        @keyframes riseUp {
          0%   { transform: translateY(0)   scale(1);   opacity: 0.6; }
          80%  { opacity: 0.4; }
          100% { transform: translateY(-60px) scale(0.5); opacity: 0; }
        }
        @keyframes wave {
          0%, 100% { transform: scale(1);   opacity: 0.6; }
          50%       { transform: scale(1.4); opacity: 0;   }
        }
        @keyframes windFlow {
          0%   { transform: translateX(-40px) scaleX(0.5); opacity: 0; }
          35%  { opacity: 1; }
          100% { transform: translateX(90px)  scaleX(1.3); opacity: 0; }
        }
      `}</style>

      <Navbar />

      {/* ── Hero: 4 ta unsur orqa fon ─────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* 4 kvadrant */}
        <div className="absolute inset-0">

          {/* Yuqori-chap: OLOV */}
          <div className="absolute top-0 left-0 w-1/2 h-1/2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-orange-950/90 to-gray-950/0" />
            <FireQuadrant />
          </div>

          {/* Yuqori-o'ng: SUV */}
          <div className="absolute top-0 right-0 w-1/2 h-1/2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-bl from-blue-950 via-cyan-950/90 to-gray-950/0" />
            <WaterQuadrant />
          </div>

          {/* Pastki-chap: HAVO */}
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-sky-950/90 to-gray-950/0" />
            <WindQuadrant />
          </div>

          {/* Pastki-o'ng: YER */}
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tl from-green-950 via-stone-950/90 to-gray-950/0" />
            <EarthQuadrant />
          </div>

          {/* Markaziy qorong'i oval — matn o'qilishi uchun */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 55% 60% at 50% 50%, rgba(3,7,18,0.92) 10%, rgba(3,7,18,0.72) 45%, rgba(3,7,18,0.2) 70%, transparent 85%)',
          }} />

          {/* Bo'linish chiziqlari */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-px w-px"
            style={{ background: 'linear-gradient(to bottom, transparent 5%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent 95%)' }} />
          <div className="absolute inset-x-0 top-1/2 -translate-y-px h-px"
            style={{ background: 'linear-gradient(to right, transparent 5%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent 95%)' }} />

          {/* Burchak yorliqlari */}
          <div className="absolute top-20 left-6 text-orange-400/35 text-xs font-bold tracking-widest uppercase select-none">
            {lang === 'uz' ? 'Olov' : 'Fire'}
          </div>
          <div className="absolute top-20 right-6 text-blue-400/35 text-xs font-bold tracking-widest uppercase select-none">
            {lang === 'uz' ? 'Suv' : 'Water'}
          </div>
          <div className="absolute bottom-28 left-6 text-sky-400/35 text-xs font-bold tracking-widest uppercase select-none">
            {lang === 'uz' ? 'Havo' : 'Air'}
          </div>
          <div className="absolute bottom-28 right-6 text-green-400/35 text-xs font-bold tracking-widest uppercase select-none">
            {lang === 'uz' ? 'Yer' : 'Earth'}
          </div>
        </div>

        {/* Asosiy kontent */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              {lang === 'uz' ? "O'zbek tilida IELTS platformasi" : 'IELTS Platform in Uzbek'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
          >
            {lang === 'uz' ? (
              <>
                IELTS ni{' '}
                <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">tez</span>
                {' '}va{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">samarali</span>
                {" o'rgan"}
              </>
            ) : (
              <>
                Learn IELTS{' '}
                <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">Fast</span>
                {' '}&{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Effectively</span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t.home.heroSub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/sites"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold text-lg hover:from-orange-400 hover:to-red-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 active:scale-95"
            >
              {t.home.startBtn}
            </Link>
            <Link
              to="/community"
              className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20"
            >
              {t.home.learnMore}
            </Link>
          </motion.div>

          {/* Jonli statistika */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8 mt-16"
          >
            {stats.map(({ num, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-extrabold text-white">{num}</div>
                <div className="text-gray-500 text-sm mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Pastga o'q */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-9 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ── 4 Ta Element Kartalar ─────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            {lang === 'uz' ? (
              <>To'rt unsur —{' '}<span className="bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">bitta yo'l</span></>
            ) : (
              <>Four Elements —{' '}<span className="bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">One Path</span></>
            )}
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            {lang === 'uz'
              ? "IELTS ni to'liq o'zlashtirish uchun zarur bo'lgan hamma narsa shu yerda"
              : 'Everything you need to master IELTS is right here'}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {cardStyles.map(({ path, gradient, glow, border, tag, btnClass }, i) => {
            const card = t.home.cards[i];
            return (
              <motion.div
                key={path}
                variants={item}
                className={`relative rounded-3xl bg-gradient-to-br ${gradient} border ${border} p-8 overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl ${glow}`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/5 rounded-3xl" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${tag}`}>
                      {card.subtitle}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">{card.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">{card.stats}</span>
                    <Link
                      to={path}
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white ${btnClass} transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg`}
                    >
                      {t.home.goBtn} →
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── Saytdan nima olasiz ──────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-extrabold mb-4">
              {t.home.benefitsTitle.split('?')[0]}
              <span className="text-orange-400">?</span>
            </h2>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {t.home.benefits.map(({ title, desc }, i) => {
              const Icon = BenefitIcons[i];
              return (
                <motion.div
                  key={title}
                  variants={item}
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-white/20 transition-all duration-300">
                    <Icon className="w-5 h-5 text-orange-300 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-gray-400 text-sm">{desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-12 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/60 via-red-900/40 to-purple-900/60" />
            <div className="absolute inset-0 border border-orange-500/30 rounded-3xl" />
            <div className="absolute top-4 left-4 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl" />
            <div className="absolute bottom-4 right-4 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                {lang === 'uz' ? 'Bugun boshlang!' : 'Start Today!'}
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                {lang === 'uz'
                  ? 'Har kuni 30 daqiqa. 3 oy. IELTS 7+ ball — bu sizning maqsadingiz, bizning vazifamiz.'
                  : '30 minutes a day. 3 months. IELTS 7+ — your goal, our mission.'}
              </p>
              <Link
                to="/hacks"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-white text-gray-900 font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                {lang === 'uz' ? "O'rganishni boshlash" : 'Start Learning'} →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
