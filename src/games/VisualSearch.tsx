import React, { useEffect, useState, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type VisualSearchProps = {
  level: number
}

const SHAPES = ['●', '■', '▲', '◆', '★', '♥', '♣', '♠']
const COLORS = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500', 'text-purple-500', 'text-pink-500']

type Item = {
  id: number
  shape: string
  color: string
  isTarget: boolean
}

const generateItems = (level: number): { items: Item[]; targetCount: number } => {
  const totalItems = Math.min(20 + level * 10, 100)
  const targetCount = Math.min(1 + Math.floor(level / 3), 5)
  const targetShape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
  const targetColor = COLORS[Math.floor(Math.random() * COLORS.length)]
  
  const items: Item[] = []
  let targetsPlaced = 0
  
  for (let i = 0; i < totalItems; i++) {
    const isTarget = targetsPlaced < targetCount && (Math.random() < 0.1 || i >= totalItems - (targetCount - targetsPlaced))
    
    if (isTarget) {
      items.push({
        id: i,
        shape: targetShape,
        color: targetColor,
        isTarget: true
      })
      targetsPlaced++
    } else {
      let shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
      let color = COLORS[Math.floor(Math.random() * COLORS.length)]
      
      // Make sure distractors are different
      while (shape === targetShape && color === targetColor) {
        shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
        color = COLORS[Math.floor(Math.random() * COLORS.length)]
      }
      
      items.push({ id: i, shape, color, isTarget: false })
    }
  }
  
  return { items: items.sort(() => Math.random() - 0.5), targetCount }
}

const VisualSearch = ({ level }: VisualSearchProps): JSX.Element => {
  const [gameData, setGameData] = useState(() => generateItems(level))
  const [found, setFound] = useState<Set<number>>(new Set())
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const saved = useRef(false)
  const target = Math.max(3, Math.ceil(level * 1.5))

  useEffect(() => {
    setGameData(generateItems(level))
    setFound(new Set())
    setStartTime(null)
    setEndTime(null)
    setScore(0)
    setCompleted(false)
    saved.current = false
  }, [level])

  const handleItemClick = (item: Item): void => {
    if (completed) return // Don't allow clicks after completion
    if (startTime === null) setStartTime(Date.now())
    if (found.has(item.id)) return
    
    if (item.isTarget) {
      const newFound = new Set(found).add(item.id)
      setFound(newFound)
      
      if (newFound.size === gameData.targetCount) {
        const time = Date.now() - (startTime ?? Date.now())
        setEndTime(time)
        const newScore = score + 1
        setScore(newScore)
        
        if (newScore >= target) {
          if (!saved.current) {
            const rawScore = Math.round(10000 / time)
            const percentageScore = Math.min(100, Math.round((rawScore / target) * 100))
            markGameCompletedLevel('visual-search', level, percentageScore, 100)
            saved.current = true
          }
          setCompleted(true)
          return // Stop here, don't generate new items
        }
        
        // Only generate new items if not completed
        setTimeout(() => {
          setGameData(generateItems(level))
          setFound(new Set())
          setStartTime(null)
          setEndTime(null)
        }, 1500)
      }
    }
  }

  const targetItem = gameData.items.find(i => i.isTarget)

  return (
    <>
      <CelebrationAnimation show={completed} />
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        🔍 Visual Search (Level {level})
      </h2>
      <p className="text-xl text-slate-700 mb-6 font-semibold">Find all targets as quickly as possible!</p>

      <div className="mb-6 flex gap-6 items-center justify-center flex-wrap bg-white/70 p-4 rounded-xl backdrop-blur">
        <div className="text-2xl font-bold text-indigo-600">
          Score: {score} / {target}
        </div>
        {targetItem && (
          <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-xl border-4 border-yellow-400 shadow-lg">
            <span className="text-xl font-bold">🎯 Find:</span>
            <span className={`text-6xl ${targetItem.color} animate-bounce`}>{targetItem.shape}</span>
            <span className="text-xl font-bold">({found.size}/{gameData.targetCount})</span>
          </div>
        )}
        {endTime && (
          <div className="text-xl font-bold text-green-600">
            ⚡ Time: {(endTime / 1000).toFixed(2)}s
          </div>
        )}
      </div>

      <div className="grid grid-cols-10 gap-2 mb-6 p-6 bg-white/50 rounded-xl backdrop-blur border-4 border-purple-200">
        {gameData.items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            disabled={completed}
            className={`text-4xl p-2 rounded-lg transition-all transform ${item.color} ${
              found.has(item.id) ? 'opacity-20 scale-50 bg-green-100' : 'hover:scale-150 hover:rotate-12 hover:shadow-lg'
            } ${completed ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {item.shape}
          </button>
        ))}
      </div>

      {completed && (
        <div className="mt-6 p-6 bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 rounded-xl border-4 border-green-400 shadow-lg">
          <div className="text-3xl font-bold mb-2">✅ Level {level} completed!</div>
          <div className="mt-4">
            <NextLevelButton currentLevel={level} />
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default VisualSearch
