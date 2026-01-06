import React from 'react'
import { useSearchParams } from 'react-router-dom'
import GameStub from '../../games/GameStub'
import LevelSelector from '../../components/LevelSelector'
import Maze from '../../games/Maze'

export default function MazePage(): JSX.Element {
  const [search] = useSearchParams()
  const lvl = Number(search.get('level') ?? '1')
  const level = Math.min(Math.max(1, lvl), 10)
  return (
    <div className="space-y-4">
      <LevelSelector />
      <Maze level={level} />
    </div>
  )
} 
