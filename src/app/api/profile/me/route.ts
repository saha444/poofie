import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH /api/profile/me — update interests and mark onboarding complete
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const body = await req.json()

  // Self-healing database check: Recreate User if database was reset
  const dbUser = await prisma.user.findUnique({ where: { id: userId } })
  if (!dbUser) {
    await prisma.user.create({
      data: {
        id: userId,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }
    })
  }

  // Update profile interests if provided
  if (body.interests) {
    await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        username: (session.user?.name || 'user').toLowerCase().replace(/\s+/g, '_'),
        interests: body.interests,
      },
      update: { interests: body.interests },
    })
  }

  // Mark onboarding complete
  if (body.onboardingComplete) {
    await prisma.user.update({
      where: { id: userId },
      data: { onboardingComplete: true },
    })
  }

  return NextResponse.json({ success: true })
}

// GET /api/profile/me
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  // Self-healing database check: Recreate User if database was reset
  let user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: { include: { skills: true, domains: true } },
      dnaResult: true,
      quizResponse: true,
    },
  })

  if (!user) {
    await prisma.user.create({
      data: {
        id: userId,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }
    })

    user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: { include: { skills: true, domains: true } },
        dnaResult: true,
        quizResponse: true,
      },
    })
  }

  return NextResponse.json({ user })
}
