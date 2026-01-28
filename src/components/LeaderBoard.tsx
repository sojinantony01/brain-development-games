import React, { useEffect, useState, useRef } from 'react'
import { getLeaderboard, resetLeaderboard, LeaderboardEntry } from '../lib/leaderboard'

const GAME_NAMES: Record<string, string> = {
  'water-jugs': 'Water Jugs',
  'tower-of-hanoi': 'Tower of Hanoi',
  'ball-sort': 'Ball Sort Puzzle',
  'n-back': 'N-Back',
  'stroop': 'Stroop Test',
  'mental-rotation': 'Mental Rotation',
  'schulte-table': 'Schulte Table',
  'maze': 'Pathway / Maze',
  'pattern-matrix': 'Pattern Matrix',
  'quick-math': 'Quick Math',
  'word-scramble': 'Word Scramble',
  'simon-says': 'Simon Says',
  'card-matching': 'Card Matching',
  'reaction-time': 'Reaction Time',
  'number-sequence': 'Number Sequence',
  'dual-task': 'Dual Task Challenge',
  'visual-search': 'Visual Search',
  'anagram-solver': 'Anagram Solver',
  'trail-making': 'Trail Making',
  'working-memory-grid': 'Working Memory Grid',
  'logic-puzzles': 'Logic Puzzles',
}

type Statistics = {
  totalGames: number
  averageScore: number
  averageLevel: number
  weightedScore: number
}

const calculateStatistics = (entries: LeaderboardEntry[], totalPossibleGames: number): Statistics => {
  if (entries.length === 0) {
    return { totalGames: 0, averageScore: 0, averageLevel: 0, weightedScore: 0 }
  }

  const TOTAL_POSSIBLE_GAMES = totalPossibleGames
  const totalGames = entries.length
  const totalLevel = entries.reduce((sum, e) => sum + e.level, 0)
  
  // Average score: percentage of completed games that were passed
  const completionRate = (totalGames / TOTAL_POSSIBLE_GAMES) * 100
  
  // Weighted score: considers both completion and performance
  // Each completed game contributes based on its normalized score and level
  const maxPossibleWeightedScore = entries.reduce((sum, e) => sum + e.level, 0)
  const actualWeightedScore = entries.reduce((sum, e) => {
    const normalizedScore = e.maxScore ? (e.score / e.maxScore) : (e.score / 100)
    return sum + (normalizedScore * e.level)
  }, 0)
  
  // Scale to 100 considering total possible games
  const weightedScore = (actualWeightedScore / maxPossibleWeightedScore) * completionRate

  return {
    totalGames,
    averageScore: Math.round(completionRate),
    averageLevel: Math.round((totalLevel / totalGames) * 10) / 10,
    weightedScore: Math.round(weightedScore)
  }
}

