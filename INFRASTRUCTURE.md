# Murvet Kara - Altyapi Kurulum Rehberi

Bu dokuman, Murvet Kara Communication & Management web sitesini sifirdan canli ortama tasimak icin gereken TUM altyapi adimlarini icerir.

---

## 1. MONGODB ATLAS (Veritabani)

MongoDB Atlas ucretsiz tier ile baslayabilirsiniz.

### Adimlar:

1. https://www.mongodb.com/cloud/atlas/register adresinden hesap olusturun
2. **Yeni Cluster Olusturun:**
   - Provider: AWS (veya Google Cloud/Azure)
   - Region: Europe (Frankfurt) - Turkiye'ye en yakin
   - Tier: M0 FREE (ucretsiz, 512MB)
   - Cluster Name: `murvetkara`

3. **Database User Olusturun:**
   - Database Access > Add New Database User
   - Username: `murvetkaraadmin`
   - Password: Guclu bir sifre secin (ozel karakter icermesin, URL'de sorun cikarir)
   - Role: `Atlas admin`

4. **Network Access Ayarlayin:**
   - Network Access > Add IP Address
   - Vercel/Netlify icin: `0.0.0.0/0` (Allow Access from Anywhere)
   - Sabit IP'niz varsa sadece onu ekleyin

5. **Connection String'i Kopyalayin:**
   - Clusters > Connect > Drivers
   - Connection string'i kopyalayin:
   ```
   mongodb+srv://murvetkaraadmin:SIFRENIZ@cluster0.xxxxx.mongodb.net/murvetkara?retryWrites=true&w=majority
   ```
   - `SIFRENIZ` kismini gercek sifrenizle degistirin

### Onemli Notlar:
- Ucretsiz tier 512MB depolama saglar, cogu site icin yeterlidir
- Backup otomatik olarak yapilir (M0 hariç, M2+ icin)
- Production icin M10+ tier onerilir (otomatik backup + monitoring)

---

## 2. CLOUDFLARE R2 (Dosya Depolama - Video & Gorsel)

Cloudflare R2, video ve gorsel dosyalarini depolamak icin kullanilir. S3 uyumludur ve egress ucretsizdir.

### Adimlar:

1. https://dash.cloudflare.com adresinden Cloudflare hesabi olusturun
2. Sol menuden **R2 Object Storage** > **Create Bucket**
   - Bucket Name: `murvetkara-files`
   - Location: Auto (veya EU)

3. **API Token Olusturun:**
   - R2 > Overview > Manage R2 API Tokens
   - Create API Token:
     - Token Name: `murvetkara-upload`
     - Permissions: Object Read & Write
     - Specify Bucket: `murvetkara-files`
   - Kaydedin! Access Key ID ve Secret Access Key not edin (bir daha gorunmez)

4. **Public Access Aktiflestirin:**
   - R2 > murvetkara-files > Settings
   - Public Access: Enable
   - Custom Domain ekleyebilirsiniz (ornegin: `files.murvetkara.com`)
   - Yoksa R2.dev subdomain kullanin: `pub-XXXX.r2.dev`

5. **Account ID'nizi Not Edin:**
   - Cloudflare Dashboard sag ust kosede Account ID gorunur
   - Veya: R2 > Overview > Account ID

### Ortam Degiskenleri:
```env
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=murvetkara-files
R2_PUBLIC_URL=https://pub-XXXX.r2.dev
```

### Maliyet:
- 10GB depolama ucretsiz
- Egress (indirme) tamamen ucretsiz
- Class A operations (yazma): 1M istek/ay ucretsiz
- Class B operations (okuma): 10M istek/ay ucretsiz

---

## 3. VERCEL (Hosting & Deployment)

### Adimlar:

1. https://vercel.com adresinden GitHub ile giris yapin
2. **New Project** > GitHub repo'nuzu secin
3. **Framework Preset:** Next.js (otomatik algilanir)

4. **Environment Variables Ekleyin:**
   ```
   DATABASE_URL = mongodb+srv://murvetkaraadmin:SIFRENIZ@cluster0.xxxxx.mongodb.net/murvetkara?retryWrites=true&w=majority
   NEXTAUTH_SECRET = (openssl rand -base64 32 ile uretilen guclu bir key)
   NEXTAUTH_URL = https://murvetkara.com (veya vercel domain'iniz)
   R2_ACCOUNT_ID = your-cloudflare-account-id
   R2_ACCESS_KEY_ID = your-r2-access-key
   R2_SECRET_ACCESS_KEY = your-r2-secret-key
   R2_BUCKET_NAME = murvetkara-files
   R2_PUBLIC_URL = https://pub-XXXX.r2.dev
   CRON_SECRET = (guclu rastgele bir string)
   ```

5. **Deploy** tiklayin

6. **Custom Domain Ekleyin:**
   - Settings > Domains > `murvetkara.com` ekleyin
   - Vercel size DNS kayitlarini verecek, Cloudflare DNS'e ekleyin

### Vercel Cron Jobs:
Instagram otomatik senkronizasyon icin vercel.json'da tanimli:
- `/api/cron/instagram-sync` - Her gun saat 12:00'de calisir
- CRON_SECRET ortam degiskenini ayarlamayi unutmayin

### Maliyet:
- Hobby Plan: Ucretsiz (kisisel projeler)
- Pro Plan: $20/ay (ticari kullanim icin onerilir)

---

## 4. CLOUDFLARE DNS (Domain Yonetimi)

murvetkara.com domain'iniz varsa:

### Adimlar:

1. Cloudflare'e domain'i ekleyin (Add a Site)
2. Domain kayit firmanizda nameserver'lari Cloudflare'e yonlendirin:
   - `ns1.cloudflare.com` (Cloudflare'in verdigi degerler)
   - `ns2.cloudflare.com`

3. **DNS Kayitlari Ekleyin:**

   Vercel icin:
   ```
   Type: A     | Name: @    | Content: 76.76.21.21    | Proxy: DNS Only
   Type: CNAME | Name: www  | Content: cname.vercel-dns.com | Proxy: DNS Only
   ```

   E-posta icin (ornegin Google Workspace veya baska mail servisi):
   ```
   Type: MX  | Name: @ | Content: mail servisi MX kayitlari
   Type: TXT | Name: @ | Content: SPF, DKIM, DMARC kayitlari
   ```

4. **SSL/TLS Ayarlari:**
   - SSL/TLS > Overview > Full (strict) secin
   - Edge Certificates > Always Use HTTPS: ON

5. **Guvenlik Ayarlari (Onerilen):**
   - Security > WAF: ON
   - Speed > Auto Minify: HTML, CSS, JS
   - Caching > Browser Cache TTL: 4 hours

### Maliyet:
- Cloudflare DNS: Ucretsiz
- Cloudflare Pro (WAF + Analytics): $20/ay (opsiyonel)

---

## 5. INSTAGRAM ENTEGRASYONU (Opsiyonel)

Instagram Graph API ile son postlari otomatik cekebilirsiniz.

### Adimlar:

1. Facebook Developer hesabi olusturun: https://developers.facebook.com
2. Yeni uygulama olusturun (Business type)
3. Instagram Basic Display API ekleyin
4. Instagram Business hesabinizi baglayiniz
5. Uzun sureli access token alin (60 gun gecerli)

### Ortam Degiskenleri:
```env
INSTAGRAM_ACCESS_TOKEN=your-long-lived-token
INSTAGRAM_USER_ID=your-instagram-user-id
```

Detayli adimlar icin: **INSTAGRAM_SETUP.md**

### Onemli:
- Token 60 gunde bir yenilenmeli
- Admin panelden manuel sync de yapilabilir

---

## 6. WHATSAPP ENTEGRASYONU

Proje su an WhatsApp Web linkleri ile calisiyor (otomatik API degil).
Admin, randevu onayladiginda WhatsApp Web'de hazir mesajla acilir.

### Mevcut Durum:
- WhatsApp sablon mesajlari **bos** birakilmistir
- Admin panelden kullanici kendi sablonlarini olusturabilir
- `lib/notifications.ts` dosyasindan mesaj sablonlari duzenlenebilir

### Gelecekte WhatsApp Business API:
Otomatik mesaj gondermek icin:
1. WhatsApp Business API basvurusu yapin
2. Twilio veya MessageBird gibi bir provider secin
3. `lib/notifications.ts` icindeki `sendWhatsAppNotification` fonksiyonunu guncelleyin

---

## 7. E-POSTA SERVISI (Opsiyonel)

Proje su an e-posta gondermez, tum iletisim WhatsApp uzerinden yapilir.
E-posta gondermek isterseniz:

### Secenek 1: Resend (Onerilen)
```bash
npm install resend
```
- Ucretsiz: 3000 email/ay
- https://resend.com

### Secenek 2: SendGrid
- Ucretsiz: 100 email/gun
- https://sendgrid.com

### Secenek 3: Google Workspace
- admin@murvetkara.com icin Google Workspace veya baska bir email hosting

---

## 8. TUM ORTAM DEGISKENLERI OZETI

`.env.local` dosyaniz su sekilde olmali:

```env
# === ZORUNLU ===

# MongoDB Atlas Connection String
DATABASE_URL="mongodb+srv://murvetkaraadmin:SIFRENIZ@cluster0.xxxxx.mongodb.net/murvetkara?retryWrites=true&w=majority"

# NextAuth - Kimlik Dogrulama
NEXTAUTH_URL="https://murvetkara.com"
NEXTAUTH_SECRET="openssl-rand-base64-32-ile-uretilmis-guclu-key"

# === CLOUDFLARE R2 (Video & Gorsel Depolama) ===

R2_ACCOUNT_ID="cloudflare-account-id"
R2_ACCESS_KEY_ID="r2-access-key"
R2_SECRET_ACCESS_KEY="r2-secret-key"
R2_BUCKET_NAME="murvetkara-files"
R2_PUBLIC_URL="https://pub-XXXX.r2.dev"

# === OPSIYONEL ===

# Instagram Entegrasyonu
INSTAGRAM_ACCESS_TOKEN="instagram-long-lived-token"
INSTAGRAM_USER_ID="instagram-user-id"

# Vercel Cron Job Guvenlik Anahtari
CRON_SECRET="rastgele-guclu-bir-string"
```

---

## 9. ILK DEPLOYMENT CHECKLIST

- [ ] MongoDB Atlas cluster olusturuldu
- [ ] MongoDB database user olusturuldu
- [ ] MongoDB network access ayarlandi
- [ ] Cloudflare hesabi olusturuldu
- [ ] R2 bucket olusturuldu (`murvetkara-files`)
- [ ] R2 API token olusturuldu
- [ ] R2 public access aktiflestirildi
- [ ] Vercel'e proje eklendi
- [ ] Tum ortam degiskenleri Vercel'e eklendi
- [ ] Vercel deploy basarili
- [ ] `npx prisma db push` ile schema MongoDB'ye aktarildi
- [ ] `npm run seed` ile admin kullanicisi olusturuldu
- [ ] Admin panele giris yapildi (admin@murvetkara.com / admin123)
- [ ] Admin sifresi degistirildi
- [ ] mk-logo.png gercek logo ile degistirildi (public/assets/mk-logo.png)
- [ ] Site adi ve aciklamalari admin panelden guncellendi
- [ ] Iletisim bilgileri guncellendi
- [ ] Hizmetler/programlar eklendi
- [ ] Ekip uyeleri eklendi
- [ ] Custom domain ayarlandi (murvetkara.com)
- [ ] SSL sertifikasi aktif
- [ ] Instagram entegrasyonu ayarlandi (opsiyonel)
- [ ] WhatsApp sablon mesajlari duzenlendi (opsiyonel)

---

## 10. BAKIM VE IZLEME

### Duzenli Yapilmasi Gerekenler:
- Instagram token yenileme (her 60 gun)
- MongoDB Atlas monitoring kontrolu
- Vercel deployment loglarini kontrol
- R2 depolama kullanimini kontrol

### Yedekleme:
- MongoDB Atlas: Otomatik backup (M2+ tier)
- R2: Cloudflare tarafindan yonetilir
- Kod: GitHub repository

### Olceklendirme:
- MongoDB: M0 (free) -> M10 -> M20 (ihtiyaca gore)
- Vercel: Hobby -> Pro ($20/ay)
- R2: Otomatik olceklenir, ucret kullanima gore
