'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { Sun, Moon, BookOpen, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import PromptingIsAllYouNeed from './PromptingIsAllYouNeed'
import { TextScramble } from './TextScramble'
import { MenuContainer, MenuItem } from './Menu'

const GithubIcon = ({ isDark }: { isDark: boolean }) => (
  <svg className={cn("h-6 w-6 transition-colors duration-300", isDark ? "text-white" : "text-zinc-900")} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
  </svg>
)

export default function LandingPage() {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Check initial dark mode state
    const hasDark = document.documentElement.classList.contains('dark')
    setIsDark(hasDark)
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    }
  }

  const onStartAuth = () => signIn('github', { callbackUrl: '/onboarding/connect' })

  return (
    <main style={{ 
      width: '100%', 
      minHeight: '100vh', 
      background: isDark ? '#030305' : '#f8fafc', 
      position: 'relative', 
      overflow: 'hidden',
      transition: 'background 0.3s ease'
    }}>
      
      {/* Top Right Floating Expandable Menu */}
      <div style={{
        position: 'absolute',
        top: '24px',
        right: '24px',
        zIndex: 100
      }}>
        <MenuContainer>
          {/* Hamburger Menu Icon replacing Gear Icon */}
          <div className={cn(
            "flex items-center justify-center w-full h-full cursor-pointer transition-colors duration-300",
            isDark ? "text-white" : "text-zinc-900"
          )}>
            <Menu className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
          </div>

          <MenuItem
            onClick={toggleTheme}
            icon={isDark ? <Sun className="h-6 w-6 text-yellow-400" /> : <Moon className="h-6 w-6 text-indigo-500" />}
          />

          <MenuItem
            onClick={() => window.open('https://github.com/saha444/poofie', '_blank')}
            icon={<GithubIcon isDark={isDark} />}
          />

          <MenuItem
            onClick={() => window.open('/docs', '_blank')}
            icon={<BookOpen className={cn("h-6 w-6 transition-colors duration-300", isDark ? "text-emerald-400" : "text-emerald-600")} />}
          />
        </MenuContainer>
      </div>

      {/* TextScramble Brand Text positioned directly above the pixel game */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        textAlign: 'center'
      }}>
        <TextScramble
          duration={1.6}
          speed={0.05}
          className={cn(
            "text-4xl md:text-5xl font-black transition-colors duration-300",
            isDark ? "text-white" : "text-zinc-900"
          )}
          style={{
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            textShadow: isDark ? '0 0 15px rgba(255, 255, 255, 0.15)' : '0 0 10px rgba(0, 0, 0, 0.05)'
          }}
        >
          poofie
        </TextScramble>
      </div>

      {/* Background Interactive Retro Game displaying YOUR DEV ATTRIBUTIONS / AT ONE PLACE */}
      <PromptingIsAllYouNeed isDark={isDark} />

      {/* Cyber ambient glow */}
      <div style={{ 
        position: 'absolute', 
        width: '600px', 
        height: '600px', 
        background: isDark ? 'rgba(0, 242, 254, 0.04)' : 'rgba(59, 130, 246, 0.06)', 
        filter: 'blur(120px)', 
        borderRadius: '50%', 
        pointerEvents: 'none', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        zIndex: 1,
        transition: 'background 0.3s ease'
      }} />

      {/* Centered CTA Section */}
      <div style={{ 
        position: 'absolute', 
        top: '73%', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 10,
        textAlign: 'center',
        animation: 'slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ 
          marginBottom: '16px', 
          fontSize: '0.75rem', 
          fontWeight: 700, 
          color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(24, 24, 27, 0.6)', 
          letterSpacing: '0.2em', 
          fontFamily: 'monospace', 
          textTransform: 'uppercase',
          textShadow: isDark ? '0 0 10px rgba(255, 255, 255, 0.1)' : '0 0 8px rgba(0, 0, 0, 0.03)',
          transition: 'color 0.3s ease'
        }}>
          PULL TO START
        </div>

        <div className="toggle-container">
          <input 
            className="toggle-input" 
            type="checkbox"
            checked={isFlipped}
            onChange={(e) => {
              if (e.target.checked) {
                setIsFlipped(true)
                setTimeout(() => {
                  onStartAuth()
                }, 450)
              }
            }}
          />
          <div className="toggle-handle-wrapper">
            <div className="toggle-handle">
              <div className="toggle-handle-knob"></div>
              <div className="toggle-handle-bar-wrapper">
                <div className="toggle-handle-bar"></div>
              </div>
            </div>
          </div>
          <div className="toggle-base">
            <div className="toggle-base-inside"></div>
          </div>
        </div>
      </div>

    </main>
  )
}


