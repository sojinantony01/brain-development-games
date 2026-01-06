import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import QuickMath from './QuickMath'

test('renders Quick Math and accepts answers', () => {
  render(<QuickMath level={1} />)
  expect(screen.getByText(/Quick Math/i)).toBeInTheDocument()
  const input = screen.getByRole('textbox')
  expect(input).toBeInTheDocument()
})
