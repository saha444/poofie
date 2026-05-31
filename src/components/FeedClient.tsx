'use client'

import { signOut } from 'next-auth/react'
import { useState } from 'react'
import { Star, MessageSquare } from 'lucide-react'

type Post = {
  id: string
  content: string
  title?: string | null
  category: string
  createdAt: Date
  user: {
    id: string
    name?: string | null
    image?: string | null
    profile?: { username?: string } | null
    dnaResult?: { primaryType: string } | null
  }
  _count: { likes: number; comments: number }
  likes: { id: string }[]
}

const DNA_COLORS: Record<string, string> = {
  Maker: '#f59e0b', Architect: '#3b82f6', Explorer: '#8b5cf6',
  Scholar: '#10b981', Craftsman: '#ec4899', Catalyst: '#f97316',
  Strategist: '#06b6d4', Alchemist: '#a855f7',
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

export default function FeedClient({ initialPosts, currentUser, session }: { initialPosts: Post[], currentUser: any, session: any }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [newPost, setNewPost] = useState('')
  const [posting, setPosting] = useState(false)
  const [activeFilter, setActiveFilter] = useState('FOR_YOU')

  const dna = currentUser?.dnaResult
  const profile = currentUser?.profile

  const handlePost = async () => {
    if (!newPost.trim()) return
    setPosting(true)
    try {
      const res = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPost, category: 'COMMUNITY' }),
      })
      const data = await res.json()
      if (res.ok) {
        setPosts(prev => [{
          ...data.post,
          user: { id: session.user.id, name: session.user.name, image: session.user.image, profile: null },
          _count: { likes: 0, comments: 0 },
          likes: [],
        }, ...prev])
        setNewPost('')
      }
    } finally {
      setPosting(false)
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

  const currentPath = '/feed'

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column' }}>

      {/* ── Top Nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: C.bg,
        borderBottom: `1px solid ${C.border}`,
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
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
              background: C.btnBg, border: `1px solid ${C.btnBg}`, color: C.btnText,
              fontSize: '0.8rem', fontWeight: 700, padding: '9px 22px',
              borderRadius: '8px', cursor: 'pointer',
              fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.12em',
            }}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* ── Body ── */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '300px 1fr 320px',
        gap: '0',
        maxWidth: '100%',
      }}>

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
            {session?.user?.image && (
              <img src={session.user.image} alt=""
                style={{ width: '52px', height: '52px', borderRadius: '50%', border: `2px solid ${C.borderMid}`, flexShrink: 0 }} />
            )}
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem',
                color: C.text, textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {session?.user?.name}
              </div>
              {profile?.username && (
                <div style={{ fontSize: '0.78rem', color: C.dim, marginTop: '2px' }}>
                  @{profile.username}
                </div>
              )}
              {dna?.primaryType && (
                <div style={{
                  marginTop: '6px', display: 'inline-block',
                  padding: '2px 10px', borderRadius: '20px',
                  fontSize: '0.62rem', fontWeight: 700,
                  fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.1em',
                  background: `${DNA_COLORS[dna.primaryType]}22`,
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
                  display: 'block',
                  padding: '13px 16px',
                  borderRadius: '10px',
                  color: isActive ? C.btnText : C.muted,
                  background: isActive ? C.btnBg : 'transparent',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  border: `1px solid transparent`,
                  transition: 'all 0.15s ease',
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

          {/* Quick Stats */}
          {profile && (
            <div style={{
              marginTop: 'auto',
              padding: '20px',
              border: `1px solid ${C.border}`,
              borderRadius: '12px',
              background: C.surface,
            }}>
              <div style={{
                fontSize: '0.65rem', fontFamily: 'var(--font-heading)', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.15em', color: C.dim, marginBottom: '14px',
              }}>
                Your Activity
              </div>
              {[
                ['Posts', posts.filter(p => p.user.id === session?.user?.id).length],
                ['Skills', profile.skills?.length || 0],
                ['GitHub Stars', profile.githubStars || 0],
              ].map(([label, val]) => (
                <div key={label as string} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderBottom: `1px solid ${C.border}`,
                }}>
                  <span style={{ fontSize: '0.82rem', color: C.muted, fontFamily: 'var(--font-body)' }}>{label}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: C.text, fontFamily: 'var(--font-heading)' }}>{val}</span>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* ── Center Feed ── */}
        <main style={{
          padding: '32px 40px',
          borderRight: `1px solid ${C.border}`,
          minHeight: 'calc(100vh - 72px)',
          background: C.bg,
        }}>
          {/* Composer */}
          <div style={{
            border: `1px solid ${C.border}`,
            borderRadius: '14px',
            padding: '28px',
            marginBottom: '28px',
            background: C.surface,
          }}>
            <div style={{
              fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem',
              textTransform: 'uppercase', letterSpacing: '0.1em', color: C.text, marginBottom: '16px',
            }}>
              Share with the community
            </div>
            <textarea
              placeholder="What's on your mind? Share something with the community..."
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              style={{
                width: '100%', minHeight: '120px', resize: 'none',
                background: C.bg, border: `1px solid ${C.border}`,
                color: C.text, borderRadius: '10px',
                padding: '16px', fontSize: '0.95rem',
                fontFamily: 'var(--font-body)', lineHeight: '1.6',
                outline: 'none', marginBottom: '16px',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: C.dim, fontFamily: 'var(--font-body)' }}>
                {newPost.length} / 500
              </span>
              <button
                onClick={handlePost}
                disabled={posting || !newPost.trim()}
                style={{
                  padding: '11px 32px',
                  background: posting || !newPost.trim() ? C.hover : C.btnBg,
                  color: posting || !newPost.trim() ? C.dim : C.btnText,
                  border: `1px solid ${posting || !newPost.trim() ? C.border : C.btnBg}`,
                  borderRadius: '8px',
                  fontFamily: 'var(--font-heading)', fontWeight: 700,
                  fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                  cursor: posting || !newPost.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                }}>
                {posting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>

          {/* Feed Filters */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {['FOR_YOU', 'COMMUNITY', 'OPPORTUNITIES', 'CLANS'].map(f => (
              <button key={f}
                onClick={() => setActiveFilter(f)}
                className={activeFilter !== f ? 'tag-option-unselected' : ''}
                style={{
                  padding: '9px 22px', borderRadius: '8px',
                  fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.12em',
                  background: activeFilter === f ? C.btnBg : 'transparent',
                  border: `1px solid ${activeFilter === f ? C.btnBg : C.border}`,
                  color: activeFilter === f ? C.btnText : C.muted,
                  transition: 'all 0.15s ease',
                }}>
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Posts */}
          {posts.length === 0 ? (
            <div style={{
              border: `1px solid ${C.border}`, borderRadius: '14px',
              padding: '80px 40px', textAlign: 'center', background: C.surface,
            }}>
              <div style={{
                fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem',
                textTransform: 'uppercase', letterSpacing: '0.1em', color: C.text, marginBottom: '10px',
              }}>
                Feed is Empty
              </div>
              <p style={{ color: C.dim, fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>
                Be the first to post something!
              </p>
            </div>
          ) : (
            posts.map(post => {
              const dnaType = post.user.dnaResult?.primaryType
              const dnaColor = dnaType ? DNA_COLORS[dnaType] : undefined

              return (
                <div key={post.id} style={{
                  border: `1px solid ${C.border}`, borderRadius: '14px',
                  padding: '28px', marginBottom: '18px',
                  background: C.surface, transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => {
                    if (dnaColor) (e.currentTarget as HTMLElement).style.borderColor = `${dnaColor}60`
                    else (e.currentTarget as HTMLElement).style.borderColor = C.borderMid
                  }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border }}
                >
                  {/* Author row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                    {post.user.image ? (
                      <img src={post.user.image} alt=""
                        style={{
                          width: '48px', height: '48px', borderRadius: '50%',
                          border: `2px solid ${dnaColor ? `${dnaColor}60` : C.borderMid}`, flexShrink: 0,
                        }} />
                    ) : (
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        border: `2px solid ${C.borderMid}`, background: C.hover,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-heading)', fontWeight: 800, color: C.text, fontSize: '1.1rem', flexShrink: 0,
                      }}>
                        {(post.user.name || '?')[0].toUpperCase()}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.95rem',
                        color: C.text, textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>
                        {post.user.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '3px' }}>
                        {post.user.profile?.username && (
                          <span style={{ fontSize: '0.75rem', color: C.dim }}>
                            @{post.user.profile.username}
                          </span>
                        )}
                        {dnaType && (
                          <span style={{
                            fontSize: '0.65rem', padding: '2px 9px', borderRadius: '10px',
                            background: `${dnaColor}18`, color: dnaColor,
                            border: `1px solid ${dnaColor}50`,
                            fontFamily: 'var(--font-heading)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                          }}>
                            {dnaType}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: C.dim, fontFamily: 'var(--font-body)' }}>
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>

                  {post.title && (
                    <div style={{
                      fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem',
                      color: C.text, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px',
                    }}>
                      {post.title}
                    </div>
                  )}

                  <p style={{ color: C.muted, fontSize: '0.95rem', lineHeight: '1.7', fontFamily: 'var(--font-body)' }}>
                    {post.content}
                  </p>

                  {/* Actions */}
                  <div style={{
                    display: 'flex', gap: '24px', marginTop: '20px',
                    paddingTop: '18px', borderTop: `1px solid ${C.border}`,
                    alignItems: 'center',
                  }}>
                    <span role="button" style={{
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: C.dim, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px',
                      fontFamily: 'var(--font-body)', padding: 0, transition: 'color 0.15s',
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = C.text}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = C.dim}
                    >
                      <Star size={16} style={{ strokeWidth: 1.5 }} /> <span>{post._count.likes}</span>
                    </span>
                    <span role="button" style={{
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: C.dim, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px',
                      fontFamily: 'var(--font-body)', padding: 0, transition: 'color 0.15s',
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = C.text}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = C.dim}
                    >
                      <MessageSquare size={16} style={{ strokeWidth: 1.5 }} /> <span>{post._count.comments}</span>
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </main>

        {/* ── Right Panel ── */}
        <aside style={{
          padding: '32px 24px',
          position: 'sticky', top: '72px',
          height: 'calc(100vh - 72px)',
          overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '20px',
          background: C.bg,
        }}>

          {/* DNA Card */}
          <div style={{ border: `1px solid ${C.border}`, borderRadius: '14px', padding: '24px', background: C.surface }}>
            <div style={{
              fontSize: '0.65rem', fontFamily: 'var(--font-heading)', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.15em', color: C.dim, marginBottom: '16px',
            }}>
              Developer DNA
            </div>
            {dna ? (
              <>
                <div style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '2rem',
                  color: DNA_COLORS[dna.primaryType] || C.text,
                  letterSpacing: '0.04em', marginBottom: '4px',
                }}>
                  {dna.primaryType}
                </div>
                <div style={{ fontSize: '0.78rem', color: C.dim, marginBottom: '14px', fontFamily: 'var(--font-body)' }}>
                  Secondary — {dna.secondaryType}
                </div>
                <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: '1.6', fontFamily: 'var(--font-body)' }}>
                  {dna.explanation}
                </p>
              </>
            ) : (
              <div>
                <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: '1.6', marginBottom: '16px', fontFamily: 'var(--font-body)' }}>
                  Discover your developer archetype. Take the DNA quiz to unlock your profile.
                </p>
                <a href="/onboarding/dna" style={{
                  display: 'block', textAlign: 'center',
                  padding: '12px', background: C.btnBg, color: C.btnText,
                  border: `1px solid ${C.btnBg}`, borderRadius: '8px',
                  fontFamily: 'var(--font-heading)', fontWeight: 700,
                  fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em',
                  textDecoration: 'none',
                }}>
                  Take DNA Quiz
                </a>
              </div>
            )}
          </div>

          {/* Verified Skills */}
          {profile?.skills && profile.skills.length > 0 && (
            <div style={{ border: `1px solid ${C.border}`, borderRadius: '14px', padding: '24px', background: C.surface }}>
              <div style={{
                fontSize: '0.65rem', fontFamily: 'var(--font-heading)', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.15em', color: C.dim, marginBottom: '16px',
              }}>
                Verified Skills
              </div>
              {profile.skills.slice(0, 8).map((skill: any) => (
                <div key={skill.id} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.82rem', fontWeight: 700,
                      fontFamily: 'var(--font-heading)', textTransform: 'uppercase',
                      letterSpacing: '0.06em', color: C.text,
                    }}>
                      {skill.name}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: C.dim, fontFamily: 'var(--font-body)' }}>
                      {skill.confidenceScore}%
                    </span>
                  </div>
                  <div style={{ height: '5px', background: C.hover, borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${skill.confidenceScore}%`, height: '100%',
                      background: C.muted, borderRadius: '3px',
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Find Tribe CTA */}
          <div style={{ border: `1px solid ${C.border}`, borderRadius: '14px', padding: '24px', background: C.surface }}>
            <div style={{
              fontSize: '0.65rem', fontFamily: 'var(--font-heading)', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.15em', color: C.dim, marginBottom: '12px',
            }}>
              Find My Tribe
            </div>
            <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: '1.6', marginBottom: '16px', fontFamily: 'var(--font-body)' }}>
              Discover developers who match your tech stack and vibe.
            </p>
            <a href="/tribe" style={{
              display: 'block', textAlign: 'center',
              padding: '12px', background: C.btnBg, color: C.btnText,
              border: `1px solid ${C.btnBg}`, borderRadius: '8px',
              fontFamily: 'var(--font-heading)', fontWeight: 700,
              fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em',
              textDecoration: 'none',
            }}>
              Find My Tribe
            </a>
          </div>
        </aside>
      </div>
    </div>
  )
}
