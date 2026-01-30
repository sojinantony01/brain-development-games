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
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Hero Section */}
      <section className="bg-white p-4 sm:p-6 lg:p-8 rounded shadow" aria-label="Game selection">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
          <div className="flex-1 w-full">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-slate-900">Brain Development Games</h1>
            <p className="mb-4 text-base sm:text-lg text-slate-700">
              Play a collection of <strong>{getTotalGames()} cognitive training games</strong> designed to improve <strong>memory</strong>, <strong>planning</strong>, <strong>attention</strong>, and <strong>problem-solving skills</strong>.
              Each game offers {getMaxLevel()} progressive difficulty levels to challenge and enhance your cognitive abilities.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <select
                className="border p-2 sm:p-3 rounded flex-1 text-base"
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
                className="bg-indigo-600 text-white px-6 py-3 rounded text-base sm:text-lg font-semibold hover:bg-indigo-700 transition-colors w-full sm:w-auto"
              >
                Play
              </button>
            </div>
          </div>

          <div className="text-left lg:text-right w-full lg:w-auto mt-4 lg:mt-0">
            <div className="text-xs sm:text-sm text-slate-500 mb-2">Progress is saved locally (your browser).</div>
            <button className="text-xs sm:text-sm text-red-600 underline hover:text-red-800" onClick={handleReset}>Reset Progress</button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-slate-900">Why Play Brain Training Games?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white p-3 sm:p-4 rounded shadow-sm">
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-indigo-700">🧠 Improve Memory</h3>
            <p className="text-sm sm:text-base text-slate-600">Enhance working memory, visual memory, and sequential recall through scientifically-designed exercises.</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded shadow-sm">
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-purple-700">⚡ Boost Attention</h3>
            <p className="text-sm sm:text-base text-slate-600">Train selective attention, focus, and cognitive control with engaging challenges.</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded shadow-sm">
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-pink-700">🎯 Enhance Problem-Solving</h3>
            <p className="text-sm sm:text-base text-slate-600">Develop logical reasoning, strategic planning, and analytical thinking skills.</p>
          </div>
        </div>
      </section>

      {/* Games List Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-3 sm:space-y-4" role="list" aria-label="Available brain training games">
          {GAME_REGISTRY.map((g) => (
            <article key={g.id} className="bg-white p-4 sm:p-6 rounded shadow hover:shadow-lg transition-shadow" role="listitem">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="flex-1 w-full">
                  <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-2">{g.name}</h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{g.description}</p>
                </div>

                <div className="w-full sm:w-auto">
                  {progress[g.id]?.bestLevel ? (
                    <div className="text-xs sm:text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded whitespace-nowrap">Best Level: {progress[g.id].bestLevel}</div>
                  ) : (
                    <div className="text-xs sm:text-sm text-slate-400">No progress</div>
                  )}
                </div>
              </div>

              <div className="mt-3 sm:mt-4 flex gap-2">
                <button
                  onClick={() => navigate(`/games/${g.id}`)}
                  className="text-sm sm:text-base text-indigo-600 underline hover:text-indigo-800"
                >
                  Open
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside aria-label="Leaderboard and progress tracking" className="lg:sticky lg:top-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-slate-900">Leaderboard</h2>
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
