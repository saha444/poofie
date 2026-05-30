import React, { createContext, useContext, useState, useEffect } from 'react';
import { web3Mock, MOCK_SYSTEM_USERS, shortenAddress } from '../utils/web3Mock';
import { ipfsMock } from '../utils/ipfsMock';

const AppContext = createContext();

// Default initial posts in the system
const INITIAL_POSTS = [
  {
    id: 'post-1',
    creatorUsername: 'alice_v',
    creatorName: 'Alice Vance',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    creatorAddress: '0x32A7d1d2bC39E92d192B45f448e895B309fD13c0',
    type: 'Project',
    title: 'Multi-Sig Safe Auditor Suite',
    description: 'An open-source auditor toolbox to run static analysis on EVM multi-sig vaults. Integrated with Mythril and Slither workflows under a clean CLI interface.',
    ipfsCid: 'QmYwAPJzv5CZ1iaAmdw51921319777174A5452f1e',
    githubUrl: 'https://github.com/alicev/safe-auditor-suite',
    tags: ['Solidity', 'Security', 'DevTools', 'OpenSource'],
    starsCount: 4.8,
    ratings: [
      { rater: 'Marcus K.', stars: 5, comment: 'Saves hours of audit prep. Exceptionally clean code.' },
      { rater: 'Elena Rostova', stars: 4.5, comment: 'Brilliant logic! Found two minor gas optimizations, opened a PR.' }
    ],
    likes: 24,
    commentsCount: 3,
    timestamp: Date.now() - 3600000 * 5, // 5 hours ago
  },
  {
    id: 'post-2',
    creatorUsername: 'marcus_design',
    creatorName: 'Marcus K.',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    creatorAddress: '0x8F94D2554794e537D71C80e1A467DE72aCc3C279',
    type: 'Image',
    title: 'Poofie Brand Identity & Glassmorphism Design System',
    description: 'First iteration of our modular UI design components. Emphasizing translucent overlays, neon drop-shadows, and Outfit typography to feel futuristic yet professional.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    ipfsCid: 'QmXaPnd83918a28C7b3846e9192bC782A7d1',
    tags: ['UI/UX', 'Figma', 'Branding', 'DesignSystem'],
    starsCount: 4.7,
    ratings: [
      { rater: 'Alice Vance', stars: 5, comment: 'Stunning! The dark mode styling is incredibly polished.' },
      { rater: 'Devon Carter', stars: 4.3, comment: 'Extremely cohesive theme. Ready for implementation.' }
    ],
    likes: 38,
    commentsCount: 5,
    timestamp: Date.now() - 3600000 * 12, // 12 hours ago
  },
  {
    id: 'post-3',
    creatorUsername: 'elena_dev',
    creatorName: 'Elena Rostova',
    creatorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    creatorAddress: '0xBC78e3C9C29A6b4EF504C0dBbB77D2fA35eEd406',
    type: 'Article',
    title: 'Zero Knowledge Proofs for Trustless Reputation Attestations',
    description: 'Exploring how Semaphore can allow users to verify their community reputation score on Ethereum without revealing their wallet address or linked credentials. Dive into our mathematical construction and circuits.',
    ipfsCid: 'QmZkPrf22839b4BfD71C80e1A467DE72aC091',
    tags: ['Cryptography', 'ZK-Proofs', 'Privacy', 'Research'],
    starsCount: 4.9,
    ratings: [
      { rater: 'Alice Vance', stars: 5, comment: 'Crucial research. This is the exact trust paradigm Web3 needs.' },
      { rater: 'Devon Carter', stars: 4.8, comment: 'Masterfully explained. Even non-cryptographers can grasp this.' }
    ],
    likes: 42,
    commentsCount: 4,
    timestamp: Date.now() - 3600000 * 24, // 1 day ago
  }
];