export default function LeaderBoard(): JSX.Element {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() => getLeaderboard(10))
  const [showCertificate, setShowCertificate] = useState(false)
  const [userName, setUserName] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const TOTAL_GAMES = Object.keys(GAME_NAMES).length
  const MAX_LEVEL = 10
  const TOTAL_POSSIBLE_COMPLETIONS = TOTAL_GAMES * MAX_LEVEL

  useEffect(() => {
    const handler = () => setEntries(getLeaderboard(10))
    window.addEventListener('leaderboard-updated', handler)
    return () => window.removeEventListener('leaderboard-updated', handler)
  }, [])

  const stats = calculateStatistics(entries, TOTAL_POSSIBLE_COMPLETIONS)

  const generateCertificate = () => {
    if (!userName.trim()) {
      alert('Please enter your name')
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 1200
    canvas.height = 900

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#667eea')
    gradient.addColorStop(1, '#764ba2')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // White border
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 20
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80)

    // Inner border
    ctx.strokeStyle = '#f0f0f0'
    ctx.lineWidth = 2
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120)

    // Title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 60px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Certificate of Achievement', canvas.width / 2, 140)

    // Subtitle
    ctx.font = '30px Arial'
    ctx.fillText('Brain Development Games', canvas.width / 2, 190)
    
    // Disclaimer
    ctx.font = 'italic 16px Arial'
    ctx.fillText('(For Entertainment & Personal Use Only)', canvas.width / 2, 220)

    // Name section
    ctx.font = 'italic 24px Arial'
    ctx.fillText('This certifies that', canvas.width / 2, 270)
    
    ctx.font = 'bold 48px Arial'
    ctx.fillText(userName, canvas.width / 2, 330)
    
    ctx.font = 'italic 24px Arial'
    ctx.fillText('has achieved the following accomplishments:', canvas.width / 2, 380)

    // Statistics section
    ctx.font = 'bold 22px Arial'
    ctx.fillText(`Overall Performance`, canvas.width / 2, 430)
    
    ctx.font = '20px Arial'
    ctx.fillText(`Games: ${stats.totalGames}/${TOTAL_POSSIBLE_COMPLETIONS} • Avg Level: ${stats.averageLevel}/${MAX_LEVEL} • Avg Score: ${stats.averageScore}%`, canvas.width / 2, 465)
    ctx.fillText(`Weighted Score: ${stats.weightedScore}/100`, canvas.width / 2, 495)

    // Top achievements
    ctx.font = 'bold 20px Arial'
    ctx.fillText('Top Achievements:', canvas.width / 2, 540)

    // Leaderboard entries
    ctx.font = '18px Arial'
    ctx.textAlign = 'left'
    let yPos = 575
    const maxEntries = Math.min(entries.length, 5)
    
    for (let i = 0; i < maxEntries; i++) {
      const entry = entries[i]
      const gameName = GAME_NAMES[entry.gameId] ?? entry.gameId
      const scoreText = entry.maxScore ? `${entry.score}/${entry.maxScore}` : `${entry.score}`
      const text = `${i + 1}. ${gameName} - Level ${entry.level} - Score: ${scoreText}`
      ctx.fillText(text, 180, yPos)
      yPos += 32
    }

    // Website link
    ctx.font = 'italic 20px Arial'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('https://sojinantony01.github.io/brain-development-games/', canvas.width / 2, canvas.height - 160)

    // Creator credit
    ctx.font = 'italic 18px Arial'
    ctx.fillText('By - Sojin Antony', canvas.width / 2, canvas.height - 125)

    // Date
    ctx.font = '18px Arial'
    ctx.fillText(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), canvas.width / 2, canvas.height - 95)
    
    // Legal disclaimer
    ctx.font = '11px Arial'
    ctx.fillStyle = '#d0d0d0'
    ctx.fillText('This certificate has no official or professional value and is for personal enjoyment only.', canvas.width / 2, canvas.height - 65)

    // Download the certificate
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `brain-games-certificate-${userName.replace(/\s+/g, '-').toLowerCase()}.png`
        a.click()
        URL.revokeObjectURL(url)
        setShowCertificate(false)
        setUserName('')
      }
    })
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold">Leaderboard</h3>
        <div className="flex gap-2">
          {entries.length > 0 && (
            <button
              className="text-sm text-blue-600 underline"
              onClick={() => setShowCertificate(true)}
            >
              Download Certificate
            </button>
          )}
          <button
            className="text-sm text-red-600 underline"
            onClick={() => {
              if (confirm('This will reset all progress and leaderboard data. Are you sure?')) {
                // Clear leaderboard
                resetLeaderboard()
                setEntries([])
                // Clear progress
                localStorage.removeItem('mind-arcade-progress')
                window.dispatchEvent(new Event('progress-updated'))
              }
            }}
          >
            Reset All
          </button>
        </div>
      </div>
      <p className="text-sm text-slate-500 mb-4 italic">
        💡 Complete all {TOTAL_GAMES} games across {MAX_LEVEL} levels each to achieve the best score!
      </p>

      {entries.length === 0 ? (
        <div className="text-sm text-slate-400 mt-4">No entries yet — play some games to appear here!</div>
      ) : (
        <>
          {/* Statistics Summary */}
          <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
            <h4 className="font-semibold text-indigo-900 mb-2">Your Performance</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <div className="text-slate-600">Games Played</div>
                <div className="text-xl font-bold text-indigo-600">{stats.totalGames}/{TOTAL_POSSIBLE_COMPLETIONS}</div>
                <div className="text-xs text-slate-500">{TOTAL_GAMES} games × {MAX_LEVEL} levels</div>
              </div>
              <div>
                <div className="text-slate-600">Avg Level</div>
                <div className="text-xl font-bold text-indigo-600">{stats.averageLevel}/10</div>
              </div>
              <div>
                <div className="text-slate-600">Avg Score</div>
                <div className="text-xl font-bold text-indigo-600">{stats.averageScore}%</div>
              </div>
              <div>
                <div className="text-slate-600">Weighted Score</div>
                <div className="text-xl font-bold text-indigo-600">{stats.weightedScore}/100</div>
              </div>
            </div>
          </div>

          {/* Leaderboard entries with max height and scroll */}
          <div className="max-h-96 overflow-y-auto">
            <ol className="list-decimal pl-6 space-y-2">
              {entries.map((e) => (
                <li key={e.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{GAME_NAMES[e.gameId] ?? e.gameId} — Level {e.level}</div>
                    <div className="text-sm text-slate-500">{new Date(e.when).toLocaleString()}</div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold">
                      {e.maxScore ? `${e.score}/${e.maxScore}` : e.score}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </>
      )}

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowCertificate(false)}>
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Generate Certificate</h3>
            <p className="text-sm text-slate-600 mb-4">
              Enter your name to generate a certificate with your achievements and statistics.
            </p>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-slate-300 rounded mb-4"
              onKeyPress={(e) => e.key === 'Enter' && generateCertificate()}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={generateCertificate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Generate & Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for certificate generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

// Made with Bob
