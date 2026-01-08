import React, { useEffect, useState } from 'react'

interface CelebrationAnimationProps {
  show: boolean
}

interface Confetti {
  id: number
  left: number
  delay: number
  duration: number
  color: string
}

export default function CelebrationAnimation({ show }: CelebrationAnimationProps): JSX.Element | null {
  const [confetti, setConfetti] = useState<Confetti[]>([])

  useEffect(() => {
    if (show) {
      // Generate confetti pieces
      const pieces: Confetti[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1,
        color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][Math.floor(Math.random() * 6)]
      }))
      setConfetti(pieces)

      // Clear confetti after animation
      const timer = setTimeout(() => {
        setConfetti([])
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [show])

  if (!show || confetti.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: 'rotate(45deg)',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
          }}
        />
      ))}
      
      {/* Success message with scale animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-bounce-in text-6xl">
          🎉
        </div>
      </div>
    </div>
  )
}

// Made with Bob
