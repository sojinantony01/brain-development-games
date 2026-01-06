import React, { useEffect, useState } from 'react'
import { getLeaderboard, resetLeaderboard, LeaderboardEntry } from '../lib/leaderboard'

const GAME_NAMES: Record<string, string> = {
  'water-jugs': 'Water Jugs',
  'tower-of-hanoi': 'Tower of Hanoi',
  'n-back': 'N-Back',
  'stroop': 'Stroop Test',
  'mental-rotation': 'Mental Rotation',
  'schulte-table': 'Schulte Table',
  'maze': 'Pathway / Maze',
  'pattern-matrix': 'Pattern Matrix',
  'quick-math': 'Quick Math',
  'word-scramble': 'Word Scramble',
}

export default function LeaderBoard(): JSX.Element {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() => getLeaderboard(10))

  useEffect(() => {
    const handler = () => setEntries(getLeaderboard(10))
    window.addEventListener('leaderboard-updated', handler)
    return () => window.removeEventListener('leaderboard-updated', handler)
  }, [])

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Leaderboard</h3>
        <button className="text-sm text-red-600 underline" onClick={() => { resetLeaderboard(); setEntries([]) }}>Reset</button>
      </div>

      {entries.length === 0 ? (
        <div className="text-sm text-slate-400 mt-4">No entries yet — play some games to appear here!</div>
      ) : (
        <ol className="mt-4 list-decimal pl-6 space-y-2">
          {entries.map((e) => (
            <li key={e.id} className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{GAME_NAMES[e.gameId] ?? e.gameId} — Level {e.level}</div>
                <div className="text-sm text-slate-500">{new Date(e.when).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{e.score}</div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
