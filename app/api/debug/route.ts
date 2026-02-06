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
    counts: {},
    queries: {},
    sampleData: {},
    errors: [],
  }

  // Counts
  try {
    results.counts.users = await prisma.user.count()
    results.counts.hero = await prisma.heroSection.count()
    results.counts.about = await prisma.aboutSection.count()
    results.counts.contact = await prisma.contactInfo.count()
    results.counts.settings = await prisma.siteSettings.count()
  } catch (e: any) {
    results.errors.push({ step: 'counts', error: e.message })
  }

  // Test exact queries that API routes use
  try {
    const hero = await prisma.heroSection.findFirst({
      where: { active: true },
      orderBy: { updatedAt: 'desc' }
    })
    results.queries.heroWithActive = hero ? 'FOUND' : 'NULL'
  } catch (e: any) {
    results.errors.push({ step: 'heroQuery', error: e.message })
  }

  try {
    const heroAny = await prisma.heroSection.findFirst()
    results.queries.heroAny = heroAny ? { id: heroAny.id, title: heroAny.title, active: heroAny.active } : 'NULL'
  } catch (e: any) {
    results.errors.push({ step: 'heroAnyQuery', error: e.message })
  }

  try {
    const settings = await prisma.siteSettings.findFirst({
      orderBy: { updatedAt: 'desc' }
    })
    results.queries.settings = settings ? 'FOUND' : 'NULL'
  } catch (e: any) {
    results.errors.push({ step: 'settingsQuery', error: e.message })
  }

  try {
    const settingsAny = await prisma.siteSettings.findFirst()
    results.queries.settingsAny = settingsAny ? { id: settingsAny.id, siteName: settingsAny.siteName } : 'NULL'
  } catch (e: any) {
    results.errors.push({ step: 'settingsAnyQuery', error: e.message })
  }

  try {
    const contact = await prisma.contactInfo.findFirst({
      orderBy: { updatedAt: 'desc' }
    })
    results.queries.contact = contact ? 'FOUND' : 'NULL'
  } catch (e: any) {
    results.errors.push({ step: 'contactQuery', error: e.message })
  }

  // Get one sample hero to see actual data structure
  try {
    const sample = await prisma.heroSection.findFirst({
      select: { id: true, title: true, active: true, createdAt: true }
    })
    results.sampleData.hero = sample
  } catch (e: any) {
    results.errors.push({ step: 'sampleHero', error: e.message })
  }

  // Get one sample settings
  try {
    const sample = await prisma.siteSettings.findFirst({
      select: { id: true, siteName: true, createdAt: true }
    })
    results.sampleData.settings = sample
  } catch (e: any) {
    results.errors.push({ step: 'sampleSettings', error: e.message })
  }

  return NextResponse.json(results)
}
