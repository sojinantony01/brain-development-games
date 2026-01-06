import React from 'react'
import { useSearchParams } from 'react-router-dom'
import WaterJugs from '../../games/WaterJugs'

import LevelSelector from '../../components/LevelSelector'

export default function WaterJugsPage(): JSX.Element {
  const [search] = useSearchParams()
  const lvl = Number(search.get('level') ?? '1')
  const level = Math.min(Math.max(1, lvl), 10)

  return (
    <div className="space-y-4">
      <LevelSelector />
      <WaterJugs level={level} />
    </div>
  )
}
