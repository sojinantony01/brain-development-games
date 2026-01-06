import React from 'react'
import { render, screen } from '@testing-library/react'
import WordScramble from './WordScramble'

test('renders Word Scramble', () => {
  render(<WordScramble level={1} />)
  expect(screen.getByText(/Word Scramble/i)).toBeInTheDocument()
  expect(screen.getByText(/Score:/i)).toBeInTheDocument()
})
