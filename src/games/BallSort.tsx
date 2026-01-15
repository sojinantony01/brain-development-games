import React, { useState, useEffect, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import ResetButton from '../components/ResetButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type BallSortProps = {
  level: number
}

type Tube = string[] // Array of color strings

type LevelConfig = {
  colors: string[]
  tubesCount: number
  ballsPerTube: number
}

const getLevelConfig = (level: number): LevelConfig => {
  switch (level) {
    case 1:
      return { colors: ['red', 'blue'], tubesCount: 3, ballsPerTube: 3 }
    case 2:
      return { colors: ['red', 'blue', 'green'], tubesCount: 4, ballsPerTube: 3 }
    case 3:
      return { colors: ['red', 'blue', 'green'], tubesCount: 5, ballsPerTube: 4 }
    case 4:
      return { colors: ['red', 'blue', 'green', 'yellow'], tubesCount: 5, ballsPerTube: 4 }
    case 5:
      return { colors: ['red', 'blue', 'green', 'yellow'], tubesCount: 6, ballsPerTube: 4 }
    case 6:
      return { colors: ['red', 'blue', 'green', 'yellow', 'purple'], tubesCount: 6, ballsPerTube: 4 }
    case 7:
      return { colors: ['red', 'blue', 'green', 'yellow', 'purple'], tubesCount: 7, ballsPerTube: 4 }
    case 8:
      return { colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'], tubesCount: 7, ballsPerTube: 4 }
    case 9:
      return { colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'], tubesCount: 8, ballsPerTube: 5 }
    case 10:
      return { colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'], tubesCount: 9, ballsPerTube: 5 }
    default:
      return { colors: ['red', 'blue'], tubesCount: 3, ballsPerTube: 3 }
  }
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const generateInitialTubes = (config: LevelConfig): Tube[] => {
  const { colors, tubesCount, ballsPerTube } = config
  
  // Create balls for each color
  const allBalls: string[] = []
  colors.forEach(color => {
    for (let i = 0; i < ballsPerTube; i++) {
      allBalls.push(color)
    }
  })
  
  // Shuffle balls
  const shuffled = shuffleArray(allBalls)
  
  // Distribute into tubes (leaving some empty)
  const tubes: Tube[] = []
  const filledTubes = colors.length
  
  for (let i = 0; i < filledTubes; i++) {
    tubes.push(shuffled.slice(i * ballsPerTube, (i + 1) * ballsPerTube))
  }
  
  // Add empty tubes
  for (let i = filledTubes; i < tubesCount; i++) {
    tubes.push([])
  }
  
  return tubes
}

const checkWin = (tubes: Tube[], config: LevelConfig): boolean => {
  const { ballsPerTube } = config
  
  for (const tube of tubes) {
    if (tube.length === 0) continue
    if (tube.length !== ballsPerTube) return false
    
    const firstColor = tube[0]
    if (!tube.every(ball => ball === firstColor)) return false
  }
  
  return true
}

const COLOR_MAP: Record<string, string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  orange: '#f97316',
  pink: '#ec4899',
}

export default function BallSort({ level }: BallSortProps): JSX.Element {
  const config = getLevelConfig(level)
  const [tubes, setTubes] = useState<Tube[]>(() => generateInitialTubes(config))
  const [selectedTube, setSelectedTube] = useState<number | null>(null)
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const saved = useRef(false)

  useEffect(() => {
    setTubes(generateInitialTubes(config))
    setSelectedTube(null)
    setMoves(0)
    setWon(false)
    saved.current = false
  }, [level])

  useEffect(() => {
    if (checkWin(tubes, config) && !won) {
      setWon(true)
      if (!saved.current) {
        const score = Math.max(0, 100 - moves)
        markGameCompletedLevel('ball-sort', level, score, 100)
        saved.current = true
      }
    }
  }, [tubes, config, won, level, moves])

  const handleTubeClick = (index: number): void => {
    if (won) return

    if (selectedTube === null) {
      // Select tube if it has balls
      if (tubes[index].length > 0) {
        setSelectedTube(index)
      }
    } else {
      // Try to move ball
      if (selectedTube === index) {
        // Deselect
        setSelectedTube(null)
      } else {
        const fromTube = tubes[selectedTube]
        const toTube = tubes[index]
        
        // Check if move is valid
        if (fromTube.length === 0) {
          setSelectedTube(null)
          return
        }
        
        if (toTube.length >= config.ballsPerTube) {
          setSelectedTube(null)
          return
        }
        
        // Allow moving to any tube with space (removed color matching restriction)
        
        // Move ball
        const newTubes = tubes.map((tube, i) => {
          if (i === selectedTube) {
            return tube.slice(0, -1)
          }
          if (i === index) {
            return [...tube, fromTube[fromTube.length - 1]]
          }
          return tube
        })
        
        setTubes(newTubes)
        setMoves(moves + 1)
        setSelectedTube(null)
      }
    }
  }

  const reset = (): void => {
    setTubes(generateInitialTubes(config))
    setSelectedTube(null)
    setMoves(0)
    setWon(false)
  }

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 rounded-2xl shadow-2xl">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🧪 Ball Sort Puzzle - Level {level}
        </h2>
        <p className="text-xl text-slate-700 font-semibold">Sort the colored balls so each tube contains only one color!</p>
        <div className="mt-4 text-2xl font-bold bg-white/70 p-4 rounded-xl backdrop-blur">
          <span className="text-purple-600">Moves: {moves}</span> |
          <span className="text-pink-600 ml-2">Colors: {config.colors.length}</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 max-w-5xl p-6 bg-white/50 rounded-xl backdrop-blur border-4 border-purple-200">
        {tubes.map((tube, index) => (
          <div
            key={index}
            onClick={() => handleTubeClick(index)}
            className={`
              relative flex flex-col items-center justify-end
              w-20 h-72 bg-gradient-to-b from-slate-100 to-slate-200 rounded-2xl border-4 cursor-pointer
              transition-all duration-300 transform shadow-xl
              ${selectedTube === index ? 'border-blue-500 scale-110 shadow-2xl ring-4 ring-blue-300' : 'border-slate-400 hover:border-purple-400 hover:scale-105'}
            `}
          >
            {tube.map((color, ballIndex) => (
              <div
                key={ballIndex}
                className="w-16 h-16 rounded-full mb-2 shadow-2xl transition-all duration-300 transform hover:scale-110"
                style={{
                  backgroundColor: COLOR_MAP[color],
                  boxShadow: `0 4px 20px ${COLOR_MAP[color]}80`
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <ResetButton onReset={reset} />
      </div>

      {won && (
        <>
          <CelebrationAnimation show={won} />
          <div className="text-center p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-4 border-green-400 shadow-lg">
            <div className="text-4xl font-bold text-green-600 mb-3">
              🎉 Level {level} Complete! 🎉
            </div>
            <div className="text-2xl font-bold text-slate-700 mb-2">
              ✨ Completed in {moves} moves
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              🏆 Score: {Math.max(0, 100 - moves)}/100
            </div>
            <div className="mt-6">
              <NextLevelButton currentLevel={level} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Made with Bob
