import React, { useEffect, useState, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'
import ResetButton from '../components/ResetButton'

export type WorkingMemoryGridProps = {
  level: number
}

function gridSize(level: number): number {
  if (level <= 2) return 3
  if (level <= 5) return 5
  return 7
}

function itemCount(level: number): number {
  return Math.min(3 + Math.floor(level / 2), 8)
}

export default function WorkingMemoryGrid({ level }: WorkingMemoryGridProps): JSX.Element {
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

  function startRound(): void {
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

  function handleCellClick(index: number): void {
    if (phase !== 'recall') return
    
    const newSelected = new Set(selected)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelected(newSelected)
  }

  function handleSubmit(): void {
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
      <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">Working Memory Grid (Level {level})</h2>
      <p className="text-slate-600 mb-4">Remember the positions and recreate them!</p>

      <div className="mb-4 text-sm text-slate-500">
        Score: {score} / {target} • Items: {count} • Grid: {size}x{size}
      </div>

      <div
        className="grid gap-2 mb-4 mx-auto"
        style={{ 
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          maxWidth: `${size * 60}px`
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
              className={`aspect-square rounded transition-all ${
                isShown ? 'bg-indigo-600' :
                isSelected ? 'bg-yellow-400' :
                'bg-slate-200 hover:bg-slate-300'
              } ${phase === 'show' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            />
          )
        })}
      </div>

      <div className="flex gap-2">
        {phase === 'show' && (
          <div className="text-sm text-slate-500">Memorize the positions...</div>
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

// Made with Bob
