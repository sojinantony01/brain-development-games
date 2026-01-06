import React from 'react'

export type GameStubProps = {
  name: string
  description: string
  level: number
}

export default function GameStub({ name, description, level }: GameStubProps): JSX.Element {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">{name} (Level {level})</h2>
      <p className="text-slate-600 mb-4">{description}</p>
      <div className="p-4 border rounded">This is a placeholder stage for <strong>{name}</strong>. Gameplay will scale by level.</div>
    </div>
  )
}
