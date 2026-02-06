import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

let isSeeded = false

/**
 * Veritabanı boşsa otomatik olarak başlangıç verilerini oluşturur.
 * Her tablo bağımsız kontrol edilir - kısmi seed durumlarını düzeltir.
 */
export async function ensureSeeded() {
  if (isSeeded) return

  try {
    // Her tabloyu bağımsız kontrol et ve gerekiyorsa oluştur
    // Bu sayede kısmi seed durumlarında eksik veriler tamamlanır

    // Admin kullanıcı
    const userCount = await prisma.user.count()
    if (userCount === 0) {
      console.log('[auto-seed] Admin kullanıcı oluşturuluyor...')
      const hashedPassword = await bcrypt.hash('admin123', 12)
      await prisma.user.create({
        data: {
          email: 'admin@murvetkara.com',
          password: hashedPassword,
          name: 'Admin',
        },
      })
    }

    // Hero section
    const heroCount = await prisma.heroSection.count()
    if (heroCount === 0) {
      console.log('[auto-seed] Hero section oluşturuluyor...')
      await prisma.heroSection.create({
        data: {
          title: 'MÜRVET KARA',
          subtitle: 'Communication & Management',
          description: 'Profesyonel iletişim danışmanlığı ve yönetim hizmetleri',
          buttonText: 'Bizimle İletişime Geçin',
          buttonLink: '#contact',
          logo: '/assets/mk-logo.png',
          logoWidth: 250,
          logoHeight: 250,
          active: true,
        },
      })
    }

    // Hakkımızda
    const aboutCount = await prisma.aboutSection.count()
    if (aboutCount === 0) {
      console.log('[auto-seed] About section oluşturuluyor...')
      await prisma.aboutSection.create({
        data: {
          title: 'Mürvet Kara Hakkında',
          content: 'Mürvet Kara Communication & Management olarak, profesyonel iletişim danışmanlığı ve yönetim hizmetleri sunuyoruz. İçeriği admin panelden güncelleyebilirsiniz.',
          mission: 'Admin panelden güncelleyiniz.',
          vision: 'Admin panelden güncelleyiniz.',
          values: ['Profesyonellik', 'Güvenilirlik', 'Yenilikçilik'],
          active: true,
        },
      })
    }

    // İletişim bilgileri
    const contactCount = await prisma.contactInfo.count()
    if (contactCount === 0) {
      console.log('[auto-seed] Contact info oluşturuluyor...')
      await prisma.contactInfo.create({
        data: {
          address: 'Admin panelden güncelleyiniz',
          phone: '+90 000 000 00 00',
          email: 'info@murvetkara.com',
          workingHours: 'Pazartesi - Cuma: 09:00 - 18:00',
        },
      })
    }

    // Site ayarları
    const settingsCount = await prisma.siteSettings.count()
    if (settingsCount === 0) {
      console.log('[auto-seed] Site settings oluşturuluyor...')
      await prisma.siteSettings.create({
        data: {
          siteName: 'Mürvet Kara',
          siteTitle: 'Mürvet Kara | Communication & Management',
          description: 'Mürvet Kara Communication & Management - Profesyonel iletişim danışmanlığı ve yönetim hizmetleri.',
          logo: '/assets/mk-logo.png',
          primaryColor: '#c19a6b',
          secondaryColor: '#243b53',
          footerText: '© 2025 Mürvet Kara Communication & Management. Tüm hakları saklıdır.',
          socialMedia: [
            { platform: 'instagram', url: '', active: false },
            { platform: 'youtube', url: '', active: false }
          ],
          sectionVisibility: {
            hero: true,
            services: true,
            about: true,
            team: true,
            testimonials: true,
            instagram: false,
            blog: true,
            contact: true,
          },
          sectionOrder: ['hero', 'services', 'about', 'team', 'testimonials', 'blog', 'contact'],
          copyrightText: '© 2025 Mürvet Kara Communication & Management. Tüm hakları saklıdır.',
          appointmentFormSettings: {
            consultationTypes: ['Genel Bilgi'],
            showLawyerSelection: false,
            descriptionLabel: 'Mesajınız veya özel talepleriniz',
          },
        },
      })
    }

    isSeeded = true
    console.log('[auto-seed] Tüm veriler hazır!')
  } catch (error) {
    console.error('[auto-seed] Hata:', error)
    // Hata fırlatma - seed başarısız olsa bile sayfa yüklenmeli
    // Bir sonraki istekte tekrar denenecek (isSeeded hâlâ false)
  }
}
