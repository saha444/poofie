import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import LandingPage from '@/components/LandingPage'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session?.user) {
    const onboardingComplete = (session.user as any).onboardingComplete
    if (onboardingComplete) {
      redirect('/feed')
    } else {
      redirect('/onboarding/connect')
    }
  }

  return <LandingPage />
}
