import { configForLevel } from './WaterJugs'

// mock share buttons for tests
jest.mock('../components/ShareButtons', () => () => <div />)

test('configForLevel returns small capacities for level 1', () => {
  const cfg = configForLevel(1)
  expect(cfg.capacities).toEqual([3,5])
  expect(cfg.target).toBe(4)
})

test('configForLevel level 5 returns primes', () => {
  const cfg = configForLevel(5)
  expect(cfg.capacities).toEqual([7,13])
})

test('configForLevel level 8 returns three buckets', () => {
  const cfg = configForLevel(8)
  expect(cfg.capacities.length).toBe(3)
})
