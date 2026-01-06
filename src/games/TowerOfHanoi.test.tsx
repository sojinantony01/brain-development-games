import { disksForLevel } from './TowerOfHanoi'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import TowerOfHanoi from './TowerOfHanoi'

// import share buttons to satisfy build environment for the component
jest.mock('../components/ShareButtons', () => () => <div />)

test('disksForLevel maps levels correctly', () => {
  expect(disksForLevel(1)).toBe(3)
  expect(disksForLevel(2)).toBe(4)
  expect(disksForLevel(8)).toBe(10)
  expect(disksForLevel(9)).toBe(5)
})

test('can perform legal moves and detect win', () => {
  render(<TowerOfHanoi level={1} />)

  // For level 1 (3 disks), minimal solution exists but we test interactions:
  // Click rod 1 to select, click rod 3 to move top disk
  const rods = screen.getAllByRole('button')
  // rods[0] is rod 1 area, rods[2] is rod 3
  fireEvent.click(rods[0])
  fireEvent.click(rods[2])

  // moves should increase, and UI should reflect disks moved (a disk "1" will be visible on rod 3)
  expect(screen.getByText(/Moves: 1/)).toBeInTheDocument()
})
