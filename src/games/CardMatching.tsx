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

function gridSize(level: number): number {
  if (level <= 2) return 4 // 4x4 = 8 pairs
  if (level <= 5) return 6 // 6x6 = 18 pairs
  return 8 // 8x8 = 32 pairs
}

export default function CardMatching({ level }: CardMatchingProps): JSX.Element {
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

  function initializeGame(): void {
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

  function handleCardClick(id: number): void {
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
              markGameCompletedLevel('card-matching', level, score)
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
      <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">Card Matching (Level {level})</h2>
      <p className="text-slate-600 mb-4">Find all matching pairs!</p>

      <div className="mb-4 flex gap-4 text-sm text-slate-500">
        <div>Moves: {moves}</div>
        <div>Matches: {matches}/{pairCount}</div>
        {endTime && <div>Time: {(endTime / 1000).toFixed(1)}s</div>}
      </div>

      <div 
        className="grid gap-2 mb-4"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.isMatched || flippedCards.length === 2}
            className={`aspect-square rounded-lg text-2xl font-bold transition-all ${
              card.isFlipped || card.isMatched
                ? 'bg-white border-2 border-indigo-400'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } ${card.isMatched ? 'opacity-50' : ''}`}
          >
            {card.isFlipped || card.isMatched ? card.value : '?'}
          </button>
        ))}
      </div>

      <button
        onClick={initializeGame}
        className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500"
      >
        Reset
      </button>

      {completed && (
        <div className="mt-4 p-4 bg-emerald-100 text-emerald-800 rounded">
          ✅ Completed in {moves} moves and {((endTime ?? 0) / 1000).toFixed(1)}s!
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
