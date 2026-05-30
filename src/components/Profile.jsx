import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GitFork, 
  Briefcase, 
  Award, 
  Code, 
  Trophy,
  Activity,
  Layers,
  Sparkles,
  Link,
  CheckCircle,
  FileCode,
  AlertTriangle
} from 'lucide-react';

export default function Profile() {
  const { 
    userProfile, 
    systemUsers, 
    posts, 
    viewParams, 
    navigate 
  } = useApp();

  const targetUsername = viewParams.username || userProfile?.username;

  // Determine user to render
  const allUsers = userProfile ? [userProfile, ...systemUsers] : systemUsers;
  const profileUser = allUsers.find(u => u.username === targetUsername);

  if (!profileUser) {
    return (
      <div className="glass-panel animate-slide-up" style={{ padding: '48px', textAlign: 'center' }}>
        <h3>Developer Profile Not Found</h3>
        <button onClick={() => navigate('feed')} className="btn-primary" style={{ marginTop: '16px' }}>
          Return to Opportunity Feed
        </button>
      </div>
    );
  }

  // Gather user-specific data from central databases
  const userPosts = posts.filter(post => post.creatorUsername === profileUser.username);

  // Generate dynamic AI Resume description based on traits
  const generateAIDesc = () => {
    if (profileUser.username === 'alice_v') {
      return "Alice Vance is a brilliant Architect with deep Scholar roots. She excels at designing complex on-chain systems, auditing smart contracts, and exploring mathematical trust architectures.";
    } else if (profileUser.username === 'marcus_design') {
      return "Marcus K. is a dedicated Maker obsessed with beautiful Craftsman aesthetics. He writes clean TypeScript dapps, builds glowing translucent components, and moves from concepts to production rapidly.";
    } else if (profileUser.username === 'elena_dev') {
      return "Elena Rostova is an Explorer at heart with solid Scholar attributes. She loves deconstructing system libraries, auditing open-source protocol repos, and tinkering with zero-knowledge compilers.";
    }
    
    // Satoshi Nakamoto custom profile
    return `${profileUser.name} is an active ${profileUser.dnaType || 'Maker'} with secondary ${profileUser.secondaryDnaType || 'Explorer'} characteristics. They are highly motivated by building production code, exploring domain boundaries in ${profileUser.domains?.join(' & ') || 'AI & Web Development'}, and contributing to open-source leagues.`;
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      
      {/* Profile Header Block */}
      <div className="glass-panel" style={{ padding: '32px', position: 'relative' }}>
        
        {/* visual background aura */}
        <div style={{
          position: 'absolute',
          left: '5%',
          top: '-20px',
          width: '240px',
          height: '240px',
          background: 'var(--accent-gradient)',
          filter: 'blur(90px)',
          opacity: 0.08,
          pointerEvents: 'none'
        }}></div>

        <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'start', flexWrap: 'wrap', gap: '24px' }}>
          
          {/* Avatar & Core Bio Info */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid var(--accent-cyan)',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <img src={profileUser.avatar} alt={profileUser.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
                  {profileUser.name}
                </h1>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>@{profileUser.username}</span>
              </div>

              {/* DNA Badges */}
              <div style={{ display: 'flex', gap: '8px', margin: '8px 0', flexWrap: 'wrap' }}>
                <span className="badge-tag badge-human" style={{ background: 'rgba(0, 242, 254, 0.08)', color: 'var(--accent-cyan)' }}>
                  {profileUser.dnaType || 'Maker'} DNA Archetype
                </span>
                {profileUser.secondaryDnaType && (
                  <span className="badge-tag" style={{ background: 'rgba(155, 81, 224, 0.08)', color: 'var(--accent-purple)', border: '1px solid rgba(155, 81, 224, 0.2)' }}>
                    Secondary: {profileUser.secondaryDnaType}
                  </span>
                )}
              </div>

              {/* Specialization / Clan details */}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span>💼 {profileUser.specialization || 'Developer'}</span>
                <span>•</span>
                <span>🛡️ Member of {profileUser.clan || 'None'} Clan</span>
                <span>•</span>
                <span>🏅 Level {profileUser.level || 1} Developer</span>
              </div>
            </div>
          </div>

          {/* XP & Leagues summary */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid var(--border-light)',
            textAlign: 'right',
            minWidth: '180px'
          }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Ecosystem XP</span>
            <strong style={{ fontSize: '1.5rem', color: 'var(--accent-cyan)', display: 'block' }}>{profileUser.poofieXP} XP</strong>
            <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '8px', paddingTop: '8px' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>GitHub League: </span>
              <strong style={{ fontSize: '0.75rem', color: '#f59e0b' }}>{profileUser.leagues?.github || 'Bronze'}</strong>
            </div>
          </div>

        </div>

        {/* AI Dynamic Summary Section */}
        <div style={{
          background: 'rgba(0, 242, 254, 0.03)',
          border: '1px solid var(--border-glow)',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            <Sparkles size={14} />
            <span>AI Developer DNA Summary Attestation</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.6', fontStyle: 'italic' }}>
            "{generateAIDesc()}"
          </p>
        </div>

      </div>

      {/* TWO COLUMN GRID: Trait scores vs platform connections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        
        {/* LEFT COLUMN: Trait breakdown, skills, and projects */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Identity Engine Trait Scores */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} style={{ color: 'var(--accent-cyan)' }} />
              Identity Engine — Mapped Trait Scores
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
              {[
                { name: 'Builder / Maker ⚒️', value: profileUser.traitScores?.Builder || 80, color: 'var(--accent-cyan)' },
                { name: 'Explorer 🧭', value: profileUser.traitScores?.Explorer || 70, color: 'var(--accent-cyan)' },
                { name: 'Architect 🏛️', value: profileUser.traitScores?.Architect || 40, color: 'var(--accent-purple)' },
                { name: 'Scholar 📚', value: profileUser.traitScores?.Scholar || 45, color: 'var(--accent-purple)' },
                { name: 'Strategist ♟️', value: profileUser.traitScores?.Strategist || 50, color: 'var(--accent-cyan)' },
                { name: 'Alchemist ⚗️', value: profileUser.traitScores?.Alchemist || 55, color: 'var(--accent-purple)' },
                { name: 'Catalyst ⚡', value: profileUser.traitScores?.Catalyst || 30, color: 'var(--accent-cyan)' },
                { name: 'Craftsman 💎', value: profileUser.traitScores?.Craftsman || 60, color: 'var(--accent-purple)' }
              ].map(trait => (
                <div key={trait.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.75rem', fontWeight: 600 }}>
                    <span>{trait.name}</span>
                    <strong style={{ color: trait.color }}>{trait.value}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${trait.value}%`, height: '100%', background: trait.color, borderRadius: '3px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Technologies */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={18} style={{ color: 'var(--accent-purple)' }} />
              Developer Skills & Attested Stack
            </h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(profileUser.skills || []).map(skill => (
                <span key={skill} style={{
                  fontSize: '0.75rem',
                  background: 'rgba(0, 242, 254, 0.05)',
                  border: '1px solid var(--border-glow)',
                  borderRadius: '16px',
                  padding: '6px 14px',
                  color: 'var(--text-main)',
                  fontWeight: 600
                }}>
                  {skill}
                </span>
              ))}
              {(!profileUser.skills || profileUser.skills.length === 0) && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>No skills attested. Connect external profiles!</span>
              )}
            </div>
          </div>

          {/* Projects Portfolio */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCode size={18} style={{ color: '#f59e0b' }} />
              Projects Portfolio
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(profileUser.projects || []).map(proj => (
                <div key={proj.id} style={{
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-light)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{proj.name}</strong>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                      {proj.tech}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {proj.desc}
                  </p>
                </div>
              ))}
              {(!profileUser.projects || profileUser.projects.length === 0) && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center' }}>No projects showcased yet.</p>
              )}
            </div>
          </div>

          {/* User's Broadcasted Opportunities */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} style={{ color: 'var(--accent-cyan)' }} />
              Broadcasted Opportunities ({userPosts.length})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {userPosts.map(post => (
                <div 
                  key={post.id} 
                  onClick={() => navigate('feed')}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'between',
                    alignItems: 'center',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--text-main)', display: 'block' }}>{post.title}</strong>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Type: {post.type}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>View &rarr;</span>
                </div>
              ))}
              {userPosts.length === 0 && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center' }}>No broadcasted listings yet.</p>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Connected Platforms Status & Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Platforms Attestations */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Link size={14} style={{ color: 'var(--accent-cyan)' }} />
              Connected Platforms
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* GitHub */}
              <div style={{
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '0.75rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong>GitHub Profile</strong>
                  <span style={{ fontSize: '0.65rem', color: profileUser.connectedAccounts?.github?.connected ? '#10b981' : 'var(--text-dim)' }}>
                    {profileUser.connectedAccounts?.github?.connected ? 'Connected' : 'Offline'}
                  </span>
                </div>
                {profileUser.connectedAccounts?.github?.connected ? (
                  <div style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.7rem' }}>
                    <span>Username: @{profileUser.connectedAccounts.github.username}</span>
                    <span>Contributions: {profileUser.connectedAccounts.github.contributions} commits</span>
                    <span>Stars Earned: {profileUser.connectedAccounts.github.stars} ★</span>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>No repository data linked.</span>
                )}
              </div>

              {/* LeetCode */}
              <div style={{
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '0.75rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong>LeetCode</strong>
                  <span style={{ fontSize: '0.65rem', color: profileUser.connectedAccounts?.leetcode?.connected ? '#10b981' : 'var(--text-dim)' }}>
                    {profileUser.connectedAccounts?.leetcode?.connected ? 'Connected' : 'Offline'}
                  </span>
                </div>
                {profileUser.connectedAccounts?.leetcode?.connected ? (
                  <div style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.7rem' }}>
                    <span>Username: @{profileUser.connectedAccounts.leetcode.username}</span>
                    <span>Challenges Solved: {profileUser.connectedAccounts.leetcode.solved}</span>
                    <span>Contest Rating: {profileUser.connectedAccounts.leetcode.contestRating}</span>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>No algorithmic indices linked.</span>
                )}
              </div>

              {/* Devfolio */}
              <div style={{
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '0.75rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong>Devfolio Hackathons</strong>
                  <span style={{ fontSize: '0.65rem', color: profileUser.connectedAccounts?.devfolio?.connected ? '#10b981' : 'var(--text-dim)' }}>
                    {profileUser.connectedAccounts?.devfolio?.connected ? 'Connected' : 'Offline'}
                  </span>
                </div>
                {profileUser.connectedAccounts?.devfolio?.connected ? (
                  <div style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.7rem' }}>
                    <span>Username: @{profileUser.connectedAccounts.devfolio.username}</span>
                    <span>Hackathons Entered: {profileUser.connectedAccounts.devfolio.hackathons}</span>
                    <span>Podium Finishes: {profileUser.connectedAccounts.devfolio.awards} wins</span>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>No hackathon achievements linked.</span>
                )}
              </div>
            </div>
          </div>

          {/* Personality Badges Modifiers */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={14} style={{ color: '#f59e0b' }} />
              Personality Modifiers
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(profileUser.badges || []).map(badge => (
                <div key={badge} style={{
                  padding: '10px',
                  background: 'rgba(245, 158, 11, 0.03)',
                  border: '1px solid rgba(245, 158, 11, 0.1)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-main)'
                }}>
                  {badge}
                </div>
              ))}
              {(!profileUser.badges || profileUser.badges.length === 0) && (
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textAlign: 'center' }}>No modifier badges unlocked yet. Join daily streaks!</span>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
