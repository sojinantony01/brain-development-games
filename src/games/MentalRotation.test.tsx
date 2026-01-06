import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import MentalRotation from './MentalRotation'

test('renders mental rotation and answers', () => {
  render(<MentalRotation level={1} />)
  expect(screen.getByText(/Mental Rotation/i)).toBeInTheDocument()
  const sameBtn = screen.getByText(/Same/i)
  fireEvent.click(sameBtn)
  expect(screen.getByText(/Score:/i)).toBeInTheDocument()
})
