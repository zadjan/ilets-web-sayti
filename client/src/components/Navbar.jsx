import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { lang, toggleLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return null;

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/sites', label: t.nav.sites },
    { path: '/hacks', label: t.nav.hacks },
    { path: '/books', label: t.nav.books },
    { path: '/community', label: t.nav.community },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-lg shadow-lg shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <img src="/logo.svg" className="h-9 w-auto group-hover:scale-110 transition-transform" alt="IELTS Way" />
            <span className="text-white font-bold text-lg tracking-wide">
              IELTS <span className="text-orange-400">Way</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Til almashtirish tugmasi */}
          <button
            onClick={toggleLang}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/15 transition-all duration-200 cursor-pointer select-none"
            title={lang === 'uz' ? 'Switch to English' : "O'zbek tiliga o'tish"}
          >
            <span className="text-base">{lang === 'uz' ? '🇺🇿' : '🇬🇧'}</span>
            <span className="text-white text-sm font-semibold tracking-wider">
              {lang === 'uz' ? 'UZ' : 'EN'}
            </span>
            <span className="text-gray-400 text-xs">
              {lang === 'uz' ? '→ EN' : '→ UZ'}
            </span>
          </button>

          {/* Mobile: til tugmasi + burger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/15 transition-all text-sm"
            >
              <span>{lang === 'uz' ? '🇺🇿' : '🇬🇧'}</span>
              <span className="text-white font-semibold">{lang === 'uz' ? 'UZ' : 'EN'}</span>
            </button>

            <button
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <div className={`w-5 h-0.5 bg-white my-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/90 backdrop-blur-lg border-t border-white/10"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === path
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
