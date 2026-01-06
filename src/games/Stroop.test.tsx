import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Stroop from './Stroop'

test('renders Stroop and can press buttons', () => {
  render(<Stroop level={1} />)
  expect(screen.getByText(/Stroop Test/i)).toBeInTheDocument()
  const btn = screen.getByText(/Red|Blue|Green|Yellow/i)
  fireEvent.click(btn)
  expect(screen.getByText(/Score:/i)).toBeInTheDocument()
})
