import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  Flame, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Shield,
  Layers,
  Star,
  Users
} from 'lucide-react';

export default function XPProgress() {
  const { userProfile, streakCount, triggerDailyQuest, navigate } = useApp();

  if (!userProfile) return null;

  const currentLevelXP = userProfile.poofieXP % 1000;
  const xpPercentage = (currentLevelXP / 1000) * 100;
  const xpToNextLevel = 1000 - currentLevelXP;

  // Active Quests list
  const quests = [
    { id: 'checkin', name: 'Simulate Daily Wallet Check-in', xp: 100, completed: streakCount > 0, action: triggerDailyQuest, actionText: 'Check-in Now' },
    { id: 'post', name: 'Publish an On-Chain Project or Article', xp: 150, completed: false, action: () => navigate('create'), actionText: 'Create Post' },
    { id: 'rate', name: 'Submit 1-5 Star Content Attestation', xp: 50, completed: false, action: () => navigate('feed'), actionText: 'Browse Feed' },
    { id: 'reputation', name: 'Review a Coworker across 3 Metrics', xp: 100, completed: false, action: () => navigate('explore'), actionText: 'Discover Users' }
  ];

  // System Achievements Milestones
  const milestones = [
    { name: 'Human First', desc: 'Complete Wallet, Email, and Phone identity link.', badge: '✅', unlocked: userProfile.badges.verifiedHuman },
    { name: 'Professional Tier', desc: 'Successfully satisfy DAO verifier and mint Star Badge.', badge: '⭐', unlocked: userProfile.badges.verifiedProfessional },
    { name: 'Reputation Sentinel', desc: 'Submit a valid professional review with detailed comments.', badge: '🛡️', unlocked: userProfile.poofieXP > 800 },
    { name: 'Content Monarch', desc: 'Publish a work that achieves a 4.5+ star aggregate rating.', badge: '👑', unlocked: userProfile.level >= 3 },
    { name: 'Level 5 Pioneer', desc: 'Climb the reputational ranks to reach XP Level 5.', badge: '🚀', unlocked: userProfile.level >= 5 },
    { name: 'Streak General', desc: 'Build a rating streak of 5 consecutive contributions.', badge: '🔥', unlocked: streakCount >= 5 }
  ];

  return (
    <div className="animate-slide-up" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
      
      {/* Gamification metrics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Core level status */}
        <div className="glass-panel" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
          {/* Visual gradient background overlay */}
          <div style={{
            position: 'absolute',
            right: '-100px',
            top: '-100px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            filter: 'blur(80px)',
            opacity: 0.1,
            pointerEvents: 'none'
          }}></div>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Visual Level Ring */}
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'radial-gradient(#07070a 60%, transparent 61%), conic-gradient(var(--accent-cyan) ' + xpPercentage + '%, rgba(255,255,255,0.05) ' + xpPercentage + '%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
              shrink: 0
            }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase' }}>LEVEL</span>
                <span style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--text-main)', lineHeight: '1' }}>{userProfile.level}</span>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <Sparkles size={14} />
                <span>Gamification Progression</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', margin: '4px 0 12px 0' }}>Your On-Chain Experience</h2>
              
              <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>Total XP Accumulation: <strong>{userProfile.poofieXP} XP</strong></span>
                <span>{xpToNextLevel} XP to Level {userProfile.level + 1}</span>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{
                  width: `${xpPercentage}%`,
                  height: '100%',
                  background: 'var(--accent-gradient)',
                  borderRadius: '5px',
                  transition: 'width 0.4s ease'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quest Panel */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            Daily Gamification Quests
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {quests.map((quest) => (
              <div 
                key={quest.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: quest.completed ? 'rgba(16, 185, 129, 0.02)' : 'rgba(255,255,255,0.01)',
                  border: quest.completed ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid var(--border-light)',
                  padding: '16px',
                  borderRadius: '8px',
                  gap: '16px',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div style={{ shrink: 0 }}>
                  {quest.completed ? (
                    <CheckCircle size={20} style={{ color: '#10b981' }} />
                  ) : (
                    <Clock size={20} style={{ color: 'var(--text-dim)' }} />
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', color: quest.completed ? 'var(--text-muted)' : 'var(--text-main)' }}>
                    {quest.name}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 600, display: 'block', marginTop: '4px' }}>
                    🛡️ +{quest.xp} XP
                  </span>
                </div>

                {!quest.completed && (
                  <button 
                    onClick={quest.action}
                    className="btn-secondary"
                    style={{ padding: '8px 12px', fontSize: '0.75rem', shrink: 0 }}
                  >
                    {quest.actionText}
                    <ChevronRight size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Sidebar: Milestones & Badging */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Rating Streak panel */}
        <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(255, 71, 87, 0.05) 0%, rgba(7,7,10,0.5) 100%)', border: '1px solid rgba(255, 71, 87, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Flame size={20} fill="#ff4757" stroke="#ff4757" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ff4757' }}>Active Streak Meter</h3>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '12px' }}>
            Perform star ratings or submit Professional reviews daily. High streaks grant XP multipliers on all on-chain transactions.
          </p>
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center',
            fontSize: '1.25rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            color: 'var(--text-main)'
          }}>
            {streakCount} Days Active
          </div>
        </div>

        {/* Milestone NFT Grid */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Milestone NFT Collection
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {milestones.map((mil, idx) => (
              <div 
                key={idx}
                style={{
                  background: mil.unlocked ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0,0,0,0.4)',
                  border: mil.unlocked ? '1px solid var(--border-light)' : '1px dashed rgba(255,255,255,0.02)',
                  borderRadius: '10px',
                  padding: '12px',
                  textAlign: 'center',
                  opacity: mil.unlocked ? 1 : 0.4,
                  transition: 'var(--transition-smooth)',
                  boxShadow: mil.unlocked ? '0 4px 10px rgba(0,0,0,0.1)' : 'none'
                }}
                title={mil.desc}
              >
                <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '6px' }}>{mil.badge}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, display: 'block', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mil.name}</span>
                <span style={{ fontSize: '0.55rem', color: mil.unlocked ? 'var(--accent-cyan)' : 'var(--text-dim)', display: 'block', textTransform: 'uppercase', marginTop: '2px' }}>
                  {mil.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
