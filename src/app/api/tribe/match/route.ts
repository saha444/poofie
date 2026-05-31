import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/tribe/match?techStack=React,TypeScript&devType=Architect&domains=Web,AI
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const techStackParam = url.searchParams.get('techStack') || ''
  const devType = url.searchParams.get('devType') || ''
  const domainsParam = url.searchParams.get('domains') || ''

  const techStackFilters = techStackParam
    ? techStackParam.split(',').map((s) => s.trim()).filter(Boolean)
    : []
  const domainFilters = domainsParam
    ? domainsParam.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  const userId = session.user.id

  // Build Prisma where clause
  const whereClause: any = {
    NOT: { userId }, // exclude self
  }

  if (devType) {
    whereClause.user = {
      dnaResult: {
        primaryType: devType,
      },
    }
  }

  if (techStackFilters.length > 0) {
    whereClause.techStack = {
      hasSome: techStackFilters,
    }
  }

  if (domainFilters.length > 0) {
    whereClause.interests = {
      hasSome: domainFilters,
    }
  }

  const profiles = await prisma.profile.findMany({
    where: whereClause,
    take: 20,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          dnaResult: {
            select: {
              primaryType: true,
              secondaryType: true,
              explanation: true,
            },
          },
        },
      },
      skills: {
        take: 6,
        orderBy: { confidenceScore: 'desc' },
      },
    },
  })

  // Compute a simple match score: how many of the requested tech stack tags match
  const results = profiles.map((p) => {
    let score = 0
    if (techStackFilters.length > 0) {
      const matched = techStackFilters.filter((t) =>
        p.techStack.map((s) => s.toLowerCase()).includes(t.toLowerCase())
      )
      score += matched.length
    }
    if (devType && p.user.dnaResult?.primaryType === devType) score += 3
    if (domainFilters.length > 0) {
      const matched = domainFilters.filter((d) =>
        p.interests.map((i) => i.toLowerCase()).includes(d.toLowerCase())
      )
      score += matched.length
    }

    return { ...p, matchScore: score }
  })

  // Sort by match score descending
  results.sort((a, b) => b.matchScore - a.matchScore)

  return NextResponse.json({ results })
}
