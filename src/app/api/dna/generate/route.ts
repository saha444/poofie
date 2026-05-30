import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const DNA_TYPES = ['Maker', 'Architect', 'Explorer', 'Strategist', 'Scholar', 'Alchemist', 'Catalyst', 'Craftsman'] as const
type DNAType = typeof DNA_TYPES[number]

const QUESTIONS = [
  { options: [{ scores: { Maker: 2 } }, { scores: { Architect: 2 } }, { scores: { Scholar: 1, Explorer: 1 } }, { scores: { Catalyst: 2 } }] },
  { options: [{ scores: { Maker: 2 } }, { scores: { Architect: 2 } }, { scores: { Explorer: 2 } }, { scores: { Craftsman: 2 } }] },
  { options: [{ scores: { Craftsman: 2 } }, { scores: { Architect: 1, Scholar: 1 } }, { scores: { Maker: 2 } }, { scores: { Catalyst: 2 } }] },
  { options: [{ scores: { Scholar: 2 } }, { scores: { Explorer: 1, Maker: 1 } }, { scores: { Catalyst: 2 } }, { scores: { Scholar: 1, Architect: 1 } }] },
  { options: [{ scores: { Maker: 2 } }, { scores: { Architect: 1, Scholar: 1 } }, { scores: { Catalyst: 2 } }, { scores: { Explorer: 2 } }] },
  { options: [{ scores: { Architect: 2 } }, { scores: { Maker: 1, Craftsman: 1 } }, { scores: { Scholar: 2 } }, { scores: { Catalyst: 2 } }] },
  { options: [{ scores: { Catalyst: 2 } }, { scores: { Scholar: 1, Craftsman: 1 } }, { scores: { Maker: 1, Craftsman: 1 } }, { scores: { Architect: 2 } }] },
  { options: [{ scores: { Maker: 2 } }, { scores: { Craftsman: 2 } }, { scores: { Architect: 2 } }, { scores: { Explorer: 1, Scholar: 1 } }] },
  { options: [{ scores: { Maker: 2 } }, { scores: { Catalyst: 2 } }, { scores: { Architect: 1, Scholar: 1 } }, { scores: { Explorer: 2 } }] },
  { options: [{ scores: { Maker: 2 } }, { scores: { Craftsman: 2 } }, { scores: { Architect: 2 } }, { scores: { Scholar: 1, Explorer: 1 } }] },
  { options: [{ scores: { Maker: 2 } }, { scores: { Architect: 2 } }, { scores: { Scholar: 1, Explorer: 1 } }, { scores: { Catalyst: 2 } }] },
  { options: [{ scores: { Maker: 2 } }, { scores: { Architect: 2 } }, { scores: { Scholar: 1, Explorer: 1 } }, { scores: { Catalyst: 2 } }] },
  { options: [{ scores: { Maker: 2 } }, { scores: { Architect: 2 } }, { scores: { Explorer: 2 } }, { scores: { Craftsman: 1, Catalyst: 1 } }] },
  { options: [{ scores: { Maker: 2 } }, { scores: { Architect: 2 } }, { scores: { Scholar: 2 } }, { scores: { Catalyst: 2 } }] },
  { options: [{ scores: { Maker: 2 } }, { scores: { Architect: 2 } }, { scores: { Explorer: 2 } }, { scores: { Catalyst: 2 } }] },
  { options: [{ scores: { Maker: 2 } }, { scores: { Architect: 2 } }, { scores: { Scholar: 2 } }, { scores: { Craftsman: 2 } }] },
  { options: [{ scores: { Maker: 2 } }, { scores: { Architect: 2 } }, { scores: { Scholar: 1, Explorer: 1 } }, { scores: { Catalyst: 2 } }] },
  { options: [{ scores: { Maker: 2 } }, { scores: { Architect: 2 } }, { scores: { Scholar: 1, Explorer: 1 } }, { scores: { Catalyst: 2 } }] },
  { options: [{ scores: { Maker: 2 } }, { scores: { Architect: 2 } }, { scores: { Scholar: 2 } }, { scores: { Catalyst: 2 } }] },
  { options: [{ scores: { Maker: 2 } }, { scores: { Architect: 2 } }, { scores: { Explorer: 2 } }, { scores: { Catalyst: 2 } }] },
]

