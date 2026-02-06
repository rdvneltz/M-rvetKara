import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL_SET: !!process.env.DATABASE_URL,
      DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 30) + '...',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
      NEXTAUTH_SECRET_SET: !!process.env.NEXTAUTH_SECRET,
      NODE_ENV: process.env.NODE_ENV,
    },
    database: {},
    errors: [],
  }

  try {
    const userCount = await prisma.user.count()
    results.database.users = userCount
  } catch (e: any) {
    results.errors.push({ table: 'user', error: e.message })
  }

  try {
    const heroCount = await prisma.heroSection.count()
    results.database.hero = heroCount
  } catch (e: any) {
    results.errors.push({ table: 'heroSection', error: e.message })
  }

  try {
    const aboutCount = await prisma.aboutSection.count()
    results.database.about = aboutCount
  } catch (e: any) {
    results.errors.push({ table: 'aboutSection', error: e.message })
  }

  try {
    const contactCount = await prisma.contactInfo.count()
    results.database.contact = contactCount
  } catch (e: any) {
    results.errors.push({ table: 'contactInfo', error: e.message })
  }

  try {
    const settingsCount = await prisma.siteSettings.count()
    results.database.settings = settingsCount
  } catch (e: any) {
    results.errors.push({ table: 'siteSettings', error: e.message })
  }

  return NextResponse.json(results)
}
