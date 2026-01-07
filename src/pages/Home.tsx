import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllProgress, resetAllProgress, type ProgressState } from '../lib/progress'

export type GameMeta = {
  id: string
  name: string
  description: string
}

const GAMES: GameMeta[] = [
  { id: 'water-jugs', name: 'Water Jugs', description: 'Logic & resource management.' },
  { id: 'tower-of-hanoi', name: 'Tower of Hanoi', description: 'Recursive planning.' },
  { id: 'n-back', name: 'N-Back', description: 'Working memory challenge.' },
  { id: 'stroop', name: 'Stroop Test', description: 'Inhibition control.' },
  { id: 'mental-rotation', name: 'Mental Rotation', description: 'Spatial reasoning.' },
  { id: 'schulte-table', name: 'Schulte Table', description: 'Peripheral vision & speed.' },
  { id: 'maze', name: 'Pathway / Maze', description: 'Strategic forecasting.' },
  { id: 'pattern-matrix', name: 'Pattern Matrix', description: 'Visual memory.' },
  { id: 'quick-math', name: 'Quick Math', description: 'Numerical agility.' },
  { id: 'word-scramble', name: 'Word Scramble', description: 'Verbal fluency.' },
]

export default function Home(): JSX.Element {
  const [selected, setSelected] = useState<string>(GAMES[0].id)
  const navigate = useNavigate()
  const [progress, setProgress] = useState<ProgressState>(() => getAllProgress())

  // lazy import the leaderboard component to avoid adding it to every page bundle
  const LeaderboardComponent = React.lazy(() => import('../components/LeaderBoard'))

  useEffect(() => {
    const handler = () => setProgress(getAllProgress())
    window.addEventListener('progress-updated', handler)
    return () => window.removeEventListener('progress-updated', handler)
  }, [])

  function startGame(): void {
    navigate(`/games/${selected}`)
  }

  function handleReset(): void {
    resetAllProgress()
    setProgress({})
  }

  return (
    <div className="space-y-8">
      <section className="bg-white p-8 rounded shadow">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-4">Brain Development Games</h2>
            <p className="mb-4">Play a collection of ten cognitive games designed to improve memory, planning, and calculation.</p>

            <div className="flex gap-4">
              <select
                className="border p-2 rounded flex-1"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                {GAMES.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>

              <button
                onClick={startGame}
                className="bg-indigo-600 text-white px-6 py-3 rounded text-lg font-semibold"
              >
                Play
              </button>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-slate-500 mb-2">Progress is saved locally (your browser).</div>
            <button className="text-sm text-red-600 underline" onClick={handleReset}>Reset Progress</button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {GAMES.map((g) => (
            <article key={g.id} className="bg-white p-6 rounded shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{g.name}</h3>
                  <p className="text-slate-600">{g.description}</p>
                </div>

                <div>
                  {progress[g.id]?.bestLevel ? (
                    <div className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded">Best Level: {progress[g.id].bestLevel}</div>
                  ) : (
                    <div className="text-sm text-slate-400">No progress</div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigate(`/games/${g.id}`)}
                  className="text-indigo-600 underline"
                >
                  Open
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside>
          {/* Leaderboard */}
          <div className="sticky top-6">
            <div className="mb-4">
              {/* lazy load component to keep bundle small */}
              <React.Suspense fallback={<div>Loading leaderboard…</div>}>
                <LeaderboardComponent />
              </React.Suspense>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
