import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';

const statCards = [
  { key: 'sites', label: 'Kanallar', icon: '🔥', path: '/admin/sites', color: 'from-orange-900/40 to-red-900/40', border: 'border-orange-500/30' },
  { key: 'hacks', label: "O'rganish usullari", icon: '💧', path: '/admin/hacks', color: 'from-blue-900/40 to-cyan-900/40', border: 'border-blue-500/30' },
  { key: 'books', label: 'Kitoblar', icon: '📚', path: '/admin/books', color: 'from-sky-900/40 to-indigo-900/40', border: 'border-sky-500/30' },
  { key: 'questions', label: 'Savollar', icon: '❓', path: '/admin/community', color: 'from-green-900/40 to-emerald-900/40', border: 'border-green-500/30' },
];

const quickLinks = [
  { path: '/admin/sites', label: 'Kanal qo\'shish', icon: '🔥', action: 'yangi' },
  { path: '/admin/hacks', label: 'Usul qo\'shish', icon: '💧', action: 'yangi' },
  { path: '/admin/books', label: 'Kitob qo\'shish', icon: '📚', action: 'yangi' },
  { path: '/admin/community', label: 'Savollarni ko\'rish', icon: '🌍', action: 'ko\'r' },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ sites: 0, hacks: 0, books: 0, questions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/sites/admin/all'),
      api.get('/hacks/admin/all'),
      api.get('/books/admin/all'),
      api.get('/community/admin/questions'),
    ]).then(([s, h, b, q]) => {
      setCounts({
        sites: s.data.length,
        hacks: h.data.length,
        books: b.data.length,
        questions: q.data.length,
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {/* Salomlashish */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">
          Xush kelibsiz, Admin! 👋
        </h2>
        <p className="text-gray-400">IELTS Way boshqaruv paneli</p>
      </div>

      {/* Statistika kartalar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map(({ key, label, icon, path, color, border }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={path}
              className={`block rounded-2xl bg-gradient-to-br ${color} border ${border} p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{icon}</span>
                <span className="text-2xl font-bold text-white">
                  {loading ? '—' : counts[key]}
                </span>
              </div>
              <div className="text-gray-300 text-sm font-medium">{label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Tezkor harakatlar */}
      <div className="mb-10">
        <h3 className="text-white font-semibold text-lg mb-4">Tezkor harakatlar</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map(({ path, label, icon }, i) => (
            <motion.div
              key={path}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08 }}
            >
              <Link
                to={path}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <span className="text-3xl">{icon}</span>
                <span className="text-sm text-gray-300 font-medium">{label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ma'lumot */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl bg-gradient-to-br from-orange-950/40 to-red-950/40 border border-orange-500/20 p-6"
      >
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <span>ℹ️</span> Eslatma
        </h3>
        <ul className="text-gray-400 text-sm space-y-2">
          <li>• Yangi kanal, usul yoki kitob qo'shish uchun tegishli bo'limga o'ting</li>
          <li>• Community bo'limida foydalanuvchilarning savollariga javob bering</li>
          <li>• Publish/Unpublish tugmasi bilan elementlarni ko'rinadigan/ko'rinmas qilishingiz mumkin</li>
          <li>• PDF fayllar server/uploads papkasiga saqlanadi</li>
        </ul>
      </motion.div>
    </AdminLayout>
  );
}
