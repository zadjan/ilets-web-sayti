import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';

const emptyForm = { type: 'youtube', name: '', description: '', link: '', image_url: '', members_count: '', is_published: 1 };

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]"
        >
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

export default function AdminSites() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/sites/admin/all')
      .then((r) => setSites(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setError(''); setModal(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ ...item }); setError(''); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.link) { setError('Nom va link majburiy.'); return; }
    setSaving(true); setError('');
    try {
      if (editItem) {
        await api.put(`/sites/${editItem.id}`, form);
      } else {
        await api.post('/sites', form);
      }
      load();
      setModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`/sites/${id}`);
    load();
  };

  const togglePublish = async (item) => {
    await api.put(`/sites/${item.id}`, { ...item, is_published: item.is_published ? 0 : 1 });
    load();
  };

  return (
    <AdminLayout title="🔥 Kanallar boshqaruvi">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-gray-400 text-sm">{sites.length} ta kanal</p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold text-sm hover:from-orange-400 hover:to-red-500 transition-all hover:scale-105"
        >
          + Yangi kanal
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      ) : sites.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <span className="text-4xl block mb-3">🔥</span>
          Hali kanal yo'q. Birinchi kanalni qo'shing!
        </div>
      ) : (
        <div className="grid gap-4">
          {sites.map((site) => (
            <motion.div
              key={site.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-gray-900 border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-2xl">{site.type === 'youtube' ? '▶️' : '✈️'}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-medium truncate">{site.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${site.type === 'youtube' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>
                      {site.type}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${site.is_published ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'}`}>
                      {site.is_published ? 'Ko\'rinadi' : 'Yashirin'}
                    </span>
                  </div>
                  {site.members_count && <div className="text-gray-500 text-xs mt-0.5">👥 {site.members_count}</div>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => togglePublish(site)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${site.is_published ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50' : 'bg-green-900/30 text-green-400 hover:bg-green-900/50'}`}
                >
                  {site.is_published ? 'Yashir' : 'Chiqar'}
                </button>
                <button
                  onClick={() => openEdit(site)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/15 text-xs font-medium transition-all"
                >
                  Tahrirlash
                </button>
                <button
                  onClick={() => handleDelete(site.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 text-xs font-medium transition-all"
                >
                  O'chirish
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editItem ? 'Kanalni tahrirlash' : 'Yangi kanal qo\'shish'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tur *</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-orange-500/60 transition-colors"
              >
                <option value="youtube">YouTube</option>
                <option value="telegram">Telegram</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">A'zolar soni</label>
              <input
                type="text"
                value={form.members_count}
                onChange={(e) => setForm({ ...form, members_count: e.target.value })}
                placeholder="250K"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Kanal nomi *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="IELTS Lyna"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tavsif</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Kanal haqida qisqacha ma'lumot..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Link *</label>
            <input
              type="url"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://youtube.com/@..."
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Rasm URL</label>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="pub_site"
              checked={!!form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked ? 1 : 0 })}
              className="w-4 h-4 accent-orange-500"
            />
            <label htmlFor="pub_site" className="text-sm text-gray-300">Saytda ko'rsatilsin</label>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 transition-all text-sm">Bekor qilish</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold text-sm hover:from-orange-400 hover:to-red-500 transition-all disabled:opacity-50">
              {saving ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
