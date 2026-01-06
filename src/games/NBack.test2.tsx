import { render, screen, fireEvent, act } from '@testing-library/react'
import React from 'react'
import NBack from './NBack'
import { resetAllProgress, getGameProgress } from '../lib/progress'

beforeEach(() => resetAllProgress())

test('reaching target score saves progress', () => {
  jest.useFakeTimers && jest.useFakeTimers()
  render(<NBack level={1} />)
  const start = screen.getByText(/Start/i)
  fireEvent.click(start)
  // artificially press Match multiple times to increase score
  const match = screen.getByText(/Match/i)
  for (let i = 0; i < 4; i++) fireEvent.click(match)
  // allow effects to process
  act(() => {})
  const p = getGameProgress('n-back')
  expect(p).toBeDefined()
  jest.useRealTimers && jest.useRealTimers()
})