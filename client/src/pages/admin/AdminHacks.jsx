import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';

const emptyForm = { name: '', description: '', guide: '', video_link: '', image_url: '', is_published: 1 };

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
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">✕</button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function AdminHacks() {
  const [hacks, setHacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => { api.get('/hacks/admin/all').then((r) => setHacks(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setError(''); setModal(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ ...item }); setError(''); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) { setError('Nom majburiy.'); return; }
    setSaving(true); setError('');
    try {
      if (editItem) await api.put(`/hacks/${editItem.id}`, form);
      else await api.post('/hacks', form);
      load(); setModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`/hacks/${id}`); load();
  };

  const togglePublish = async (item) => {
    await api.put(`/hacks/${item.id}`, { ...item, is_published: item.is_published ? 0 : 1 }); load();
  };

  return (
    <AdminLayout title="💧 O'rganish usullari boshqaruvi">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <p className="text-gray-400 text-sm">{hacks.length} ta usul</p>
        <button onClick={openAdd} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-sm hover:from-blue-500 hover:to-cyan-500 transition-all hover:scale-105">
          + Yangi usul
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />)}</div>
      ) : hacks.length === 0 ? (
        <div className="text-center py-16 text-gray-500"><span className="text-4xl block mb-3">💧</span>Hali usul yo'q.</div>
      ) : (
        <div className="grid gap-4">
          {hacks.map((hack) => (
            <motion.div key={hack.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-start gap-4 p-5 rounded-2xl bg-gray-900 border border-white/5 hover:border-white/10 transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-white font-medium">{hack.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${hack.is_published ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'}`}>
                    {hack.is_published ? 'Ko\'rinadi' : 'Yashirin'}
                  </span>
                </div>
                {hack.description && <p className="text-gray-500 text-xs line-clamp-2">{hack.description}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => togglePublish(hack)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${hack.is_published ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50' : 'bg-green-900/30 text-green-400 hover:bg-green-900/50'}`}>
                  {hack.is_published ? 'Yashir' : 'Chiqar'}
                </button>
                <button onClick={() => openEdit(hack)} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/15 text-xs font-medium transition-all">Tahrirlash</button>
                <button onClick={() => handleDelete(hack.id)} className="px-3 py-1.5 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 text-xs font-medium transition-all">O'chirish</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editItem ? 'Usulni tahrirlash' : 'Yangi usul qo\'shish'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Usul nomi *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Shadowing Texnikasi"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Qisqacha tavsif</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Bu usul nima uchun samarali..." rows={2}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Batafsil qo'llanma</label>
            <textarea value={form.guide} onChange={(e) => setForm({ ...form, guide: e.target.value })} placeholder="1. Birinchi qadam&#10;2. Ikkinchi qadam..." rows={5}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors resize-none font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Video link (YouTube)</label>
            <input type="url" value={form.video_link} onChange={(e) => setForm({ ...form, video_link: e.target.value })} placeholder="https://youtube.com/watch?v=..."
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Rasm URL (ixtiyoriy)</label>
            <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..."
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="pub_hack" checked={!!form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked ? 1 : 0 })} className="w-4 h-4 accent-blue-500" />
            <label htmlFor="pub_hack" className="text-sm text-gray-300">Saytda ko'rsatilsin</label>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 transition-all text-sm">Bekor qilish</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-sm hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50">
              {saving ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
