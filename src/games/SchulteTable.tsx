import React, { useEffect, useMemo, useRef, useState } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type SchulteProps = {
  level: number
}

const sizeForLevel = (level: number): number => {
  if (level === 1) return 3
  if (level === 2) return 4
  if (level === 3) return 5
  if (level >= 8) return 7
  return 5
}

const SchulteTable = ({ level }: SchulteProps): JSX.Element => {
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

  const clickNumber = (n: number): void => {
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

  const reset = (): void => {
    setNext(1)
    setStartTime(null)
    setTime(null)
    saved.current = false
  }

  return (
    <>
      <CelebrationAnimation show={time !== null} />
      <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-700 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <span>🔢 Number Hunt</span>
            <span className="text-lg sm:text-xl lg:text-2xl bg-orange-100 px-3 sm:px-4 py-1 rounded-full">Level {level}</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 mt-2 px-2">Find numbers from 1 to {total} as fast as you can! ⚡</p>
        </div>

        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center text-base sm:text-lg font-bold">
          <div className="bg-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl shadow-md">
            <span className="text-blue-600">🎯 Next:</span> <span className="text-2xl sm:text-3xl lg:text-4xl text-blue-700">{next}</span>
          </div>
          {time !== null && (
            <div className="bg-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl shadow-md">
              <span className="text-green-600">⏱️ Time:</span> <span className="text-2xl sm:text-3xl lg:text-4xl text-green-700">{(time / 1000).toFixed(2)}s</span>
            </div>
          )}
        </div>

        <div
          className="grid gap-2 sm:gap-3 mb-4 sm:mb-6 max-w-2xl mx-auto w-full px-2"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        >
          {numbers.map((n) => (
            <button
              key={n}
              onClick={() => clickNumber(n)}
              className={`aspect-square text-xl sm:text-2xl lg:text-3xl font-black rounded-lg sm:rounded-xl transition-all transform hover:scale-105 shadow-lg ${
                n < next || (time !== null && n === total)
                  ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white scale-95 opacity-60'
                  : 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white hover:from-blue-500 hover:to-indigo-600'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="flex justify-center px-2">
          <button
            onClick={reset}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-base sm:text-lg lg:text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all w-full sm:w-auto"
          >
            🔄 Reset
          </button>
        </div>
        
        {time !== null && (
          <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-xl shadow-lg border-2 sm:border-4 border-emerald-300 mx-2">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-2">🎉 Amazing! Completed in {(time / 1000).toFixed(2)}s! 🎉</div>
            <div className="flex justify-center mt-3 sm:mt-4">
              <NextLevelButton currentLevel={level} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default SchulteTable
