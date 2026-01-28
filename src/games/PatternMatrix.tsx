import React, { useEffect, useMemo, useState, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type PatternMatrixProps = {
  level: number
}

const gridSize = (level: number): number => {
  if (level <= 1) return 3
  if (level <= 4) return 5
  if (level <= 7) return 8
  return 8
}

const PatternMatrix = ({ level }: PatternMatrixProps): JSX.Element => {
  const size = useMemo(() => gridSize(level), [level])
  const total = size * size
  const [pattern, setPattern] = useState<number[]>([])
  const [attempt, setAttempt] = useState<Set<number>>(new Set())
  const [phase, setPhase] = useState<'show' | 'recreate' | 'done'>('show')
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [roundNumber, setRoundNumber] = useState(1)
  const saved = useRef(false)
  const target = Math.max(3, Math.ceil(level / 2))

  const generateNewPattern = (): void => {
    // choose k squares to flash
    const k = Math.min(3 + Math.floor(level / 2), Math.floor(total / 2))
    const indices = new Set<number>()
    while (indices.size < k) indices.add(Math.floor(Math.random() * total))
    setPattern(Array.from(indices))
    setPhase('show')
    setAttempt(new Set())
    const t = setTimeout(() => setPhase('recreate'), Math.max(800, 1200 - level * 80))
  }

  useEffect(() => {
    setScore(0)
    setCompleted(false)
    setRoundNumber(1)
    saved.current = false
    generateNewPattern()
  }, [level, size, total])

  const toggle = (idx: number): void => {
    if (phase !== 'recreate') return
    setAttempt((prev) => new Set(prev).has(idx) ? new Set([...Array.from(prev)].filter((i) => i !== idx)) : new Set([...Array.from(prev), idx]))
  }

  const submit = (): void => {
    if (phase !== 'recreate') return
    
    const match = pattern.length === attempt.size && pattern.every((p) => attempt.has(p))
    
    if (match) {
      const newScore = score + 1
      setScore(newScore)
      
      if (newScore >= target) {
        // Completed all rounds!
        if (!saved.current) {
          markGameCompletedLevel('pattern-matrix', level, newScore, target)
          saved.current = true
        }
        setCompleted(true)
        setPhase('done')
      } else {
        // Generate next pattern for next round
        setRoundNumber((r) => r + 1)
        generateNewPattern()
      }
    } else {
      // Wrong answer - show feedback and allow retry
      setPhase('done')
      setTimeout(() => {
        setPhase('show')
        setTimeout(() => setPhase('recreate'), Math.max(800, 1200 - level * 80))
      }, 1000)
    }
  }

  return (
    <>
      <CelebrationAnimation show={completed} />
      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent">
        🎨 Pattern Matrix (Level {level})
      </h2>
      <p className="text-xl text-slate-700 mb-6 font-semibold">Observe the flashed squares and recreate the pattern!</p>

      <div className="grid gap-2 mb-6 p-6 bg-white/50 rounded-xl backdrop-blur border-4 border-pink-200 mx-auto" style={{ gridTemplateColumns: `repeat(${size}, 40px)`, maxWidth: 'fit-content' }}>
        {Array.from({ length: total }, (_, idx) => {
          const showing = phase === 'show' && pattern.includes(idx)
          const chosen = attempt.has(idx)
          return (
            <div
              key={idx}
              onClick={() => toggle(idx)}
              className={`w-10 h-10 border-2 rounded-lg transition-all transform cursor-pointer shadow-md ${
                showing ? 'bg-gradient-to-br from-black to-gray-800 scale-110 animate-pulse' :
                chosen ? 'bg-gradient-to-br from-indigo-400 to-purple-500 scale-105' :
                'bg-white hover:bg-gray-100 hover:scale-105'
              }`}
            />
          )
        })}
      </div>

      <div className="flex gap-4 justify-center mb-4">
        <button
          onClick={() => {
            setPhase('show')
            setTimeout(() => setPhase('recreate'), Math.max(800, 1200 - level * 80))
          }}
          className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xl font-bold rounded-xl hover:from-yellow-500 hover:to-orange-500 shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={phase !== 'recreate'}
        >
          🔄 Replay
        </button>
        <button
          onClick={submit}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xl font-bold rounded-xl hover:from-indigo-600 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={phase !== 'recreate'}
        >
          ✓ Submit
        </button>
      </div>

      <div className="space-y-3">
        <div className="text-2xl font-bold text-center text-indigo-600 bg-white/70 p-4 rounded-xl backdrop-blur">
          Round: {roundNumber} / {target}
        </div>
        <div className="text-2xl font-bold text-center text-purple-600 bg-white/70 p-4 rounded-xl backdrop-blur">
          Score: {score} / {target}
        </div>
      </div>
      
      {phase === 'done' && !completed && (
        <div className="mt-4 p-4 bg-red-100 border-2 border-red-400 rounded-xl text-center">
          <p className="text-lg font-bold text-red-700">❌ Incorrect! Try again...</p>
        </div>
      )}
      
      {completed && (
        <div className="mt-6 p-6 bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 rounded-xl border-4 border-green-400 shadow-lg">
          <div className="text-3xl font-bold mb-2">✅ Level {level} completed!</div>
          <div className="mt-4">
            <NextLevelButton currentLevel={level} />
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default PatternMatrix
