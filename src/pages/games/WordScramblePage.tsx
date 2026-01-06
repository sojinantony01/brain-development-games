import React from 'react'
import { useSearchParams } from 'react-router-dom'
import GameStub from '../../games/GameStub'
import LevelSelector from '../../components/LevelSelector'
import WordScramble from '../../games/WordScramble'

export default function WordScramblePage(): JSX.Element {
  const [search] = useSearchParams()
  const lvl = Number(search.get('level') ?? '1')
  const level = Math.min(Math.max(1, lvl), 10)
  return (
    <div className="space-y-4">
      <LevelSelector />
      <WordScramble level={level} />
    </div>
  )
} 
