import React from 'react'
import { useSearchParams } from 'react-router-dom'
import LogicPuzzles from '../../games/LogicPuzzles'
import LevelSelector from '../../components/LevelSelector'
import HowToPlay from '../../components/HowToPlay'
import { GAME_INSTRUCTIONS } from '../../lib/gameInstructions'

const LogicPuzzlesPage = (): JSX.Element => {
  const [searchParams] = useSearchParams()
  const level = Number(searchParams.get('level')) || 1
  const instructions = GAME_INSTRUCTIONS['logic-puzzles']

  return (
    <div className="space-y-6">
      <LevelSelector />
      <HowToPlay
        title={instructions.title}
        instructions={instructions.instructions}
        tips={instructions.tips}
      />
      <LogicPuzzles level={level} />
    </div>
  )
}

export default LogicPuzzlesPage

// Made with Bob
