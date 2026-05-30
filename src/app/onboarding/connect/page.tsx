'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function ConnectAccountsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [githubData, setGithubData] = useState<any>(null)
  const [githubLoading, setGithubLoading] = useState(false)
  const [githubError, setGithubError] = useState('')

  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [linkedinData, setLinkedinData] = useState<any>(null)
  const [linkedinLoading, setLinkedinLoading] = useState(false)
  const [linkedinError, setLinkedinError] = useState('')

  const [leetcodeUsername, setLeetcodeUsername] = useState('')
  const [leetcodeData, setLeetcodeData] = useState<any>(null)
  const [leetcodeLoading, setLeetcodeLoading] = useState(false)
  const [leetcodeError, setLeetcodeError] = useState('')

  const [devfolioUsername, setDevfolioUsername] = useState('')
  const [devfolioData, setDevfolioData] = useState<any>(null)
  const [devfolioLoading, setDevfolioLoading] = useState(false)
  const [devfolioError, setDevfolioError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/')
  }, [status, router])

  // Auto-connect GitHub since we already have the token
  useEffect(() => {
    if (session?.user && !githubData && !githubLoading) {
      connectGitHub()
    }
  }, [session])

  const connectGitHub = async () => {
    setGithubLoading(true)
    setGithubError('')
    try {
      const res = await fetch('/api/integrations/github/connect', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setGithubData(data.data)
    } catch (e: any) {
      setGithubError(e.message || 'Failed to connect GitHub')
    } finally {
      setGithubLoading(false)
    }
  }

  const connectLinkedIn = async () => {
    if (!linkedinUrl.trim()) return
    setLinkedinLoading(true)
    setLinkedinError('')
    try {
      const res = await fetch('/api/integrations/linkedin/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileUrl: linkedinUrl.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setLinkedinData(data.data)
    } catch (e: any) {
      setLinkedinError(e.message || 'Failed to connect LinkedIn')
    } finally {
      setLinkedinLoading(false)
    }
  }

  const connectLeetCode = async () => {
    if (!leetcodeUsername.trim()) return
    setLeetcodeLoading(true)
    setLeetcodeError('')
    try {
      const res = await fetch('/api/integrations/leetcode/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: leetcodeUsername.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setLeetcodeData(data.data)
    } catch (e: any) {
      setLeetcodeError(e.message || 'Failed to connect LeetCode')
    } finally {
      setLeetcodeLoading(false)
    }
  }

  const connectDevfolio = async () => {
    if (!devfolioUsername.trim()) return
    setDevfolioLoading(true)
    setDevfolioError('')
    try {
      const res = await fetch('/api/integrations/devfolio/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: devfolioUsername.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDevfolioData(data.data)
    } catch (e: any) {
      setDevfolioError(e.message || 'Failed to connect Devfolio')
    } finally {
      setDevfolioLoading(false)
    }
  }

  if (status === 'loading') return <LoadingScreen />

  return (
    <div className="animate-slide-up" style={{ maxWidth: '640px', margin: '60px auto', padding: '0 20px' }}>
      <div className="glass-panel" style={{ padding: '40px' }}>
        <div style={{ marginBottom: '32px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Step 1 of 3 — Connect Accounts
          </span>
          <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginTop: '8px', fontWeight: 800 }}>
            Link your developer profiles
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px', lineHeight: '1.6' }}>
            We fetch real data from these platforms to build your Developer DNA, Work History, and Skill Radar Map.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* GitHub — auto-connected */}
          <IntegrationCard
            name="GitHub"
            icon="⬛"
            description="Repos, languages, stars, organizations"
            status={githubLoading ? 'loading' : githubData ? 'connected' : githubError ? 'error' : 'pending'}
            connectedData={githubData ? `@${githubData.username} · ${githubData.repos} repos · ${githubData.stars} stars · ${githubData.organizations?.length || 0} orgs` : undefined}
            error={githubError}
            onRetry={connectGitHub}
            autoConnected
          />

          {/* LinkedIn Experience */}
          <IntegrationCard
            name="LinkedIn"
            icon="🔵"
            description="Experience, education (student/filler roles filtered out)"
            status={linkedinLoading ? 'loading' : linkedinData ? 'connected' : linkedinError ? 'error' : 'idle'}
            connectedData={linkedinData ? `Connected · ${linkedinData.experience?.length || 0} verified roles · ${linkedinData.discardedCount || 0} fillers filtered` : undefined}
            error={linkedinError}
          >
            {!linkedinData && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input
                  type="url"
                  placeholder="Paste LinkedIn Profile URL"
                  value={linkedinUrl}
                  onChange={e => setLinkedinUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && connectLinkedIn()}
                  className="input-field"
                  style={{ flex: 1 }}
                />
                <button onClick={connectLinkedIn} disabled={linkedinLoading || !linkedinUrl} className="btn-secondary" style={{ whiteSpace: 'nowrap' }}>
                  Connect
                </button>
              </div>
            )}
          </IntegrationCard>

          {/* LeetCode */}
          <IntegrationCard
            name="LeetCode"
            icon="🟠"
            description="Problems solved, contest rating, badges"
            status={leetcodeLoading ? 'loading' : leetcodeData ? 'connected' : leetcodeError ? 'error' : 'idle'}
            connectedData={leetcodeData ? `@${leetcodeData.username} · ${leetcodeData.totalSolved} solved · Rating ${leetcodeData.contestRating || 'N/A'}` : undefined}
            error={leetcodeError}
          >
            {!leetcodeData && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input
                  type="text"
                  placeholder="Your LeetCode username"
                  value={leetcodeUsername}
                  onChange={e => setLeetcodeUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && connectLeetCode()}
                  className="input-field"
                  style={{ flex: 1 }}
                />
                <button onClick={connectLeetCode} disabled={leetcodeLoading || !leetcodeUsername} className="btn-secondary" style={{ whiteSpace: 'nowrap' }}>
                  Connect
                </button>
              </div>
            )}
          </IntegrationCard>

          {/* Devfolio */}
          <IntegrationCard
            name="Devfolio"
            icon="🔷"
            description="Hackathons participated, projects"
            status={devfolioLoading ? 'loading' : devfolioData ? 'connected' : devfolioError ? 'error' : 'idle'}
            connectedData={devfolioData ? `@${devfolioData.username} · ${devfolioData.hackathonsParticipated} hackathons` : undefined}
            error={devfolioError}
          >
            {!devfolioData && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input
                  type="text"
                  placeholder="Your Devfolio username"
                  value={devfolioUsername}
                  onChange={e => setDevfolioUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && connectDevfolio()}
                  className="input-field"
                  style={{ flex: 1 }}
                />
                <button onClick={connectDevfolio} disabled={devfolioLoading || !devfolioUsername} className="btn-secondary" style={{ whiteSpace: 'nowrap' }}>
                  Connect
                </button>
              </div>
            )}
          </IntegrationCard>
        </div>

        <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => router.push('/onboarding/dna')}
            className="btn-primary"
            style={{ justifyContent: 'center' }}
          >
            Continue to DNA Quiz →
          </button>
          <button
            onClick={() => router.push('/onboarding/dna')}
            style={{ background: 'transparent', border: '1px dashed rgba(255,255,255,0.12)', color: 'var(--text-dim)', fontSize: '0.75rem', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}
          >
            Skip for now — connect later from Settings
          </button>
        </div>
      </div>
    </div>
  )
}

