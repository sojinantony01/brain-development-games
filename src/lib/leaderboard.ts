export type LeaderboardEntry = {
  id: string
  gameId: string
  level: number
  score: number // Always 0-100
  maxScore?: number // Deprecated but kept for backward compatibility
  when: string
}

const STORAGE_KEY = 'mind-arcade-leaderboard'

const load = (): LeaderboardEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as LeaderboardEntry[]
  } catch (e) {
    console.error('Failed to parse leaderboard', e)
    return []
  }
}

const save = (entries: LeaderboardEntry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    window.dispatchEvent(new Event('leaderboard-updated'))
  } catch (e) {
    console.error('Failed to save leaderboard', e)
  }
}

export const getLeaderboard = (limit = 10): LeaderboardEntry[] => {
  const all = load()
  // Sort by score (0-100), then by level if scores are equal
  return all
    .sort((a, b) => {
      const scoreDiff = b.score - a.score
      return scoreDiff !== 0 ? scoreDiff : b.level - a.level
    })
    .slice(0, limit)
}

export const addLeaderboardEntry = (entry: Omit<LeaderboardEntry, 'id' | 'when'>): void => {
  const all = load()
  
  // Find existing entry for same game+level
  const existingIndex = all.findIndex(
    e => e.gameId === entry.gameId && e.level === entry.level
  )
  
  // Keep only the best score
  if (existingIndex !== -1) {
    if (entry.score <= all[existingIndex].score) {
      return // New score is not better, don't save
    }
    all.splice(existingIndex, 1) // Remove old score
  }
  
  // Add new entry
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    when: new Date().toISOString()
  }
  all.push(newEntry)
  save(all)
}

export const resetLeaderboard = (): void => {
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event('leaderboard-updated'))
}
