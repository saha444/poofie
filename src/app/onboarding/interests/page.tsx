'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

// Soft dark palette
const C = {
  bg: '#0e0e0e',
  surface: '#141414',
  hover: '#1c1c1c',
  border: '#2e2e2e',
  borderMid: '#3a3a3a',
  text: '#f0f0f0',
  muted: '#c8c8c8',
  dim: '#888888',
  btnBg: '#efefef',
  btnText: '#111111',
}

const AVAILABLE_DOMAINS = [
  'AI & Machine Learning', 'Web Development', 'Cybersecurity', 'Open Source',
  'Academic Research', 'Competitive Programming', 'Mobile Development', 'DevOps & Cloud',
  'Blockchain & Web3', 'Systems Programming', 'Game Development', 'Data Science',
  'Embedded Systems', 'Developer Tooling', 'UI/UX Engineering', 'Robotics & IoT',
]

const TECH_ROLES = [
  'Frontend Engineer', 'Backend Engineer', 'Fullstack Engineer', 'Smart Contract Engineer',
  'DeFi Researcher', 'ZK Cryptographer', 'AI/ML Engineer', 'AI Research Scientist',
  'Platform Engineer / DevOps', 'Security Auditor / PenTester', 'Systems Programmer',
  'Embedded Systems Developer', 'Mobile Engineer', 'Developer Advocate', 'Technical Writer',
  'Competitive Programmer', 'Product Manager (Tech)', 'Database Architect',
]

