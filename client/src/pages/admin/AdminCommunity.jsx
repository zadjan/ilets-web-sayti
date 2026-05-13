import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';

function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active ? 'bg-green-700/40 text-green-300 border border-green-600/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 className="text-white font-semibold text-lg">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1">✕</button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function AdminCommunity() {
  const [tab, setTab] = useState('questions');
  const [questions, setQuestions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [answerModal, setAnswerModal] = useState(false);
  const [answerItem, setAnswerItem] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [postModal, setPostModal] = useState(false);
  const [postForm, setPostForm] = useState({ title: '', content: '' });
  const [testimonialModal, setTestimonialModal] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({ name: '', text: '', rating: 5 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadAll = () => {
    setLoading(true);
    Promise.all([
      api.get('/community/admin/questions'),
      api.get('/community/posts'),
      api.get('/community/testimonials'),
    ]).then(([q, p, t]) => {
      setQuestions(q.data);
      setPosts(p.data);
      setTestimonials(t.data);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadAll(); }, []);

  const openAnswer = (q) => { setAnswerItem(q); setAnswerText(q.answer || ''); setError(''); setAnswerModal(true); };

  const handleAnswer = async (e) => {
    e.preventDefault();
    if (!answerText) { setError('Javob matni majburiy.'); return; }
    setSaving(true); setError('');
    try {
      await api.put(`/community/questions/${answerItem.id}/answer`, { answer: answerText });
      loadAll(); setAnswerModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik.');
    } finally { setSaving(false); }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`/community/questions/${id}`); loadAll();
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!postForm.title || !postForm.content) { setError('Sarlavha va matn majburiy.'); return; }
    setSaving(true); setError('');
    try {
      await api.post('/community/posts', postForm);
      setPostForm({ title: '', content: '' });
      loadAll(); setPostModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik.');
    } finally { setSaving(false); }
  };

  const deletePost = async (id) => {
    if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`/community/posts/${id}`); loadAll();
  };

  const handleAddTestimonial = async (e) => {
    e.preventDefault();
    if (!testimonialForm.name || !testimonialForm.text) { setError('Ism va matn majburiy.'); return; }
    setSaving(true); setError('');
    try {
      await api.post('/community/testimonials', testimonialForm);
      setTestimonialForm({ name: '', text: '', rating: 5 });
      loadAll(); setTestimonialModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik.');
    } finally { setSaving(false); }
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`/community/testimonials/${id}`); loadAll();
  };

  const unanswered = questions.filter((q) => !q.is_answered).length;

  return (
    <AdminLayout title="🌍 Jamiyat boshqaruvi">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Tab active={tab === 'questions'} onClick={() => setTab('questions')}>
          ❓ Savollar {unanswered > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unanswered}</span>}
        </Tab>
        <Tab active={tab === 'posts'} onClick={() => setTab('posts')}>🌱 Motivatsion postlar</Tab>
        <Tab active={tab === 'testimonials'} onClick={() => setTab('testimonials')}>⭐ Testimoniallar</Tab>
      </div>

      {/* ===== SAVOLLAR ===== */}
      {tab === 'questions' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">{questions.length} ta savol, {unanswered} ta javobsiz</p>
          </div>
          {loading ? (
            <div className="grid gap-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />)}</div>
          ) : questions.length === 0 ? (
            <div className="text-center py-16 text-gray-500"><span className="text-4xl block mb-3">❓</span>Hali savol yo'q.</div>
          ) : (
            <div className="grid gap-4">
              {questions.map((q) => (
                <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl p-5 border transition-all ${q.is_answered ? 'bg-green-950/20 border-green-900/30' : 'bg-gray-900 border-white/5 border-l-2 border-l-yellow-500/50'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-white font-medium text-sm">👤 {q.user_name}</span>
                        {q.email && <span className="text-gray-500 text-xs">({q.email})</span>}
                        <span className="text-gray-600 text-xs">{new Date(q.created_at).toLocaleDateString('uz-UZ')}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${q.is_answered ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                          {q.is_answered ? '✅ Javob berilgan' : '⏳ Javobsiz'}
                        </span>
                      </div>
                      <p className="text-gray-200 text-sm mb-3">{q.question}</p>
                      {q.answer && (
                        <div className="bg-green-900/20 rounded-xl p-3 border border-green-800/30">
                          <span className="text-green-400 text-xs font-bold block mb-1">Admin javobi:</span>
                          <p className="text-gray-300 text-sm">{q.answer}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => openAnswer(q)} className="px-3 py-1.5 rounded-lg bg-green-900/30 text-green-400 hover:bg-green-900/50 text-xs font-medium transition-all">
                        {q.is_answered ? 'Javobni o\'zgartir' : 'Javob ber'}
                      </button>
                      <button onClick={() => deleteQuestion(q.id)} className="px-3 py-1.5 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 text-xs font-medium transition-all">O'chirish</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== POSTLAR ===== */}
      {tab === 'posts' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">{posts.length} ta post</p>
            <button onClick={() => { setPostForm({ title: '', content: '' }); setError(''); setPostModal(true); }} className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-700 to-emerald-700 text-white text-sm font-semibold hover:from-green-600 hover:to-emerald-600 transition-all hover:scale-105">
              + Yangi post
            </button>
          </div>
          {posts.length === 0 ? (
            <div className="text-center py-16 text-gray-500"><span className="text-4xl block mb-3">🌱</span>Hali post yo'q.</div>
          ) : (
            <div className="grid gap-4">
              {posts.map((p) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-gray-900 border border-white/5">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium mb-1">{p.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2">{p.content}</p>
                    <span className="text-gray-600 text-xs mt-1 block">{new Date(p.created_at).toLocaleDateString('uz-UZ')}</span>
                  </div>
                  <button onClick={() => deletePost(p.id)} className="px-3 py-1.5 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 text-xs font-medium transition-all shrink-0">O'chirish</button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== TESTIMONIALLAR ===== */}
      {tab === 'testimonials' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">{testimonials.length} ta testimonial</p>
            <button onClick={() => { setTestimonialForm({ name: '', text: '', rating: 5 }); setError(''); setTestimonialModal(true); }} className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-700 to-emerald-700 text-white text-sm font-semibold hover:from-green-600 hover:to-emerald-600 transition-all hover:scale-105">
              + Yangi sharh
            </button>
          </div>
          {testimonials.length === 0 ? (
            <div className="text-center py-16 text-gray-500"><span className="text-4xl block mb-3">⭐</span>Hali testimonial yo'q.</div>
          ) : (
            <div className="grid gap-4">
              {testimonials.map((t) => (
                <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-gray-900 border border-white/5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">{t.name}</span>
                      <span className="text-yellow-400 text-sm">{'★'.repeat(t.rating)}</span>
                    </div>
                    <p className="text-gray-400 text-sm italic">"{t.text}"</p>
                  </div>
                  <button onClick={() => deleteTestimonial(t.id)} className="px-3 py-1.5 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 text-xs font-medium transition-all shrink-0">O'chirish</button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Javob Modal */}
      <Modal open={answerModal} onClose={() => setAnswerModal(false)} title="Savolga javob berish">
        {answerItem && (
          <form onSubmit={handleAnswer} className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">Savol:</p>
              <p className="text-white text-sm">{answerItem.question}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Javobingiz *</label>
              <textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)} placeholder="Javob yozing..." rows={4}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition-colors resize-none" />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={() => setAnswerModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 transition-all text-sm">Bekor</button>
              <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-700 to-emerald-700 text-white font-semibold text-sm hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50">
                {saving ? 'Saqlanmoqda...' : '✅ Javob berish'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Post Modal */}
      <Modal open={postModal} onClose={() => setPostModal(false)} title="Yangi motivatsion post">
        <form onSubmit={handleAddPost} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Sarlavha *</label>
            <input type="text" value={postForm.title} onChange={(e) => setPostForm({ ...postForm, title: e.target.value })} placeholder="Motivatsion sarlavha"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Matn *</label>
            <textarea value={postForm.content} onChange={(e) => setPostForm({ ...postForm, content: e.target.value })} placeholder="Post matni..." rows={5}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition-colors resize-none" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={() => setPostModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 transition-all text-sm">Bekor</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-700 to-emerald-700 text-white font-semibold text-sm hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50">
              {saving ? 'Saqlanmoqda...' : 'Qo\'shish'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Testimonial Modal */}
      <Modal open={testimonialModal} onClose={() => setTestimonialModal(false)} title="Yangi testimonial qo'shish">
        <form onSubmit={handleAddTestimonial} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Ism *</label>
            <input type="text" value={testimonialForm.name} onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })} placeholder="Aziz T."
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Sharh matni *</label>
            <textarea value={testimonialForm.text} onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })} placeholder="Testimonial matni..." rows={4}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Reyting (1-5)</label>
            <input type="number" min="1" max="5" value={testimonialForm.rating} onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) })}
              className="w-24 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/60 transition-colors" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={() => setTestimonialModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 transition-all text-sm">Bekor</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-700 to-emerald-700 text-white font-semibold text-sm hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50">
              {saving ? 'Saqlanmoqda...' : 'Qo\'shish'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
