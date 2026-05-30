'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

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
  'Competitive Programmer', 'Product Manager (Tech)', 'Database Architect'
]

export default function InterestsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [customRole, setCustomRole] = useState('')
  const [profileData, setProfileData] = useState<any>(null)
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/')
  }, [status, router])

  // Fetch connected profile details to perform smart pre-selection
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/profile/me')
        .then(r => r.json())
        .then(data => {
          if (data?.user?.profile) {
            setProfileData(data.user.profile)
            
            // Smart pre-selection based on telemetry
            const preSelected: string[] = []
            const techStack = data.user.profile.techStack || []
            const solves = data.user.profile.leetcodeSolved || 0
            const hasHacks = (data.user.profile.devfolioHackathons || 0) > 0

            if (techStack.some((t: string) => ['Solidity', 'Go', 'Rust'].includes(t))) {
              preSelected.push('Blockchain & Web3')
            }
            if (techStack.some((t: string) => ['Python', 'C++'].includes(t))) {
              preSelected.push('AI & Machine Learning')
            }
            if (techStack.some((t: string) => ['TypeScript', 'React', 'NextJS', 'JavaScript'].includes(t))) {
              preSelected.push('Web Development')
            }
            if (techStack.some((t: string) => ['C', 'Rust', 'Assembly'].includes(t))) {
              preSelected.push('Systems Programming')
            }
            if (solves > 30) {
              preSelected.push('Competitive Programming')
            }
            if (hasHacks) {
              preSelected.push('Developer Tooling')
            }

            setSelectedInterests(preSelected)
          }
        })
    }
  }, [status])

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    )
  }

  const toggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    )
  }

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
      // Merge selected roles and interests
      const interestsToSave = [...selectedInterests, ...selectedRoles]
      
      const res = await fetch('/api/profile/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          interests: interestsToSave, 
          onboardingComplete: true 
        }),
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
    <div className="animate-slide-up" style={{ maxWidth: '680px', margin: '60px auto', padding: '0 20px' }}>
      <div className="glass-panel" style={{ padding: '40px' }}>
        <div style={{ marginBottom: '28px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Step 3 of 3 — Setup Workspace Preferences
          </span>
          <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginTop: '8px', fontWeight: 800 }}>
            Optimize your developer profile
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px', lineHeight: '1.6' }}>
            We've pre-selected recommended interests based on your connected code repositories and LeetCode history. Add your developer roles below!
          </p>
        </div>

        {/* Section 1: Preselected Domains */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em', display: 'block', marginBottom: '12px' }}>
            RECOMMENDED DOMAINS (TELEMETRY MATCHED)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {AVAILABLE_DOMAINS.map(interest => {
              const isSelected = selectedInterests.includes(interest)
              return (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
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
        </div>

        {/* Section 2: Roles selector */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em', display: 'block', marginBottom: '12px' }}>
            SELECT YOUR SDE ROLES
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
                    border: isSelected ? '1px solid var(--accent-purple)' : '1px solid var(--border-light)',
                    background: isSelected ? 'rgba(155,81,224,0.1)' : 'rgba(255,255,255,0.02)',
                    color: isSelected ? 'var(--accent-purple)' : 'var(--text-dim)',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {role}
                </button>
              )
            })}
          </div>

          {/* Add custom role dropdown/input */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Add custom role (e.g. ZK Cryptographer, Systems Architect)"
              value={customRole}
              onChange={e => setCustomRole(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustomRole()}
              className="input-field"
              style={{ flex: 1 }}
            />
            <button onClick={addCustomRole} className="btn-secondary" style={{ whiteSpace: 'nowrap' }}>
              + Add
            </button>
          </div>
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '12px' }}>{error}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleContinue}
            disabled={saving}
            className="btn-primary"
            style={{ justifyContent: 'center' }}
          >
            {saving ? 'Saving...' : 'Finish Setup & Enter Feed →'}
          </button>
        </div>
      </div>
    </div>
  )
}
