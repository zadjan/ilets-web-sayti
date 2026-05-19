const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'ielts.db'));

// Foreign keys yoqish
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Jadvallar yaratish
db.exec(`
  CREATE TABLE IF NOT EXISTS sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('youtube', 'telegram')),
    name TEXT NOT NULL,
    description TEXT,
    link TEXT NOT NULL,
    image_url TEXT,
    members_count TEXT,
    is_published INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS hacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    guide TEXT,
    video_link TEXT,
    image_url TEXT,
    is_published INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    author TEXT,
    description TEXT,
    level TEXT CHECK(level IN ('beginner', 'intermediate', 'advanced')),
    category TEXT,
    cover_url TEXT,
    pdf_path TEXT,
    is_published INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    email TEXT,
    question TEXT NOT NULL,
    answer TEXT,
    is_answered INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS motivational_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    text TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    goal_score TEXT,
    current_level TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// Namuna ma'lumotlar (faqat bo'sh bo'lsa)
const sitesCount = db.prepare('SELECT COUNT(*) as count FROM sites').get();
if (sitesCount.count === 0) {
  const insertSite = db.prepare(
    'INSERT INTO sites (type, name, description, link, image_url, members_count) VALUES (?, ?, ?, ?, ?, ?)'
  );
  insertSite.run('youtube', 'IELTS Lyna', 'IELTS bo\'yicha eng yaxshi YouTube kanal. Speaking, Writing, Reading va Listening bo\'limlari.', 'https://youtube.com/@ielts-lyna', 'https://i.imgur.com/placeholder1.jpg', '250K');
  insertSite.run('youtube', 'E2 IELTS', 'Avstraliyalik o\'qituvchilar tomonidan yuqori ball olish strategiyalari.', 'https://youtube.com/@E2IELTS', 'https://i.imgur.com/placeholder2.jpg', '1.2M');
  insertSite.run('youtube', 'IELTS Advantage', 'IELTS Speaking testlari va band 7-9 uchun mo\'ljallangan to\'liq strategiyalar. Real imtihon savollariga namuna javoblar bilan.', 'https://www.youtube.com/@IELTSAdvantage', 'https://i.imgur.com/placeholder5.jpg', '290K');
  insertSite.run('youtube', 'Luke\'s English Podcast', 'Ingliz tili o\'qituvchisi Luke Thompson tomonidan 20 ta podcast: ingliz tilini tabiiy va qiziqarli yo\'l bilan o\'rganish. Vocabulary, grammar, idiomlar — hammasi bir joyda.', 'https://www.youtube.com/@teacherluke', 'https://i.imgur.com/placeholder6.jpg', '170K');
  insertSite.run('youtube', 'English with Lucy', '"Learn All Tenses" videolari va boshqa grammatika darslar bilan ingliz tilini professional darajada o\'rganing. IELTS Writing va Speaking uchun juda foydali.', 'https://www.youtube.com/@EnglishwithLucy', 'https://i.imgur.com/placeholder7.jpg', '12.4M');
  insertSite.run('telegram', 'IELTS O\'zbek', 'O\'zbek tilida IELTS materiallari va mashqlar.', 'https://t.me/ielts_uzbek', 'https://i.imgur.com/placeholder3.jpg', '45K');
  insertSite.run('telegram', 'IELTS Daily', 'Har kuni yangi IELTS mashqlari va vocabulary.', 'https://t.me/ieltsdaily', 'https://i.imgur.com/placeholder4.jpg', '32K');
}

const hacksCount = db.prepare('SELECT COUNT(*) as count FROM hacks').get();
if (hacksCount.count === 0) {
  const insertHack = db.prepare(
    'INSERT INTO hacks (name, description, guide, video_link) VALUES (?, ?, ?, ?)'
  );
  insertHack.run(
    'Shadowing Texnikasi',
    'Shadowing — ona tili so\'zlovchilardan keyin takrorlash texnikasi. Bu usul talaffuz va intonatsiyani tez yaxshilaydi.',
    '1. Ona tili so\'zlovchisi gapirgan audio toping\n2. Avval tinglang va ma\'noni tushuning\n3. Keyin audio bilan birga gapiring\n4. O\'zingizni yozing va solishtiringg\n5. Har kuni 15-20 daqiqa mashq qiling',
    'https://youtube.com/watch?v=example1'
  );
  insertHack.run(
    'Dictation Mashqi',
    'Dictation — eshitib yozish mashqi. Listening va spelling ko\'nikmalarini bir vaqtda rivojlantiradi.',
    '1. IELTS podcast yoki audiobook toping\n2. 1-2 daqiqalik parchani tinglang\n3. Eshitganingizni yozing\n4. Originali bilan solishtiring\n5. Xatolarni tahlil qiling',
    'https://youtube.com/watch?v=example2'
  );
  insertHack.run(
    'Active Recall',
    'Active Recall — faol eslash usuli. Passiv o\'qish o\'rniga o\'zingizni sinash orqali ko\'proq eslab qolasiz.',
    '1. Materialning bir bo\'limini o\'qing\n2. Kitobni yoping\n3. O\'qiganingizni xotiradan yozing\n4. Tekshiring va kamchiliklarni to\'ldiring\n5. Flashcard ishlatishni o\'rganing',
    'https://youtube.com/watch?v=example3'
  );
  insertHack.run(
    'Spaced Repetition',
    'Spaced Repetition — intervallar bilan takrorlash. Yangi so\'zlarni uzoq muddatga eslab qolishning ilmiy usuli.',
    '1. Anki yoki Quizlet ilovasini o\'rnating\n2. Yangi so\'zlarni kartochkalarga yozing\n3. Ilova ko\'rsatgan vaqtda takrorlang\n4. Qiyin so\'zlarni ko\'proq takrorlang\n5. Har kuni 20-30 yangi so\'z qo\'shing',
    'https://youtube.com/watch?v=example4'
  );
  insertHack.run(
    'Pomodoro Texnikasi',
    'Pomodoro — 25 daqiqa diqqat, 5 daqiqa dam olish tsikli. Samaradorlikni 2-3 barobarga oshiradi.',
    '1. 25 daqiqa uchun taymer o\'rnating\n2. Faqat bitta vazifaga e\'tibor bering (IELTS)\n3. Telefonni susaytiring\n4. 5 daqiqa dam oling\n5. 4 sikldan keyin 30 daqiqa uzun dam',
    'https://youtube.com/watch?v=example5'
  );
}

const booksCount = db.prepare('SELECT COUNT(*) as count FROM books').get();
if (booksCount.count === 0) {
  const insertBook = db.prepare(
    'INSERT INTO books (name, author, description, level, category, cover_url) VALUES (?, ?, ?, ?, ?, ?)'
  );
  insertBook.run('Cambridge IELTS 17', 'Cambridge University Press', 'IELTS imtihoniga tayyorgarlik uchun amaliy testlar. Real imtihon savollari bilan mashq qiling.', 'intermediate', 'General', 'https://i.imgur.com/book1.jpg');
  insertBook.run('IELTS Vocabulary Booster', 'Various Authors', 'IELTS uchun zarur bo\'lgan so\'z boyligini tez o\'rganish. 3000 ta muhim so\'z va iboralar.', 'beginner', 'Vocabulary', 'https://i.imgur.com/book2.jpg');
  insertBook.run('IELTS Writing Task 2 Essays', 'Simon Braverman', 'Writing Task 2 uchun band 7-9 namuna insho va strategiyalar.', 'advanced', 'Writing', 'https://i.imgur.com/book3.jpg');
  insertBook.run('IELTS Speaking Success', 'Various Authors', 'Speaking imtihonida yuqori ball olish uchun amaliy qo\'llanma.', 'intermediate', 'Speaking', 'https://i.imgur.com/book4.jpg');
}

const postsCount = db.prepare('SELECT COUNT(*) as count FROM motivational_posts').get();
if (postsCount.count === 0) {
  const insertPost = db.prepare('INSERT INTO motivational_posts (title, content) VALUES (?, ?)');
  insertPost.run(
    'IELTS 7+ olish mumkin!',
    'Ko\'p o\'quvchilarimiz 3-6 oy ichida 7 va undan yuqori ball olishdi. Muhim narsa — har kuni muntazam mashq. Hatto 30 daqiqa ham yetarli boshlash uchun. Bugun boshlang, ertaga kechikadi!'
  );
  insertPost.run(
    'Vocabulary o\'rganish sirlari',
    'Har kuni 10 ta yangi so\'z — bu oyiga 300 so\'z demak. Yiliga 3600 so\'z! Spaced repetition bilan bu so\'zlarning 90%ini eslab qolasiz. Kichik qadamlar katta natijalarga olib keladi.'
  );
}

const testimonialsCount = db.prepare('SELECT COUNT(*) as count FROM testimonials').get();
if (testimonialsCount.count === 0) {
  const insertTestimonial = db.prepare('INSERT INTO testimonials (name, text, rating) VALUES (?, ?, ?)');
  insertTestimonial.run('Aziz T.', 'IELTS Way orqali 3 oy ichida 7.5 ball oldim! Bu saytdagi usullar va kitoblar juda foydali bo\'ldi.', 5);
  insertTestimonial.run('Malika R.', 'Shadowing texnikasini o\'rgangach, Speaking bo\'limida 8 ball oldim. Rahmat IELTS Way!', 5);
  insertTestimonial.run('Jasur K.', 'Admin doim savollarimga javob beradi. Jamiyat juda yaxshi!', 4);
}

module.exports = db;
