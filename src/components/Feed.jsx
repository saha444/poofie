import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { shortenAddress } from '../utils/web3Mock';
import { 
  Star, 
  Heart, 
  MessageSquare, 
  Share2, 
  Link as LinkIcon, 
  GitFork, 
  FileText, 
  Layers, 
  CheckCircle,
  Award,
  AlertTriangle
} from 'lucide-react';

export default function Feed() {
  const { 
    posts, 
    userProfile, 
    lowScoreRestricted,
    handleRateContent, 
    navigate,
    systemUsers
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('trending');
  
  // Rate drawer controls per post
  const [ratingInput, setRatingInput] = useState({}); // { [postId]: { stars: 5, comment: '' } }

  const handleStarSelect = (postId, value) => {
    setRatingInput(prev => ({
      ...prev,
      [postId]: {
        ...(prev[postId] || { comment: '' }),
        stars: value
      }
    }));
  };

  const handleCommentChange = (postId, text) => {
    setRatingInput(prev => ({
      ...prev,
      [postId]: {
        ...(prev[postId] || { stars: 5 }),
        comment: text
      }
    }));
  };

  const submitRatingClick = async (postId) => {
    const input = ratingInput[postId] || { stars: 5, comment: '' };
    await handleRateContent(postId, input.stars, input.comment);
    // Reset input
    setRatingInput(prev => {
      const copy = { ...prev };
      delete copy[postId];
      return copy;
    });
  };

  const handleShare = (postId) => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
    alert('Mock sharing URL copied to clipboard!');
  };

  // Filter posts
  const filteredPosts = [...posts].sort((a, b) => {
    if (activeFilter === 'latest') {
      return b.timestamp - a.timestamp;
    } else if (activeFilter === 'highest-rated') {
      return b.starsCount - a.starsCount;
    } else {
      // trending: combination of likes + starsCount + date
      return (b.likes + b.starsCount * 5) - (a.likes + a.starsCount * 5);
    }
  });

  return (
    <div className="animate-slide-up" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
      
      {/* Posts Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Navigation Filters */}
        <div className="glass-panel" style={{ padding: '12px 24px', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['trending', 'latest', 'highest-rated'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`tab-btn ${activeFilter === filter ? 'active' : ''}`}
                style={{ fontSize: '0.85rem', textTransform: 'capitalize', padding: '8px 12px' }}
              >
                {filter.replace('-', ' ')}
              </button>
            ))}
          </div>
          <button 
            onClick={() => navigate('create')} 
            className="btn-primary" 
            style={{ padding: '8px 16px', fontSize: '0.8rem' }}
          >
            Create On-Chain Post
          </button>
        </div>

        {/* Dynamic warning if low-score restriction is active */}
        {lowScoreRestricted && (
          <div className="restriction-banner">
            <AlertTriangle size={20} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem' }}>Rating Privileges Restricted</strong>
              <span style={{ fontSize: '0.75rem' }}>Your Poofie Score is below 20. Build reputation or publish appreciated work to regain access.</span>
            </div>
          </div>
        )}

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-dim)' }}>
            No posts found. Start by sharing your first project!
          </div>
        ) : (
          filteredPosts.map((post) => {
            const hasRated = post.ratings.some(r => r.rater === userProfile?.name);
            const activeInput = ratingInput[post.id] || { stars: 5, comment: '' };

            return (
              <article key={post.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Header: User Profile Details */}
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'start' }}>
                  <div 
                    onClick={() => navigate('profile', { username: post.creatorUsername })}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                  >
                    <img 
                      src={post.creatorAvatar} 
                      alt={post.creatorName} 
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-light)' }} 
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{post.creatorName}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>@{post.creatorUsername}</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {shortenAddress(post.creatorAddress)}
                      </span>
                    </div>
                  </div>

                  {/* Date and IPFS CID indicator */}
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>
                      {new Date(post.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                    <a 
                      href={`https://ipfs.io/ipfs/${post.ipfsCid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', justifyContent: 'end', marginTop: '4px' }}
                    >
                      <Layers size={10} />
                      IPFS CID
                    </a>
                  </div>
                </div>

                {/* Body Content */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                    {post.description}
                  </p>

                  {/* GitHub attachment block */}
                  {post.githubUrl && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      gap: '12px',
                      marginTop: '12px'
                    }}>
                      <GitFork size={20} />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block' }}>Linked Github Repository</span>
                        <a 
                          href={post.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', textDecoration: 'none' }}
                        >
                          {post.githubUrl}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Image attachment block */}
                  {post.imageUrl && (
                    <div style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginTop: '12px',
                      maxHeight: '360px',
                      border: '1px solid var(--border-light)'
                    }}>
                      <img src={post.imageUrl} alt="post content" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {post.tags.map((tag) => (
                    <span 
                      key={tag} 
                      onClick={() => navigate('explore', { search: tag })}
                      style={{ fontSize: '0.65rem', background: 'rgba(0, 242, 254, 0.05)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '10px', cursor: 'pointer' }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Star rating summary */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  justifyContent: 'between',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Star size={16} fill="#f59e0b" stroke="#f59e0b" />
                    <strong style={{ fontSize: '0.9rem' }}>{post.starsCount || 'No Ratings'}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      ({post.ratings.length} {post.ratings.length === 1 ? 'rating' : 'ratings'})
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    Type: <strong style={{ color: 'var(--text-main)' }}>{post.type}</strong>
                  </span>
                </div>

                {/* Rating Input Drawer (if logged in, has not voted, and score is not restricted) */}
                {userProfile && !hasRated && !lowScoreRestricted && (
                  <div style={{
                    background: 'rgba(0, 242, 254, 0.03)',
                    border: '1px dashed rgba(0, 242, 254, 0.15)',
                    borderRadius: '8px',
                    padding: '16px',
                    marginTop: '4px'
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '8px', color: 'var(--accent-cyan)' }}>
                      Submit Content Quality Attestation
                    </span>
                    
                    {/* Stars slider */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleStarSelect(post.id, val)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
                        >
                          <Star 
                            size={20} 
                            fill={val <= activeInput.stars ? '#f59e0b' : 'none'} 
                            stroke={val <= activeInput.stars ? '#f59e0b' : 'var(--text-dim)'} 
                          />
                        </button>
                      ))}
                    </div>

                    {/* Optional Comment */}
                    <input 
                      type="text"
                      placeholder="Add an optional comment detailing the work quality..."
                      value={activeInput.comment}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.8rem', padding: '8px 12px', marginBottom: '12px' }}
                    />

                    <button 
                      onClick={() => submitRatingClick(post.id)}
                      className="btn-primary" 
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      Submit Star Rating
                    </button>
                  </div>
                )}

                {/* Rating success state indicator */}
                {hasRated && (
                  <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.05)', padding: '8px 12px', borderRadius: '6px' }}>
                    <CheckCircle size={14} />
                    You have successfully submitted your cryptographically signed rating on this work.
                  </div>
                )}

                {/* Actions bottom-bar */}
                <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '12px', color: 'var(--text-muted)' }}>
                  <button style={{ background: 'transparent', border: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                    <Heart size={16} />
                    <span>{post.likes}</span>
                  </button>
                  <button style={{ background: 'transparent', border: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                    <MessageSquare size={16} />
                    <span>{post.commentsCount} Comments</span>
                  </button>
                  <button 
                    onClick={() => handleShare(post.id)}
                    style={{ background: 'transparent', border: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', marginLeft: 'auto' }}
                  >
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                </div>

              </article>
            );
          })
        )}
      </div>

      {/* Suggested Sidebar panels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Top Creators list */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Top Creators
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {systemUsers.slice(0, 4).map((user) => (
              <div 
                key={user.username}
                onClick={() => navigate('profile', { username: user.username })}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px', borderRadius: '8px', transition: 'var(--transition-smooth)' }}
                className="hover-card-bg"
              >
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>@{user.username}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{user.poofieScore}</span>
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-dim)', display: 'block' }}>SCORE</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explore specific skill categories list */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Trending Skills
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['Solidity', 'Smart Contracts', 'React', 'UI/UX Design', 'ZK-Proofs', 'Technical Writing', 'Auditing'].map((skill) => (
              <span
                key={skill}
                onClick={() => navigate('explore', { search: skill })}
                style={{
                  fontSize: '0.7rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-light)',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  transition: 'var(--transition-smooth)'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
