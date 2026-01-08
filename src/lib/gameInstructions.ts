export interface GameInstructions {
  title: string
  instructions: string[]
  tips?: string[]
}

export const GAME_INSTRUCTIONS: Record<string, GameInstructions> = {
  'water-jugs': {
    title: 'Water Jugs',
    instructions: [
      'You have two jugs with different capacities and need to measure an exact target amount',
      'Click "Fill" to fill a jug to its maximum capacity',
      'Click "Empty" to empty a jug completely',
      'Click "Pour" to transfer water from one jug to another',
      'The goal is to get the exact target amount in one of the jugs',
      'Complete the puzzle in the minimum number of moves to score higher'
    ],
    tips: [
      'Think ahead - plan your moves before executing',
      'Sometimes you need to empty jugs to make progress',
      'The solution often involves filling and pouring multiple times'
    ]
  },
  'tower-of-hanoi': {
    title: 'Tower of Hanoi',
    instructions: [
      'Move all disks from the left peg to the right peg',
      'Click on a peg to select it, then click another peg to move the top disk',
      'You can only move one disk at a time',
      'A larger disk cannot be placed on top of a smaller disk',
      'Try to complete the puzzle in the minimum number of moves',
      'The optimal solution requires 2^n - 1 moves (where n is the number of disks)'
    ],
    tips: [
      'Start by moving the smallest disk',
      'Think recursively - solve for smaller subproblems',
      'The middle peg is your temporary storage'
    ]
  },
  'n-back': {
    title: 'N-Back',
    instructions: [
      'Watch the sequence of letters/numbers appearing on screen',
      'Press the button when the current item matches the one from N positions back',
      'For 1-back: match if current item equals the previous item',
      'For 2-back: match if current item equals the item 2 positions ago',
      'Higher levels increase the N value, making it more challenging',
      'Score points for correct matches and avoid false positives'
    ],
    tips: [
      'Focus and maintain concentration throughout',
      'Mentally rehearse the sequence as it appears',
      'Don\'t rush - accuracy is more important than speed'
    ]
  },
  'stroop': {
    title: 'Stroop Test',
    instructions: [
      'Words will appear on screen in different colors',
      'Your task is to identify the COLOR of the text, not the word itself',
      'Click the button matching the text color',
      'Ignore what the word says - focus only on its color',
      'Answer as quickly and accurately as possible',
      'Higher levels add more color options and time pressure'
    ],
    tips: [
      'Train yourself to focus on color, not meaning',
      'Take a brief moment to process before clicking',
      'Practice improves your cognitive control over time'
    ]
  },
  'mental-rotation': {
    title: 'Mental Rotation',
    instructions: [
      'You\'ll see a reference shape and a rotated shape',
      'Determine if the rotated shape is the same as the reference (just rotated)',
      'Or if it\'s a mirror image (flipped)',
      'Click "Same" if it\'s just rotated, "Different" if it\'s mirrored',
      'Higher levels use more complex shapes and rotations',
      'Visualize rotating the shape in your mind'
    ],
    tips: [
      'Mentally rotate the shape step by step',
      'Look for distinctive features to track',
      'Practice improves your spatial visualization speed'
    ]
  },
  'schulte-table': {
    title: 'Schulte Table',
    instructions: [
      'Numbers are randomly arranged in a grid',
      'Click the numbers in sequential order (1, 2, 3, etc.)',
      'Use your peripheral vision to locate numbers',
      'Try to complete the sequence as fast as possible',
      'Higher levels have larger grids with more numbers',
      'Your time is recorded for each level'
    ],
    tips: [
      'Don\'t focus on one spot - scan with peripheral vision',
      'Develop a systematic scanning pattern',
      'Regular practice significantly improves speed'
    ]
  },
  'maze': {
    title: 'Pathway Maze',
    instructions: [
      'Navigate from the start (green) to the goal (red)',
      'Use arrow keys or click adjacent cells to move',
      'You cannot move through walls (black cells)',
      'Plan your route before moving',
      'Higher levels have larger and more complex mazes',
      'Complete in fewer moves for a higher score'
    ],
    tips: [
      'Look ahead and plan your entire route',
      'Sometimes the shortest path isn\'t obvious',
      'If stuck, backtrack and try a different route'
    ]
  },
  'pattern-matrix': {
    title: 'Pattern Matrix',
    instructions: [
      'Study the pattern of highlighted cells in the grid',
      'Memorize the positions during the display time',
      'After the pattern disappears, recreate it by clicking cells',
      'Click cells to toggle them on/off',
      'Submit when you think you\'ve recreated the pattern',
      'Higher levels have more cells to remember'
    ],
    tips: [
      'Look for patterns or shapes in the arrangement',
      'Group cells mentally (rows, columns, clusters)',
      'Visualize the pattern even after it disappears'
    ]
  },
  'quick-math': {
    title: 'Quick Math',
    instructions: [
      'Solve arithmetic problems as quickly as possible',
      'Type your answer and press Enter or click Submit',
      'Problems include addition, subtraction, multiplication, and division',
      'Higher levels have more complex calculations',
      'You have limited time per problem',
      'Accuracy and speed both contribute to your score'
    ],
    tips: [
      'Practice mental math techniques',
      'For multiplication, break down into simpler parts',
      'Stay calm - rushing leads to mistakes'
    ]
  },
  'word-scramble': {
    title: 'Word Scramble',
    instructions: [
      'Letters are scrambled - rearrange them to form a valid word',
      'Type your answer and press Enter or click Submit',
      'Click "Skip" if you can\'t solve the current word',
      'Higher levels use longer and more difficult words',
      'You have limited time per word',
      'Score points for each correct word'
    ],
    tips: [
      'Look for common letter patterns (ing, tion, etc.)',
      'Try rearranging vowels and consonants separately',
      'Sound out possible combinations'
    ]
  },
  'simon-says': {
    title: 'Simon Says',
    instructions: [
      'Watch the sequence of colored buttons light up',
      'Memorize the order of the colors',
      'Repeat the sequence by clicking the buttons in the same order',
      'Each round adds one more color to the sequence',
      'Higher levels have longer sequences and faster playback',
      'One mistake ends the game'
    ],
    tips: [
      'Focus intently during the demonstration',
      'Mentally rehearse the sequence',
      'Associate colors with positions or patterns'
    ]
  },
  'card-matching': {
    title: 'Card Matching',
    instructions: [
      'All cards start face-down',
      'Click a card to flip it over',
      'Click a second card to find its match',
      'If they match, they stay face-up',
      'If they don\'t match, they flip back over',
      'Find all pairs to complete the level',
      'Higher levels have more cards to match'
    ],
    tips: [
      'Remember the positions of cards you\'ve seen',
      'Develop a systematic flipping strategy',
      'Focus on one area at a time'
    ]
  },
  'reaction-time': {
    title: 'Reaction Time Test',
    instructions: [
      'Wait for the screen to turn green',
      'Click as fast as possible when it changes color',
      'Your reaction time is measured in milliseconds',
      'Complete multiple attempts per level',
      'Don\'t click before it turns green (false start)',
      'Higher levels require faster average reaction times'
    ],
    tips: [
      'Stay focused and ready to click',
      'Don\'t anticipate - wait for the color change',
      'Relax your hand to react faster'
    ]
  },
  'number-sequence': {
    title: 'Number Sequence Finder',
    instructions: [
      'Study the sequence of numbers shown',
      'Identify the pattern (arithmetic, geometric, etc.)',
      'Enter the next number that should come in the sequence',
      'Patterns can be addition, multiplication, Fibonacci, or more complex',
      'Higher levels have more difficult patterns',
      'You have limited time to solve each sequence'
    ],
    tips: [
      'Look for differences between consecutive numbers',
      'Check if numbers are doubling, tripling, etc.',
      'Consider multiple operations (add then multiply)'
    ]
  },
  'dual-task': {
    title: 'Dual Task Challenge',
    instructions: [
      'Two tasks appear simultaneously on screen',
      'Count the number of specific shapes shown',
      'Solve the math problem displayed',
      'Enter both answers before time runs out',
      'Both answers must be correct to score',
      'Higher levels have more complex tasks'
    ],
    tips: [
      'Quickly scan for shapes first',
      'Solve the math problem while counting',
      'Practice dividing your attention effectively'
    ]
  },
  'visual-search': {
    title: 'Visual Search',
    instructions: [
      'Find all target shapes among the distractors',
      'The target shape is shown at the top',
      'Click on each target shape you find',
      'Avoid clicking on distractor shapes',
      'Find all targets as quickly as possible',
      'Higher levels have more items and targets'
    ],
    tips: [
      'Scan systematically (left to right, top to bottom)',
      'Use peripheral vision to spot targets',
      'Don\'t rush - accuracy matters'
    ]
  },
  'anagram-solver': {
    title: 'Anagram Solver',
    instructions: [
      'Letters are scrambled - form a valid word',
      'Type your answer and press Enter',
      'Click "Skip" if you can\'t solve it',
      'Higher levels have longer words and time limits',
      'Each correct answer scores points',
      'Time pressure increases with level'
    ],
    tips: [
      'Look for common prefixes and suffixes',
      'Try different vowel placements',
      'Think of word categories (animals, objects, etc.)'
    ]
  },
  'trail-making': {
    title: 'Trail Making',
    instructions: [
      'Connect circles in the correct sequence',
      'Early levels: connect numbers in order (1-2-3...)',
      'Later levels: alternate between numbers and letters (1-A-2-B-3-C...)',
      'Click circles in sequence to draw the trail',
      'Complete the trail as quickly as possible',
      'Mistakes add time penalties'
    ],
    tips: [
      'Plan your path before starting',
      'Look ahead to the next few items',
      'Practice improves task-switching speed'
    ]
  },
  'working-memory-grid': {
    title: 'Working Memory Grid',
    instructions: [
      'Watch as cells in the grid light up briefly',
      'Memorize the positions of all highlighted cells',
      'After they disappear, click the cells that were highlighted',
      'Click cells to toggle them on/off',
      'Submit when you\'ve selected all the correct positions',
      'Higher levels have larger grids and more cells to remember'
    ],
    tips: [
      'Look for patterns in the positions',
      'Group nearby cells mentally',
      'Visualize the grid layout after it disappears'
    ]
  }
}

// Made with Bob
