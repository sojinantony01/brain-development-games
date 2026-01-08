import React from 'react'
import { useSearchParams } from 'react-router-dom'
import LevelSelector from '../../components/LevelSelector'
import HowToPlay from '../../components/HowToPlay'
import { GAME_INSTRUCTIONS } from '../../lib/gameInstructions'
import MentalRotation from '../../games/MentalRotation'

export default function MentalRotationPage(): JSX.Element {
  const [search] = useSearchParams()
  const lvl = Number(search.get('level') ?? '1')
  const level = Math.min(Math.max(1, lvl), 10)
  const instructions = GAME_INSTRUCTIONS['mental-rotation']

  return (
    <div className="space-y-4">
      <LevelSelector />
      <HowToPlay 
        title={instructions.title}
        instructions={instructions.instructions}
        tips={instructions.tips}
      />
      <MentalRotation level={level} />
    </div>
  )
}

// Made with Bob