export default function InterestsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [customRole, setCustomRole] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/profile/me')
        .then(r => r.json())
        .then(data => {
          if (data?.user?.profile) {
            const preSelected: string[] = []
            const techStack = data.user.profile.techStack || []
            const solves = data.user.profile.leetcodeSolved || 0
            const hasHacks = (data.user.profile.devfolioHackathons || 0) > 0

            if (techStack.some((t: string) => ['Solidity', 'Go', 'Rust'].includes(t))) preSelected.push('Blockchain & Web3')
            if (techStack.some((t: string) => ['Python', 'C++'].includes(t))) preSelected.push('AI & Machine Learning')
            if (techStack.some((t: string) => ['TypeScript', 'React', 'NextJS', 'JavaScript'].includes(t))) preSelected.push('Web Development')
            if (techStack.some((t: string) => ['C', 'Rust', 'Assembly'].includes(t))) preSelected.push('Systems Programming')
            if (solves > 30) preSelected.push('Competitive Programming')
            if (hasHacks) preSelected.push('Developer Tooling')

            setSelectedInterests(preSelected)
          }
        })
    }
  }, [status])

  const toggleInterest = (interest: string) =>
    setSelectedInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest])

  const toggleRole = (role: string) =>
    setSelectedRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role])

  const addCustomRole = () => {
    if (customRole.trim() && !selectedRoles.includes(customRole.trim())) {
      setSelectedRoles(prev => [...prev, customRole.trim()])
      setCustomRole('')
    }
  }

  const handleContinue = async () => {
    setSaving(true)
    setError('')
    try {
      const interestsToSave = [...selectedInterests, ...selectedRoles]
      const res = await fetch('/api/profile/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests: interestsToSave, onboardingComplete: true }),
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: C.bg }}>
        <div style={{ color: C.dim, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.9rem' }}>
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '680px' }}>

        {/* Card */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '48px' }}>

          {/* Header */}
          <div style={{ marginBottom: '36px' }}>
            <span style={{
              fontSize: '0.68rem', color: C.dim, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              fontFamily: 'var(--font-heading)',
            }}>
              Step 3 of 3 — Workspace Preferences
            </span>
            <h1 style={{
              fontSize: '1.8rem', fontFamily: 'var(--font-heading)',
              marginTop: '10px', fontWeight: 800,
              color: C.text, textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              Optimize Your Profile
            </h1>
            <p style={{ color: C.dim, fontSize: '0.88rem', marginTop: '10px', lineHeight: '1.65', fontFamily: 'var(--font-body)' }}>
              We've pre-selected recommended interests based on your connected repositories and LeetCode history.
            </p>
          </div>

          {/* Domains */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              fontSize: '0.68rem', color: C.dim, fontWeight: 700,
              letterSpacing: '0.12em', display: 'block', marginBottom: '14px',
              fontFamily: 'var(--font-heading)', textTransform: 'uppercase',
            }}>
              Recommended Domains (Telemetry Matched)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {AVAILABLE_DOMAINS.map(interest => {
                const isSelected = selectedInterests.includes(interest)
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    style={{
                      padding: '9px 16px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      fontFamily: 'var(--font-heading)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      background: isSelected ? C.btnBg : C.hover,
                      color: isSelected ? C.btnText : C.muted,
                      border: `1px solid ${isSelected ? C.btnBg : C.border}`,
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = C.borderMid
                        ;(e.currentTarget as HTMLElement).style.color = C.text
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = C.border
                        ;(e.currentTarget as HTMLElement).style.color = C.muted
                      }
                    }}
                  >
                    {interest}{isSelected && ' ✓'}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: `1px solid ${C.border}`, marginBottom: '32px' }} />

          {/* SDE Roles */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              fontSize: '0.68rem', color: C.dim, fontWeight: 700,
              letterSpacing: '0.12em', display: 'block', marginBottom: '14px',
              fontFamily: 'var(--font-heading)', textTransform: 'uppercase',
            }}>
              Select Your SDE Roles
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {TECH_ROLES.map(role => {
                const isSelected = selectedRoles.includes(role)
                return (
                  <button
                    key={role}
                    onClick={() => toggleRole(role)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      fontFamily: 'var(--font-body)',
                      background: isSelected ? C.btnBg : C.hover,
                      color: isSelected ? C.btnText : C.muted,
                      border: `1px solid ${isSelected ? C.btnBg : C.border}`,
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = C.borderMid
                        ;(e.currentTarget as HTMLElement).style.color = C.text
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = C.border
                        ;(e.currentTarget as HTMLElement).style.color = C.muted
                      }
                    }}
                  >
                    {role}{isSelected && ' ✓'}
                  </button>
                )
              })}
            </div>

            {/* Custom role input */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Add custom role (e.g. ZK Cryptographer)"
                value={customRole}
                onChange={e => setCustomRole(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomRole()}
                style={{
                  flex: 1, background: C.bg, border: `1px solid ${C.border}`,
                  color: C.text, borderRadius: '8px', padding: '10px 14px',
                  fontSize: '0.82rem', fontFamily: 'var(--font-body)', outline: 'none',
                }}
              />
              <button onClick={addCustomRole}
                style={{
                  padding: '10px 18px', background: C.btnBg, color: C.btnText,
                  border: `1px solid ${C.btnBg}`, borderRadius: '8px',
                  fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.75rem',
                  textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                + Add
              </button>
            </div>
          </div>

          {error && (
            <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '16px', fontFamily: 'var(--font-body)' }}>{error}</p>
          )}

          {/* Submit */}
          <button
            onClick={handleContinue}
            disabled={saving}
            style={{
              width: '100%', padding: '14px',
              background: saving ? C.hover : C.btnBg,
              color: saving ? C.dim : C.btnText,
              border: `1px solid ${saving ? C.border : C.btnBg}`,
              borderRadius: '10px',
              fontFamily: 'var(--font-heading)', fontWeight: 800,
              fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.15em',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              if (!saving) (e.currentTarget as HTMLElement).style.background = '#d8d8d8'
            }}
            onMouseLeave={e => {
              if (!saving) (e.currentTarget as HTMLElement).style.background = C.btnBg
            }}
          >
            {saving ? 'Saving...' : 'Finish Setup & Enter Feed'}
          </button>
        </div>
      </div>
    </div>
  )
}
