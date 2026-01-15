import React, { useEffect, useState, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type ReactionTimeProps = {
  level: number
}

const ReactionTime = ({ level }: ReactionTimeProps): JSX.Element => {
  const [phase, setPhase] = useState<'ready' | 'wait' | 'click' | 'result'>('ready')
  const [startTime, setStartTime] = useState<number>(0)
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [attempts, setAttempts] = useState<number[]>([])
  const [completed, setCompleted] = useState(false)
  const saved = useRef(false)
  const timeoutRef = useRef<number | null>(null)
  
  const target = Math.max(5, level + 2)
  const avgThreshold = Math.max(500 - level * 30, 200)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    setAttempts([])
    setCompleted(false)
    saved.current = false
    setPhase('ready')
  }, [level])

  const startTest = (): void => {
    setPhase('wait')
    const delay = Math.random() * 3000 + 1000
    timeoutRef.current = window.setTimeout(() => {
      setStartTime(Date.now())
      setPhase('click')
    }, delay)
  }

  const handleClick = (): void => {
    if (phase === 'ready') {
      startTest()
      return
    }

    if (phase === 'wait') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setPhase('result')
      setReactionTime(null)
      alert('Too early! Wait for the green signal.')
      setPhase('ready')
      return
    }

    if (phase === 'click') {
      const time = Date.now() - startTime
      setReactionTime(time)
      const newAttempts = [...attempts, time]
      setAttempts(newAttempts)
      setPhase('result')

      if (newAttempts.length >= target) {
        const avg = newAttempts.reduce((a, b) => a + b, 0) / newAttempts.length
        if (!saved.current && avg <= avgThreshold) {
          const score = Math.round(1000 / avg * 100)
          markGameCompletedLevel('reaction-time', level, score, 100)
          saved.current = true
          setCompleted(true)
        }
      }
    }
  }

  const avgTime = attempts.length > 0
    ? attempts.reduce((a, b) => a + b, 0) / attempts.length
    : null

  return (
    <>
      <CelebrationAnimation show={completed} />
      <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-red-700 flex items-center justify-center gap-3">
            ⚡ Lightning Reflexes
            <span className="text-2xl bg-red-100 px-4 py-1 rounded-full">Level {level}</span>
          </h2>
          <p className="text-lg text-slate-600 mt-2">Click as fast as you can when it turns green! 🟢</p>
        </div>

        <div className="mb-6 flex gap-4 justify-center flex-wrap text-lg font-bold">
          <div className="bg-white px-6 py-3 rounded-xl shadow-md">
            <span className="text-blue-600">🎯 Attempts:</span> <span className="text-2xl text-blue-700">{attempts.length}/{target}</span>
          </div>
          <div className="bg-white px-6 py-3 rounded-xl shadow-md">
            <span className="text-orange-600">🎪 Target:</span> <span className="text-2xl text-orange-700">{'<'}{avgThreshold}ms</span>
          </div>
          {avgTime && (
            <div className="bg-white px-6 py-3 rounded-xl shadow-md">
              <span className="text-green-600">✨ Your Avg:</span> <span className="text-2xl text-green-700">{avgTime.toFixed(0)}ms</span>
            </div>
          )}
        </div>

        <div
          onClick={handleClick}
          className={`h-80 rounded-2xl flex flex-col items-center justify-center cursor-pointer text-white text-4xl font-black transition-all transform hover:scale-105 shadow-2xl ${
            phase === 'ready' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
            phase === 'wait' ? 'bg-gradient-to-br from-red-500 to-pink-600 animate-pulse' :
            phase === 'click' ? 'bg-gradient-to-br from-green-500 to-emerald-600 ring-8 ring-green-300' :
            'bg-gradient-to-br from-slate-300 to-slate-400'
          }`}
        >
          {phase === 'ready' && (
            <>
              <div className="text-6xl mb-4">👆</div>
              <div>Click to Start!</div>
            </>
          )}
          {phase === 'wait' && (
            <>
              <div className="text-6xl mb-4">⏳</div>
              <div>Wait for it...</div>
            </>
          )}
          {phase === 'click' && (
            <>
              <div className="text-6xl mb-4 animate-bounce">🎯</div>
              <div>CLICK NOW!</div>
            </>
          )}
          {phase === 'result' && reactionTime && (
            <>
              <div className="text-6xl mb-4">⚡</div>
              <div className="text-7xl text-yellow-300">{reactionTime}ms</div>
            </>
          )}
        </div>

        {phase === 'result' && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setPhase('ready')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              🔄 Try Again
            </button>
          </div>
        )}

        {attempts.length > 0 && (
          <div className="mt-6 bg-white p-4 rounded-xl shadow-md">
            <div className="text-lg font-bold text-indigo-700 mb-2">📊 Recent Times:</div>
            <div className="flex gap-2 flex-wrap justify-center">
              {attempts.slice(-5).map((t, idx) => (
                <span key={idx} className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-bold">
                  {t}ms
                </span>
              ))}
            </div>
          </div>
        )}

        {completed && (
          <div className="mt-6 p-6 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-xl shadow-lg border-4 border-emerald-300">
            <div className="text-3xl font-bold text-center mb-2">🎉 Lightning Fast! Level {level} completed! 🎉</div>
            <div className="text-xl text-center mb-4">Average: <span className="font-bold text-2xl">{avgTime?.toFixed(0)}ms</span></div>
            <div className="flex justify-center">
              <NextLevelButton currentLevel={level} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ReactionTime
