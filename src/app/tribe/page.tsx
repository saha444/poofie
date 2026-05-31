import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TribeClient from '@/components/TribeClient'

export const metadata = {
  title: 'Find My Tribe | Poofie',
  description: 'Discover developers who match your tech stack, dev archetype, and domain interests.',
}

export default async function TribePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/')

  const userId = session.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: { include: { skills: true } },
      dnaResult: true,
    },
  })

  return <TribeClient session={session} currentUser={user} />
}
