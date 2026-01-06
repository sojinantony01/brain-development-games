import React, { useEffect, useMemo, useState } from 'react'
import { markGameCompletedLevel } from '../lib/progress'

export type QuickMathProps = {
  level: number
}

type Problem = { text: string; answer: number }

function generateProblem(level: number): Problem {
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

export default function QuickMath({ level }: QuickMathProps): JSX.Element {
  const [problem, setProblem] = useState<Problem>(() => generateProblem(level))
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number | null>(level >= 9 ? 2000 : null)

  useEffect(() => {
    setProblem(generateProblem(level))
    setInput('')
    setScore(0)
    setTimeLeft(level >= 9 ? 2000 : null)
  }, [level])

  useEffect(() => {
    if (timeLeft === null) return
    if (timeLeft <= 0) return
    const id = setInterval(() => setTimeLeft((t) => (t === null ? null : t - 100)), 100)
    return () => clearInterval(id)
  }, [timeLeft])

  function submit(): void {
    const val = Number(input)
    if (val === problem.answer) setScore((s) => s + 1)
    else setScore((s) => Math.max(0, s - 1))
    // progress rule
    if (score + 1 >= Math.max(3, Math.ceil(level / 2))) {
      markGameCompletedLevel('quick-math', level, score + 1)
    }
    setProblem(generateProblem(level))
    setInput('')
    if (level >= 9) setTimeLeft(2000)
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">Quick Math (Level {level})</h2>
      <p className="text-slate-600 mb-4">Solve quickly: {problem.text}</p>

      <div className="flex gap-2 items-center">
        <input className="border p-2 rounded" value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={submit} className="px-3 py-1 bg-indigo-600 text-white rounded">Submit</button>
        {timeLeft !== null && <div className="text-sm text-slate-500">Time left: {(timeLeft / 1000).toFixed(2)}</div>}
      </div>

      <div className="mt-4 text-sm text-slate-500">Score: {score}</div>
    </div>
  )
}
