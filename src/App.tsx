import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import WaterJugsPage from './pages/games/WaterJugsPage'
import TowerOfHanoiPage from './pages/games/TowerOfHanoiPage'
import NBackPage from './pages/games/NBackPage'
import StroopPage from './pages/games/StroopPage'
import MentalRotationPage from './pages/games/MentalRotationPage'
import SchulteTablePage from './pages/games/SchulteTablePage'
import MazePage from './pages/games/MazePage'
import PatternMatrixPage from './pages/games/PatternMatrixPage'
import QuickMathPage from './pages/games/QuickMathPage'
import WordScramblePage from './pages/games/WordScramblePage'

export default function App(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-600 text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">The Mind Arcade</h1>
          <div className="space-x-4">
            <Link to="/" className="underline">
              Home
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games/water-jugs" element={<WaterJugsPage />} />
          <Route path="/games/tower-of-hanoi" element={<TowerOfHanoiPage />} />
          <Route path="/games/n-back" element={<NBackPage />} />
          <Route path="/games/stroop" element={<StroopPage />} />
          <Route path="/games/mental-rotation" element={<MentalRotationPage />} />
          <Route path="/games/schulte-table" element={<SchulteTablePage />} />
          <Route path="/games/maze" element={<MazePage />} />
          <Route path="/games/pattern-matrix" element={<PatternMatrixPage />} />
          <Route path="/games/quick-math" element={<QuickMathPage />} />
          <Route path="/games/word-scramble" element={<WordScramblePage />} />
        </Routes>
      </main>

      <footer className="bg-slate-200 text-slate-700 p-4 text-center">
        © The Mind Arcade — <a href="https://sojinantony01.github.io/brain-development-games" className="underline">Live demo</a>
      </footer>
    </div>
  )
}
