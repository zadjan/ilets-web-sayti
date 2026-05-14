import { createContext, useContext, useState } from 'react';

const translations = {
  uz: {
    // Navbar
    nav: {
      home: 'Bosh sahifa',
      sites: 'Foydali kanallar',
      hacks: "O'rganish usullari",
      books: 'Kitoblar',
      community: 'Jamiyat',
    },

    // Footer
    footer: {
      description: "O'zbek tilida IELTS o'rganish uchun eng yaxshi platforma. Foydali kanallar, o'rganish usullari, kitoblar va faol jamiyat.",
      links: 'Tezkor havolalar',
      contact: 'Aloqa',
      about: 'Sayt haqida',
      aboutText: 'IELTS Way — O\'zbek tilida IELTS tayyorlash platformasi. Barcha materiallar bepul.',
      rights: 'Barcha huquqlar himoyalangan.',
      elements: ['Olov', 'Suv', 'Havo', 'Yer'],
    },

    // Home
    home: {
      hero: 'IELTS ni tez va samarali o\'rgan',
      heroSub: 'O\'zbek tilida eng to\'liq IELTS platformasi — kanallar, usullar, kitoblar va faol jamiyat.',
      startBtn: 'Boshlash',
      learnMore: 'Ko\'proq',
      benefitsTitle: 'Saytdan nima olasiz?',
      cards: [
        {
          title: 'Foydali kanallar',
          subtitle: 'Olov',
          description: 'Eng yaxshi YouTube va Telegram kanallar. IELTS ustalaridan to\'g\'ridan-to\'g\'ri o\'rganing.',
          stats: '50+ kanal',
        },
        {
          title: "O'rganish usullari",
          subtitle: 'Suv',
          description: 'Shadowing, Dictation, Spaced Repetition va boshqa ilmiy asosda isbotlangan usullar.',
          stats: '10+ usul',
        },
        {
          title: 'Kitoblar',
          subtitle: 'Havo',
          description: "Cambridge, Barron's va boshqa sertifikatlangan IELTS kitoblari. PDF yuklab oling.",
          stats: '30+ kitob',
        },
        {
          title: 'Jamiyat',
          subtitle: 'Yer',
          description: 'Savol bering, tajriba ulashing, motivatsiya oling. Birga o\'rganamiz!',
          stats: "1000+ a'zo",
        },
      ],
      benefits: [
        { title: 'Bepul', desc: 'Barcha materiallar mutlaqo bepul.' },
        { title: "O'zbek tilida", desc: "Tushuntirish o'zbek tilida." },
        { title: 'Mobil qulay', desc: 'Har qanday qurilmadan foydalaning.' },
        { title: 'Doimiy yangilanadi', desc: "Yangi materiallar qo'shiladi." },
        { title: 'Jonli yordam', desc: 'Savollaringizga javob beriladi.' },
        { title: 'Natija', desc: "O'quvchilarimiz 7+ ball olmoqda." },
      ],
      goBtn: "Ko'rish",
    },

    // Sites
    sites: {
      title: 'Foydali kanallar',
      subtitle: 'IELTS bo\'yicha eng yaxshi YouTube va Telegram kanallar.',
      filterAll: 'Barchasi',
      filterYt: 'YouTube',
      filterTg: 'Telegram',
      members: "a'zo",
      visitBtn: 'Kanalga o\'tish',
      joinBtn: 'Kanalga kirish',
      loading: 'Yuklanmoqda...',
      empty: 'Hozircha kanallar yo\'q.',
      error: 'Kanallarni yuklashda xato.',
    },

    // Hacks
    hacks: {
      title: "O'rganish usullari",
      subtitle: 'Ilmiy asosda isbotlangan IELTS tayyorlash texnikalari.',
      guideTitle: 'Qanday qilish kerak:',
      videoBtn: 'Video ko\'rish',
      loading: 'Yuklanmoqda...',
      empty: 'Hozircha usullar yo\'q.',
      error: 'Usullarni yuklashda xato.',
    },

    // Books
    books: {
      title: 'Kitoblar',
      subtitle: 'IELTS uchun eng yaxshi kitoblar va qo\'llanmalar.',
      filterAll: 'Barchasi',
      levels: {
        all: 'Barcha darajalar',
        beginner: 'Boshlang\'ich',
        intermediate: 'O\'rta',
        advanced: 'Yuqori',
      },
      categories: {
        all: 'Barcha kategoriyalar',
        Grammar: 'Grammatika',
        Vocabulary: 'So\'z boyligi',
        Speaking: 'Gapirish',
        Listening: 'Tinglash',
        Reading: 'O\'qish',
        Writing: 'Yozish',
        General: 'Umumiy',
      },
      author: 'Muallif',
      level: 'Daraja',
      category: 'Kategoriya',
      downloadBtn: 'PDF yuklab olish',
      noFile: 'PDF mavjud emas',
      loading: 'Yuklanmoqda...',
      empty: 'Hozircha kitoblar yo\'q.',
      error: 'Kitoblarni yuklashda xato.',
    },

    // Community
    community: {
      title: 'Jamiyat',
      subtitle: 'Savol bering, motivatsiya oling, tajriba ulashing.',
      qaTitle: 'Savol-Javob',
      qaBtn: 'Savol yuborish',
      qaName: 'Ismingiz',
      qaEmail: 'Email (ixtiyoriy)',
      qaQuestion: 'Savolingiz',
      qaSend: 'Yuborish',
      qaSending: 'Yuborilmoqda...',
      qaSuccess: 'Savolingiz yuborildi! Tez orada javob beramiz.',
      qaError: 'Xato yuz berdi. Qayta urinib ko\'ring.',
      answered: 'Javob berildi',
      pending: 'Kutilmoqda',
      answer: 'Javob',
      motivTitle: 'Motivatsiya',
      testimonialsTitle: 'Muvaffaqiyat hikoyalari',
      stars: 'yulduz',
      loading: 'Yuklanmoqda...',
      membersLabel: "A'zolar",
      questionsLabel: 'Savollar',
      answeredLabel: 'Javob berilgan',
      regTitle: "Ro'yhatdan o'ting",
      regSubtitle: "IELTS jamoamizga qo'shiling — bepul va qulay.",
      regName: 'Ismingiz',
      regEmail: 'Email manzilingiz',
      regGoal: 'Maqsad ball',
      regLevel: "Hozirgi daraja",
      regSubmit: "Ro'yhatdan o'tish",
      regSubmitting: "Yuborilmoqda...",
      regSuccess: "Muvaffaqiyatli ro'yhatdan o'tdingiz! Xush kelibsiz!",
      regError: "Xato yuz berdi. Qayta urinib ko'ring.",
    },
  },

  en: {
    // Navbar
    nav: {
      home: 'Home',
      sites: 'Useful Channels',
      hacks: 'Study Methods',
      books: 'Books',
      community: 'Community',
    },

    // Footer
    footer: {
      description: 'The best platform for learning IELTS in Uzbek. Useful channels, study methods, books and an active community.',
      links: 'Quick Links',
      contact: 'Contact',
      about: 'About',
      aboutText: 'IELTS Way — an IELTS preparation platform. All materials are free.',
      rights: 'All rights reserved.',
      elements: ['Fire', 'Water', 'Air', 'Earth'],
    },

    // Home
    home: {
      hero: 'Learn IELTS Fast and Effectively',
      heroSub: 'The most complete IELTS platform in Uzbek — channels, methods, books and an active community.',
      startBtn: 'Get Started',
      learnMore: 'Learn More',
      benefitsTitle: 'What do you get?',
      cards: [
        {
          title: 'Useful Channels',
          subtitle: 'Fire',
          description: 'The best YouTube and Telegram channels. Learn directly from IELTS experts.',
          stats: '50+ channels',
        },
        {
          title: 'Study Methods',
          subtitle: 'Water',
          description: 'Shadowing, Dictation, Spaced Repetition and other scientifically proven methods.',
          stats: '10+ methods',
        },
        {
          title: 'Books',
          subtitle: 'Air',
          description: "Cambridge, Barron's and other certified IELTS books. Download PDF.",
          stats: '30+ books',
        },
        {
          title: 'Community',
          subtitle: 'Earth',
          description: 'Ask questions, share experience, get motivation. We learn together!',
          stats: '1000+ members',
        },
      ],
      benefits: [
        { title: 'Free', desc: 'All materials are completely free.' },
        { title: 'In Uzbek', desc: 'Explanations in Uzbek language.' },
        { title: 'Mobile Friendly', desc: 'Use from any device.' },
        { title: 'Updated Regularly', desc: 'New materials are added constantly.' },
        { title: 'Live Support', desc: 'Your questions will be answered.' },
        { title: 'Results', desc: 'Our students score 7+.' },
      ],
      goBtn: 'Explore',
    },

    // Sites
    sites: {
      title: 'Useful Channels',
      subtitle: 'The best YouTube and Telegram channels for IELTS preparation.',
      filterAll: 'All',
      filterYt: 'YouTube',
      filterTg: 'Telegram',
      members: 'members',
      visitBtn: 'Visit Channel',
      joinBtn: 'Join Channel',
      loading: 'Loading...',
      empty: 'No channels yet.',
      error: 'Error loading channels.',
    },

    // Hacks
    hacks: {
      title: 'Study Methods',
      subtitle: 'Scientifically proven IELTS preparation techniques.',
      guideTitle: 'How to do it:',
      videoBtn: 'Watch Video',
      loading: 'Loading...',
      empty: 'No methods yet.',
      error: 'Error loading methods.',
    },

    // Books
    books: {
      title: 'Books',
      subtitle: 'The best books and guides for IELTS.',
      filterAll: 'All',
      levels: {
        all: 'All Levels',
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
      },
      categories: {
        all: 'All Categories',
        Grammar: 'Grammar',
        Vocabulary: 'Vocabulary',
        Speaking: 'Speaking',
        Listening: 'Listening',
        Reading: 'Reading',
        Writing: 'Writing',
        General: 'General',
      },
      author: 'Author',
      level: 'Level',
      category: 'Category',
      downloadBtn: 'Download PDF',
      noFile: 'No PDF available',
      loading: 'Loading...',
      empty: 'No books yet.',
      error: 'Error loading books.',
    },

    // Community
    community: {
      title: 'Community',
      subtitle: 'Ask questions, get motivation, share experience.',
      qaTitle: 'Q&A',
      qaBtn: 'Ask a Question',
      qaName: 'Your Name',
      qaEmail: 'Email (optional)',
      qaQuestion: 'Your Question',
      qaSend: 'Submit',
      qaSending: 'Sending...',
      qaSuccess: 'Your question was submitted! We will answer soon.',
      qaError: 'An error occurred. Please try again.',
      answered: 'Answered',
      pending: 'Pending',
      answer: 'Answer',
      motivTitle: 'Motivation',
      testimonialsTitle: 'Success Stories',
      stars: 'stars',
      loading: 'Loading...',
      membersLabel: 'Members',
      questionsLabel: 'Questions',
      answeredLabel: 'Answered',
      regTitle: 'Join the Community',
      regSubtitle: 'Sign up for free — fast and easy.',
      regName: 'Your Name',
      regEmail: 'Your Email',
      regGoal: 'Target Score',
      regLevel: 'Current Level',
      regSubmit: 'Register',
      regSubmitting: 'Submitting...',
      regSuccess: 'Successfully registered! Welcome to IELTS Way!',
      regError: 'An error occurred. Please try again.',
    },
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('ielts_lang') || 'uz');

  const toggleLang = () => {
    const next = lang === 'uz' ? 'en' : 'uz';
    setLang(next);
    localStorage.setItem('ielts_lang', next);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
