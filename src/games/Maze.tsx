import React, { useEffect, useMemo, useState } from 'react'
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

// very simple randomized maze generator (recursive division is overkill; we'll generate a simple path)
const generateMaze = (w: number, h: number): { grid: number[][]; start: [number, number]; end: [number, number] } => {
  const grid = makeEmptyGrid(w, h)
  // Carve a single path from left-top to right-bottom
  let x = 0
  let y = 0
  grid[y][x] = 0
  while (x < w - 1 || y < h - 1) {
    if (x < w - 1 && Math.random() > 0.5) x++
    else if (y < h - 1) y++
    else x++
    grid[y][x] = 0
  }
  return { grid, start: [0, 0], end: [w - 1, h - 1] }
}

const Maze = ({ level }: MazeProps): JSX.Element => {
  const size = Math.min(6 + Math.floor((level - 1) / 2), 12)
  const { grid: initialGrid, start, end } = useMemo(() => generateMaze(size, size), [size])
  const [grid, setGrid] = useState<number[][]>(initialGrid)
  const [pos, setPos] = useState<[number, number]>(start)
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [resetCount, setResetCount] = useState<number>(0)
  const [fog, setFog] = useState(level >= 7)
  const [dynamic, setDynamic] = useState(level >= 9)

  useEffect(() => {
    setGrid(initialGrid)
    setPos(start)
    setMoves(0)
    setWon(false)
    setFog(level >= 7)
    setDynamic(level >= 9)
    setResetCount(0)
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
      markGameCompletedLevel('maze', level, Math.max(0, 100 - moves), 100)
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

        <div className="mb-6 text-center">
          <div className="inline-block bg-white px-8 py-4 rounded-xl shadow-md">
            <span className="text-2xl font-bold text-green-700">🚶 Moves: </span>
            <span className="text-4xl font-black text-blue-600">{moves}</span>
          </div>
        </div>

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
            <div className="text-xl text-center mb-4">Completed in <span className="font-bold text-2xl">{moves}</span> moves!</div>
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
