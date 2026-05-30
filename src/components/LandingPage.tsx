'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import PromptingIsAllYouNeed from './PromptingIsAllYouNeed'

export default function LandingPage() {
  const [isFlipped, setIsFlipped] = useState(false)
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
        animation: 'slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ 
          marginBottom: '16px', 
          fontSize: '0.75rem', 
          fontWeight: 700, 
          color: 'rgba(255, 255, 255, 0.5)', 
          letterSpacing: '0.2em', 
          fontFamily: 'monospace', 
          textTransform: 'uppercase',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.1)'
        }}>
          PULL TO START
        </div>

        <div className="toggle-container">
          <input 
            className="toggle-input" 
            type="checkbox"
            checked={isFlipped}
            onChange={(e) => {
              if (e.target.checked) {
                setIsFlipped(true)
                setTimeout(() => {
                  onStartAuth()
                }, 450)
              }
            }}
          />
          <div className="toggle-handle-wrapper">
            <div className="toggle-handle">
              <div className="toggle-handle-knob"></div>
              <div className="toggle-handle-bar-wrapper">
                <div className="toggle-handle-bar"></div>
              </div>
            </div>
          </div>
          <div className="toggle-base">
            <div className="toggle-base-inside"></div>
          </div>
        </div>
        
        <div style={{ marginTop: '20px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em', fontFamily: 'monospace', textTransform: 'uppercase' }}>
          🔒 Verified Attestation Engine
        </div>
      </div>

    </main>
  )
}

