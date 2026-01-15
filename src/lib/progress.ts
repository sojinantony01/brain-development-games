export type GameProgress = {
  bestLevel: number
  completedLevels: number[]
  bestScore?: number
}

export type ProgressState = Record<string, GameProgress>

const STORAGE_KEY = 'mind-arcade-progress'

const loadState = (): ProgressState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as ProgressState
  } catch (e) {
    console.error('Failed to parse progress state', e)
    return {}
  }
}

const saveState = (state: ProgressState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    // notify other parts of the app
    window.dispatchEvent(new Event('progress-updated'))
  } catch (e) {
    console.error('Failed to save progress state', e)
  }
}

export const getAllProgress = (): ProgressState => {
  return loadState()
}

export const getGameProgress = (gameId: string): GameProgress | undefined => {
  const s = loadState()
  return s[gameId]
}

import { addLeaderboardEntry } from './leaderboard'

export const markGameCompletedLevel = (gameId: string, level: number, score?: number, maxScore?: number): void => {
  const s = loadState()
  const prev = s[gameId] ?? { bestLevel: 0, completedLevels: [] }
  const bestLevel = Math.max(prev.bestLevel, level)
  const completedLevels = Array.from(new Set([...prev.completedLevels, level])).sort((a, b) => a - b)
  const bestScore = score !== undefined ? Math.max(prev.bestScore ?? 0, score) : prev.bestScore
  s[gameId] = { bestLevel, completedLevels, bestScore }
  saveState(s)

  // add to leaderboard if score provided
  if (score !== undefined) {
    try {
      addLeaderboardEntry({ gameId, level, score, maxScore })
    } catch (e) {
      console.error('Could not add leaderboard entry', e)
    }
  }
}

export const resetAllProgress = (): void => {
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event('progress-updated'))
}
