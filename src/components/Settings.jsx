import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings as SettingsIcon, 
  User, 
  Trash2,
  Sparkles,
  Link,
  ChevronRight,
  ShieldAlert,
  GitFork
} from 'lucide-react';

export default function Settings() {
  const { 
    wallet,
    userProfile, 
    handleClearDatabase,
    handleConnectAccount,
    addNotification,
    addXP
  } = useApp();

  const [name, setName] = useState(userProfile?.name || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  
  // Custom states for platform connectors
  const [githubUser, setGithubUser] = useState('');
  const [leetcodeUser, setLeetcodeUser] = useState('');
  const [devfolioUser, setDevfolioUser] = useState('');

  if (!userProfile) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    userProfile.name = name;
    userProfile.bio = bio;
    addNotification('success', 'Developer profile details saved successfully!');
  };

  const triggerConnect = (platform, val) => {
    if (!val) return alert(`Please enter a handle for ${platform.toUpperCase()}`);
    handleConnectAccount(platform, val);
    if (platform === 'github') setGithubUser('');
    if (platform === 'leetcode') setLeetcodeUser('');
    if (platform === 'devfolio') setDevfolioUser('');
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: '720px', margin: '0 auto', width: '100%' }}>
      <div className="glass-panel" style={{ padding: '36px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
          <SettingsIcon size={24} style={{ color: 'var(--accent-cyan)' }} />
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)' }}>Sandbox Settings</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Configure credentials, connect mock developer profiles, and simulate ecosystem states.</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Section 1: Profile Settings */}
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} />
              Developer Profile Details
            </h3>
            
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>DISPLAY NAME</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>BIO / ATTRIBUTION</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input-field"
                style={{ height: '80px', resize: 'none' }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ alignSelf: 'end', padding: '8px 16px', fontSize: '0.8rem' }}>
              Save Profile Details
            </button>
          </form>

          {/* Section 2: Platforms Connections */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link size={16} style={{ color: 'var(--accent-purple)' }} />
              Manage Developer Attestations
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* GitHub Controller */}
              <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong>GitHub Parser Status</strong>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: userProfile.connectedAccounts?.github?.connected ? '#10b981' : 'var(--text-dim)' }}>
                    {userProfile.connectedAccounts?.github?.connected ? `Linked (@${userProfile.connectedAccounts.github.username})` : 'Unlinked'}
                  </span>
                </div>
                {!userProfile.connectedAccounts?.github?.connected ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Enter GitHub handle" 
                      value={githubUser}
                      onChange={(e) => setGithubUser(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                    />
                    <button onClick={() => triggerConnect('github', githubUser)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.75rem' }}>Link Profile</button>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Commits, repository counts, and contribution vectors linked to Developer DNA scorecard.</span>
                )}
              </div>

              {/* LeetCode Controller */}
              <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong>LeetCode Tracker Status</strong>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: userProfile.connectedAccounts?.leetcode?.connected ? '#10b981' : 'var(--text-dim)' }}>
                    {userProfile.connectedAccounts?.leetcode?.connected ? `Linked (@${userProfile.connectedAccounts.leetcode.username})` : 'Unlinked'}
                  </span>
                </div>
                {!userProfile.connectedAccounts?.leetcode?.connected ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Enter LeetCode username" 
                      value={leetcodeUser}
                      onChange={(e) => setLeetcodeUser(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                    />
                    <button onClick={() => triggerConnect('leetcode', leetcodeUser)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.75rem' }}>Link Tracker</button>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Algorithmic complexity vectors synced to identity scores.</span>
                )}
              </div>

              {/* Devfolio Controller */}
              <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong>Devfolio Hackathon Status</strong>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: userProfile.connectedAccounts?.devfolio?.connected ? '#10b981' : 'var(--text-dim)' }}>
                    {userProfile.connectedAccounts?.devfolio?.connected ? `Linked (@${userProfile.connectedAccounts.devfolio.username})` : 'Unlinked'}
                  </span>
                </div>
                {!userProfile.connectedAccounts?.devfolio?.connected ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Enter Devfolio username" 
                      value={devfolioUser}
                      onChange={(e) => setDevfolioUser(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                    />
                    <button onClick={() => triggerConnect('devfolio', devfolioUser)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.75rem' }}>Link Hackathons</button>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}> podium finalist awards linked to DNA strategist traits.</span>
                )}
              </div>

            </div>
          </div>

          {/* Section 3: Simulators Hub */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} />
              Ecosystem Attestation Simulators
            </h3>
            
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Simulate actions to instantly witness gamification updates, streak records, level milestones, and badge unlocks in real-time.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => addXP(350, 'Simulated smart audit compilation and submission')}
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '8px 16px' }}
              >
                Simulate Major Contribution (+350 XP)
              </button>
            </div>
          </div>

          {/* Section 4: Clear Database Danger Zone */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trash2 size={16} />
              Danger Zone: Reset Sandbox Database
            </h3>
            
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Wipe all browser localStorage attributes including your custom DNA, domain preferences, connected mock platform details, notifications history, and streaks. Restores pristine preset developers.
            </p>

            <button
              type="button"
              onClick={handleClearDatabase}
              className="btn-danger"
              style={{ alignSelf: 'start', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.8rem' }}
            >
              <Trash2 size={14} />
              Reset Local Storage & Restart Sandbox
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
