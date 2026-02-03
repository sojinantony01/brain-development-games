import React, { useEffect, useMemo, useState, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'
import ResetButton from '../components/ResetButton'

export type MazeProps = {
  level: number
}

type Cell = { x: number; y: number; wall: boolean }

const makeEmptyGrid = (w: number, h: number): number[][] => {
  return Array.from({ length: h }, () => Array.from({ length: w }, () => 1))
}

// BFS to find shortest path length
const findShortestPath = (grid: number[][], start: [number, number], end: [number, number]): number => {
  const h = grid.length
  const w = grid[0].length
  const visited = Array.from({ length: h }, () => Array(w).fill(false))
  const queue: Array<[number, number, number]> = [[start[0], start[1], 0]]
  visited[start[1]][start[0]] = true
  
  const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]]
  
  while (queue.length > 0) {
    const [x, y, dist] = queue.shift()!
    
    if (x === end[0] && y === end[1]) {
      return dist
    }
    
    for (const [dx, dy] of dirs) {
      const nx = x + dx
      const ny = y + dy
      
      if (nx >= 0 && nx < w && ny >= 0 && ny < h && !visited[ny][nx] && grid[ny][nx] === 0) {
        visited[ny][nx] = true
        queue.push([nx, ny, dist + 1])
      }
    }
  }
  
  return -1 // No path found
}

// Recursive backtracking maze generator - creates a proper maze with dead ends
const generateMaze = (w: number, h: number): { grid: number[][]; start: [number, number]; end: [number, number]; optimalMoves: number } => {
  const grid = makeEmptyGrid(w, h)
  const visited: boolean[][] = Array.from({ length: h }, () => Array(w).fill(false))
  
  // Directions: right, down, left, up
  const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]]
  
  const carve = (x: number, y: number): void => {
    visited[y][x] = true
    grid[y][x] = 0
    
    // Shuffle directions for randomness
    const shuffled = dirs.sort(() => Math.random() - 0.5)
    
    for (const [dx, dy] of shuffled) {
      const nx = x + dx
      const ny = y + dy
      
      if (nx >= 0 && nx < w && ny >= 0 && ny < h && !visited[ny][nx]) {
        carve(nx, ny)
      }
    }
  }
  
  // Start carving from top-left
  carve(0, 0)
  
  // Ensure there's always a path by carving additional connections
  // This adds some loops to make the maze less linear
  for (let i = 0; i < Math.floor(w * h * 0.1); i++) {
    const x = Math.floor(Math.random() * w)
    const y = Math.floor(Math.random() * h)
    grid[y][x] = 0
  }
  
  const start: [number, number] = [0, 0]
  const end: [number, number] = [w - 1, h - 1]
  const optimalMoves = findShortestPath(grid, start, end)
  
  return { grid, start, end, optimalMoves }
}

