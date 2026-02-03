import React, { useMemo, useState, useEffect, useRef } from 'react'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type MentalRotationProps = {
  level: number
}

// Simple shape generator using letters as base shapes for L1-2 and blocks for higher levels
const generatePair = (level: number): { left: string; right: string; same: boolean } => {
  if (level <= 2) {
    // use single letter and sometimes mirror it
    const letters = ['R', 'L', 'E', 'F']
    const ch = letters[Math.floor(Math.random() * letters.length)]
    const same = Math.random() > 0.5
    const right = same ? ch : ch.split('').reverse().join('') // simple mirror
    return { left: ch, right, same }
  }

  // for higher levels produce pseudo-shapes as ascii patterns and rotate by multiples of 90
  const shapes = ['▮▯▮', '▯▮▯', '▮▮▯', '▯▮▮']
  const base = shapes[Math.floor(Math.random() * shapes.length)]
  const rot = [0, 90, 180, 270][Math.floor(Math.random() * 4)]
  const same = Math.random() > 0.5
  const right = same ? rotateAscii(base, rot) : rotateAscii(base, (rot + 90) % 360)
  return { left: base, right, same }
}

const rotateAscii = (s: string, angle: number): string => {
  // trivial "rotation" by rearranging characters for demo purposes
  if (angle === 0) return s
  if (angle === 90) return s.split('').reverse().join('')
  if (angle === 180) return s + ' ' + s
  return s.replace(/./g, (c) => c === '▮' ? '▯' : '▮')
}

const MentalRotation = ({ level }: MentalRotationProps): JSX.Element => {
  const [pair, setPair] = useState(() => generatePair(level))
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const saved = useRef(false)
  const [completed, setCompleted] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const target = Math.max(3, Math.ceil(level * 1.5))

  useEffect(() => {
    // regenerate when level changes
    setPair(generatePair(level))
    setScore(0)
    setAttempts(0)
    setCompleted(false)
    setFeedback(null)
    saved.current = false
  }, [level])

  const answer = (isSame: boolean): void => {
    if (completed) return // Don't allow answers after completion
    
    const isCorrect = isSame === pair.same
    setAttempts((a) => a + 1)
    const newScore = score + (isCorrect ? 1 : 0)
    if (isCorrect) setScore((s) => s + 1)
    
    // Show brief feedback
    setFeedback(isCorrect ? 'correct' : 'wrong')
    
    // Check if target reached
    if (newScore >= target) {
      if (!saved.current) {
        import('../lib/progress').then(({ markGameCompletedLevel }) => {
          const percentageScore = Math.min(100, Math.round((newScore / target) * 100))
          markGameCompletedLevel('mental-rotation', level, percentageScore, 100)
        })
        saved.current = true
      }
      setCompleted(true)
      return // Stop here, don't generate new pair
    }
    
    // Immediately generate new pair and clear feedback
    setTimeout(() => {
      setPair(generatePair(level))
      setFeedback(null)
    }, 300) // Very brief feedback display
  }

  return (
    <>
      <CelebrationAnimation show={completed} />
      <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-teal-700 flex items-center justify-center gap-3">
            🔄 Shape Matcher
            <span className="text-2xl bg-teal-100 px-4 py-1 rounded-full">Level {level}</span>
          </h2>
          <p className="text-lg text-slate-600 mt-2">Are these shapes the same after rotation? 🤔</p>
        </div>

        <div className="mb-6 flex gap-4 justify-center text-lg font-bold">
          <div className="bg-white px-8 py-4 rounded-xl shadow-md">
            <span className="text-teal-600">🎯 Score:</span> <span className="text-3xl text-teal-700">{score}/{target}</span>
          </div>
          <div className="bg-white px-8 py-4 rounded-xl shadow-md">
            <span className="text-blue-600">🎮 Attempts:</span> <span className="text-3xl text-blue-700">{attempts}</span>
          </div>
        </div>

        <div className="flex gap-8 justify-center items-center my-8 relative">
          <div className={`w-56 h-40 flex items-center justify-center border-4 rounded-2xl text-6xl font-mono shadow-lg transform transition-all ${
            feedback === 'correct' ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 scale-105' :
            feedback === 'wrong' ? 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 scale-95' :
            'border-teal-400 bg-gradient-to-br from-white to-teal-50 hover:scale-105'
          }`}>
            {pair.left}
          </div>
          <div className="text-5xl animate-pulse">
            {feedback === 'correct' ? '✅' : feedback === 'wrong' ? '❌' : '🔄'}
          </div>
          <div className={`w-56 h-40 flex items-center justify-center border-4 rounded-2xl text-6xl font-mono shadow-lg transform transition-all ${
            feedback === 'correct' ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 scale-105' :
            feedback === 'wrong' ? 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 scale-95' :
            'border-cyan-400 bg-gradient-to-br from-white to-cyan-50 hover:scale-105'
          }`}>
            {pair.right}
          </div>
        </div>

        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={() => answer(true)}
            disabled={completed}
            className="px-12 py-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-2xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            ✅ Same
          </button>
          <button
            onClick={() => answer(false)}
            disabled={completed}
            className="px-12 py-6 bg-gradient-to-r from-red-400 to-pink-500 text-white text-2xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            ❌ Different
          </button>
        </div>
        
        {completed && (
          <div className="mt-6 p-6 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-xl shadow-lg border-4 border-emerald-300">
            <div className="text-3xl font-bold text-center mb-2">🎉 Perfect! Level {level} completed! 🎉</div>
            <div className="flex justify-center mt-4">
              <NextLevelButton currentLevel={level} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default MentalRotation
