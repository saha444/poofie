import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { shortenAddress } from '../utils/web3Mock';
import { 
  Search, 
  Filter, 
  Award, 
  Layers, 
  CheckCircle,
  Briefcase,
  Star,
  BookOpen
} from 'lucide-react';

const PROFESSIONS = [
  'All Professions', 'Developer', 'Designer', 'Writer', 'Photographer', 'Researcher', 'Freelancer'
];

export default function Explore() {
  const { 
    systemUsers, 
    posts, 
    userProfile, 
    navigate,
    viewParams 
  } = useApp();

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'posts'
  const [searchQuery, setSearchQuery] = useState(viewParams.search || '');
  const [selectedProfession, setSelectedProfession] = useState('All Professions');
  const [onlyVerifiedProf, setOnlyVerifiedProf] = useState(false);
  const [minScore, setMinScore] = useState(0);

  // Sync if explore is navigated with a search parameter
  useEffect(() => {
    if (viewParams.search) {
      setSearchQuery(viewParams.search);
    }
  }, [viewParams.search]);

  // Combine Active User and System Users to have a cohesive list
  const allUsers = userProfile ? [userProfile, ...systemUsers] : systemUsers;

  // Filter Users
  const filteredUsers = allUsers.filter(user => {
    // 1. Search Query (Name, Username, Skills)
    const matchesSearch = searchQuery.trim() === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Profession / Skill matching
    const matchesProfession = selectedProfession === 'All Professions' ||
      user.bio.toLowerCase().includes(selectedProfession.toLowerCase()) ||
      (selectedProfession === 'Developer' && user.skills.some(s => ['Solidity', 'React', 'TypeScript', 'Cryptography', 'ZK-Proofs'].includes(s))) ||
      (selectedProfession === 'Designer' && user.skills.some(s => ['UI/UX Design', 'Figma', 'Prototyping', 'Web3 Design'].includes(s))) ||
      (selectedProfession === 'Writer' && user.skills.some(s => ['Technical Writing', 'SEO'].includes(s)));

    // 3. Only verified professional badge
    const matchesVerified = !onlyVerifiedProf || user.badges.verifiedProfessional;

    // 4. Min Score
    const matchesScore = user.poofieScore >= minScore;

    return matchesSearch && matchesProfession && matchesVerified && matchesScore;
  });

  // Filter Posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery.trim() === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Search Header panel */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>Ecosystem Explore</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Discover highly rated projects, verified Web3 professionals, and research papers indexed on Poofie.
        </p>

        {/* Search bar input */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search by name, username handle, or specific skill tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '44px', borderRadius: '8px' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <div style={{ display: 'flex', border: '1px solid var(--border-light)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
            <button
              onClick={() => setActiveTab('users')}
              style={{
                background: activeTab === 'users' ? 'var(--accent-gradient)' : 'transparent',
                border: 'none',
                color: activeTab === 'users' ? '#000' : 'var(--text-muted)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '0.8rem',
                padding: '10px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              Discover Users
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              style={{
                background: activeTab === 'posts' ? 'var(--accent-gradient)' : 'transparent',
                border: 'none',
                color: activeTab === 'posts' ? '#000' : 'var(--text-muted)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '0.8rem',
                padding: '10px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              Discover Content
            </button>
          </div>
        </div>
      </div>

      {/* Main filters and results view */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
        
        {/* Sidebar Filters (only shown for users tab, or generic) */}
        <div className="glass-panel" style={{ padding: '20px', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', color: 'var(--accent-cyan)' }}>
            <Filter size={16} />
            <strong style={{ fontSize: '0.85rem', fontFamily: 'var(--font-heading)' }}>Discovery Filters</strong>
          </div>

          {/* Profession Category */}
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>PROFESSION</label>
            <select
              value={selectedProfession}
              onChange={(e) => setSelectedProfession(e.target.value)}
              className="input-field"
              style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', color: 'var(--text-main)', width: '100%' }}
            >
              {PROFESSIONS.map(prof => (
                <option key={prof} value={prof} style={{ background: '#0c0c12' }}>{prof}</option>
              ))}
            </select>
          </div>

          {/* Verification Badge checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input 
              type="checkbox"
              id="verified-prof-check"
              checked={onlyVerifiedProf}
              onChange={(e) => setOnlyVerifiedProf(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <label htmlFor="verified-prof-check" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              Only Verified Professionals ⭐
            </label>
          </div>

          {/* Minimum score slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
              <span>MIN POOFIE SCORE</span>
              <strong style={{ color: 'var(--accent-cyan)' }}>{minScore}+</strong>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={minScore}
              onChange={(e) => setMinScore(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
            />
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedProfession('All Professions');
              setOnlyVerifiedProf(false);
              setMinScore(0);
            }}
            className="btn-secondary"
            style={{ fontSize: '0.75rem', padding: '8px', justifyContent: 'center' }}
          >
            Reset All Filters
          </button>
        </div>

        {/* Results grid */}
        <div>
          {activeTab === 'users' ? (
            /* Discover Users */
            filteredUsers.length === 0 ? (
              <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-dim)' }}>
                No creators matched your filters.
              </div>
            ) : (
              <div className="user-grid">
                {filteredUsers.map((user) => (
                  <div 
                    key={user.username} 
                    className="glass-panel glow-cyan" 
                    style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}
                  >
                    {/* User profile picture & core */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '1px solid var(--border-light)'
                      }}>
                        <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{user.name}</h3>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>@{user.username}</span>
                      </div>
                    </div>

                    {/* Verification tags */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {user.badges.verifiedHuman && (
                        <span className="badge-tag badge-human" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>
                          Human
                        </span>
                      )}
                      {user.badges.verifiedProfessional && (
                        <span className="badge-tag badge-professional" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>
                          Professional
                        </span>
                      )}
                    </div>

                    {/* Bio */}
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4', flex: 1, minHeight: '40px' }}>
                      {user.bio ? (user.bio.substring(0, 80) + (user.bio.length > 80 ? '...' : '')) : 'No introduction provided.'}
                    </p>

                    {/* Skills list */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', height: '24px', overflow: 'hidden' }}>
                      {user.skills.slice(0, 3).map(skill => (
                        <span key={skill} style={{ fontSize: '0.6rem', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: '8px', color: 'var(--text-muted)' }}>
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Score section */}
                    <div style={{
                      borderTop: '1px solid var(--border-light)',
                      paddingTop: '12px',
                      display: 'flex',
                      justifyContent: 'between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block' }}>POOFIE SCORE</span>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{user.poofieScore}</span>
                      </div>
                      <button 
                        onClick={() => navigate('profile', { username: user.username })}
                        className="btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '0.7rem' }}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Discover Content */
            filteredPosts.length === 0 ? (
              <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-dim)' }}>
                No published publications matched your filters.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredPosts.map((post) => (
                  <div 
                    key={post.id} 
                    className="glass-panel glow-cyan" 
                    style={{ padding: '20px', display: 'flex', justifyContent: 'between', gap: '20px', cursor: 'pointer' }}
                    onClick={() => navigate('feed')}
                  >
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.65rem', background: 'rgba(0, 242, 254, 0.05)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '10px' }}>
                        {post.type}
                      </span>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '6px 0 4px 0', color: 'var(--text-main)' }}>{post.title}</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        {post.description.substring(0, 150)}...
                      </p>
                      
                      <div style={{ display: 'flex', gap: '12px', marginTop: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>By @{post.creatorUsername}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#f59e0b' }}>
                          <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                          <span>{post.starsCount}</span>
                        </div>
                      </div>
                    </div>
                    {post.imageUrl && (
                      <div style={{ width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)', shrink: 0 }}>
                        <img src={post.imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>

      </div>

    </div>
  );
}