const Maze = ({ level }: MazeProps): JSX.Element => {
  const size = Math.min(6 + Math.floor((level - 1) / 2), 12)
  const [resetCount, setResetCount] = useState<number>(0)
  
  // Generate new maze on each reset by including resetCount in dependency
  const { grid: initialGrid, start, end, optimalMoves } = useMemo(() => generateMaze(size, size), [size, resetCount])
  
  const [grid, setGrid] = useState<number[][]>(initialGrid)
  const [pos, setPos] = useState<[number, number]>(start)
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [fog, setFog] = useState(level >= 7)
  const [dynamic, setDynamic] = useState(level >= 9)
  const saved = useRef(false)
  
  // Calculate star rating based on efficiency
  const getStars = (moves: number, optimal: number): number => {
    if (moves <= optimal) return 3
    if (moves <= optimal * 1.5) return 2
    return 1
  }
  
  const stars = won ? getStars(moves, optimalMoves) : 0

  useEffect(() => {
    setGrid(initialGrid)
    setPos(start)
    setMoves(0)
    setWon(false)
    setFog(level >= 7)
    setDynamic(level >= 9)
    setResetCount(0)
    saved.current = false
  }, [initialGrid, start, level])

  useEffect(() => {
    if (!dynamic) return
    const id = setInterval(() => {
      // toggle a random wall cell to open/close
      const w = grid.length
      const h = grid[0].length
      const x = Math.floor(Math.random() * w)
      const y = Math.floor(Math.random() * h)
      setGrid((g) => {
        const copy = g.map((row) => row.slice())
        copy[y][x] = copy[y][x] === 1 ? 0 : 1
        return copy
      })
    }, 2000)
    return () => clearInterval(id)
  }, [dynamic, grid])

  const canMoveTo = (x: number, y: number): boolean => {
    if (x < 0 || y < 0 || y >= grid.length || x >= grid[0].length) return false
    return grid[y][x] === 0
  }

  const move = (dx: number, dy: number): void => {
    const nx = pos[0] + dx
    const ny = pos[1] + dy
    if (!canMoveTo(nx, ny)) return
    setPos([nx, ny])
    setMoves((m) => m + 1)
    if (nx === end[0] && ny === end[1]) {
      setWon(true)
      // Score based on efficiency: 100 points for optimal, decreasing with extra moves
      const efficiency = Math.max(0, Math.min(100, Math.round((optimalMoves / moves) * 100)))
      if (!saved.current) {
        markGameCompletedLevel('maze', level, efficiency, 100)
        saved.current = true
      }
    }
  }

  return (
    <>
      <CelebrationAnimation show={won} />
      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-green-700 flex items-center justify-center gap-3">
            🌳 Maze Adventure
            <span className="text-2xl bg-green-100 px-4 py-1 rounded-full">Level {level}</span>
          </h2>
          <p className="text-lg text-slate-600 mt-2">Find your way to the treasure! 🏆</p>
        </div>

        <div className="mb-6 text-center flex gap-4 justify-center items-center">
          <div className="inline-block bg-white px-8 py-4 rounded-xl shadow-md">
            <span className="text-2xl font-bold text-green-700">🚶 Moves: </span>
            <span className="text-4xl font-black text-blue-600">{moves}</span>
          </div>
          <div className="inline-block bg-white px-8 py-4 rounded-xl shadow-md">
            <span className="text-2xl font-bold text-amber-600">🎯 Optimal: </span>
            <span className="text-4xl font-black text-amber-600">{optimalMoves}</span>
          </div>
        </div>
        
        {moves > 0 && !won && (
          <div className="mb-4 text-center">
            <div className={`inline-block px-6 py-3 rounded-xl font-bold text-lg ${
              moves <= optimalMoves ? 'bg-green-100 text-green-700' :
              moves <= optimalMoves * 1.5 ? 'bg-yellow-100 text-yellow-700' :
              'bg-orange-100 text-orange-700'
            }`}>
              {moves <= optimalMoves ? '⭐⭐⭐ Perfect Path!' :
               moves <= optimalMoves * 1.5 ? '⭐⭐ Good Progress!' :
               '⭐ Keep Exploring!'}
            </div>
          </div>
        )}

        <div className="flex justify-center mb-6">
          <div className="inline-block bg-white p-6 rounded-2xl shadow-lg border-4 border-green-300">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${grid[0].length}, 36px)` }}>
              {grid.map((row, y) =>
                row.map((cell, x) => {
                  const isPlayer = pos[0] === x && pos[1] === y
                  const isEnd = end[0] === x && end[1] === y
                  const show = !fog || (Math.abs(pos[0] - x) + Math.abs(pos[1] - y) <= 2)
                  return (
                    <div
                      key={`${x}-${y}`}
                      className={`w-9 h-9 flex items-center justify-center text-2xl font-bold border-2 transition-all ${
                        cell === 1
                          ? 'bg-gradient-to-br from-slate-700 to-slate-900 border-slate-800'
                          : 'bg-gradient-to-br from-green-100 to-green-200 border-green-300 hover:bg-green-300'
                      } ${isPlayer ? 'ring-4 ring-yellow-400 animate-pulse' : ''} rounded-lg shadow-md`}
                      style={{ visibility: show ? 'visible' : 'hidden' }}
                      onClick={() => {
                        // allow clicking to move if adjacent
                        if (Math.abs(pos[0] - x) + Math.abs(pos[1] - y) === 1) move(x - pos[0], y - pos[1])
                      }}
                    >
                      {isPlayer ? '🧒' : isEnd ? '🏆' : ''}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center mb-6">
          <div className="grid grid-cols-3 gap-2">
            <div></div>
            <button
              onClick={() => move(0, -1)}
              className="px-6 py-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              ⬆️
            </button>
            <div></div>
            <button
              onClick={() => move(-1, 0)}
              className="px-6 py-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              ⬅️
            </button>
            <div className="flex items-center justify-center text-3xl">🎮</div>
            <button
              onClick={() => move(1, 0)}
              className="px-6 py-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              ➡️
            </button>
            <div></div>
            <button
              onClick={() => move(0, 1)}
              className="px-6 py-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              ⬇️
            </button>
            <div></div>
          </div>
        </div>

        {fog && (
          <div className="mb-4 p-4 bg-purple-100 border-2 border-purple-400 rounded-xl text-center">
            <p className="text-lg font-bold text-purple-800">🌫️ Fog Mode: Limited visibility! 👀</p>
          </div>
        )}

        {won && (
          <div className="mt-6 p-6 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-xl shadow-lg border-4 border-emerald-300">
            <div className="text-3xl font-bold text-center mb-2">🎉 You Found the Treasure! 🎉</div>
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">
                {stars === 3 ? '⭐⭐⭐' : stars === 2 ? '⭐⭐' : '⭐'}
              </div>
              <div className="text-xl">
                Completed in <span className="font-bold text-2xl text-blue-600">{moves}</span> moves
              </div>
              <div className="text-lg mt-1">
                Optimal: <span className="font-bold text-amber-600">{optimalMoves}</span> moves
                {moves === optimalMoves && <span className="ml-2 text-green-600 font-bold">🏆 PERFECT!</span>}
              </div>
              <div className="text-md mt-2 font-semibold">
                Efficiency: <span className="text-2xl">{Math.round((optimalMoves / moves) * 100)}%</span>
              </div>
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

export default Maze
