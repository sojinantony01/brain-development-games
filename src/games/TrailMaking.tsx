import React, { useEffect, useState, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'
import ResetButton from '../components/ResetButton'

export type TrailMakingProps = {
  level: number
}

type Node = {
  id: number
  value: string
  x: number
  y: number
  connected: boolean
}

function generateNodes(level: number): Node[] {
  const count = Math.min(10 + level * 2, 26)
  const nodes: Node[] = []
  
  if (level <= 3) {
    // Numbers only
    for (let i = 0; i < count; i++) {
      nodes.push({
        id: i,
        value: String(i + 1),
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        connected: false
      })
    }
  } else {
    // Alternating numbers and letters
    for (let i = 0; i < count; i++) {
      nodes.push({
        id: i,
        value: i % 2 === 0 ? String(Math.floor(i / 2) + 1) : String.fromCharCode(65 + Math.floor(i / 2)),
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        connected: false
      })
    }
  }
  
  return nodes
}

export default function TrailMaking({ level }: TrailMakingProps): JSX.Element {
  const [nodes, setNodes] = useState<Node[]>(() => generateNodes(level))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [completed, setCompleted] = useState(false)
  const saved = useRef(false)

  useEffect(() => {
    setNodes(generateNodes(level))
    setCurrentIndex(0)
    setStartTime(null)
    setEndTime(null)
    setCompleted(false)
    saved.current = false
  }, [level])

  function handleNodeClick(node: Node): void {
    if (startTime === null) setStartTime(Date.now())
    if (node.id !== currentIndex) return
    
    setNodes(prev => prev.map(n => 
      n.id === node.id ? { ...n, connected: true } : n
    ))
    
    if (currentIndex === nodes.length - 1) {
      const time = Date.now() - (startTime ?? Date.now())
      setEndTime(time)
      const score = Math.max(0, Math.round(100000 / time))
      
      if (!saved.current) {
        markGameCompletedLevel('trail-making', level, score)
        saved.current = true
        setCompleted(true)
      }
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <>
      <CelebrationAnimation show={won} />
      <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">Trail Making (Level {level})</h2>
      <p className="text-slate-600 mb-4">Connect the nodes in order as fast as you can!</p>

      <div className="mb-4 text-sm text-slate-500">
        Progress: {currentIndex + 1}/{nodes.length}
        {endTime && ` • Time: ${(endTime / 1000).toFixed(2)}s`}
      </div>

      <div className="relative w-full h-96 border rounded bg-slate-50 mb-4">
        {nodes.map((node, idx) => (
          <button
            key={node.id}
            onClick={() => handleNodeClick(node)}
            disabled={node.connected && node.id !== currentIndex}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            className={`absolute w-12 h-12 rounded-full flex items-center justify-center font-bold transform -translate-x-1/2 -translate-y-1/2 transition-all ${
              node.connected
                ? 'bg-emerald-500 text-white scale-90'
                : node.id === currentIndex
                ? 'bg-yellow-400 text-black ring-4 ring-yellow-200 animate-pulse'
                : 'bg-indigo-500 text-white hover:scale-110'
            }`}
          >
            {node.value}
          </button>
        ))}
      </div>

      {completed && (
        <div className="mt-4 p-4 bg-emerald-100 text-emerald-800 rounded">
          ✅ Completed in {((endTime ?? 0) / 1000).toFixed(2)}s!
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
