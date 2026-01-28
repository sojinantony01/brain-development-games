import React, { useEffect, useState, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type AnagramSolverProps = {
  level: number
}

const WORD_LISTS = {
  easy: ['cat', 'dog', 'sun', 'moon', 'star', 'tree', 'bird', 'fish'],
  medium: ['brain', 'react', 'vital', 'garden', 'puzzle', 'orange', 'planet'],
  hard: ['complex', 'rotation', 'sequence', 'pattern', 'cognitive', 'challenge']
}

const scramble = (word: string): string => {
  return word.split('').sort(() => Math.random() - 0.5).join('')
}

const getWordList = (level: number): string[] => {
  if (level <= 3) return WORD_LISTS.easy
  if (level <= 6) return WORD_LISTS.medium
  return WORD_LISTS.hard
}

const AnagramSolver = ({ level }: AnagramSolverProps): JSX.Element => {
  const wordList = getWordList(level)
  const [word, setWord] = useState('')
  const [scrambled, setScrambled] = useState('')
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number | null>(level >= 7 ? 30 : null)
  const [completed, setCompleted] = useState(false)
  const saved = useRef(false)
  const target = Math.max(5, level + 3)

  useEffect(() => {
    pickNewWord()
    setScore(0)
    setCompleted(false)
    saved.current = false
    setTimeLeft(level >= 7 ? 30 : null)
  }, [level])

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft(t => t! - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const pickNewWord = (): void => {
    const newWord = wordList[Math.floor(Math.random() * wordList.length)]
    setWord(newWord)
    setScrambled(scramble(newWord))
    setInput('')
  }

  const handleSubmit = (): void => {
    if (completed) return // Don't allow submissions after completion
    
    if (input.toLowerCase() === word.toLowerCase()) {
      const newScore = score + 1
      setScore(newScore)
      
      if (newScore >= target) {
        if (!saved.current) {
          const percentageScore = Math.min(100, Math.round((newScore / target) * 100))
          markGameCompletedLevel('anagram-solver', level, percentageScore, 100)
          saved.current = true
        }
        setCompleted(true)
        return // Stop here, don't pick new word
      }
      
      // Only pick new word if not completed
      pickNewWord()
    } else {
      setInput('')
    }
  }

  return (
    <>
      <CelebrationAnimation show={completed} />
      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
        🧩 Anagram Solver (Level {level})
      </h2>
      <p className="text-xl text-slate-700 mb-6 font-semibold">Unscramble the letters to form words!</p>

      <div className="mb-6 flex gap-6 justify-center items-center bg-white/70 p-4 rounded-xl backdrop-blur">
        <div className="text-2xl font-bold text-orange-600">Score: {score} / {target}</div>
        {timeLeft !== null && (
          <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-amber-600'}`}>
            ⏱️ Time: {timeLeft}s
          </div>
        )}
      </div>

      <div className="mb-8 text-center p-6 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl border-4 border-orange-300 shadow-lg">
        <div className="text-7xl font-mono font-bold tracking-widest mb-3 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent animate-pulse">
          {scrambled.toUpperCase()}
        </div>
        <div className="text-xl font-bold text-slate-600">
          📝 {word.length} letters
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          className="border-4 border-orange-300 p-4 rounded-xl text-2xl font-bold text-center flex-1 focus:border-orange-500 focus:outline-none shadow-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Type your answer..."
          disabled={timeLeft === 0 || completed}
        />
        <button
          onClick={handleSubmit}
          disabled={timeLeft === 0 || completed}
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-2xl font-bold rounded-xl hover:from-orange-600 hover:to-amber-700 shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          ✓ Submit
        </button>
      </div>

      <button
        onClick={pickNewWord}
        disabled={completed}
        className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xl font-bold rounded-xl hover:from-yellow-500 hover:to-orange-500 shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        ⏭️ Skip
      </button>

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

export default AnagramSolver
