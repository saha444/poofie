'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TECH_STACK_OPTIONS = [
  'React', 'Next.js', 'TypeScript', 'Python', 'Rust', 'Go', 'Java',
  'Node.js', 'Vue', 'Svelte', 'GraphQL', 'PostgreSQL', 'MongoDB',
  'Docker', 'Kubernetes', 'AWS', 'TensorFlow', 'PyTorch', 'Solidity',
  'C++', 'Swift', 'Kotlin', 'Flutter', 'Redis', 'Terraform',
]

const DEV_TYPES = [
  'Maker', 'Architect', 'Explorer', 'Scholar', 'Craftsman', 'Catalyst', 'Strategist', 'Alchemist',
]

const DOMAIN_OPTIONS = [
  'Web Development', 'AI / ML', 'Systems', 'Mobile', 'DevOps', 'Blockchain',
  'Open Source', 'Security', 'Data Engineering', 'Game Dev', 'Embedded', 'Compilers',
]

const DNA_COLORS: Record<string, string> = {
  Maker: '#f59e0b',
  Architect: '#3b82f6',
  Explorer: '#8b5cf6',
  Scholar: '#10b981',
  Craftsman: '#ec4899',
  Catalyst: '#f97316',
  Strategist: '#06b6d4',
  Alchemist: '#a855f7',
}

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

type MatchedProfile = {
  id: string
  username: string
  bio: string | null
  avatarUrl: string | null
  techStack: string[]
  interests: string[]
  specialization: string | null
  matchScore: number
  skills: { id: string; name: string; confidenceScore: number }[]
  user: {
    id: string
    name: string | null
    image: string | null
    dnaResult: {
      primaryType: string
      secondaryType: string
      explanation: string
    } | null
  }
}

const NAV_LINKS = [
  ['Home', '/feed'],
  ['My DNA', '/profile'],
  ['Find My Tribe', '/tribe'],
  ['Explore', '/explore'],
  ['Opportunities', '/opportunities'],
  ['Leagues', '/leagues'],
  ['Clans', '/clans'],
  ['Settings', '/settings'],
]

