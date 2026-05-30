import { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  // @ts-ignore — @auth/prisma-adapter types are slightly mismatched with next-auth v4 but work correctly
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          // Request read access to user's public profile and repos
          scope: 'read:user user:email repo',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'github' && user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true }
        })

        if (existingUser) {
          const hasGithubAccount = existingUser.accounts.some(
            acc => acc.provider === 'github'
          )
          
          if (!hasGithubAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              }
            })
          }
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { onboardingComplete: true },
        })
        token.onboardingComplete = dbUser?.onboardingComplete ?? false
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).onboardingComplete = token.onboardingComplete ?? false
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
}
