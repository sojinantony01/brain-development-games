import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import NBack from './NBack'

test('renders NBack and starts sequence', () => {
  render(<NBack level={1} />)
  expect(screen.getByText(/N-Back/i)).toBeInTheDocument()
  const start = screen.getByText(/Start/i)
  fireEvent.click(start)
  expect(screen.getByText(/Score:/i)).toBeInTheDocument()
})
