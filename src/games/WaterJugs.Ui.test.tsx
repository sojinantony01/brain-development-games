import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import WaterJugs from './WaterJugs'

test('fill and pour between jugs', () => {
  render(<WaterJugs level={1} />)

  // Fill Jug 2 (capacity 5)
  const fillButtons = screen.getAllByText(/Fill/i)
  fireEvent.click(fillButtons[1])

  // Now Jug 2 should show 5L
  expect(screen.getByText(/5L \/ 5L/)).toBeInTheDocument()

  // Pour Jug 2 -> Jug 1 (3L capacity): Jug1=3 Jug2=2
  const pourButton = screen.getByText(/Jug 2 → 1/i)
  fireEvent.click(pourButton)

  expect(screen.getByText(/3L \/ 3L/)).toBeInTheDocument()
  expect(screen.getByText(/2L \/ 5L/)).toBeInTheDocument()
})
