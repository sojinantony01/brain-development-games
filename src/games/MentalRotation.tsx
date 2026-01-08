import React, { useMemo, useState, useEffect, useRef } from 'react'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type MentalRotationProps = {
  level: number
}

// Simple shape generator using letters as base shapes for L1-2 and blocks for higher levels
function generatePair(level: number): { left: string; right: string; same: boolean } {
  if (level <= 2) {
    // use single letter and sometimes mirror it
    const letters = ['R', 'L', 'E', 'F']
    const ch = letters[Math.floor(Math.random() * letters.length)]
    const same = Math.random() > 0.5
    const right = same ? ch : ch.split('').reverse().join('') // simple mirror
    return { left: ch, right, same }
  }

  // for higher levels produce pseudo-shapes as ascii patterns and rotate by multiples of 90
  const shapes = ['▮▯▮', '▯▮▯', '▮▮▯', '▯▮▮']
  const base = shapes[Math.floor(Math.random() * shapes.length)]
  const rot = [0, 90, 180, 270][Math.floor(Math.random() * 4)]
  const same = Math.random() > 0.5
  const right = same ? rotateAscii(base, rot) : rotateAscii(base, (rot + 90) % 360)
  return { left: base, right, same }
}

function rotateAscii(s: string, angle: number): string {
  // trivial "rotation" by rearranging characters for demo purposes
  if (angle === 0) return s
  if (angle === 90) return s.split('').reverse().join('')
  if (angle === 180) return s + ' ' + s
  return s.replace(/./g, (c) => c === '▮' ? '▯' : '▮')
}

export default function MentalRotation({ level }: MentalRotationProps): JSX.Element {
  const [pair, setPair] = useState(() => generatePair(level))
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const saved = useRef(false)
  const [completed, setCompleted] = useState(false)
  const target = Math.max(3, Math.ceil(level * 1.5))

  useEffect(() => {
    // regenerate when level changes
    setPair(generatePair(level))
    setScore(0)
    setAttempts(0)
    saved.current = false
  }, [level])

  function respawn(): void {
    setPair(generatePair(level))
  }

  function answer(isSame: boolean): void {
    setAttempts((a) => a + 1)
    const newScore = score + (isSame === pair.same ? 1 : 0)
    if (isSame === pair.same) setScore((s) => s + 1)
    // simple rule: persist when score reaches threshold
    if (!saved.current && newScore >= target) {
      import('../lib/progress').then(({ markGameCompletedLevel }) => {
        markGameCompletedLevel('mental-rotation', level, newScore)
      })
      saved.current = true
      setCompleted(true)
    }
    respawn()
  }

  return (
    <>
      <CelebrationAnimation show={won} />
      <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">Mental Rotation (Level {level})</h2>
      <p className="text-slate-600 mb-4">Decide if the right shape is the same as the left after rotation/mirroring.</p>

      <div className="flex gap-6 justify-center items-center my-4">
        <div className="w-40 h-24 flex items-center justify-center border rounded bg-slate-50 text-2xl font-mono">{pair.left}</div>
        <div className="text-2xl">⇨</div>
        <div className="w-40 h-24 flex items-center justify-center border rounded bg-slate-50 text-2xl font-mono">{pair.right}</div>
      </div>

      <div className="flex gap-2 justify-center">
        <button onClick={() => answer(true)} className="px-4 py-2 bg-green-500 text-white rounded">Same</button>
        <button onClick={() => answer(false)} className="px-4 py-2 bg-red-500 text-white rounded">Mirror/Different</button>
      </div>

      <div className="mt-4 text-sm text-slate-500">Score: {score} / {target} • Attempts: {attempts}</div>
      
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
