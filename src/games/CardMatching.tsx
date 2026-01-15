import React, { useEffect, useState, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'
import ResetButton from '../components/ResetButton'

export type CardMatchingProps = {
  level: number
}

type Card = {
  id: number
  value: string
  isFlipped: boolean
  isMatched: boolean
}

const SYMBOLS = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎬', '🎵', '🎸', '🎹', '🎺', '🎻', '🎲', '🎰', '🎳', '⚽', '🏀', '🏈', '⚾', '🎾', '🏐']

const gridSize = (level: number): number => {
  if (level <= 2) return 4 // 4x4 = 8 pairs
  if (level <= 5) return 6 // 6x6 = 18 pairs
  return 8 // 8x8 = 32 pairs
}

const CardMatching = ({ level }: CardMatchingProps): JSX.Element => {
  const size = gridSize(level)
  const pairCount = (size * size) / 2
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [completed, setCompleted] = useState(false)
  const saved = useRef(false)

  useEffect(() => {
    initializeGame()
  }, [level, size])

  const initializeGame = (): void => {
    const symbols = SYMBOLS.slice(0, pairCount)
    const cardPairs = [...symbols, ...symbols]
    const shuffled = cardPairs.sort(() => Math.random() - 0.5)
    
    setCards(shuffled.map((value, id) => ({
      id,
      value,
      isFlipped: false,
      isMatched: false,
    })))
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setStartTime(null)
    setEndTime(null)
    setCompleted(false)
    saved.current = false
  }

  const handleCardClick = (id: number): void => {
    if (startTime === null) setStartTime(Date.now())
    if (flippedCards.length === 2) return
    if (cards[id].isFlipped || cards[id].isMatched) return
    if (flippedCards.includes(id)) return

    const newFlipped = [...flippedCards, id]
    setFlippedCards(newFlipped)
    
    setCards(prev => prev.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    ))

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      const [first, second] = newFlipped
      
      if (cards[first].value === cards[second].value) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(card =>
            card.id === first || card.id === second
              ? { ...card, isMatched: true }
              : card
          ))
          setMatches(m => m + 1)
          setFlippedCards([])
          
          // Check if game complete
          if (matches + 1 === pairCount) {
            const time = Date.now() - (startTime ?? Date.now())
            setEndTime(time)
            const score = Math.max(0, Math.round(100000 / (time + moves * 1000)))
            if (!saved.current) {
              markGameCompletedLevel('card-matching', level, score, 100)
              saved.current = true
              setCompleted(true)
            }
          }
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card =>
            card.id === first || card.id === second
              ? { ...card, isFlipped: false }
              : card
          ))
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  return (
    <>
      <CelebrationAnimation show={completed} />
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-purple-700 flex items-center justify-center gap-3">
            🎴 Memory Match Game
            <span className="text-2xl bg-purple-100 px-4 py-1 rounded-full">Level {level}</span>
          </h2>
          <p className="text-xl text-slate-600 mt-2">Find all matching pairs! 🎯</p>
        </div>

        <div className="mb-6 flex gap-6 justify-center text-lg font-bold">
          <div className="bg-white px-6 py-3 rounded-xl shadow-md">
            <span className="text-blue-600">🎮 Moves:</span> <span className="text-2xl text-blue-700">{moves}</span>
          </div>
          <div className="bg-white px-6 py-3 rounded-xl shadow-md">
            <span className="text-green-600">✨ Matches:</span> <span className="text-2xl text-green-700">{matches}/{pairCount}</span>
          </div>
          {endTime && (
            <div className="bg-white px-6 py-3 rounded-xl shadow-md">
              <span className="text-orange-600">⏱️ Time:</span> <span className="text-2xl text-orange-700">{(endTime / 1000).toFixed(1)}s</span>
            </div>
          )}
        </div>

        <div
          className="grid gap-3 mb-6"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        >
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isMatched || flippedCards.length === 2}
              className={`aspect-square rounded-2xl text-4xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                card.isFlipped || card.isMatched
                  ? 'bg-gradient-to-br from-white to-blue-50 border-4 border-blue-400 rotate-0'
                  : 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-4 border-purple-600'
              } ${card.isMatched ? 'opacity-60 scale-95' : ''} ${
                card.isFlipped && !card.isMatched ? 'animate-bounce-in' : ''
              }`}
            >
              {card.isFlipped || card.isMatched ? (
                <span className="drop-shadow-lg">{card.value}</span>
              ) : (
                <span className="text-white text-5xl">❓</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={initializeGame}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            🔄 New Game
          </button>
        </div>

        {completed && (
          <div className="mt-6 p-6 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-xl shadow-lg border-4 border-emerald-300">
            <div className="text-3xl font-bold mb-2 text-center">🎉 Awesome! You found all pairs! 🎉</div>
            <div className="text-xl text-center mb-4">
              Completed in <span className="font-bold text-2xl">{moves}</span> moves and <span className="font-bold text-2xl">{((endTime ?? 0) / 1000).toFixed(1)}s</span>!
            </div>
            <div className="flex justify-center">
              <NextLevelButton currentLevel={level} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CardMatching
