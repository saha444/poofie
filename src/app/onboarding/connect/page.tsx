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

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: C.bg }}>
        <div style={{ color: C.dim, fontSize: '0.9rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Loading session...
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '640px' }}>

        {/* Card */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '48px' }}>

          {/* Header */}
          <div style={{ marginBottom: '36px' }}>
            <span style={{
              fontSize: '0.68rem', color: C.dim, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              fontFamily: 'var(--font-heading)',
            }}>
              Step 1 of 3 — Connect Accounts
            </span>
            <h1 style={{
              fontSize: '1.8rem', fontFamily: 'var(--font-heading)',
              marginTop: '10px', fontWeight: 800,
              color: C.text, textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              Link Developer Profiles
            </h1>
            <p style={{ color: C.dim, fontSize: '0.88rem', marginTop: '10px', lineHeight: '1.65', fontFamily: 'var(--font-body)' }}>
              We fetch real data from these platforms to build your Developer DNA, Work History, and Skill Radar Map.
            </p>
          </div>

          {/* Integration Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px' }}>
            <IntegrationCard
              name="GitHub"
              description="Repos, languages, stars, organizations"
              status={githubLoading ? 'loading' : githubData ? 'connected' : githubError ? 'error' : 'pending'}
              connectedData={githubData ? `@${githubData.username} · ${githubData.repos} repos · ${githubData.stars} stars` : undefined}
              error={githubError}
              onRetry={connectGitHub}
              autoConnected
            />

            <IntegrationCard
              name="LinkedIn"
              description="Experience, education (student/filler roles filtered)"
              status={linkedinLoading ? 'loading' : linkedinData ? 'connected' : linkedinError ? 'error' : 'idle'}
              connectedData={linkedinData ? `Connected · ${linkedinData.experience?.length || 0} verified roles` : undefined}
              error={linkedinError}
            >
              {!linkedinData && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <input
                    type="url"
                    placeholder="Paste LinkedIn Profile URL"
                    value={linkedinUrl}
                    onChange={e => setLinkedinUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && connectLinkedIn()}
                    style={{
                      flex: 1, background: C.bg, border: `1px solid ${C.border}`,
                      color: C.text, borderRadius: '8px', padding: '10px 14px',
                      fontSize: '0.82rem', fontFamily: 'var(--font-body)', outline: 'none',
                    }}
                  />
                  <button onClick={connectLinkedIn} disabled={linkedinLoading || !linkedinUrl}
                    style={{
                      padding: '10px 18px', background: C.btnBg, color: C.btnText,
                      border: `1px solid ${C.btnBg}`, borderRadius: '8px',
                      fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.75rem',
                      textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', whiteSpace: 'nowrap',
                    }}>
                    Connect
                  </button>
                </div>
              )}
            </IntegrationCard>

            <IntegrationCard
              name="LeetCode"
              description="Problems solved, contest rating, badges"
              status={leetcodeLoading ? 'loading' : leetcodeData ? 'connected' : leetcodeError ? 'error' : 'idle'}
              connectedData={leetcodeData ? `@${leetcodeData.username} · ${leetcodeData.totalSolved} solved` : undefined}
              error={leetcodeError}
            >
              {!leetcodeData && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <input
                    type="text"
                    placeholder="Your LeetCode username"
                    value={leetcodeUsername}
                    onChange={e => setLeetcodeUsername(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && connectLeetCode()}
                    style={{
                      flex: 1, background: C.bg, border: `1px solid ${C.border}`,
                      color: C.text, borderRadius: '8px', padding: '10px 14px',
                      fontSize: '0.82rem', fontFamily: 'var(--font-body)', outline: 'none',
                    }}
                  />
                  <button onClick={connectLeetCode} disabled={leetcodeLoading || !leetcodeUsername}
                    style={{
                      padding: '10px 18px', background: C.btnBg, color: C.btnText,
                      border: `1px solid ${C.btnBg}`, borderRadius: '8px',
                      fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.75rem',
                      textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', whiteSpace: 'nowrap',
                    }}>
                    Connect
                  </button>
                </div>
              )}
            </IntegrationCard>

            <IntegrationCard
              name="Devfolio"
              description="Hackathons participated, projects"
              status={devfolioLoading ? 'loading' : devfolioData ? 'connected' : devfolioError ? 'error' : 'idle'}
              connectedData={devfolioData ? `@${devfolioData.username} · ${devfolioData.hackathonsParticipated} hackathons` : undefined}
              error={devfolioError}
            >
              {!devfolioData && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <input
                    type="text"
                    placeholder="Your Devfolio username"
                    value={devfolioUsername}
                    onChange={e => setDevfolioUsername(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && connectDevfolio()}
                    style={{
                      flex: 1, background: C.bg, border: `1px solid ${C.border}`,
                      color: C.text, borderRadius: '8px', padding: '10px 14px',
                      fontSize: '0.82rem', fontFamily: 'var(--font-body)', outline: 'none',
                    }}
                  />
                  <button onClick={connectDevfolio} disabled={devfolioLoading || !devfolioUsername}
                    style={{
                      padding: '10px 18px', background: C.btnBg, color: C.btnText,
                      border: `1px solid ${C.btnBg}`, borderRadius: '8px',
                      fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.75rem',
                      textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', whiteSpace: 'nowrap',
                    }}>
                    Connect
                  </button>
                </div>
              )}
            </IntegrationCard>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => router.push('/onboarding/dna')}
              style={{
                padding: '14px', background: C.btnBg, color: C.btnText,
                border: `1px solid ${C.btnBg}`, borderRadius: '10px',
                fontFamily: 'var(--font-heading)', fontWeight: 800,
                fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#d8d8d8'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = C.btnBg}
            >
              Continue to DNA Quiz
            </button>
            <button
              onClick={() => router.push('/onboarding/dna')}
              style={{
                padding: '12px', background: 'transparent',
                border: `1px dashed ${C.border}`, color: C.dim,
                borderRadius: '10px', cursor: 'pointer',
                fontFamily: 'var(--font-heading)', fontSize: '0.75rem',
                textTransform: 'uppercase', letterSpacing: '0.12em',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = C.borderMid
                ;(e.currentTarget as HTMLElement).style.color = C.muted
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = C.border
                ;(e.currentTarget as HTMLElement).style.color = C.dim
              }}
            >
              Skip for Now — Connect Later from Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function IntegrationCard({ name, description, status, connectedData, error, children, onRetry, autoConnected }: any) {
  const isConnected = status === 'connected'
  const isError = status === 'error'
  const isLoading = status === 'loading'

  const statusColor = isConnected ? '#10b981' : isError ? '#ef4444' : C.dim
  const statusText = isConnected
    ? 'Connected'
    : isLoading ? 'Connecting...'
    : isError ? 'Failed'
    : autoConnected ? 'Connecting...'
    : 'Not connected'

  return (
    <div style={{
      padding: '18px 20px',
      background: C.hover,
      border: `1px solid ${isConnected ? '#10b98130' : C.border}`,
      borderRadius: '12px',
      transition: 'border-color 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            fontWeight: 800, fontSize: '0.88rem', color: C.text,
            fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.12em',
            marginBottom: '3px',
          }}>
            {name}
          </div>
          <div style={{ fontSize: '0.75rem', color: C.dim, fontFamily: 'var(--font-body)' }}>
            {description}
          </div>
        </div>
        <span style={{
          fontSize: '0.68rem', color: statusColor, fontWeight: 700,
          fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.12em',
          flexShrink: 0, marginLeft: '16px',
        }}>
          {statusText}
        </span>
      </div>

      {connectedData && (
        <div style={{
          marginTop: '10px', fontSize: '0.75rem', color: C.muted,
          background: C.surface, border: `1px solid ${C.border}`,
          padding: '8px 12px', borderRadius: '6px', fontFamily: 'var(--font-body)',
        }}>
          {connectedData}
        </div>
      )}

      {error && (
        <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#ef4444', fontFamily: 'var(--font-body)' }}>
          {error}{' '}
          {onRetry && (
            <button onClick={onRetry} style={{
              color: C.muted, background: 'none', border: 'none',
              cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline',
            }}>
              Retry
            </button>
          )}
        </div>
      )}

      {children}
    </div>
  )
}
