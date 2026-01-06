import React, { useEffect, useMemo, useState } from 'react'
import { markGameCompletedLevel } from '../lib/progress'

export type WordScrambleProps = {
  level: number
}

const WORDS = ['cat', 'dog', 'sun', 'moon', 'earth', 'brain', 'react', 'vital', 'garden', 'puzzle', 'complex', 'rotation']
const FAKE_WORDS = ['blorf', 'quazz', 'splick']

function scramble(word: string): string {
  return word.split('').sort(() => Math.random() - 0.5).join('')
}

export default function WordScramble({ level }: WordScrambleProps): JSX.Element {
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

  useEffect(() => {
    pick()
  }, [level])

  function pick(): void {
    const w = pool[Math.floor(Math.random() * pool.length)]
    setWord(w)
    setScr(scramble(w))
    setInput('')
  }

  function submitGuess(): void {
    if (input.toLowerCase() === word.toLowerCase()) {
      setScore((s) => s + 1)
      if (score + 1 >= Math.max(3, Math.ceil(level / 2))) {
        markGameCompletedLevel('word-scramble', level, score + 1)
      }
      pick()
    } else {
      setScore((s) => Math.max(0, s - 1))
    }
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">Word Scramble (Level {level})</h2>
      <p className="text-slate-600 mb-4">Unscramble the letters to form a real word.</p>

      <div className="text-3xl font-mono mb-4">{scr}</div>
      <div className="flex gap-2 items-center">
        <input className="border p-2 rounded" value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={submitGuess} className="px-3 py-1 bg-indigo-600 text-white rounded">Submit</button>
      </div>

      <div className="mt-4 text-sm text-slate-500">Score: {score}</div>
    </div>
  )
}
