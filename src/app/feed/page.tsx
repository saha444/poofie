import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import FeedClient from '@/components/FeedClient'

export default async function FeedPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) redirect('/')

  const userId = session.user.id

  // Fetch user profile with DNA
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: { skills: true },
      },
      dnaResult: true,
    },
  })

  // Fetch initial posts
  const posts = await prisma.post.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true, name: true, image: true,
          profile: { select: { username: true } },
          dnaResult: { select: { primaryType: true } },
        },
      },
      _count: { select: { likes: true, comments: true } },
      likes: { where: { userId }, select: { id: true } },
    },
  })

  return <FeedClient initialPosts={posts} currentUser={user} session={session} />
}
