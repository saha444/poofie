'use client'

import { signIn } from 'next-auth/react'
import PromptingIsAllYouNeed from './PromptingIsAllYouNeed'

export default function LandingPage() {
  const onStartAuth = () => signIn('github', { callbackUrl: '/onboarding/connect' })

  return (
    <main style={{ width: '100%', minHeight: '100vh', background: '#030305', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Interactive Retro Game displaying YOUR DEV ATTRIBUTIONS / AT ONE PLACE */}
      <PromptingIsAllYouNeed />

      {/* Cyber ambient glow */}
      <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'rgba(0, 242, 254, 0.04)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }} />

      {/* Minimalist Centered CTA Button positioned directly under the pixel text */}
      <div style={{ 
        position: 'absolute', 
        top: '73%', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 10,
        textAlign: 'center',
        animation: 'slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <button 
          onClick={onStartAuth} 
          className="btn-primary" 
          style={{ 
            padding: '18px 42px', 
            fontSize: '1.05rem', 
            fontWeight: 800,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            boxShadow: '0 0 40px rgba(0, 242, 254, 0.35), inset 0 0 10px rgba(255, 255, 255, 0.2)',
            borderRadius: '30px',
            border: '1px solid rgba(0, 242, 254, 0.5)',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = '0 0 50px rgba(0, 242, 254, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 242, 254, 0.35), inset 0 0 10px rgba(255, 255, 255, 0.2)'
          }}
        >
          Get Started
        </button>
        
        <div style={{ marginTop: '16px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em', fontFamily: 'monospace', textTransform: 'uppercase' }}>
          🔒 Verified Attestation Engine
        </div>
      </div>

    </main>
  )
}
