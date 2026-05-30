import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Tag, Link as LinkIcon, Compass, Sparkles, Check } from 'lucide-react';

const SUGGESTED_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
];

const AVAILABLE_SKILLS = [
  'Solidity', 'Smart Contracts', 'React', 'NextJS', 'TypeScript', 'UI/UX Design', 
  'Figma', 'Prototyping', 'Web3 Design', 'Technical Writing', 'SEO', 'Auditing', 
  'DeFi', 'ZK-Proofs', 'Cryptography', 'Photography', 'Marketing', 'Ecosystem Growth'
];

const AVAILABLE_INTERESTS = [
  'DeFi', 'Smart Contracts', 'ZK-Proofs', 'UI/UX', 'NFTs', 'Web3 Design', 
  'DAOs', 'Ethereum', 'Content Creation', 'Privacy', 'Cryptography', 'AI'
];

export default function Onboarding() {
  const { userProfile, navigate } = useApp();

  const [step, setStep] = useState(1); // 1: Profile, 2: Skills, 3: Portfolios, 4: Interests
  const [name, setName] = useState(userProfile?.name || '');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(SUGGESTED_AVATARS[0]);

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [dribbble, setDribbble] = useState('');
  const [website, setWebsite] = useState('');

  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const toggleInterest = (interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleNext = () => {
    if (step === 1 && !name.trim()) return alert('Please enter your name.');
    if (step === 2 && selectedSkills.length === 0) return alert('Please select at least 1 skill.');
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    // Navigate to feed — full onboarding is handled via LandingAndAuth
    navigate('feed');
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: '640px', margin: '40px auto', width: '100%', padding: '0 20px' }}>
      <div className="glass-panel" style={{ padding: '36px' }}>
        
        {/* Step indicator header */}
        <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Onboarding: Step {step} of 4
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
              {step === 1 && "Create Your Identity"}
              {step === 2 && "Declare Your Expertise"}
              {step === 3 && "Link Your Portfolios"}
              {step === 4 && "Choose Your Interests"}
            </h2>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            boxShadow: 'var(--shadow-glow)'
          }}>
            {step === 1 && <User size={18} />}
            {step === 2 && <Tag size={18} />}
            {step === 3 && <LinkIcon size={18} />}
            {step === 4 && <Compass size={18} />}
          </div>
        </div>

        {/* Step 1: Basic Profile */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>FULL NAME</label>
              <input 
                type="text" 
                placeholder="Vitalik Buterin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>BIO / BRIEF INTRODUCTION</label>
              <textarea 
                placeholder="Building decentralization primitives, focusing on EVM and layer-2 solutions..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input-field"
                style={{ height: '100px', resize: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>SELECT AN AVATAR</label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {SUGGESTED_AVATARS.map((url) => (
                  <div 
                    key={url}
                    onClick={() => setAvatar(url)}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: avatar === url ? '3px solid var(--accent-cyan)' : '2px solid transparent',
                      boxShadow: avatar === url ? 'var(--shadow-glow)' : 'none',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <img src={url} alt="suggested avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'end', marginTop: '12px' }}>
              <button onClick={handleNext} className="btn-primary">
                Next Step
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Add Skills */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Select skills that describe your profession. These will be publicly displayed on your profile and help recruiters filter for your account.
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {AVAILABLE_SKILLS.map((skill) => {
                const selected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    style={{
                      background: selected ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: selected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-light)',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      color: selected ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      transition: 'var(--transition-smooth)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {skill}
                    {selected && <Check size={12} />}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'between', marginTop: '12px' }}>
              <button onClick={handleBack} className="btn-secondary">Back</button>
              <button onClick={handleNext} className="btn-primary">
                Next Step
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Portfolio Links */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Optionally link your existing digital platforms. Verified Professionals use these portfolios as proof of work credentials.
            </p>

            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>GITHUB URL</label>
              <input 
                type="url" 
                placeholder="https://github.com/username"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>DRIBBBLE or BEHANCE URL</label>
              <input 
                type="url" 
                placeholder="https://dribbble.com/username"
                value={dribbble}
                onChange={(e) => setDribbble(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>LINKEDIN URL</label>
              <input 
                type="url" 
                placeholder="https://linkedin.com/in/username"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>PERSONAL WEBSITE</label>
              <input 
                type="url" 
                placeholder="https://myportfolio.xyz"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="input-field"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'between', marginTop: '12px' }}>
              <button onClick={handleBack} className="btn-secondary">Back</button>
              <button onClick={handleNext} className="btn-primary">
                Next Step
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Interest Selection */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Choose subject areas of interest. This optimizes recommended content, trending posts, and suggests active creators in your feed.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {AVAILABLE_INTERESTS.map((interest) => {
                const selected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    style={{
                      background: selected ? 'rgba(155, 81, 224, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: selected ? '1px solid var(--accent-purple)' : '1px solid var(--border-light)',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      color: selected ? 'var(--accent-purple)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      transition: 'var(--transition-smooth)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {interest}
                    {selected && <Check size={12} style={{ color: 'var(--accent-purple)' }} />}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'between', marginTop: '12px' }}>
              <button onClick={handleBack} className="btn-secondary">Back</button>
              <button onClick={handleSubmit} className="btn-primary" style={{ background: 'var(--accent-gradient)' }}>
                <Sparkles size={16} />
                Finish Setup & Route Feed
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}
