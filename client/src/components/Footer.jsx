import { Link } from 'react-router-dom';

const elements = [
  { icon: '🔥', label: 'Olov', path: '/sites' },
  { icon: '💧', label: 'Suv', path: '/hacks' },
  { icon: '🌤️', label: 'Havo', path: '/books' },
  { icon: '🌍', label: 'Yer', path: '/community' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-white/10 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo va tavsif */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-xl font-bold text-white">
                I
              </div>
              <span className="text-white font-bold text-xl">
                IELTS <span className="text-orange-400">Hub</span> UZ
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              O'zbek tilida IELTS o'rganish uchun eng yaxshi platforma.
              Foydali kanallar, o'rganish usullari, kitoblar va faol jamiyat.
            </p>
            {/* 4 ta element ikonalari */}
            <div className="flex gap-3">
              {elements.map(({ icon, label, path }) => (
                <Link
                  key={path}
                  to={path}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-lg transition-all hover:scale-110"
                  title={label}
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Bo'limlar */}
          <div>
            <h3 className="text-white font-semibold mb-4">Bo'limlar</h3>
            <ul className="space-y-2 text-sm">
              {[
                { path: '/sites', label: '🔥 Foydali kanallar' },
                { path: '/hacks', label: "💧 O'rganish usullari" },
                { path: '/books', label: '🌤️ Kitoblar' },
                { path: '/community', label: '🌍 Jamiyat' },
              ].map(({ path, label }) => (
                <li key={path}>
                  <Link to={path} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aloqa */}
          <div>
            <h3 className="text-white font-semibold mb-4">Aloqa</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://t.me/ieltshubuz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <span className="text-blue-400">✈️</span> Telegram kanal
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@ieltshubuz.com"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <span className="text-orange-400">📧</span> info@ieltshubuz.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/ieltshubuz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <span className="text-pink-400">📸</span> Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <span>© {new Date().getFullYear()} IELTS Hub UZ. Barcha huquqlar himoyalangan.</span>
          <span className="text-gray-600">O'zbek tilida IELTS platformasi</span>
        </div>
      </div>
    </footer>
  );
}
