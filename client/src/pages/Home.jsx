import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const elementCards = [
  {
    icon: '🔥',
    title: 'Foydali kanallar',
    subtitle: 'Olov',
    description: 'Eng yaxshi YouTube va Telegram kanallar. IELTS ustalaridan to\'g\'ridan-to\'g\'ri o\'rganing.',
    path: '/sites',
    gradient: 'from-red-900 via-orange-800 to-red-950',
    glow: 'shadow-orange-500/30',
    border: 'border-orange-500/40',
    tag: 'bg-orange-500/20 text-orange-300',
    btnClass: 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500',
    stats: '50+ kanal',
  },
  {
    icon: '💧',
    title: "O'rganish usullari",
    subtitle: 'Suv',
    description: 'Shadowing, Dictation, Spaced Repetition va boshqa ilmiy asosda isbotlangan usullar.',
    path: '/hacks',
    gradient: 'from-blue-950 via-blue-900 to-cyan-950',
    glow: 'shadow-blue-500/30',
    border: 'border-blue-500/40',
    tag: 'bg-blue-500/20 text-blue-300',
    btnClass: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500',
    stats: '10+ usul',
  },
  {
    icon: '🌤️',
    title: 'Kitoblar',
    subtitle: 'Havo',
    description: 'Cambridge, Barron\'s va boshqa sertifikatlangan IELTS kitoblari. PDF yuklab oling.',
    path: '/books',
    gradient: 'from-sky-900 via-sky-800 to-indigo-950',
    glow: 'shadow-sky-500/30',
    border: 'border-sky-400/40',
    tag: 'bg-sky-500/20 text-sky-300',
    btnClass: 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500',
    stats: '30+ kitob',
  },
  {
    icon: '🌍',
    title: 'Jamiyat',
    subtitle: 'Yer',
    description: 'Savol bering, tajriba ulashing, motivatsiya oling. Birga o\'rganamiz!',
    path: '/community',
    gradient: 'from-green-950 via-emerald-900 to-stone-950',
    glow: 'shadow-green-500/30',
    border: 'border-green-500/40',
    tag: 'bg-green-500/20 text-green-300',
    btnClass: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500',
    stats: '1000+ a\'zo',
  },
];

const benefits = [
  { icon: '🆓', title: 'Bepul', desc: 'Barcha materiallar mutlaqo bepul.' },
  { icon: '🇺🇿', title: "O'zbek tilida", desc: "Tushuntirish o'zbek tilida." },
  { icon: '📱', title: 'Mobil qulay', desc: 'Har qanday qurilmadan foydalaning.' },
  { icon: '🔄', title: 'Doimiy yangilanadi', desc: "Yangi materiallar qo'shiladi." },
  { icon: '💬', title: 'Jonli yordam', desc: 'Savollaringizga javob beriladi.' },
  { icon: '🏆', title: 'Natija', desc: 'O\'quvchilarimiz 7+ ball olmoqda.' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animatsion fon */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              O'zbek tilida IELTS platformasi
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
          >
            IELTS ni{' '}
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              tez
            </span>{' '}
            va{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              samarali
            </span>{' '}
            o'rgan
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Foydali kanallar, ilmiy o'rganish usullari, eng yaxshi kitoblar va faol jamiyat —
            barchasi bir joyda, o'zbek tilida.
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
              🚀 Boshlash
            </Link>
            <Link
              to="/community"
              className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20"
            >
              💬 Jamiyatga qo'shil
            </Link>
          </motion.div>

          {/* Statistika */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8 mt-16"
          >
            {[
              { num: '1000+', label: "O'quvchi" },
              { num: '50+', label: 'Kanal' },
              { num: '30+', label: 'Kitob' },
              { num: '7+', label: "O'rtacha ball" },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-extrabold text-white">{num}</div>
                <div className="text-gray-500 text-sm mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Pastga scroll belgisi */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-9 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* 4 Ta Element Kartalar */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            To'rt unsur —{' '}
            <span className="bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
              bitta yo'l
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            IELTS ni to'liq o'zlashtirish uchun zarur bo'lgan hamma narsa shu yerda
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {elementCards.map(({ icon, title, subtitle, description, path, gradient, glow, border, tag, btnClass, stats }) => (
            <motion.div
              key={path}
              variants={item}
              className={`relative rounded-3xl bg-gradient-to-br ${gradient} border ${border} p-8 overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl ${glow}`}
            >
              {/* Fon glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/5 rounded-3xl" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-5xl">{icon}</span>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${tag}`}>
                    {subtitle}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">{description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">{stats}</span>
                  <Link
                    to={path}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white ${btnClass} transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg`}
                  >
                    Ko'rish →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Saytdan nima olasiz */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-extrabold mb-4">
              Saytdan{' '}
              <span className="text-orange-400">nima olasiz?</span>
            </h2>
            <p className="text-gray-400 text-lg">
              IELTS Hub UZ bilan o'quvchilarimizning muvaffaqiyati kafolatlanadi
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {benefits.map(({ icon, title, desc }) => (
              <motion.div
                key={title}
                variants={item}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="text-4xl mb-4 block">{icon}</span>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
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
                Bugun boshlang! 🚀
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                Har kuni 30 daqiqa. 3 oy. IELTS 7+ ball — bu sizning maqsadingiz, bizning vazifamiz.
              </p>
              <Link
                to="/hacks"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-white text-gray-900 font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                O'rganishni boshlash
                <span>→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
