import { getAllProgress, markGameCompletedLevel, resetAllProgress, getGameProgress } from './progress'

beforeEach(() => {
  resetAllProgress()
})

test('marking and reading progress', () => {
  expect(getAllProgress()).toEqual({})
  markGameCompletedLevel('water-jugs', 2)
  const p = getGameProgress('water-jugs')
  expect(p).toBeDefined()
  expect(p?.bestLevel).toBe(2)

  // mark higher level
  markGameCompletedLevel('water-jugs', 4)
  expect(getGameProgress('water-jugs')?.bestLevel).toBe(4)
})

test('resetAllProgress clears data', () => {
  markGameCompletedLevel('water-jugs', 3)
  expect(getAllProgress()['water-jugs']).toBeDefined()
  resetAllProgress()
  expect(getAllProgress()['water-jugs']).toBeUndefined()
})
