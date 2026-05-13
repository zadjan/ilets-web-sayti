import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';

const emptyForm = { name: '', author: '', description: '', level: 'beginner', category: 'General', cover_url: '', is_published: 1 };
const levels = ['beginner', 'intermediate', 'advanced'];
const categories = ['General', 'Grammar', 'Vocabulary', 'Speaking', 'Listening', 'Reading', 'Writing'];
const levelLabels = { beginner: 'Boshlang\'ich', intermediate: 'O\'rta', advanced: 'Yuqori' };

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

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [pdfFile, setPdfFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => { api.get('/books/admin/all').then((r) => setBooks(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setPdfFile(null); setError(''); setModal(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ ...item }); setPdfFile(null); setError(''); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) { setError('Kitob nomi majburiy.'); return; }
    setSaving(true); setError('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== undefined) formData.append(k, v); });
      if (pdfFile) formData.append('pdf', pdfFile);
      const headers = { 'Content-Type': 'multipart/form-data' };
      if (editItem) await api.put(`/books/${editItem.id}`, formData, { headers });
      else await api.post('/books', formData, { headers });
      load(); setModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`/books/${id}`); load();
  };

  const togglePublish = async (item) => {
    await api.put(`/books/${item.id}`, { ...item, is_published: item.is_published ? 0 : 1 }); load();
  };

  return (
    <AdminLayout title="📚 Kitoblar boshqaruvi">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <p className="text-gray-400 text-sm">{books.length} ta kitob</p>
        <button onClick={openAdd} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold text-sm hover:from-sky-400 hover:to-indigo-500 transition-all hover:scale-105">
          + Yangi kitob
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />)}</div>
      ) : books.length === 0 ? (
        <div className="text-center py-16 text-gray-500"><span className="text-4xl block mb-3">📚</span>Hali kitob yo'q.</div>
      ) : (
        <div className="grid gap-4">
          {books.map((book) => (
            <motion.div key={book.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-gray-900 border border-white/5 hover:border-white/10 transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-white font-medium truncate">{book.name}</span>
                  {book.level && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      book.level === 'beginner' ? 'bg-green-500/20 text-green-300' :
                      book.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'}`}>
                      {levelLabels[book.level]}
                    </span>
                  )}
                  {book.category && <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300">{book.category}</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${book.is_published ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'}`}>
                    {book.is_published ? 'Ko\'rinadi' : 'Yashirin'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {book.author && <span>✍️ {book.author}</span>}
                  {book.pdf_path && <span className="text-green-500">📥 PDF mavjud</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => togglePublish(book)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${book.is_published ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50' : 'bg-green-900/30 text-green-400 hover:bg-green-900/50'}`}>
                  {book.is_published ? 'Yashir' : 'Chiqar'}
                </button>
                <button onClick={() => openEdit(book)} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/15 text-xs font-medium transition-all">Tahrirlash</button>
                <button onClick={() => handleDelete(book.id)} className="px-3 py-1.5 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 text-xs font-medium transition-all">O'chirish</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editItem ? 'Kitobni tahrirlash' : 'Yangi kitob qo\'shish'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Kitob nomi *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Cambridge IELTS 17"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500/60 transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Muallif</label>
            <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Cambridge University Press"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500/60 transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tavsif</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Kitob haqida..." rows={3}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500/60 transition-colors resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Daraja</label>
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-sky-500/60 transition-colors">
                {levels.map((l) => <option key={l} value={l}>{levelLabels[l]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Kategoriya</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-sky-500/60 transition-colors">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Muqova URL</label>
            <input type="url" value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} placeholder="https://..."
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500/60 transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">PDF fayl yuklash {editItem?.pdf_path ? '(mavjud — yangi yuklash ixtiyoriy)' : ''}</label>
            <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])}
              className="w-full text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-sky-900/40 file:text-sky-300 hover:file:bg-sky-900/60 transition-all cursor-pointer" />
            {editItem?.pdf_path && !pdfFile && <p className="text-green-500 text-xs mt-1">✅ Mavjud PDF saqlanadi</p>}
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="pub_book" checked={!!form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked ? 1 : 0 })} className="w-4 h-4 accent-sky-500" />
            <label htmlFor="pub_book" className="text-sm text-gray-300">Saytda ko'rsatilsin</label>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 transition-all text-sm">Bekor qilish</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold text-sm hover:from-sky-400 hover:to-indigo-500 transition-all disabled:opacity-50">
              {saving ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
