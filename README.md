# Mürvet Kara Communication & Management

Modern, dinamik ve tamamen yonetilebilir kurumsal web sitesi.

## Teknolojiler

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Prisma + MongoDB
- NextAuth.js
- Cloudflare R2 (dosya depolama)

## Hizli Kurulum

```bash
npm install
cp .env.example .env.local  # Sonra icindeki degerleri doldurun
npx prisma generate
npm run seed
npm run dev
```

Site `http://localhost:3000` adresinde calisacaktir.

## Admin Panel

- **URL:** `http://localhost:3000/admin/login`
- **Email:** admin@murvetkara.com
- **Sifre:** admin123

**ONEMLI:** Ilk giristen sonra admin sifresini degistirin!

## Admin Panel Modulleri

- Hero Bolumu & Videolari
- Hizmetler / Programlar
- Ekip Uyeleri
- Hakkimizda
- Iletisim Bilgileri
- Randevu / Kayit Sistemi
- Yorumlar
- Blog
- Instagram Entegrasyonu
- Footer & Yasal Linkler
- Site Ayarlari (renk, logo, bolum sirasi)

## Altyapi Kurulumu

Tum altyapi kurulum adimlari icin **INFRASTRUCTURE.md** dosyasina bakin.

## Lisans

(c) 2025 Murvet Kara Communication & Management. Tum haklari saklidir.
