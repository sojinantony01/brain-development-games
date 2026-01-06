import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

test('renders home and game list', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  expect(screen.getByText(/The Mind Arcade/i)).toBeInTheDocument()
  expect(screen.getByText(/Water Jugs/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Play/i })).toBeInTheDocument()
  expect(screen.getByText(/Reset Progress/i)).toBeInTheDocument()
})
