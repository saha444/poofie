'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const INTERESTS = [
  'AI & Machine Learning', 'Web Development', 'Cybersecurity', 'Open Source',
  'Research', 'Competitive Programming', 'Mobile Development', 'DevOps & Cloud',
  'Blockchain & Web3', 'Systems Programming', 'Game Development', 'Data Science',
  'Embedded Systems', 'Developer Tooling', 'UI/UX Engineering', 'Robotics & IoT',
]

export default function InterestsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [selected, setSelected] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/')
  }, [status, router])

  const toggle = (interest: string) => {
    setSelected(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    )
  }

  const handleContinue = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/profile/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests: selected, onboardingComplete: true }),
      })
      if (!res.ok) throw new Error('Failed to save interests')
      router.push('/feed')
    } catch (e: any) {
      setError(e.message)
      setSaving(false)
    }
  }

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ color: 'var(--accent-cyan)' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div className="animate-slide-up" style={{ maxWidth: '640px', margin: '60px auto', padding: '0 20px' }}>
      <div className="glass-panel" style={{ padding: '40px' }}>
        <div style={{ marginBottom: '28px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Step 3 of 3 — Select Interests
          </span>
          <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginTop: '8px', fontWeight: 800 }}>
            What excites you most?
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px', lineHeight: '1.6' }}>
            Pick as many as you want. This shapes your feed, clan suggestions, and tribe matches.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
          {INTERESTS.map(interest => {
            const isSelected = selected.includes(interest)
            return (
              <button
                key={interest}
                onClick={() => toggle(interest)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '24px',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-light)',
                  background: isSelected ? 'rgba(0,242,254,0.1)' : 'rgba(255,255,255,0.02)',
                  color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {interest}
                {isSelected && ' ✓'}
              </button>
            )
          })}
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '12px' }}>{error}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleContinue}
            disabled={saving}
            className="btn-primary"
            style={{ justifyContent: 'center' }}
          >
            {saving ? 'Saving...' : `Continue to Feed${selected.length > 0 ? ` (${selected.length} selected)` : ''}`}
          </button>
          <button
            onClick={handleContinue}
            disabled={saving}
            style={{ background: 'transparent', border: '1px dashed rgba(255,255,255,0.12)', color: 'var(--text-dim)', fontSize: '0.75rem', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}
          >
            Skip — go straight to feed
          </button>
        </div>
      </div>
    </div>
  )
}
