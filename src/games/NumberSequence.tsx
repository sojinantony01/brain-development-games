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

const generateSequence = (level: number): Sequence => {
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

const NumberSequence = ({ level }: NumberSequenceProps): JSX.Element => {
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

  const handleSubmit = (): void => {
    const answer = Number(input)
    if (answer === sequence.answer) {
      const newScore = score + 1
      setScore(newScore)
      setFeedback('✅ Correct!')
      
      if (!saved.current && newScore >= target) {
        const percentageScore = Math.min(100, Math.round((newScore / target) * 100))
        markGameCompletedLevel('number-sequence', level, percentageScore, 100)
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
      <CelebrationAnimation show={completed} />
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-indigo-700 flex items-center justify-center gap-3">
            🔢 Pattern Detective
            <span className="text-2xl bg-indigo-100 px-4 py-1 rounded-full">Level {level}</span>
          </h2>
          <p className="text-lg text-slate-600 mt-2">Find the next number in the sequence! 🔍</p>
        </div>

        <div className="mb-6 flex gap-4 justify-center text-lg font-bold">
          <div className="bg-white px-8 py-4 rounded-xl shadow-md">
            <span className="text-indigo-600">🎯 Score:</span> <span className="text-3xl text-indigo-700">{score}/{target}</span>
          </div>
        </div>

        <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-center gap-4 text-4xl font-mono flex-wrap">
            {sequence.numbers.map((num, idx) => (
              <React.Fragment key={idx}>
                <span className="px-6 py-4 bg-gradient-to-br from-indigo-400 to-purple-500 text-white rounded-xl shadow-md transform hover:scale-110 transition-all font-bold">
                  {num}
                </span>
                {idx < sequence.numbers.length - 1 && <span className="text-indigo-600">→</span>}
              </React.Fragment>
            ))}
            <span className="text-indigo-600">→</span>
            <span className="px-6 py-4 bg-gradient-to-br from-yellow-400 to-orange-400 text-white rounded-xl shadow-md animate-pulse font-bold">
              ?
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center mb-6">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="border-4 border-indigo-400 p-3 sm:p-4 rounded-xl flex-1 text-2xl sm:text-3xl font-bold text-center focus:ring-4 focus:ring-indigo-300 focus:outline-none shadow-lg"
            placeholder="?"
            autoFocus
          />
          <button
            onClick={handleSubmit}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xl sm:text-2xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all whitespace-nowrap"
          >
            ✓ Submit
          </button>
        </div>

        {feedback && (
          <div className={`p-6 rounded-xl text-2xl font-bold text-center shadow-lg ${
            feedback.includes('✅')
              ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-4 border-emerald-300'
              : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-4 border-red-300'
          }`}>
            {feedback}
          </div>
        )}

        {completed && (
          <div className="mt-6 p-6 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-xl shadow-lg border-4 border-emerald-300">
            <div className="text-3xl font-bold text-center mb-2">🎉 Brilliant! Level {level} completed! 🎉</div>
            <div className="flex justify-center mt-4">
              <NextLevelButton currentLevel={level} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default NumberSequence
