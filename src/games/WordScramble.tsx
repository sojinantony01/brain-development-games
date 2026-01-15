import React, { useEffect, useMemo, useState, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type WordScrambleProps = {
  level: number
}

const WORDS = ['cat', 'dog', 'sun', 'moon', 'earth', 'brain', 'react', 'vital', 'garden', 'puzzle', 'complex', 'rotation']
const FAKE_WORDS = ['blorf', 'quazz', 'splick']

const scramble = (word: string): string => {
  return word.split('').sort(() => Math.random() - 0.5).join('')
}

const WordScramble = ({ level }: WordScrambleProps): JSX.Element => {
  const pool = useMemo(() => {
    if (level <= 1) return WORDS.filter((w) => w.length === 3)
    if (level <= 4) return WORDS.filter((w) => w.length <= 5)
    if (level >= 6 && level <= 6) return [...WORDS, ...FAKE_WORDS]
    return WORDS
  }, [level])

  const [word, setWord] = useState('')
  const [scr, setScr] = useState('')
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const saved = useRef(false)
  const target = Math.max(3, Math.ceil(level / 2))

  useEffect(() => {
    setScore(0)
    setCompleted(false)
    saved.current = false
    pick()
  }, [level])

  const pick = (): void => {
    const w = pool[Math.floor(Math.random() * pool.length)]
    setWord(w)
    setScr(scramble(w))
    setInput('')
  }

  const submitGuess = (): void => {
    if (input.toLowerCase() === word.toLowerCase()) {
      const newScore = score + 1
      setScore((s) => s + 1)
      if (!saved.current && newScore >= target) {
        markGameCompletedLevel('word-scramble', level, newScore, target)
        saved.current = true
        setCompleted(true)
      }
      pick()
    } else {
      setScore((s) => Math.max(0, s - 1))
    }
  }

  return (
    <>
      <CelebrationAnimation show={completed} />
      <div className="bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent">
        🔤 Word Scramble (Level {level})
      </h2>
      <p className="text-xl text-slate-700 mb-6 font-semibold">Unscramble the letters to form a real word!</p>

      <div className="text-6xl font-mono font-bold mb-8 text-center bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent tracking-widest animate-pulse">
        {scr.toUpperCase()}
      </div>
      <div className="flex gap-4 items-center justify-center mb-6">
        <input
          className="border-4 border-teal-300 p-4 rounded-xl text-2xl font-bold text-center flex-1 max-w-md focus:border-teal-500 focus:outline-none shadow-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && submitGuess()}
          placeholder="Type your answer..."
        />
        <button
          onClick={submitGuess}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white text-2xl font-bold rounded-xl hover:from-green-600 hover:to-teal-700 shadow-lg transform hover:scale-105 transition-all"
        >
          ✓ Submit
        </button>
      </div>

      <div className="text-2xl font-bold text-center text-green-600 bg-white/70 p-4 rounded-xl backdrop-blur">
        Score: {score} / {target}
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

export default WordScramble
