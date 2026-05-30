import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Sparkles } from 'lucide-react';

// Custom high-fidelity brand SVGs
const GitHubIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="GitHub">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const LinkedInIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="LinkedIn">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const LeetCodeIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="LeetCode" style={{ color: '#ffa116' }}>
    <path d="M16.102 17.93l-2.69 2.607c-.466.451-1.211.451-1.677 0l-4.51-4.37a1.25 1.25 0 0 1 0-1.728l4.51-4.37a1.185 1.185 0 0 1 1.677 0l2.69 2.607c.466.451.466 1.186 0 1.637L12.8 17.585a.71.71 0 0 0 0 1.023l2.28 2.207a.71.71 0 0 0 1.022 0l2.69-2.607a1.185 1.185 0 0 0 0-1.637l-5.38-5.212a1.25 1.25 0 0 0-1.677 0L7.155 16.57a1.185 1.185 0 0 0 0 1.637l5.38 5.212c.466.452 1.211.452 1.677 0l2.69-2.607c.466-.452.466-1.187 0-1.638z" />
  </svg>
);

const KaggleIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Kaggle" style={{ color: '#20beff' }}>
    <path d="M19.167 3.25c-.217 0-.435.083-.602.25L9.67 12.395V3.8c0-.414-.336-.75-.75-.75H5.47c-.414 0-.75.336-.75.75v16.4c0 .414.336.75.75.75H8.92c.414 0 .75-.336.75-.75v-6.525l3.237-3.045 4.95 8.92c.11.197.316.31.533.31h3.765c.492 0 .79-.53.542-.953L16.275 11.53l6.02-6.58c.307-.336.07-.887-.384-.887h-2.744z"/>
  </svg>
);

const CodeforcesIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-label="Codeforces">
    <rect x="2" y="10" width="5" height="14" rx="1.5" fill="#EF4444" />
    <rect x="9.5" y="4" width="5" height="20" rx="1.5" fill="#3B82F6" />
    <rect x="17" y="14" width="5" height="10" rx="1.5" fill="#F59E0B" />
  </svg>
);

const HackerRankIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="HackerRank" style={{ color: '#2ec866' }}>
    <path d="M19.458 0H4.542C2.037 0 0 2.037 0 4.542v14.916C0 21.963 2.037 24 4.542 24h14.916C21.963 24 24 21.963 24 19.458V4.542C24 2.037 21.963 0 19.458 0zm-3.834 16.5H13.5v-3h-3v3H8.376V7.5H10.5v3h3v-3h2.124v9z"/>
  </svg>
);

const DevfolioIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Devfolio" style={{ color: '#3770ff' }}>
    <path d="M22 6.012L12.016 0 2.032 6.012v11.976L12.016 24 22 17.988V6.012zm-9.984 4.8L6.4 7.412l5.616-3.412 5.616 3.412-5.616 3.4zm-5.6 4.776V9.456l5.6 3.4v6.132l-5.6-3.4zm11.2 0l-5.6 3.4v-6.132l5.6-3.4v6.132z"/>
  </svg>
);

const UnstopIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-label="Unstop">
    <circle cx="12" cy="12" r="10" fill="none" stroke="#0052FF" strokeWidth="2.5" />
    <path d="M12 6v6h6" stroke="#FFC700" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M12 18v-6h-6" stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

const Hack2skillIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Hack2skill" style={{ color: '#f43f5e' }}>
    <path d="M12 6c-3.18 0-6 2.37-6 5.5S8.82 17 12 17s6-2.37 6-5.5S15.18 6 12 6zm0 9c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
    <path d="M4.5 12c0-2.5 1.5-4.5 3.5-4.5s3.5 2 3.5 4.5S10 16.5 8 16.5 4.5 14.5 4.5 12z" opacity="0.5" />
    <path d="M19.5 12c0-2.5-1.5-4.5-3.5-4.5s-3.5 2-3.5 4.5s1.5 4.5 3.5 4.5 3.5-2.5 3.5-4.5z" opacity="0.5" />
  </svg>
);

