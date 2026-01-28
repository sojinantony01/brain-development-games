import React, { useEffect, useState, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type StroopProps = {
  level: number
}

const COLORS = ['Red', 'Blue', 'Green', 'Yellow']

const Stroop = ({ level }: StroopProps): JSX.Element => {
  const [word, setWord] = useState({ text: 'RED', color: 'red' })
  const [speed, setSpeed] = useState(2000)
  const [score, setScore] = useState(0)
  const [swapButtons, setSwapButtons] = useState(false)

  useEffect(() => {
    // level-based modifications
    if (level <= 1) setSpeed(3000)
    else if (level <= 3) setSpeed(2000)
    else if (level <= 5) setSpeed(1500)
    else if (level <= 7) setSpeed(1000)
    else setSpeed(700)

    if (level >= 5 && level <= 5) setSwapButtons(true)
    if (level >= 6) setSwapButtons(true)
  }, [level])

  useEffect(() => {
    const t = setInterval(() => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const text = COLORS[Math.floor(Math.random() * COLORS.length)].toUpperCase()
      setWord({ text, color: color.toLowerCase() })
    }, speed)
    return () => clearInterval(t)
  }, [speed])

  const saved = useRef(false)
  const [completed, setCompleted] = useState(false)
  const target = Math.max(3, level * 2)

  // Reset state when level changes
  useEffect(() => {
    setCompleted(false)
    setScore(0)
    saved.current = false
  }, [level])

  const press = (color: string): void => {
    if (color.toLowerCase() === word.color) setScore((s) => s + 1)
    else setScore((s) => Math.max(0, s - 1))
    // swap buttons if level 5+ (simple approach)
    if (swapButtons) {
      // trivial: randomize button order by shuffling COLORS copy
      const idx = Math.floor(Math.random() * 4)
      const c = COLORS.splice(idx, 1)[0]
      COLORS.push(c)
    }
  }

  useEffect(() => {
    if (!saved.current && score >= target) {
      const percentageScore = Math.min(100, Math.round((score / target) * 100))
      markGameCompletedLevel('stroop', level, percentageScore, 100)
      saved.current = true
      setCompleted(true)
    }
  }, [score, level, target])

  const colorButtonStyles: Record<string, string> = {
    Red: 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600',
    Blue: 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600',
    Green: 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600',
    Yellow: 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600'
  }

  return (
    <>
      <CelebrationAnimation show={completed} />
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-indigo-700 flex items-center justify-center gap-3">
            🎨 Color Challenge
            <span className="text-2xl bg-indigo-100 px-4 py-1 rounded-full">Level {level}</span>
          </h2>
          <p className="text-lg text-slate-600 mt-2">Click the COLOR of the word, not what it says! 🧠</p>
        </div>

        <div className="mb-8 p-8 bg-white rounded-2xl shadow-lg border-4 border-indigo-200">
          <div className="text-7xl font-black text-center animate-pulse" style={{ color: word.color, textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
            {word.text}
          </div>
        </div>

        <div className="flex gap-4 mb-6 justify-center flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => press(c)}
              className={`px-8 py-4 ${colorButtonStyles[c]} text-white text-xl font-bold rounded-xl shadow-lg transform hover:scale-110 transition-all duration-200`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="text-center mb-6">
          <div className="inline-block bg-white px-8 py-4 rounded-xl shadow-md">
            <span className="text-2xl font-bold text-indigo-700">Score: </span>
            <span className="text-4xl font-black text-green-600">{score}</span>
            <span className="text-2xl font-bold text-slate-500"> / {target}</span>
          </div>
        </div>
        
        {completed && (
          <div className="mt-6 p-6 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-xl shadow-lg border-4 border-emerald-300">
            <div className="text-3xl font-bold text-center mb-4">🎉 Fantastic! Level {level} completed! 🎉</div>
            <div className="flex justify-center">
              <NextLevelButton currentLevel={level} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Stroop
