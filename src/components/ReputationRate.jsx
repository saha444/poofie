import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, ShieldAlert, CheckCircle, Info, ThumbsUp } from 'lucide-react';

const RELATIONSHIPS = [
  'Teammate', 'Client', 'Freelancer', 'Employer', 'Collaborator'
];

export default function ReputationRate() {
  const { 
    userProfile, 
    lowScoreRestricted,
    handleRateReputation, 
    viewParams, 
    navigate,
    systemUsers
  } = useApp();

  const targetUsername = viewParams.username;
  
  // Find target user details
  const allUsers = userProfile ? [userProfile, ...systemUsers] : systemUsers;
  const targetUser = allUsers.find(u => u.username === targetUsername);

  const [relationship, setRelationship] = useState('Teammate');
  const [skill, setSkill] = useState(5);
  const [trust, setTrust] = useState(5);
  const [reliability, setReliability] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lowScoreRestricted) {
      alert('Rating privileges restricted. Improve your Poofie Score first!');
      return;
    }
    if (!comment.trim()) {
      alert('A comment is required to explain and justify your professional review.');
      return;
    }
    if (comment.trim().length < 15) {
      alert('Please provide a detailed comment (minimum 15 characters).');
      return;
    }

    await handleRateReputation(
      targetUsername,
      { skill, trust, reliability },
      comment.trim(),
      relationship
    );
  };

  if (!userProfile) {
    return (
      <div className="glass-panel" style={{ padding: '36px', textAlign: 'center' }}>
        <h3>Connect your wallet to review @{targetUsername}</h3>
      </div>
    );
  }

  if (lowScoreRestricted) {
    return (
      <div className="glass-panel" style={{ padding: '36px', textAlign: 'center' }}>
        <ShieldAlert size={42} style={{ color: '#ef4444', margin: '0 auto 16px auto' }} />
        <h3 style={{ marginBottom: '8px' }}>Rating Privileges Restricted</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Your current Poofie Score is below the required threshold. Please publish appreciated work to unlock ratings.
        </p>
      </div>
    );
  }

  if (!targetUser) {
    return (
      <div className="glass-panel" style={{ padding: '36px', textAlign: 'center' }}>
        <h3>User not found.</h3>
      </div>
    );
  }

  return (
    <div className="animate-slide-up" style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
      <div className="glass-panel" style={{ padding: '36px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
          <img 
            src={targetUser.avatar} 
            alt={targetUser.name} 
            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} 
          />
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)' }}>Submit Reputation Attestation</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reviewing {targetUser.name} (@{targetUser.username})</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Reputation ratings must represent legitimate professional interactions. Scores contribute directly to the user's on-chain Reputation Score.
          </p>

          {/* Relationship */}
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>WHAT IS YOUR RELATIONSHIP?</label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="input-field"
              style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--text-main)', width: '100%' }}
            >
              {RELATIONSHIPS.map(rel => (
                <option key={rel} value={rel} style={{ background: '#07070a' }}>{rel}</option>
              ))}
            </select>
          </div>

          {/* Category sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-light)', padding: '16px', borderRadius: '8px' }}>
            
            {/* Category 1: Skill */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '6px' }}>
                <span>Competence & Expertise (Skill)</span>
                <span style={{ color: 'var(--accent-cyan)' }}>{skill} / 5</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSkill(val)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
                  >
                    <Star 
                      size={20} 
                      fill={val <= skill ? '#f59e0b' : 'none'} 
                      stroke={val <= skill ? '#f59e0b' : 'var(--text-dim)'} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Category 2: Trust */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '6px' }}>
                <span>Honesty & Integrity (Trust)</span>
                <span style={{ color: 'var(--accent-cyan)' }}>{trust} / 5</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTrust(val)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
                  >
                    <Star 
                      size={20} 
                      fill={val <= trust ? '#f59e0b' : 'none'} 
                      stroke={val <= trust ? '#f59e0b' : 'var(--text-dim)'} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Category 3: Reliability */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '6px' }}>
                <span>Consistency & Dependability (Reliability)</span>
                <span style={{ color: 'var(--accent-cyan)' }}>{reliability} / 5</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setReliability(val)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
                  >
                    <Star 
                      size={20} 
                      fill={val <= reliability ? '#f59e0b' : 'none'} 
                      stroke={val <= reliability ? '#f59e0b' : 'var(--text-dim)'} 
                    />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Written feedback comment REQUIRED */}
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
              JUSTIFICATION FEEDBACK (REQUIRED)
            </label>
            <textarea 
              placeholder="e.g. Elena was an outstanding teammate during the Ethereum hackathon. She wrote highly optimized ZK circuits and delivered work before the deadline..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input-field"
              style={{ height: '110px', resize: 'none' }}
              required
            />
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
              Minimum 15 characters. Provide real examples of collaboration to make your attestation valid.
            </span>
          </div>

          {/* Secure hash notice */}
          <div style={{
            display: 'flex',
            gap: '12px',
            background: 'rgba(0, 242, 254, 0.02)',
            border: '1px solid rgba(0, 242, 254, 0.1)',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            lineHeight: '1.4'
          }}>
            <Info size={16} style={{ color: 'var(--accent-cyan)', shrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Cryptographic Attestation:</strong> Reviews are pinned to IPFS, and a SHA-256 integrity hash is recorded on the blockchain linked to your wallet signature. This prevents review tampering and ensures absolute portable transparency.
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'end', marginTop: '12px' }}>
            <button 
              type="button" 
              onClick={() => navigate('profile', { username: targetUsername })} 
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              style={{ background: 'var(--accent-gradient)' }}
            >
              <ThumbsUp size={16} style={{ marginRight: '6px' }} />
              Submit Attestation
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
