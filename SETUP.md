# 🚀 Mürvet Kara Web Sitesi - Kurulum Rehberi

## 📋 Gereksinimler

- Node.js 18+
- MongoDB Atlas hesabı (ücretsiz)
- NPM veya Yarn

## 🔧 Adım Adım Kurulum

### 1. MongoDB Veritabanı Kurulumu

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) üzerinden ücretsiz bir hesap oluşturun
2. Yeni bir Cluster oluşturun (FREE tier)
3. Database Access bölümünden bir kullanıcı oluşturun
4. Network Access bölümünden IP adresinizi ekleyin (0.0.0.0/0 tüm IP'lere izin verir - güvenlik için önerilmez ama test için kullanılabilir)
5. "Connect" butonuna tıklayın ve "Connect your application" seçeneğini seçin
6. Connection string'i kopyalayın (örnek: `mongodb+srv://kullanici:sifre@cluster0.xxxxx.mongodb.net/`)

### 2. Ortam Değişkenlerini Ayarlayın

`.env.local` dosyasını açın ve aşağıdaki değerleri güncelleyin:

```env
# MongoDB connection string'inizi buraya yapıştırın
DATABASE_URL="mongodb+srv://kullanici:sifre@cluster0.xxxxx.mongodb.net/murvetkara?retryWrites=true&w=majority"

# Bu ayarları olduğu gibi bırakabilirsiniz
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"

# Admin giriş bilgileri (istediğiniz gibi değiştirebilirsiniz)
ADMIN_EMAIL="admin@murvetkara.com"
ADMIN_PASSWORD="admin123"
```

⚠️ **ÖNEMLİ:** Production'da `NEXTAUTH_SECRET`'ı güvenli bir değerle değiştirin!

### 3. Prisma'yı Ayarlayın

```bash
# Prisma Client'ı oluşturun
npx prisma generate

# Veritabanını seed edin (ilk verileri ekleyin)
npm run seed
```

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Site `http://localhost:3000` adresinde çalışacaktır! 🎉

## 🔐 Admin Panel Erişimi

- **URL:** `http://localhost:3000/admin/login`
- **Email:** admin@murvetkara.com (veya .env.local'de tanımladığınız)
- **Şifre:** admin123 (veya .env.local'de tanımladığınız)

## 📁 Proje Yapısı

```
murvetkara/
├── app/                      # Next.js 15 App Router
│   ├── api/                 # API Routes
│   │   ├── auth/           # NextAuth authentication
│   │   ├── hero/           # Hero section API
│   │   ├── services/       # Services API
│   │   └── ...
│   ├── admin/              # Admin panel pages
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── services/
│   │   └── ...
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Ana sayfa
│   └── globals.css         # Global styles
├── components/             # React components
├── lib/                    # Utility functions
│   └── prisma.ts          # Prisma client
├── prisma/                # Prisma ORM
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── public/                # Static files
│   └── assets/            # Images, fonts
└── package.json
```

## 🎨 Özelleştirme

### Logo ve Görseller

Logolar ve görseller `public/assets/` klasöründedir:
- `mk-logo.png` - Ana logo
- `mk-logo.png` - Logo
- `gotham font/` - Gotham font dosyaları

### Renkler

Renkleri `tailwind.config.ts` dosyasından özelleştirebilirsiniz:
- `gold` - Altın tonları (vurgu rengi)
- `navy` - Lacivert tonları (ana renk)

### İçerik Yönetimi

Tüm içerikler admin panelden yönetilir:
- **Hero Bölümü:** Ana sayfa başlığı ve alt başlığı
- **Hizmetler:** Hizmetler
- **Ekip:** Ekip üyeleri
- **Hakkımızda:** Kurum bilgileri
- **İletişim:** İletişim bilgileri
- **Yorumlar:** Müşteri yorumları
- **Blog:** Blog yazıları
- **Site Ayarları:** Genel site ayarları

## 🚀 Production'a Alma

### Vercel (Önerilen)

1. GitHub'a projeyi push edin
2. [Vercel](https://vercel.com)'e giriş yapın
3. "New Project" tıklayın
4. GitHub repository'nizi seçin
5. Environment Variables bölümünden `.env.local` değişkenlerini ekleyin
6. Deploy edin!

### Diğer Platformlar

- **Netlify:** Next.js uyumlu
- **Railway:** Database + hosting
- **DigitalOcean App Platform:** Full stack hosting

## 🔧 Sorun Giderme

### Prisma Hatası

```bash
# Prisma client'ı yeniden oluşturun
npx prisma generate

# Database'i sıfırlayın (DİKKAT: Tüm verileri siler!)
npx prisma db push --force-reset
```

### Build Hatası

```bash
# node_modules ve .next klasörlerini silin
rm -rf node_modules .next

# Yeniden yükleyin
npm install
npm run dev
```

### Font Yüklenmiyor

Gotham fontlarının `public/assets/gotham font/` klasöründe olduğundan emin olun.

## 📞 Yardım

Sorun yaşarsanız:
1. Browser console'u kontrol edin
2. Terminal'de hata mesajlarına bakın
3. `.env.local` dosyasının doğru yapılandırıldığından emin olun
4. MongoDB connection string'inin doğru olduğundan emin olun

## ✨ Özellikler

- ✅ Tamamen responsive tasarım
- ✅ Sinematik animasyonlar (Framer Motion)
- ✅ Admin panel ile tam içerik yönetimi
- ✅ Güvenli authentication (NextAuth.js)
- ✅ MongoDB veritabanı
- ✅ TypeScript
- ✅ Modern UI/UX
- ✅ SEO dostu
- ✅ Hızlı ve performanslı

İyi çalışmalar! 🎉
