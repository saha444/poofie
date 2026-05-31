'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

// Soft dark palette
const C = {
  bg: '#0e0e0e',
  surface: '#141414',
  hover: '#1c1c1c',
  border: '#2e2e2e',
  borderMid: '#3a3a3a',
  text: '#f0f0f0',
  muted: '#c8c8c8',
  dim: '#888888',
  btnBg: '#efefef',
  btnText: '#111111',
}

type Question = {
  id: number
  q: string
  options: { text: string; scores: Record<string, number> }[]
}

export default function DNAQuizPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/')
  }, [status, router])

  useEffect(() => {
    fetch('/api/dna/quiz')
      .then(r => r.json())
      .then(d => setQuestions(d.questions || []))
  }, [])

  const handleAnswer = async (optionIndex: number) => {
    const newAnswers = { ...answers, [currentQ]: optionIndex }
    setAnswers(newAnswers)

    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1)
    } else {
      setSubmitting(true)
      setError('')
      try {
        const res = await fetch('/api/dna/quiz/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: newAnswers }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        router.push('/onboarding/interests')
      } catch (e: any) {
        setError(e.message || 'Failed to submit quiz')
        setSubmitting(false)
      }
    }
  }

  if (status === 'loading' || questions.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: C.bg }}>
        <div style={{ color: C.dim, fontSize: '0.9rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Loading quiz...
        </div>
      </div>
    )
  }

  if (submitting) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '20px', background: C.bg }}>
        <div style={{
          width: '48px', height: '48px',
          border: `3px solid ${C.border}`,
          borderTopColor: C.muted,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <div style={{ color: C.muted, fontSize: '0.9rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Generating your Developer DNA...
        </div>
      </div>
    )
  }

  const question = questions[currentQ]
  const progress = Math.round((currentQ / questions.length) * 100)

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '640px' }}>

        {/* Card */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '48px' }}>

          {/* Progress bar */}
          <div style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{
                fontSize: '0.68rem', color: C.dim, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.12em',
                fontFamily: 'var(--font-heading)',
              }}>
                Developer DNA Quiz — Step 2 of 3
              </span>
              <span style={{ fontSize: '0.72rem', color: C.muted, fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                {currentQ + 1} / {questions.length}
              </span>
            </div>
            <div style={{ width: '100%', height: '3px', background: C.hover, borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                width: `${progress}%`, height: '100%',
                background: C.muted,
                transition: 'width 0.4s ease',
                borderRadius: '2px',
              }} />
            </div>
          </div>

          {/* Question */}
          <p style={{
            fontSize: '1.2rem', fontWeight: 700, lineHeight: '1.6',
            color: C.text, marginBottom: '28px',
            fontFamily: 'var(--font-heading)',
            textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            {question.q}
          </p>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                style={{
                  padding: '18px 20px',
                  textAlign: 'left',
                  fontSize: '0.88rem',
                  lineHeight: '1.55',
                  display: 'block',
                  width: '100%',
                  cursor: 'pointer',
                  borderRadius: '10px',
                  background: C.hover,
                  border: `1px solid ${C.border}`,
                  color: C.muted,
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = C.btnBg
                  ;(e.currentTarget as HTMLElement).style.color = C.btnText
                  ;(e.currentTarget as HTMLElement).style.borderColor = C.btnBg
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = C.hover
                  ;(e.currentTarget as HTMLElement).style.color = C.muted
                  ;(e.currentTarget as HTMLElement).style.borderColor = C.border
                }}
              >
                <span style={{ fontWeight: 800, marginRight: '12px', fontFamily: 'var(--font-heading)', color: C.dim }}>
                  {String.fromCharCode(65 + idx)}.
                </span>
                {opt.text}
              </button>
            ))}
          </div>

          {error && (
            <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '16px', fontFamily: 'var(--font-body)' }}>{error}</p>
          )}

          {/* Skip */}
          <button
            onClick={() => router.push('/onboarding/interests')}
            style={{
              marginTop: '24px',
              background: 'transparent',
              border: `1px dashed ${C.border}`,
              color: C.dim,
              fontSize: '0.72rem',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = C.borderMid
              ;(e.currentTarget as HTMLElement).style.color = C.muted
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = C.border
              ;(e.currentTarget as HTMLElement).style.color = C.dim
            }}
          >
            Skip — take it later from your profile
          </button>
        </div>
      </div>
    </div>
  )
}
