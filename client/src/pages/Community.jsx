import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';

function StarRating({ rating = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-600'}>★</span>
      ))}
    </div>
  );
}

export default function Community() {
  const [questions, setQuestions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ user_name: '', email: '', question: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/community/questions'),
      api.get('/community/posts'),
      api.get('/community/testimonials'),
      api.get('/community/stats'),
    ]).then(([q, p, t, s]) => {
      setQuestions(q.data);
      setPosts(p.data);
      setTestimonials(t.data);
      setStats(s.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.user_name || !form.question) {
      setError('Ism va savol majburiy!');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/community/questions', form);
      setSuccess(true);
      setForm({ user_name: '', email: '', question: '' });
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-white" style={{ background: '#0f1a0a' }}>
      <Navbar />

      {/* Hero - Yer dizayni */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden earth-texture">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-green-950/80 via-stone-950/80 to-gray-950" />
          {/* Organik shakllar */}
          <div className="absolute top-10 left-10 w-64 h-64 bg-green-900/30 rounded-full blur-3xl" />
          <div className="absolute top-20 right-20 w-48 h-48 bg-stone-800/40 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-40 bg-green-900/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-6xl mb-4 block">🌍</span>
            <h1 className="text-5xl md:text-6xl font-extrabold font-lora mb-4 text-white">
              IELTS{' '}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Jamiyati
              </span>
            </h1>
            <p className="text-stone-300 text-lg max-w-xl mx-auto">
              Birga o'rganamiz, birga o'samiz. Savollaringizni bering, tajribangizni ulashing!
            </p>

            {/* Statistika */}
            {!loading && (
              <div className="flex justify-center gap-8 mt-8">
                {[
                  { num: stats.questionCount || 0, label: 'Savol' },
                  { num: stats.answeredCount || 0, label: 'Javob' },
                  { num: stats.testimonialCount || 0, label: "Sharh" },
                ].map(({ num, label }) => (
                  <div key={label} className="text-center">
                    <div className="text-3xl font-bold text-green-400">{num}</div>
                    <div className="text-stone-400 text-sm">{label}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Motivatsion Postlar */}
      {posts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold font-lora mb-8 text-green-300 flex items-center gap-3"
          >
            <span>🌱</span> Motivatsion xabarlar
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl overflow-hidden p-6 border border-green-900/50"
                style={{ background: 'linear-gradient(135deg, #1a2e0f 0%, #0f1a0a 100%)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
                <h3 className="text-white font-bold text-lg mb-3 font-lora">{post.title}</h3>
                <p className="text-stone-300 text-sm leading-relaxed">{post.content}</p>
                <div className="mt-4 text-green-600 text-xs">
                  {new Date(post.created_at).toLocaleDateString('uz-UZ')}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Savol-Javob bo'limi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Savol yuborish formasi */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold font-lora mb-2 text-green-300 flex items-center gap-3">
              <span>❓</span> Savol bering
            </h2>
            <p className="text-stone-400 text-sm mb-6">Admin 24 soat ichida javob beradi</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1.5">
                  Ismingiz *
                </label>
                <input
                  type="text"
                  value={form.user_name}
                  onChange={(e) => setForm({ ...form, user_name: e.target.value })}
                  placeholder="Ismi sharifingiz"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-green-900/50 text-white placeholder-stone-500 focus:outline-none focus:border-green-500/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1.5">
                  Email (ixtiyoriy)
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-green-900/50 text-white placeholder-stone-500 focus:outline-none focus:border-green-500/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1.5">
                  Savolingiz *
                </label>
                <textarea
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  placeholder="IELTS haqida savolingizni yozing..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-green-900/50 text-white placeholder-stone-500 focus:outline-none focus:border-green-500/60 transition-colors resize-none"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl bg-green-900/40 border border-green-500/40 text-green-300 text-sm"
                >
                  ✅ Savolingiz muvaffaqiyatli yuborildi! Admin tez orada javob beradi.
                </motion.div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 text-white font-semibold transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-900/30"
              >
                {submitting ? 'Yuborilmoqda...' : '📤 Savol yuborish'}
              </button>
            </form>
          </motion.div>

          {/* Savollar ro'yxati */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold font-lora mb-2 text-green-300 flex items-center gap-3">
              <span>💬</span> Savollar va javoblar
            </h2>
            <p className="text-stone-400 text-sm mb-6">Boshqalarning savollaridan ham o'rganing</p>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-xl bg-white/5 h-24 animate-pulse" />
                ))
              ) : questions.length === 0 ? (
                <div className="text-center py-12 text-stone-400">
                  <span className="text-4xl block mb-3">🌱</span>
                  Hali savol yo'q. Birinchi bo'ling!
                </div>
              ) : (
                questions.map((q) => (
                  <div
                    key={q.id}
                    className="rounded-xl p-4 border border-green-900/40 space-y-3"
                    style={{ background: 'rgba(45,80,22,0.1)' }}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-green-400 font-semibold text-sm">👤 {q.user_name}</span>
                        <span className="text-stone-600 text-xs">
                          {new Date(q.created_at).toLocaleDateString('uz-UZ')}
                        </span>
                      </div>
                      <p className="text-white text-sm">{q.question}</p>
                    </div>
                    {q.answer && (
                      <div className="bg-green-900/30 rounded-lg p-3 border-l-2 border-green-500/50">
                        <span className="text-green-400 text-xs font-bold block mb-1">✅ Admin javobi:</span>
                        <p className="text-stone-300 text-sm">{q.answer}</p>
                      </div>
                    )}
                    {!q.is_answered && (
                      <div className="text-stone-500 text-xs italic">⏳ Javob kutilmoqda...</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimoniallar */}
      {testimonials.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'rgba(45,80,22,0.05)' }}>
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold font-lora mb-8 text-center text-green-300"
            >
              🏆 Muvaffaqiyat hikoyalari
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl p-6 border border-green-900/40"
                  style={{ background: 'rgba(45,80,22,0.15)' }}
                >
                  <StarRating rating={t.rating} />
                  <p className="text-stone-300 text-sm my-4 leading-relaxed italic">"{t.text}"</p>
                  <div className="text-green-400 font-semibold text-sm">— {t.name}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
