import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/dna/quiz/submit
// Body: { answers: Record<number, number> }  (questionId -> optionIndex)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const { answers } = await req.json()

  if (!answers || typeof answers !== 'object') {
    return NextResponse.json({ error: 'answers object is required' }, { status: 400 })
  }

  // Save quiz response
  await prisma.quizResponse.upsert({
    where: { userId },
    create: { userId, answers, completed: true },
    update: { answers, completed: true },
  })

  // Trigger DNA generation immediately
  const generateRes = await fetch(`${process.env.NEXTAUTH_URL}/api/dna/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: req.headers.get('cookie') || '' },
  })

  const generateData = await generateRes.json()

  return NextResponse.json({ success: true, dna: generateData.dna })
}
