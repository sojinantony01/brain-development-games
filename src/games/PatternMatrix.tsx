import React, { useEffect, useMemo, useState, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type PatternMatrixProps = {
  level: number
}

function gridSize(level: number): number {
  if (level <= 1) return 3
  if (level <= 4) return 5
  if (level <= 7) return 8
  return 8
}

export default function PatternMatrix({ level }: PatternMatrixProps): JSX.Element {
  const size = useMemo(() => gridSize(level), [level])
  const total = size * size
  const [pattern, setPattern] = useState<number[]>([])
  const [attempt, setAttempt] = useState<Set<number>>(new Set())
  const [phase, setPhase] = useState<'show' | 'recreate' | 'done'>('show')
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const saved = useRef(false)
  const target = Math.max(3, Math.ceil(level / 2))

  useEffect(() => {
    // choose k squares to flash
    const k = Math.min(3 + Math.floor(level / 2), Math.floor(total / 2))
    const indices = new Set<number>()
    while (indices.size < k) indices.add(Math.floor(Math.random() * total))
    setPattern(Array.from(indices))
    setPhase('show')
    setAttempt(new Set())
    setScore(0)
    setCompleted(false)
    saved.current = false
    const t = setTimeout(() => setPhase('recreate'), Math.max(800, 1200 - level * 80))
    return () => clearTimeout(t)
  }, [level, size, total])

  function toggle(idx: number): void {
    if (phase !== 'recreate') return
    setAttempt((prev) => new Set(prev).has(idx) ? new Set([...Array.from(prev)].filter((i) => i !== idx)) : new Set([...Array.from(prev), idx]))
  }

  function submit(): void {
    const match = pattern.length === attempt.size && pattern.every((p) => attempt.has(p))
    if (match) {
      const newScore = score + 1
      setScore((s) => s + 1)
      if (!saved.current && newScore >= target) {
        markGameCompletedLevel('pattern-matrix', level, newScore)
        saved.current = true
        setCompleted(true)
      }
    }
    setPhase('done')
  }

  return (
    <>
      <CelebrationAnimation show={completed} />
      <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">Pattern Matrix (Level {level})</h2>
      <p className="text-slate-600 mb-4">Observe the flashed squares and recreate the pattern.</p>

      <div className="grid gap-1 mb-4" style={{ gridTemplateColumns: `repeat(${size}, 28px)` }}>
        {Array.from({ length: total }, (_, idx) => {
          const showing = phase === 'show' && pattern.includes(idx)
          const chosen = attempt.has(idx)
          return (
            <div
              key={idx}
              onClick={() => toggle(idx)}
              className={`w-7 h-7 border ${showing ? 'bg-black' : chosen ? 'bg-indigo-400' : 'bg-white'}`}
            />
          )
        })}
      </div>

      <div className="flex gap-2">
        <button onClick={() => { setPhase('show'); setTimeout(() => setPhase('recreate'), 800) }} className="px-3 py-1 bg-yellow-400 rounded">Replay</button>
        <button onClick={submit} className="px-3 py-1 bg-indigo-600 text-white rounded">Submit</button>
      </div>

      <div className="mt-4 text-sm text-slate-500">Score: {score} / {target}</div>
      
      {completed && (
        <div className="mt-4 p-4 bg-emerald-100 text-emerald-800 rounded">
          ✅ Level {level} completed!
          <div className="mt-2">
            <NextLevelButton currentLevel={level} />
          </div>
        </div>
      )}
    </div>
    </>
  )
}
