// Bu skriptni bir marta ishga tushiring: node add-channels.js
// Yangi kanallarni mavjud bazaga qo'shadi

require('dotenv').config();
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'db/ielts.db'));

const newChannels = [
  {
    type: 'youtube',
    name: 'IELTS Advantage',
    description: "IELTS Speaking testlari va band 7-9 uchun mo'ljallangan to'liq strategiyalar. Real imtihon savollariga namuna javoblar bilan.",
    link: 'https://www.youtube.com/@IELTSAdvantage',
    image_url: '',
    members_count: '290K',
  },
  {
    type: 'youtube',
    name: "Luke's English Podcast",
    description: "Ingliz tili o'qituvchisi Luke Thompson tomonidan 20 ta podcast: ingliz tilini tabiiy va qiziqarli yo'l bilan o'rganish. Vocabulary, grammar, idiomlar — hammasi bir joyda.",
    link: 'https://www.youtube.com/@teacherluke',
    image_url: '',
    members_count: '170K',
  },
  {
    type: 'youtube',
    name: 'English with Lucy',
    description: '"Learn All Tenses" videolari va boshqa grammatika darslar bilan ingliz tilini professional darajada o\'rganing. IELTS Writing va Speaking uchun juda foydali.',
    link: 'https://www.youtube.com/@EnglishwithLucy',
    image_url: '',
    members_count: '12.4M',
  },
];

const insert = db.prepare(
  'INSERT INTO sites (type, name, description, link, image_url, members_count, is_published) VALUES (?, ?, ?, ?, ?, ?, 1)'
);

let added = 0;
for (const ch of newChannels) {
  const exists = db.prepare('SELECT id FROM sites WHERE name = ?').get(ch.name);
  if (!exists) {
    insert.run(ch.type, ch.name, ch.description, ch.link, ch.image_url, ch.members_count);
    console.log(`✅ Qo'shildi: ${ch.name}`);
    added++;
  } else {
    console.log(`⏭  Allaqachon bor: ${ch.name}`);
  }
}

// Nom o'zgarishini testimoniallarida ham yangilash
db.prepare("UPDATE testimonials SET text = REPLACE(text, 'IELTS Hub UZ', 'IELTS Way') WHERE text LIKE '%IELTS Hub UZ%'").run();

console.log(`\nJami ${added} ta kanal qo'shildi.`);
db.close();
