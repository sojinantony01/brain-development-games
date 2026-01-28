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

const generateNodes = (level: number): Node[] => {
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

const TrailMaking = ({ level }: TrailMakingProps): JSX.Element => {
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

  const handleNodeClick = (node: Node): void => {
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
        markGameCompletedLevel('trail-making', level, score, 100)
        saved.current = true
        setCompleted(true)
      }
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <>
      <CelebrationAnimation show={completed} />
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-purple-700 flex items-center justify-center gap-3">
            🎯 Connect the Dots
            <span className="text-2xl bg-purple-100 px-4 py-1 rounded-full">Level {level}</span>
          </h2>
          <p className="text-lg text-slate-600 mt-2">Connect the nodes in order as fast as you can! 🚀</p>
        </div>

        <div className="mb-6 flex gap-4 justify-center text-lg font-bold">
          <div className="bg-white px-8 py-4 rounded-xl shadow-md">
            <span className="text-purple-600">📍 Progress:</span> <span className="text-3xl text-purple-700">{currentIndex + 1}/{nodes.length}</span>
          </div>
          {endTime && (
            <div className="bg-white px-8 py-4 rounded-xl shadow-md">
              <span className="text-green-600">⏱️ Time:</span> <span className="text-3xl text-green-700">{(endTime / 1000).toFixed(2)}s</span>
            </div>
          )}
        </div>

        <div className="relative w-full h-[500px] border-4 border-purple-300 rounded-2xl bg-gradient-to-br from-white to-purple-50 mb-6 shadow-inner">
          {nodes.map((node, idx) => {
            // Draw lines between connected nodes
            if (idx > 0 && nodes[idx - 1].connected) {
              const prevNode = nodes[idx - 1]
              return (
                <React.Fragment key={`line-${node.id}`}>
                  <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                    <line
                      x1={`${prevNode.x}%`}
                      y1={`${prevNode.y}%`}
                      x2={`${node.x}%`}
                      y2={`${node.y}%`}
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray={node.connected ? "0" : "5,5"}
                    />
                  </svg>
                  <button
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    disabled={node.connected && node.id !== currentIndex}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black transform -translate-x-1/2 -translate-y-1/2 transition-all shadow-lg ${
                      node.connected
                        ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white scale-90'
                        : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white hover:scale-125 hover:ring-4 hover:ring-indigo-300'
                    }`}
                  >
                    {node.value}
                  </button>
                </React.Fragment>
              )
            }
            return (
              <button
                key={node.id}
                onClick={() => handleNodeClick(node)}
                disabled={node.connected && node.id !== currentIndex}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black transform -translate-x-1/2 -translate-y-1/2 transition-all shadow-lg ${
                  node.connected
                    ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white scale-90'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white hover:scale-125 hover:ring-4 hover:ring-indigo-300'
                }`}
              >
                {node.value}
              </button>
            )
          })}
        </div>

        {completed && (
          <div className="mt-6 p-6 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-xl shadow-lg border-4 border-emerald-300">
            <div className="text-3xl font-bold text-center mb-2">🎉 Perfect Connection! Completed in {((endTime ?? 0) / 1000).toFixed(2)}s! 🎉</div>
            <div className="flex justify-center mt-4">
              <NextLevelButton currentLevel={level} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default TrailMaking
