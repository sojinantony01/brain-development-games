import React from 'react'
import { useSearchParams } from 'react-router-dom'
import LevelSelector from '../../components/LevelSelector'
import HowToPlay from '../../components/HowToPlay'
import { GAME_INSTRUCTIONS } from '../../lib/gameInstructions'
import DualTask from '../../games/DualTask'

export default function DualTaskPage(): JSX.Element {
  const [search] = useSearchParams()
  const lvl = Number(search.get('level') ?? '1')
  const level = Math.min(Math.max(1, lvl), 10)
  const instructions = GAME_INSTRUCTIONS['dual-task']

  return (
    <div className="space-y-4">
      <LevelSelector />
      <HowToPlay 
        title={instructions.title}
        instructions={instructions.instructions}
        tips={instructions.tips}
      />
      <DualTask level={level} />
    </div>
  )
}
