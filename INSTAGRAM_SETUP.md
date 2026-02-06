# Instagram API Kurulum Rehberi

Bu rehber, Instagram postlarınızı otomatik olarak web sitenizde göstermek için Instagram Graph API'yi nasıl kuracağınızı açıklar.

## Adım 1: Instagram Business Hesabı

1. Instagram hesabınızı **Business hesaba** çevirin
   - Instagram uygulamasında: Ayarlar → Hesap → Profesyonel hesaba geç
   - "İşletme" seçeneğini seçin

2. Instagram hesabınızı bir **Facebook Sayfasına** bağlayın
   - Ayarlar → Hesap → Bağlı hesaplar → Facebook
   - Yeni bir Facebook sayfası oluşturabilir veya mevcut olanı kullanabilirsiniz

## Adım 2: Facebook Developer App Oluşturun

1. [Facebook Developers](https://developers.facebook.com/) sitesine gidin

2. **Yeni App Oluşturun**:
   - "Uygulamalarım" → "Uygulama Oluştur"
   - Uygulama türü: **"Other"** (Diğer) veya **"None"**
   - Uygulama adı: "Mürvet Kara Web"
   - İletişim e-postası: admin@murvetkara.com (veya kendi mail adresiniz)

3. **Instagram Graph API Ekleyin**:
   - Dashboard → Ürün Ekle
   - "Instagram" bulun ve "Kur" butonuna tıklayın

## Adım 3: Access Token Alın

### Seçenek A: Graph API Explorer (Kolay - Geçici Token)

1. [Graph API Explorer](https://developers.facebook.com/tools/explorer/) açın
2. Uygulamanızı seçin (sağ üstten)
3. "User Token Al" butonuna tıklayın
4. Şu izinleri seçin:
   - `instagram_basic`
   - `pages_show_list`
   - `pages_read_engagement`
5. "Token Oluştur" butonuna tıklayın
6. Token'ı kopyalayın (bu token 60 gün geçerlidir)

### Seçenek B: Kalıcı Access Token (Önerilen)

1. Yukarıdaki adımlarla kısa ömürlü token alın
2. Token'ı uzun ömürlü hale getirin:
```bash
curl -i -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN"
```

3. Dönen `access_token` değeri 60 gün geçerlidir

## Adım 4: Instagram User ID Alın

1. [Graph API Explorer](https://developers.facebook.com/tools/explorer/) açın
2. Access token'ınızı yapıştırın
3. Şu sorguyu çalıştırın:
```
me?fields=id,username
```
veya
```
me/accounts?fields=instagram_business_account
```

4. Dönen `id` değeri sizin Instagram User ID'nizdir

## Adım 5: .env.local Dosyasını Güncelleyin

`.env.local` dosyanıza şu satırları ekleyin:

```env
# Instagram Graph API
INSTAGRAM_ACCESS_TOKEN=YOUR_ACCESS_TOKEN_HERE
INSTAGRAM_USER_ID=YOUR_INSTAGRAM_USER_ID_HERE
```

## Adım 6: Test Edin

1. Admin panele gidin: http://localhost:3001/admin/instagram
2. "Instagram'dan Çek" butonuna tıklayın
3. Son 15 postunuz otomatik olarak çekilecek ve ana sayfada görünecek

## Otomatik Senkronizasyon (Vercel Cron Job)

Vercel'e deploy ettikten sonra, Instagram postları **otomatik olarak her 12 saatte bir** güncellenecek!

### Nasıl Çalışır:

- **Vercel Cron Job** her 12 saatte bir `/api/cron/instagram-sync` endpoint'ini çağırır
- Otomatik olarak Instagram'dan son 15 post çekilir ve database'e kaydedilir
- Kullanıcılar her zaman güncel Instagram içeriğini görür
- Manuel olarak "Instagram'dan Çek" butonuna basmanıza gerek yok!

### Cron Schedule:
- **Cron Expression**: `0 */12 * * *`
- **Anlamı**: Her 12 saatte bir (gece yarısı ve öğlen)
- **Değiştirmek için**: `vercel.json` dosyasındaki `schedule` değerini düzenleyin

### Cron Schedule Örnekleri:
```
0 */12 * * *   → Her 12 saatte bir
0 */6 * * *    → Her 6 saatte bir
0 0 * * *      → Her gün gece yarısı
0 0,12 * * *   → Her gün 00:00 ve 12:00'de
```

### Vercel Dashboard'da Cron Logs

Vercel dashboard'da "Deployments" → "Functions" → "Cron Jobs" bölümünden:
- Cron job'ların çalışma zamanlarını görebilirsiniz
- Log'ları inceleyebilirsiniz
- Başarılı/başarısız durumları kontrol edebilirsiniz

## Vercel'e Deploy Etme

Vercel dashboard'unda Environment Variables bölümüne şunları ekleyin:
- `INSTAGRAM_ACCESS_TOKEN` → Instagram access token'ınız
- `INSTAGRAM_USER_ID` → Instagram user ID'niz
- `CRON_SECRET` → `murvetkara-cron-secret-key` (güvenlik için)

**Not**: Cron job'lar Vercel Pro plan'da ücretsizdir. Hobby plan'da günde 1 cron job çalıştırabilirsiniz.

## Sorun Giderme

### "Instagram API credentials not found" Hatası
- `.env.local` dosyasında değişkenlerin doğru yazıldığından emin olun
- Development server'ı yeniden başlatın: `npm run dev`

### "Invalid OAuth access token" Hatası
- Access token'ınızın süresinin dolmamış olduğundan emin olun
- Yeni bir access token alın (Adım 3)

### "Permissions hatası"
- App'inizin gerekli izinlere sahip olduğundan emin olun
- Instagram Business hesabınızın Facebook sayfasına bağlı olduğunu kontrol edin

## Token Yenileme

Access token 60 günde bir yenilenmeli. İki seçenek:

**Manuel Yenileme:**
- Her 60 günde bir Adım 3'ü tekrarlayın
- Yeni token'ı `.env.local` ve Vercel'de güncelleyin

**Otomatik Yenileme (Gelecek Özellik):**
- Refresh token kullanarak otomatik yenileme sistemi eklenebilir

## Önemli Notlar

- ⚠️ Access token'larını **asla** GitHub'a commit etmeyin
- ✅ `.env.local` dosyası `.gitignore`'da olmalı
- 🔄 Token'lar 60 gün geçerlidir, düzenli yenileyin
- 📱 Sadece Instagram Business hesaplar çalışır
- 🌐 Graph API v18.0 kullanılmaktadır

## Faydalı Linkler

- [Instagram Graph API Dokümantasyonu](https://developers.facebook.com/docs/instagram-api/)
- [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
