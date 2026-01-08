import React, { useEffect, useRef, useState } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type NBackProps = {
  level: number
}

function randItem(): string {
  const letters = 'ABCDEFGH'
  return letters[Math.floor(Math.random() * letters.length)]
}

export default function NBack({ level }: NBackProps): JSX.Element {
  const n = Math.min(Math.max(1, level <= 9 ? level : 2), 10) // level 1 -> 1-back, etc; for level 10 we'll treat specially as dual N-back
  const [sequence, setSequence] = useState<string[]>([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    // regenerate sequence on level change
    setSequence([])
    setIndex(0)
    setScore(0)
    setRunning(false)
    setCompleted(false)
    saved.current = false
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [level])

  function step(): void {
    setSequence((s) => [...s, randItem()])
    setIndex((i) => i + 1)
  }

  function start(): void {
    setSequence([])
    setIndex(0)
    setScore(0)
    setRunning(true)
    step()
    intervalRef.current = window.setInterval(step, Math.max(800 - level * 50, 300))
  }

  function stop(): void {
    setRunning(false)
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  function pressMatch(): void {
    // check if current item matches item n steps ago
    const curIdx = sequence.length - 1
    if (curIdx - n >= 0 && sequence[curIdx] === sequence[curIdx - n]) {
      setScore((s) => s + 1)
    } else {
      setScore((s) => Math.max(0, s - 1))
    }
  }

  // persist progress when reaching a target score (simple rule)
  const saved = useRef(false)
  const [completed, setCompleted] = useState(false)
  const target = Math.max(3, level * 2)
  
  useEffect(() => {
    if (!saved.current && score >= target) {
      markGameCompletedLevel('n-back', level, score, target)
      saved.current = true
      setCompleted(true)
    }
  }, [score, level, target])

  return (
    <>
      <CelebrationAnimation show={completed} />
      <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">N-Back (Level {level})</h2>
      <p className="text-slate-600 mb-4">Current N: {level === 10 ? 'Dual N-Back' : n}</p>

      <div className="mb-4">
        <div className="text-2xl font-bold">{sequence[sequence.length - 1] ?? '-'}</div>
        <div className="text-sm text-slate-500">Score: {score}</div>
      </div>

      <div className="flex gap-2">
        <button onClick={start} className="px-3 py-1 bg-green-500 text-white rounded" disabled={running}>Start</button>
        <button onClick={stop} className="px-3 py-1 bg-yellow-400 rounded" disabled={!running}>Stop</button>
        <button onClick={pressMatch} className="px-3 py-1 bg-indigo-600 text-white rounded">Match</button>
      </div>

      <div className="mt-4 text-sm text-slate-500">Press Match when the current item matches the one shown N steps ago.</div>
      
      {completed && (
        <div className="mt-4 p-4 bg-emerald-100 text-emerald-800 rounded">
          ✅ Level {level} completed! Target score: {target}
          <div className="mt-2">
            <NextLevelButton currentLevel={level} />
          </div>
        </div>
      )}
    </div>
    </>
  )
}
