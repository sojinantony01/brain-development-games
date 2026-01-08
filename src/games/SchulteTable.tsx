import React, { useEffect, useMemo, useRef, useState } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type SchulteProps = {
  level: number
}

function sizeForLevel(level: number): number {
  if (level === 1) return 3
  if (level === 2) return 4
  if (level === 3) return 5
  if (level >= 8) return 7
  return 5
}

export default function SchulteTable({ level }: SchulteProps): JSX.Element {
  const size = useMemo(() => sizeForLevel(level), [level])
  const total = size * size
  const numbers = useMemo(() => {
    const arr = Array.from({ length: total }, (_, i) => i + 1)
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [size, total])

  const [next, setNext] = useState(1)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [time, setTime] = useState<number | null>(null)
  const saved = useRef(false)

  useEffect(() => {
    setNext(1)
    setStartTime(null)
    setTime(null)
    saved.current = false
  }, [level])

  function clickNumber(n: number): void {
    if (startTime === null) setStartTime(Date.now())
    if (n === next) {
      if (next === total) {
        const t = Date.now() - (startTime ?? Date.now())
        setTime(t)
        // check threshold to save progress
        const threshold = size * size * 500 // heuristic: 500ms per cell
        if (!saved.current && t <= threshold) {
          markGameCompletedLevel('schulte-table', level, Math.max(0, Math.round(100000 / t)), 100)
          saved.current = true
        }
      } else {
        setNext((s) => s + 1)
      }
    }
  }

  function reset(): void {
    setNext(1)
    setStartTime(null)
    setTime(null)
    saved.current = false
  }

  return (
    <>
      <CelebrationAnimation show={time !== null} />
      <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">Schulte Table (Level {level})</h2>
      <p className="text-slate-600 mb-4">Find numbers from 1 to {total} as fast as you can.</p>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(40px, 1fr))` }}
      >
        {numbers.map((n) => (
          <button
            key={n}
            onClick={() => clickNumber(n)}
            className={`p-3 border rounded ${n < next ? 'bg-emerald-100 text-emerald-800' : 'bg-white'}`}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="text-sm text-slate-500">Next: {next}</div>
        {time !== null && <div className="text-sm text-slate-700">Time: {(time / 1000).toFixed(2)}s</div>}
        <button onClick={reset} className="ml-auto px-3 py-1 bg-yellow-400 rounded">Reset</button>
      </div>
      
      {time !== null && (
        <div className="mt-4 p-4 bg-emerald-100 text-emerald-800 rounded">
          ✅ Completed in {(time / 1000).toFixed(2)}s!
          <div className="mt-2">
            <NextLevelButton currentLevel={level} />
          </div>
        </div>
      )}
    </div>
    </>
  )
}
