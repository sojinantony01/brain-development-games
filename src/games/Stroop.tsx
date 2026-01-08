import React, { useEffect, useState, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type StroopProps = {
  level: number
}

const COLORS = ['Red', 'Blue', 'Green', 'Yellow']

export default function Stroop({ level }: StroopProps): JSX.Element {
  const [word, setWord] = useState({ text: 'RED', color: 'red' })
  const [speed, setSpeed] = useState(2000)
  const [score, setScore] = useState(0)
  const [swapButtons, setSwapButtons] = useState(false)

  useEffect(() => {
    // level-based modifications
    if (level <= 1) setSpeed(2000)
    else if (level <= 4) setSpeed(1500)
    else if (level <= 6) setSpeed(1000)
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

  function press(color: string): void {
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
      markGameCompletedLevel('stroop', level, score)
      saved.current = true
      setCompleted(true)
    }
  }, [score, level, target])

  return (
    <>
      <CelebrationAnimation show={completed} />
      <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">Stroop Test (Level {level})</h2>
      <div className="my-4 text-3xl font-bold" style={{ color: word.color }}>{word.text}</div>
      <div className="flex gap-2">
        {COLORS.map((c) => (
          <button key={c} onClick={() => press(c)} className="px-3 py-1 bg-indigo-600 text-white rounded">{c}</button>
        ))}
      </div>
      <div className="mt-4 text-sm">Score: {score} / {target}</div>
      
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
