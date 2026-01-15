export type LeaderboardEntry = {
  id: string
  gameId: string
  level: number
  score: number
  maxScore?: number
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
  return all.sort((a, b) => b.score - a.score).slice(0, limit)
}

export const addLeaderboardEntry = (entry: Omit<LeaderboardEntry, 'id' | 'when'>): void => {
  const all = load()
  
  // Remove any existing entries for the same game and level (keep only the latest)
  const filtered = all.filter(e => !(e.gameId === entry.gameId && e.level === entry.level))
  
  const e: LeaderboardEntry = { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, when: new Date().toISOString() }
  filtered.push(e)
  save(filtered)
}

export const resetLeaderboard = (): void => {
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event('leaderboard-updated'))
}
