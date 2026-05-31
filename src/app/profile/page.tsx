'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { 
  Sparkles,
  GitFork, 
  Briefcase, 
  Award, 
  Layers, 
  Cpu, 
  Globe, 
  Check, 
  ArrowLeft 
} from 'lucide-react'

type RadarDim = {
  score: number
  justification: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hoveredVertex, setHoveredVertex] = useState<{ name: string; score: number; justification: string } | null>(null)
  const [preferredInput, setPreferredInput] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/profile/me')
        .then(r => r.json())
        .then(data => {
          if (data?.user) {
            setProfile(data.user)
          }
          setLoading(false)
        })
    }
  }, [status])

  const handleAddPreferredTech = async () => {
    if (!preferredInput.trim()) return
    const current = profile?.profile?.preferredTech || []
    if (current.includes(preferredInput.trim())) return

    const updated = [...current, preferredInput.trim()]
    try {
      const res = await fetch('/api/profile/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests: updated }), // saves under profile interests / tech preferences
      })
      if (res.ok) {
        setProfile((prev: any) => ({
          ...prev,
          profile: { ...prev.profile, preferredTech: updated }
        }))
        setPreferredInput('')
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#07070a' }}>
        <div style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem' }}>Analyzing DNA profiles...</div>
      </div>
    )
  }

  const userDna = profile?.dnaResult
  const userProfile = profile?.profile
  const radarData: Record<string, RadarDim> = userProfile?.radarScores || {}
  const domainsHighlight: string[] = userProfile?.domainsHighlight || []
  const linkedinExpArray = (userProfile?.linkedinExperience as any[]) || []

  // Default metrics values for Radar chart coordinates
  const dimensions = ['Maker', 'Architect', 'Explorer', 'Strategist', 'Scholar', 'Alchemist', 'Catalyst', 'Craftsman']
  const center = 150
  const maxVal = 100
  const rScale = 100 // max radius

  // Calculate coordinates for Radar SVG polygon
  const getRadarCoordinates = () => {
    return dimensions.map((dim, i) => {
      const value = radarData[dim]?.score || 45
      const angle = (Math.PI * 2 / 8) * i - Math.PI / 2
      const r = (value / maxVal) * rScale
      const x = center + r * Math.cos(angle)
      const y = center + r * Math.sin(angle)
      return { x, y, dim, value }
    })
  }

  const coords = getRadarCoordinates()
  const pointsString = coords.map(c => `${c.x},${c.y}`).join(' ')

  const getPersonalizedExplanation = (dim: string, score: number) => {
    const ghRepos = userProfile?.githubRepos || 0
    const ghStars = userProfile?.githubStars || 0
    const ghOrgsCount = userProfile?.githubOrgs?.length || 0
    const ltSolved = userProfile?.leetcodeSolved || 0
    const ltRating = userProfile?.leetcodeRating || 1600
    const dfHacks = userProfile?.devfolioHackathons || 0
    const techStack = userProfile?.techStack || []
    const expCount = linkedinExpArray.length
    const yearsExp = (expCount * 1.5).toFixed(1)

    const templates: Record<string, string> = {
      Maker: `Your score of ${score}% in Maker DNA is driven by your participation in ${dfHacks} hackathons and ${ghRepos} active public repositories. This attests to an exceptionally strong "ship-first" builder mentality. In practice, you excel at turning ideas into working prototypes under high-pressure constraints rather than getting bogged down in endless spec definitions.`,
      
      Architect: `Scored at ${score}%, this attests to your verified SDE work history of ${expCount} roles (representing ~${yearsExp} years of verified experience) and ${ghStars} stars on GitHub. This signifies a strong capacity for designing scalable, maintainable software systems with clean interfaces. It means you are highly capable of mapping complex system dependencies and preventing technical debt.`,
      
      Explorer: `Your ${score}% Explorer score is derived from your active multi-language tech stack (${techStack.slice(0, 4).join(', ') || 'TypeScript, Solidity, Python'}) and engagement in ${ghOrgsCount} developer organizations. This indicates a high adaptability to emerging technologies and protocols. You are the builder who investigates the frontiers and introduces new tools to the team.`,
      
      Strategist: `Scoring ${score}% in Strategy reflects your analytical quiz responses and ${expCount} career terms. This demonstrates a structured approach to software development, balancing technical execution with business outcomes. You know when to prioritize speed and when to invest in structural stability.`,
      
      Scholar: `Your Scholar DNA score of ${score}% is supported by ${ltSolved} verified LeetCode solved problems and your academic background. This represents rigorous computer science fundamentals, deep algorithmic capability, and a dedication to understanding the underlying mechanics of execution rather than just copying code.`,
      
      Alchemist: `At ${score}%, your Alchemist DNA is driven by your highly integrated cross-platform profile attestation. This signifies a rare hybrid builder who synthesizes algorithms, rapid prototyping, and real-world SDE practices. You excel at finding creative solutions at the intersection of different tech domains.`,
      
      Catalyst: `Your Catalyst score of ${score}% is attributed to your active membership in ${ghOrgsCount} organizations and collaborative open-source contributions. This marks you as a multiplier on engineering teams. You don't just write code; you unblock colleagues, drive community discussion, and elevate overall team performance.`,
      
      Craftsman: `At ${score}%, your Craftsman score is derived from your high attention to SDE workflow descriptions and refactoring choices. This means code quality for you is a moral imperative. You thrive on code readability, thorough documentation, and clean architecture that any new engineer can easily pick up.`,
    }

    return templates[dim] || `Verified ${dim} score of ${score}% based on your developer profile and quiz attestation.`
  }

  const DNA_COLORS: Record<string, string> = {
    Maker: '#f59e0b', Architect: '#3b82f6', Explorer: '#8b5cf6',
    Scholar: '#10b981', Craftsman: '#ec4899', Catalyst: '#f97316',
    Strategist: '#06b6d4', Alchemist: '#a855f7',
  }

  const primaryColor = DNA_COLORS[userDna?.primaryType || 'Maker'] || 'var(--accent-cyan)'

  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: '#fff', fontFamily: 'var(--font-geist-sans)' }}>
      
      {/* Header bar */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(7,7,10,0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <button onClick={() => router.push('/feed')} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem' }}>
          <ArrowLeft size={16} /> Return to Feed
        </button>
        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
          VERIFIED IDENTITY PORTFOLIO
        </span>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Row 1: Header Attestation Banner */}
        <section className="glass-panel" style={{ padding: '36px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-10%', top: '-20%', width: '300px', height: '300px', background: `${primaryColor}12`, filter: 'blur(90px)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
            {/* Avatar */}
            {session?.user?.image && (
              <div style={{
                width: '96px', height: '96px', borderRadius: '50%',
                overflow: 'hidden', flexShrink: 0,
                border: `3px solid ${primaryColor}`,
                boxShadow: `0 0 24px ${primaryColor}30`,
              }}>
                <img src={session.user.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            {/* Name + DNA badges */}
            <div>
              <h1 style={{
                fontSize: '2.2rem', fontWeight: 900,
                fontFamily: 'var(--font-heading)',
                color: '#f0f0f0',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                lineHeight: 1.1, marginBottom: '12px',
              }}>
                {session?.user?.name}
              </h1>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{
                  background: `${primaryColor}18`, color: primaryColor,
                  border: `1px solid ${primaryColor}50`,
                  padding: '5px 14px', borderRadius: '20px',
                  fontSize: '0.78rem', fontWeight: 700,
                  fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  {userDna?.primaryType || 'Maker'} Archetype
                </span>
                {userDna?.secondaryType && (
                  <span style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#888888',
                    padding: '5px 14px', borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.08em',
                  }}>
                    Secondary: {userDna.secondaryType}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Row 2: Radar Chart & Metrics Overlay Grid */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px' }}>
          
          {/* Left Column: Interactive Radar Graph & Hover Details */}
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, alignSelf: 'flex-start', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} style={{ color: 'var(--accent-cyan)' }} /> Interactive Attestation Radar Map
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.78rem', alignSelf: 'flex-start', marginBottom: '24px' }}>
              Hover over the vertex nodes to view verified system justification metrics for each DNA dimension.
            </p>

            <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
              
              {/* SVG Radar Map */}
              <div style={{ position: 'relative', width: '300px', height: '300px' }}>
                <svg width="300" height="300">
                  {/* Grid Lines circles */}
                  {[0.2, 0.4, 0.6, 0.8, 1].map((scale, idx) => (
                    <polygon
                      key={idx}
                      points={dimensions.map((_, i) => {
                        const angle = (Math.PI * 2 / 8) * i - Math.PI / 2
                        const r = scale * rScale
                        const x = center + r * Math.cos(angle)
                        const y = center + r * Math.sin(angle)
                        return `${x},${y}`
                      }).join(' ')}
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Axis lines */}
                  {dimensions.map((_, i) => {
                    const angle = (Math.PI * 2 / 8) * i - Math.PI / 2
                    const x = center + rScale * Math.cos(angle)
                    const y = center + rScale * Math.sin(angle)
                    return (
                      <line
                        key={i}
                        x1={center}
                        y1={center}
                        x2={x}
                        y2={y}
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="1"
                      />
                    )
                  })}

                  {/* Filled Radar Area */}
                  <polygon
                    points={pointsString}
                    fill={`${primaryColor}18`}
                    stroke={primaryColor}
                    strokeWidth="2.5"
                  />

                  {/* Interactive Nodes vertices */}
                  {coords.map((c, i) => (
                    <circle
                      key={i}
                      cx={c.x}
                      cy={c.y}
                      r="6"
                      fill={hoveredVertex?.name === c.dim ? '#fff' : primaryColor}
                      stroke={primaryColor}
                      strokeWidth="2"
                      style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                      onMouseEnter={() => setHoveredVertex({
                        name: c.dim,
                        score: c.value,
                        justification: getPersonalizedExplanation(c.dim, c.value)
                      })}
                    />
                  ))}

                  {/* Dimension text labels */}
                  {dimensions.map((dim, i) => {
                    const angle = (Math.PI * 2 / 8) * i - Math.PI / 2
                    const r = rScale + 24
                    const x = center + r * Math.cos(angle) - 20
                    const y = center + r * Math.sin(angle) + 4
                    return (
                      <text
                        key={dim}
                        x={x}
                        y={y}
                        fill="rgba(255,255,255,0.4)"
                        fontSize="9.5"
                        fontWeight="700"
                        fontFamily="monospace"
                      >
                        {dim}
                      </text>
                    )
                  })}
                </svg>
              </div>

              {/* Hover dynamic justification panel */}
              <div style={{ flex: 1, minWidth: '220px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '20px', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {hoveredVertex ? (
                  <div>
                    <span style={{ fontSize: '0.68rem', color: primaryColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Dimension Attestation
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0' }}>
                      {hoveredVertex.name}: <span style={{ color: primaryColor }}>{hoveredVertex.score}%</span>
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.5', marginTop: '10px' }}>
                      {hoveredVertex.justification}
                    </p>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🧬</div>
                    <p style={{ fontSize: '0.78rem' }}>Hover over any vertex point of the radar map to view mathematical attestation metrics.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Telemetry Metrics Grid Section */}
            <div style={{ width: '100%', marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)' }}>
                <Sparkles size={16} /> Attestation Source Telemetry Mappings
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', width: '100%' }}>
                {dimensions.map(dim => {
                  const score = radarData[dim]?.score || 45
                  const justification = getPersonalizedExplanation(dim, score)
                  const color = DNA_COLORS[dim] || 'var(--accent-cyan)'
                  
                  // Mapped platforms helper
                  const platforms: Record<string, string[]> = {
                    Maker: ['GitHub', 'Devfolio', 'Quiz'],
                    Architect: ['GitHub', 'LinkedIn', 'Quiz'],
                    Explorer: ['GitHub', 'Quiz'],
                    Scholar: ['LeetCode', 'LinkedIn', 'Quiz'],
                    Strategist: ['LinkedIn', 'LeetCode', 'Quiz'],
                    Alchemist: ['Integrations', 'Quiz'],
                    Catalyst: ['GitHub', 'Quiz'],
                    Craftsman: ['LinkedIn', 'GitHub', 'Quiz']
                  }
                  
                  const sources = platforms[dim] || ['Quiz']

                  return (
                    <div key={dim} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', transition: 'border-color 0.2s' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                          <strong style={{ fontSize: '0.82rem', fontWeight: 700 }}>{dim}</strong>
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color }}>{score}%</span>
                      </div>
                      
                      {/* Bar indicator */}
                      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${score}%`, height: '100%', background: color }} />
                      </div>

                      <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', lineHeight: '1.4', margin: '4px 0 0 0' }}>
                        {justification}
                      </p>

                      {/* Source Pills */}
                      <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                        {sources.map(src => (
                          <span key={src} style={{ fontSize: '0.62rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-dim)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
                            {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Tech Stack, Domains & Algorithmic Index Showcase */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Tech Stack Preference Bar Chart */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={16} style={{ color: 'var(--accent-purple)' }} /> Preferred vs Active Tech
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Active Stack */}
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Active Stack (GitHub Telemetry)
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {userProfile?.techStack?.slice(0, 5).map((t: string) => (
                      <span key={t} style={{ fontSize: '0.72rem', background: 'rgba(0,242,254,0.06)', border: '1px solid rgba(0,242,254,0.15)', color: 'var(--accent-cyan)', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                        {t}
                      </span>
                    )) || <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>No active stack.</span>}
                  </div>
                </div>

                {/* Preferred Stack */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Preferred Tech Stack
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                    {userProfile?.preferredTech?.map((t: string) => (
                      <span key={t} style={{ fontSize: '0.72rem', background: 'rgba(155,81,224,0.06)', border: '1px solid rgba(155,81,224,0.15)', color: 'var(--accent-purple)', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                        {t}
                      </span>
                    )) || <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Add preferred languages below!</span>}
                  </div>

                  {/* Add tech */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="text"
                      placeholder="Add preferred tech"
                      value={preferredInput}
                      onChange={e => setPreferredInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddPreferredTech()}
                      className="input-field"
                      style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                    />
                    <button onClick={handleAddPreferredTech} className="btn-secondary" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Domains Highlights */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={16} style={{ color: '#f59e0b' }} /> Verified Developer Domains
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {domainsHighlight.map(domain => (
                  <div key={domain} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981' }}>✓</span> {domain}
                  </div>
                ))}
              </div>
            </div>

            {/* LeetCode stats / Algorithmic Index */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={16} style={{ color: '#10b981' }} /> Algorithmic Index
              </h3>
              {userProfile?.leetcodeSolved ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Total Solved:</span>
                    <strong>{userProfile.leetcodeSolved} problems</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Contest Rating:</span>
                    <strong>{userProfile.leetcodeRating || '1600'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Badges Unlocked:</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>{userProfile.leetcodeBadges?.slice(0,2).join(', ') || 'Guardian'}</span>
                  </div>
                </div>
              ) : (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>No LeetCode telemetry linked.</span>
              )}
            </div>
          </div>

        </section>

        {/* Row 3: Professional Work History, Communities, and Organizations History */}
        <section className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={18} style={{ color: 'var(--accent-purple)' }} /> Verified Work / Communities / Orgs History
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            
            {/* Left Column: Work Experience Timeline */}
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-purple)' }}>
                <Briefcase size={16} /> Work Experience
              </h3>

              {linkedinExpArray.length === 0 ? (
                <div style={{ padding: '20px 0', color: 'var(--text-dim)' }}>
                  <span>no experience details linked</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {linkedinExpArray.map((role, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                      {/* timeline node */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-purple)', border: '2px solid #fff' }} />
                        {idx < linkedinExpArray.length - 1 && (
                          <div style={{ flex: 1, width: '2px', background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
                        )}
                      </div>
                      <div style={{ flex: 1, paddingBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                          <div>
                            <strong style={{ fontSize: '0.88rem', color: '#fff' }}>{role.title}</strong>
                            <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>{role.company}</span>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{role.period}</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.5', marginTop: '6px' }}>{role.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: GitHub Organizations / Communities */}
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)' }}>
                <Award size={16} /> Communities & Organizations
              </h3>
              
              {userProfile?.githubOrgs && userProfile.githubOrgs.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {userProfile.githubOrgs.map((org: string) => (
                    <span key={org} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
                      @{org}
                    </span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>No public GitHub organization links found.</span>
              )}
            </div>

          </div>
        </section>

      </main>
    </div>
  )
}
