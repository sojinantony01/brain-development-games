import React, { useMemo, useState, useEffect } from 'react'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'
import ResetButton from '../components/ResetButton'
export type TowerProps = {
  level: number
}

export const disksForLevel = (level: number): number => {
  // Level 1: 3 disks, Level 2: 4, Level 3:5, ... Level 8:10
  if (level <= 8) return 2 + level // 3..10
  if (level === 9) return 5 // randomized starting pos
  return 6 // level 10: 6 disks with blind mode
}

const TowerOfHanoi = ({ level }: TowerProps): JSX.Element => {
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

  const canMove = (from: number, to: number): boolean => {
    const src = rods[from]
    const dst = rods[to]
    if (src.length === 0) return false
    const disk = src[src.length - 1]
    const destTop = dst[dst.length - 1]
    return destTop === undefined || disk < destTop
  }

  const handleRodClick = (index: number): void => {
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
    if (rods[target].length === diskCount && !won) {
      setWon(true)
      // persist progress and add leaderboard entry (score = 100 - moves)
      import('../lib/progress').then(({ markGameCompletedLevel }) => {
        markGameCompletedLevel('tower-of-hanoi', level, Math.max(0, 100 - moves), 100)
      })
    }
  }, [rods, diskCount, level, won])

  const renderDisk = (d: number): JSX.Element => {
    const diskColors = [
      'bg-gradient-to-r from-red-400 to-red-500',
      'bg-gradient-to-r from-orange-400 to-orange-500',
      'bg-gradient-to-r from-yellow-400 to-yellow-500',
      'bg-gradient-to-r from-green-400 to-green-500',
      'bg-gradient-to-r from-blue-400 to-blue-500',
      'bg-gradient-to-r from-indigo-400 to-indigo-500',
      'bg-gradient-to-r from-purple-400 to-purple-500',
      'bg-gradient-to-r from-pink-400 to-pink-500',
      'bg-gradient-to-r from-cyan-400 to-cyan-500',
      'bg-gradient-to-r from-teal-400 to-teal-500',
    ]
    // Responsive width: percentage-based for mobile, fixed for larger screens
    const widthPercent = 40 + d * 8 // percentage for mobile
    return (
      <div
        key={d}
        className={`mx-auto my-0.5 sm:my-1 ${diskColors[(d - 1) % diskColors.length]} text-white text-center rounded-full font-bold shadow-lg border-2 border-white transform hover:scale-105 transition-all text-xs sm:text-sm`}
        style={{ width: `${widthPercent}%`, height: '20px', lineHeight: '20px' }}
      >
        {!hidden ? `${d}` : '❓'}
      </div>
    )
  }

  return (
    <>
      <CelebrationAnimation show={won} />
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4 sm:p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-4xl font-bold text-orange-700 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <span>🗼 Tower of Hanoi</span>
            <span className="text-lg sm:text-2xl bg-orange-100 px-3 sm:px-4 py-1 rounded-full">Level {level}</span>
          </h2>
          <div className="flex flex-wrap gap-3 sm:gap-6 justify-center mt-3 sm:mt-4 text-sm sm:text-lg font-bold">
            <div className="bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-md">
              <span className="text-blue-600">🎯 Disks:</span> <span className="text-xl sm:text-2xl text-blue-700">{diskCount}</span>
            </div>
            <div className="bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-md">
              <span className="text-green-600">🎮 Moves:</span> <span className="text-xl sm:text-2xl text-green-700">{moves}</span>
            </div>
          </div>
        </div>

        {level === 10 && (
          <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-yellow-100 border-2 border-yellow-400 rounded-xl text-center">
            <p className="text-sm sm:text-lg font-bold text-yellow-800">⚠️ Blind Mode: Disks hide after 2 seconds! 👀</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center my-4 sm:my-8">
          {rods.map((r, idx) => (
            <div key={idx} className="flex-1 max-w-full sm:max-w-xs">
              <div className="mb-2 sm:mb-4 text-center">
                <span className="text-base sm:text-2xl font-bold text-orange-700 bg-orange-100 px-3 sm:px-4 py-1 sm:py-2 rounded-full">
                  🏛️ Tower {idx + 1}
                </span>
              </div>
              <div
                onClick={() => handleRodClick(idx)}
                role="button"
                tabIndex={0}
                className={`min-h-[180px] sm:min-h-[240px] bg-gradient-to-b from-amber-100 to-amber-200 border-4 ${
                  selectedFrom === idx ? 'border-orange-500 ring-4 ring-orange-300' : 'border-amber-400'
                } rounded-2xl p-3 sm:p-6 flex flex-col justify-end items-center cursor-pointer hover:shadow-xl transition-all relative`}
              >
                {/* Tower pole */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 sm:w-3 h-full bg-gradient-to-b from-amber-600 to-amber-800 rounded-t-full"></div>
                {/* Base */}
                <div className="absolute bottom-0 left-0 right-0 h-3 sm:h-4 bg-gradient-to-r from-amber-700 to-amber-900 rounded-b-xl"></div>
                {/* Disks */}
                <div className="relative z-10 w-full">
                  {r.map((d) => renderDisk(d))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 sm:mt-6">
          {won ? (
            <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-xl shadow-lg border-4 border-emerald-300">
              <div className="text-2xl sm:text-3xl font-bold text-center mb-2">🎉 Puzzle Solved! 🎉</div>
              <div className="text-lg sm:text-xl text-center mb-4">Completed in <span className="font-bold text-xl sm:text-2xl">{moves}</span> moves!</div>
              <div className="flex justify-center">
                <NextLevelButton currentLevel={level} />
              </div>
            </div>
          ) : (
            <div className="bg-blue-100 p-3 sm:p-4 rounded-xl text-center">
              <p className="text-sm sm:text-lg text-blue-800 font-semibold">
                💡 Click a tower to select the top disk, then click another tower to move it!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default TowerOfHanoi
