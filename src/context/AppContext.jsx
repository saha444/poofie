import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Pre-populated Opportunity Feed
const INITIAL_POSTS = [
  {
    id: 'opp-1',
    creatorUsername: 'alice_v',
    creatorName: 'Alice Vance',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    type: 'Teammate Request',
    title: 'Looking for Frontend Dev for Hack4Bengal 🏆',
    description: 'We are building a zero-knowledge voting dapp for local municipal coordination. Need an absolute wizard in CSS grids and glassmorphism. Maker ⚒️ or Craftsman 💎 DNA preferred!',
    tags: ['React', 'ZK-Proofs', 'DesignSystem', 'Hackathon'],
    leagues: 'Hackathon League (Gold)',
    likes: 42,
    timestamp: Date.now() - 3600000 * 2, // 2 hours ago
    opportunityDetails: {
      role: 'Frontend Developer',
      location: 'Kolkata / Remote',
      project: 'Hack4Bengal 2026',
      xpReward: 250
    }
  },
  {
    id: 'opp-2',
    creatorUsername: 'marcus_design',
    creatorName: 'Marcus K.',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    type: 'Collaborator Request',
    title: 'Building AI Resume Analyzer — Need Backend Developer ⚗️',
    description: 'We are parsing developer profiles into living JSON vector representations and need a backend engineer to build fast FastAPI routing and database indexing.',
    tags: ['FastAPI', 'Python', 'Vector-DB', 'AI-Agents'],
    leagues: 'GitHub League (Platinum)',
    likes: 28,
    timestamp: Date.now() - 3600000 * 5, // 5 hours ago
    opportunityDetails: {
      role: 'Backend/LLM Developer',
      location: 'Remote',
      project: 'AI-Resume-DNA',
      xpReward: 300
    }
  },
  {
    id: 'opp-3',
    creatorUsername: 'elena_dev',
    creatorName: 'Elena Rostova',
    creatorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    type: 'Project Showcase',
    title: 'Zero Knowledge Proofs for Reputation Attestations 🏛️',
    description: 'Just published the semaphore reputation verification circuits! The code is open-source and allows trustless credentials validation without revealing addresses.',
    tags: ['Cryptography', 'Slither', 'Rust', 'OpenSource'],
    leagues: 'Open Source League (Legend)',
    likes: 67,
    timestamp: Date.now() - 3600000 * 12, // 12 hours ago
    opportunityDetails: null
  },
  {
    id: 'opp-4',
    creatorUsername: 'poofie_hq',
    creatorName: 'Poofie Protocol',
    creatorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    type: 'League Launch',
    title: 'AI Builder League Season 2 is Live! 🚀',
    description: 'Get ready for 14 days of intense AI project building. Deploy working AI agents, submit your GitHub repositories, and earn the exclusive "Agent Architect" badge!',
    tags: ['AI-Agents', 'Hackathon', 'LLM', 'Competitive'],
    leagues: 'System Alert',
    likes: 124,
    timestamp: Date.now() - 3600000 * 24, // 1 day ago
    opportunityDetails: null
  }
];

