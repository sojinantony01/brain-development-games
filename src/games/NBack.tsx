import React, { useEffect, useRef, useState } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type NBackProps = {
  level: number
}

const randItem = (level: number): string => {
  // Fewer letters for easier levels
  const letterSets = [
    'ABC',      // Level 1: 3 letters
    'ABCD',     // Level 2: 4 letters
    'ABCDE',    // Level 3: 5 letters
    'ABCDEF',   // Level 4+: 6 letters
  ]
  const letters = letterSets[Math.min(level - 1, 3)] || 'ABCDEFGH'
  return letters[Math.floor(Math.random() * letters.length)]
}

const NBack = ({ level }: NBackProps): JSX.Element => {
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

  const step = (): void => {
    setSequence((s) => [...s, randItem(level)])
    setIndex((i) => i + 1)
  }

  const start = (): void => {
    setSequence([])
    setIndex(0)
    setScore(0)
    setRunning(true)
    step()
    // Slower speed for easier levels: Level 1 = 1500ms, Level 2 = 1300ms, etc.
    intervalRef.current = window.setInterval(step, Math.max(1500 - level * 200, 400))
  }

  const stop = (): void => {
    setRunning(false)
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const pressMatch = (): void => {
    // check if current item matches item n steps ago
    const curIdx = sequence.length - 1
    if (curIdx - n >= 0 && sequence[curIdx] === sequence[curIdx - n]) {
      setScore((s) => s + 1)
    } else {
      // No penalty for early levels to encourage learning
      if (level > 2) {
        setScore((s) => Math.max(0, s - 1))
      }
    }
  }

  // persist progress when reaching a target score (simple rule)
  const saved = useRef(false)
  const [completed, setCompleted] = useState(false)
  const target = Math.max(3, level * 2)
  
  useEffect(() => {
    if (!saved.current && score >= target) {
      const percentageScore = Math.min(100, Math.round((score / target) * 100))
      markGameCompletedLevel('n-back', level, percentageScore, 100)
      saved.current = true
      setCompleted(true)
    }
  }, [score, level, target])

  return (
    <>
      <CelebrationAnimation show={completed} />
      <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-blue-700 flex items-center justify-center gap-3">
            🧠 Memory Challenge
            <span className="text-2xl bg-blue-100 px-4 py-1 rounded-full">Level {level}</span>
          </h2>
          <p className="text-lg text-slate-600 mt-2">
            {level === 10 ? '🎯 Dual N-Back Mode!' : `Remember ${n} steps back! 🎯`}
          </p>
        </div>

        <div className="mb-8 p-12 bg-white rounded-2xl shadow-lg border-4 border-blue-200">
          <div className="text-9xl font-black text-center text-blue-600 animate-pulse">
            {sequence[sequence.length - 1] ?? '🎮'}
          </div>
        </div>

        <div className="mb-6 text-center">
          <div className="inline-block bg-white px-8 py-4 rounded-xl shadow-md">
            <span className="text-2xl font-bold text-blue-700">Score: </span>
            <span className="text-4xl font-black text-green-600">{score}</span>
            <span className="text-2xl font-bold text-slate-500"> / {target}</span>
          </div>
        </div>

        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={start}
            className="px-8 py-4 bg-gradient-to-r from-green-400 to-green-500 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={running}
          >
            ▶️ Start
          </button>
          <button
            onClick={stop}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={!running}
          >
            ⏸️ Stop
          </button>
          <button
            onClick={pressMatch}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            ✨ Match!
          </button>
        </div>

        <div className="bg-blue-100 p-4 rounded-xl text-center">
          <p className="text-lg text-blue-800 font-semibold">
            💡 Press "Match" when the current letter matches the one shown {n} step{n > 1 ? 's' : ''} ago!
          </p>
        </div>
        
        {completed && (
          <div className="mt-6 p-6 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-xl shadow-lg border-4 border-emerald-300">
            <div className="text-3xl font-bold text-center mb-4">🎉 Amazing! Level {level} completed! 🎉</div>
            <div className="text-xl text-center mb-4">Target score: {target} ✨</div>
            <div className="flex justify-center">
              <NextLevelButton currentLevel={level} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default NBack
