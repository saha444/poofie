import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import FloatingIconsHero from './FloatingIconsHero';
import { 
  Mail, 
  Smartphone, 
  UserCheck, 
  Check, 
  ArrowRight, 
  Sparkles,
  GitFork,
  Briefcase,
  Trophy,
  Users,
  Star,
  Activity,
  Code,
  ShieldAlert,
  Cpu
} from 'lucide-react';

export default function LandingAndAuth() {
  const { 
    session,
    handleStartAuth, 
    handleAuthVerify, 
    handleDNAQuizCompletion,
    handleCompleteDomainSetup,
    handleConnectAccount,
    navigate, 
    activeView,
    handleClearDatabase,
    systemUsers
  } = useApp();

  // Manage seamless pitch-black background on guest landing mode
  useEffect(() => {
    if (activeView === 'landing') {
      document.body.classList.add('landing-active');
    } else {
      document.body.classList.remove('landing-active');
    }
    return () => {
      document.body.classList.remove('landing-active');
    };
  }, [activeView]);

  // Onboarding local state
  const [email, setEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [username, setUsername] = useState('');
  
  // Stepper navigation
  const [onboardStep, setOnboardStep] = useState('otp'); // 'otp', 'connect_profiles', 'dna_quiz', 'ai_analysis', 'dna_reveal', 'domain_setup', 'clan_league'
  const [loading, setLoading] = useState(false);

  // OTP simulation states
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);

  // --- DNA QUIZ STATE ---
  const [currentDnaQ, setCurrentDnaQ] = useState(0);
  const [dnaAnswers, setDnaAnswers] = useState({
    Maker: 0, Architect: 0, Explorer: 0, Scholar: 0, Craftsman: 0, Catalyst: 0
  });

  // Full 10-question spec — multi-trait scoring per answer
  const DNA_QUIZ_QUESTIONS = [
    {
      q: "Your team just inherited a messy legacy codebase. What's your first move?",
      options: [
        { text: "Start running it, break things, understand through failure.", scores: { Maker: 2 } },
        { text: "Map the entire architecture — draw diagrams, trace dependencies, then plan.", scores: { Architect: 2 } },
        { text: "Google every unfamiliar pattern, read the original commit messages.", scores: { Scholar: 1, Explorer: 1 } },
        { text: "Gather the original team, understand the intent before touching anything.", scores: { Catalyst: 2 } }
      ]
    },
    {
      q: "You have a free weekend with no obligations. What do you build?",
      options: [
        { text: "A working app — something live, users can interact with by Sunday.", scores: { Maker: 2 } },
        { text: "A system I've always wanted to design properly — clean interfaces, solid contracts.", scores: { Architect: 2 } },
        { text: "Whatever catches my eye — maybe a new language, a weird protocol, or a retro API.", scores: { Explorer: 2 } },
        { text: "Nothing new — I refactor something old until it's genuinely beautiful.", scores: { Craftsman: 2 } }
      ]
    },
    {
      q: "What is your relationship with code reviews?",
      options: [
        { text: "I give detailed, almost line-by-line feedback. Quality is moral.", scores: { Craftsman: 2 } },
        { text: "I focus on architecture: Is this scalable? Will this break in 6 months?", scores: { Architect: 1, Scholar: 1 } },
        { text: "I approve fast if it works. Iteration beats perfection.", scores: { Maker: 2 } },
        { text: "I treat it as a teaching moment — I explain the 'why' not just the 'what'.", scores: { Catalyst: 2 } }
      ]
    },
    {
      q: "A new paper drops: 'Transformer-Free Architecture Beats GPT-4 on Reasoning Benchmarks.' Your reaction?",
      options: [
        { text: "Open the abstract, skim results, and replicate the benchmark by midnight.", scores: { Scholar: 2 } },
        { text: "Fork the repo and start hacking immediately — production be damned.", scores: { Explorer: 1, Maker: 1 } },
        { text: "Share it with your team with a 3-bullet summary of why it matters.", scores: { Catalyst: 2 } },
        { text: "Bookmark it. Wait for someone smarter to validate it first.", scores: { Scholar: 1, Architect: 1 } }
      ]
    },
    {
      q: "You're three hours into a hackathon. The original idea isn't working. What happens?",
      options: [
        { text: "Pivot immediately. Ship something simpler that works.", scores: { Maker: 2 } },
        { text: "Diagnose why it failed before any pivot — maybe it's solvable.", scores: { Architect: 1, Scholar: 1 } },
        { text: "Get the team aligned. No pivot without shared clarity.", scores: { Catalyst: 2 } },
        { text: "The pivot is the fun part — now we can try the crazy idea.", scores: { Explorer: 2 } }
      ]
    },
    {
      q: "How do you feel about documentation?",
      options: [
        { text: "I write docs before I write code. The interface is the spec.", scores: { Architect: 2 } },
        { text: "I write docs after — they're a changelog, not a blueprint.", scores: { Maker: 1, Craftsman: 1 } },
        { text: "I read docs obsessively — edge cases live there.", scores: { Scholar: 2 } },
        { text: "I document so others don't get stuck where I did.", scores: { Catalyst: 2 } }
      ]
    },
    {
      q: "A junior dev on your team is consistently writing slow, unreadable code. What do you do?",
      options: [
        { text: "Sit down and pair-program with them — show, don't tell.", scores: { Catalyst: 2 } },
        { text: "Leave detailed code review comments with references and examples.", scores: { Scholar: 1, Craftsman: 1 } },
        { text: "Assign them a refactoring task on existing code — best way to learn.", scores: { Maker: 1, Craftsman: 1 } },
        { text: "Redesign the system so it's harder to write bad code in the first place.", scores: { Architect: 2 } }
      ]
    },
    {
      q: "What does 'done' mean to you?",
      options: [
        { text: "It works. Users can use it. Ship it.", scores: { Maker: 2 } },
        { text: "It's tested, documented, and I wouldn't be embarrassed if anyone read the code.", scores: { Craftsman: 2 } },
        { text: "It's extensible, well-architected, and won't require major surgery in 6 months.", scores: { Architect: 2 } },
        { text: "There's no 'done' — only current best version. Always more to learn.", scores: { Explorer: 1, Scholar: 1 } }
      ]
    },
    {
      q: "The team is deadlocked on a tech stack decision. What's your move?",
      options: [
        { text: "Build two quick prototypes in each stack and let the data decide.", scores: { Maker: 2 } },
        { text: "Facilitate a structured discussion and drive toward consensus.", scores: { Catalyst: 2 } },
        { text: "Write a technical decision doc — pros/cons, tradeoffs, long-term implications.", scores: { Architect: 1, Scholar: 1 } },
        { text: "Pick the stack I've been meaning to learn. Disagreements are exploration opportunities.", scores: { Explorer: 2 } }
      ]
    },
    {
      q: "What's your personal definition of great code?",
      options: [
        { text: "Code that solves real problems for real users, fast.", scores: { Maker: 2 } },
        { text: "Code so clean it reads like prose — any dev can understand it in one pass.", scores: { Craftsman: 2 } },
        { text: "Code that holds up under scale, failure, and future requirements.", scores: { Architect: 2 } },
        { text: "Code that reveals something new about the problem, or the medium itself.", scores: { Scholar: 1, Explorer: 1 } }
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
    { id: 'AI', name: 'Artificial Intelligence', desc: 'Machine learning, agents, LLMs, neural nets' },
    { id: 'WebDev', name: 'Web Development', desc: 'Frontend guilds, scalable backends, fullstack systems' },
    { id: 'Security', name: 'Cybersecurity', desc: 'Penetration testing, EVM auditing, zero-knowledge' },
    { id: 'OS', name: 'Open Source', desc: 'Public repositories, tooling, developer productivity' },
    { id: 'Competitive', name: 'Competitive Programming', desc: 'Algorithms, LeetCode, fast problem solving' }
  ];

  // OTP handlers
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
    setOnboardStep('connect_profiles');
  };

  // DNA Quiz answer select — multi-trait scoring
  const handleDnaAnswerSelect = (scores) => {
    setDnaAnswers(prev => {
      const updated = { ...prev };
      Object.entries(scores).forEach(([trait, pts]) => {
        if (updated[trait] !== undefined) updated[trait] += pts;
      });
      return updated;
    });

    if (currentDnaQ < DNA_QUIZ_QUESTIONS.length - 1) {
      setCurrentDnaQ(prev => prev + 1);
    } else {
      triggerAIEngineAnalysis();
    }
  };

  // Derive primary and secondary DNA from scores
  const getDNAResult = () => {
    const sorted = Object.entries(dnaAnswers).sort((a, b) => b[1] - a[1]);
    return { primary: sorted[0][0], secondary: sorted[1][0], scores: dnaAnswers };
  };

  const DNA_DESCRIPTIONS = {
    Maker: 'Builds first, iterates fast, learns by doing. Thrives on shipping working prototypes and turning ideas into reality under any constraint.',
    Architect: 'Systems thinker who designs before coding. Obsessed with scalability, clean interfaces, and building things that last without becoming tech debt.',
    Explorer: 'Curiosity-driven and frontier-seeking. Easily drawn to new languages, weird protocols, and emerging tech — finds the pivot itself exciting.',
    Scholar: 'Research-first, deep-understanding before action. Reads the paper, traces the source, and documents the edge cases others miss.',
    Craftsman: 'Quality-obsessed and refactor-driven. Code aesthetics matter morally. Won\'t ship until it reads like prose and holds under scrutiny.',
    Catalyst: 'A multiplier and people-oriented builder. Unblocks others, facilitates clarity, and makes the team stronger than the sum of its parts.'
  };

  const DNA_EMOJIS = {
    Maker: '', Architect: '', Explorer: '', Scholar: '', Craftsman: '', Catalyst: ''
  };

  // Connect platform prompt
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

  // DNA calculation and loading log matrix
  const triggerAIEngineAnalysis = () => {
    setOnboardStep('ai_analysis');
    setTerminalLogs([]);

    const logs = [
      `[PROCESS] Initializing Developer DNA Identity Engine v2.0...`,
      `[INFO] Target Node: ${username || 'developer'} authenticated on-chain.`,
      `[INFO] Querying Identity Quiz vectors (learning style, build architecture)...`,
      `[INFO] Mapping response metrics: Maker:${dnaAnswers.Maker || 0}pt, Explorer:${dnaAnswers.Explorer || 0}pt, Scholar:${dnaAnswers.Scholar || 0}pt`,
      `[GITHUB] Connecting repository parser indexer...`,
      connectedProfiles.github.connected 
        ? `[GITHUB] Synced Profile @${connectedProfiles.github.username}: Found 40 active repos, 1024 stars, 1200 contributions.`
        : `[GITHUB] Baseline profile analysis mapped.`,
      `[LEETCODE] Evaluating algorithmic problem complexities...`,
      connectedProfiles.leetcode.connected
        ? `[LEETCODE] Mapped account @${connectedProfiles.leetcode.username}: 210 challenges solved, Top 12% global rating.`
        : `[LEETCODE] Standard algorithms mapping completed.`,
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
          handleDNAQuizCompletion(dnaAnswers);
          setOnboardStep('dna_reveal');
        }, 1200);
      }
    }, 450);
  };

  // Domain selection
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

  // Determine if at least one platform connected during onboarding
  const hasConnectedPlatform = Object.values(connectedProfiles).some(p => p.connected);

  // Quick demo: auto-fill email + phone + handle
  const handleQuickDemo = () => {
    setEmail('demo@poofie.dev');
    setEmailCodeSent(true);
    setEmailVerified(true);
    setPhone('+91 9876543210');
    setPhoneCodeSent(true);
    setPhoneVerified(true);
    setUsername('demo_coder');
    handleAuthVerify('demo@poofie.dev', '+91 9876543210', 'demo_coder');
    setOnboardStep('connect_profiles');
  };

  // --- RENDER VISITOR LANDING PAGE ---
  if (activeView === 'landing') {
    return (
      <div className="animate-slide-up" style={{ width: '100%', background: '#000000' }}>
        {/* Interactive Floating Icons Hero Section */}
        <FloatingIconsHero
          title="Discover Your true Developer DNA."
          subtitle="Poofie parses your learning habits, hackathon achievements, and coding activity to compile a living Developer DNA profile. Find your tribe, locate compatible teammates, and explore meaningful collaborations."
          onStartAuth={handleStartAuth}
          onClearDatabase={handleClearDatabase}
        />
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
            {onboardStep === 'otp' && 'Verify Email & Phone Credentials'}
            {onboardStep === 'connect_profiles' && 'Authenticate Developer Platforms'}
            {onboardStep === 'dna_quiz' && `Developer DNA Assessment (${currentDnaQ + 1}/10)`}
            {onboardStep === 'ai_analysis' && 'AI Identity Analysis'}
            {onboardStep === 'dna_reveal' && 'Your Developer DNA Archetype'}
            {onboardStep === 'domain_setup' && 'Choose Your Focus Domain'}
            {onboardStep === 'clan_league' && 'Domain Specialization Quiz'}
          </h2>
        </div>

        {/* --- STEP 1: CREDENTIALS OTP --- */}
        {onboardStep === 'otp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                🧪 <strong style={{ color: 'var(--accent-cyan)' }}>Sandbox Mode:</strong> Use any 6-digit code (e.g. <code style={{ background: 'rgba(0,242,254,0.08)', padding: '1px 6px', borderRadius: '4px', color: 'var(--accent-cyan)' }}>123456</code>) as your OTP.
              </p>
              <button
                onClick={handleQuickDemo}
                style={{
                  background: 'rgba(0,242,254,0.06)',
                  border: '1px solid rgba(0,242,254,0.25)',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '6px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,242,254,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,242,254,0.06)'}
              >
                ⚡ Quick Demo (Skip OTP)
              </button>
            </div>

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

            {/* Handle Claim */}
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
                Next: Connect Mapped Developer Accounts
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}

        {/* --- STEP 2: CONNECT PLATFORMS LOGIN AUTH --- */}
        {onboardStep === 'connect_profiles' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Connect your developer profiles to authenticate your session. **Link at least 1 account** to authorize your identity registration.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* GitHub */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <GitFork size={20} style={{ color: 'var(--accent-cyan)' }} />
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', color: 'var(--text-main)' }}>GitHub Authentication</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      {connectedProfiles.github.connected ? `@${connectedProfiles.github.username} connected` : 'Authorize session with Github repo index'}
                    </span>
                  </div>
                </div>
                {connectedProfiles.github.connected ? (
                  <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14} /> Synced</span>
                ) : (
                  <button onClick={() => openConnectPrompt('github')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Authorize</button>
                )}
              </div>

              {/* LeetCode */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Code size={20} style={{ color: 'var(--accent-purple)' }} />
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', color: 'var(--text-main)' }}>LeetCode Authentication</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      {connectedProfiles.leetcode.connected ? `@${connectedProfiles.leetcode.username} connected` : 'Authorize with contest metrics'}
                    </span>
                  </div>
                </div>
                {connectedProfiles.leetcode.connected ? (
                  <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14} /> Synced</span>
                ) : (
                  <button onClick={() => openConnectPrompt('leetcode')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Authorize</button>
                )}
              </div>

              {/* LinkedIn */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Briefcase size={20} style={{ color: '#0072b1' }} />
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', color: 'var(--text-main)' }}>LinkedIn Authentication</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      {connectedProfiles.linkedin.connected ? `@${connectedProfiles.linkedin.username} connected` : 'Authorize with professional credentials'}
                    </span>
                  </div>
                </div>
                {connectedProfiles.linkedin.connected ? (
                  <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14} /> Synced</span>
                ) : (
                  <button onClick={() => openConnectPrompt('linkedin')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Authorize</button>
                )}
              </div>
            </div>

            {/* Prompt for username */}
            {activePromptPlatform && (
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--accent-cyan)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>AUTHORIZE {activePromptPlatform.toUpperCase()} ATTRIBUTIONS</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder={`e.g. satoshi_dev`} 
                    value={platformUsernameInput}
                    onChange={(e) => setPlatformUsernameInput(e.target.value)}
                    className="input-field" 
                  />
                  <button onClick={submitConnectAccount} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>Authorize</button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              {hasConnectedPlatform && (
                <button onClick={() => setOnboardStep('dna_quiz')} className="btn-primary" style={{ justifyContent: 'center' }}>
                  Start Developer DNA Quiz
                  <ArrowRight size={16} />
                </button>
              )}
              <button
                onClick={() => setOnboardStep('dna_quiz')}
                style={{
                  background: 'transparent',
                  border: '1px dashed rgba(255,255,255,0.12)',
                  color: 'var(--text-dim)',
                  fontSize: '0.75rem',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
              >
                Skip for now — Connect profiles later from Settings
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 3: DNA QUIZ QUESTIONS --- */}
        {onboardStep === 'dna_quiz' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Progress bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 600 }}>QUESTION {currentDnaQ + 1} OF {DNA_QUIZ_QUESTIONS.length}</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>{Math.round(((currentDnaQ) / DNA_QUIZ_QUESTIONS.length) * 100)}% COMPLETE</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${((currentDnaQ) / DNA_QUIZ_QUESTIONS.length) * 100}%`, height: '100%', background: 'var(--accent-gradient)', transition: 'width 0.4s ease' }}></div>
              </div>
            </div>

            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.5', marginTop: '4px' }}>
              {DNA_QUIZ_QUESTIONS[currentDnaQ].q}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
              {DNA_QUIZ_QUESTIONS[currentDnaQ].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDnaAnswerSelect(opt.scores)}
                  className="btn-secondary"
                  style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    justifyContent: 'start',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderColor: 'var(--border-light)',
                    display: 'block',
                    width: '100%',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,242,254,0.05)'; e.currentTarget.style.borderColor = 'var(--accent-cyan)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                >
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 800, marginRight: '10px', fontFamily: 'monospace' }}>
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {opt.text}
                </button>
              ))}
            </div>

            {/* Skip quiz option */}
            <button
              onClick={() => {
                // Assign equal Maker scores for a skip scenario
                const skipScores = { Maker: 4, Architect: 3, Explorer: 3, Scholar: 2, Craftsman: 2, Catalyst: 2 };
                handleDNAQuizCompletion(skipScores);
                setDnaAnswers(skipScores);
                setOnboardStep('dna_reveal');
              }}
              style={{
                background: 'transparent',
                border: '1px dashed rgba(255,255,255,0.1)',
                color: 'var(--text-dim)',
                fontSize: '0.72rem',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
            >
              Skip quiz — assign default DNA profile
            </button>
          </div>
        )}

        {/* --- STEP 4: AI ANALYSIS MATRIX LOADER --- */}
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

        {/* --- STEP 5: DNA TROPHY REVEAL --- */}
        {onboardStep === 'dna_reveal' && (() => {
          const result = getDNAResult();
          const primaryEmoji = '';
          const secondaryEmoji = '';
          const description = DNA_DESCRIPTIONS[result.primary] || '';
          const maxScore = Math.max(...Object.values(result.scores));
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', textAlign: 'center' }}>
              {/* Trophy icon */}
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: 'rgba(0, 242, 254, 0.08)',
                border: '2px solid var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-glow)',
                fontSize: '2.5rem'
              }}>
                {primaryEmoji}
              </div>

              {/* Primary DNA */}
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>YOUR DEVELOPER DNA TYPE</span>
                <h3 style={{
                  fontSize: '2.6rem',
                  fontFamily: 'var(--font-heading)',
                  background: 'var(--accent-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800,
                  marginTop: '6px',
                  lineHeight: 1
                }}>
                  {result.primary}
                </h3>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', padding: '4px 12px', borderRadius: '20px', background: 'rgba(0,242,254,0.08)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,242,254,0.2)', fontWeight: 700 }}>PRIMARY</span>
                  <span style={{ fontSize: '0.7rem', padding: '4px 12px', borderRadius: '20px', background: 'rgba(155,81,224,0.08)', color: 'var(--accent-purple)', border: '1px solid rgba(155,81,224,0.2)', fontWeight: 700 }}>SECONDARY: {result.secondary} {secondaryEmoji}</span>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6', background: 'rgba(255,255,255,0.02)', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-light)', textAlign: 'left' }}>
                {description}
              </p>

              {/* Trait Score Bars */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>TRAIT BREAKDOWN</span>
                {Object.entries(result.scores).sort((a, b) => b[1] - a[1]).map(([trait, score]) => (
                  <div key={trait}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.75rem', color: trait === result.primary ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: trait === result.primary ? 700 : 400 }}>
                        {DNA_EMOJIS[trait]} {trait}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{score}pt</span>
                    </div>
                    <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: maxScore > 0 ? `${(score / maxScore) * 100}%` : '0%',
                        height: '100%',
                        background: trait === result.primary ? 'var(--accent-gradient)' : 'rgba(155,81,224,0.4)',
                        borderRadius: '3px',
                        transition: 'width 0.8s ease'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => setOnboardStep('domain_setup')} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Proceed to Domain Selection
                <ArrowRight size={16} />
              </button>
            </div>
          );
        })()}

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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <button onClick={proceedToRoleQuiz} className="btn-primary" style={{ justifyContent: 'center' }}>
                Take Domain Specialization Quiz
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => {
                  // Default to WebDev if nothing selected
                  const domains = selectedDomains.length > 0 ? selectedDomains : ['WebDev'];
                  setSelectedDomains(domains);
                  const defaultSpec = 'Full Stack Developer';
                  const defaultClan = 'Frontend Guild';
                  setGeneratedSpecialization(defaultSpec);
                  setSelectedClan(defaultClan);
                  handleCompleteDomainSetup(domains, defaultSpec, defaultClan);
                }}
                style={{
                  background: 'transparent',
                  border: '1px dashed rgba(255,255,255,0.12)',
                  color: 'var(--text-dim)',
                  fontSize: '0.75rem',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
              >
                Skip & Enter Feed now
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 7: Domain Role Quiz --- */}
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
