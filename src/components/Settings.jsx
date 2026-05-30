import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings as SettingsIcon, 
  Wallet, 
  AlertTriangle, 
  User, 
  Lock,
  Globe,
  Bell
} from 'lucide-react';

export default function Settings() {
  const { 
    wallet, 
    userProfile, 
    lowScoreRestricted, 
    simulateLowScoreRestriction,
    handleCompleteOnboarding,
    addNotification
  } = useApp();

  const [name, setName] = useState(userProfile?.name || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  
  // Local profile save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    handleCompleteOnboarding({ name, bio });
    addNotification('success', 'Profile settings updated successfully!');
  };

  if (!userProfile) return null;

  return (
    <div className="animate-slide-up" style={{ maxWidth: '720px', margin: '0 auto', width: '100%' }}>
      <div className="glass-panel" style={{ padding: '36px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
          <SettingsIcon size={24} style={{ color: 'var(--accent-cyan)' }} />
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)' }}>Account Settings</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Configure credentials, wallets, and ecosystem simulators</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Section 1: Profile Settings */}
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} />
              Profile Customizations
            </h3>
            
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>FULL NAME</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>BIO / BRIEF INTRODUCTION</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input-field"
                style={{ height: '80px', resize: 'none' }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ alignSelf: 'end', padding: '8px 16px', fontSize: '0.8rem' }}>
              Save Profile Changes
            </button>
          </form>

          {/* Section 2: Wallet Details */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wallet size={16} />
              Connected Cryptographic Metadata
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block' }}>BLOCKCHAIN NETWORK</span>
                <strong>Ethereum Mainnet (Chain ID: 1)</strong>
              </div>
              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block' }}>MOCK WALLET BALANCE</span>
                <strong>{wallet.balance}</strong>
              </div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '0.75rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>CRYPTOGRAPHIC PERSONAL SIGNATURE HASH</span>
              <code style={{ fontSize: '0.65rem', wordBreak: 'break-all', color: 'var(--accent-cyan)' }}>
                {wallet.signature}
              </code>
            </div>
          </div>

          {/* Section 3: Low-Score Simulator (PRD rating restriction logic) */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
              <AlertTriangle size={18} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Ecosystem Restrictions Sandbox</h3>
            </div>
            
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              The platform incorporates a <strong>Rating Privileges System</strong>. If a user's on-chain Poofie Score drops below the predefined threshold of <strong>20</strong>, voting privileges are instantly locked. Turn on the simulator below to test this mechanism.
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'between',
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
              padding: '16px',
              gap: '16px'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', color: 'var(--text-main)' }}>
                  Simulate Low Poofie Score (&lt;20)
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Forces score to 12. Rating/voting items on the home feed or peer reviews will lock.
                </span>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => simulateLowScoreRestriction(!lowScoreRestricted)}
                style={{
                  background: lowScoreRestricted ? '#ef4444' : 'rgba(255,255,255,0.05)',
                  border: '1px solid ' + (lowScoreRestricted ? '#ef4444' : 'var(--border-light)'),
                  color: lowScoreRestricted ? '#000' : 'var(--text-muted)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
              >
                {lowScoreRestricted ? 'Simulating Active' : 'Enable Simulation'}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
