import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Regular expression to identify filler / student club roles
const FILLER_ROLE_PATTERNS = [
  /campus\s+ambassador/i,
  /campus\s+representative/i,
  /campus\s+facilitator/i,
  /student\s+partner/i,
  /student\s+representative/i,
  /club\s+member/i,
  /club\s+lead/i,
  /gdsc\s+lead/i,
  /gdg\s+lead/i,
  /core\s+team\s+member/i,
  /society\s+member/i,
  /volunteer\s+organizer/i,
  /event\s+coordinator/i,
  /student\s+ambassador/i,
  /campus\s+lead/i,
  /chapter\s+lead/i,
  /club\s+president/i,
]

// POST /api/integrations/linkedin/connect
// Body: { profileUrl: string, experience?: any[], education?: any[] }
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const { profileUrl, experience, education } = await req.json()

  if (!profileUrl?.trim()) {
    return NextResponse.json({ error: 'LinkedIn profile URL is required' }, { status: 400 })
  }

  // Save only experiences and education provided by the client (no hardcoded mocks)
  const inputExperience = experience || []
  const inputEducation = education || []

  // Filter out filler roles
  const cleanedExperience = inputExperience.filter((role: any) => {
    const isFiller = FILLER_ROLE_PATTERNS.some(pattern => 
      pattern.test(role.title) || pattern.test(role.company) || pattern.test(role.desc || '')
    )
    return !isFiller
  })

  const discardedCount = inputExperience.length - cleanedExperience.length

  // Upsert Profile with harvested LinkedIn experiences
  const profile = await prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      username: (session.user?.name || 'user').toLowerCase().replace(/\s+/g, '_'),
      linkedinUrl: profileUrl,
      linkedinExperience: cleanedExperience as any,
      linkedinEducation: inputEducation as any,
    },
    update: {
      linkedinUrl: profileUrl,
      linkedinExperience: cleanedExperience as any,
      linkedinEducation: inputEducation as any,
    },
  })

  // Add Professional experience skill points to radar mapping
  const professionalYears = cleanedExperience.length * 1.5 // approximate weight
  
  return NextResponse.json({
    success: true,
    data: {
      profileUrl,
      experience: cleanedExperience,
      education: inputEducation,
      discardedCount,
      professionalYears,
    },
  })
}
