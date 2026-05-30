import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Compass, 
  PlusCircle, 
  Award, 
  Settings, 
  Bell,
  Sparkles,
  Flame,
  Users,
  Trophy,
  Activity,
  Layers,
  ArrowRightLeft
} from 'lucide-react';

export default function Sidebar() {
  const { 
    wallet, 
    userProfile, 
    activeView, 
    streakCount, 
    navigate, 
    triggerDailyQuest,
    triggerSandboxSwitch,
    systemUsers
  } = useApp();

  if (!wallet.connected || !userProfile) {
    return (
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-cyan)' }}>Join Poofie</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          Authenticate your credentials and complete the DNA quiz to establish your persistent Developer DNA.
        </p>
        <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>Identity Capabilities:</span>
          <ul style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>Generate 8 DNA Archetypes</li>
            <li>Connect GitHub & LeetCode</li>
            <li>Join Guilds & Clans</li>
            <li>Find Compatible Teammates</li>
          </ul>
        </div>
      </div>
    );
  }

  // Calculate XP percentage
  const currentXPInLevel = userProfile.poofieXP % 1000;
  const xpPercentage = (currentXPInLevel / 1000) * 100;

  const menuItems = [
    { id: 'feed', name: 'Opportunity Feed', icon: <Home size={18} /> },
    { id: 'explore', name: 'Find My Clan', icon: <Compass size={18} /> },
    { id: 'xp', name: 'Leagues & Badges', icon: <Award size={18} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Live Profile DNA Scorecard */}
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

        {/* DNA Badges */}
        {userProfile.dnaType && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span className="badge-tag badge-human" style={{ background: 'rgba(0, 242, 254, 0.08)', color: 'var(--accent-cyan)', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
              {userProfile.dnaType === 'Maker' && 'Maker ⚒️'}
              {userProfile.dnaType === 'Architect' && 'Architect 🏛️'}
              {userProfile.dnaType === 'Explorer' && 'Explorer 🧭'}
              {userProfile.dnaType === 'Strategist' && 'Strategist ♟️'}
              {userProfile.dnaType === 'Scholar' && 'Scholar 📚'}
              {userProfile.dnaType === 'Alchemist' && 'Alchemist ⚗️'}
              {userProfile.dnaType === 'Catalyst' && 'Catalyst ⚡'}
              {userProfile.dnaType === 'Craftsman' && 'Craftsman 💎'}
            </span>
            {userProfile.secondaryDnaType && (
              <span className="badge-tag" style={{ background: 'rgba(155, 81, 224, 0.08)', color: 'var(--accent-purple)', border: '1px solid rgba(155, 81, 224, 0.2)' }}>
                {userProfile.secondaryDnaType === 'Maker' && 'Maker ⚒️'}
                {userProfile.secondaryDnaType === 'Architect' && 'Architect 🏛️'}
                {userProfile.secondaryDnaType === 'Explorer' && 'Explorer 🧭'}
                {userProfile.secondaryDnaType === 'Strategist' && 'Strategist ♟️'}
                {userProfile.secondaryDnaType === 'Scholar' && 'Scholar 📚'}
                {userProfile.secondaryDnaType === 'Alchemist' && 'Alchemist ⚗️'}
                {userProfile.secondaryDnaType === 'Catalyst' && 'Catalyst ⚡'}
                {userProfile.secondaryDnaType === 'Craftsman' && 'Craftsman 💎'}
              </span>
            )}
          </div>
        )}

        {/* Specialization and Clan Info */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          padding: '12px',
          border: '1px solid var(--border-light)',
          fontSize: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase' }}>Specialization</span>
            <strong style={{ color: 'var(--text-main)' }}>{userProfile.specialization || 'Onboarding Incomplete'}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase' }}>Active Clan</span>
            <strong style={{ color: 'var(--accent-cyan)' }}>{userProfile.clan || 'None Joined'}</strong>
          </div>
        </div>

        {/* Gamification progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.75rem', fontWeight: 600 }}>
            <span>Level {userProfile.level}</span>
            <span style={{ color: 'var(--text-dim)' }}>{currentXPInLevel} / 1000 XP</span>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', marginTop: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: streakCount > 0 ? '#ff4757' : 'var(--text-dim)' }}>
              <Flame size={14} fill={streakCount > 0 ? '#ff4757' : 'none'} />
              <span>{streakCount} Day Streak</span>
            </div>
            {userProfile.leagues?.github && (
              <span style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: 700 }}>
                {userProfile.leagues.github} League
              </span>
            )}
          </div>
        </div>

        {/* Daily checkin quest */}
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
            </button>
          );
        })}
      </div>

      {/* Collaborator Sandbox Hub Switcher */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h4 style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowRightLeft size={12} style={{ color: 'var(--accent-cyan)' }} />
          Sandbox Persona Hub
        </h4>
        
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          Instantly switch personas to test how other developer DNA profiles interact with leagues, clans, and matching!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Satoshi Option */}
          <button
            onClick={() => triggerSandboxSwitch('satoshi')}
            className="btn-secondary"
            style={{
              padding: '8px 10px',
              fontSize: '0.75rem',
              justifyContent: 'start',
              background: userProfile.username === 'satoshi' ? 'rgba(0, 242, 254, 0.08)' : 'rgba(255,255,255,0.02)',
              borderColor: userProfile.username === 'satoshi' ? 'var(--accent-cyan)' : 'var(--border-light)'
            }}
          >
            <span>💻</span>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <span style={{ fontWeight: 700, display: 'block', color: 'var(--text-main)' }}>Satoshi (You)</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Custom Profile</span>
            </div>
          </button>

          {/* Preset developers */}
          {systemUsers.map(dev => {
            const isActive = userProfile.username === dev.username;
            return (
              <button
                key={dev.username}
                onClick={() => triggerSandboxSwitch(dev.username)}
                className="btn-secondary"
                style={{
                  padding: '8px 10px',
                  fontSize: '0.75rem',
                  justifyContent: 'start',
                  background: isActive ? 'rgba(0, 242, 254, 0.08)' : 'rgba(255,255,255,0.02)',
                  borderColor: isActive ? 'var(--accent-cyan)' : 'var(--border-light)'
                }}
              >
                <span>
                  {dev.dnaType === 'Architect' && '🏛️'}
                  {dev.dnaType === 'Maker' && '⚒️'}
                  {dev.dnaType === 'Explorer' && '🧭'}
                </span>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <span style={{ fontWeight: 700, display: 'block', color: 'var(--text-main)' }}>{dev.name}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>{dev.dnaType} DNA • {dev.clan}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
    </aside>
  );
}
