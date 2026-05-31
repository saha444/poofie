import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  Flame, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  GitFork, 
  Trophy, 
  Code, 
  Terminal,
  Activity,
  Layers
} from 'lucide-react';

export default function XPProgress() {
  const { 
    userProfile, 
    streakCount, 
    triggerDailyQuest, 
    navigate,
    addXP 
  } = useApp();

  const [completedSubtasks, setCompletedSubtasks] = useState({});

  if (!userProfile) return null;

  const currentLevelXP = userProfile.poofieXP % 1000;
  const xpPercentage = (currentLevelXP / 1000) * 100;
  const xpToNextLevel = 1000 - currentLevelXP;

  // Leagues Data Structure
  const leagues = [
    {
      id: 'github',
      name: 'GitHub League 💻',
      currentRank: userProfile.leagues?.github || 'Bronze',
      icon: <GitFork size={20} style={{ color: 'var(--accent-cyan)' }} />,
      desc: 'Tracks sandbox code commits, streaks, and repository indexes.',
      ranks: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Legend'],
      subtasks: [
        { id: 'gh-1', text: 'Connect verified Github profile', xp: 100, isCompleted: userProfile.connectedAccounts?.github?.connected },
        { id: 'gh-2', text: 'Achieve a 3-day active contribution streak', xp: 150, isCompleted: streakCount >= 3 }
      ]
    },
    {
      id: 'hackathon',
      name: 'Hackathon League',
      currentRank: userProfile.leagues?.hackathon || 'Bronze',
      icon: <Trophy size={20} style={{ color: '#f59e0b' }} />,
      desc: 'Tracks mock team registrations, finalist listings, and podium podium awards.',
      ranks: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Legend'],
      subtasks: [
        { id: 'hk-1', text: 'Apply as teammate to an active request', xp: 80, isCompleted: streakCount > 0 },
        { id: 'hk-2', text: 'Link Devfolio hackathon tracker profile', xp: 120, isCompleted: userProfile.connectedAccounts?.devfolio?.connected }
      ]
    },
    {
      id: 'opensource',
      name: 'Open Source League',
      currentRank: userProfile.leagues?.openSource || 'Bronze',
      icon: <Code size={20} style={{ color: 'var(--accent-purple)' }} />,
      desc: 'Tracks mock pull-request merges, code evaluations, and public tooling contributions.',
      ranks: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Legend'],
      subtasks: [
        { id: 'os-1', text: 'Join clan guild discussion thread', xp: 100, isCompleted: userProfile.joinedClans?.length > 0 },
        { id: 'os-2', text: 'Broadcast first project showcase in feed', xp: 150, isCompleted: false }
      ]
    }
  ];

  // Unlocked Modifiers (Personality Badges)
  const badgesList = [
    { name: 'Night Owl', desc: 'Awarded to developers who submit commits or code ratings between 12:00 AM and 5:00 AM.', unlocked: true },
    { name: 'Bug Hunter', desc: 'Awarded for deconstructing and reviewing EVM vault circuits or resolving compiler audits.', unlocked: userProfile.level >= 2 },
    { name: 'Weekend Warrior', desc: 'Awarded for keeping streaks and check-ins active over Saturday & Sunday.', unlocked: streakCount >= 3 },
    { name: 'Research Enthusiast', desc: 'Awarded for exploring cryptography and zero-knowledge reputation architectures.', unlocked: userProfile.dnaType === 'Scholar' || userProfile.secondaryDnaType === 'Scholar' },
    { name: 'Catalyst Glue', desc: 'Awarded for active mentorship and coordinating multiple clan collaborations.', unlocked: userProfile.dnaType === 'Catalyst' },
    { name: 'Craftsman Precision', desc: 'Awarded to pixel-perfect visual programmers polishing UI overlays.', unlocked: userProfile.secondaryDnaType === 'Craftsman' }
  ];

  const handleCompleteSubtask = (taskId, xpReward) => {
    setCompletedSubtasks(prev => ({ ...prev, [taskId]: true }));
    addXP(xpReward, 'Completed League progression milestone');
  };

  return (
    <div className="animate-slide-up" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
      
      {/* LEFT COLUMN: Leagues progressions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Core level status */}
        <div className="glass-panel" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
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
                <span>Leagues & Progression System</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', margin: '4px 0 12px 0' }}>Your Attested Experience</h2>
              
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

        {/* Leagues visual lists */}
        {leagues.map(league => (
          <div key={league.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* League Title & current Rank */}
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {league.icon}
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700, margin: 0 }}>{league.name}</h3>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>ACTIVE RANK:</span>
                <span style={{
                  fontSize: '0.75rem',
                  background: 'rgba(245, 158, 11, 0.08)',
                  color: '#f59e0b',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontWeight: 800,
                  textTransform: 'uppercase'
                }}>
                  {league.currentRank} Tier
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              {league.desc}
            </p>

            {/* League progression visualization mapping */}
            <div style={{
              display: 'flex',
              justifyContent: 'between',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '8px',
              padding: '12px 16px',
              border: '1px solid var(--border-light)',
              overflowX: 'auto',
              gap: '12px'
            }}>
              {league.ranks.map((rank, idx) => {
                const isPassed = idx <= league.ranks.indexOf(league.currentRank);
                return (
                  <div key={rank} style={{ display: 'flex', alignItems: 'center', gap: '8px', shrink: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isPassed ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)',
                        color: isPassed ? '#000' : 'var(--text-dim)',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {idx + 1}
                      </div>
                      <span style={{ fontSize: '0.6rem', color: isPassed ? 'var(--text-main)' : 'var(--text-dim)', fontWeight: isPassed ? 700 : 400 }}>{rank}</span>
                    </div>
                    {idx < league.ranks.length - 1 && (
                      <div style={{ width: '20px', height: '2px', background: isPassed ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)' }}></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Subtasks checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>STANDINGS CHALLENGES TO LEVEL UP</span>
              
              {league.subtasks.map(task => {
                const isDone = task.isCompleted || completedSubtasks[task.id];
                return (
                  <div 
                    key={task.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'between',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      gap: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem' }}>
                      {isDone ? (
                        <CheckCircle size={16} style={{ color: '#10b981' }} />
                      ) : (
                        <Clock size={16} style={{ color: 'var(--text-dim)' }} />
                      )}
                      <span style={{ color: isDone ? 'var(--text-muted)' : 'var(--text-main)' }}>{task.text}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>+{task.xp} XP</span>
                      {!isDone && (
                        <button 
                          onClick={() => handleCompleteSubtask(task.id, task.xp)}
                          className="btn-secondary" 
                          style={{ padding: '4px 10px', fontSize: '0.65rem' }}
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        ))}

      </div>

      {/* RIGHT COLUMN: Streak and unlocked badges */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Streak Meter */}
        <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(255, 71, 87, 0.05) 0%, rgba(7,7,10,0.5) 100%)', border: '1px solid rgba(255, 71, 87, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Flame size={20} fill="#ff4757" stroke="#ff4757" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ff4757' }}>Active Streak Meter</h3>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '12px' }}>
            Perform sandbox activities, collaborate, and check-in daily. Keeping streaks active unlocks modifier badges!
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

        {/* Unlocked personality modifiers */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            Personality Modifiers
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {badgesList.map((badge, idx) => (
              <div 
                key={idx}
                style={{
                  background: badge.unlocked ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0,0,0,0.4)',
                  border: badge.unlocked ? '1px solid var(--border-light)' : '1px dashed rgba(255,255,255,0.02)',
                  borderRadius: '10px',
                  padding: '12px',
                  opacity: badge.unlocked ? 1 : 0.4,
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>{badge.name}</strong>
                  <span style={{ fontSize: '0.55rem', color: badge.unlocked ? 'var(--accent-cyan)' : 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {badge.unlocked ? 'Attested' : 'Locked'}
                  </span>
                </div>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.3' }}>
                  {badge.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
