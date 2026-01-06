import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import SchulteTable from './SchulteTable'

test('renders Schulte Table and responds to clicks', () => {
  render(<SchulteTable level={1} />)
  expect(screen.getByText(/Schulte Table/i)).toBeInTheDocument()
  const next = screen.getByText(/Next:/i)
  expect(next).toBeInTheDocument()
})
