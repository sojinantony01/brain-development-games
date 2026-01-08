import React, { useEffect, useState, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type NumberSequenceProps = {
  level: number
}

type Sequence = {
  numbers: number[]
  answer: number
  type: string
}

function generateSequence(level: number): Sequence {
  if (level <= 2) {
    // Simple arithmetic
    const start = Math.floor(Math.random() * 10) + 1
    const diff = Math.floor(Math.random() * 5) + 1
    const numbers = [start, start + diff, start + diff * 2, start + diff * 3]
    return { numbers, answer: start + diff * 4, type: 'arithmetic' }
  }
  
  if (level <= 4) {
    // Geometric
    const start = Math.floor(Math.random() * 3) + 2
    const ratio = Math.floor(Math.random() * 2) + 2
    const numbers = [start, start * ratio, start * ratio * ratio, start * ratio * ratio * ratio]
    return { numbers, answer: start * Math.pow(ratio, 4), type: 'geometric' }
  }
  
  if (level <= 6) {
    // Fibonacci-like
    const a = Math.floor(Math.random() * 5) + 1
    const b = Math.floor(Math.random() * 5) + 1
    const numbers = [a, b, a + b, a + 2 * b, 2 * a + 3 * b]
    return { numbers, answer: 3 * a + 5 * b, type: 'fibonacci' }
  }
  
  // Complex patterns
  const base = Math.floor(Math.random() * 5) + 2
  const numbers = [base, base * 2, base * 2 + 1, base * 4 + 1, base * 4 + 2]
  return { numbers, answer: base * 8 + 2, type: 'complex' }
}

export default function NumberSequence({ level }: NumberSequenceProps): JSX.Element {
  const [sequence, setSequence] = useState<Sequence>(() => generateSequence(level))
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<string>('')
  const [completed, setCompleted] = useState(false)
  const saved = useRef(false)
  const target = Math.max(3, Math.ceil(level * 1.5))

  useEffect(() => {
    setSequence(generateSequence(level))
    setInput('')
    setScore(0)
    setFeedback('')
    setCompleted(false)
    saved.current = false
  }, [level])

  function handleSubmit(): void {
    const answer = Number(input)
    if (answer === sequence.answer) {
      const newScore = score + 1
      setScore(newScore)
      setFeedback('✅ Correct!')
      
      if (!saved.current && newScore >= target) {
        markGameCompletedLevel('number-sequence', level, newScore)
        saved.current = true
        setCompleted(true)
      }
      
      setTimeout(() => {
        setSequence(generateSequence(level))
        setInput('')
        setFeedback('')
      }, 1500)
    } else {
      setFeedback(`❌ Wrong! Answer was ${sequence.answer}`)
      setTimeout(() => {
        setSequence(generateSequence(level))
        setInput('')
        setFeedback('')
      }, 2000)
    }
  }

  return (
    <>
      <CelebrationAnimation show={won} />
      <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">Number Sequence Finder (Level {level})</h2>
      <p className="text-slate-600 mb-4">Find the next number in the sequence!</p>

      <div className="mb-4 text-sm text-slate-500">
        Score: {score} / {target} • Pattern: {sequence.type}
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-2xl font-mono mb-4">
          {sequence.numbers.map((num, idx) => (
            <React.Fragment key={idx}>
              <span className="px-4 py-2 bg-indigo-100 rounded">{num}</span>
              {idx < sequence.numbers.length - 1 && <span>→</span>}
            </React.Fragment>
          ))}
          <span>→</span>
          <span className="px-4 py-2 bg-yellow-100 rounded">?</span>
        </div>
      </div>

      <div className="flex gap-2 items-center mb-4">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          className="border p-2 rounded flex-1"
          placeholder="Enter the next number"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Submit
        </button>
      </div>

      {feedback && (
        <div className={`p-3 rounded ${feedback.includes('✅') ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
          {feedback}
        </div>
      )}

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