function IntegrationCard({ name, icon, description, status, connectedData, error, children, onRetry, autoConnected }: any) {
  const statusColor = status === 'connected' ? '#10b981' : status === 'error' ? '#ef4444' : status === 'loading' ? 'var(--accent-cyan)' : 'var(--text-dim)'
  const statusText = status === 'connected' ? '✓ Connected' : status === 'loading' ? 'Connecting...' : status === 'error' ? 'Failed' : autoConnected ? 'Connecting...' : 'Not connected'

  return (
    <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '12px', transition: 'border-color 0.2s', ...(status === 'connected' ? { borderColor: 'rgba(16,185,129,0.3)' } : {}) }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.4rem' }}>{icon}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>{description}</div>
          </div>
        </div>
        <span style={{ fontSize: '0.72rem', color: statusColor, fontWeight: 600 }}>{statusText}</span>
      </div>
      {connectedData && (
        <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#10b981', background: 'rgba(16,185,129,0.06)', padding: '6px 10px', borderRadius: '6px' }}>
          {connectedData}
        </div>
      )}
      {error && (
        <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#ef4444' }}>
          {error} {onRetry && <button onClick={onRetry} style={{ color: 'var(--accent-cyan)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline' }}>Retry</button>}
        </div>
      )}
      {children}
    </div>
  )
}

function LoadingScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem' }}>Loading session...</div>
    </div>
  )
}
