import React, { useEffect, useMemo, useState } from 'react'
import NextLevelButton from '../components/NextLevelButton'
import ResetButton from '../components/ResetButton'
import CelebrationAnimation from '../components/CelebrationAnimation'
export type WaterJugsProps = {
  level: number
}

export type JugConfig = {
  capacities: number[]
  target: number
  timerSeconds?: number
}

export const configForLevel = (level: number): JugConfig => {
  switch (level) {
    case 1:
      return { capacities: [3, 5], target: 4 }
    case 2:
      return { capacities: [5, 7], target: 6 }
    case 3:
      return { capacities: [3, 7], target: 5 }
    case 4:
      return { capacities: [5, 11], target: 7 }
    case 5:
      return { capacities: [7, 13], target: 5 }
    case 6:
      return { capacities: [3, 5, 8], target: 4 }
    case 7:
      return { capacities: [5, 7, 11], target: 9 }
    case 8:
      return { capacities: [3, 7, 10], target: 5 }
    case 9:
      return { capacities: [4, 9, 13], target: 6 }
    case 10:
      return { capacities: [5, 8, 13], target: 11, timerSeconds: 90 }
    default:
      return { capacities: [3, 5], target: 4 }
  }
}

const WaterJugs = ({ level }: WaterJugsProps): JSX.Element => {
  const cfg = useMemo(() => configForLevel(level), [level])
  const [jugs, setJugs] = useState<number[]>(() => cfg.capacities.map(() => 0))
  const [moves, setMoves] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState<number | null>(cfg.timerSeconds ?? null)
  const [won, setWon] = useState<boolean>(false)
  const [resetCount, setResetCount] = useState<number>(0)
  const [animatingJug, setAnimatingJug] = useState<number | null>(null)

  const resetGame = () => {
    setJugs(cfg.capacities.map(() => 0))
    setMoves([])
    setWon(false)
    setTimeLeft(cfg.timerSeconds ?? null)
    setResetCount(prev => prev + 1)
    saved.current = false
  }

  useEffect(() => {
    setJugs(cfg.capacities.map(() => 0))
    setMoves([])
    setWon(false)
    setTimeLeft(cfg.timerSeconds ?? null)
    setResetCount(0)
  }, [cfg])

  useEffect(() => {
    if (timeLeft === null) return
    if (timeLeft <= 0) return
    const t = setInterval(() => setTimeLeft((s) => (s === null ? null : s - 1)), 1000)
    return () => clearInterval(t)
  }, [timeLeft])

  useEffect(() => {
    if (jugs.some((v) => v === cfg.target)) {
      setWon(true)
    }
  }, [jugs, cfg.target])

  // persist completion to localStorage (only once per win) and add leaderboard entry
  const saved = React.useRef(false)
  useEffect(() => {
    if (won && !saved.current) {
      const movesCount = moves.length
      const score = Math.max(0, 100 - movesCount)
      import('../lib/progress').then(({ markGameCompletedLevel }) => {
        markGameCompletedLevel('water-jugs', level, score, 100)
      })
      saved.current = true
    }
  }, [won, level, moves])

  const fill = (index: number): void => {
    setAnimatingJug(index)
    setTimeout(() => {
      setJugs((prev) => {
        const copy = [...prev]
        copy[index] = cfg.capacities[index]
        return copy
      })
      setMoves((m) => [...m, `Fill ${index + 1}`])
      setAnimatingJug(null)
    }, 600)
  }

  const empty = (index: number): void => {
    setAnimatingJug(index)
    setTimeout(() => {
      setJugs((prev) => {
        const copy = [...prev]
        copy[index] = 0
        return copy
      })
      setMoves((m) => [...m, `Empty ${index + 1}`])
      setAnimatingJug(null)
    }, 400)
  }

  const pour = (from: number, to: number): void => {
    setAnimatingJug(to)
    setTimeout(() => {
      setJugs((prev) => {
        const copy = [...prev]
        const amount = Math.min(copy[from], cfg.capacities[to] - copy[to])
        copy[from] -= amount
        copy[to] += amount
        return copy
      })
      setMoves((m) => [...m, `Pour ${from + 1} -> ${to + 1}`])
      setAnimatingJug(null)
    }, 500)
  }

  const isTimeUp = timeLeft !== null && timeLeft <= 0

  const renderJug = (index: number, capacity: number, current: number) => {
    const fillPercentage = (current / capacity) * 100
    const isAnimating = animatingJug === index
    const jugColors = ['bg-gradient-to-b from-blue-400 to-blue-600', 'bg-gradient-to-b from-purple-400 to-purple-600', 'bg-gradient-to-b from-pink-400 to-pink-600']
    const waterColors = ['bg-gradient-to-t from-cyan-400 to-cyan-300', 'bg-gradient-to-t from-blue-400 to-blue-300', 'bg-gradient-to-t from-teal-400 to-teal-300']
    
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="text-lg font-bold text-indigo-700">🏺 Jug {index + 1}</div>
        
        {/* Jar Container */}
        <div className="relative w-32 h-48 rounded-b-3xl border-4 border-indigo-400 bg-gradient-to-b from-blue-50 to-blue-100 shadow-lg overflow-hidden">
          {/* Jar neck */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-gradient-to-b from-indigo-300 to-indigo-400 rounded-t-lg border-2 border-indigo-400"></div>
          
          {/* Water with animation */}
          <div
            className={`absolute bottom-0 left-0 right-0 ${waterColors[index % 3]} transition-all duration-500 ease-out ${isAnimating ? 'animate-pulse' : ''}`}
            style={{
              height: `${fillPercentage}%`,
              boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.5)'
            }}
          >
            {/* Water surface animation */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-white opacity-30 animate-pulse"></div>
            {/* Bubbles */}
            {current > 0 && (
              <>
                <div className="absolute bottom-2 left-4 w-2 h-2 bg-white rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
                <div className="absolute bottom-6 right-6 w-1.5 h-1.5 bg-white rounded-full opacity-50 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
                <div className="absolute bottom-10 left-8 w-1 h-1 bg-white rounded-full opacity-40 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
              </>
            )}
          </div>
          
          {/* Measurement lines */}
          {Array.from({ length: capacity }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-t border-indigo-300 border-dashed opacity-40"
              style={{ bottom: `${((i + 1) / capacity) * 100}%` }}
            >
              <span className="absolute -left-8 -top-2 text-xs text-indigo-600">{i + 1}</span>
            </div>
          ))}
        </div>
        
        {/* Display */}
        <div className="text-center">
          <div className="text-3xl font-bold text-indigo-700">{current}L</div>
          <div className="text-sm text-slate-500">of {capacity}L</div>
        </div>
        
        {/* Buttons */}
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={() => fill(index)}
            disabled={won || isTimeUp || isAnimating}
          >
            💧 Fill
          </button>
          <button
            className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={() => empty(index)}
            disabled={won || isTimeUp || isAnimating}
          >
            🚰 Empty
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <CelebrationAnimation show={won} />
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8 rounded-2xl shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
              🎯 Water Jugs Challenge
              <span className="text-2xl bg-indigo-100 px-3 py-1 rounded-full">Level {level}</span>
            </h2>
            <p className="text-lg text-slate-600 mt-2">
              Target: <strong className="text-2xl text-green-600">{cfg.target}L</strong> 💦
            </p>
          </div>
          {!won && <ResetButton onReset={resetGame} resetCount={resetCount} />}
        </div>

      {cfg.timerSeconds && (
        <div className="mb-6 text-xl font-bold text-orange-600 bg-orange-100 px-4 py-2 rounded-lg inline-block">
          ⏱️ Time: <strong>{timeLeft ?? cfg.timerSeconds}</strong> seconds
        </div>
      )}

      <div className="flex gap-8 mb-6 justify-center flex-wrap">
        {cfg.capacities.map((cap, i) => (
          <div key={i}>
            {renderJug(i, cap, jugs[i])}
          </div>
        ))}
      </div>

      <div className="mb-6 bg-white p-4 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-indigo-700 mb-3">🔄 Pour Water</h3>
        <div className="flex gap-2 flex-wrap justify-center">
          {cfg.capacities.map((_, i) =>
            cfg.capacities.map((_, j) =>
              i !== j ? (
                <button
                  key={`${i}-${j}`}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  onClick={() => pour(i, j)}
                  disabled={won || isTimeUp || animatingJug !== null}
                >
                  {`Jug ${i + 1} ➜ ${j + 1}`}
                </button>
              ) : null
            )
          )}
        </div>
      </div>

      <div className="mb-6 bg-white p-4 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-indigo-700 mb-3">📝 Move History</h3>
        <div className="max-h-32 overflow-y-auto">
          <ul className="space-y-1">
            {moves.slice().reverse().map((m, idx) => (
              <li key={idx} className="text-slate-700 bg-slate-50 px-3 py-1 rounded">
                {idx + 1}. {m}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {won ? (
        <div className="p-6 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-xl shadow-lg border-2 border-emerald-300">
          <div className="text-2xl font-bold mb-2">🎉 Amazing! You achieved the target! 🎉</div>
          <div className="text-lg">You completed it in {moves.length} moves!</div>
          <div className="mt-4 flex flex-col gap-2">
            <NextLevelButton currentLevel={level} />
          </div>
        </div>
      ) : isTimeUp ? (
        <div className="p-6 bg-gradient-to-r from-red-100 to-orange-100 text-red-800 rounded-xl shadow-lg border-2 border-red-300">
          <div className="text-2xl font-bold">⏱️ Time's up! Try again! 💪</div>
        </div>
      ) : null}
      </div>
    </>
  )
}

export default WaterJugs