// Pre-populated developers
const MOCK_DEVELOPERS = [
  {
    name: 'Alice Vance',
    username: 'alice_v',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    dnaType: 'Architect',
    secondaryDnaType: 'Scholar',
    domain: 'AI',
    specialization: 'Agent Architect',
    clan: 'AI Builders',
    bio: 'ZK-researcher and Agent Architect. Optimizing smart contract verification circuits.',
    skills: ['Solidity', 'ZK-Proofs', 'Python', 'Rust'],
    poofieXP: 3800,
    level: 4,
    traitScores: { Builder: 65, Explorer: 72, Strategist: 50, Architect: 92, Scholar: 88, Catalyst: 45, Craftsman: 60, Alchemist: 55 },
    leagues: { github: 'Gold', hackathon: 'Silver', openSource: 'Platinum', ai: 'Gold' },
    badges: ['Research Enthusiast 📚', 'Bug Hunter 🐞'],
    connectedAccounts: {
      github: { connected: true, username: 'alicev', repos: 34, stars: 128, contributions: 840 },
      leetcode: { connected: true, username: 'alice_v', solved: 430, contestRating: 1820 },
      devfolio: { connected: true, username: 'alicevance', hackathons: 8, awards: 3 },
      linkedin: { connected: true, username: 'alice-vance' }
    },
    projects: [
      { id: 'ap-1', name: 'Safe Auditor Suite', desc: 'Static analysis toolkit for multi-sig safes.', tech: 'Solidity, Rust' },
      { id: 'ap-2', name: 'ZK Attester Core', desc: 'Semaphore-based credential attestation registry.', tech: 'Circom, React' }
    ]
  },
  {
    name: 'Marcus K.',
    username: 'marcus_design',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    dnaType: 'Maker',
    secondaryDnaType: 'Craftsman',
    domain: 'Web Development',
    specialization: 'Full Stack Developer',
    clan: 'Frontend Guild',
    bio: 'UI/UX obsessive and full stack developer. Building interactive layouts that glow.',
    skills: ['React', 'CSS Grid', 'Node.js', 'TypeScript', 'Web3.js'],
    poofieXP: 2900,
    level: 3,
    traitScores: { Builder: 94, Explorer: 70, Strategist: 52, Architect: 45, Scholar: 38, Catalyst: 60, Craftsman: 88, Alchemist: 50 },
    leagues: { github: 'Gold', hackathon: 'Gold', openSource: 'Silver', ai: 'Bronze' },
    badges: ['Weekend Warrior ⚔️', 'Night Owl 🌙'],
    connectedAccounts: {
      github: { connected: true, username: 'marcus_dev', repos: 22, stars: 74, contributions: 490 },
      leetcode: { connected: false },
      devfolio: { connected: true, username: 'marcusk', hackathons: 12, awards: 5 },
      linkedin: { connected: true, username: 'marcus-k' }
    },
    projects: [
      { id: 'mp-1', name: 'Glassmorphic Design Lib', desc: 'Pre-styled components for cyber-themed React apps.', tech: 'React, CSS' },
      { id: 'mp-2', name: 'Hackathon Scout', desc: 'Aggregates developer challenges globally.', tech: 'Next.js, Tailwind' }
    ]
  },
  {
    name: 'Elena Rostova',
    username: 'elena_dev',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    dnaType: 'Explorer',
    secondaryDnaType: 'Scholar',
    domain: 'Cybersecurity',
    specialization: 'Systems Engineer',
    clan: 'Research Circle',
    bio: 'System builder and open-source audit geek. Exploring zero-knowledge trust layers.',
    skills: ['C++', 'Rust', 'Linux', 'Solidity', 'Go'],
    poofieXP: 4500,
    level: 5,
    traitScores: { Builder: 50, Explorer: 96, Strategist: 60, Architect: 82, Scholar: 90, Catalyst: 35, Craftsman: 70, Alchemist: 65 },
    leagues: { github: 'Platinum', hackathon: 'Bronze', openSource: 'Legend', ai: 'Bronze' },
    badges: ['Bug Hunter 🐞', 'Mentor 🎓'],
    connectedAccounts: {
      github: { connected: true, username: 'elenar', repos: 56, stars: 320, contributions: 1240 },
      leetcode: { connected: true, username: 'elena_leetcode', solved: 620, contestRating: 2010 },
      devfolio: { connected: false },
      linkedin: { connected: true, username: 'elena-rostova' }
    },
    projects: [
      { id: 'ep-1', name: 'Slither EVM Evaluator', desc: 'Custom rulesets for analyzing DeFi vaults.', tech: 'Python, Slither' },
      { id: 'ep-2', name: 'Rust Network Gateway', desc: 'Ultra-low latency RPC multiplexer.', tech: 'Rust, Tokio' }
    ]
  }
];

