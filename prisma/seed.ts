import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { config } from 'dotenv'

// Load .env.local file
config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
  // Admin kullanıcı oluştur
  const hashedPassword = await bcrypt.hash('admin123', 12)

  await prisma.user.upsert({
    where: { email: 'admin@murvetkara.com' },
    update: {},
    create: {
      email: 'admin@murvetkara.com',
      password: hashedPassword,
      name: 'Admin',
    },
  })

  // Hero section - sadece yoksa ekle
  const heroCount = await prisma.heroSection.count()
  if (heroCount === 0) {
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

  // Hakkımızda - sadece yoksa ekle
  const aboutCount = await prisma.aboutSection.count()
  if (aboutCount === 0) {
    await prisma.aboutSection.create({
    data: {
      title: 'Mürvet Kara Hakkında',
      content: 'Mürvet Kara Communication & Management olarak, profesyonel iletişim danışmanlığı ve yönetim hizmetleri sunuyoruz. İçeriği admin panelden güncelleyebilirsiniz.',
      mission: 'Admin panelden güncelleyiniz.',
      vision: 'Admin panelden güncelleyiniz.',
      values: [
        'Profesyonellik',
        'Güvenilirlik',
        'Yenilikçilik',
      ],
      active: true,
    },
  })
  }

  // İletişim bilgileri - sadece yoksa ekle
  const contactCount = await prisma.contactInfo.count()
  if (contactCount === 0) {
    await prisma.contactInfo.create({
    data: {
      address: 'Admin panelden güncelleyiniz',
      phone: '+90 000 000 00 00',
      email: 'info@murvetkara.com',
      workingHours: 'Pazartesi - Cuma: 09:00 - 18:00',
    },
  })
  }

  // Site ayarları - sadece yoksa ekle
  const settingsCount = await prisma.siteSettings.count()
  if (settingsCount === 0) {
    await prisma.siteSettings.create({
    data: {
      siteName: 'Mürvet Kara',
      siteTitle: 'Mürvet Kara | Communication & Management',
      description: 'Mürvet Kara Communication & Management - Profesyonel iletişim danışmanlığı ve yönetim hizmetleri.',
      logo: '/assets/mk-logo.png',
      primaryColor: '#c19a6b',
      secondaryColor: '#243b53',
      footerText: '© 2025 Mürvet Kara Communication & Management. Tüm hakları saklıdır.',
      socialMedia: {
        instagram: '',
        whatsapp: '',
      },
      sectionVisibility: {
        hero: true,
        services: true,
        about: true,
        team: true,
        testimonials: true,
        blog: true,
        contact: true,
      },
      copyrightText: '© 2025 Mürvet Kara Communication & Management. Tüm hakları saklıdır.',
      appointmentFormSettings: {
        consultationTypes: [
          'Genel Bilgi'
        ],
        showLawyerSelection: false,
        descriptionLabel: 'Mesajınız veya özel talepleriniz'
      }
    },
  })
  }

  console.log('Seed tamamlandı! Mürvet Kara veritabanı hazır.')
  console.log('Admin bilgileri:')
  console.log('Email: admin@murvetkara.com')
  console.log('Şifre: admin123')
  console.log('')
  console.log('ÖNEMLİ: İlk girişten sonra admin şifrenizi değiştirin!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
