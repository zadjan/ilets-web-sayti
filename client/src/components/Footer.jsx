import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const elementPaths = ['/sites', '/hacks', '/books', '/community'];

export default function Footer() {
  const { t } = useLanguage();

  const navLinks = [
    { path: '/sites', label: t.nav.sites },
    { path: '/hacks', label: t.nav.hacks },
    { path: '/books', label: t.nav.books },
    { path: '/community', label: t.nav.community },
  ];

  return (
    <footer className="bg-gray-950 border-t border-white/10 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo va tavsif */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <img src="/logo.svg" className="h-10 w-auto" alt="IELTS Way" />
              <span className="text-white font-bold text-xl">
                IELTS <span className="text-orange-400">Way</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">{t.footer.description}</p>
            {/* Element havolalari - faqat matn */}
            <div className="flex gap-2 flex-wrap">
              {elementPaths.map((path, i) => (
                <Link
                  key={path}
                  to={path}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-xs text-gray-400 hover:text-white transition-all"
                >
                  {t.footer.elements[i]}
                </Link>
              ))}
            </div>
          </div>

          {/* Bo'limlar */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.links}</h3>
            <ul className="space-y-2 text-sm">
              {navLinks.map(({ path, label }) => (
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
            <h3 className="text-white font-semibold mb-4">{t.footer.contact}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://t.me/ieltshubuz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@ieltshubuz.com"
                  className="hover:text-white transition-colors"
                >
                  info@ieltshubuz.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/ieltshubuz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <span>© {new Date().getFullYear()} IELTS Way. {t.footer.rights}</span>
          <span className="text-gray-600">{t.footer.aboutText}</span>
        </div>
      </div>
    </footer>
  );
}
