import React, { useEffect, useState, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type DualTaskProps = {
  level: number
}

type Shape = 'circle' | 'square' | 'triangle'

function generateMathProblem(level: number): { question: string; answer: number } {
  const a = Math.floor(Math.random() * 10) + 1
  const b = Math.floor(Math.random() * 10) + 1
  
  if (level <= 3) {
    return { question: `${a} + ${b}`, answer: a + b }
  } else if (level <= 6) {
    return Math.random() > 0.5
      ? { question: `${a} + ${b}`, answer: a + b }
      : { question: `${a} × ${b}`, answer: a * b }
  } else {
    return { question: `${a} × ${b} - ${Math.floor(b / 2)}`, answer: a * b - Math.floor(b / 2) }
  }
}

export default function DualTask({ level }: DualTaskProps): JSX.Element {
  const shapes: Shape[] = ['circle', 'square', 'triangle']
  const [targetShape, setTargetShape] = useState<Shape>('circle')
  const [currentShape, setCurrentShape] = useState<Shape>('circle')
  const [shapeCount, setShapeCount] = useState(0)
  const [mathProblem, setMathProblem] = useState(generateMathProblem(level))
  const [mathInput, setMathInput] = useState('')
  const [score, setScore] = useState(0)
  const [running, setRunning] = useState(false)
  const [completed, setCompleted] = useState(false)
  const saved = useRef(false)
  const intervalRef = useRef<number | null>(null)
  const target = Math.max(5, level + 2)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    setScore(0)
    setCompleted(false)
    saved.current = false
    setRunning(false)
    setShapeCount(0)
  }, [level])

  function startGame(): void {
    setRunning(true)
    setShapeCount(0)
    setTargetShape(shapes[Math.floor(Math.random() * shapes.length)])
    setMathProblem(generateMathProblem(level))
    setMathInput('')
    
    intervalRef.current = window.setInterval(() => {
      setCurrentShape(shapes[Math.floor(Math.random() * shapes.length)])
    }, Math.max(2000 - level * 100, 800))
  }

  function stopGame(): void {
    setRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  function handleShapeClick(): void {
    if (!running) return
    if (currentShape === targetShape) {
      setShapeCount(c => c + 1)
    }
  }

  function handleMathSubmit(): void {
    if (!running) return
    const answer = Number(mathInput)
    if (answer === mathProblem.answer) {
      const newScore = score + 1
      setScore(newScore)
      
      if (!saved.current && newScore >= target) {
        markGameCompletedLevel('dual-task', level, newScore, target)
        saved.current = true
        setCompleted(true)
        stopGame()
      }
      
      setMathProblem(generateMathProblem(level))
      setMathInput('')
    } else {
      setMathInput('')
    }
  }

  const shapeStyles = {
    circle: 'rounded-full bg-blue-500',
    square: 'rounded-none bg-red-500',
    triangle: 'rounded-none bg-green-500 clip-triangle'
  }

  return (
    <>
      <CelebrationAnimation show={completed} />
      <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">Dual Task Challenge (Level {level})</h2>
      <p className="text-slate-600 mb-4">Count target shapes AND solve math problems!</p>

      <div className="mb-4 text-sm text-slate-500">
        Score: {score} / {target} • Shapes Counted: {shapeCount}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-4">
        {/* Shape Task */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Task 1: Count Shapes</h3>
          <div className="text-sm text-slate-500 mb-2">
            Click when you see: <span className="font-bold capitalize">{targetShape}</span>
          </div>
          <button
            onClick={handleShapeClick}
            disabled={!running}
            className={`w-32 h-32 mx-auto block ${shapeStyles[currentShape]} ${!running ? 'opacity-50' : ''}`}
          />
        </div>

        {/* Math Task */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Task 2: Solve Math</h3>
          <div className="text-2xl font-mono mb-4">{mathProblem.question} = ?</div>
          <div className="flex gap-2">
            <input
              type="number"
              value={mathInput}
              onChange={(e) => setMathInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleMathSubmit()}
              disabled={!running}
              className="border p-2 rounded flex-1"
              placeholder="Answer"
            />
            <button
              onClick={handleMathSubmit}
              disabled={!running}
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              ✓
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={startGame}
          disabled={running}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Start
        </button>
        <button
          onClick={stopGame}
          disabled={!running}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          Stop
        </button>
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
