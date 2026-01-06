import React from 'react'
import { useSearchParams } from 'react-router-dom'
import GameStub from '../../games/GameStub'
import LevelSelector from '../../components/LevelSelector'
import MentalRotation from '../../games/MentalRotation'

export default function MentalRotationPage(): JSX.Element {
  const [search] = useSearchParams()
  const lvl = Number(search.get('level') ?? '1')
  const level = Math.min(Math.max(1, lvl), 10)
  return (
    <div className="space-y-4">
      <LevelSelector />
      <MentalRotation level={level} />
    </div>
  )
} 
