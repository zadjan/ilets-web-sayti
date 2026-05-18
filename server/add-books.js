require('dotenv').config();
const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'db/ielts.db'));

// Mavjud kitoblarni PDF link bilan yangilash
db.prepare(`UPDATE books SET
  author = 'Cambridge University Press',
  description = 'Cambridge IELTS 17 — 4 ta to\'liq amaliy test (Academic). Rasmiy Cambridge standartidagi Listening, Reading, Writing va Speaking bo\'limlari. Javoblar va audio script kiritilgan.',
  pdf_path = 'https://archive.org/download/cambridge-ielts-17/Cambridge.IELTS.17.Academic.pdf',
  level = 'advanced',
  is_published = 1
  WHERE name = 'Cambridge IELTS 17'`).run();

db.prepare(`UPDATE books SET
  author = 'Pauline Cullen',
  description = 'IELTS Speaking va Writing uchun zarur so\'z boyligini rivojlantiruvchi kitob. Mavzu bo\'yicha lug\'atlar, misollar va mashqlar bilan. Beginners uchun ideal.',
  pdf_path = 'https://archive.org/download/ielts-vocabulary-booster/IELTS.Vocabulary.Booster.pdf',
  level = 'beginner',
  is_published = 1
  WHERE name = 'IELTS Vocabulary Booster'`).run();

db.prepare(`UPDATE books SET
  author = 'Cambridge University Press',
  description = 'IELTS Writing Task 2 uchun band 7-9 namuna esselar to\'plami. Argumentative, Discussion, Advantages/Disadvantages va Opinion esselari. Har biri examiner izohli.',
  pdf_path = 'https://archive.org/download/ielts-writing-task-2-essays/IELTS.Writing.Task2.Essays.pdf',
  level = 'advanced',
  is_published = 1
  WHERE name = 'IELTS Writing Task 2 Essays'`).run();

db.prepare(`UPDATE books SET
  author = 'Cambridge University Press',
  description = 'IELTS Speaking imtihoni uchun to\'liq qo\'llanma. Part 1, 2, 3 strategiyalari, namuna javoblar va foydali iboralar. Band 7+ ball olishga yo\'naltirilgan.',
  pdf_path = 'https://archive.org/download/ielts-speaking-success/IELTS.Speaking.Success.pdf',
  level = 'intermediate',
  is_published = 1
  WHERE name = 'IELTS Speaking Success'`).run();

console.log('✅ Mavjud kitoblar yangilandi');

// Yangi kitoblar qo'shish
const ins = db.prepare(`
  INSERT OR IGNORE INTO books (name, author, level, category, description, pdf_path, cover_url, is_published)
  VALUES (?, ?, ?, ?, ?, ?, '', 1)
`);

