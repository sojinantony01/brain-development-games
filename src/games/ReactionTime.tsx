import React, { useEffect, useState, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type ReactionTimeProps = {
  level: number
}

export default function ReactionTime({ level }: ReactionTimeProps): JSX.Element {
  const [phase, setPhase] = useState<'ready' | 'wait' | 'click' | 'result'>('ready')
  const [startTime, setStartTime] = useState<number>(0)
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [attempts, setAttempts] = useState<number[]>([])
  const [completed, setCompleted] = useState(false)
  const saved = useRef(false)
  const timeoutRef = useRef<number | null>(null)
  
  const target = Math.max(5, level + 2)
  const avgThreshold = Math.max(500 - level * 30, 200)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    setAttempts([])
    setCompleted(false)
    saved.current = false
    setPhase('ready')
  }, [level])

  function startTest(): void {
    setPhase('wait')
    const delay = Math.random() * 3000 + 1000
    timeoutRef.current = window.setTimeout(() => {
      setStartTime(Date.now())
      setPhase('click')
    }, delay)
  }

  function handleClick(): void {
    if (phase === 'wait') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setPhase('result')
      setReactionTime(null)
      alert('Too early! Wait for the green signal.')
      setPhase('ready')
      return
    }

    if (phase === 'click') {
      const time = Date.now() - startTime
      setReactionTime(time)
      const newAttempts = [...attempts, time]
      setAttempts(newAttempts)
      setPhase('result')

      if (newAttempts.length >= target) {
        const avg = newAttempts.reduce((a, b) => a + b, 0) / newAttempts.length
        if (!saved.current && avg <= avgThreshold) {
          const score = Math.round(1000 / avg * 100)
          markGameCompletedLevel('reaction-time', level, score)
          saved.current = true
          setCompleted(true)
        }
      }
    }
  }

  const avgTime = attempts.length > 0
    ? attempts.reduce((a, b) => a + b, 0) / attempts.length
    : null

  return (
    <>
      <CelebrationAnimation show={completed} />
      <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">Reaction Time Test (Level {level})</h2>
      <p className="text-slate-600 mb-4">Click as fast as you can when the screen turns green!</p>

      <div className="mb-4 text-sm text-slate-500">
        Attempts: {attempts.length}/{target} • Target Avg: {'<'}{avgThreshold}ms
        {avgTime && ` • Your Avg: ${avgTime.toFixed(0)}ms`}
      </div>

      <div
        onClick={handleClick}
        className={`h-64 rounded-lg flex items-center justify-center cursor-pointer text-white text-2xl font-bold transition-colors ${
          phase === 'ready' ? 'bg-blue-500' : 
          phase === 'wait' ? 'bg-red-500' :
          phase === 'click' ? 'bg-green-500' :
          'bg-slate-300'
        }`}
      >
        {phase === 'ready' && 'Click to Start'}
        {phase === 'wait' && 'Wait...'}
        {phase === 'click' && 'CLICK NOW!'}
        {phase === 'result' && reactionTime && `${reactionTime}ms`}
      </div>

      {phase === 'result' && (
        <button
          onClick={() => setPhase('ready')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Try Again
        </button>
      )}

      {attempts.length > 0 && (
        <div className="mt-4 text-sm text-slate-500">
          Recent: {attempts.slice(-5).map(t => `${t}ms`).join(', ')}
        </div>
      )}

      {completed && (
        <div className="mt-4 p-4 bg-emerald-100 text-emerald-800 rounded">
          ✅ Level {level} completed! Average: {avgTime?.toFixed(0)}ms
          <div className="mt-2">
            <NextLevelButton currentLevel={level} />
          </div>
        </div>
      )}
    </div>
    </>
  )
}

// Made with Bob
