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

  // Compute trait scores
  const scores: Record<DNAType | string, number> = {
    Maker: 0, Architect: 0, Explorer: 0, Strategist: 0,
    Scholar: 0, Alchemist: 0, Catalyst: 0, Craftsman: 0,
  }

  for (const [qIdx, optIdx] of Object.entries(answers)) {
    const question = QUESTIONS[parseInt(qIdx)]
    if (!question) continue
    const option = question.options[optIdx as unknown as number]
    if (!option) continue
    for (const [trait, pts] of Object.entries(option.scores)) {
      if (trait in scores) scores[trait] += pts
    }
  }

  // Boost scores based on GitHub/LeetCode data
  const profile = await prisma.profile.findUnique({ where: { userId } })
  if (profile) {
    if ((profile.githubRepos || 0) > 20) scores['Maker'] += 2
    if ((profile.leetcodeSolved || 0) > 100) scores['Scholar'] += 2
    if ((profile.devfolioHackathons || 0) > 3) scores['Explorer'] += 2
  }

  // Rank traits
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const primaryType = sorted[0][0]
  const secondaryType = sorted[1][0]

  // Generate AI explanation
  const explanation = await generateExplanationWithGemini(
    primaryType,
    secondaryType,
    scores,
    profile ? { repos: profile.githubRepos, topLanguages: profile.techStack } : null
  )

  // Save DNA result
  const dna = await prisma.dNAResult.upsert({
    where: { userId },
    create: { userId, primaryType, secondaryType, traitScores: scores, explanation },
    update: { primaryType, secondaryType, traitScores: scores, explanation },
  })

  return NextResponse.json({ success: true, dna })
}
