# IELTS Hub UZ 🎓

O'zbek tilida IELTS o'rganish uchun to'liq veb-platforma.

## Texnik Stack

| Qism | Texnologiya |
|------|-------------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + Framer Motion |
| Backend | Node.js + Express |
| Database | SQLite (better-sqlite3) |
| Auth | JWT token |
| File upload | Multer (PDF) |

---

## Boshlash (Ishga tushirish)

### 1. Backend serverni ishga tushirish

```bash
cd server
npm install
npm run dev
# Server http://localhost:5000 da ishlaydi
```

### 2. Frontend ni ishga tushirish (alohida terminal)

```bash
cd client
npm install
npm run dev
# Sayt http://localhost:5173 da ochiladi
```

---

## Admin Panel

**URL:** `http://localhost:5173/admin/login`

**Login ma'lumotlari:**
- Username: `admin`
- Parol: `ielts2024`

> ⚠️ Xavfsizlik uchun `.env` faylida parolni o'zgartiring!

---

## Fayl tuzilmasi

```
ilest-sayti/
├── server/                    # Backend (Node.js + Express)
│   ├── db/
│   │   └── database.js        # SQLite schema + seed data
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT tekshirish
│   ├── routes/
│   │   ├── auth.js            # Login endpoint
│   │   ├── sites.js           # Kanallar CRUD
│   │   ├── hacks.js           # O'rganish usullari CRUD
│   │   ├── books.js           # Kitoblar CRUD + PDF upload
│   │   └── community.js       # Q&A, postlar, testimoniallar
│   ├── uploads/               # PDF fayllar saqlanadi
│   ├── .env                   # Maxfiy kalitlar
│   └── index.js               # Server kirish nuqtasi
│
└── client/                    # Frontend (React + Vite)
    └── src/
        ├── api/
        │   └── axios.js       # API interceptors
        ├── components/
        │   ├── Navbar.jsx     # Glassmorphism navbar
        │   ├── Footer.jsx     # Footer
        │   ├── AdminLayout.jsx # Admin sidebar layout
        │   └── ProtectedRoute.jsx
        ├── contexts/
        │   └── AuthContext.jsx # JWT auth state
        └── pages/
            ├── Home.jsx       # 4 unsur dizayni
            ├── Sites.jsx      # 🔥 Olov dizayni
            ├── Hacks.jsx      # 💧 Suv dizayni
            ├── Books.jsx      # 🌤️ Havo dizayni
            ├── Community.jsx  # 🌍 Yer dizayni
            └── admin/
                ├── AdminLogin.jsx
                ├── AdminDashboard.jsx
                ├── AdminSites.jsx
                ├── AdminHacks.jsx
                ├── AdminBooks.jsx
                └── AdminCommunity.jsx
```

---

## API Endpoints

### Auth
| Method | URL | Tavsif |
|--------|-----|--------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/verify` | Token tekshirish |

### Sites (Kanallar)
| Method | URL | Auth | Tavsif |
|--------|-----|------|--------|
| GET | `/api/sites` | — | Barcha published kanallar |
| GET | `/api/sites?type=youtube` | — | YouTube kanallar |
| GET | `/api/sites/admin/all` | ✅ | Admin: barchasi |
| POST | `/api/sites` | ✅ | Yangi kanal |
| PUT | `/api/sites/:id` | ✅ | Yangilash |
| DELETE | `/api/sites/:id` | ✅ | O'chirish |

### Hacks (O'rganish usullari)
| Method | URL | Auth | Tavsif |
|--------|-----|------|--------|
| GET | `/api/hacks` | — | Published usullar |
| GET | `/api/hacks/admin/all` | ✅ | Admin: barchasi |
| POST | `/api/hacks` | ✅ | Yangi usul |
| PUT | `/api/hacks/:id` | ✅ | Yangilash |
| DELETE | `/api/hacks/:id` | ✅ | O'chirish |

### Books (Kitoblar)
| Method | URL | Auth | Tavsif |
|--------|-----|------|--------|
| GET | `/api/books` | — | Published kitoblar |
| GET | `/api/books?level=beginner` | — | Filter |
| GET | `/api/books/admin/all` | ✅ | Admin: barchasi |
| POST | `/api/books` | ✅ | Yangi kitob + PDF |
| PUT | `/api/books/:id` | ✅ | Yangilash |
| DELETE | `/api/books/:id` | ✅ | O'chirish |

### Community
| Method | URL | Auth | Tavsif |
|--------|-----|------|--------|
| GET | `/api/community/questions` | — | Savollar |
| POST | `/api/community/questions` | — | Savol yuborish |
| GET | `/api/community/admin/questions` | ✅ | Barcha savollar |
| PUT | `/api/community/questions/:id/answer` | ✅ | Javob berish |
| DELETE | `/api/community/questions/:id` | ✅ | O'chirish |
| GET | `/api/community/posts` | — | Postlar |
| POST | `/api/community/posts` | ✅ | Post qo'shish |
| DELETE | `/api/community/posts/:id` | ✅ | O'chirish |
| GET | `/api/community/testimonials` | — | Testimoniallar |
| POST | `/api/community/testimonials` | ✅ | Qo'shish |
| DELETE | `/api/community/testimonials/:id` | ✅ | O'chirish |
| GET | `/api/community/stats` | — | Statistika |

---

## Muhit o'zgaruvchilari (`.env`)

```env
PORT=5000
JWT_SECRET=your_very_secret_key_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_strong_password
```

---

## Xususiyatlar

- ✅ To'rt unsur dizayni (Olov, Suv, Havo, Yer)
- ✅ Glassmorphism Navbar + Scroll animatsiyasi
- ✅ Filter (Sites: YouTube/Telegram, Books: daraja/kategoriya)
- ✅ PDF yuklab olish (Multer bilan)
- ✅ JWT autentifikatsiya
- ✅ Admin panel (sidebar + CRUD)
- ✅ Q&A bo'limi + Javob berish
- ✅ Motivatsion postlar
- ✅ Testimoniallar
- ✅ Framer Motion animatsiyalar
- ✅ Mobile-first responsive dizayn
- ✅ SQLite ma'lumotlar bazasi (namuna ma'lumotlar bilan)

---

## Litsenziya

MIT © 2024 IELTS Hub UZ
