import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { useLanguage } from '../contexts/LanguageContext';

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

  const [regForm, setRegForm] = useState({ name: '', email: '', goal_score: '', current_level: '' });
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState('');
  const { t, lang } = useLanguage();
  const ts = t.community;

  useEffect(() => {
    Promise.all([
      api.get('/community/questions'),
      api.get('/community/posts'),
      api.get('/community/testimonials'),
      api.get('/community/stats'),
    ]).then(([q, p, tm, s]) => {
      setQuestions(q.data);
      setPosts(p.data);
      setTestimonials(tm.data);
      setStats(s.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email) {
      setRegError(lang === 'uz' ? "Ism va email majburiy." : "Name and email are required.");
      return;
    }
    setRegSubmitting(true);
    setRegError('');
    try {
      await api.post('/users/register', regForm);
      setRegSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message;
      setRegError(msg || ts.regError);
    } finally {
      setRegSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.user_name || !form.question) {
      setError(`${ts.qaName} ${ts.qaQuestion}`);
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
      setError(ts.qaError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-white" style={{ background: '#0f1a0a' }}>
      <Navbar />

      {/* Hero - Yer dizayni */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-green-950/80 via-stone-950/80 to-gray-950" />
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
            <h1 className="text-5xl md:text-6xl font-extrabold font-lora mb-4 text-white">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {ts.title}
              </span>
            </h1>
            <p className="text-stone-300 text-lg max-w-xl mx-auto">{ts.subtitle}</p>

            {!loading && (
              <div className="flex justify-center gap-8 mt-8">
                {[
                  { num: stats.questionCount || 0, label: ts.questionsLabel },
                  { num: stats.answeredCount || 0, label: ts.answeredLabel },
                  { num: stats.testimonialCount || 0, label: ts.membersLabel },
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

      {/* Ro'yhatdan o'tish */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-8 border border-green-800/50"
          style={{ background: 'linear-gradient(135deg, #1a2e0f 0%, #0f1a0a 100%)' }}
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-500/60 to-transparent" />

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-lora text-green-300 mb-2">{ts.regTitle}</h2>
            <p className="text-stone-400 text-sm">{ts.regSubtitle}</p>
          </div>

          {regSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className="text-green-300 text-lg font-semibold">{ts.regSuccess}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleRegSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1.5">{ts.regName} *</label>
                <input
                  type="text"
                  value={regForm.name}
                  onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder={ts.regName}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-green-900/50 text-white placeholder-stone-500 focus:outline-none focus:border-green-500/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1.5">{ts.regEmail} *</label>
                <input
                  type="email"
                  value={regForm.email}
                  onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-green-900/50 text-white placeholder-stone-500 focus:outline-none focus:border-green-500/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1.5">{ts.regGoal}</label>
                <select
                  value={regForm.goal_score}
                  onChange={e => setRegForm({ ...regForm, goal_score: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-green-900/50 text-white focus:outline-none focus:border-green-500/60 transition-colors"
                >
                  <option value="">—</option>
                  {['5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5+'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1.5">{ts.regLevel}</label>
                <select
                  value={regForm.current_level}
                  onChange={e => setRegForm({ ...regForm, current_level: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-green-900/50 text-white focus:outline-none focus:border-green-500/60 transition-colors"
                >
                  <option value="">—</option>
                  <option value="beginner">{lang === 'uz' ? "Boshlang'ich" : 'Beginner'}</option>
                  <option value="intermediate">{lang === 'uz' ? "O'rta" : 'Intermediate'}</option>
                  <option value="advanced">{lang === 'uz' ? 'Yuqori' : 'Advanced'}</option>
                </select>
              </div>

              {regError && (
                <p className="sm:col-span-2 text-red-400 text-sm">{regError}</p>
              )}

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={regSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 text-white font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-900/30"
                >
                  {regSubmitting ? ts.regSubmitting : ts.regSubmit}
                </button>
              </div>
            </form>
          )}
        </motion.div>
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
            {ts.motivTitle}
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
                  {new Date(post.created_at).toLocaleDateString()}
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
              {ts.qaBtn}
            </h2>
            <p className="text-stone-400 text-sm mb-6">
              {ts.qaBtn === 'Ask a Question' ? 'Admin will respond within 24 hours' : 'Admin 24 soat ichida javob beradi'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1.5">{ts.qaName} *</label>
                <input
                  type="text"
                  value={form.user_name}
                  onChange={(e) => setForm({ ...form, user_name: e.target.value })}
                  placeholder={ts.qaName}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-green-900/50 text-white placeholder-stone-500 focus:outline-none focus:border-green-500/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1.5">{ts.qaEmail}</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-green-900/50 text-white placeholder-stone-500 focus:outline-none focus:border-green-500/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1.5">{ts.qaQuestion} *</label>
                <textarea
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  placeholder={ts.qaQuestion + '...'}
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
                  ✅ {ts.qaSuccess}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 text-white font-semibold transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-900/30"
              >
                {submitting ? `⏳ ${ts.qaSending}` : `📤 ${ts.qaSend}`}
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
              {ts.qaTitle}
            </h2>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-xl bg-white/5 h-24 animate-pulse" />
                ))
              ) : questions.length === 0 ? (
                <div className="text-center py-12 text-stone-400">
                  {ts.loading}
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
                        <span className={`text-xs px-2 py-0.5 rounded-full ${q.is_answered ? 'bg-green-900/50 text-green-400' : 'bg-stone-800 text-stone-500'}`}>
                          {q.is_answered ? `✅ ${ts.answered}` : `⏳ ${ts.pending}`}
                        </span>
                      </div>
                      <p className="text-white text-sm">{q.question}</p>
                    </div>
                    {q.answer && (
                      <div className="bg-green-900/30 rounded-lg p-3 border-l-2 border-green-500/50">
                        <span className="text-green-400 text-xs font-bold block mb-1">✅ {ts.answer}:</span>
                        <p className="text-stone-300 text-sm">{q.answer}</p>
                      </div>
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
              {ts.testimonialsTitle}
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl p-6 border border-green-900/40"
                  style={{ background: 'rgba(45,80,22,0.15)' }}
                >
                  <StarRating rating={item.rating} />
                  <p className="text-stone-300 text-sm my-4 leading-relaxed italic">"{item.text}"</p>
                  <div className="text-green-400 font-semibold text-sm">— {item.name}</div>
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
