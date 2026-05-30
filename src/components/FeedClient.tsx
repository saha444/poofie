'use client'

import { signOut } from 'next-auth/react'
import { useState } from 'react'

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

  const DNA_COLORS: Record<string, string> = {
    Maker: '#f59e0b', Architect: '#3b82f6', Explorer: '#8b5cf6',
    Scholar: '#10b981', Craftsman: '#ec4899', Catalyst: '#f97316',
    Strategist: '#06b6d4', Alchemist: '#a855f7',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>
      {/* Top Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(7,7,10,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-light)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Poofie
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {session?.user?.image && <img src={session.user.image} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--accent-cyan)' }} />}
          <button onClick={() => signOut({ callbackUrl: '/' })} style={{ background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-dim)', fontSize: '0.75rem', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer' }}>
            Sign Out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'grid', gridTemplateColumns: '240px 1fr 280px', gap: '24px' }}>
        {/* Left Sidebar */}
        <aside>
          <div className="glass-panel" style={{ padding: '20px', position: 'sticky', top: '84px' }}>
            {/* User identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
              {session?.user?.image && <img src={session.user.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />}
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{session?.user?.name}</div>
                {profile?.username && <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>@{profile.username}</div>}
              </div>
            </div>
            {[
              ['🏠', 'Home', '/feed'],
              ['🧬', 'My DNA', '/profile'],
              ['🔍', 'Find My Tribe', '/tribe'],
              ['🌐', 'Explore', '/explore'],
              ['🚀', 'Opportunities', '/opportunities'],
              ['🏆', 'Leagues', '/leagues'],
              ['🛡️', 'Clans', '/clans'],
              ['⚙️', 'Settings', '/settings'],
            ].map(([icon, label, href]) => (
              <a key={label as string} href={href as string} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 8px', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.15s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-main)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}>
                <span>{icon}</span>{label}
              </a>
            ))}
          </div>
        </aside>

        {/* Center Feed */}
        <main>
          {/* Post Composer */}
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <textarea
              placeholder="Share something with the community..."
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              className="input-field"
              style={{ width: '100%', minHeight: '80px', resize: 'none', marginBottom: '12px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handlePost} disabled={posting || !newPost.trim()} className="btn-primary" style={{ padding: '8px 20px' }}>
                {posting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>

          {/* Feed Filters */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {['FOR_YOU', 'COMMUNITY', 'OPPORTUNITIES', 'CLANS'].map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} style={{
                padding: '6px 16px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                background: activeFilter === f ? 'rgba(0,242,254,0.12)' : 'transparent',
                border: activeFilter === f ? '1px solid var(--accent-cyan)' : '1px solid var(--border-light)',
                color: activeFilter === f ? 'var(--accent-cyan)' : 'var(--text-dim)',
              }}>
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Posts */}
          {posts.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🌱</div>
              <div>The feed is empty — be the first to post!</div>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="glass-panel" style={{ padding: '20px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  {post.user.image && <img src={post.user.image} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{post.user.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {post.user.profile?.username && <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>@{post.user.profile.username}</span>}
                      {post.user.dnaResult?.primaryType && (
                        <span style={{ fontSize: '0.65rem', padding: '1px 8px', borderRadius: '10px', background: `${DNA_COLORS[post.user.dnaResult.primaryType]}20`, color: DNA_COLORS[post.user.dnaResult.primaryType] || 'var(--accent-cyan)', fontWeight: 700 }}>
                          {post.user.dnaResult.primaryType}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {post.title && <div style={{ fontWeight: 700, marginBottom: '6px' }}>{post.title}</div>}
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{post.content}</p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', cursor: 'pointer' }}>♥ {post._count.likes}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', cursor: 'pointer' }}>💬 {post._count.comments}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: 'auto' }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </main>

        {/* Right Dashboard */}
        <aside>
          <div style={{ position: 'sticky', top: '84px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* DNA Card */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Developer DNA</div>
              {dna ? (
                <>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {dna.primaryType}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>Secondary: {dna.secondaryType}</div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.5', marginTop: '10px' }}>{dna.explanation}</p>
                </>
              ) : (
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Take the DNA quiz to discover your developer archetype.</p>
                  <a href="/onboarding/dna" style={{ display: 'block', textAlign: 'center', padding: '8px', background: 'rgba(0,242,254,0.08)', border: '1px solid rgba(0,242,254,0.2)', borderRadius: '8px', color: 'var(--accent-cyan)', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
                    Take DNA Quiz →
                  </a>
                </div>
              )}
            </div>

            {/* Skills from GitHub */}
            {profile?.skills && profile.skills.length > 0 && (
              <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Verified Skills</div>
                {profile.skills.slice(0, 6).map((skill: any) => (
                  <div key={skill.id} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{skill.name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>{skill.confidenceScore}%</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${skill.confidenceScore}%`, height: '100%', background: 'var(--accent-gradient)' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
