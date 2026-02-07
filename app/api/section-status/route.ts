import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [services, team, testimonials, blog, about, contact] = await Promise.all([
      prisma.service.count({ where: { active: true } }),
      prisma.teamMember.count({ where: { active: true } }),
      prisma.testimonial.count({ where: { active: true } }),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.aboutSection.count({ where: { active: true } }),
      prisma.contactInfo.count(),
    ])

    return NextResponse.json({
      hero: true,
      services: services > 0,
      about: about > 0,
      team: team > 0,
      testimonials: testimonials > 0,
      instagram: true,
      blog: blog > 0,
      contact: contact > 0,
    })
  } catch (error) {
    return NextResponse.json({
      hero: true, services: true, about: true, team: true,
      testimonials: true, instagram: true, blog: true, contact: true,
    })
  }
}
