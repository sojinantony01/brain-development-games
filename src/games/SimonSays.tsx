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

  const startGame = (): void => {
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

  const playSequence = async (seq: Color[]): Promise<void> => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, playbackSpeed))
      setActiveColor(seq[i])
      await new Promise(resolve => setTimeout(resolve, playbackSpeed / 2))
      setActiveColor(null)
    }
    setIsPlayerTurn(true)
    setIsPlaying(false)
  }

  const handleColorClick = (color: Color): void => {
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
        markGameCompletedLevel('simon-says', level, newScore, target)
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
      <CelebrationAnimation show={completed} />
      <div className="bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
        🎮 Simon Says (Level {level})
      </h2>
      <p className="text-xl text-slate-700 mb-6 font-semibold">Watch the sequence and repeat it!</p>

      <div className="mb-6 text-xl font-bold text-center bg-white/70 p-4 rounded-xl backdrop-blur">
        <span className="text-purple-600">Length: {sequenceLength}</span> •
        <span className="text-blue-600 ml-2">Speed: {playbackSpeed}ms</span> •
        <span className="text-green-600 ml-2">Score: {score} / {target}</span>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8 max-w-lg mx-auto">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => handleColorClick(color)}
            disabled={!isPlayerTurn || isPlaying}
            className={`h-40 rounded-2xl transition-all transform shadow-2xl ${COLOR_CLASSES[color]} ${
              activeColor === color ? 'ring-8 ring-white scale-90 brightness-150' : ''
            } ${!isPlayerTurn || isPlaying ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
          >
            <span className="text-white font-bold text-2xl capitalize drop-shadow-lg">{color}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-4 justify-center mb-6">
        <button
          onClick={startGame}
          disabled={isPlaying || isPlayerTurn}
          className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-2xl font-bold rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 transition-all"
        >
          {score === 0 ? '🎬 Start Game' : '🔄 New Round'}
        </button>
      </div>

      {isPlaying && (
        <div className="text-center text-2xl font-bold text-indigo-600 mb-4 animate-pulse">
          👀 Watch the sequence...
        </div>
      )}

      {isPlayerTurn && (
        <div className="text-center text-2xl font-bold text-emerald-600 mb-4">
          👆 Your turn! Repeat the sequence ({playerSequence.length}/{sequence.length})
        </div>
      )}

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

// Made with Bob