// Pre-populated reputation reviews for mock users
const INITIAL_REPUTATION_REVIEWS = {
  alice_v: [
    { reviewer: 'Marcus K.', relationship: 'Collaborator', skill: 5, trust: 5, reliability: 5, comment: 'Incredibly knowledgeable. Alice audited three smart contracts for us and identified two critical vulnerabilities before deployment.', date: 'May 12, 2026' },
    { reviewer: 'Elena Rostova', relationship: 'Teammate', skill: 5, trust: 5, reliability: 5, comment: 'Perfect execution during our hackathon project. Documented every module flawlessly.', date: 'April 28, 2026' }
  ],
  marcus_design: [
    { reviewer: 'Alice Vance', relationship: 'Client', skill: 5, trust: 5, reliability: 4, comment: 'Exceptional designer. Marcus took our abstract concept and delivered stunning wireframes. Highly recommended, though occasionally slightly delayed due to intense detail work.', date: 'May 18, 2026' },
    { reviewer: 'Devon Carter', relationship: 'Collaborator', skill: 5, trust: 5, reliability: 5, comment: 'A joy to work with. Marcus understands Web3 user behavior better than anyone in the industry.', date: 'May 05, 2026' }
  ],
  elena_dev: [
    { reviewer: 'Alice Vance', relationship: 'Teammate', skill: 5, trust: 4, reliability: 4, comment: 'Highly skilled cryptographer. Her implementations are highly optimized.', date: 'May 10, 2026' }
  ],
  devon_c: [
    { reviewer: 'Marcus K.', relationship: 'Collaborator', skill: 5, trust: 5, reliability: 5, comment: 'Devon is a fantastic editor and content writer. Transformed our dev docs into clean, engaging guides.', date: 'May 15, 2026' }
  ]
};

// Initial endorsements
const INITIAL_ENDORSEMENTS = {
  alice_v: [
    { endorserName: 'Marcus K.', endorserUsername: 'marcus_design', relation: 'Worked together', reason: 'Exceptional smart contract engineer and brilliant auditor.' },
    { endorserName: 'Elena Rostova', endorserUsername: 'elena_dev', relation: 'Teammate', reason: 'Unbelievably precise Solidity implementation.' },
    { endorserName: 'Devon Carter', endorserUsername: 'devon_c', relation: 'Collaborator', reason: 'A leader in Web3 decentralized technology.' }
  ],
  marcus_design: [
    { endorserName: 'Alice Vance', endorserUsername: 'alice_v', relation: 'Worked together', reason: 'World-class Web3 UI/UX designer.' },
    { endorserName: 'Elena Rostova', endorserUsername: 'elena_dev', relation: 'Collaborator', reason: 'Stunning design system builder.' },
    { endorserName: 'Devon Carter', endorserUsername: 'devon_c', relation: 'Collaborator', reason: 'Extremely detailed UX analyst.' }
  ],
  elena_dev: [
    { endorserName: 'Alice Vance', endorserUsername: 'alice_v', relation: 'Teammate', reason: 'Outstanding ZK-cryptographer and researcher.' },
    { endorserName: 'Marcus K.', endorserUsername: 'marcus_design', relation: 'Collaborator', reason: 'Excellent mathematical developer and team player.' },
    { endorserName: 'Devon Carter', endorserUsername: 'devon_c', relation: 'Collaborator', reason: 'Highly qualified cryptology expert.' }
  ],
  devon_c: [
    { endorserName: 'Alice Vance', endorserUsername: 'alice_v', relation: 'Collaborator', reason: 'Clear technical documentation specialist.' },
    { endorserName: 'Marcus K.', endorserUsername: 'marcus_design', relation: 'Worked together', reason: 'Outstanding marketing and content coordination.' },
    { endorserName: 'Elena Rostova', endorserUsername: 'elena_dev', relation: 'Collaborator', reason: 'Perfect copy writing for engineering logs.' }
  ]
};

