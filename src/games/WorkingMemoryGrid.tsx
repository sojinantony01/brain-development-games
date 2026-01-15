import React, { useEffect, useState, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'
import ResetButton from '../components/ResetButton'

export type WorkingMemoryGridProps = {
  level: number
}

const gridSize = (level: number): number => {
  if (level <= 2) return 3
  if (level <= 5) return 5
  return 7
}

const itemCount = (level: number): number => {
  return Math.min(3 + Math.floor(level / 2), 8)
}

const WorkingMemoryGrid = ({ level }: WorkingMemoryGridProps): JSX.Element => {
  const size = gridSize(level)
  const count = itemCount(level)
  const [positions, setPositions] = useState<number[]>([])
  const [phase, setPhase] = useState<'show' | 'recall'>('show')
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const saved = useRef(false)
  const target = Math.max(3, Math.ceil(level * 1.5))
  const displayTime = Math.max(2000 - level * 100, 800)

  useEffect(() => {
    startRound()
    setScore(0)
    setCompleted(false)
    saved.current = false
  }, [level])

  const startRound = (): void => {
    const total = size * size
    const newPositions: number[] = []
    while (newPositions.length < count) {
      const pos = Math.floor(Math.random() * total)
      if (!newPositions.includes(pos)) newPositions.push(pos)
    }
    setPositions(newPositions)
    setPhase('show')
    setSelected(new Set())
    
    setTimeout(() => setPhase('recall'), displayTime)
  }

  const handleCellClick = (index: number): void => {
    if (phase !== 'recall') return
    
    const newSelected = new Set(selected)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelected(newSelected)
  }

  const handleSubmit = (): void => {
    const correct = positions.every(p => selected.has(p)) && selected.size === positions.length
    
    if (correct) {
      const newScore = score + 1
      setScore(newScore)
      
      if (!saved.current && newScore >= target) {
        markGameCompletedLevel('working-memory-grid', level, newScore, target)
        saved.current = true
        setCompleted(true)
      }
      
      setTimeout(startRound, 1000)
    } else {
      alert('Not quite right! Try again.')
      startRound()
    }
  }

  return (
    <>
      <CelebrationAnimation show={completed} />
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        🧠 Working Memory Grid (Level {level})
      </h2>
      <p className="text-xl text-slate-700 mb-6 font-semibold">Remember the positions and recreate them!</p>

      <div className="mb-6 text-2xl font-bold text-center bg-white/70 p-4 rounded-xl backdrop-blur">
        <span className="text-indigo-600">Score: {score} / {target}</span> •
        <span className="text-purple-600 ml-2">Items: {count}</span> •
        <span className="text-blue-600 ml-2">Grid: {size}x{size}</span>
      </div>

      <div
        className="grid gap-3 mb-6 mx-auto p-6 bg-white/50 rounded-xl backdrop-blur border-4 border-indigo-200"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          maxWidth: `${size * 70}px`
        }}
      >
        {Array.from({ length: size * size }, (_, i) => {
          const isShown = phase === 'show' && positions.includes(i)
          const isSelected = selected.has(i)
          
          return (
            <button
              key={i}
              onClick={() => handleCellClick(i)}
              disabled={phase === 'show'}
              className={`aspect-square rounded-xl transition-all transform shadow-md ${
                isShown ? 'bg-gradient-to-br from-indigo-500 to-purple-600 scale-110 animate-pulse' :
                isSelected ? 'bg-gradient-to-br from-yellow-400 to-orange-400 scale-105' :
                'bg-gradient-to-br from-slate-200 to-slate-300 hover:bg-gradient-to-br hover:from-slate-300 hover:to-slate-400 hover:scale-105'
              } ${phase === 'show' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            />
          )
        })}
      </div>

      <div className="flex gap-4 justify-center">
        {phase === 'show' && (
          <div className="text-2xl font-bold text-indigo-600 animate-pulse">👀 Memorize the positions...</div>
        )}
        {phase === 'recall' && (
          <>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Submit ({selected.size}/{count})
            </button>
            <button
              onClick={startRound}
              className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500"
            >
              Reset
            </button>
          </>
        )}
      </div>

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

export default WorkingMemoryGrid
