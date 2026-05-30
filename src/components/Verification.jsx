import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  Link as LinkIcon, 
  FileText, 
  Briefcase, 
  CheckCircle,
  Sparkles,
  Info,
  Star
} from 'lucide-react';

export default function Verification() {
  const { 
    userProfile, 
    endorsements, 
    simulateEndorsementsForMe, 
    handleApplyForProfessional, 
    navigate 
  } = useApp();

  const [step, setStep] = useState(1); // 1: Form, 2: Endorsement Monitoring
  
  const [profession, setProfession] = useState('Developer');
  const [credentialInput, setCredentialInput] = useState('');
  const [powLink, setPowLink] = useState('');

  const userEndorsements = userProfile ? (endorsements[userProfile.username] || []) : [];
  const endorsementCount = userEndorsements.length;
  const meetsRequirements = endorsementCount >= 3;

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!credentialInput.trim()) return alert('Please enter your professional credentials.');
    if (!powLink.trim()) return alert('Please enter your proof of work link.');
    setStep(2);
  };

  const handleApply = async () => {
    await handleApplyForProfessional(
      profession,
      credentialInput,
      { pow: powLink }
    );
  };

  if (!userProfile) return null;

  if (userProfile.badges.verifiedProfessional) {
    return (
      <div className="glass-panel animate-slide-up" style={{ maxWidth: '600px', margin: '40px auto', padding: '36px', textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(245, 158, 11, 0.1)',
          color: '#f59e0b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)',
          border: '2px solid rgba(245, 158, 11, 0.3)'
        }}>
          <Star size={32} fill="currentColor" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>Verified Professional ⭐</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '24px' }}>
          Congratulations! You are verified on-chain as a legitimate <strong>{profession}</strong> in the Poofie ecosystem. Your reviews, ratings, and endorsements hold high weight, and your badge is fully active.
        </p>
        <button 
          onClick={() => navigate('profile', { username: userProfile.username })} 
          className="btn-primary"
        >
          View Verified Profile
        </button>
      </div>
    );
  }

  return (
    <div className="animate-slide-up" style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
      <div className="glass-panel" style={{ padding: '36px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
          <ShieldCheck size={28} style={{ color: 'var(--accent-purple)' }} />
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)' }}>Professional Verification Portal</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unlock your Verified Professional Badge NFT ⭐</span>
          </div>
        </div>

        {/* Step 1: Submit Details Form */}
        {step === 1 && (
          <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Declare your expertise, submit verifiable credentials (company ID, employment contract, degree), and point to public portfolios.
            </p>

            {/* Profession */}
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>CHOOSE PROFESSION</label>
              <select
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="input-field"
                style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--text-main)' }}
              >
                <option value="Developer" style={{ background: '#07070a' }}>Software Developer / Architect</option>
                <option value="Designer" style={{ background: '#07070a' }}>UX/UI Designer / Brand Creator</option>
                <option value="Writer" style={{ background: '#07070a' }}>Technical Writer / Research Fellow</option>
                <option value="Photographer" style={{ background: '#07070a' }}>Photographer / Visual Artist</option>
                <option value="Freelancer" style={{ background: '#07070a' }}>Independent Freelancer / Consultant</option>
              </select>
            </div>

            {/* Credentials */}
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>PROFESSIONAL CREDENTIALS</label>
              <input 
                type="text" 
                placeholder="e.g. Senior Smart Contract Auditor @ ConsenSys (Employee #834)"
                value={credentialInput}
                onChange={(e) => setCredentialInput(e.target.value)}
                className="input-field"
                required
              />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
                Include college graduation codes, professional certifications, or workplace email endpoints.
              </span>
            </div>

            {/* Proof Of Work */}
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>PROOF OF WORK LINK</label>
              <input 
                type="url" 
                placeholder="e.g. https://github.com/myusername/reput-protocol"
                value={powLink}
                onChange={(e) => setPowLink(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ alignSelf: 'end' }}>
              Proceed to Endorsements
              <Users size={16} style={{ marginLeft: '4px' }} />
            </button>
          </form>
        )}

        {/* Step 2: Endorsement Monitoring & Simulation */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Dossier status summary */}
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase' }}>Selected Track</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block', marginTop: '2px' }}>{profession} Verification</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                Credentials: <em>{credentialInput}</em>
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                Proof: <a href={powLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)' }}>{powLink}</a>
              </span>
            </div>

            {/* Endorsement progress meter */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Peer Endorsement Threshold</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: meetsRequirements ? '#10b981' : '#f59e0b' }}>
                  {endorsementCount} / 3 endorsements
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                <div style={{
                  width: `${Math.min(100, (endorsementCount / 3) * 100)}%`,
                  height: '100%',
                  background: meetsRequirements ? '#10b981' : 'var(--accent-gradient)',
                  borderRadius: '4px',
                  transition: 'width 0.4s ease'
                }}></div>
              </div>

              {/* Simulation widget trigger */}
              {!meetsRequirements && (
                <div style={{
                  background: 'rgba(155, 81, 224, 0.03)',
                  border: '1px dashed rgba(155, 81, 224, 0.3)',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  marginBottom: '16px'
                }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Need endorsements? In production, you would share your verification profile with peers. For this interactive demo, click below to simulate three immediate incoming endorsements from our verified system professionals.
                  </p>
                  <button 
                    onClick={simulateEndorsementsForMe}
                    className="btn-secondary"
                    style={{
                      fontSize: '0.75rem',
                      background: 'linear-gradient(90deg, rgba(155, 81, 224, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
                      border: '1px solid rgba(155, 81, 224, 0.2)'
                    }}
                  >
                    <Sparkles size={14} style={{ color: 'var(--accent-purple)', marginRight: '6px' }} />
                    Simulate Peer Endorsements
                  </button>
                </div>
              )}

              {/* Endorsements List */}
              {endorsementCount > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Endorsements Received</span>
                  {userEndorsements.map((end, idx) => (
                    <div key={idx} style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                        <span>{end.endorserName} (@{end.endorserUsername})</span>
                        <span style={{ color: 'var(--accent-purple)', fontSize: '0.65rem' }}>{end.relation}</span>
                      </div>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>"{end.reason}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verifier instructions alert */}
            <div style={{
              display: 'flex',
              gap: '12px',
              background: 'rgba(0, 242, 254, 0.02)',
              border: '1px solid rgba(0, 242, 254, 0.1)',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              <Info size={16} style={{ color: 'var(--accent-cyan)', shrink: 0, marginTop: '2px' }} />
              <div>
                <strong>DAO Verification Review:</strong> Once submitted, the Poofie Verifier DAO parses credentials and endorsers. Upon matching proof hashes on IPFS, the Verified Professional NFT will be minted directly to your address.
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'between', marginTop: '12px' }}>
              <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
              <button 
                onClick={handleApply}
                className="btn-primary" 
                disabled={!meetsRequirements}
                style={{
                  background: meetsRequirements ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.02)',
                  color: meetsRequirements ? '#000' : 'var(--text-dim)',
                  cursor: meetsRequirements ? 'pointer' : 'not-allowed',
                  border: meetsRequirements ? 'none' : '1px solid var(--border-light)'
                }}
              >
                <Star size={16} fill={meetsRequirements ? 'currentColor' : 'none'} />
                Submit DAO Verification Review
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
