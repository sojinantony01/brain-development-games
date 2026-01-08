import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
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
import SimonSaysPage from './pages/games/SimonSaysPage'
import CardMatchingPage from './pages/games/CardMatchingPage'
import ReactionTimePage from './pages/games/ReactionTimePage'
import NumberSequencePage from './pages/games/NumberSequencePage'
import DualTaskPage from './pages/games/DualTaskPage'
import VisualSearchPage from './pages/games/VisualSearchPage'
import AnagramSolverPage from './pages/games/AnagramSolverPage'
import TrailMakingPage from './pages/games/TrailMakingPage'
import WorkingMemoryGridPage from './pages/games/WorkingMemoryGridPage'

export default function App(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-600 text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Brain Development Games</h1>
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
          <Route path="/games/simon-says" element={<SimonSaysPage />} />
          <Route path="/games/card-matching" element={<CardMatchingPage />} />
          <Route path="/games/reaction-time" element={<ReactionTimePage />} />
          <Route path="/games/number-sequence" element={<NumberSequencePage />} />
          <Route path="/games/dual-task" element={<DualTaskPage />} />
          <Route path="/games/visual-search" element={<VisualSearchPage />} />
          <Route path="/games/anagram-solver" element={<AnagramSolverPage />} />
          <Route path="/games/trail-making" element={<TrailMakingPage />} />
          <Route path="/games/working-memory-grid" element={<WorkingMemoryGridPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="bg-slate-200 text-slate-700 p-4 text-center">
        © Brain Development Games — <a href="https://sojinantony01.github.io/brain-development-games" className="underline">Live demo</a>
        <div className="text-sm mt-1">By - Sojin Antony</div>
      </footer>
    </div>
  )
}