async function generateExplanationWithGemini(
  primary: string,
  secondary: string,
  traitScores: Record<string, number>,
  githubData?: any
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return getDefaultExplanation(primary)

  const prompt = `You are the Poofie Developer DNA engine. A developer just completed a 20-question personality assessment. Based on their results, generate a compelling, insightful 2-3 sentence explanation of their Developer DNA.

Primary DNA Type: ${primary}
Secondary DNA Type: ${secondary}
Trait Scores: ${JSON.stringify(traitScores)}
${githubData ? `GitHub Profile: ${githubData.repos} repos, top languages: ${githubData.topLanguages?.join(', ')}` : ''}

Write in second person ("You are..."). Be specific, energetic, and accurate. No generic fluff.`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 200, temperature: 0.8 },
        }),
      }
    )
    const data = await res.json()
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || getDefaultExplanation(primary)
  } catch {
    return getDefaultExplanation(primary)
  }
}

function getDefaultExplanation(primary: string): string {
  const explanations: Record<string, string> = {
    Maker: 'You build first and ask questions later. Your superpower is turning half-formed ideas into working software faster than anyone thought possible. You thrive on momentum and real-world feedback.',
    Architect: 'You think in systems. Before writing a single line, you map the territory — every dependency, every edge case, every future requirement. Your code lasts because you designed it to.',
    Explorer: 'You are drawn to the frontier. New languages, emerging protocols, and unsolved problems are your natural habitat. You bring discoveries back to the team that nobody else thought to look for.',
    Scholar: 'You go deep where others skim. You read the paper, trace the source, and understand the edge cases that will matter in six months. Your knowledge is the foundation others build on.',
    Alchemist: 'You transform constraints into breakthroughs. Where others see limitations, you find the hidden combination that makes something new possible. You synthesize across domains.',
    Catalyst: 'You multiply the people around you. Your real code is the team — unblocking, clarifying, mentoring, and making everyone around you more capable than they would be alone.',
    Craftsman: 'Quality is not optional for you — it is moral. You refactor until the code reads like prose, because you know that beautiful code is maintainable code. You raise the bar.',
    Strategist: 'You see three moves ahead. You balance speed and durability, short-term wins and long-term health, and you know when to push and when to slow down. Strategy is your language.',
  }
  return explanations[primary] || explanations.Maker
}