export const AppProvider = ({ children }) => {
  // App routing
  const [activeView, setActiveView] = useState('landing');
  const [viewParams, setViewParams] = useState({});

  // Session Authentication State (No Web3)
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem('poofie_session');
    return saved ? JSON.parse(saved) : { authenticated: false, email: '' };
  });

  // User Profile
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('poofie_userProfile');
    return saved ? JSON.parse(saved) : null;
  });

  // System Users
  const [systemUsers, setSystemUsers] = useState(() => {
    const saved = localStorage.getItem('poofie_systemUsers');
    return saved ? JSON.parse(saved) : MOCK_DEVELOPERS;
  });

  // Posts Feed
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('poofie_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  // Notifications
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('poofie_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 'notif-1', type: 'system', message: 'Welcome to Poofie Sandbox! Discover your unique Developer DNA.', timestamp: Date.now() }
    ];
  });

  // Streak Count
  const [streakCount, setStreakCount] = useState(() => {
    const saved = localStorage.getItem('poofie_streakCount');
    return saved ? parseInt(saved) : 0;
  });

  const [txLoading, setTxLoading] = useState(false);
  const [ipfsLoading, setIpfsLoading] = useState(false);
  const [txStep, setTxStep] = useState('');

  // Auto-route on mount
  useEffect(() => {
    if (session.authenticated && userProfile) {
      setActiveView('feed');
    }
  }, []);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('poofie_session', JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    localStorage.setItem('poofie_userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('poofie_systemUsers', JSON.stringify(systemUsers));
  }, [systemUsers]);

  useEffect(() => {
    localStorage.setItem('poofie_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('poofie_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('poofie_streakCount', streakCount.toString());
  }, [streakCount]);

  // Navigate helper
  const navigate = (view, params = {}) => {
    setActiveView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Notification
  const addNotification = (type, message, actionText = null, actionView = null, actionParams = {}) => {
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type,
        message,
        actionText,
        actionView,
        actionParams,
        read: false,
        timestamp: Date.now()
      },
      ...prev
    ]);
  };

  // Add XP
  const addXP = (amount, reason) => {
    if (!userProfile) return;
    setUserProfile(prev => {
      const newXP = prev.poofieXP + amount;
      const newLevel = Math.floor(newXP / 1000) + 1;
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        addNotification(
          'milestone',
          `🎉 Level Up! You reached Level ${newLevel}! DNA Traits are becoming richer.`
        );
      }
      return {
        ...prev,
        poofieXP: newXP,
        level: newLevel
      };
    });
    addNotification('xp', `🛡️ Earned +${amount} XP: ${reason}`);

    // floating effect
    const feedback = document.createElement('div');
    feedback.className = 'xp-pop-indicator';
    feedback.innerText = `+${amount} XP`;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 1800);
  };

  // Start Auth Flow
  const handleStartAuth = () => {
    navigate('auth');
  };

  // Disconnect / Log out
  const handleDisconnect = () => {
    setSession({ authenticated: false, email: '' });
    setUserProfile(null);
    setStreakCount(0);
    navigate('landing');
    addNotification('system', 'Logged out successfully.');
  };

  // Database Reset
  const handleClearDatabase = () => {
    localStorage.clear();
    setSession({ authenticated: false, email: '' });
    setUserProfile(null);
    setSystemUsers(MOCK_DEVELOPERS);
    setPosts(INITIAL_POSTS);
    setNotifications([
      { id: 'notif-1', type: 'system', message: 'Database reset complete. Welcome to pristine Poofie Sandbox!', timestamp: Date.now() }
    ]);
    setStreakCount(0);
    navigate('landing');
    alert('Sandbox database has been reset successfully!');
  };

  // Email/Phone credentials claimed
  const handleAuthVerify = (emailVal, phoneVal, usernameInput) => {
    setSession({ authenticated: false, email: emailVal });
    
    const newProfile = {
      name: usernameInput.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      username: usernameInput || 'new_user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      bio: 'Authenticating with developer tools.',
      skills: [],
      projects: [],
      poofieXP: 300,
      level: 1,
      dnaType: '',
      secondaryDnaType: '',
      traitScores: { Builder: 0, Explorer: 0, Strategist: 0, Architect: 0, Scholar: 0, Catalyst: 0, Craftsman: 0, Alchemist: 0 },
      domains: [],
      specialization: '',
      clan: '',
      joinedClans: [],
      leagues: { github: 'Bronze', hackathon: 'Bronze', openSource: 'Bronze', ai: 'Bronze' },
      badges: [],
      connectedAccounts: {
        github: { connected: false },
        leetcode: { connected: false },
        devfolio: { connected: false },
        linkedin: { connected: false }
      }
    };
    setUserProfile(newProfile);
    addNotification('success', 'Email & Phone OTP verified. Mapped handle successfully!');
  };

  // Connect platform account
  const handleConnectAccount = (platform, usernameVal) => {
    if (!userProfile) return;
    
    let mockStats = {};
    if (platform === 'github') {
      mockStats = { connected: true, username: usernameVal || 'satoshi', repos: 18, stars: 45, contributions: 310 };
    } else if (platform === 'leetcode') {
      mockStats = { connected: true, username: usernameVal || 'satoshi_lc', solved: 210, contestRating: 1650 };
    } else if (platform === 'devfolio') {
      mockStats = { connected: true, username: usernameVal || 'satoshidev', hackathons: 4, awards: 1 };
    } else if (platform === 'linkedin') {
      mockStats = { connected: true, username: usernameVal || 'satoshi-nakamoto' };
    }

    setUserProfile(prev => ({
      ...prev,
      connectedAccounts: {
        ...prev.connectedAccounts,
        [platform]: mockStats
      }
    }));

    // authenticate session on connecting at least one platform!
    setSession(prev => ({
      ...prev,
      authenticated: true
    }));

    addNotification('success', `Connected external profile: ${platform.toUpperCase()} (@${usernameVal}). Authentication complete!`);
  };

  // Set computed DNA from quiz
  const handleDNAQuizCompletion = (traitScores) => {
    const sortedTraits = Object.entries(traitScores).sort((a, b) => b[1] - a[1]);
    
    const traitToDna = {
      Builder: 'Maker',
      Architect: 'Architect',
      Explorer: 'Explorer',
      Strategist: 'Strategist',
      Scholar: 'Scholar',
      Alchemist: 'Alchemist',
      Catalyst: 'Catalyst',
      Craftsman: 'Craftsman'
    };

    const primaryTrait = sortedTraits[0][0];
    const secondaryTrait = sortedTraits[1][0];

    const primaryDNA = traitToDna[primaryTrait] || 'Maker';
    const secondaryDNA = traitToDna[secondaryTrait] || 'Explorer';

    setUserProfile(prev => {
      const updated = {
        ...prev,
        traitScores,
        dnaType: primaryDNA,
        secondaryDnaType: secondaryDNA,
        poofieXP: prev.poofieXP + 500
      };
      return updated;
    });

    addNotification('success', `AI Developer DNA Generated: You are a ${primaryDNA} (Secondary: ${secondaryDNA})!`);
  };

  // Complete Domain Setup
  const handleCompleteDomainSetup = (domainsSelected, specialization, clanToJoin) => {
    let baseSkills = [];
    if (specialization.includes('Architect') || specialization.includes('Backend')) {
      baseSkills = ['Node.js', 'FastAPI', 'Python', 'Docker', 'Systems Design'];
    } else if (specialization.includes('ML') || specialization.includes('AI')) {
      baseSkills = ['Python', 'PyTorch', 'HuggingFace', 'OpenAI', 'LangChain'];
    } else if (specialization.includes('Frontend') || specialization.includes('Full Stack')) {
      baseSkills = ['React', 'TypeScript', 'CSS Grid', 'Next.js', 'Redux'];
    } else {
      baseSkills = ['Rust', 'Go', 'Linux CLI', 'Solidity', 'Git'];
    }

    const baseProjects = [
      { id: 'sp-1', name: 'Open Attestation Nodes', desc: 'Decentralized parser mapping code signatures to persona attributes.', tech: baseSkills.slice(0, 3).join(', ') }
    ];

    setUserProfile(prev => {
      const updated = {
        ...prev,
        domains: domainsSelected,
        specialization,
        clan: clanToJoin,
        joinedClans: [clanToJoin],
        skills: baseSkills,
        projects: baseProjects,
        poofieXP: prev.poofieXP + 400,
        bio: `${specialization} specializing in ${domainsSelected.join(' & ')}. Member of ${clanToJoin}.`
      };
      return updated;
    });

    addNotification('success', `Completed onboarding! Welcome to the ${clanToJoin} Clan!`);
    navigate('feed');
  };

  // Create Project Post in Opportunity Network Feed
  const handleCreatePost = (title, description, tags, type, opportunityDetails = null) => {
    if (!userProfile) return;

    const newPost = {
      id: `opp-${Date.now()}`,
      creatorUsername: userProfile.username,
      creatorName: userProfile.name,
      creatorAvatar: userProfile.avatar,
      type,
      title,
      description,
      tags,
      leagues: 'Active Contributor',
      likes: 0,
      timestamp: Date.now(),
      opportunityDetails
    };

    setPosts(prev => [newPost, ...prev]);
    addXP(150, 'Published listing to Opportunity Feed');
    addNotification('success', `Successfully published: "${title}"`);
    navigate('feed');
  };

  // Sandbox Switcher
  const triggerSandboxSwitch = (username) => {
    if (username === 'satoshi') {
      const savedSatoshi = localStorage.getItem('poofie_satoshiBackup');
      if (savedSatoshi) {
        setUserProfile(JSON.parse(savedSatoshi));
      } else {
        setUserProfile({
          name: 'Satoshi Nakamoto',
          username: 'satoshi',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          bio: 'Building the next evolution of developer identity and Discovery.',
          skills: ['C++', 'Rust', 'Solidity', 'Cryptography'],
          projects: [{ id: 'sp-1', name: 'Poofie Protocol Core', desc: 'AI-Powered Developer Identity and Discovery Network.', tech: 'React, Vite, Node.js' }],
          poofieXP: 1200,
          level: 2,
          dnaType: 'Maker',
          secondaryDnaType: 'Scholar',
          domains: ['AI', 'Web Development'],
          specialization: 'Agent Architect',
          clan: 'AI Builders',
          joinedClans: ['AI Builders'],
          leagues: { github: 'Platinum', hackathon: 'Silver', openSource: 'Gold', ai: 'Bronze' },
          badges: ['Night Owl 🌙', 'Bug Hunter 🐞'],
          connectedAccounts: {
            github: { connected: true, username: 'satoshi', repos: 40, stars: 1024, contributions: 1200 },
            leetcode: { connected: false },
            devfolio: { connected: false },
            linkedin: { connected: false }
          }
        });
      }
      setSession({ authenticated: true, email: 'satoshi@bitcoin.org' });
      addNotification('system', 'Switched session to Satoshi Nakamoto (Your Profile).');
      navigate('feed');
      return;
    }

    if (userProfile && userProfile.username === 'satoshi') {
      localStorage.setItem('poofie_satoshiBackup', JSON.stringify(userProfile));
    }

    const dev = systemUsers.find(d => d.username === username);
    if (dev) {
      setUserProfile(dev);
      setSession({ authenticated: true, email: `${username}@poofie.net` });
      addNotification('system', `Switched session to Sandbox Persona: ${dev.name} (${dev.dnaType} DNA)`);
      navigate('feed');
    }
  };

  // Join a new Clan
  const handleJoinClan = (clanName) => {
    if (!userProfile) return;
    if (userProfile.joinedClans.includes(clanName)) {
      alert(`You are already a member of the ${clanName} clan!`);
      return;
    }
    setUserProfile(prev => ({
      ...prev,
      joinedClans: [...prev.joinedClans, clanName]
    }));
    addXP(100, `Joined Clan: ${clanName}`);
    addNotification('success', `Welcome to the ${clanName} Clan! You have unlocked their discussions and resources.`);
  };

  // Apply to Opportunity
  const handleApplyToOpportunity = (postId) => {
    if (!userProfile) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    setTxLoading(true);
    setTxStep('Generating cryptographically verified Developer DNA Card...');

    setTimeout(() => {
      setTxLoading(false);
      setTxStep('');
      addXP(80, `Applied to: ${post.title}`);
      addNotification('success', `Sent your Developer DNA Profile Card to @${post.creatorUsername}! Your skills, domain specialization, and DNA matches have been submitted.`);
      setStreakCount(prev => prev + 1);
    }, 1200);
  };

  // Daily quest streak
  const triggerDailyQuest = () => {
    if (!userProfile) return;
    addXP(100, 'Completed daily sandbox check-in');
    setStreakCount(prev => prev + 1);
    
    if (streakCount >= 2 && !userProfile.badges.includes('Weekend Warrior ⚔️')) {
      setUserProfile(prev => ({
        ...prev,
        badges: [...prev.badges, 'Weekend Warrior ⚔️']
      }));
      addNotification('milestone', '🏆 Streak Milestone! Unlocked the "Weekend Warrior ⚔️" Badge Modifier.');
    } else {
      addNotification('success', '📅 Daily developer streak updated!');
    }
  };

  return (
    <AppContext.Provider value={{
      activeView,
      viewParams,
      session,
      wallet: { connected: session.authenticated }, // Backwards compatibility for App.jsx layout calculations
      userProfile,
      systemUsers,
      posts,
      notifications,
      txLoading,
      ipfsLoading,
      txStep,
      streakCount,
      navigate,
      handleStartAuth,
      handleDisconnect,
      handleClearDatabase,
      handleAuthVerify,
      handleDNAQuizCompletion,
      handleCompleteDomainSetup,
      handleCreatePost,
      triggerSandboxSwitch,
      handleJoinClan,
      handleApplyToOpportunity,
      triggerDailyQuest,
      handleConnectAccount,
      addNotification,
      addXP
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
