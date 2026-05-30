'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

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
      // Last question — submit
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

  const skipQuiz = async () => {
    router.push('/onboarding/interests')
  }

  if (status === 'loading' || questions.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem' }}>Loading quiz...</div>
      </div>
    )
  }

  if (submitting) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid rgba(0,242,254,0.2)', borderTopColor: 'var(--accent-cyan)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Generating your Developer DNA with AI...</div>
      </div>
    )
  }

  const question = questions[currentQ]
  const progress = Math.round((currentQ / questions.length) * 100)

  return (
    <div className="animate-slide-up" style={{ maxWidth: '640px', margin: '60px auto', padding: '0 20px' }}>
      <div className="glass-panel" style={{ padding: '40px' }}>
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Step 2 of 3 — Developer DNA Quiz
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
              {currentQ + 1} / {questions.length}
            </span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-gradient)', transition: 'width 0.4s ease' }} />
          </div>
        </div>

        <p style={{ fontSize: '1.15rem', fontWeight: 600, lineHeight: '1.55', color: 'var(--text-main)', marginBottom: '24px' }}>
          {question.q}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="btn-secondary"
              style={{
                padding: '16px 20px',
                textAlign: 'left',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                background: 'rgba(255,255,255,0.02)',
                borderColor: 'var(--border-light)',
                display: 'block',
                width: '100%',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,242,254,0.05)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-cyan)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-light)' }}
            >
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 800, marginRight: '10px', fontFamily: 'monospace' }}>
                {String.fromCharCode(65 + idx)}.
              </span>
              {opt.text}
            </button>
          ))}
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '12px' }}>{error}</p>}

        <button
          onClick={skipQuiz}
          style={{ marginTop: '20px', background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)', color: 'var(--text-dim)', fontSize: '0.72rem', padding: '8px', borderRadius: '8px', cursor: 'pointer', width: '100%' }}
        >
          Skip quiz — you can always take it later from your profile
        </button>
      </div>
    </div>
  )
}
