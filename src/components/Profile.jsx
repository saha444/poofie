import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { shortenAddress } from '../utils/web3Mock';
import { 
  Star, 
  GitFork, 
  Globe, 
  Briefcase, 
  MessageSquare, 
  ShieldCheck, 
  Award, 
  BookOpen, 
  Plus, 
  FileText, 
  UserCheck,
  Flame,
  UserPlus
} from 'lucide-react';

export default function Profile() {
  const { 
    userProfile, 
    systemUsers, 
    posts, 
    reputationReviews, 
    endorsements, 
    viewParams, 
    navigate,
    handleEndorseUser
  } = useApp();

  const [activeTab, setActiveTab] = useState('posts');
  const [showEndorseModal, setShowEndorseModal] = useState(false);
  const [endorseReason, setEndorseReason] = useState('');
  const [endorseRelation, setEndorseRelation] = useState('Collaborator');

  const targetUsername = viewParams.username || userProfile?.username;

  // Determine user to render
  const allUsers = userProfile ? [userProfile, ...systemUsers] : systemUsers;
  const profileUser = allUsers.find(u => u.username === targetUsername);

  if (!profileUser) {
    return (
      <div className="glass-panel animate-slide-up" style={{ padding: '48px', textAlign: 'center' }}>
        <h3>Profile not found or wallet not connected.</h3>
        <button onClick={() => navigate('feed')} className="btn-primary" style={{ marginTop: '16px' }}>
          Return to Feed
        </button>
      </div>
    );
  }

  const isOwnProfile = userProfile && profileUser.username === userProfile.username;

  // Gather user-specific data from central databases
  const userPosts = posts.filter(post => post.creatorUsername === profileUser.username);
  const userReviews = reputationReviews[profileUser.username] || [];
  const userEndorsements = endorsements[profileUser.username] || [];

  // Calculate categorized averages
  const hasReviews = userReviews.length > 0;
  const avgSkill = hasReviews ? parseFloat((userReviews.reduce((sum, r) => sum + r.skill, 0) / userReviews.length).toFixed(1)) : 0;
  const avgTrust = hasReviews ? parseFloat((userReviews.reduce((sum, r) => sum + r.trust, 0) / userReviews.length).toFixed(1)) : 0;
  const avgReliability = hasReviews ? parseFloat((userReviews.reduce((sum, r) => sum + r.reliability, 0) / userReviews.length).toFixed(1)) : 0;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(profileUser.address);
    alert('Wallet address copied to clipboard!');
  };

  const handleEndorseSubmit = async (e) => {
    e.preventDefault();
    if (!endorseReason.trim()) return alert('Please enter a reason for your endorsement.');
    await handleEndorseUser(profileUser.username, endorseReason.trim(), endorseRelation);
    setShowEndorseModal(false);
    setEndorseReason('');
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      
      {/* Profile Header Block */}
      <div className="glass-panel" style={{ padding: '32px', position: 'relative' }}>
        
        {/* visual background aura */}
        <div style={{
          position: 'absolute',
          left: '5%',
          top: '-20px',
          width: '200px',
          height: '200px',
          background: 'var(--accent-gradient)',
          filter: 'blur(90px)',
          opacity: 0.08,
          pointerEvents: 'none'
        }}></div>

        <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'start', flexWrap: 'wrap', gap: '24px' }}>
          
          {/* Avatar & Core Bio Info */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid ' + (profileUser.badges.verifiedProfessional ? '#f59e0b' : 'var(--accent-cyan)'),
              boxShadow: profileUser.badges.verifiedProfessional ? '0 0 20px rgba(245, 158, 11, 0.2)' : 'var(--shadow-glow)'
            }}>
              <img src={profileUser.avatar} alt={profileUser.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
                  {profileUser.name}
                </h1>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>@{profileUser.username}</span>
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', gap: '8px', margin: '8px 0', flexWrap: 'wrap' }}>
                {profileUser.badges.verifiedHuman && (
                  <span className="badge-tag badge-human">
                    <UserCheck size={12} />
                    Verified Human
                  </span>
                )}
                {profileUser.badges.verifiedProfessional && (
                  <span className="badge-tag badge-professional">
                    <Star size={12} fill="currentColor" />
                    Verified Professional
                  </span>
                )}
              </div>

              {/* short address copy */}
              <button 
                onClick={handleCopyAddress}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '4px'
                }}
              >
                <span>{shortenAddress(profileUser.address)}</span>
                <span style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)' }}>Copy</span>
              </button>
            </div>
          </div>

          {/* Scores Panel */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginLeft: 'auto' }}>
            
            {/* Poofie Score display */}
            <div style={{ padding: '16px 24px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                Poofie Score
              </span>
              <strong style={{ fontSize: '2.25rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                {profileUser.poofieScore}
              </strong>
            </div>

            {/* Level indicator */}
            <div style={{ padding: '16px 24px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                XP Level
              </span>
              <strong style={{ fontSize: '2.25rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                {profileUser.level || 1}
              </strong>
            </div>

          </div>

        </div>

        {/* Bio */}
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: '24px 0 0 0', maxWidth: '780px' }}>
          {profileUser.bio || 'This user is verified on-chain. Explores decentralized technologies, building smart reputations.'}
        </p>

        {/* Social actions: Endorse and Review targets */}
        {!isOwnProfile && userProfile && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
            <button 
              onClick={() => navigate('rate-reputation', { username: profileUser.username })}
              className="btn-primary"
              style={{ fontSize: '0.8rem', padding: '8px 16px' }}
            >
              <MessageSquare size={16} />
              Review Professional Reputation
            </button>
            <button 
              onClick={() => setShowEndorseModal(true)}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '8px 16px' }}
            >
              <UserPlus size={16} />
              Endorse Account
            </button>
          </div>
        )}

      </div>

      {/* Profile content Tabs */}
      <div>
        
        {/* Tab triggers */}
        <div className="tab-container">
          <button 
            onClick={() => setActiveTab('posts')} 
            className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          >
            <BookOpen size={16} />
            Publications ({userPosts.length})
          </button>
          <button 
            onClick={() => setActiveTab('portfolio')} 
            className={`tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
          >
            <Globe size={16} />
            Portfolio & Proofs
          </button>
          <button 
            onClick={() => setActiveTab('reputation')} 
            className={`tab-btn ${activeTab === 'reputation' ? 'active' : ''}`}
          >
            <Award size={16} />
            Teammate Reviews ({userReviews.length})
          </button>
          <button 
            onClick={() => setActiveTab('endorsements')} 
            className={`tab-btn ${activeTab === 'endorsements' ? 'active' : ''}`}
          >
            <ShieldCheck size={16} />
            Endorsements ({userEndorsements.length})
          </button>
        </div>

        {/* Tab Content 1: Publications */}
        {activeTab === 'posts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {userPosts.length === 0 ? (
              <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-dim)' }}>
                No publications found on-chain for this address.
              </div>
            ) : (
              userPosts.map(post => (
                <div key={post.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'between' }}>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(0, 242, 254, 0.05)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '10px' }}>
                      {post.type}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>IPFS: {shortenAddress(post.ipfsCid)}</span>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{post.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{post.description}</p>
                  
                  {post.githubUrl && (
                    <a href={post.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--accent-cyan)', textDecoration: 'none' }}>
                      <GitFork size={12} />
                      Open Github Repo
                    </a>
                  )}

                  {post.imageUrl && (
                    <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)', maxHeight: '200px' }}>
                      <img src={post.imageUrl} alt="attached media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#f59e0b' }}>
                      <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
                      <strong>{post.starsCount}</strong>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>({post.ratings.length} votes)</span>
                    </div>
                    <button onClick={() => navigate('feed')} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>
                      View on Feed
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content 2: Portfolio & Proof of Work */}
        {activeTab === 'portfolio' && (
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Verifiable Project Assets</h3>
            
            {/* Skills */}
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>CLAIMED SKILL ATTRIBUTES</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {profileUser.skills.length === 0 ? (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>No skills listed.</span>
                ) : (
                  profileUser.skills.map(skill => (
                    <span 
                      key={skill}
                      style={{
                        fontSize: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-light)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        color: 'var(--text-main)'
                      }}
                    >
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>PORTFOLIO LINKS</span>
              
              {profileUser.portfolio?.github && (
                <a 
                  href={profileUser.portfolio.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', width: 'fit-content' }}
                >
                  <GitFork size={16} />
                  Github Profile
                </a>
              )}

              {profileUser.portfolio?.linkedin && (
                <a 
                  href={profileUser.portfolio.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', width: 'fit-content' }}
                >
                  <Briefcase size={16} />
                  LinkedIn Verified Link
                </a>
              )}

              {profileUser.portfolio?.website && (
                <a 
                  href={profileUser.portfolio.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', width: 'fit-content' }}
                >
                  <Globe size={16} />
                  Personal Website
                </a>
              )}

              {(!profileUser.portfolio || Object.values(profileUser.portfolio).filter(Boolean).length === 0) && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>No links associated.</span>
              )}
            </div>
          </div>
        )}

        {/* Tab Content 3: Coworker Reputation Reviews */}
        {activeTab === 'reputation' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Reputation score breakdown matrices */}
            <div className="glass-panel" style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>SKILL MATRIX AVG</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star size={16} fill="#f59e0b" stroke="#f59e0b" />
                  <strong style={{ fontSize: '1.25rem' }}>{avgSkill} / 5</strong>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>TRUST MATRIX AVG</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star size={16} fill="#f59e0b" stroke="#f59e0b" />
                  <strong style={{ fontSize: '1.25rem' }}>{avgTrust} / 5</strong>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>RELIABILITY MATRIX AVG</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star size={16} fill="#f59e0b" stroke="#f59e0b" />
                  <strong style={{ fontSize: '1.25rem' }}>{avgReliability} / 5</strong>
                </div>
              </div>
            </div>

            {/* Testimonials List */}
            {userReviews.length === 0 ? (
              <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-dim)' }}>
                No professional reviews received yet. Coworkers can submit ratings when viewing this profile.
              </div>
            ) : (
              userReviews.map((rev, idx) => (
                <div key={idx} className="glass-panel glow-cyan" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'between', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block' }}>{rev.reviewer}</strong>
                      <span style={{ fontSize: '0.65rem', color: 'var(--accent-purple)' }}>{rev.relationship} relationship</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {rev.date}
                      {rev.txHash && (
                        <a 
                          href={`https://sepolia.etherscan.io/tx/${rev.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: 600 }}
                        >
                          Tx ↗
                        </a>
                      )}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    "{rev.comment}"
                  </p>

                  <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '10px', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    <span>Skill: <strong style={{ color: 'var(--text-main)' }}>{rev.skill}★</strong></span>
                    <span>Trust: <strong style={{ color: 'var(--text-main)' }}>{rev.trust}★</strong></span>
                    <span>Reliability: <strong style={{ color: 'var(--text-main)' }}>{rev.reliability}★</strong></span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content 4: Peer Endorsements */}
        {activeTab === 'endorsements' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {userEndorsements.length === 0 ? (
              <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-dim)' }}>
                No professional endorsements logged yet. Unlocks Verified Professional status once 3 verified endorsements are met.
              </div>
            ) : (
              userEndorsements.map((end, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>{end.endorserName}</span>
                      <span 
                        onClick={() => navigate('profile', { username: end.endorserUsername })}
                        style={{ fontSize: '0.7rem', color: 'var(--text-dim)', cursor: 'pointer' }}
                      >
                        @{end.endorserUsername}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {end.txHash && (
                        <a 
                          href={`https://sepolia.etherscan.io/tx/${end.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '0.65rem', color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: 600 }}
                        >
                          Sepolia Tx ↗
                        </a>
                      )}
                      <span style={{ fontSize: '0.65rem', background: 'rgba(155, 81, 224, 0.05)', color: 'var(--accent-purple)', padding: '2px 8px', borderRadius: '4px' }}>
                        {end.relation}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    "{end.reason}"
                  </p>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* Endorse Modal Overlay */}
      {showEndorseModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="glass-panel animate-slide-up" style={{ width: '480px', padding: '32px', margin: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>Endorse @{profileUser.username}</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Your endorsement will be cryptographically signed and permanent. Verified professionals require 3 endorsements for status approval.
            </p>

            <form onSubmit={handleEndorseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>RELATIONSHIP TYPE</label>
                <select
                  value={endorseRelation}
                  onChange={(e) => setEndorseRelation(e.target.value)}
                  className="input-field"
                  style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--text-main)', width: '100%' }}
                >
                  <option value="Teammate" style={{ background: '#07070a' }}>Teammate</option>
                  <option value="Worked together" style={{ background: '#07070a' }}>Worked together</option>
                  <option value="Classmate" style={{ background: '#07070a' }}>Classmate</option>
                  <option value="Client" style={{ background: '#07070a' }}>Client</option>
                  <option value="Collaborator" style={{ background: '#07070a' }}>Collaborator</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>REASON FOR ENDORSEMENT</label>
                <textarea
                  placeholder="Explain why this user has legitimate expertise in their field..."
                  value={endorseReason}
                  onChange={(e) => setEndorseReason(e.target.value)}
                  className="input-field"
                  style={{ height: '90px', resize: 'none' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowEndorseModal(false)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Submit Endorsement</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
