'use client'

import { signIn } from 'next-auth/react'
import PromptingIsAllYouNeed from './PromptingIsAllYouNeed'
import { Sparkles } from 'lucide-react'

export default function LandingPage() {
  const onStartAuth = () => signIn('github', { callbackUrl: '/onboarding/connect' })
  const onLogin = () => signIn('github', { callbackUrl: '/feed' })

  return (
    <main style={{ width: '100%', minHeight: '100vh', background: '#030305', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Background Interactive Retro Game */}
      <PromptingIsAllYouNeed />

      {/* Cyber ambient glow */}
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(0, 242, 254, 0.05)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none', top: '15%', left: '10%', zIndex: 1 }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(155, 81, 224, 0.05)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none', bottom: '15%', right: '10%', zIndex: 1 }} />

      {/* Foreground Hero Content Card (Glassmorphism) */}
      <section className="glass-panel" style={{ 
        position: 'relative', 
        zIndex: 10, 
        maxWidth: '680px', 
        padding: '48px', 
        textAlign: 'center', 
        margin: '20px', 
        background: 'rgba(7, 7, 10, 0.65)', 
        backdropFilter: 'blur(16px)', 
        border: '1px solid rgba(0, 242, 254, 0.15)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0, 242, 254, 0.05)',
        borderRadius: '24px',
        animation: 'slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        
        {/* Floating sparkles tag */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 242, 254, 0.08)', border: '1px solid rgba(0, 242, 254, 0.25)', padding: '6px 16px', borderRadius: '30px', marginBottom: '24px' }}>
          <Sparkles size={14} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'monospace' }}>
            AI-POWERED DEV ATTRIBUTIONS
          </span>
        </div>

        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 900, 
          lineHeight: '1.15', 
          fontFamily: 'var(--font-heading)', 
          background: 'linear-gradient(135deg, #fff 30%, #00f2fe 70%, #9b51e0 100%)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em',
          marginBottom: '16px'
        }}>
          Discover Your True<br />Developer DNA.
        </h1>

        <p style={{ 
          color: 'var(--text-muted)', 
          fontSize: '0.92rem', 
          lineHeight: '1.65', 
          maxWidth: '580px', 
          margin: '0 auto 36px auto',
          fontWeight: 400
        }}>
          Poofie aggregates your real-time GitHub commits, LeetCode algorithms solved, and hackathon records — then synthesizes them with a personality quiz to attests to a verified developer profile.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button 
            onClick={onStartAuth} 
            className="btn-primary" 
            style={{ 
              padding: '14px 28px', 
              fontSize: '0.9rem', 
              fontWeight: 800,
              boxShadow: '0 0 20px rgba(0, 242, 254, 0.25)'
            }}
          >
            Get Started — Claim Your DNA →
          </button>
          
          <button 
            onClick={onLogin} 
            className="btn-secondary" 
            style={{ 
              padding: '14px 28px', 
              fontSize: '0.9rem', 
              fontWeight: 700 
            }}
          >
            Log In
          </button>
        </div>

        {/* Footnote */}
        <div style={{ marginTop: '28px', fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
          🔒 SECURE ON-CHAIN PROOFS · 100% VERIFIED METRICS ONLY
        </div>

      </section>

    </main>
  )
}
