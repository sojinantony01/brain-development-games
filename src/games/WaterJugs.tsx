import React, { useEffect, useMemo, useState } from 'react'
import ShareButtons from '../components/ShareButtons'
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

export function configForLevel(level: number): JugConfig {
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

export default function WaterJugs({ level }: WaterJugsProps): JSX.Element {
  const cfg = useMemo(() => configForLevel(level), [level])
  const [jugs, setJugs] = useState<number[]>(() => cfg.capacities.map(() => 0))
  const [moves, setMoves] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState<number | null>(cfg.timerSeconds ?? null)
  const [won, setWon] = useState<boolean>(false)
  const [resetCount, setResetCount] = useState<number>(0)

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
        markGameCompletedLevel('water-jugs', level, score)
      })
      saved.current = true
    }
  }, [won, level, moves])

  function fill(index: number): void {
    setJugs((prev) => {
      const copy = [...prev]
      copy[index] = cfg.capacities[index]
      return copy
    })
    setMoves((m) => [...m, `Fill ${index + 1}`])
  }

  function empty(index: number): void {
    setJugs((prev) => {
      const copy = [...prev]
      copy[index] = 0
      return copy
    })
    setMoves((m) => [...m, `Empty ${index + 1}`])
  }

  function pour(from: number, to: number): void {
    setJugs((prev) => {
      const copy = [...prev]
      const amount = Math.min(copy[from], cfg.capacities[to] - copy[to])
      copy[from] -= amount
      copy[to] += amount
      return copy
    })
    setMoves((m) => [...m, `Pour ${from + 1} -> ${to + 1}`])
  }

  const isTimeUp = timeLeft !== null && timeLeft <= 0

  return (
    <>
      <CelebrationAnimation show={won} />
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold">Water Jugs (Level {level})</h2>
            <p className="text-slate-600">Target: <strong>{cfg.target}L</strong></p>
          </div>
          {!won && <ResetButton onReset={resetGame} resetCount={resetCount} />}
        </div>

      {cfg.timerSeconds && (
        <div className="mb-4">Time: <strong>{timeLeft ?? cfg.timerSeconds}</strong> seconds</div>
      )}

      <div className="flex gap-4 mb-4">
        {cfg.capacities.map((cap, i) => (
          <div key={i} className="border rounded p-4 flex-1 text-center">
            <div className="text-sm text-slate-500">Jug {i + 1}</div>
            <div className="text-2xl font-bold my-2">{jugs[i]}L / {cap}L</div>
            <div className="space-x-2">
              <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => fill(i)} disabled={won || isTimeUp}>Fill</button>
              <button className="px-3 py-1 bg-yellow-400 rounded" onClick={() => empty(i)} disabled={won || isTimeUp}>Empty</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Pour</h3>
        <div className="flex gap-2 flex-wrap">
          {cfg.capacities.map((_, i) =>
            cfg.capacities.map((_, j) =>
              i !== j ? (
                <button
                  key={`${i}-${j}`}
                  className="px-3 py-1 bg-indigo-600 text-white rounded"
                  onClick={() => pour(i, j)}
                  disabled={won || isTimeUp}
                >
                  {`Jug ${i + 1} → ${j + 1}`}
                </button>
              ) : null
            )
          )}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Moves</h3>
        <ul className="list-disc pl-6">
          {moves.slice().reverse().map((m, idx) => (
            <li key={idx}>{m}</li>
          ))}
        </ul>
      </div>

      {won ? (
        <div className="p-4 bg-emerald-100 text-emerald-800 rounded">
          ✅ You achieved the target!
          <div className="mt-4 flex flex-col gap-2">
            <NextLevelButton currentLevel={level} />
            <ShareButtons gameId="water-jugs" gameName="Water Jugs" level={level} score={Math.max(0, 100 - moves.length)} />
          </div>
        </div>
      ) : isTimeUp ? (
        <div className="p-4 bg-red-100 text-red-800 rounded">⏱ Time's up!</div>
      ) : null}
      </div>
    </>
  )
}
