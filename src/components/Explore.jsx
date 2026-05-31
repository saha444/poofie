import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Compass, 
  Sparkles, 
  Send, 
  Layers, 
  Star,
  Activity,
  Code,
  AlertCircle
} from 'lucide-react';

export default function Explore() {
  const { 
    systemUsers, 
    userProfile, 
    addNotification, 
    addXP 
  } = useApp();

  const [activeTab, setActiveTab] = useState('teammates'); // 'teammates', 'mentors', 'study_partners', 'contributors'
  const [collabSentState, setCollabSentState] = useState({});

  if (!userProfile) return null;

  // --- DEVELOPER MATCHING ENGINE (Simulated) ---
  // Calculates compatibility percentages based on User Profile DNA, domain, and skills.
  const calculateMatches = () => {
    return systemUsers.map(dev => {
      let compatibility = 85; // baseline
      let reason = 'Shared technology interest in developer tooling.';

      // DNA Archetype Synergy
      if (userProfile.dnaType === 'Maker') {
        if (dev.dnaType === 'Architect') {
          compatibility += 13;
          reason = 'Maximum Synergy: Maker DNA (fast prototyping) couples perfectly with Architect DNA (robust structural design).';
        } else if (dev.dnaType === 'Craftsman') {
          compatibility += 9;
          reason = 'Great Synergy: Maker DNA and Craftsman DNA combine functional hacking with pixel-perfect visual polish.';
        } else if (dev.dnaType === 'Maker') {
          compatibility += 7;
          reason = 'Builder Synergy: Both Maker DNA types. Rapid execution and high-frequency code commits.';
        }
      }

      // Domain Alignment
      const sharedDomains = dev.domain.toLowerCase().includes(userProfile.domains[0]?.toLowerCase() || 'webdev');
      if (sharedDomains) {
        compatibility += 5;
      }

      return {
        ...dev,
        compatibility: Math.min(99, compatibility),
        reason
      };
    });
  };

  const matchedDevs = calculateMatches();

  // Filter developers based on tabs
  const getTabDevelopers = () => {
    switch (activeTab) {
      case 'teammates':
        // Show developers with high complementary DNA types
        return matchedDevs.filter(d => d.dnaType === 'Architect' || d.dnaType === 'Maker');
      case 'mentors':
        // Show high level/expert developers
        return matchedDevs.filter(d => d.level >= 4);
      case 'study_partners':
        // Show explorers/scholars
        return matchedDevs.filter(d => d.dnaType === 'Explorer' || d.secondaryDnaType === 'Scholar');
      case 'contributors':
        // General pool
        return matchedDevs;
      default:
        return matchedDevs;
    }
  };

  const developersList = getTabDevelopers();

  const handleSendCollabRequest = (devUsername, devName) => {
    setCollabSentState(prev => ({ ...prev, [devUsername]: true }));
    addXP(100, `Initiated collaboration with @${devUsername}`);
    addNotification(
      'success',
      `Collaboration request sent! Transmitted your Developer DNA Card (Maker / Explorer) to @${devUsername}.`
    );
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Search Header Panel */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
          <Compass size={20} />
          <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0 }}>Find My Clan: Developer Matcher</h2>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '640px', lineHeight: '1.5' }}>
          Our simulated AI matching algorithm compares your primary **Developer DNA**, **Specialization**, and **Focus Domains** against active developers in the network to recommend the ideal peers for your tribe.
        </p>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)', marginTop: '24px', flexWrap: 'wrap' }}>
          {[
            { id: 'teammates', label: 'Highly Compatible Teammates', desc: 'Complementary DNA profiles' },
            { id: 'mentors', label: 'Mentors & Guides', desc: 'High-level industry experts' },
            { id: 'study_partners', label: 'Study & Research Partners', desc: 'Explorer & Scholar types' },
            { id: 'contributors', label: 'Ecosystem Directory', desc: 'All active developers' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              style={{ fontSize: '0.8rem', padding: '10px 16px', display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '2px', borderBottomWidth: '2px' }}
            >
              <span>{tab.label}</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 400 }}>{tab.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Developers Match Results */}
      {developersList.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-dim)' }}>
          No developers found matching this recommendation vector.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {developersList.map(dev => {
            const hasSent = collabSentState[dev.username];
            return (
              <div 
                key={dev.username} 
                className="glass-panel glow-cyan" 
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'relative',
                  border: hasSent ? '1px solid var(--accent-cyan)' : '1px solid var(--border-light)'
                }}
              >
                {/* Match Percentage Ribbon */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(0, 242, 254, 0.08)',
                  border: '1px solid var(--border-glow)',
                  borderRadius: '12px',
                  padding: '4px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: 'var(--accent-cyan)'
                }}>
                  <Sparkles size={12} />
                  <span>{dev.compatibility}% Match</span>
                </div>

                {/* Developer Profile Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src={dev.avatar} 
                    alt={dev.name} 
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-light)' }} 
                  />
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{dev.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>@{dev.username}</span>
                  </div>
                </div>

                {/* Archetype badging */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span className="badge-tag" style={{ background: 'rgba(0, 242, 254, 0.05)', color: 'var(--accent-cyan)', fontSize: '0.65rem', padding: '2px 8px' }}>
                    {dev.dnaType === 'Architect' && 'Architect'}
                    {dev.dnaType === 'Maker' && 'Maker'}
                    {dev.dnaType === 'Explorer' && 'Explorer'}
                    {dev.dnaType === 'Scholar' && 'Scholar'}
                  </span>
                  <span className="badge-tag" style={{ background: 'rgba(155, 81, 224, 0.05)', color: 'var(--accent-purple)', fontSize: '0.65rem', padding: '2px 8px' }}>
                    {dev.specialization}
                  </span>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4', flex: 1 }}>
                  {dev.bio}
                </p>

                {/* Compatibility explanation */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.7rem',
                  lineHeight: '1.3',
                  color: 'var(--text-muted)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '4px' }}>
                    <AlertCircle size={12} />
                    <span>AI MATCH EXPLANATION</span>
                  </div>
                  {dev.reason}
                </div>

                {/* Skills tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {dev.skills.slice(0, 4).map(skill => (
                    <span key={skill} style={{ fontSize: '0.6rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1px 6px', borderRadius: '4px' }}>
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Action CTA */}
                <button
                  onClick={() => handleSendCollabRequest(dev.username, dev.name)}
                  className={hasSent ? "btn-secondary" : "btn-primary"}
                  style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.75rem' }}
                  disabled={hasSent}
                >
                  {hasSent ? (
                    <>
                      <CheckCircle size={14} style={{ color: '#10b981' }} />
                      <span>Collab Request Transmitted</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Send Collab Request / DNA Card</span>
                    </>
                  )}
                </button>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