// POST /api/dna/generate
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  // Load quiz response
  const quizResponse = await prisma.quizResponse.findUnique({ where: { userId } })
  if (!quizResponse) {
    return NextResponse.json({ error: 'No quiz response found' }, { status: 400 })
  }

  const answers = quizResponse.answers as Record<string, number>

  // Compute base trait scores from quiz
  const baseScores: Record<string, number> = {
    Maker: 0, Architect: 0, Explorer: 0, Strategist: 0,
    Scholar: 0, Alchemist: 0, Catalyst: 0, Craftsman: 0,
  }

  for (const [qIdx, optIdx] of Object.entries(answers)) {
    const question = QUESTIONS[parseInt(qIdx)]
    if (!question) continue
    const option = question.options[optIdx as unknown as number]
    if (!option) continue
    for (const [trait, pts] of Object.entries(option.scores)) {
      if (trait in baseScores) baseScores[trait] += pts
    }
  }

  // Load telemetry profile
  const profile = await prisma.profile.findUnique({ where: { userId } })
  
  // Extract statistics
  const ghRepos = profile?.githubRepos || 0
  const ghStars = profile?.githubStars || 0
  const ghOrgsCount = profile?.githubOrgs?.length || 0
  const ltSolved = profile?.leetcodeSolved || 0
  const ltRating = profile?.leetcodeRating || 0
  const dfHacks = profile?.devfolioHackathons || 0
  const hasLinkedIn = !!profile?.linkedinUrl
  
  const linkedinExpArray = (profile?.linkedinExperience as any[]) || []
  const professionalYears = linkedinExpArray.length * 1.5

  // Calculate deep multi-platform Radar Scores (0 to 100) & Hover Justifications
  const radarScores: Record<string, { score: number; justification: string }> = {}

  // 1. Maker
  const makerScore = Math.min(100, Math.round(
    (baseScores['Maker'] * 8) + (ghRepos * 2) + (dfHacks * 10)
  ))
  radarScores['Maker'] = {
    score: makerScore || 40,
    justification: `Based on ${dfHacks} hackathons and ${ghRepos} public GitHub repositories.`,
  }

  // 2. Architect
  const architectScore = Math.min(100, Math.round(
    (baseScores['Architect'] * 8) + (ghStars * 1.5) + (professionalYears * 10)
  ))
  radarScores['Architect'] = {
    score: architectScore || 40,
    justification: `Earned via ${ghStars} stars on GitHub, and ${professionalYears.toFixed(1)} years of verified engineering roles.`,
  }

  // 3. Explorer
  const explorerScore = Math.min(100, Math.round(
    (baseScores['Explorer'] * 8) + (profile?.techStack?.length || 0) * 5 + (ghOrgsCount * 8)
  ))
  radarScores['Explorer'] = {
    score: explorerScore || 40,
    justification: `Derived from working across ${(profile?.techStack?.length || 0)} languages and participating in ${ghOrgsCount} organizations.`,
  }

  // 4. Strategist
  const strategistScore = Math.min(100, Math.round(
    (baseScores['Strategist'] * 8) + (professionalYears * 12) + (ltRating > 1200 ? (ltRating - 1200) / 10 : 0)
  ))
  radarScores['Strategist'] = {
    score: strategistScore || 40,
    justification: `Aggregated from ${linkedinExpArray.length} SDE career terms and critical design decision quiz parameters.`,
  }

  // 5. Scholar
  const scholarScore = Math.min(100, Math.round(
    (baseScores['Scholar'] * 8) + (ltSolved * 0.4) + (hasLinkedIn ? 15 : 0)
  ))
  radarScores['Scholar'] = {
    score: scholarScore || 40,
    justification: `Supported by ${ltSolved} verified LeetCode solves and formal academic degree profiles.`,
  }

  // 6. Alchemist
  const connectionPoints = (ghRepos > 0 ? 20 : 0) + (ltSolved > 0 ? 20 : 0) + (hasLinkedIn ? 20 : 0) + (dfHacks > 0 ? 20 : 0)
  const alchemistScore = Math.min(100, Math.round(
    (baseScores['Alchemist'] * 8) + connectionPoints
  ))
  radarScores['Alchemist'] = {
    score: alchemistScore || 40,
    justification: `Calculated from your highly integrated cross-platform profile connections.`,
  }

  // 7. Catalyst
  const catalystScore = Math.min(100, Math.round(
    (baseScores['Catalyst'] * 8) + (ghOrgsCount * 12) + (profile?.githubContribs || 0) * 5
  ))
  radarScores['Catalyst'] = {
    score: catalystScore || 40,
    justification: `Attributed to your active membership in ${ghOrgsCount} communities and collaborative contributions.`,
  }

  // 8. Craftsman
  const hasDetailedDesc = linkedinExpArray.some(e => e.desc && e.desc.length > 20)
  const craftsmanScore = Math.min(100, Math.round(
    (baseScores['Craftsman'] * 8) + (hasDetailedDesc ? 25 : 5) + ((profile?.techStack?.length || 0) > 3 ? 15 : 5)
  ))
  radarScores['Craftsman'] = {
    score: craftsmanScore || 40,
    justification: `Driven by system refactoring choices and high SDE workflow clarity.`,
  }

  // Determine Primary & Secondary Category
  const finalRanks = Object.entries(radarScores).map(([k, v]) => ({ type: k, score: v.score }))
  finalRanks.sort((a, b) => b.score - a.score)
  const primaryType = finalRanks[0].type
  const secondaryType = finalRanks[1].type

  // Derive Domain highlights
  const domainsHighlight: string[] = []
  const techStack = profile?.techStack || []
  
  if (techStack.some(t => ['Solidity', 'Go', 'Rust'].includes(t))) domainsHighlight.push('Web3 & Smart Contracts ⛓️')
  if (techStack.some(t => ['Python', 'C++'].includes(t))) domainsHighlight.push('Artificial Intelligence 🧠')
  if (techStack.some(t => ['TypeScript', 'React', 'NextJS', 'JavaScript'].includes(t))) domainsHighlight.push('Web Architecture 💻')
  if (techStack.some(t => ['C', 'Rust', 'Assembly'].includes(t))) domainsHighlight.push('Systems & Low-level 🔌')
  if (ltSolved > 50) domainsHighlight.push('Competitive Programming ♟️')
  if (dfHacks > 2) domainsHighlight.push('Hackathons & Prototyping 🚀')

  if (domainsHighlight.length === 0) {
    domainsHighlight.push('Software Engineering 💻')
  }

  // Update profile record with calculated radar values and derived domains
  await prisma.profile.update({
    where: { userId },
    data: {
      radarScores: radarScores as any,
      domainsHighlight,
    },
  })

  // Generate AI DNA explanation
  const explanation = await generateExplanationWithGemini(
    primaryType,
    secondaryType,
    Object.fromEntries(Object.entries(radarScores).map(([k, v]) => [k, v.score])),
    profile ? { repos: ghRepos, topLanguages: techStack } : null
  )

  // Upsert DNA result
  const dna = await prisma.dNAResult.upsert({
    where: { userId },
    create: { userId, primaryType, secondaryType, traitScores: Object.fromEntries(Object.entries(radarScores).map(([k, v]) => [k, v.score])), explanation },
    update: { primaryType, secondaryType, traitScores: Object.fromEntries(Object.entries(radarScores).map(([k, v]) => [k, v.score])), explanation },
  })

  return NextResponse.json({ success: true, dna })
}
