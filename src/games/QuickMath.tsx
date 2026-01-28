import React, { useEffect, useMemo, useState, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type QuickMathProps = {
  level: number
}

type Problem = { text: string; answer: number }

const generateProblem = (level: number): Problem => {
  const a = Math.floor(Math.random() * 10) + 1
  const b = Math.floor(Math.random() * 10) + 1
  if (level <= 1) return { text: `${a} + ${b}`, answer: a + b }
  if (level <= 3) return Math.random() > 0.5 ? { text: `${a} + ${b}`, answer: a + b } : { text: `${a} - ${b}`, answer: a - b }
  if (level <= 4) return { text: `${a} * ${b}`, answer: a * b }
  if (level <= 7) return { text: `${a} + ${b}`, answer: a + b }
  // level 8: two-step
  if (level === 8) return { text: `(${a} + ${b}) * 2`, answer: (a + b) * 2 }
  // levels 9-10: quick operations with timer
  return { text: `${a} * ${b}`, answer: a * b }
}

const QuickMath = ({ level }: QuickMathProps): JSX.Element => {
  const [problem, setProblem] = useState<Problem>(() => generateProblem(level))
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number | null>(level >= 9 ? 2000 : null)
  const [completed, setCompleted] = useState(false)
  const saved = useRef(false)
  const target = Math.max(3, Math.ceil(level / 2))

  useEffect(() => {
    setProblem(generateProblem(level))
    setInput('')
    setScore(0)
    setTimeLeft(level >= 9 ? 2000 : null)
    setCompleted(false)
    saved.current = false
  }, [level])

  useEffect(() => {
    if (timeLeft === null) return
    if (timeLeft <= 0) return
    const id = setInterval(() => setTimeLeft((t) => (t === null ? null : t - 100)), 100)
    return () => clearInterval(id)
  }, [timeLeft])

  const submit = (): void => {
    const val = Number(input)
    const newScore = val === problem.answer ? score + 1 : Math.max(0, score - 1)
    if (val === problem.answer) setScore((s) => s + 1)
    else setScore((s) => Math.max(0, s - 1))
    // progress rule
    if (!saved.current && newScore >= target) {
      const percentageScore = Math.min(100, Math.round((newScore / target) * 100))
      markGameCompletedLevel('quick-math', level, percentageScore, 100)
      saved.current = true
      setCompleted(true)
    }
    setProblem(generateProblem(level))
    setInput('')
    if (level >= 9) setTimeLeft(2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit()
    }
  }

  return (
    <>
      <CelebrationAnimation show={completed} />
      <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-orange-700 flex items-center justify-center gap-3">
            🧮 Quick Math Challenge
            <span className="text-2xl bg-orange-100 px-4 py-1 rounded-full">Level {level}</span>
          </h2>
          <p className="text-lg text-slate-600 mt-2">Solve as fast as you can! ⚡</p>
        </div>

        <div className="mb-8 p-12 bg-white rounded-2xl shadow-lg border-4 border-orange-200">
          <div className="text-7xl font-black text-center text-orange-600 mb-4">
            {problem.text} = ?
          </div>
        </div>

        <div className="flex gap-4 items-center justify-center mb-6">
          <input
            className="text-4xl font-bold text-center border-4 border-blue-400 p-4 rounded-xl w-48 focus:ring-4 focus:ring-blue-300 focus:outline-none shadow-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="?"
            autoFocus
          />
          <button
            onClick={submit}
            className="px-8 py-4 bg-gradient-to-r from-green-400 to-green-500 text-white text-2xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            ✓ Submit
          </button>
        </div>

        {timeLeft !== null && (
          <div className="mb-6 text-center">
            <div className="inline-block bg-red-100 px-8 py-4 rounded-xl shadow-md border-2 border-red-300">
              <span className="text-2xl font-bold text-red-700">⏱️ Time: </span>
              <span className="text-4xl font-black text-red-600">{(timeLeft / 1000).toFixed(2)}s</span>
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <div className="inline-block bg-white px-8 py-4 rounded-xl shadow-md">
            <span className="text-2xl font-bold text-blue-700">Score: </span>
            <span className="text-4xl font-black text-green-600">{score}</span>
            <span className="text-2xl font-bold text-slate-500"> / {target}</span>
          </div>
        </div>
        
        {completed && (
          <div className="mt-6 p-6 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-xl shadow-lg border-4 border-emerald-300">
            <div className="text-3xl font-bold text-center mb-4">🎉 Brilliant! Level {level} completed! 🎉</div>
            <div className="flex justify-center">
              <NextLevelButton currentLevel={level} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default QuickMath
