import React, { useEffect, useState, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type DualTaskProps = {
  level: number
}

type Shape = 'circle' | 'square' | 'triangle'

const generateMathProblem = (level: number): { question: string; answer: number } => {
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

  const startGame = (): void => {
    setRunning(true)
    setShapeCount(0)
    setTargetShape(shapes[Math.floor(Math.random() * shapes.length)])
    setMathProblem(generateMathProblem(level))
    setMathInput('')
    
    intervalRef.current = window.setInterval(() => {
      setCurrentShape(shapes[Math.floor(Math.random() * shapes.length)])
    }, Math.max(2000 - level * 100, 800))
  }

  const stopGame = (): void => {
    setRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleShapeClick = (): void => {
    if (!running) return
    if (currentShape === targetShape) {
      setShapeCount(c => c + 1)
    }
  }

  const handleMathSubmit = (): void => {
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
      <div className="bg-gradient-to-br from-cyan-50 via-teal-50 to-green-50 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-600 to-green-600 bg-clip-text text-transparent">
        🧠 Dual Task Challenge (Level {level})
      </h2>
      <p className="text-xl text-slate-700 mb-6 font-semibold">Count target shapes AND solve math problems!</p>

      <div className="mb-6 text-2xl font-bold text-center bg-white/70 p-4 rounded-xl backdrop-blur">
        <span className="text-green-600">Score: {score} / {target}</span> •
        <span className="text-cyan-600 ml-2">Shapes: {shapeCount}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Shape Task */}
        <div className="border-4 border-cyan-300 rounded-2xl p-6 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-lg">
          <h3 className="text-2xl font-bold mb-3 text-cyan-700">🔷 Task 1: Count Shapes</h3>
          <div className="text-lg font-semibold text-slate-600 mb-4">
            Click when you see: <span className="text-2xl font-bold capitalize text-cyan-600">{targetShape}</span>
          </div>
          <button
            onClick={handleShapeClick}
            disabled={!running}
            className={`w-40 h-40 mx-auto block rounded-2xl shadow-2xl transition-all transform ${shapeStyles[currentShape]} ${!running ? 'opacity-50' : 'hover:scale-110'}`}
          />
        </div>

        {/* Math Task */}
        <div className="border-4 border-green-300 rounded-2xl p-6 bg-gradient-to-br from-green-50 to-teal-50 shadow-lg">
          <h3 className="text-2xl font-bold mb-3 text-green-700">➕ Task 2: Solve Math</h3>
          <div className="text-4xl font-mono font-bold mb-6 text-center text-green-600">{mathProblem.question} = ?</div>
          <div className="flex gap-3">
            <input
              type="number"
              value={mathInput}
              onChange={(e) => setMathInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleMathSubmit()}
              disabled={!running}
              className="border-4 border-green-300 p-3 rounded-xl flex-1 text-2xl font-bold text-center focus:border-green-500 focus:outline-none shadow-lg"
              placeholder="Answer"
            />
            <button
              onClick={handleMathSubmit}
              disabled={!running}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white text-2xl font-bold rounded-xl hover:from-green-600 hover:to-teal-700 disabled:opacity-50 shadow-lg transform hover:scale-105 transition-all"
            >
              ✓
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={startGame}
          disabled={running}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 shadow-lg transform hover:scale-105 transition-all"
        >
          ▶️ Start
        </button>
        <button
          onClick={stopGame}
          disabled={!running}
          className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white text-2xl font-bold rounded-xl hover:from-red-600 hover:to-pink-700 disabled:opacity-50 shadow-lg transform hover:scale-105 transition-all"
        >
          ⏹️ Stop
        </button>
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

// Made with Bob
