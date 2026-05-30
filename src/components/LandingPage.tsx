'use client'

import { signIn } from 'next-auth/react'
import FloatingIconsHero from './FloatingIconsHero'

export default function LandingPage() {
  return (
    <main style={{ width: '100%', minHeight: '100vh', background: '#000000' }}>
      <FloatingIconsHero
        title="Discover Your true Developer DNA."
        subtitle="Poofie aggregates your GitHub activity, LeetCode stats, and hackathon record — then runs you through a 20-question personality quiz to compile a living Developer DNA profile. Find your tribe, locate compatible teammates, and explore meaningful opportunities."
        onStartAuth={() => signIn('github', { callbackUrl: '/onboarding/connect' })}
        onLogin={() => signIn('github', { callbackUrl: '/feed' })}
        onClearDatabase={undefined}
      />
    </main>
  )
}
