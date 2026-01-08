import React, { useMemo, useState, useEffect } from 'react'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'
import ResetButton from '../components/ResetButton'
export type TowerProps = {
  level: number
}

export function disksForLevel(level: number): number {
  // Level 1: 3 disks, Level 2: 4, Level 3:5, ... Level 8:10
  if (level <= 8) return 2 + level // 3..10
  if (level === 9) return 5 // randomized starting pos
  return 6 // level 10: 6 disks with blind mode
}

export default function TowerOfHanoi({ level }: TowerProps): JSX.Element {
  const diskCount = useMemo(() => disksForLevel(level), [level])

  // rods are arrays of disk sizes (1=smallest, diskCount=largest), top at end
  const initialRods = useMemo(() => {
    if (level === 9) {
      // randomized starting position: put disks across rods randomly
      const disks = Array.from({ length: diskCount }, (_, i) => diskCount - i)
      const rods = [[], [], []] as number[][]
      disks.forEach((d) => rods[Math.floor(Math.random() * 3)].push(d))
      return rods
    }
    // default: all on rod 0, largest at bottom
    return [Array.from({ length: diskCount }, (_, i) => diskCount - i), [], []]
  }, [diskCount, level])

  const [rods, setRods] = useState<number[][]>(initialRods)
  const [selectedFrom, setSelectedFrom] = useState<number | null>(null)
  const [moves, setMoves] = useState<number>(0)
  const [won, setWon] = useState(false)
  const [resetCount, setResetCount] = useState<number>(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    setRods(initialRods)
    setSelectedFrom(null)
    setMoves(0)
    setWon(false)
    setHidden(false)
    setResetCount(0)
    if (level === 10) {
      // blind mode: hide after 2s
      const t = setTimeout(() => setHidden(true), 2000)
      return () => clearTimeout(t)
    }
    return undefined
  }, [initialRods, level])

  function canMove(from: number, to: number): boolean {
    const src = rods[from]
    const dst = rods[to]
    if (src.length === 0) return false
    const disk = src[src.length - 1]
    const destTop = dst[dst.length - 1]
    return destTop === undefined || disk < destTop
  }

  function handleRodClick(index: number): void {
    if (won) return
    if (selectedFrom === null) {
      if (rods[index].length === 0) return
      setSelectedFrom(index)
      return
    }
    if (selectedFrom === index) {
      setSelectedFrom(null)
      return
    }
    if (!canMove(selectedFrom, index)) {
      // illegal move; ignore
      setSelectedFrom(null)
      return
    }
    // perform move
    setRods((prev) => {
      const copy = prev.map((r) => r.slice())
      const disk = copy[selectedFrom].pop() as number
      copy[index].push(disk)
      return copy
    })
    setMoves((m) => m + 1)
    setSelectedFrom(null)
  }

  useEffect(() => {
    // win condition: all disks on rod 2 (or any rod other than start for randomized)
    const target = level === 9 ? 0 : 2
    if (rods[target].length === diskCount) {
      setWon(true)
      // persist progress and add leaderboard entry (score = 100 - moves)
      import('../lib/progress').then(({ markGameCompletedLevel }) => {
        markGameCompletedLevel('tower-of-hanoi', level, Math.max(0, 100 - moves), 100)
      })
    }
  }, [rods, diskCount, level])

  function renderDisk(d: number): JSX.Element {
    const width = 20 + d * 10
    return (
      <div
        key={d}
        className="mx-auto my-1 bg-indigo-400 text-white text-center rounded"
        style={{ width: `${width}px`, height: '22px' }}
      >
        {!hidden ? ` ${d}` : ''}
      </div>
    )
  }

  return (
    <>
      <CelebrationAnimation show={won} />
      <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">Tower of Hanoi (Level {level})</h2>
      <p className="text-slate-600 mb-2">Disks: {diskCount} • Moves: {moves}</p>

      {level === 10 && <div className="mb-2 text-sm text-slate-500">Blind mode: disks hide after 2 seconds.</div>}

      <div className="flex gap-6 justify-center my-4">
        {rods.map((r, idx) => (
          <div key={idx} className="flex-1 text-center">
            <div className="mb-2 text-sm">Rod {idx + 1}</div>
            <div
              onClick={() => handleRodClick(idx)}
              role="button"
              tabIndex={0}
              className={`min-h-[140px] border p-4 flex flex-col justify-end items-center cursor-pointer ${selectedFrom === idx ? 'ring-2 ring-indigo-400' : ''}`}
            >
              {r.map((d) => renderDisk(d))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        {won ? (
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded">
            ✅ Puzzle solved in {moves} moves!
            <div className="mt-4 flex flex-col gap-2">
              <NextLevelButton currentLevel={level} />
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-500">Click a rod to select a top disk, then click another rod to move it (legal moves only).</div>
        )}
      </div>
    </div>
    </>
  )
}
