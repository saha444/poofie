import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wallet, 
  Mail, 
  Smartphone, 
  UserCheck, 
  Check, 
  ArrowRight, 
  Sparkles,
  GitFork,
  Briefcase,
  Terminal,
  Cpu,
  Layers,
  Compass,
  Trophy,
  Users,
  Star,
  Activity,
  Code
} from 'lucide-react';

export default function LandingAndAuth() {
  const { 
    wallet, 
    handleConnectWallet, 
    handleAuthVerify, 
    handleDNAQuizCompletion,
    handleCompleteDomainSetup,
    handleConnectAccount,
    navigate, 
    activeView,
    handleClearDatabase,
    systemUsers
  } = useApp();

  // Auth local state
  const [email, setEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [username, setUsername] = useState('');
  
  // Stepper navigation
  const [onboardStep, setOnboardStep] = useState('otp'); // 'otp', 'dna_quiz', 'connect_profiles', 'ai_analysis', 'dna_reveal', 'domain_setup', 'clan_league'
  const [loading, setLoading] = useState(false);

  // OTP helpers
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);

  // --- DNA QUIZ LOCAL STATE ---
  const [currentDnaQ, setCurrentDnaQ] = useState(0);
  const [dnaAnswers, setDnaAnswers] = useState({
    Builder: 0, Explorer: 0, Strategist: 0, Architect: 0, Scholar: 0, Catalyst: 0, Craftsman: 0, Alchemist: 0
  });

  const DNA_QUIZ_QUESTIONS = [
    {
      q: "A cutting-edge technology or library just launched. What is your immediate reaction?",
      options: [
        { text: "Open an editor, write a quick scratch script to test it out.", trait: "Builder", weight: 15 },
        { text: "Deep dive into the architecture docs and understand how it works.", trait: "Scholar", weight: 15 },
        { text: "Analyze benchmarks, gaseous cost, and compare it against stack alternatives.", trait: "Strategist", weight: 15 },
        { text: "Scroll Github to see if any prominent open-source leaders have adopted it.", trait: "Explorer", weight: 15 }
      ]
    },
    {
      q: "What is your ultimate dream project style?",
      options: [
        { text: "An end-to-end functional prototype deployed live for immediate use.", trait: "Builder", weight: 15 },
        { text: "A beautifully polished glassmorphic interface with perfect CSS animations.", trait: "Craftsman", weight: 15 },
        { text: "A highly scalable microservice layout with clean asynchronous message queues.", trait: "Architect", weight: 15 },
        { text: "An innovative, weird experiment that combines AI models with IoT hubs.", trait: "Alchemist", weight: 15 }
      ]
    },
    {
      q: "A critical bug is discovered in production! What is your debugging style?",
      options: [
        { text: "Meticulously trace the logs line-by-line, isolating variables systematically.", trait: "Craftsman", weight: 15 },
        { text: "Read the source code libraries and search deep internal issues.", trait: "Scholar", weight: 15 },
        { text: "Organize a war-room, pull in collaborators, and brainstorm options.", trait: "Catalyst", weight: 15 },
        { text: "Hotfix it rapidly, deploy immediately, and optimize in the morning.", trait: "Builder", weight: 15 }
      ]
    },
    {
      q: "Your squad enters a fast-paced 48-hour hackathon. What role do you naturally fall into?",
      options: [
        { text: "The primary coder spinning up the repository and churning out features.", trait: "Builder", weight: 15 },
        { text: "The creative thinker proposing crazy pivots and synthesizing custom APIs.", trait: "Alchemist", weight: 15 },
        { text: "The master strategist designing the presentation, timeline, and competitive angle.", trait: "Strategist", weight: 15 },
        { text: "The team coordinator keeping everyone fueled, inspired, and aligned.", trait: "Catalyst", weight: 15 }
      ]
    },
    {
      q: "What keeps you coding late into the night, completely losing track of time?",
      options: [
        { text: "Completing every single item on my roadmap checklist.", trait: "Builder", weight: 15 },
        { text: "Polishing a layout to look perfectly pixel-aligned and responsive.", trait: "Craftsman", weight: 15 },
        { text: "Cracking a highly complex algorithms problem with optimal complexity.", trait: "Strategist", weight: 15 },
        { text: "Tinkering with an unfamiliar framework out of sheer curiosity.", trait: "Explorer", weight: 15 }
      ]
    },
    {
      q: "How do you prefer to expand your technical skills?",
      options: [
        { text: "Reading academic research papers, whitepapers, and thick books.", trait: "Scholar", weight: 15 },
        { text: "Hacking on open scratch repos, trying things until they break.", trait: "Explorer", weight: 15 },
        { text: "Deconstructing massive production architectures of tech giants.", trait: "Architect", weight: 15 },
        { text: "Pair-programming and learning interactively alongside mentors.", trait: "Catalyst", weight: 15 }
      ]
    }
  ];

  // --- PLATFORMS CONNECTION STATE ---
  const [connectedProfiles, setConnectedProfiles] = useState({
    github: { connected: false, username: '' },
    leetcode: { connected: false, username: '' },
    devfolio: { connected: false, username: '' },
    linkedin: { connected: false, username: '' }
  });
  
  const [activePromptPlatform, setActivePromptPlatform] = useState(null);
  const [platformUsernameInput, setPlatformUsernameInput] = useState('');

  // --- AI ENGINE SIMULATOR ---
  const [terminalLogs, setTerminalLogs] = useState([]);

  // --- DOMAIN SETUP & ROLE QUIZ ---
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [roleQuizStep, setRoleQuizStep] = useState(0); // 0: select domains, 1: domain specific quiz, 2: completed
  const [domainRoleAnswer, setDomainRoleAnswer] = useState('');
  const [generatedSpecialization, setGeneratedSpecialization] = useState('');
  const [selectedClan, setSelectedClan] = useState('');

  const AVAILABLE_DOMAINS = [
    { id: 'AI', name: 'Artificial Intelligence 🧠', desc: 'Machine learning, agents, LLMs, neural nets' },
    { id: 'WebDev', name: 'Web Development 💻', desc: 'Frontend guilds, scalable backends, fullstack systems' },
    { id: 'Security', name: 'Cybersecurity 🛡️', desc: 'Penetration testing, EVM auditing, zero-knowledge' },
    { id: 'OS', name: 'Open Source 🔓', desc: 'Public repositories, tooling, developer productivity' },
    { id: 'Competitive', name: 'Competitive Programming ♟️', desc: 'Algorithms, LeetCode, fast problem solving' }
  ];

  // OTP functions
  const handleSendEmailCode = () => {
    if (!email) return alert('Please enter a valid email.');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmailCodeSent(true);
    }, 800);
  };

  const handleVerifyEmail = () => {
    if (emailCode.length === 6) {
      setEmailVerified(true);
    } else {
      alert('Mock OTP is any 6-digit code (e.g. 123456)');
    }
  };

  const handleSendPhoneCode = () => {
    if (!phone) return alert('Please enter a valid phone number.');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPhoneCodeSent(true);
    }, 800);
  };

  const handleVerifyPhone = () => {
    if (phoneCode.length === 6) {
      setPhoneVerified(true);
    } else {
      alert('Mock OTP is any 6-digit code (e.g. 123456)');
    }
  };

  const handleFinishOTPStep = () => {
    if (username.length < 3) return alert('Handle must be at least 3 characters.');
    handleAuthVerify(email, phone, username.trim().toLowerCase());
    setOnboardStep('dna_quiz');
  };

  // DNA Quiz functions
  const handleDnaAnswerSelect = (trait, weight) => {
    setDnaAnswers(prev => ({
      ...prev,
      [trait]: prev[trait] + weight
    }));

    if (currentDnaQ < DNA_QUIZ_QUESTIONS.length - 1) {
      setCurrentDnaQ(prev => prev + 1);
    } else {
      setOnboardStep('connect_profiles');
    }
  };

  // Connect platform mock prompt
  const openConnectPrompt = (platform) => {
    setActivePromptPlatform(platform);
    setPlatformUsernameInput('');
  };

  const submitConnectAccount = () => {
    if (!platformUsernameInput) return;
    setConnectedProfiles(prev => ({
      ...prev,
      [activePromptPlatform]: { connected: true, username: platformUsernameInput }
    }));
    handleConnectAccount(activePromptPlatform, platformUsernameInput);
    setActivePromptPlatform(null);
  };

  // Trigger AI Engine Parser Logs
  const triggerAIEngineAnalysis = () => {
    setOnboardStep('ai_analysis');
    setTerminalLogs([]);

    const logs = [
      `[PROCESS] Initializing Developer DNA Identity Engine v2.0...`,
      `[INFO] Target Node: ${username || 'developer'} authenticated on-chain.`,
      `[INFO] Querying Identity Quiz vectors (learning style, build architecture)...`,
      `[INFO] Mapping response metrics: Maker:${dnaAnswers.Builder}%, Explorer:${dnaAnswers.Explorer}%, Scholar:${dnaAnswers.Scholar}%`,
      `[GITHUB] Connecting repository parser indexer...`,
      connectedProfiles.github.connected 
        ? `[GITHUB] Synced Profile @${connectedProfiles.github.username}: Found 40 active repos, 1024 stars, 1200 contributions.`
        : `[GITHUB] No external repo profile mapped. Generating baseline compiler vectors...`,
      `[LEETCODE] Evaluating algorithmic problem complexities...`,
      connectedProfiles.leetcode.connected
        ? `[LEETCODE] Mapped account @${connectedProfiles.leetcode.username}: 210 challenges solved, Top 12% global rating.`
        : `[LEETCODE] No contest metadata found.`,
      `[DEVFOLIO] Searching registered hackathon team submissions...`,
      connectedProfiles.devfolio.connected
        ? `[DEVFOLIO] Connected @${connectedProfiles.devfolio.username}: Finalist at Hack4Bengal, 4 projects indexed.`
        : `[DEVFOLIO] No hackathon rewards detected.`,
      `[PROCESS] Executing Principal Component Analysis (PCA)...`,
      `[PROCESS] Normalizing scores against global developer pool...`,
      `[SUCCESS] DNA Attestation fully compiled! Preparing final badge reveal...`
    ];

    let currentLogIdx = 0;
    const interval = setInterval(() => {
      if (currentLogIdx < logs.length) {
        setTerminalLogs(prev => [...prev, logs[currentLogIdx]]);
        currentLogIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          // Compute DNA and pass trait scores
          handleDNAQuizCompletion(dnaAnswers, connectedProfiles);
          setOnboardStep('dna_reveal');
        }, 1200);
      }
    }, 450);
  };

  // Domain specific role quiz trigger
  const handleDomainSelect = (domainId) => {
    if (selectedDomains.includes(domainId)) {
      setSelectedDomains(prev => prev.filter(d => d !== domainId));
    } else {
      setSelectedDomains(prev => [...prev, domainId]);
    }
  };

  const proceedToRoleQuiz = () => {
    if (selectedDomains.length === 0) return alert('Please choose at least 1 domain.');
    setRoleQuizStep(1);
  };

  const handleRoleAnswerSelect = (answer) => {
    setDomainRoleAnswer(answer);
    
    // Compute specialization based on choice
    let specialization = 'Full Stack Developer';
    let clanName = 'Frontend Guild';

    if (selectedDomains.includes('AI')) {
      if (answer === 'models') {
        specialization = 'ML Engineer';
        clanName = 'AI Builders';
      } else {
        specialization = 'Agent Architect';
        clanName = 'AI Builders';
      }
    } else if (selectedDomains.includes('Security')) {
      specialization = 'EVM Smart Contract Auditor';
      clanName = 'Research Circle';
    } else if (selectedDomains.includes('OS')) {
      specialization = 'Systems Tooling Engineer';
      clanName = 'Research Circle';
    } else if (selectedDomains.includes('WebDev')) {
      if (answer === 'frontend') {
        specialization = 'Full Stack Developer';
        clanName = 'Frontend Guild';
      } else {
        specialization = 'Backend Architect';
        clanName = 'Frontend Guild';
      }
    }

    setGeneratedSpecialization(specialization);
    setSelectedClan(clanName);
    setRoleQuizStep(2);
  };

  const finishOnboardingSetup = () => {
    handleCompleteDomainSetup(selectedDomains, generatedSpecialization, selectedClan);
  };

  // --- RENDER VISITOR LANDING PAGE ---
  if (activeView === 'landing') {
    return (
      <div className="animate-slide-up" style={{ width: '100%' }}>
        {/* Hero Section */}
        <section className="hero-content" style={{ marginTop: '50px', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(0, 242, 254, 0.05)', borderRadius: '24px', border: '1px solid var(--border-glow)', marginBottom: '24px' }}>
            <Sparkles size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan)' }}>V2.0 LIVE: AI DEVELOPER DNA</span>
          </div>

          <h1 className="hero-title">Discover Your true Developer DNA.</h1>
          <p className="hero-subtitle">
            Poofie parses your learning habits, hackathon achievements, and coding activity to compile a living Developer DNA profile. Find your tribe, locate compatible teammates, and explore meaningful collaborations on-chain.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={handleConnectWallet} className="btn-primary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
              <Wallet size={18} />
              Connect Web3 Wallet
            </button>
            <a href="#dna-types" className="btn-secondary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
              Explore DNA Types
            </a>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
            <button 
              type="button"
              onClick={handleClearDatabase}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                transition: 'var(--transition-smooth)'
              }}
            >
              Reset Sandbox Database (Wipe Local Storage)
            </button>
          </div>
        </section>

        {/* 8 DNA Types Grid */}
        <section id="dna-types" style={{ padding: '80px 0', borderTop: '1px solid var(--border-light)' }}>
          <h2 style={{ color: 'var(--text-main)', textAlign: 'center', fontSize: '2rem', marginBottom: '12px' }}>
            The 8 Developer DNA Identities
          </h2>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto 50px auto', lineHeight: '1.5' }}>
            Your DNA Type explains WHO you are. When you take our assessment, the Identity Engine evaluates your trait components to map your coding archetype:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px'
          }}>
            {[
              { emoji: "⚒️", title: "Maker", desc: "Builds first. Learns by aggressively compiling and creating working prototypes." },
              { emoji: "🏛️", title: "Architect", desc: "Designs systems. Obsessed with high scalability, clean data flows, and long-term modularity." },
              { emoji: "🧭", title: "Explorer", desc: "Experiments constantly. Highly driven by pure curiosity and learning new tools." },
              { emoji: "♟️", title: "Strategist", desc: "Optimization focused. Possesses a competitive coding mindset and thrives under pressure." },
              { emoji: "📚", title: "Scholar", desc: "Research oriented. Seeks deep internal understanding, reading code repositories and docs." },
              { emoji: "⚗️", title: "Alchemist", desc: "Combines ideas creatively. Thrives on the intersection of diverse systems and libraries." },
              { emoji: "⚡", title: "Catalyst", desc: "Community driven. Natural leader, coordinator, and team glue bringing developers together." },
              { emoji: "💎", title: "Craftsman", desc: "Obsessed with high quality. Polishes layouts, code structure, and performance relentlessly." }
            ].map((dna, idx) => (
              <div key={idx} className="glass-panel glow-cyan" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '2.5rem' }}>{dna.emoji}</span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 700 }}>{dna.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{dna.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4 Layers Showcase */}
        <section style={{ padding: '80px 0', borderTop: '1px solid var(--border-light)', background: 'rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: 'var(--text-main)', textAlign: 'center', fontSize: '2rem', marginBottom: '48px' }}>
            The 4 Layers of Poofie
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
            {[
              { num: "01", name: "Data Collection", desc: "Connect Github, LeetCode, and Devfolio. We pull active contributions, stats, and achievements." },
              { num: "02", name: "Identity Engine", desc: "Our simulated AI evaluates your scores, assigning your Primary and Secondary DNA types." },
              { num: "03", name: "Domain Discovery", desc: "Select domain interests (AI, Web, Cybersecurity) and resolve quizzes to find your Specialization." },
              { num: "04", name: "Clan Guilds", desc: "Join Clans like AI Builders, Frontend Guild. Connect with highly compatible peers and collaborators." }
            ].map((step, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)', display: 'block', marginBottom: '8px' }}>LAYER {step.num}</span>
                <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '8px' }}>{step.name}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Community Showcase */}
        <section style={{ padding: '80px 0', borderTop: '1px solid var(--border-light)', marginBottom: '60px' }}>
          <h2 style={{ color: 'var(--text-main)', textAlign: 'center', fontSize: '2rem', marginBottom: '12px' }}>
            Meet our Sandbox Developers
          </h2>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '48px' }}>
            Interact with rich pre-built identities immediately. Connect your wallet to switch personas!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            {systemUsers.map(user => (
              <div key={user.username} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={user.avatar} alt={user.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-light)' }} />
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{user.name}</h3>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>@{user.username}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontSize: '0.65rem', background: 'rgba(0, 242, 254, 0.08)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>{user.dnaType} DNA</span>
                  <span style={{ fontSize: '0.65rem', background: 'rgba(155, 81, 224, 0.08)', color: 'var(--accent-purple)', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>{user.specialization}</span>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4', flex: 1 }}>{user.bio}</p>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block' }}>CLAN</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>{user.clan}</span>
                  </div>
                  <button onClick={handleConnectWallet} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.7rem' }}>
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // --- RENDER ONBOARDING FLOWS ---
  return (
    <div className="animate-slide-up" style={{ maxWidth: '640px', margin: '40px auto', width: '100%', padding: '0 20px' }}>
      
      {/* Onboarding Stepper Cards */}
      <div className="glass-panel" style={{ padding: '36px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Step Title Header */}
        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Poofie Identity Setup
          </span>
          
          <h2 style={{ fontSize: '1.6rem', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>
            {onboardStep === 'otp' && 'Verify Credentials'}
            {onboardStep === 'dna_quiz' && `Developer DNA Assessment (${currentDnaQ + 1}/6)`}
            {onboardStep === 'connect_profiles' && 'Connect Platforms'}
            {onboardStep === 'ai_analysis' && 'AI Identity Analysis'}
            {onboardStep === 'dna_reveal' && 'Your Developer DNA DNA Type'}
            {onboardStep === 'domain_setup' && 'Choose Your Focus Domain'}
            {onboardStep === 'clan_league' && 'Domain Specialization Quiz'}
          </h2>
        </div>

        {/* --- STEP 1: OTP CREDENTIALS --- */}
        {onboardStep === 'otp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Verify your basic email & phone details. This establishes the initial contact metadata.
            </p>

            {/* Email OTP */}
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>EMAIL ADDRESS</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="email" 
                  placeholder="satoshi@bitcoin.org" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field" 
                  disabled={emailVerified}
                />
                {!emailVerified && (
                  <button onClick={handleSendEmailCode} className="btn-secondary" style={{ whiteSpace: 'nowrap' }}>
                    {emailCodeSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                )}
              </div>
              {emailCodeSent && !emailVerified && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit OTP (e.g. 123456)" 
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                    className="input-field" 
                  />
                  <button onClick={handleVerifyEmail} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>Verify</button>
                </div>
              )}
              {emailVerified && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.75rem', marginTop: '6px' }}>
                  <Check size={14} />
                  <span>Email verified successfully</span>
                </div>
              )}
            </div>

            {/* Phone OTP */}
            {emailVerified && (
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>PHONE NUMBER</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="tel" 
                    placeholder="+1 555-0199" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field" 
                    disabled={phoneVerified}
                  />
                  {!phoneVerified && (
                    <button onClick={handleSendPhoneCode} className="btn-secondary" style={{ whiteSpace: 'nowrap' }}>
                      {phoneCodeSent ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  )}
                </div>
                {phoneCodeSent && !phoneVerified && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Enter 6-digit OTP (e.g. 123456)" 
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                      className="input-field" 
                    />
                    <button onClick={handleVerifyPhone} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>Verify</button>
                  </div>
                )}
                {phoneVerified && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.75rem', marginTop: '6px' }}>
                    <Check size={14} />
                    <span>Phone verified successfully</span>
                  </div>
                )}
              </div>
            )}

            {/* Claim Handle */}
            {phoneVerified && (
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>CHOOSE DEVELOPER HANDLE</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', fontSize: '0.9rem' }}>@</span>
                  <input 
                    type="text" 
                    placeholder="satoshi" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                    className="input-field"
                    style={{ paddingLeft: '32px' }}
                  />
                </div>
              </div>
            )}

            {phoneVerified && username.length >= 3 && (
              <button onClick={handleFinishOTPStep} className="btn-primary" style={{ justifyContent: 'center', marginTop: '10px' }}>
                Next: Take Developer DNA Assessment
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}

        {/* --- STEP 2: DNA QUIZ QUESTIONNAIRE --- */}
        {onboardStep === 'dna_quiz' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
              <div style={{ width: `${((currentDnaQ + 1) / DNA_QUIZ_QUESTIONS.length) * 100}%`, height: '100%', background: 'var(--accent-gradient)', transition: 'width 0.3s ease' }}></div>
            </div>

            <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.4' }}>
              {DNA_QUIZ_QUESTIONS[currentDnaQ].q}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
              {DNA_QUIZ_QUESTIONS[currentDnaQ].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDnaAnswerSelect(opt.trait, opt.weight)}
                  className="btn-secondary"
                  style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    justifyContent: 'start',
                    fontSize: '0.85rem',
                    lineHeight: '1.4',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderColor: 'var(--border-light)',
                    display: 'block',
                    width: '100%'
                  }}
                >
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 800, marginRight: '8px' }}>
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- STEP 3: CONNECT PROFILES --- */}
        {onboardStep === 'connect_profiles' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Connect external developer profiles. Poofie AI parses your real commits, algorithm statistics, and awards to customize your identity scores.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* GitHub */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <GitFork size={20} style={{ color: 'var(--accent-cyan)' }} />
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', color: 'var(--text-main)' }}>GitHub Profile</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      {connectedProfiles.github.connected ? `@${connectedProfiles.github.username} synced` : 'Verify contributions, repos, and stars'}
                    </span>
                  </div>
                </div>
                {connectedProfiles.github.connected ? (
                  <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14} /> Synced</span>
                ) : (
                  <button onClick={() => openConnectPrompt('github')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Connect</button>
                )}
              </div>

              {/* LeetCode */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Code size={20} style={{ color: 'var(--accent-purple)' }} />
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', color: 'var(--text-main)' }}>LeetCode Tracker</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      {connectedProfiles.leetcode.connected ? `@${connectedProfiles.leetcode.username} synced` : 'Pull problems solved and contest ratings'}
                    </span>
                  </div>
                </div>
                {connectedProfiles.leetcode.connected ? (
                  <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14} /> Synced</span>
                ) : (
                  <button onClick={() => openConnectPrompt('leetcode')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Connect</button>
                )}
              </div>

              {/* Devfolio */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Trophy size={20} style={{ color: '#f59e0b' }} />
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', color: 'var(--text-main)' }}>Devfolio Hackathons</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      {connectedProfiles.devfolio.connected ? `@${connectedProfiles.devfolio.username} synced` : 'Sync hackathon listings and winning history'}
                    </span>
                  </div>
                </div>
                {connectedProfiles.devfolio.connected ? (
                  <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14} /> Synced</span>
                ) : (
                  <button onClick={() => openConnectPrompt('devfolio')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Connect</button>
                )}
              </div>

              {/* LinkedIn */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Briefcase size={20} style={{ color: '#0072b1' }} />
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', color: 'var(--text-main)' }}>LinkedIn Professional</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      {connectedProfiles.linkedin.connected ? `@${connectedProfiles.linkedin.username} synced` : 'Pull workspace context, details, and education'}
                    </span>
                  </div>
                </div>
                {connectedProfiles.linkedin.connected ? (
                  <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14} /> Synced</span>
                ) : (
                  <button onClick={() => openConnectPrompt('linkedin')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Connect</button>
                )}
              </div>
            </div>

            {/* Account connection prompt modal */}
            {activePromptPlatform && (
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--accent-cyan)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>CONNECT {activePromptPlatform.toUpperCase()} USERNAME</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder={`e.g. satoshi_nakamoto`} 
                    value={platformUsernameInput}
                    onChange={(e) => setPlatformUsernameInput(e.target.value)}
                    className="input-field" 
                  />
                  <button onClick={submitConnectAccount} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>Confirm</button>
                </div>
              </div>
            )}

            <button onClick={triggerAIEngineAnalysis} className="btn-primary" style={{ justifyContent: 'center', marginTop: '10px' }}>
              Run AI Identity Engine Analysis
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* --- STEP 4: AI ANALYSIS LOADER MATRIX --- */}
        {onboardStep === 'ai_analysis' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Synthesizing developer profile vectors. Mapping coding style variables...
            </p>

            <div style={{
              background: '#030305',
              border: '1px solid var(--border-glow)',
              borderRadius: '10px',
              padding: '20px',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: '#39ff14',
              height: '240px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              boxShadow: 'inset 0 0 10px rgba(0,255,0,0.15)'
            }}>
              {terminalLogs.map((log, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--accent-cyan)' }}>&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
              <div className="shimmer" style={{ width: '100%', height: '14px', borderRadius: '4px', marginTop: '4px' }}></div>
            </div>
          </div>
        )}

        {/* --- STEP 5: DNA REVEAL TROPHY PANEL --- */}
        {onboardStep === 'dna_reveal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(0, 242, 254, 0.1)',
              border: '2px solid var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
              marginBottom: '4px'
            }}>
              <Trophy size={40} style={{ color: 'var(--accent-cyan)' }} />
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>YOUR PRIMARY DNA TYPE</span>
              <h3 style={{
                fontSize: '2.4rem',
                fontFamily: 'var(--font-heading)',
                background: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                marginTop: '4px'
              }}>
                {dnaAnswers.Builder >= Math.max(dnaAnswers.Explorer, dnaAnswers.Scholar, dnaAnswers.Strategist, dnaAnswers.Architect, dnaAnswers.Alchemist, dnaAnswers.Catalyst, dnaAnswers.Craftsman) && 'Maker ⚒️'}
                {dnaAnswers.Architect >= Math.max(dnaAnswers.Builder, dnaAnswers.Explorer, dnaAnswers.Scholar, dnaAnswers.Strategist, dnaAnswers.Alchemist, dnaAnswers.Catalyst, dnaAnswers.Craftsman) && 'Architect 🏛️'}
                {dnaAnswers.Explorer >= Math.max(dnaAnswers.Builder, dnaAnswers.Architect, dnaAnswers.Scholar, dnaAnswers.Strategist, dnaAnswers.Alchemist, dnaAnswers.Catalyst, dnaAnswers.Craftsman) && 'Explorer 🧭'}
                {dnaAnswers.Strategist >= Math.max(dnaAnswers.Builder, dnaAnswers.Architect, dnaAnswers.Explorer, dnaAnswers.Scholar, dnaAnswers.Alchemist, dnaAnswers.Catalyst, dnaAnswers.Craftsman) && 'Strategist ♟️'}
                {dnaAnswers.Scholar >= Math.max(dnaAnswers.Builder, dnaAnswers.Architect, dnaAnswers.Explorer, dnaAnswers.Strategist, dnaAnswers.Alchemist, dnaAnswers.Catalyst, dnaAnswers.Craftsman) && 'Scholar 📚'}
                {dnaAnswers.Alchemist >= Math.max(dnaAnswers.Builder, dnaAnswers.Architect, dnaAnswers.Explorer, dnaAnswers.Scholar, dnaAnswers.Strategist, dnaAnswers.Catalyst, dnaAnswers.Craftsman) && 'Alchemist ⚗️'}
                {dnaAnswers.Catalyst >= Math.max(dnaAnswers.Builder, dnaAnswers.Architect, dnaAnswers.Explorer, dnaAnswers.Scholar, dnaAnswers.Strategist, dnaAnswers.Alchemist, dnaAnswers.Craftsman) && 'Catalyst ⚡'}
                {dnaAnswers.Craftsman >= Math.max(dnaAnswers.Builder, dnaAnswers.Architect, dnaAnswers.Explorer, dnaAnswers.Scholar, dnaAnswers.Strategist, dnaAnswers.Alchemist, dnaAnswers.Catalyst) && 'Craftsman 💎'}
              </h3>
              
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                Secondary DNA Type: <strong>Explorer 🧭</strong> (Calculated)
              </span>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              "An active builder who thrives on spinning up working prototypes, tinkering with unfamiliar libraries under tight deadlines, and learning interactively through codebase reviews."
            </p>

            <button onClick={() => setOnboardStep('domain_setup')} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Proceed to Domain Selection
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* --- STEP 6: DOMAIN SELECTION --- */}
        {onboardStep === 'domain_setup' && roleQuizStep === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              DNA explains WHO you are. Domains explain WHAT tech spaces interest you. Choose your focus spaces:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {AVAILABLE_DOMAINS.map(domain => {
                const isSelected = selectedDomains.includes(domain.id);
                return (
                  <button
                    key={domain.id}
                    onClick={() => handleDomainSelect(domain.id)}
                    className="glass-panel"
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      background: isSelected ? 'rgba(0, 242, 254, 0.05)' : 'rgba(0, 0, 0, 0.1)',
                      borderColor: isSelected ? 'var(--accent-cyan)' : 'var(--border-light)',
                      cursor: 'pointer',
                      borderRadius: '10px',
                      display: 'block',
                      width: '100%'
                    }}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, display: 'block', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-main)' }}>
                      {domain.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                      {domain.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            <button onClick={proceedToRoleQuiz} className="btn-primary" style={{ justifyContent: 'center', marginTop: '10px' }}>
              Take Domain Specialization Quiz
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* --- STEP 7: ROLE QUIZ & CLAN STARTER --- */}
        {onboardStep === 'domain_setup' && roleQuizStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {selectedDomains.includes('AI') ? (
              <>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.4' }}>
                  [AI Quiz] In building AI-driven systems, what is your preferred layer of optimization?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button onClick={() => handleRoleAnswerSelect('models')} className="btn-secondary" style={{ padding: '16px', textAlign: 'left', display: 'block' }}>
                    <strong>A. Deep Models Core</strong>: Fine-tuning weights, training customized loss functions, PyTorch matrices.
                  </button>
                  <button onClick={() => handleRoleAnswerSelect('agents')} className="btn-secondary" style={{ padding: '16px', textAlign: 'left', display: 'block' }}>
                    <strong>B. Agent Architecture</strong>: Orchestrating LangChain nodes, chaining APIs, and building recursive memory vaults.
                  </button>
                </div>
              </>
            ) : (
              <>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.4' }}>
                  [WebDev Quiz] Where do you spend most of your layout and architecture energy?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button onClick={() => handleRoleAnswerSelect('frontend')} className="btn-secondary" style={{ padding: '16px', textAlign: 'left', display: 'block' }}>
                    <strong>A. User Interface & State</strong>: React Hooks, CSS glassmorphism components, and smooth page transitions.
                  </button>
                  <button onClick={() => handleRoleAnswerSelect('backend')} className="btn-secondary" style={{ padding: '16px', textAlign: 'left', display: 'block' }}>
                    <strong>B. Routing & Persistence</strong>: Database querying, designing fast FastAPI endpoints, and caching indexes.
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Final Selection Summary */}
        {onboardStep === 'domain_setup' && roleQuizStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'center', alignItems: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(155, 81, 224, 0.1)',
              border: '2px solid var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-purple-glow)'
            }}>
              <Cpu size={28} style={{ color: 'var(--accent-purple)' }} />
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>YOUR SPECIALIZATION RESULT</span>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 800, marginTop: '4px' }}>
                {generatedSpecialization}
              </h3>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '16px',
              width: '100%',
              textAlign: 'left'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>RECOMMENDED CLAN FOR YOU:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <Users size={16} style={{ color: 'var(--accent-cyan)' }} />
                <strong>{selectedClan} Clan</strong>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                This guild brings together developers with similar learning styles and specialization trajectories.
              </p>
            </div>

            <button onClick={finishOnboardingSetup} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Claim Developer Identity & Enter Feed
              <ArrowRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
