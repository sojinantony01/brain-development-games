/**
 * Central registry for all games in the application.
 * This is the single source of truth for game metadata.
 */

export interface GameMetadata {
  id: string
  name: string
  description: string
  category: 'memory' | 'logic' | 'attention' | 'speed' | 'spatial'
  maxLevel: number
}

export const GAME_REGISTRY: GameMetadata[] = [
  {
    id: 'water-jugs',
    name: 'Water Jugs',
    description: 'Solve logic puzzles by measuring exact amounts using different sized jugs. Improves problem-solving and planning skills.',
    category: 'logic',
    maxLevel: 10
  },
  {
    id: 'tower-of-hanoi',
    name: 'Tower of Hanoi',
    description: 'Move disks between pegs following specific rules. Classic recursive thinking and strategic planning exercise.',
    category: 'logic',
    maxLevel: 10
  },
  {
    id: 'ball-sort',
    name: 'Ball Sort Puzzle',
    description: 'Sort colored balls into tubes so each tube contains only one color. Develops logical thinking and planning skills.',
    category: 'logic',
    maxLevel: 10
  },
  {
    id: 'n-back',
    name: 'N-Back',
    description: 'Remember and match items from N steps back in a sequence. Scientifically proven to enhance working memory capacity.',
    category: 'memory',
    maxLevel: 10
  },
  {
    id: 'logic-puzzles',
    name: 'Logic Puzzles',
    description: 'Solve challenging logic and math puzzles that require step-by-step reasoning. Develops analytical thinking and problem-solving skills.',
    category: 'logic',
    maxLevel: 10
  },
  {
    id: 'stroop',
    name: 'Stroop Test',
    description: 'Name the color of words while ignoring their meaning. Trains cognitive control and selective attention.',
    category: 'attention',
    maxLevel: 10
  },
  {
    id: 'mental-rotation',
    name: 'Mental Rotation',
    description: 'Identify if rotated shapes match the original. Develops spatial reasoning and visualization abilities.',
    category: 'spatial',
    maxLevel: 10
  },
  {
    id: 'schulte-table',
    name: 'Schulte Table',
    description: 'Find numbers in sequence as fast as possible. Improves peripheral vision, focus, and reading speed.',
    category: 'attention',
    maxLevel: 10
  },
  {
    id: 'maze',
    name: 'Pathway Maze',
    description: 'Navigate through increasingly complex mazes. Enhances spatial planning and strategic thinking skills.',
    category: 'spatial',
    maxLevel: 10
  },
  {
    id: 'pattern-matrix',
    name: 'Pattern Matrix',
    description: 'Memorize and recreate visual patterns on a grid. Strengthens visual memory and pattern recognition.',
    category: 'memory',
    maxLevel: 10
  },
  {
    id: 'quick-math',
    name: 'Quick Math',
    description: 'Solve arithmetic problems under time pressure. Boosts mental calculation speed and numerical fluency.',
    category: 'speed',
    maxLevel: 10
  },
  {
    id: 'word-scramble',
    name: 'Word Scramble',
    description: 'Unscramble letters to form valid words. Enhances vocabulary, spelling, and verbal reasoning.',
    category: 'logic',
    maxLevel: 10
  },
  {
    id: 'simon-says',
    name: 'Simon Says',
    description: 'Remember and repeat increasingly long color sequences. Classic memory game that improves sequential recall.',
    category: 'memory',
    maxLevel: 10
  },
  {
    id: 'card-matching',
    name: 'Card Matching',
    description: 'Find matching pairs in a grid of face-down cards. Concentration game that trains visual memory and attention.',
    category: 'memory',
    maxLevel: 10
  },
  {
    id: 'reaction-time',
    name: 'Reaction Time',
    description: 'Click as fast as possible when the screen changes color. Measures and improves reflexes and response speed.',
    category: 'speed',
    maxLevel: 10
  },
  {
    id: 'number-sequence',
    name: 'Number Sequence',
    description: 'Identify patterns and predict the next number in sequences. Develops logical reasoning and pattern recognition.',
    category: 'logic',
    maxLevel: 10
  },
  {
    id: 'dual-task',
    name: 'Dual Task Challenge',
    description: 'Count shapes while solving math problems simultaneously. Tests divided attention and multitasking abilities.',
    category: 'attention',
    maxLevel: 10
  },
  {
    id: 'visual-search',
    name: 'Visual Search',
    description: 'Find target shapes among distractors as quickly as possible. Improves visual scanning and selective attention.',
    category: 'attention',
    maxLevel: 10
  },
  {
    id: 'anagram-solver',
    name: 'Anagram Solver',
    description: 'Rearrange letters to form words before time runs out. Enhances linguistic flexibility and problem-solving speed.',
    category: 'speed',
    maxLevel: 10
  },
  {
    id: 'trail-making',
    name: 'Trail Making',
    description: 'Connect numbers and letters in alternating sequence. Tests cognitive flexibility and task-switching ability.',
    category: 'attention',
    maxLevel: 10
  },
  {
    id: 'working-memory-grid',
    name: 'Working Memory Grid',
    description: 'Remember positions of highlighted cells on a grid. Trains spatial working memory and visual retention.',
    category: 'memory',
    maxLevel: 10
  }
]

// Helper functions for easy access
export const getGameById = (id: string): GameMetadata | undefined => {
  return GAME_REGISTRY.find(game => game.id === id)
}

export const getGameName = (id: string): string => {
  return getGameById(id)?.name ?? id
}

export const getAllGameIds = (): string[] => {
  return GAME_REGISTRY.map(game => game.id)
}

export const getGamesByCategory = (category: GameMetadata['category']): GameMetadata[] => {
  return GAME_REGISTRY.filter(game => game.category === category)
}

export const getTotalGames = (): number => {
  return GAME_REGISTRY.length
}

export const getMaxLevel = (): number => {
  return GAME_REGISTRY[0]?.maxLevel ?? 10
}

// Create a map for O(1) lookups
export const GAME_MAP = new Map(GAME_REGISTRY.map(game => [game.id, game]))

// Made with Bob
