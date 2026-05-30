import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Compass, 
  PlusCircle, 
  ShieldCheck, 
  Award, 
  Settings, 
  Bell,
  Sparkles,
  Flame,
  CheckCircle2,
  Star
} from 'lucide-react';
import CollaboratorHub from './CollaboratorHub';

export default function Sidebar() {
  const { 
    wallet, 
    userProfile, 
    activeView, 
    streakCount, 
    lowScoreRestricted,
    SCORE_THRESHOLD,
    navigate, 
    triggerDailyQuest 
  } = useApp();

  if (!wallet.connected || !userProfile) {
    return (
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-cyan)' }}>Join Poofie</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          Connect your Ethereum wallet to establish an immutable, decentralized reputation profile on-chain.
        </p>
        <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>Ecosystem Benefits:</span>
          <ul style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>Earn Verified Human Badge</li>
            <li>Receive Star Ratings on Work</li>
            <li>Request Peer Endorsements</li>
            <li>Build on-chain Poofie Score</li>
          </ul>
        </div>
      </div>
    );
  }

  // Calculate XP percentage
  const nextLevelXP = 1000;
  const currentXPInLevel = userProfile.poofieXP % 1000;
  const xpPercentage = (currentXPInLevel / nextLevelXP) * 100;

  const menuItems = [
    { id: 'feed', name: 'Home Feed', icon: <Home size={18} /> },
    { id: 'explore', name: 'Explore & Search', icon: <Compass size={18} /> },
    { id: 'create', name: 'Create Post', icon: <PlusCircle size={18} /> },
    { id: 'verify-professional', name: 'Get Verified', icon: <ShieldCheck size={18} /> },
    { id: 'xp', name: 'Gamification & XP', icon: <Award size={18} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Live Profile Reputation Scorecard */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* User Quick Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid var(--accent-cyan)',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <img src={userProfile.avatar} alt={userProfile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{userProfile.name}</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>@{userProfile.username}</span>
          </div>
        </div>

        {/* Verification badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {userProfile.badges.verifiedHuman && (
            <span className="badge-tag badge-human">
              <CheckCircle2 size={12} />
              Human
            </span>
          )}
          {userProfile.badges.verifiedProfessional && (
            <span className="badge-tag badge-professional">
              <Star size={12} fill="currentColor" />
              Professional
            </span>
          )}
        </div>

        {/* Dynamic Poofie Score Widget */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid var(--border-light)',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>
            Poofie Score
          </span>
          <span style={{
            fontSize: '2.5rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            background: 'var(--accent-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'block',
            lineHeight: '1.2'
          }}>
            {userProfile.poofieScore}
          </span>
          
          {/* Content & Reputation score breakdown */}
          <div style={{ display: 'flex', justifyContent: 'around', borderTop: '1px solid var(--border-light)', marginTop: '8px', paddingTop: '8px', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Content</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{userProfile.contentScore}</span>
            </div>
            <div style={{ width: '1px', background: 'var(--border-light)' }}></div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Reputation</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-purple)' }}>{userProfile.reputationScore}</span>
            </div>
          </div>
        </div>

        {/* Gamification progress indicators */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.75rem', fontWeight: 600 }}>
            <span>Level {userProfile.level}</span>
            <span style={{ color: 'var(--text-dim)' }}>{currentXPInLevel} / {nextLevelXP} XP</span>
          </div>
          {/* Progress bar */}
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${xpPercentage}%`,
              height: '100%',
              background: 'var(--accent-gradient)',
              borderRadius: '3px',
              transition: 'width 0.4s ease'
            }}></div>
          </div>

          {/* Active streaks */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: streakCount > 0 ? '#ff4757' : 'var(--text-dim)' }}>
              <Flame size={14} fill={streakCount > 0 ? '#ff4757' : 'none'} />
              <span>{streakCount} Rating Streak</span>
            </div>
          </div>
        </div>

        {/* Daily checkin widget */}
        <button 
          onClick={triggerDailyQuest}
          className="btn-secondary"
          style={{
            padding: '8px 12px',
            fontSize: '0.75rem',
            width: '100%',
            justifyContent: 'center',
            background: 'linear-gradient(90deg, rgba(0, 242, 254, 0.05) 0%, rgba(155, 81, 224, 0.05) 100%)',
            border: '1px dashed rgba(0, 242, 254, 0.2)'
          }}
        >
          <Sparkles size={14} style={{ color: 'var(--accent-cyan)' }} />
          Simulate Daily Check-in
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="glass-panel" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: isActive ? 'rgba(0, 242, 254, 0.05)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                fontWeight: 600,
                textAlign: 'left',
                transition: 'var(--transition-smooth)'
              }}
            >
              <span style={{ color: isActive ? 'var(--accent-cyan)' : 'inherit' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.name}</span>
              {item.id === 'verify-professional' && !userProfile.badges.verifiedProfessional && (
                <span style={{ fontSize: '0.65rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px' }}>
                  ⭐ Apply
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic low-score restriction alert */}
      {lowScoreRestricted && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px dashed rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '14px',
          color: '#fca5a5',
          fontSize: '0.75rem',
          lineHeight: '1.4'
        }}>
          <p style={{ fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ⚠️ Privileges Restricted
          </p>
          Voting and rating features are locked. Publish high-quality work to recover your score.
        </div>
      )}

      {/* Interactive Peer Switcher Sandbox */}
      <CollaboratorHub />
    </aside>
  );
}
