import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  MessageSquare,
  ChevronRight,
  Info
} from 'lucide-react';

export default function CollaboratorHub() {
  const { 
    userProfile, 
    systemUsers, 
    handleRateReputation, 
    handleEndorseUser,
    addXP,
    addNotification
  } = useApp();

  const [selectedUsername, setSelectedUsername] = useState('alice_v');
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Review form states
  const [relationship, setRelationship] = useState('Teammate');
  const [skill, setSkill] = useState(5);
  const [trust, setTrust] = useState(5);
  const [reliability, setReliability] = useState(5);
  const [comment, setComment] = useState('');

  if (!userProfile) return null;

  const activePeer = systemUsers.find(u => u.username === selectedUsername);

  // Pre-configured custom endorsements reasons per peer
  const PEER_ENDORSEMENTS = {
    alice_v: {
      relation: 'Worked together',
      reason: `Highly skilled smart contract developer. Audited their code and found excellent structural hygiene.`
    },
    marcus_design: {
      relation: 'Collaborator',
      reason: `Brilliant user experience mindset. Their design execution feels modern, clean, and highly professional.`
    },
    elena_dev: {
      relation: 'Teammate',
      reason: `Outstanding colleague. Documented modules flawlessly and implemented robust cryptographic proofs.`
    },
    devon_c: {
      relation: 'Client',
      reason: `Fantastic technical communication. Transformed our engineering specs into accessible manuals.`
    }
  };

  const handleEndorseSelf = async () => {
    const config = PEER_ENDORSEMENTS[selectedUsername];
    await handleEndorseUser(
      userProfile.username,
      config.reason,
      config.relation,
      { name: activePeer.name, username: activePeer.username }
    );
    addNotification('success', `📩 @${selectedUsername} has endorsed your profile!`);
    addXP(100, `Received peer endorsement from @${selectedUsername}`);
  };

  const handleReviewSelfSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert('Please enter a review comment.');
    
    await handleRateReputation(
      userProfile.username,
      { skill, trust, reliability },
      comment.trim(),
      relationship,
      activePeer.name
    );

    setShowReviewModal(false);
    setComment('');
    addNotification('success', `⭐ @${selectedUsername} reviewed your professional reputation!`);
    addXP(150, `Received reputation rating from @${selectedUsername}`);
  };

  return (
    <div className="glass-panel glow-purple" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', color: 'var(--accent-purple)' }}>
        <Users size={18} />
        <h3 style={{ fontSize: '0.9rem', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
          Collaborator Sandbox Hub
        </h3>
      </div>

      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
        Select a verified peer profile to review or endorse **your active account** and test dynamic score updates.
      </p>

      {/* Peer Selector dropdown */}
      <div>
        <label style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>CHOOSE COLLABORATOR</label>
        <select
          value={selectedUsername}
          onChange={(e) => setSelectedUsername(e.target.value)}
          className="input-field"
          style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.3)', color: 'var(--text-main)' }}
        >
          {systemUsers.map(u => (
            <option key={u.username} value={u.username} style={{ background: '#07070a' }}>
              {u.name} (@{u.username})
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        
        {/* Endorse Self */}
        <button
          onClick={handleEndorseSelf}
          className="btn-secondary"
          style={{
            fontSize: '0.75rem',
            padding: '8px 12px',
            width: '100%',
            justifyContent: 'between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} style={{ color: 'var(--accent-purple)' }} />
            <span>Endorse Me as @{selectedUsername}</span>
          </div>
          <ChevronRight size={12} style={{ color: 'var(--text-dim)' }} />
        </button>

        {/* Review Self */}
        <button
          onClick={() => setShowReviewModal(true)}
          className="btn-secondary"
          style={{
            fontSize: '0.75rem',
            padding: '8px 12px',
            width: '100%',
            justifyContent: 'between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MessageSquare size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span>Review Me as @{selectedUsername}</span>
          </div>
          <ChevronRight size={12} style={{ color: 'var(--text-dim)' }} />
        </button>

      </div>

      {/* SECURE BLOCKCHAIN LOGS */}
      <div style={{
        display: 'flex',
        gap: '8px',
        background: 'rgba(255,255,255,0.01)',
        padding: '8px 10px',
        borderRadius: '6px',
        fontSize: '0.65rem',
        color: 'var(--text-dim)',
        border: '1px solid var(--border-light)'
      }}>
        <Info size={12} style={{ shrink: 0, color: 'var(--accent-purple)' }} />
        <span>Attestations use unique asymmetric cryptographic signatures.</span>
      </div>

      {/* Custom Review Form modal inside sandbox */}
      {showReviewModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999
        }}>
          <div className="glass-panel animate-slide-up" style={{ width: '480px', padding: '28px', margin: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '4px', fontSize: '1.25rem' }}>
              Review your Profile as @{selectedUsername}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Acting as {activePeer.name} ({relationship})</span>

            <form onSubmit={handleReviewSelfSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
              
              {/* Relationship */}
              <div>
                <label style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>RELATIONSHIP TYPE</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.75rem', padding: '8px 12px' }}
                >
                  <option value="Teammate">Teammate</option>
                  <option value="Client">Client</option>
                  <option value="Freelancer">Freelancer</option>
                  <option value="Employer">Employer</option>
                  <option value="Collaborator">Collaborator</option>
                </select>
              </div>

              {/* Star controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px' }}>
                
                {/* Skill */}
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Skill (Expertise)</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map(val => (
                      <button type="button" key={val} onClick={() => setSkill(val)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        <Star size={16} fill={val <= skill ? '#f59e0b' : 'none'} stroke={val <= skill ? '#f59e0b' : 'var(--text-dim)'} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trust */}
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trust (Honesty)</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map(val => (
                      <button type="button" key={val} onClick={() => setTrust(val)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        <Star size={16} fill={val <= trust ? '#f59e0b' : 'none'} stroke={val <= trust ? '#f59e0b' : 'var(--text-dim)'} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reliability */}
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reliability (Consistency)</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map(val => (
                      <button type="button" key={val} onClick={() => setReliability(val)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        <Star size={16} fill={val <= reliability ? '#f59e0b' : 'none'} stroke={val <= reliability ? '#f59e0b' : 'var(--text-dim)'} />
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Justification Comment */}
              <div>
                <label style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>WRITTEN TESTIMONIAL</label>
                <textarea
                  placeholder={`Write a professional testimonial from @${selectedUsername}'s perspective...`}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="input-field"
                  style={{ height: '70px', resize: 'none', fontSize: '0.75rem' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowReviewModal(false)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.75rem' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.75rem', background: 'var(--accent-gradient)' }}>
                  <Sparkles size={14} style={{ marginRight: '6px' }} />
                  Submit Attestation
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
