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

function scramble(word: string): string {
  return word.split('').sort(() => Math.random() - 0.5).join('')
}

function getWordList(level: number): string[] {
  if (level <= 3) return WORD_LISTS.easy
  if (level <= 6) return WORD_LISTS.medium
  return WORD_LISTS.hard
}

export default function AnagramSolver({ level }: AnagramSolverProps): JSX.Element {
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

  function pickNewWord(): void {
    const newWord = wordList[Math.floor(Math.random() * wordList.length)]
    setWord(newWord)
    setScrambled(scramble(newWord))
    setInput('')
  }

  function handleSubmit(): void {
    if (input.toLowerCase() === word.toLowerCase()) {
      const newScore = score + 1
      setScore(newScore)
      
      if (!saved.current && newScore >= target) {
        markGameCompletedLevel('anagram-solver', level, newScore)
        saved.current = true
        setCompleted(true)
      }
      
      pickNewWord()
    } else {
      setInput('')
    }
  }

  return (
    <>
      <CelebrationAnimation show={completed} />
      <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">Anagram Solver (Level {level})</h2>
      <p className="text-slate-600 mb-4">Unscramble the letters to form words!</p>

      <div className="mb-4 flex gap-4 text-sm text-slate-500">
        <div>Score: {score} / {target}</div>
        {timeLeft !== null && <div>Time: {timeLeft}s</div>}
      </div>

      <div className="mb-6 text-center">
        <div className="text-4xl font-mono font-bold tracking-widest mb-2">
          {scrambled.toUpperCase()}
        </div>
        <div className="text-sm text-slate-500">
          {word.length} letters
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          className="border p-2 rounded flex-1"
          placeholder="Type your answer"
          disabled={timeLeft === 0}
        />
        <button
          onClick={handleSubmit}
          disabled={timeLeft === 0}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          Submit
        </button>
      </div>

      <button
        onClick={pickNewWord}
        className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-sm"
      >
        Skip
      </button>

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
