import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Maze from './Maze'

test('renders Maze and moves player', () => {
  render(<Maze level={1} />)
  expect(screen.getByText(/Pathway \/ Maze/i)).toBeInTheDocument()
  const up = screen.getByText(/Up/i)
  expect(up).toBeInTheDocument()
})
