require('dotenv').config();
const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'db/ielts.db'));

// 1. Luke's URL ni to'g'irla
db.prepare('UPDATE sites SET link = ?, description = ? WHERE id = 6').run(
  'https://teacherluke.co.uk',
  "Luke Thompson tomonidan ingliz tili podcastlari. Har podcast 20-40 daqiqa, real suhbatlar va grammatika darslar. Listening ko'nikmasini oshirish uchun ideal."
);
console.log('✅ Luke fixlandi');

// 2. Eski kanal entrylarini o'chir (IELTS Advantage va English with Lucy channel)
db.prepare('DELETE FROM sites WHERE id IN (5, 7)').run();
console.log('✅ Eski kanal entrylar ochirildi');

// 3. Yangi video entrylar qo'sh
const ins = db.prepare(
  'INSERT INTO sites (type, name, description, link, image_url, members_count, is_published) VALUES (?,?,?,?,?,?,1)'
);

// English with Lucy — Tenses videolari
ins.run(
  'youtube',
  'English with Lucy — ALL 12 Tenses',
  "Ingliz tilidagi barcha 12 ta zamonni bir videoda o'rganish. Present Simple dan Future Perfect Continuousgacha — misollar va tushuntirishlar bilan. IELTS Writing va Speaking uchun juda muhim.",
  'https://www.youtube.com/watch?v=VlnDiO57P7I',
  '',
  '12.4M'
);

ins.run(
  'youtube',
  'English with Lucy — Tenses Chart & Formulas',
  "Barcha ingliz tili zamonlari jadval shaklida. Har bir zamonning ishlatilish holatlari, formula va misollar bilan. Grammatika mustahkamlash uchun.",
  'https://www.youtube.com/watch?v=R3psCH0LTIA',
  '',
  '12.4M'
);

// IELTS Advantage — Speaking test videolari
ins.run(
  'youtube',
  'IELTS Advantage — Speaking Band 9 (Full Test)',
  "To'liq IELTS Speaking imtihoni namunasi. Band 9 darajasidagi javoblar tahlili. Part 1, 2 va 3 ni qanday topshirish haqida real ko'rsatma.",
  'https://www.youtube.com/watch?v=9OX4fCMSd20',
  '',
  '290K'
);

ins.run(
  'youtube',
  'IELTS Advantage — Speaking Part 1 Tips',
  'IELTS Speaking Part 1 uchun eng samarali maslahatlar. Oddiy savollarga qanday kengaytirilgan, tabiiy va ravon javob berish mumkin.',
  'https://www.youtube.com/watch?v=6CqMCWLoWNM',
  '',
  '290K'
);

ins.run(
  'youtube',
  'IELTS Advantage — Speaking Part 2 (Cue Card)',
  "Cue card topshirigida 2 daqiqa gapirish uchun struktura va strategiyalar. Namuna mavzular va Band 8 darajasidagi javoblar.",
  'https://www.youtube.com/watch?v=8KN4hHHwW-0',
  '',
  '290K'
);

ins.run(
  'youtube',
  'IELTS Advantage — Speaking Part 3 Model Answers',
  "Abstract va murakkab savollariga Band 8-9 darajasida javob berish usullari. Fikrlarni rivojlantirish va argumentlar qurish.",
  'https://www.youtube.com/watch?v=pQfmf5GoSjA',
  '',
  '290K'
);

console.log('✅ Yangi video entrylar qoshildi');

const all = db.prepare('SELECT id, name, type, link FROM sites ORDER BY id').all();
console.log('\nBarcha kanallar/videolar:');
all.forEach(s => console.log(` ${s.id}. [${s.type}] ${s.name.slice(0, 45)}`));

db.close();
