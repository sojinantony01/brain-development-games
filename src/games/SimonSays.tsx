import React, { useEffect, useState, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'
import ResetButton from '../components/ResetButton'

export type SimonSaysProps = {
  level: number
}

const COLORS = ['red', 'blue', 'green', 'yellow'] as const
type Color = typeof COLORS[number]

const COLOR_CLASSES = {
  red: 'bg-red-500 hover:bg-red-600 active:bg-red-700',
  blue: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
  green: 'bg-green-500 hover:bg-green-600 active:bg-green-700',
  yellow: 'bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600',
}

export default function SimonSays({ level }: SimonSaysProps): JSX.Element {
  const [sequence, setSequence] = useState<Color[]>([])
  const [playerSequence, setPlayerSequence] = useState<Color[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPlayerTurn, setIsPlayerTurn] = useState(false)
  const [score, setScore] = useState(0)
  const [activeColor, setActiveColor] = useState<Color | null>(null)
  const [completed, setCompleted] = useState(false)
  const saved = useRef(false)
  
  const sequenceLength = Math.min(3 + level, 15)
  const playbackSpeed = Math.max(800 - level * 50, 300)
  const target = Math.max(3, Math.ceil(level * 1.5))

  useEffect(() => {
    setSequence([])
    setPlayerSequence([])
    setScore(0)
    setIsPlaying(false)
    setIsPlayerTurn(false)
    setCompleted(false)
    saved.current = false
  }, [level])

  function startGame(): void {
    const newSequence: Color[] = []
    for (let i = 0; i < sequenceLength; i++) {
      newSequence.push(COLORS[Math.floor(Math.random() * COLORS.length)])
    }
    setSequence(newSequence)
    setPlayerSequence([])
    setIsPlaying(true)
    setIsPlayerTurn(false)
    playSequence(newSequence)
  }

  async function playSequence(seq: Color[]): Promise<void> {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, playbackSpeed))
      setActiveColor(seq[i])
      await new Promise(resolve => setTimeout(resolve, playbackSpeed / 2))
      setActiveColor(null)
    }
    setIsPlayerTurn(true)
    setIsPlaying(false)
  }

  function handleColorClick(color: Color): void {
    if (!isPlayerTurn || isPlaying) return

    const newPlayerSequence = [...playerSequence, color]
    setPlayerSequence(newPlayerSequence)
    
    // Flash the color
    setActiveColor(color)
    setTimeout(() => setActiveColor(null), 200)

    // Check if correct
    const currentIndex = newPlayerSequence.length - 1
    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      // Wrong! Reset
      setIsPlayerTurn(false)
      setPlayerSequence([])
      setTimeout(() => {
        alert('Wrong sequence! Try again.')
        setIsPlayerTurn(true)
      }, 300)
      return
    }

    // Check if complete
    if (newPlayerSequence.length === sequence.length) {
      const newScore = score + 1
      setScore(newScore)
      setIsPlayerTurn(false)
      setPlayerSequence([])
      
      if (!saved.current && newScore >= target) {
        markGameCompletedLevel('simon-says', level, newScore)
        saved.current = true
        setCompleted(true)
      }
      
      setTimeout(() => {
        alert('Correct! Starting next round...')
        startGame()
      }, 500)
    }
  }

  return (
    <>
      <CelebrationAnimation show={won} />
      <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">Simon Says (Level {level})</h2>
      <p className="text-slate-600 mb-4">Watch the sequence and repeat it!</p>

      <div className="mb-4 text-sm text-slate-500">
        Sequence Length: {sequenceLength} • Speed: {playbackSpeed}ms • Score: {score} / {target}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => handleColorClick(color)}
            disabled={!isPlayerTurn || isPlaying}
            className={`h-32 rounded-lg transition-all ${COLOR_CLASSES[color]} ${
              activeColor === color ? 'ring-4 ring-white scale-95' : ''
            } ${!isPlayerTurn || isPlaying ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="text-white font-bold text-lg capitalize">{color}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-2 justify-center mb-4">
        <button
          onClick={startGame}
          disabled={isPlaying || isPlayerTurn}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {score === 0 ? 'Start Game' : 'New Round'}
        </button>
      </div>

      {isPlaying && (
        <div className="text-center text-sm text-slate-500 mb-4">
          🎵 Watch the sequence...
        </div>
      )}

      {isPlayerTurn && (
        <div className="text-center text-sm text-emerald-600 mb-4">
          👆 Your turn! Repeat the sequence ({playerSequence.length}/{sequence.length})
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
