import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PatternMatrix from './PatternMatrix'

test('renders Pattern Matrix and can replay and submit', () => {
  render(<PatternMatrix level={1} />)
  expect(screen.getByText(/Pattern Matrix/i)).toBeInTheDocument()
  const replay = screen.getByText(/Replay/i)
  fireEvent.click(replay)
  const submit = screen.getByText(/Submit/i)
  expect(submit).toBeInTheDocument()
})
