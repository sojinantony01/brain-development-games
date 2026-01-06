import React, { useEffect, useMemo, useState } from 'react'
import { markGameCompletedLevel } from '../lib/progress'

export type MazeProps = {
  level: number
}

type Cell = { x: number; y: number; wall: boolean }

function makeEmptyGrid(w: number, h: number): number[][] {
  return Array.from({ length: h }, () => Array.from({ length: w }, () => 1))
}

// very simple randomized maze generator (recursive division is overkill; we'll generate a simple path)
function generateMaze(w: number, h: number): { grid: number[][]; start: [number, number]; end: [number, number] } {
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

export default function Maze({ level }: MazeProps): JSX.Element {
  const size = Math.min(6 + Math.floor((level - 1) / 2), 12)
  const { grid: initialGrid, start, end } = useMemo(() => generateMaze(size, size), [size])
  const [grid, setGrid] = useState<number[][]>(initialGrid)
  const [pos, setPos] = useState<[number, number]>(start)
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [fog, setFog] = useState(level >= 7)
  const [dynamic, setDynamic] = useState(level >= 9)

  useEffect(() => {
    setGrid(initialGrid)
    setPos(start)
    setMoves(0)
    setWon(false)
    setFog(level >= 7)
    setDynamic(level >= 9)
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

  function canMoveTo(x: number, y: number): boolean {
    if (x < 0 || y < 0 || y >= grid.length || x >= grid[0].length) return false
    return grid[y][x] === 0
  }

  function move(dx: number, dy: number): void {
    const nx = pos[0] + dx
    const ny = pos[1] + dy
    if (!canMoveTo(nx, ny)) return
    setPos([nx, ny])
    setMoves((m) => m + 1)
    if (nx === end[0] && ny === end[1]) {
      setWon(true)
      markGameCompletedLevel('maze', level, Math.max(0, 100 - moves))
    }
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">Pathway / Maze (Level {level})</h2>
      <div className="my-4 grid gap-1" style={{ gridTemplateColumns: `repeat(${grid[0].length}, 28px)` }}>
        {grid.map((row, y) =>
          row.map((cell, x) => {
            const isPlayer = pos[0] === x && pos[1] === y
            const isEnd = end[0] === x && end[1] === y
            const show = !fog || (Math.abs(pos[0] - x) + Math.abs(pos[1] - y) <= 2)
            return (
              <div
                key={`${x}-${y}`}
                className={`w-7 h-7 flex items-center justify-center border ${cell === 1 ? 'bg-slate-700' : 'bg-white'} ${isPlayer ? 'ring-2 ring-indigo-400' : ''}`}
                style={{ visibility: show ? 'visible' : 'hidden' }}
                onClick={() => {
                  // allow clicking to move if adjacent
                  if (Math.abs(pos[0] - x) + Math.abs(pos[1] - y) === 1) move(x - pos[0], y - pos[1])
                }}
              >
                {isPlayer ? 'P' : isEnd ? 'X' : ''}
              </div>
            )
          })
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={() => move(0, -1)} className="px-3 py-1 bg-indigo-600 text-white rounded">Up</button>
        <button onClick={() => move(-1, 0)} className="px-3 py-1 bg-indigo-600 text-white rounded">Left</button>
        <button onClick={() => move(1, 0)} className="px-3 py-1 bg-indigo-600 text-white rounded">Right</button>
        <button onClick={() => move(0, 1)} className="px-3 py-1 bg-indigo-600 text-white rounded">Down</button>
      </div>

      <div className="mt-4 text-sm text-slate-500">Moves: {moves} {won ? '• Completed!' : ''}</div>
      {won && (
        <div className="mt-2">
          <ShareButtons gameId="maze" gameName="Pathway / Maze" level={level} score={Math.max(0, 100 - moves)} />
        </div>
      )}
    </div>
  )
}
