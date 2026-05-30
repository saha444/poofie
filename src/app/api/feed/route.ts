import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/feed
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const cursor = searchParams.get('cursor')
  const take = 20

  const posts = await prisma.post.findMany({
    where: category ? { category } : undefined,
    take,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          profile: { select: { username: true } },
          dnaResult: { select: { primaryType: true } },
        },
      },
      _count: { select: { likes: true, comments: true } },
      likes: { where: { userId: session.user.id }, select: { id: true } },
    },
  })

  const nextCursor = posts.length === take ? posts[posts.length - 1].id : null

  return NextResponse.json({ posts, nextCursor })
}

// POST /api/feed — create post
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const { content, title, category } = await req.json()

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }

  const post = await prisma.post.create({
    data: {
      userId,
      content,
      title: title || null,
      category: category || 'COMMUNITY',
    },
  })

  return NextResponse.json({ post }, { status: 201 })
}
