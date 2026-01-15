import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export type NextLevelButtonProps = {
  currentLevel: number
  maxLevel?: number
}

export default function NextLevelButton({ currentLevel, maxLevel = 10 }: NextLevelButtonProps): JSX.Element {
  const navigate = useNavigate()
  const [search] = useSearchParams()
  
  const nextLevel = currentLevel + 1
  const hasNextLevel = nextLevel <= maxLevel

  const goToNextLevel = (): void => {
    if (!hasNextLevel) return
    const params = new URLSearchParams(search)
    params.set('level', String(nextLevel))
    navigate(`?${params.toString()}`, { replace: true })
  }

  const goHome = (): void => {
    navigate('/')
  }

  if (!hasNextLevel) {
    return (
      <div className="flex gap-2">
        <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded font-semibold">
          🎉 All levels completed!
        </div>
        <button
          onClick={goHome}
          className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={goToNextLevel}
      className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700"
    >
      Next Level →
    </button>
  )
}

// Made with Bob