export const AppProvider = ({ children }) => {
  // App routing state
  const [activeView, setActiveView] = useState('landing');
  const [viewParams, setViewParams] = useState({});

  // Wallet Connection State (loads wallet details dynamically from localStorage if connected)
  const [wallet, setWallet] = useState(() => {
    const saved = localStorage.getItem('poofie_wallet');
    return saved ? JSON.parse(saved) : {
      connected: false,
      address: '',
      chainId: null,
      balance: '0.00 ETH',
      signature: ''
    };
  });

  // Logged-in User Profile (loads persistently from localStorage)
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('poofie_userProfile');
    return saved ? JSON.parse(saved) : null;
  });

  // Database of users and their respective profiles
  const [systemUsers, setSystemUsers] = useState(() => {
    const saved = localStorage.getItem('poofie_systemUsers');
    return saved ? JSON.parse(saved) : MOCK_SYSTEM_USERS;
  });

  const [reputationReviews, setReputationReviews] = useState(() => {
    const saved = localStorage.getItem('poofie_reputationReviews');
    return saved ? JSON.parse(saved) : INITIAL_REPUTATION_REVIEWS;
  });

  const [endorsements, setEndorsements] = useState(() => {
    const saved = localStorage.getItem('poofie_endorsements');
    return saved ? JSON.parse(saved) : INITIAL_ENDORSEMENTS;
  });

  // Content Feed Database
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('poofie_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  // User-specific activities & gamification
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('poofie_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 'notif-1', type: 'system', message: 'Welcome to Poofie! Connect your wallet to begin building your on-chain reputation.', timestamp: Date.now() }
    ];
  });

  // Loading indicator states
  const [txLoading, setTxLoading] = useState(false);
  const [ipfsLoading, setIpfsLoading] = useState(false);
  const [txStep, setTxStep] = useState('');

  // Rating privilege state (restricted if Poofie Score falls below threshold)
  const [lowScoreRestricted, setLowScoreRestricted] = useState(() => {
    const saved = localStorage.getItem('poofie_lowScoreRestricted');
    return saved ? JSON.parse(saved) : false;
  });
  
  const SCORE_THRESHOLD = 20;

  // Track simulated active streak
  const [streakCount, setStreakCount] = useState(() => {
    const saved = localStorage.getItem('poofie_streakCount');
    return saved ? parseInt(saved) : 0;
  });

  // XP level curve: 1000 XP per level
  const XP_PER_LEVEL = 1000;

  // Auto-route on mount if wallet and profile already exist!
  useEffect(() => {
    if (wallet.connected && userProfile) {
      setActiveView('feed');
    }
  }, []);

  // --- LOCALSTORAGE PERSISTENCE AUTOMATION ---
  useEffect(() => {
    localStorage.setItem('poofie_wallet', JSON.stringify(wallet));
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem('poofie_userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('poofie_systemUsers', JSON.stringify(systemUsers));
  }, [systemUsers]);

  useEffect(() => {
    localStorage.setItem('poofie_reputationReviews', JSON.stringify(reputationReviews));
  }, [reputationReviews]);

  useEffect(() => {
    localStorage.setItem('poofie_endorsements', JSON.stringify(endorsements));
  }, [endorsements]);

  useEffect(() => {
    localStorage.setItem('poofie_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('poofie_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('poofie_streakCount', streakCount.toString());
  }, [streakCount]);

  useEffect(() => {
    localStorage.setItem('poofie_lowScoreRestricted', JSON.stringify(lowScoreRestricted));
  }, [lowScoreRestricted]);

  // Custom router logic
  const navigate = (view, params = {}) => {
    setActiveView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add notification helper
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

  // Add XP helper with float feedback simulation
  const addXP = (amount, reason) => {
    if (!userProfile) return;

    setUserProfile(prev => {
      const newXP = prev.poofieXP + amount;
      const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        addNotification(
          'milestone',
          `🎉 Level Up! You reached Level ${newLevel}! Keep contributing to build your reputation score.`,
          'View Rewards',
          'xp'
        );
      }

      return {
        ...prev,
        poofieXP: newXP,
        level: newLevel
      };
    });

    // Notify user of XP gain
    addNotification('xp', `🛡️ Earned +${amount} XP: ${reason}`);

    // Create temporary overlay feedback
    const feedback = document.createElement('div');
    feedback.className = 'xp-pop-indicator';
    feedback.innerText = `+${amount} XP`;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 1800);
  };

  // MetaMask Connection Trigger
  const handleConnectWallet = async () => {
    try {
      setTxLoading(true);
      setTxStep('Requesting MetaMask Connection...');
      const connection = await web3Mock.connectWallet();
      
      setTxStep('Verifying address signature...');
      const signatureObj = await web3Mock.personalSign(
        connection.address, 
        `Sign this message to establish your persistent Poofie identity.\n\nNonce: ${Math.floor(Math.random() * 100000)}`
      );

      setWallet({
        connected: true,
        address: connection.address,
        chainId: connection.chainId,
        balance: connection.balance,
        signature: signatureObj.signature
      });

      setTxLoading(false);
      setTxStep('');

      // Check if user already has an established profile in localStorage
      const savedProfile = localStorage.getItem('poofie_userProfile');
      if (savedProfile) {
        addNotification('system', 'Wallet reconnected successfully.');
        navigate('feed');
      } else {
        addNotification('system', 'Wallet connected. Complete human verification to get your badge.');
        navigate('auth');
      }
    } catch (e) {
      console.error(e);
      setTxLoading(false);
      setTxStep('');
      alert('Wallet connection aborted or failed: ' + e.message);
    }
  };

  // Disconnect Wallet
  const handleDisconnect = () => {
    // Clear storage states relating to session
    localStorage.removeItem('poofie_wallet');
    setWallet({
      connected: false,
      address: '',
      chainId: null,
      balance: '0.00 ETH',
      signature: ''
    });
    // Keep profile details in storage for next connects but clear active states
    setUserProfile(null);
    setStreakCount(0);
    setLowScoreRestricted(false);
    navigate('landing');
    addNotification('system', 'Wallet disconnected.');
  };

  // Database Reset Action
  const handleClearDatabase = () => {
    localStorage.clear();
    setWallet({
      connected: false,
      address: '',
      chainId: null,
      balance: '0.00 ETH',
      signature: ''
    });
    setUserProfile(null);
    setSystemUsers(MOCK_SYSTEM_USERS);
    setReputationReviews(INITIAL_REPUTATION_REVIEWS);
    setEndorsements(INITIAL_ENDORSEMENTS);
    setPosts(INITIAL_POSTS);
    setNotifications([
      { id: 'notif-1', type: 'system', message: 'Database reset complete. Welcome back to Poofie Sandbox!', timestamp: Date.now() }
    ]);
    setStreakCount(0);
    setLowScoreRestricted(false);
    navigate('landing');
    alert('Local browser database has been reset completely!');
  };

  // Auth human verification flow
  const handleAuthVerify = async (email, phone, usernameInput) => {
    try {
      setTxLoading(true);
      setTxStep('Uploading verification records to IPFS...');
      const metadata = { emailHash: 'hash_email_sha256', phoneHash: 'hash_phone_sha256', wallet: wallet.address };
      const ipfsResult = await ipfsMock.uploadMetadata(metadata);

      setTxStep('Minting Verified Human badge NFT on Ethereum...');
      const mintResult = await web3Mock.mintVerificationBadge(wallet.address, 'human');

      // Initialize user profile structure
      const newProfile = {
        address: wallet.address,
        name: usernameInput.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        username: usernameInput || 'new_user',
        bio: '',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        skills: [],
        portfolio: {},
        badges: { verifiedHuman: true, verifiedProfessional: false },
        poofieScore: 10,
        poofieXP: 500,
        level: 1,
        ratingStreak: 0,
        interests: [],
        contentScore: 10,
        reputationScore: 0,
      };

      setUserProfile(newProfile);
      setTxLoading(false);
      setTxStep('');

      addNotification('success', 'Verified Human NFT minted! ✅ Profile created.');
      navigate('onboarding');
    } catch (e) {
      console.error(e);
      setTxLoading(false);
      setTxStep('');
      alert('Verification transaction failed: ' + e.message);
    }
  };

  // Complete onboarding profile configurations
  const handleCompleteOnboarding = (profileDetails) => {
    setUserProfile(prev => {
      const updated = {
        ...prev,
        name: profileDetails.name || prev.name,
        bio: profileDetails.bio || 'Building in Web3.',
        avatar: profileDetails.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        skills: profileDetails.skills || prev.skills,
        portfolio: profileDetails.portfolio || prev.portfolio,
        interests: profileDetails.interests || prev.interests,
        poofieXP: prev.poofieXP + 300
      };
      return updated;
    });

    addNotification('success', 'Profile onboarding completed! Welcome to Poofie Feed.');
    navigate('feed');
  };

  // Create post and submit metadata to IPFS/EVM
  const handleCreatePost = async (title, description, tags, type, mediaFile, githubUrl) => {
    if (!userProfile) return;

    try {
      setIpfsLoading(true);
      setTxStep('Encrypting and uploading media file to IPFS...');
      let ipfsMedia = null;
      if (mediaFile) {
        ipfsMedia = await ipfsMock.uploadFile(mediaFile);
      } else {
        await ipfsMock.uploadFile({ size: description.length * 10 });
      }

      setTxStep('Pinning post metadata payload to IPFS IPNS...');
      const metadata = {
        title,
        description,
        tags,
        type,
        mediaCid: ipfsMedia?.cid || 'none',
        creator: wallet.address,
        timestamp: Date.now()
      };
      const ipfsMeta = await ipfsMock.uploadMetadata(metadata);

      setTxStep('Broadcasting transaction to Ethereum network...');
      const tx = await web3Mock.sendEVMTransaction(
        wallet.address, 
        '0xpoofiecontentregistryaddress', 
        `registerContent("${ipfsMeta.cid}")`
      );

      const newPost = {
        id: `post-${Date.now()}`,
        creatorUsername: userProfile.username,
        creatorName: userProfile.name,
        creatorAvatar: userProfile.avatar,
        creatorAddress: userProfile.address,
        type,
        title,
        description,
        imageUrl: type === 'Image' ? (mediaFile ? URL.createObjectURL(mediaFile) : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800') : null,
        ipfsCid: ipfsMeta.cid,
        githubUrl: type === 'Project' ? (githubUrl || 'https://github.com') : null,
        tags,
        starsCount: 0,
        ratings: [],
        likes: 0,
        commentsCount: 0,
        timestamp: Date.now(),
      };

      setPosts(prev => [newPost, ...prev]);
      setIpfsLoading(false);
      setTxStep('');

      addXP(150, 'Published content to IPFS');
      addNotification('success', `Post published on-chain! Tx: ${shortenAddress(tx.txHash)}`, 'View Post', 'profile', { username: userProfile.username });
      navigate('feed');
    } catch (e) {
      console.error(e);
      setIpfsLoading(false);
      setTxStep('');
      alert('Failed to publish content on IPFS.');
    }
  };

  // Content star-rating flow
  const handleRateContent = async (postId, stars, comment) => {
    if (!userProfile) return;
    if (lowScoreRestricted) {
      alert('Rating privileges restricted. Improve your Poofie Score first!');
      return;
    }

    try {
      setTxLoading(true);
      setTxStep('Generating zero-knowledge Content Quality Attestation...');
      const signatureObj = await web3Mock.personalSign(
        wallet.address, 
        `Rate Post ${postId}: ${stars} Stars`
      );

      setTxStep('Submitting rating block to on-chain ContentRegistry...');
      await web3Mock.sendEVMTransaction(
        wallet.address, 
        '0xpoofiecontentregistry', 
        `rateContent("${postId}", ${stars}, "${signatureObj.signature}")`
      );

      let updatedPostCreator = null;
      let postTitle = '';

      setPosts(prevPosts => {
        return prevPosts.map(post => {
          if (post.id === postId) {
            postTitle = post.title;
            const updatedRatings = [...post.ratings, {
              rater: userProfile.name,
              stars,
              comment
            }];
            const totalStars = updatedRatings.reduce((sum, r) => sum + r.stars, 0);
            const averageStars = parseFloat((totalStars / updatedRatings.length).toFixed(1));
            updatedPostCreator = post.creatorUsername;

            return {
              ...post,
              ratings: updatedRatings,
              starsCount: averageStars
            };
          }
          return post;
        });
      });

      // Update creator's Content Score in users database
      if (updatedPostCreator) {
        setSystemUsers(prevUsers => {
          return prevUsers.map(sysUser => {
            if (sysUser.username === updatedPostCreator) {
              const ratingImpact = stars >= 4 ? 3 : stars <= 2 ? -2 : 1;
              const newContentScore = Math.max(0, sysUser.contentScore + ratingImpact);
              const newPoofieScore = newContentScore + sysUser.reputationScore;
              return {
                ...sysUser,
                contentScore: newContentScore,
                poofieScore: newPoofieScore
              };
            }
            return sysUser;
          });
        });

        // If current user is the owner, also sync their active userProfile
        if (updatedPostCreator === userProfile.username) {
          setUserProfile(prev => {
            const ratingImpact = stars >= 4 ? 3 : stars <= 2 ? -2 : 1;
            const newContentScore = Math.max(0, prev.contentScore + ratingImpact);
            const newPoofieScore = newContentScore + prev.reputationScore;
            return {
              ...prev,
              contentScore: newContentScore,
              poofieScore: newPoofieScore
            };
          });
        }
      }

      setTxLoading(false);
      setTxStep('');

      addXP(50, 'Rated community content');
      setStreakCount(prev => prev + 1);
      addNotification('success', `Submitted ${stars}★ rating on post: "${postTitle}"`);
    } catch (e) {
      console.error(e);
      setTxLoading(false);
      setTxStep('');
      alert('Failed to submit post rating: ' + e.message);
    }
  };

  // Professional reputation rating flow (Skill, Trust, Reliability)
  const handleRateReputation = async (targetUsername, ratings, comment, relationship, customRaterName = null) => {
    if (!userProfile && !customRaterName) return;

    const reviewerName = customRaterName || userProfile.name;

    try {
      setTxLoading(true);
      setTxStep('Assembling reputation vector components...');
      const ratingsHash = `skill:${ratings.skill};trust:${ratings.trust};reliability:${ratings.reliability}`;
      
      let signature = '0x_simulated_sig';
      if (!customRaterName) {
        const signatureObj = await web3Mock.personalSign(
          wallet.address, 
          `Rate User ${targetUsername} Reputation: ${ratingsHash}`
        );
        signature = signatureObj.signature;
      }

      setTxStep('Encrypting and uploading reviews payload to IPFS...');
      const ipfsResult = await ipfsMock.uploadMetadata({
        target: targetUsername,
        rater: customRaterName || userProfile.username,
        ratings,
        comment,
        relationship,
        signature
      });

      setTxStep('Anchoring metadata hash to Ethereum Reputation Score Contract...');
      await web3Mock.sendEVMTransaction(
        wallet.address,
        '0xpoofiereputationregistry',
        `submitReputationReview("${targetUsername}", "${ipfsResult.cid}")`
      );

      const newReview = {
        reviewer: reviewerName,
        relationship,
        skill: ratings.skill,
        trust: ratings.trust,
        reliability: ratings.reliability,
        comment,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      // Append to reviews
      setReputationReviews(prev => ({
        ...prev,
        [targetUsername]: [newReview, ...(prev[targetUsername] || [])]
      }));

      // Recalculate average reputation
      const userReviews = [newReview, ...(reputationReviews[targetUsername] || [])];
      const avgReviewScore = userReviews.reduce((sum, r) => sum + ((r.skill + r.trust + r.reliability) / 3), 0) / userReviews.length;
      
      // Update target user's scores
      setSystemUsers(prevUsers => {
        return prevUsers.map(sysUser => {
          if (sysUser.username === targetUsername) {
            const newReputationScore = Math.min(100, Math.round(avgReviewScore * 10));
            const newPoofieScore = sysUser.contentScore + newReputationScore;
            return {
              ...sysUser,
              reputationScore: newReputationScore,
              poofieScore: newPoofieScore
            };
          }
          return sysUser;
        });
      });

      // If targeting self (e.g. coworker reviews), update profile state
      if (targetUsername === userProfile?.username) {
        setUserProfile(prev => {
          const newReputationScore = Math.min(100, Math.round(avgReviewScore * 10));
          const newPoofieScore = prev.contentScore + newReputationScore;
          return {
            ...prev,
            reputationScore: newReputationScore,
            poofieScore: newPoofieScore
          };
        });
      }

      setTxLoading(false);
      setTxStep('');

      if (!customRaterName) {
        addXP(100, `Submitted reputation review for @${targetUsername}`);
        addNotification('success', `Reputation review for @${targetUsername} submitted!`, 'View Reputation', 'profile', { username: targetUsername });
        navigate('profile', { username: targetUsername });
      }
    } catch (e) {
      console.error(e);
      setTxLoading(false);
      setTxStep('');
      alert('Reputation submission failed: ' + e.message);
    }
  };

  // Submit profile endorsement
  const handleEndorseUser = async (targetUsername, reason, relationship, customEndorser = null) => {
    if (!userProfile && !customEndorser) return;

    const endorserName = customEndorser?.name || userProfile.name;
    const endorserUsername = customEndorser?.username || userProfile.username;

    try {
      setTxLoading(true);
      setTxStep('Generating cryptographically signed endorsement attestation...');
      if (!customEndorser) {
        await web3Mock.personalSign(wallet.address, `Endorse @${targetUsername}: ${reason}`);
      }

      setTxStep('Broadcasting transaction to EndorsementRegistry...');
      await web3Mock.sendEVMTransaction(
        wallet.address,
        '0xpoofieendorsementregistry',
        `endorseUser("${targetUsername}")`
      );

      const newEndorsement = {
        endorserName,
        endorserUsername,
        relation: relationship,
        reason
      };

      setEndorsements(prev => ({
        ...prev,
        [targetUsername]: [newEndorsement, ...(prev[targetUsername] || [])]
      }));

      setTxLoading(false);
      setTxStep('');

      if (!customEndorser) {
        addXP(80, `Endorsed @${targetUsername}`);
        addNotification('success', `You have endorsed @${targetUsername}!`, 'View Profile', 'profile', { username: targetUsername });
        navigate('profile', { username: targetUsername });
      }
    } catch (e) {
      console.error(e);
      setTxLoading(false);
      setTxStep('');
      alert('Endorsement failed: ' + e.message);
    }
  };

  // Simulate 3 incoming professional endorsements from Alice, Marcus, and Elena
  const simulateEndorsementsForMe = () => {
    if (!userProfile) return;

    setTxLoading(true);
    setTxStep('Simulating network validations...');

    setTimeout(() => {
      const mockAliceEndorsement = {
        endorserName: 'Alice Vance',
        endorserUsername: 'alice_v',
        relation: 'Client',
        reason: 'Consistently provides high-quality codebase setups and outstanding engineering precision.'
      };

      const mockMarcusEndorsement = {
        endorserName: 'Marcus K.',
        endorserUsername: 'marcus_design',
        relation: 'Collaborator',
        reason: 'Exceptional professional with massive creative capacity and thorough reliability in complex deliverables.'
      };

      const mockElenaEndorsement = {
        endorserName: 'Elena Rostova',
        endorserUsername: 'elena_dev',
        relation: 'Teammate',
        reason: 'A critical asset to our project research. Brilliant execution under pressure.'
      };

      setEndorsements(prev => ({
        ...prev,
        [userProfile.username]: [
          mockAliceEndorsement,
          mockMarcusEndorsement,
          mockElenaEndorsement,
          ...(prev[userProfile.username] || [])
        ]
      }));

      setTxLoading(false);
      setTxStep('');

      addNotification('success', '📩 You received 3 endorsements from verified professionals!');
      addXP(100, 'Received community endorsements');
    }, 2000);
  };

  // Submit Professional Verification Application
  const handleApplyForProfessional = async (profession, credentials, portfolioLinks) => {
    if (!userProfile) return;
    const userEndorsements = endorsements[userProfile.username] || [];

    if (userEndorsements.length < 3) {
      alert('You need a minimum of 3 endorsements from verified professionals to apply. Use the "Collaborator Hub" or click "Simulate Endorsements" to fulfill this requirement!');
      return;
    }

    try {
      setTxLoading(true);
      setTxStep('Packaging professional dossier (credentials + proof of work)...');
      const ipfsResult = await ipfsMock.uploadMetadata({
        profession,
        credentials,
        portfolioLinks,
        endorsements: userEndorsements
      });

      setTxStep('Submitting professional application to Poofie Verifier DAO contract...');
      await web3Mock.sendEVMTransaction(
        wallet.address,
        '0xpoofieverifierdao',
        `applyProfessional("${ipfsResult.cid}")`
      );

      setTxStep('Minting Verified Professional Badge NFT ⭐...');
      const mintResult = await web3Mock.mintVerificationBadge(wallet.address, 'professional');

      setUserProfile(prev => ({
        ...prev,
        badges: {
          ...prev.badges,
          verifiedProfessional: true
        },
        poofieXP: prev.poofieXP + 800,
        reputationScore: prev.reputationScore + 30,
        poofieScore: prev.contentScore + prev.reputationScore + 30
      }));

      setTxLoading(false);
      setTxStep('');

      addNotification('success', '⭐ Verified Professional NFT minted! The badge is active on your profile.');
      navigate('profile', { username: userProfile.username });
    } catch (e) {
      console.error(e);
      setTxLoading(false);
      setTxStep('');
      alert('Professional verification failed: ' + e.message);
    }
  };

  // Toggle rating restriction simulation in Settings
  const simulateLowScoreRestriction = (enable) => {
    setLowScoreRestricted(enable);
    if (enable) {
      setUserProfile(prev => ({
        ...prev,
        poofieScore: 12
      }));
      addNotification('warning', '⚠️ Your Poofie Score fell below 20. Rating privileges restricted.');
    } else {
      setUserProfile(prev => ({
        ...prev,
        poofieScore: 45
      }));
      addNotification('success', '✅ Rating privileges restored! Poofie Score healthy.');
    }
  };

  // Simulate daily check-in activity
  const triggerDailyQuest = () => {
    if (!userProfile) return;
    addXP(100, 'Completed daily on-chain identity check-in');
    setStreakCount(prev => prev + 1);
    addNotification('success', '📅 Daily check-in complete! XP awarded.');
  };

  return (
    <AppContext.Provider value={{
      activeView,
      viewParams,
      wallet,
      userProfile,
      systemUsers,
      reputationReviews,
      endorsements,
      posts,
      notifications,
      txLoading,
      ipfsLoading,
      txStep,
      lowScoreRestricted,
      streakCount,
      SCORE_THRESHOLD,
      navigate,
      handleConnectWallet,
      handleDisconnect,
      handleClearDatabase,
      handleAuthVerify,
      handleCompleteOnboarding,
      handleCreatePost,
      handleRateContent,
      handleRateReputation,
      handleEndorseUser,
      simulateEndorsementsForMe,
      handleApplyForProfessional,
      simulateLowScoreRestriction,
      triggerDailyQuest,
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
