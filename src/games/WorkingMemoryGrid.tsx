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
  const [phase, setPhase] = useState<'show' | 'recall' | 'feedback'>('show')
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [score, setScore] = useState(0)
  const [roundNumber, setRoundNumber] = useState(1)
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null)
  const [completed, setCompleted] = useState(false)
  const saved = useRef(false)
  const target = Math.max(3, Math.ceil(level * 1.5))
  const displayTime = Math.max(2000 - level * 100, 800)

  useEffect(() => {
    startRound()
    setScore(0)
    setRoundNumber(1)
    setCompleted(false)
    setLastResult(null)
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
    setLastResult(null)
    
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
    if (phase !== 'recall') return
    
    const correct = positions.every(p => selected.has(p)) && selected.size === positions.length
    
    setPhase('feedback')
    setLastResult(correct ? 'correct' : 'wrong')
    
    if (correct) {
      const newScore = score + 1
      setScore(newScore)
      
      if (newScore >= target) {
        // Completed all rounds!
        if (!saved.current) {
          markGameCompletedLevel('working-memory-grid', level, newScore, target)
          saved.current = true
        }
        setCompleted(true)
      } else {
        // Start next round after delay
        setTimeout(() => {
          setRoundNumber(r => r + 1)
          startRound()
        }, 1500)
      }
    } else {
      // Wrong answer - retry same pattern after delay
      setTimeout(() => {
        startRound()
      }, 1500)
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

      <div className="mb-6 space-y-3">
        <div className="text-2xl font-bold text-center bg-white/70 p-4 rounded-xl backdrop-blur">
          <span className="text-purple-600">Round: {roundNumber} / {target}</span> •
          <span className="text-indigo-600 ml-2">Score: {score} / {target}</span>
        </div>
        <div className="text-xl font-bold text-center bg-white/70 p-3 rounded-xl backdrop-blur">
          <span className="text-blue-600">Items: {count}</span> •
          <span className="text-teal-600 ml-2">Grid: {size}x{size}</span>
        </div>
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

      <div className="flex gap-4 justify-center mb-4">
        {phase === 'show' && (
          <div className="text-2xl font-bold text-indigo-600 animate-pulse">👀 Memorize the positions...</div>
        )}
        {phase === 'recall' && (
          <>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xl font-bold rounded-xl hover:from-indigo-600 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all"
            >
              ✓ Submit ({selected.size}/{count})
            </button>
            <button
              onClick={startRound}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xl font-bold rounded-xl hover:from-yellow-500 hover:to-orange-500 shadow-lg transform hover:scale-105 transition-all"
            >
              🔄 Replay
            </button>
          </>
        )}
        {phase === 'feedback' && lastResult && (
          <div className={`text-2xl font-bold px-6 py-3 rounded-xl ${
            lastResult === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {lastResult === 'correct' ? '✅ Correct! Next round...' : '❌ Wrong! Try again...'}
          </div>
        )}
      </div>

      {completed && (
        <div className="mt-6 p-6 bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 rounded-xl border-4 border-green-400 shadow-lg">
          <div className="text-3xl font-bold mb-2 text-center">🎉 Excellent Memory! Level {level} Complete! 🎉</div>
          <div className="text-xl text-center mb-4">
            Completed {target} rounds successfully!
          </div>
          <div className="flex justify-center">
            <NextLevelButton currentLevel={level} />
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default WorkingMemoryGrid
