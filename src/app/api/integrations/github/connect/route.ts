import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/integrations/github/connect
// Uses the OAuth access_token already stored by NextAuth to fetch real GitHub data
export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  // Get the stored GitHub access token from the Account table
  const account = await prisma.account.findFirst({
    where: { userId, provider: 'github' },
    select: { access_token: true, providerAccountId: true },
  })

  if (!account?.access_token) {
    return NextResponse.json({ 
      error: 'GitHub session expired. Please sign out and sign in again to re-authenticate and sync real data.' 
    }, { status: 401 })
  }

  const headers = {
    Authorization: `Bearer ${account.access_token}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Poofie-App',
  }

  // Fetch user profile
  const userRes = await fetch('https://api.github.com/user', { headers })
  if (!userRes.ok) {
    return NextResponse.json({ error: 'GitHub API error fetching user' }, { status: 502 })
  }
  const ghUser = await userRes.json()

  // Fetch repos (up to 100)
  const reposRes = await fetch(
    `https://api.github.com/user/repos?per_page=100&sort=updated&type=owner`,
    { headers }
  )
  const repos: any[] = reposRes.ok ? await reposRes.json() : []

  // Fetch organizations
  const orgsRes = await fetch('https://api.github.com/user/orgs', { headers })
  const orgs: any[] = orgsRes.ok ? await orgsRes.json() : []
  const orgNames = orgs.map((o: any) => o.login)

  // Aggregate languages from repos
  const languageCounts: Record<string, number> = {}
  for (const repo of repos) {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1
    }
  }

  const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0)
  const topLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([lang]) => lang)

  // Build skill confidence scores from languages
  const skills = topLanguages.map((lang, i) => ({
    name: lang,
    confidenceScore: Math.max(40, 95 - i * 8),
    sources: ['GitHub'],
  }))

  // Upsert profile with real GitHub data
  const profile = await prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      username: ghUser.login,
      bio: ghUser.bio || null,
      avatarUrl: ghUser.avatar_url || null,
      githubUsername: ghUser.login,
      githubRepos: repos.length,
      githubStars: totalStars,
      githubContribs: ghUser.public_gists || 0,
      githubLanguages: languageCounts,
      techStack: topLanguages,
      githubOrgs: orgNames,
      preferredTech: topLanguages.slice(0, 3), // Default preferred tech based on top languages
    },
    update: {
      githubUsername: ghUser.login,
      githubRepos: repos.length,
      githubStars: totalStars,
      githubLanguages: languageCounts,
      techStack: topLanguages,
      githubOrgs: orgNames,
      bio: ghUser.bio || undefined,
      avatarUrl: ghUser.avatar_url || undefined,
    },
  })

  // Upsert skills
  await prisma.skill.deleteMany({ where: { profileId: profile.id, sources: { has: 'GitHub' } } })
  if (skills.length > 0) {
    await prisma.skill.createMany({
      data: skills.map(s => ({ ...s, profileId: profile.id })),
    })
  }

  return NextResponse.json({
    success: true,
    data: {
      username: ghUser.login,
      name: ghUser.name,
      bio: ghUser.bio,
      avatar: ghUser.avatar_url,
      repos: repos.length,
      stars: totalStars,
      topLanguages,
      organizations: orgNames,
    },
  })
}