// Map components for quick lookup
const BrandIcons = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  leetcode: LeetCodeIcon,
  kaggle: KaggleIcon,
  codeforces: CodeforcesIcon,
  hackerrank: HackerRankIcon,
  devfolio: DevfolioIcon,
  unstop: UnstopIcon,
  hack2skill: Hack2skillIcon,
};

// Interface for floating icon properties
const ICONS_CONFIG = [
  { id: 1, type: 'github', style: { top: '26%', left: '18%' } },
  { id: 2, type: 'linkedin', style: { top: '32%', right: '20%' } },
  { id: 3, type: 'leetcode', style: { top: '70%', right: '18%' } },
  { id: 4, type: 'kaggle', style: { top: '82%', right: '22%' } },
  { id: 5, type: 'codeforces', style: { top: '25%', left: '48%' } },
  { id: 6, type: 'hackerrank', style: { top: '64%', left: '17%' } },
  { id: 7, type: 'devfolio', style: { top: '84%', left: '21%' } },
  { id: 8, type: 'unstop', style: { top: '52%', right: '12%' } },
  { id: 9, type: 'hack2skill', style: { top: '45%', left: '10%' } },
];

const FloatingIcon = ({
  mouseX,
  mouseY,
  config,
  index,
}) => {
  const ref = useRef(null);

  // Motion values with spring physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 22 });
  const springY = useSpring(y, { stiffness: 220, damping: 22 });

  useEffect(() => {
    const handleMouseMove = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
          Math.pow(mouseX.current - elementCenterX, 2) +
            Math.pow(mouseY.current - elementCenterY, 2)
        );

        // Repel when mouse is within 180px
        if (distance < 180) {
          const angle = Math.atan2(
            mouseY.current - elementCenterY,
            mouseX.current - elementCenterX
          );
          // Stronger repulsion the closer the cursor is
          const force = (1 - distance / 180) * 55;
          x.set(-Math.cos(angle) * force);
          y.set(-Math.sin(angle) * force);
        } else {
          // Snap back gently
          x.set(0);
          y.set(0);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y, mouseX, mouseY]);

  const SelectedIcon = BrandIcons[config.type] || GitHubIcon;

  // Subtle randomized continuous idle floats
  const floatDuration = 4 + (index % 3) * 1.5;
  const floatDelay = index * 0.2;

  return (
    <motion.div
      ref={ref}
      className="floating-icon-wrapper"
      style={{
        ...config.style,
        x: springX,
        y: springY,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        className="floating-icon-card"
        animate={{
          y: [0, -7, 0, 7, 0],
          x: [0, 5, 0, -5, 0],
          rotate: [0, 4, 0, -4, 0],
        }}
        transition={{
          duration: floatDuration,
          delay: floatDelay,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      >
        <SelectedIcon className="floating-icon-svg" />
      </motion.div>
    </motion.div>
  );
};

export default function FloatingIconsHero({
  title,
  subtitle,
  onStartAuth,
  onLogin,
  onClearDatabase,
}) {
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  const handleMouseMove = (event) => {
    mouseX.current = event.clientX;
    mouseY.current = event.clientY;
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="floating-hero-section"
    >
      {/* Background Floating Elements */}
      <div className="floating-icons-container">
        {ICONS_CONFIG.map((config, index) => (
          <FloatingIcon
            key={config.id}
            mouseX={mouseX}
            mouseY={mouseY}
            config={config}
            index={index}
          />
        ))}
      </div>

      {/* Foreground Content */}
      <div className="hero-content" style={{ position: 'relative', zIndex: 10, margin: 0 }}>
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button onClick={onStartAuth} className="hero-btn-primary">
            Get Started — Sign in with GitHub
          </button>
          {onLogin && (
            <button onClick={onLogin} className="hero-btn-secondary">
              Log In
            </button>
          )}
        </div>

        {onClearDatabase && (
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={onClearDatabase}
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
        )}
      </div>
    </section>
  );
}
