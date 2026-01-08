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

function generateItems(level: number): { items: Item[]; targetCount: number } {
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

export default function VisualSearch({ level }: VisualSearchProps): JSX.Element {
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

  function handleItemClick(item: Item): void {
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
        
        if (!saved.current && newScore >= target) {
          markGameCompletedLevel('visual-search', level, Math.round(10000 / time))
          saved.current = true
          setCompleted(true)
        }
        
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
      <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">Visual Search (Level {level})</h2>
      <p className="text-slate-600 mb-4">Find all targets as quickly as possible!</p>

      <div className="mb-4 flex gap-4 items-center">
        <div className="text-sm text-slate-500">
          Score: {score} / {target}
        </div>
        {targetItem && (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 rounded">
            <span className="text-sm">Find:</span>
            <span className={`text-3xl ${targetItem.color}`}>{targetItem.shape}</span>
            <span className="text-sm">({found.size}/{gameData.targetCount})</span>
          </div>
        )}
        {endTime && (
          <div className="text-sm text-slate-500">
            Time: {(endTime / 1000).toFixed(2)}s
          </div>
        )}
      </div>

      <div className="grid grid-cols-10 gap-1 mb-4 p-4 border rounded bg-slate-50">
        {gameData.items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={`text-2xl p-1 rounded transition-all ${item.color} ${
              found.has(item.id) ? 'opacity-30 scale-75' : 'hover:scale-110'
            }`}
          >
            {item.shape}
          </button>
        ))}
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
