import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllProgress, resetAllProgress, type ProgressState } from '../lib/progress'
import { GAME_REGISTRY, getTotalGames, getMaxLevel } from '../lib/gameRegistry'

export default function Home(): JSX.Element {
  const [selected, setSelected] = useState<string>(GAME_REGISTRY[0].id)
  const navigate = useNavigate()
  const [progress, setProgress] = useState<ProgressState>(() => getAllProgress())

  // lazy import the leaderboard component to avoid adding it to every page bundle
  const LeaderboardComponent = React.lazy(() => import('../components/LeaderBoard'))

  useEffect(() => {
    const handler = () => setProgress(getAllProgress())
    window.addEventListener('progress-updated', handler)
    return () => window.removeEventListener('progress-updated', handler)
  }, [])

  const startGame = (): void => {
    navigate(`/games/${selected}`)
  }

  const handleReset = (): void => {
    resetAllProgress()
    setProgress({})
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-white p-8 rounded shadow" aria-label="Game selection">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4 text-slate-900">Brain Development Games</h1>
            <p className="mb-4 text-lg text-slate-700">
              Play a collection of <strong>{getTotalGames()} cognitive training games</strong> designed to improve <strong>memory</strong>, <strong>planning</strong>, <strong>attention</strong>, and <strong>problem-solving skills</strong>.
              Each game offers {getMaxLevel()} progressive difficulty levels to challenge and enhance your cognitive abilities.
            </p>

            <div className="flex gap-4">
              <select
                className="border p-2 rounded flex-1"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                {GAME_REGISTRY.map((g) => (
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

      {/* Benefits Section */}
      <section className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">Why Play Brain Training Games?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-semibold text-lg mb-2 text-indigo-700">🧠 Improve Memory</h3>
            <p className="text-slate-600">Enhance working memory, visual memory, and sequential recall through scientifically-designed exercises.</p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-semibold text-lg mb-2 text-purple-700">⚡ Boost Attention</h3>
            <p className="text-slate-600">Train selective attention, focus, and cognitive control with engaging challenges.</p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-semibold text-lg mb-2 text-pink-700">🎯 Enhance Problem-Solving</h3>
            <p className="text-slate-600">Develop logical reasoning, strategic planning, and analytical thinking skills.</p>
          </div>
        </div>
      </section>

      {/* Games List Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4" role="list" aria-label="Available brain training games">
          {GAME_REGISTRY.map((g) => (
            <article key={g.id} className="bg-white p-6 rounded shadow hover:shadow-lg transition-shadow" role="listitem">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-slate-900 mb-2">{g.name}</h3>
                  <p className="text-slate-600 leading-relaxed">{g.description}</p>
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

        <aside aria-label="Leaderboard and progress tracking">
          <div className="sticky top-6">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Leaderboard</h2>
            <div className="mb-4">
              <React.Suspense fallback={<div className="text-slate-500">Loading leaderboard…</div>}>
                <LeaderboardComponent />
              </React.Suspense>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