export default function TribeClient({ session, currentUser }: { session: any; currentUser: any }) {
  const router = useRouter()

  const [selectedTech, setSelectedTech] = useState<string[]>([])
  const [selectedDevType, setSelectedDevType] = useState<string>('')
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const [results, setResults] = useState<MatchedProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const toggleTech = (tech: string) =>
    setSelectedTech(prev => prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech])

  const toggleDomain = (domain: string) =>
    setSelectedDomains(prev => prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain])

  const handleSearch = async () => {
    setLoading(true)
    setSearched(true)
    try {
      const params = new URLSearchParams()
      if (selectedTech.length > 0) params.set('techStack', selectedTech.join(','))
      if (selectedDevType) params.set('devType', selectedDevType)
      if (selectedDomains.length > 0) params.set('domains', selectedDomains.join(','))
      const res = await fetch(`/api/tribe/match?${params.toString()}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const profile = currentUser?.profile
  const dna = currentUser?.dnaResult
  const currentPath = '/tribe'

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column' }}>

      {/* ── Nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: C.bg, borderBottom: `1px solid ${C.border}`,
        padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '72px', flexShrink: 0,
      }}>
        <div style={{
          fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.6rem',
          color: C.text, letterSpacing: '0.04em',
        }}>
          POOFIE
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {session?.user?.image && (
            <img src={session.user.image} alt="avatar"
              style={{ width: '40px', height: '40px', borderRadius: '50%', border: `2px solid ${C.borderMid}` }} />
          )}
        </div>
      </nav>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '300px 1fr', gap: '0' }}>

        {/* ── Left Sidebar ── */}
        <aside style={{
          borderRight: `1px solid ${C.border}`,
          padding: '32px 24px',
          position: 'sticky', top: '72px',
          height: 'calc(100vh - 72px)',
          overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '32px',
          background: C.bg,
        }}>
          {/* User Identity */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            paddingBottom: '28px', borderBottom: `1px solid ${C.border}`,
          }}>
            {session?.user?.image ? (
              <img src={session.user.image} alt=""
                style={{ width: '52px', height: '52px', borderRadius: '50%', border: `2px solid ${C.borderMid}`, flexShrink: 0 }} />
            ) : (
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                border: `2px solid ${C.borderMid}`, background: C.hover, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-heading)', fontWeight: 800, color: C.text, fontSize: '1.2rem',
              }}>
                {(session?.user?.name || '?')[0].toUpperCase()}
              </div>
            )}
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem',
                color: C.text, textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {session?.user?.name}
              </div>
              {profile?.username && (
                <div style={{ fontSize: '0.78rem', color: C.dim, marginTop: '2px' }}>@{profile.username}</div>
              )}
              {dna?.primaryType && (
                <div style={{
                  marginTop: '6px', display: 'inline-block',
                  padding: '2px 10px', borderRadius: '20px',
                  fontSize: '0.62rem', fontWeight: 700,
                  fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.1em',
                  background: `${DNA_COLORS[dna.primaryType] || C.text}18`,
                  color: DNA_COLORS[dna.primaryType] || C.text,
                  border: `1px solid ${DNA_COLORS[dna.primaryType] || C.border}50`,
                }}>
                  {dna.primaryType}
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {NAV_LINKS.map(([label, href]) => {
              const isActive = href === currentPath
              return (
                <a key={label} href={href} className={isActive ? 'active-tab' : ''} style={{
                  display: 'block', padding: '13px 16px', borderRadius: '10px',
                  color: isActive ? C.btnText : C.muted,
                  background: isActive ? C.btnBg : 'transparent',
                  fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.85rem',
                  textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.12em',
                  border: `1px solid transparent`, transition: 'all 0.15s ease',
                }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = C.hover
                      ;(e.currentTarget as HTMLElement).style.borderColor = C.border
                      ;(e.currentTarget as HTMLElement).style.color = C.text
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent'
                      ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
                      ;(e.currentTarget as HTMLElement).style.color = C.muted
                    }
                  }}>
                  {label}
                </a>
              )
            })}
          </nav>

          {/* Active Filters summary */}
          <div style={{ marginTop: 'auto', padding: '20px', border: `1px solid ${C.border}`, borderRadius: '12px', background: C.surface }}>
            <div style={{
              fontSize: '0.65rem', fontFamily: 'var(--font-heading)', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.15em', color: C.dim, marginBottom: '12px',
            }}>
              Your Filters
            </div>
            {selectedDevType && (
              <div style={{ marginBottom: '8px' }}>
                <span style={{
                  padding: '3px 10px', borderRadius: '6px', fontSize: '0.65rem',
                  fontFamily: 'var(--font-heading)', fontWeight: 700, textTransform: 'uppercase',
                  background: `${DNA_COLORS[selectedDevType] || C.text}18`,
                  color: DNA_COLORS[selectedDevType] || C.text,
                  border: `1px solid ${DNA_COLORS[selectedDevType] || C.border}50`,
                }}>
                  {selectedDevType}
                </span>
              </div>
            )}
            {selectedTech.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
                {selectedTech.slice(0, 5).map(t => (
                  <span key={t} style={{
                    padding: '2px 8px', borderRadius: '4px', fontSize: '0.62rem',
                    fontFamily: 'var(--font-heading)', color: C.muted,
                    border: `1px solid ${C.borderMid}`, textTransform: 'uppercase',
                  }}>
                    {t}
                  </span>
                ))}
                {selectedTech.length > 5 && (
                  <span style={{ fontSize: '0.62rem', color: C.dim, padding: '2px 4px' }}>+{selectedTech.length - 5}</span>
                )}
              </div>
            )}
            {!selectedDevType && selectedTech.length === 0 && selectedDomains.length === 0 && (
              <p style={{ fontSize: '0.78rem', color: C.dim, fontFamily: 'var(--font-body)' }}>No filters selected yet</p>
            )}
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main style={{ padding: '40px 48px', minHeight: 'calc(100vh - 72px)', background: C.bg }}>

          {/* Page Header */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 900,
              fontSize: '2.8rem', color: C.text,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              marginBottom: '10px', lineHeight: 1.1,
            }}>
              Find My Tribe
            </h1>
            <p style={{ color: C.dim, fontSize: '1rem', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
              Filter by dev type, preferred tech stack, and domain to discover developers who match your vibe.
            </p>
          </div>

          {/* Filter Panel */}
          <div style={{
            border: `1px solid ${C.border}`, borderRadius: '14px',
            padding: '36px', marginBottom: '40px', background: C.surface,
          }}>

            {/* Dev Type */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block', fontFamily: 'var(--font-heading)', fontWeight: 700,
                fontSize: '0.7rem', color: C.dim, textTransform: 'uppercase',
                letterSpacing: '0.15em', marginBottom: '14px',
              }}>
                Preferred Dev Type
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {DEV_TYPES.map(type => {
                  const isSelected = selectedDevType === type
                  const color = DNA_COLORS[type]
                  return (
                    <button key={type}
                      onClick={() => setSelectedDevType(isSelected ? '' : type)}
                      className={!isSelected ? 'tag-option-unselected' : ''}
                      style={{
                        padding: '10px 22px', borderRadius: '10px',
                        fontSize: '0.82rem', fontFamily: 'var(--font-heading)', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer',
                        background: isSelected ? C.btnBg : C.hover,
                        color: isSelected ? C.btnText : C.muted,
                        border: isSelected ? `2px solid ${color}` : `1px solid ${C.border}`,
                        boxShadow: isSelected ? `0 0 14px ${color}30` : 'none',
                        transition: 'all 0.15s ease',
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
                      }}>
                      {type}
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${C.border}`, marginBottom: '32px' }} />

            {/* Tech Stack */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block', fontFamily: 'var(--font-heading)', fontWeight: 700,
                fontSize: '0.7rem', color: C.dim, textTransform: 'uppercase',
                letterSpacing: '0.15em', marginBottom: '14px',
              }}>
                Preferred Tech Stack
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {TECH_STACK_OPTIONS.map(tech => {
                  const isSelected = selectedTech.includes(tech)
                  return (
                    <button key={tech}
                      onClick={() => toggleTech(tech)}
                      className={!isSelected ? 'tag-option-unselected' : ''}
                      style={{
                        padding: '8px 18px', borderRadius: '8px',
                        fontSize: '0.78rem', fontFamily: 'var(--font-heading)', fontWeight: 600,
                        textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer',
                        background: isSelected ? C.btnBg : C.hover,
                        color: isSelected ? C.btnText : C.muted,
                        border: `1px solid ${isSelected ? C.btnBg : C.border}`,
                        transition: 'all 0.15s ease',
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
                      }}>
                      {tech}
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${C.border}`, marginBottom: '32px' }} />

            {/* Domains */}
            <div style={{ marginBottom: '36px' }}>
              <label style={{
                display: 'block', fontFamily: 'var(--font-heading)', fontWeight: 700,
                fontSize: '0.7rem', color: C.dim, textTransform: 'uppercase',
                letterSpacing: '0.15em', marginBottom: '14px',
              }}>
                Domain / Interest
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {DOMAIN_OPTIONS.map(domain => {
                  const isSelected = selectedDomains.includes(domain)
                  return (
                    <button key={domain}
                      onClick={() => toggleDomain(domain)}
                      className={!isSelected ? 'tag-option-unselected' : ''}
                      style={{
                        padding: '8px 18px', borderRadius: '8px',
                        fontSize: '0.78rem', fontFamily: 'var(--font-heading)', fontWeight: 600,
                        textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer',
                        background: isSelected ? C.btnBg : C.hover,
                        color: isSelected ? C.btnText : C.muted,
                        border: `1px solid ${isSelected ? C.btnBg : C.border}`,
                        transition: 'all 0.15s ease',
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
                      }}>
                      {domain}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Search Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button onClick={handleSearch} disabled={loading}
                style={{
                  padding: '14px 48px',
                  background: C.btnBg, color: C.btnText,
                  border: `1px solid ${C.btnBg}`, borderRadius: '10px',
                  fontFamily: 'var(--font-heading)', fontWeight: 800,
                  fontSize: '0.92rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1, transition: 'all 0.15s ease',
                }}>
                {loading ? 'Searching...' : 'Find My Tribe'}
              </button>
              {(selectedTech.length > 0 || selectedDevType || selectedDomains.length > 0) && (
                <button
                  onClick={() => { setSelectedTech([]); setSelectedDevType(''); setSelectedDomains([]) }}
                  className="tag-option-unselected"
                  style={{
                    padding: '14px 24px',
                    background: 'transparent', color: C.dim,
                    border: `1px solid ${C.border}`, borderRadius: '10px',
                    fontFamily: 'var(--font-heading)', fontWeight: 600,
                    fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em',
                    cursor: 'pointer', transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.text; (e.currentTarget as HTMLElement).style.borderColor = C.borderMid }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.dim; (e.currentTarget as HTMLElement).style.borderColor = C.border }}
                >
                  Clear All
                </button>
              )}
              {searched && !loading && (
                <span style={{ fontSize: '0.8rem', color: C.dim, fontFamily: 'var(--font-body)', marginLeft: 'auto' }}>
                  {results.length} developer{results.length !== 1 ? 's' : ''} found
                </span>
              )}
            </div>
          </div>

          {/* No results */}
          {searched && !loading && results.length === 0 && (
            <div style={{
              border: `1px solid ${C.border}`, borderRadius: '14px',
              padding: '80px 40px', textAlign: 'center', background: C.surface,
            }}>
              <div style={{
                fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.4rem',
                color: C.text, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px',
              }}>
                No Matches Found
              </div>
              <p style={{ color: C.dim, fontSize: '0.95rem', fontFamily: 'var(--font-body)' }}>
                Try broadening your filters — more developers join every day.
              </p>
            </div>
          )}

          {/* Results grid */}
          {results.length > 0 && (
            <>
              <div style={{
                fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.7rem',
                color: C.dim, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '20px',
              }}>
                {results.length} Developer{results.length !== 1 ? 's' : ''} Found
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                {results.map(prof => {
                  const dnaType = prof.user.dnaResult?.primaryType
                  const dnaColor = dnaType ? DNA_COLORS[dnaType] : undefined

                  return (
                    <div key={prof.id} style={{
                      border: `1px solid ${C.border}`, borderRadius: '14px',
                      padding: '28px', background: C.surface,
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      display: 'flex', flexDirection: 'column', gap: '16px',
                    }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = dnaColor ? `${dnaColor}60` : C.borderMid
                        ;(e.currentTarget as HTMLElement).style.boxShadow = dnaColor ? `0 0 20px ${dnaColor}10` : 'none'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = C.border
                        ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                      }}
                    >
                      {/* Header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        {prof.user.image ? (
                          <img src={prof.user.image} alt=""
                            style={{
                              width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
                              border: `2px solid ${dnaColor ? `${dnaColor}60` : C.borderMid}`,
                            }} />
                        ) : (
                          <div style={{
                            width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
                            border: `2px solid ${C.borderMid}`, background: C.hover,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'var(--font-heading)', fontWeight: 800, color: C.text, fontSize: '1.2rem',
                          }}>
                            {(prof.user.name || prof.username || '?')[0].toUpperCase()}
                          </div>
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.95rem',
                            color: C.text, textTransform: 'uppercase', letterSpacing: '0.06em',
                          }}>
                            {prof.user.name || prof.username}
                          </div>
                          {prof.username && (
                            <div style={{ fontSize: '0.75rem', color: C.dim, marginTop: '2px' }}>@{prof.username}</div>
                          )}
                        </div>
                        {prof.matchScore > 0 && (
                          <div style={{
                            padding: '4px 12px', borderRadius: '6px', flexShrink: 0,
                            border: `1px solid ${dnaColor ? `${dnaColor}60` : C.border}`,
                            color: dnaColor || C.muted, fontSize: '0.65rem',
                            fontFamily: 'var(--font-heading)', fontWeight: 800,
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                          }}>
                            {prof.matchScore} pts
                          </div>
                        )}
                      </div>

                      {/* DNA badges */}
                      {dnaType && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{
                            padding: '4px 12px', borderRadius: '6px',
                            background: `${dnaColor}14`,
                            border: `1px solid ${dnaColor}50`,
                            color: dnaColor, fontSize: '0.68rem',
                            fontFamily: 'var(--font-heading)', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                          }}>
                            {dnaType}
                          </span>
                          {prof.user.dnaResult?.secondaryType && (
                            <span style={{
                              padding: '4px 12px', borderRadius: '6px',
                              border: `1px solid ${C.border}`,
                              color: C.dim, fontSize: '0.68rem',
                              fontFamily: 'var(--font-heading)', fontWeight: 600,
                              textTransform: 'uppercase', letterSpacing: '0.08em',
                            }}>
                              {prof.user.dnaResult.secondaryType}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Bio */}
                      {prof.bio && (
                        <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: '1.6', fontFamily: 'var(--font-body)' }}>
                          {prof.bio.length > 120 ? prof.bio.slice(0, 120) + '...' : prof.bio}
                        </p>
                      )}

                      {/* Tech Stack */}
                      {prof.techStack.length > 0 && (
                        <div>
                          <div style={{
                            fontSize: '0.62rem', fontFamily: 'var(--font-heading)', color: C.dim,
                            textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '8px',
                          }}>
                            Stack
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {prof.techStack.slice(0, 7).map(tech => {
                              const isMatch = selectedTech.map(t => t.toLowerCase()).includes(tech.toLowerCase())
                              return (
                                <span key={tech} style={{
                                  padding: '3px 10px', borderRadius: '5px',
                                  fontSize: '0.68rem', fontFamily: 'var(--font-heading)',
                                  fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                                  background: isMatch ? C.btnBg : C.hover,
                                  color: isMatch ? C.btnText : C.muted,
                                  border: `1px solid ${isMatch ? C.btnBg : C.border}`,
                                }}>
                                  {tech}
                                </span>
                              )
                            })}
                            {prof.techStack.length > 7 && (
                              <span style={{ fontSize: '0.68rem', color: C.dim, padding: '3px 4px' }}>
                                +{prof.techStack.length - 7}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Top Skills */}
                      {prof.skills.length > 0 && (
                        <div>
                          <div style={{
                            fontSize: '0.62rem', fontFamily: 'var(--font-heading)', color: C.dim,
                            textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '8px',
                          }}>
                            Top Skills
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {prof.skills.slice(0, 4).map(skill => (
                              <span key={skill.id} style={{
                                padding: '3px 10px', borderRadius: '5px',
                                fontSize: '0.68rem', fontFamily: 'var(--font-body)',
                                color: C.muted, border: `1px solid ${C.border}`,
                              }}>
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CTA */}
                      <button
                        onClick={() => router.push(`/profile/${prof.username || prof.user.id}`)}
                        style={{
                          width: '100%', marginTop: 'auto', padding: '12px',
                          background: C.btnBg, color: C.btnText,
                          border: `1px solid ${C.btnBg}`, borderRadius: '8px',
                          fontFamily: 'var(--font-heading)', fontWeight: 800,
                          fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                          cursor: 'pointer', transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#d8d8d8'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = C.btnBg}
                      >
                        View Profile
                      </button>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
