import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_SYSTEM_USERS } from '../utils/web3Mock';
import { 
  Wallet, 
  Mail, 
  Smartphone, 
  UserCheck, 
  Check, 
  ArrowRight, 
  Shield, 
  Activity, 
  Compass, 
  Cpu,
  Star
} from 'lucide-react';

export default function LandingAndAuth() {
  const { 
    wallet, 
    handleConnectWallet, 
    handleAuthVerify, 
    navigate, 
    activeView,
    handleClearDatabase
  } = useApp();

  // Auth local state
  const [authStep, setAuthStep] = useState(1); // 1: Email, 2: Phone, 3: Username
  const [email, setEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  
  const [phone, setPhone] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  // Simulation helpers
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);

  const handleSendEmailCode = () => {
    if (!email) return alert('Please enter a valid email address.');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmailCodeSent(true);
    }, 1000);
  };

  const handleVerifyEmail = () => {
    if (emailCode === '123456' || emailCode.length === 6) {
      setEmailVerified(true);
      setAuthStep(2);
    } else {
      alert('Mock Code is any 6-digit code (e.g. 123456)');
    }
  };

  const handleSendPhoneCode = () => {
    if (!phone) return alert('Please enter a valid phone number.');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPhoneCodeSent(true);
    }, 1000);
  };

  const handleVerifyPhone = () => {
    if (phoneCode === '123456' || phoneCode.length === 6) {
      setPhoneVerified(true);
      setAuthStep(3);
    } else {
      alert('Mock Code is any 6-digit code (e.g. 123456)');
    }
  };

  const handleFinishAuth = async () => {
    if (username.length < 3) return alert('Username must be at least 3 characters.');
    await handleAuthVerify(email, phone, username.trim().toLowerCase());
  };

  // Render Authentication Flow
  if (activeView === 'auth') {
    return (
      <div className="animate-slide-up" style={{ maxWidth: '480px', margin: '60px auto', width: '100%', padding: '0 20px' }}>
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', textAlign: 'center', marginBottom: '8px' }}>
            Verify Your Identity
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '24px' }}>
            Complete these steps to earn your Verified Human Badge on-chain.
          </p>

          {/* Stepper header */}
          <div style={{ display: 'flex', justifyContent: 'between', marginBottom: '32px', gap: '8px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: emailVerified ? '#10b981' : authStep === 1 ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.05)',
                color: emailVerified || authStep === 1 ? '#000' : 'var(--text-muted)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                border: authStep === 1 ? '2px solid var(--accent-cyan)' : 'none'
              }}>
                {emailVerified ? <Check size={16} /> : '1'}
              </div>
              <span style={{ fontSize: '0.65rem', color: authStep === 1 ? 'var(--accent-cyan)' : 'var(--text-dim)', marginTop: '4px' }}>Email</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: phoneVerified ? '#10b981' : authStep === 2 ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.05)',
                color: phoneVerified || authStep === 2 ? '#000' : 'var(--text-muted)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                border: authStep === 2 ? '2px solid var(--accent-cyan)' : 'none'
              }}>
                {phoneVerified ? <Check size={16} /> : '2'}
              </div>
              <span style={{ fontSize: '0.65rem', color: authStep === 2 ? 'var(--accent-cyan)' : 'var(--text-dim)', marginTop: '4px' }}>Phone</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: authStep === 3 ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.05)',
                color: authStep === 3 ? '#000' : 'var(--text-muted)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                border: authStep === 3 ? '2px solid var(--accent-cyan)' : 'none'
              }}>
                3
              </div>
              <span style={{ fontSize: '0.65rem', color: authStep === 3 ? 'var(--accent-cyan)' : 'var(--text-dim)', marginTop: '4px' }}>Username</span>
            </div>
          </div>

          {/* Step 1: Email Verification */}
          {authStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontSize: '0.9rem', fontWeight: 600 }}>
                <Mail size={16} />
                <span>Link Professional Email</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                We will cryptographically hash your email off-chain to maintain privacy while preventing account duplication.
              </p>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  placeholder="name@company.com or university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  disabled={emailCodeSent}
                />
              </div>

              {emailCodeSent && (
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>6-DIGIT VERIFICATION CODE</label>
                  <input 
                    type="text" 
                    placeholder="Enter 123456"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                    className="input-field"
                    maxLength={6}
                    style={{ textAlign: 'center', letterSpacing: '0.3em', fontSize: '1.1rem' }}
                  />
                </div>
              )}

              {emailCodeSent ? (
                <button onClick={handleVerifyEmail} className="btn-primary" style={{ justifyContent: 'center' }}>
                  Verify Email
                </button>
              ) : (
                <button onClick={handleSendEmailCode} className="btn-primary" style={{ justifyContent: 'center' }} disabled={loading}>
                  {loading ? 'Sending code...' : 'Send Verification Code'}
                </button>
              )}
            </div>
          )}

          {/* Step 2: Phone Verification */}
          {authStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontSize: '0.9rem', fontWeight: 600 }}>
                <Smartphone size={16} />
                <span>Verify Mobile SMS</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Prevents bot farms. Your phone hash is stored in a zk-merkle tree for absolute privacy.
              </p>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>PHONE NUMBER</label>
                <input 
                  type="tel" 
                  placeholder="+1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  disabled={phoneCodeSent}
                />
              </div>

              {phoneCodeSent && (
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>SMS OTP CODE</label>
                  <input 
                    type="text" 
                    placeholder="Enter 123456"
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    className="input-field"
                    maxLength={6}
                    style={{ textAlign: 'center', letterSpacing: '0.3em', fontSize: '1.1rem' }}
                  />
                </div>
              )}

              {phoneCodeSent ? (
                <button onClick={handleVerifyPhone} className="btn-primary" style={{ justifyContent: 'center' }}>
                  Verify Phone
                </button>
              ) : (
                <button onClick={handleSendPhoneCode} className="btn-primary" style={{ justifyContent: 'center' }} disabled={loading}>
                  {loading ? 'Sending SMS...' : 'Send Verification SMS'}
                </button>
              )}
            </div>
          )}

          {/* Step 3: Username Selection */}
          {authStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontSize: '0.9rem', fontWeight: 600 }}>
                <UserCheck size={16} />
                <span>Claim Unique Username</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Choose your unique Poofie handle. This represents your persistent decentralized identifier on Ethereum.
              </p>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>USERNAME</label>
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
              
              <button onClick={handleFinishAuth} className="btn-primary" style={{ justifyContent: 'center' }}>
                Mint Badge & Complete Setup
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Landing Page
  return (
    <div className="animate-slide-up" style={{ width: '100%' }}>
      {/* Hero Section */}
      <section className="hero-content">
        <h1 className="hero-title">Trust Beyond Followers.</h1>
        <p className="hero-subtitle">
          Build your verified digital identity and reputation on-chain. Poofie combines wallet ownership, email credentials, peer endorsements, and professional reviews into a portable, decentralized reputation score.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button onClick={handleConnectWallet} className="btn-primary">
            <Wallet size={18} />
            Connect Web3 Wallet
          </button>
          <a href="#how" className="btn-secondary">
            Learn More
          </a>
        </div>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
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
              fontFamily: 'var(--font-body)',
              transition: 'var(--transition-smooth)'
            }}
          >
            Reset Sandbox Database (Wipe Local Storage)
          </button>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '80px 0', borderTop: '1px solid var(--border-light)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan)', textAlign: 'center', marginBottom: '40px', fontSize: '1.8rem' }}>
          The Trust Building Journey
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {[
            { step: '1', title: 'Verify Human', desc: 'Connect Ethereum wallet, verify email & phone number to earn the Verified Human Badge ✅' },
            { step: '2', title: 'Verify Professional', desc: 'Submit professional credentials & earn at least 3 endorsements from verified users ⭐' },
            { step: '3', title: 'Post Content', desc: 'Publish projects, case studies & design work securely directly on IPFS.' },
            { step: '4', title: 'Earn Reputation', desc: 'Get reviewed by coworkers, teammates & clients across Skill, Trust, and Reliability.' },
            { step: '5', title: 'Boost Score', desc: 'Accumulate XP and watch your on-chain Poofie Score grow as your credibility increases.' }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '24px', textAlign: 'center', position: 'relative' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(0, 242, 254, 0.1)',
                color: 'var(--accent-cyan)',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                margin: '0 auto 16px auto',
                border: '1px solid var(--border-glow)'
              }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>{item.title}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--border-light)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', textAlign: 'center', marginBottom: '40px', fontSize: '1.8rem' }}>
          Built For Credibility, Powered By Ethereum
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {[
            { icon: <UserCheck size={24} style={{ color: 'var(--accent-cyan)' }} />, title: 'Verified Human ✅', desc: 'Sybil-resistant onboarding combining wallet keys, phone, and professional email validations.' },
            { icon: <Shield size={24} style={{ color: 'var(--accent-purple)' }} />, title: 'Verified Professional ⭐', desc: 'Exclusive status unlocked via official credentials, custom portfolio proofs, and peer endorsements.' },
            { icon: <Activity size={24} style={{ color: 'var(--accent-cyan)' }} />, title: 'Content Rating System', desc: '1-5 star ratings directly tied to creator identity, discouraging fake engagement or spam activity.' },
            { icon: <Compass size={24} style={{ color: 'var(--accent-purple)' }} />, title: 'Reputation Scoring Matrix', desc: 'Categorized reviews (Skill, Trust, Reliability) verified on-chain to display professional credibility.' },
            { icon: <Cpu size={24} style={{ color: 'var(--accent-cyan)' }} />, title: 'Decentralized Architecture', desc: 'Interoperable digital footprints combining fast IPFS storage hashes pinned with Ethereum immutability.' },
            { icon: <Star size={24} style={{ color: '#f59e0b' }} />, title: 'Dynamic Poofie Score', desc: 'A weighted composite of community content scores and professional reputation metrics.' }
          ].map((feat, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '16px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                padding: '12px',
                height: 'fit-content'
              }}>{feat.icon}</div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>{feat.title}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--border-light)', marginBottom: '80px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', textAlign: 'center', marginBottom: '40px', fontSize: '1.8rem' }}>
          Meet the Trusted Community
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {MOCK_SYSTEM_USERS.slice(0, 3).map((user) => (
            <div key={user.username} className="glass-panel glow-cyan" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-light)' }} 
                />
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{user.name}</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>@{user.username}</span>
                </div>
              </div>
              
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4', flex: 1 }}>{user.bio}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {user.skills.slice(0, 3).map(skill => (
                  <span key={skill} style={{ fontSize: '0.65rem', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '10px' }}>{skill}</span>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block' }}>POOFIE SCORE</span>
                  <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--accent-cyan)' }}>{user.poofieScore}</span>
                </div>
                <button 
                  onClick={handleConnectWallet}
                  className="btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '0.7rem' }}
                >
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
