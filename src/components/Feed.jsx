import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Trophy, 
  Send, 
  Share2, 
  Code, 
  Briefcase,
  Layers, 
  Sparkles,
  GitFork,
  ArrowRight,
  MessageSquare,
  Bookmark,
  CheckCircle,
  Plus
} from 'lucide-react';

export default function Feed() {
  const { 
    posts, 
    userProfile, 
    navigate,
    handleCreatePost,
    handleApplyToOpportunity,
    addNotification
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('All');
  
  // Create Post Drawer Form State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newType, setNewType] = useState('Project Showcase');
  const [roleInput, setRoleInput] = useState('');
  const [projInput, setProjInput] = useState('');
  const [xpInput, setXpInput] = useState(200);

  // Clan Chat State
  const [selectedClanChat, setSelectedClanChat] = useState('');
  const [chatMessageInput, setChatMessageInput] = useState('');
  const [clanDiscussions, setClanDiscussions] = useState({
    'AI Builders': [
      { sender: 'alice_v', name: 'Alice Vance', msg: 'Has anyone benchmarked the new LLM reasoning speeds? The latency spikes are massive.', time: '10m ago' },
      { sender: 'devon_c', name: 'Devon Carter', msg: 'We adjusted our recursive search weights and saved 300ms in agent loops. Open to sharing our config!', time: '5m ago' }
    ],
    'Frontend Guild': [
      { sender: 'marcus_design', name: 'Marcus K.', msg: 'Working on a translucent overlay for our leagues card. Glassmorphic styles look super slick in dark mode.', time: '1h ago' }
    ],
    'Research Circle': [
      { sender: 'elena_dev', name: 'Elena Rostova', msg: 'Just published the Semaphore credential circuits on crates.io! Check it out.', time: '2h ago' }
    ],
    'Hackathon Warriors': [
      { sender: 'devon_c', name: 'Devon Carter', msg: 'Hack4Bengal registrations closing soon. Who needs a Strategist or Catalyst to pitch?', time: '4h ago' }
    ]
  });

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'All') return true;
    return post.type === activeFilter;
  });

  // Handle new post submit
  const handlePublishPost = (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return alert('Please enter a title and description.');
    
    const tagsArr = newTags.split(',').map(t => t.trim()).filter(Boolean);
    
    let oppDetails = null;
    if (newType !== 'Project Showcase' && newType !== 'League Launch') {
      oppDetails = {
        role: roleInput || 'General Collaborator',
        location: 'Remote',
        project: projInput || 'Hobby Dapp',
        xpReward: parseInt(xpInput) || 200
      };
    }

    handleCreatePost(newTitle, newDesc, tagsArr, newType, oppDetails);

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewTags('');
    setNewType('Project Showcase');
    setRoleInput('');
    setProjInput('');
    setShowCreateForm(false);
  };

  // Submit clan chat message
  const handleSendClanChat = (e) => {
    e.preventDefault();
    if (!chatMessageInput.trim() || !selectedClanChat) return;

    const newMsg = {
      sender: userProfile?.username || 'satoshi',
      name: userProfile?.name || 'Satoshi Nakamoto',
      msg: chatMessageInput.trim(),
      time: 'Just now'
    };

    setClanDiscussions(prev => ({
      ...prev,
      [selectedClanChat]: [...(prev[selectedClanChat] || []), newMsg]
    }));

    setChatMessageInput('');

    // Trigger simulated mentor reply after a brief delay!
    setTimeout(() => {
      let botResponse = "That sounds awesome! Let me know if you need any architectural blueprints.";
      if (selectedClanChat === 'AI Builders') {
        botResponse = "Agent routing is super optimized in standard PyTorch pipelines. Try mapping the state tree!";
      } else if (selectedClanChat === 'Frontend Guild') {
        botResponse = "Make sure the responsive layout uses flexible grids instead of fixed sizes!";
      }
      
      const botMsg = {
        sender: 'alice_v',
        name: 'Alice Vance (Mentor 🎓)',
        msg: botResponse,
        time: 'Just now'
      };

      setClanDiscussions(prev => ({
        ...prev,
        [selectedClanChat]: [...(prev[selectedClanChat] || []), botMsg]
      }));
      addNotification('success', `💬 New mentor advice received in ${selectedClanChat} clan!`);
    }, 2000);
  };

  const handleSharePost = (title) => {
    navigator.clipboard.writeText(`${window.location.origin}/opportunity/${title.replace(/\s+/g, '-').toLowerCase()}`);
    alert(`Link to "${title}" copied to clipboard!`);
  };

  // Set default clan chat on mount if they have joined any
  React.useEffect(() => {
    if (userProfile?.clan && !selectedClanChat) {
      setSelectedClanChat(userProfile.clan);
    }
  }, [userProfile]);

  return (
    <div className="animate-slide-up" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
      
      {/* LEFT COLUMN: Opportunity Network Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Navigation & Publisher bar */}
        <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['All', 'Teammate Request', 'Collaborator Request', 'Project Showcase', 'League Launch'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`tab-btn ${activeFilter === filter ? 'active' : ''}`}
                style={{ fontSize: '0.8rem', padding: '6px 12px', whiteSpace: 'nowrap' }}
              >
                {filter === 'All' ? 'Opportunity Feed' : filter}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.8rem' }}
          >
            <Plus size={16} />
            Post Opportunity
          </button>
        </div>

        {/* Create Post Form Card */}
        {showCreateForm && (
          <form onSubmit={handlePublishPost} className="glass-panel animate-slide-up" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--accent-cyan)' }} />
              Broadcast Developer Opportunity
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>LISTING TITLE</label>
                <input 
                  type="text" 
                  placeholder="e.g. Looking for Backend Dev for AI Agents" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>LISTING TYPE</label>
                <select 
                  value={newType} 
                  onChange={(e) => setNewType(e.target.value)}
                  className="input-field"
                  style={{ background: '#0a0a0f', height: '42px', border: '1px solid var(--border-light)', borderRadius: '8px', color: 'var(--text-main)' }}
                >
                  <option value="Project Showcase">Project Showcase</option>
                  <option value="Teammate Request">Teammate Request</option>
                  <option value="Collaborator Request">Collaborator Request</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>DESCRIPTION</label>
              <textarea 
                placeholder="Explain the project roadmap, learning goals, or teammate requirements..." 
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="input-field"
                style={{ height: '80px', resize: 'none' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>TECH STACK TAGS (COMMA SEPARATED)</label>
                <input 
                  type="text" 
                  placeholder="React, PyTorch, Node.js" 
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="input-field"
                />
              </div>

              {newType !== 'Project Showcase' && (
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>ROLE & XP REWARD</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="e.g. Backend Dev" 
                      value={roleInput}
                      onChange={(e) => setRoleInput(e.target.value)}
                      className="input-field" 
                      style={{ flex: 2 }}
                    />
                    <input 
                      type="number" 
                      placeholder="XP" 
                      value={xpInput}
                      onChange={(e) => setXpInput(e.target.value)}
                      className="input-field" 
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'end', gap: '10px', marginTop: '4px' }}>
              <button type="button" onClick={() => setShowCreateForm(false)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Broadcast Live</button>
            </div>
          </form>
        )}

        {/* FEED POSTS LIST */}
        {filteredPosts.length === 0 ? (
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-dim)' }}>
            No listings found in this opportunity channel.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article key={post.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Post Header */}
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
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-purple)', fontWeight: 600 }}>{post.leagues}</span>
                  </div>
                </div>

                <span style={{
                  fontSize: '0.65rem',
                  background: post.type.includes('Teammate') ? 'rgba(0, 242, 254, 0.08)' : post.type.includes('Collaborator') ? 'rgba(155, 81, 224, 0.08)' : 'rgba(255,255,255,0.05)',
                  color: post.type.includes('Teammate') ? 'var(--accent-cyan)' : post.type.includes('Collaborator') ? 'var(--accent-purple)' : 'var(--text-muted)',
                  border: '1px solid ' + (post.type.includes('Teammate') ? 'rgba(0, 242, 254, 0.2)' : post.type.includes('Collaborator') ? 'rgba(155, 81, 224, 0.2)' : 'var(--border-light)'),
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {post.type}
                </span>
              </div>

              {/* Post Content */}
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: '8px' }}>
                  {post.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {post.description}
                </p>
              </div>

              {/* Special Opportunity details badge */}
              {post.opportunityDetails && (
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '12px'
                }}>
                  <div>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Target Role</span>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--text-main)', display: 'block' }}>{post.opportunityDetails.role}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Project / Challenge</span>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--text-main)', display: 'block' }}>{post.opportunityDetails.project}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>On-Chain Reward</span>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', display: 'block' }}>+{post.opportunityDetails.xpReward} XP</strong>
                  </div>
                </div>
              )}

              {/* Tags and Footer CTAs */}
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {post.tags.map((tag) => (
                    <span key={tag} style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.03)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleSharePost(post.title)} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.7rem' }}>
                    <Share2 size={12} />
                    Share
                  </button>

                  {post.opportunityDetails && post.creatorUsername !== userProfile.username && (
                    <button 
                      onClick={() => handleApplyToOpportunity(post.id)}
                      className="btn-primary" 
                      style={{ padding: '6px 14px', fontSize: '0.7rem' }}
                    >
                      <Send size={12} />
                      Apply & Send DNA Card
                    </button>
                  )}
                </div>
              </div>

            </article>
          ))
        )}

      </div>

      {/* RIGHT COLUMN: Clan discussions & leagues dashboard */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Clans Discussions Hub */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', height: 'fit-content' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} style={{ color: 'var(--accent-cyan)' }} />
            Clan Discussions
          </h4>

          {/* Clan Chat Selector */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {userProfile.joinedClans.map(clan => (
              <button
                key={clan}
                onClick={() => setSelectedClanChat(clan)}
                className={`tab-btn ${selectedClanChat === clan ? 'active' : ''}`}
                style={{ fontSize: '0.7rem', padding: '4px 8px' }}
              >
                {clan.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Clan Chat Box */}
          {selectedClanChat ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Messages container */}
              <div style={{
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '8px',
                padding: '12px',
                height: '200px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                border: '1px solid var(--border-light)'
              }}>
                {(clanDiscussions[selectedClanChat] || []).map((msg, idx) => (
                  <div key={idx} style={{ fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'between', color: msg.sender === userProfile.username ? 'var(--accent-cyan)' : 'var(--accent-purple)' }}>
                      <strong>{msg.name}</strong>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>{msg.time}</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.3' }}>{msg.msg}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendClanChat} style={{ display: 'flex', gap: '6px' }}>
                <input 
                  type="text" 
                  placeholder={`Chat in #${selectedClanChat.toLowerCase().replace(/\s+/g, '-')}`}
                  value={chatMessageInput}
                  onChange={(e) => setChatMessageInput(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '6px 12px' }}>
                  <Send size={12} />
                </button>
              </form>

            </div>
          ) : (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center' }}>
              Join a Clan or select one to view discussions.
            </p>
          )}

        </div>

        {/* Dynamic Starter Leagues */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Trophy size={16} style={{ color: '#f59e0b' }} />
            Active Leagues
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { name: 'GitHub League', rank: userProfile.leagues?.github || 'Bronze', icon: <GitFork size={14} style={{ color: 'var(--accent-cyan)' }} /> },
              { name: 'Hackathon League', rank: userProfile.leagues?.hackathon || 'Bronze', icon: <Trophy size={14} style={{ color: '#f59e0b' }} /> },
              { name: 'Open Source League', rank: userProfile.leagues?.openSource || 'Bronze', icon: <Code size={14} style={{ color: 'var(--accent-purple)' }} /> }
            ].map(league => (
              <div 
                key={league.name} 
                onClick={() => navigate('xp')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'between',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
                  {league.icon}
                  <span>{league.name}</span>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: league.rank === 'Gold' || league.rank === 'Platinum' ? '#f59e0b' : 'var(--text-dim)' }}>
                  {league.rank}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