const newBooks = [
  {
    name: 'Cambridge IELTS 16 Academic',
    author: 'Cambridge University Press',
    level: 'advanced',
    category: 'General',
    description: 'Cambridge IELTS 16 Academic — 4 ta to\'liq imtihon to\'plami. Har bir test uchun audio, javoblar va Writing namunalari. 2022-yil nashri.',
    pdf: 'https://archive.org/download/cambridge-ielts-16/Cambridge.IELTS.16.Academic.pdf',
  },
  {
    name: 'Cambridge IELTS 15 Academic',
    author: 'Cambridge University Press',
    level: 'advanced',
    category: 'General',
    description: 'Cambridge IELTS 15 Academic — rasmiy imtihon materiallariga asoslangan 4 ta amaliy test. Listening, Reading, Writing va Speaking uchun.',
    pdf: 'https://archive.org/download/cambridge-ielts-15/Cambridge.IELTS.15.Academic.pdf',
  },
  {
    name: 'Cambridge IELTS 14 Academic',
    author: 'Cambridge University Press',
    level: 'intermediate',
    category: 'General',
    description: 'Cambridge IELTS 14 Academic — 4 ta to\'liq test va javoblar. O\'rta darajadan yuqori darajaga ko\'tarilmoqchi bo\'lgan talabalar uchun.',
    pdf: 'https://archive.org/download/cambridge-ielts-14/Cambridge.IELTS.14.Academic.pdf',
  },
  {
    name: 'Cambridge IELTS 13 Academic',
    author: 'Cambridge University Press',
    level: 'intermediate',
    category: 'General',
    description: 'Cambridge IELTS 13 Academic — 4 ta to\'liq test. IELTS 6.0–7.0 maqsad qo\'ygan o\'quvchilar uchun eng ko\'p tavsiya etiladigan kitoblardan biri.',
    pdf: 'https://archive.org/download/cambridge-ielts-13/Cambridge.IELTS.13.Academic.pdf',
  },
  {
    name: 'Cambridge Grammar for IELTS',
    author: 'Diana Hopkins, Pauline Cullen',
    level: 'intermediate',
    category: 'Grammar',
    description: 'IELTS uchun maxsus grammatika kitobi. 25 ta mavzu, har biri tushuntirish + mashqlar bilan. Writing va Speaking grammatika xatolarini kamaytirish uchun.',
    pdf: 'https://archive.org/download/cambridge-grammar-for-ielts/Cambridge.Grammar.for.IELTS.pdf',
  },
  {
    name: 'Cambridge Vocabulary for IELTS Advanced',
    author: 'Pauline Cullen',
    level: 'advanced',
    category: 'Vocabulary',
    description: 'IELTS band 6.5-8.0 uchun ilg\'or lug\'at kitobi. Academic so\'z ro\'yxatlari, collocations va idiomalar bilan. Writing va Speaking uchun juda zarur.',
    pdf: 'https://archive.org/download/cambridge-vocabulary-for-ielts-advanced/Cambridge.Vocabulary.IELTS.Advanced.pdf',
  },
  {
    name: 'Collins Writing for IELTS',
    author: 'Anneli Williams',
    level: 'intermediate',
    category: 'Writing',
    description: 'IELTS Writing Task 1 va Task 2 ni boshlang\'ichdan o\'rganish. 12 ta unit, har birida namuna esselar, band descriptors va yozish strategiyalari.',
    pdf: 'https://archive.org/download/collins-writing-for-ielts/Collins.Writing.for.IELTS.pdf',
  },
  {
    name: 'Collins Listening for IELTS',
    author: 'Els Van Geyte',
    level: 'beginner',
    category: 'Listening',
    description: 'IELTS Listening bo\'limini boshlang\'ichdan o\'rganish. Section 1–4 strategiyalari, xatolardan saqlanish usullari va ko\'plab mashq testlari.',
    pdf: 'https://archive.org/download/collins-listening-for-ielts/Collins.Listening.for.IELTS.pdf',
  },
  {
    name: 'Collins Reading for IELTS',
    author: 'Fiona Aish, Jo Tomlinson',
    level: 'intermediate',
    category: 'Reading',
    description: 'IELTS Reading bo\'limi uchun maxsus qo\'llanma. True/False/Not Given, Matching Headings, Summary Completion va boshqa task turlari uchun strategiyalar.',
    pdf: 'https://archive.org/download/collins-reading-for-ielts/Collins.Reading.for.IELTS.pdf',
  },
  {
    name: 'Collins Speaking for IELTS',
    author: 'Rhona Snelling',
    level: 'intermediate',
    category: 'Speaking',
    description: 'IELTS Speaking Part 1, 2 va 3 uchun to\'liq qo\'llanma. Pronunciation, fluency, coherence va lexical resource ko\'rsatkichlarini oshirish usullari.',
    pdf: 'https://archive.org/download/collins-speaking-for-ielts/Collins.Speaking.for.IELTS.pdf',
  },
  {
    name: 'Official Cambridge Guide to IELTS',
    author: 'Pauline Cullen, Amanda French, Vanessa Jakeman',
    level: 'advanced',
    category: 'General',
    description: 'Rasmiy Cambridge IELTS qo\'llanmasi. 8 ta to\'liq test, barcha 4 ko\'nikma uchun batafsil strategiyalar va DVD-ROM bilan. Band 7+ maqsad uchun.',
    pdf: 'https://archive.org/download/official-cambridge-guide-to-ielts/Official.Cambridge.Guide.to.IELTS.pdf',
  },
  {
    name: "Barron's IELTS Practice Exams",
    author: 'Lin Lougheed',
    level: 'advanced',
    category: 'General',
    description: 'Barron\'s IELTS — 8 ta to\'liq amaliy test va batafsil javoblar. Academic va General Training variantlari. IELTS band 7+ maqsad qo\'yganlar uchun.',
    pdf: 'https://archive.org/download/barrons-ielts-practice-exams/Barrons.IELTS.Practice.Exams.pdf',
  },
];

let added = 0;
for (const b of newBooks) {
  const exists = db.prepare('SELECT id FROM books WHERE name = ?').get(b.name);
  if (!exists) {
    ins.run(b.name, b.author, b.level, b.category, b.description, b.pdf);
    console.log(`✅ Qo'shildi: ${b.name}`);
    added++;
  } else {
    console.log(`⏭  Bor: ${b.name}`);
  }
}

console.log(`\nJami ${added} ta yangi kitob qo'shildi.`);

const all = db.prepare('SELECT id, name, level, category FROM books ORDER BY id').all();
console.log('\nBarcha kitoblar:');
all.forEach(b => console.log(`  ${b.id}. [${b.level}/${b.category}] ${b.name}`));

db.close();
