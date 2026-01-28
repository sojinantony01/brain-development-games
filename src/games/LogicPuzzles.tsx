import React, { useEffect, useState, useRef } from 'react'
import { markGameCompletedLevel } from '../lib/progress'
import NextLevelButton from '../components/NextLevelButton'
import CelebrationAnimation from '../components/CelebrationAnimation'

export type LogicPuzzlesProps = {
  level: number
}

type Puzzle = {
  question: string
  answer: number
  hint?: string
  explanation: string
}

// Multiple puzzle variations per level for randomization
const puzzleVariations: Record<number, Puzzle[]> = {
  1: [{
    question: "A mysterious box has 3 buttons: Red, Blue, and Green.\n\n• Pressing Red multiplies the number inside by 2\n• Pressing Blue adds 5 to the number\n• Pressing Green subtracts 3 from the number\n\nThe box starts with the number 7. You press the buttons in this order: Red, Blue, Red, Green.\n\nWhat number is in the box now?",
    answer: 35,
    hint: "💡 Follow step by step: Start=7, Red(×2)=14, Blue(+5)=19, Red(×2)=38, Green(-3)=35",
    explanation: "Starting number: 7\n\n🔴 Step 1 - Press Red (×2): 7 × 2 = 14\n🔵 Step 2 - Press Blue (+5): 14 + 5 = 19\n🔴 Step 3 - Press Red (×2): 19 × 2 = 38\n🟢 Step 4 - Press Green (-3): 38 - 3 = 35\n\n✅ Final answer: 35"
  },
  {
    question: "A magic calculator has 3 special buttons:\n\n• Button A: Adds 8 to the number\n• Button B: Multiplies the number by 3\n• Button C: Subtracts 5 from the number\n\nStarting with 4, you press: Button B, Button A, Button C, Button B.\n\nWhat's the final number?",
    answer: 45,
    hint: "💡 Step by step: Start=4, B(×3)=12, A(+8)=20, C(-5)=15, B(×3)=45",
    explanation: "Starting number: 4\n\n🔵 Step 1 - Button B (×3): 4 × 3 = 12\n🅰️ Step 2 - Button A (+8): 12 + 8 = 20\n🔴 Step 3 - Button C (-5): 20 - 5 = 15\n🔵 Step 4 - Button B (×3): 15 × 3 = 45\n\n✅ Final answer: 45"
  },
  {
    question: "A number machine has 4 operations:\n\n• Operation 1: Double the number\n• Operation 2: Add 10\n• Operation 3: Subtract 7\n• Operation 4: Multiply by 2\n\nStarting with 5, you perform: Op1, Op2, Op3, Op4.\n\nWhat's the result?",
    answer: 26,
    hint: "💡 Calculate: 5 → ×2 → 10 → +10 → 20 → -7 → 13 → ×2 → 26",
    explanation: "Starting: 5\n\n⚡ Op1 (×2): 5 × 2 = 10\n⚡ Op2 (+10): 10 + 10 = 20\n⚡ Op3 (-7): 20 - 7 = 13\n⚡ Op4 (×2): 13 × 2 = 26\n\n✅ Answer: 26"
  }],
  2: [{
    question: "A clock tower rings bells in a special pattern:\n\n• At 1 o'clock, it rings 1 time\n• At 2 o'clock, it rings 3 times (1+2)\n• At 3 o'clock, it rings 6 times (1+2+3)\n• At 4 o'clock, it rings 10 times (1+2+3+4)\n\nThis pattern continues. How many times will the clock ring at 8 o'clock?",
    answer: 36,
    hint: "💡 The pattern is triangular numbers: 1, 3, 6, 10, 15, 21, 28, 36. Each is the sum of numbers from 1 to n.",
    explanation: "The pattern shows triangular numbers:\n\n🕐 1 o'clock: 1 = 1\n🕑 2 o'clock: 1+2 = 3\n🕒 3 o'clock: 1+2+3 = 6\n🕓 4 o'clock: 1+2+3+4 = 10\n🕔 5 o'clock: 1+2+3+4+5 = 15\n🕕 6 o'clock: 1+2+3+4+5+6 = 21\n🕖 7 o'clock: 1+2+3+4+5+6+7 = 28\n🕗 8 o'clock: 1+2+3+4+5+6+7+8 = 36\n\n📐 Formula: n(n+1)/2, where n=8: 8×9/2 = 36\n\n✅ Answer: 36"
  },
  {
    question: "A fountain sprays water in a pattern:\n\n• At minute 1: 2 sprays\n• At minute 2: 5 sprays (2+3)\n• At minute 3: 9 sprays (2+3+4)\n• At minute 4: 14 sprays (2+3+4+5)\n\nHow many sprays at minute 7?",
    answer: 35,
    hint: "💡 Sum from 2 to 8: 2+3+4+5+6+7+8 = 35",
    explanation: "Pattern shows sum of consecutive numbers starting from 2:\n\n💧 Minute 1: 2 = 2\n💧 Minute 2: 2+3 = 5\n💧 Minute 3: 2+3+4 = 9\n💧 Minute 4: 2+3+4+5 = 14\n💧 Minute 5: 2+3+4+5+6 = 20\n💧 Minute 6: 2+3+4+5+6+7 = 27\n💧 Minute 7: 2+3+4+5+6+7+8 = 35\n\n✅ Answer: 35"
  },
  {
    question: "A staircase has a special pattern:\n\n• Step 1: 1 block\n• Step 2: 4 blocks (1+3)\n• Step 3: 9 blocks (1+3+5)\n• Step 4: 16 blocks (1+3+5+7)\n\nHow many blocks for Step 6?",
    answer: 36,
    hint: "💡 Sum of first n odd numbers = n². For step 6: 6² = 36",
    explanation: "Pattern is sum of consecutive odd numbers:\n\n🪜 Step 1: 1 = 1² = 1\n🪜 Step 2: 1+3 = 2² = 4\n🪜 Step 3: 1+3+5 = 3² = 9\n🪜 Step 4: 1+3+5+7 = 4² = 16\n🪜 Step 5: 1+3+5+7+9 = 5² = 25\n🪜 Step 6: 1+3+5+7+9+11 = 6² = 36\n\n✅ Answer: 36"
  }],
  3: [{
    question: "A baker makes cookies with a special recipe:\n\n• Batch 1: She uses 2 cups of flour and makes 12 cookies\n• Batch 2: She uses 3 cups of flour and makes 18 cookies\n• Batch 3: She uses 5 cups of flour and makes 30 cookies\n\nNotice the pattern in flour amounts: 2, 3, 5 (Fibonacci sequence).\n\nFor Batch 4, she uses 8 cups of flour (next Fibonacci number). How many cookies does she make?",
    answer: 48,
    hint: "💡 Each cup of flour makes 6 cookies. With 8 cups: 8 × 6 = 48 cookies",
    explanation: "Looking at the pattern:\n\n🍪 Batch 1: 2 cups → 12 cookies (12÷2 = 6 cookies per cup)\n🍪 Batch 2: 3 cups → 18 cookies (18÷3 = 6 cookies per cup)\n🍪 Batch 3: 5 cups → 30 cookies (30÷5 = 6 cookies per cup)\n\nThe ratio is constant: 6 cookies per cup of flour.\n\n📊 Fibonacci sequence: 2, 3, 5, 8, 13, 21...\n\n🍪 Batch 4: 8 cups × 6 cookies/cup = 48 cookies\n\n✅ Answer: 48 cookies"
  },
  {
    question: "A chef makes pizzas following Fibonacci:\n\n• Day 1: 1 pizza, uses 8 ingredients\n• Day 2: 1 pizza, uses 8 ingredients\n• Day 3: 2 pizzas, use 16 ingredients\n• Day 4: 3 pizzas, use 24 ingredients\n\nOn Day 6 (following Fibonacci: 1,1,2,3,5,8), how many ingredients?",
    answer: 64,
    hint: "💡 Day 6 = 8 pizzas × 8 ingredients = 64",
    explanation: "Fibonacci sequence for pizzas:\n\n🍕 Day 1: 1 pizza × 8 = 8 ingredients\n🍕 Day 2: 1 pizza × 8 = 8 ingredients\n🍕 Day 3: 2 pizzas × 8 = 16 ingredients\n🍕 Day 4: 3 pizzas × 8 = 24 ingredients\n🍕 Day 5: 5 pizzas × 8 = 40 ingredients\n🍕 Day 6: 8 pizzas × 8 = 64 ingredients\n\n✅ Answer: 64"
  },
  {
    question: "A library adds books in Fibonacci pattern:\n\n• Week 1: 3 books, 15 pages each\n• Week 2: 5 books, 15 pages each\n• Week 3: 8 books, 15 pages each\n\nFollowing Fibonacci (3,5,8,13,21), how many total pages in Week 5?",
    answer: 315,
    hint: "💡 Week 5 = 21 books × 15 pages = 315",
    explanation: "Fibonacci for books:\n\n📚 Week 1: 3 books × 15 = 45 pages\n📚 Week 2: 5 books × 15 = 75 pages\n📚 Week 3: 8 books × 15 = 120 pages\n📚 Week 4: 13 books × 15 = 195 pages\n📚 Week 5: 21 books × 15 = 315 pages\n\n✅ Answer: 315"
  }],
  4: [{
    question: "A train travels through 5 tunnels. Each tunnel has a special property:\n\n• Tunnel 1: The train's speed increases by 10 km/h\n• Tunnel 2: The train's speed doubles\n• Tunnel 3: The train's speed increases by 15 km/h\n• Tunnel 4: The train's speed is multiplied by 1.5\n• Tunnel 5: The train's speed increases by 20 km/h\n\nThe train starts at 20 km/h. What is its speed after exiting Tunnel 5? (Round to nearest whole number)",
    answer: 133,
    hint: "💡 Calculate step by step: 20 → +10 → 30 → ×2 → 60 → +15 → 75 → ×1.5 → 112.5 → +20 → 132.5",
    explanation: "Starting speed: 20 km/h\n\n🚂 Tunnel 1 (+10): 20 + 10 = 30 km/h\n🚂 Tunnel 2 (×2): 30 × 2 = 60 km/h\n🚂 Tunnel 3 (+15): 60 + 15 = 75 km/h\n🚂 Tunnel 4 (×1.5): 75 × 1.5 = 112.5 km/h\n🚂 Tunnel 5 (+20): 112.5 + 20 = 132.5 km/h\n\n📐 Rounded to nearest whole number: 133 km/h\n\n✅ Answer: 133 km/h"
  },
  {
    question: "A rocket passes through 4 zones:\n\n• Zone 1: Speed increases by 15 km/h\n• Zone 2: Speed triples\n• Zone 3: Speed increases by 25 km/h\n• Zone 4: Speed multiplies by 1.7\n\nStarting at 10 km/h, what's the final speed? (Round to nearest whole)",
    answer: 170,
    hint: "💡 10 → +15 → 25 → ×3 → 75 → +25 → 100 → ×1.7 → 170",
    explanation: "Starting: 10 km/h\n\n🚀 Zone 1 (+15): 10 + 15 = 25 km/h\n🚀 Zone 2 (×3): 25 × 3 = 75 km/h\n🚀 Zone 3 (+25): 75 + 25 = 100 km/h\n🚀 Zone 4 (×1.7): 100 × 1.7 = 170 km/h\n\n✅ Answer: 170 km/h"
  },
  {
    question: "A car goes through 5 checkpoints:\n\n• Point 1: Speed +12 km/h\n• Point 2: Speed ×2\n• Point 3: Speed +18 km/h\n• Point 4: Speed ×1.5\n• Point 5: Speed +10 km/h\n\nStarting at 15 km/h, final speed? (Round to nearest whole)",
    answer: 118,
    hint: "💡 15 → +12 → 27 → ×2 → 54 → +18 → 72 → ×1.5 → 108 → +10 → 118",
    explanation: "Starting: 15 km/h\n\n🚗 Point 1 (+12): 15 + 12 = 27 km/h\n🚗 Point 2 (×2): 27 × 2 = 54 km/h\n🚗 Point 3 (+18): 54 + 18 = 72 km/h\n🚗 Point 4 (×1.5): 72 × 1.5 = 108 km/h\n🚗 Point 5 (+10): 108 + 10 = 118 km/h\n\n✅ Answer: 118 km/h"
  }],
  5: [{
    question: "A farmer has a magical chicken that lays eggs with a special pattern:\n\n• Day 1: The chicken lays 1 egg\n• Day 2: The chicken lays 2 eggs\n• Day 3: The chicken lays 4 eggs\n• Each day, the chicken lays twice as many eggs as the previous day\n\nThe farmer sells eggs at the market every 3 days. On day 7, after collecting eggs, how many eggs does the farmer have in total?",
    answer: 64,
    hint: "💡 Remember: The farmer SELLS all eggs every 3 days!\n• Days 1-3: Collect eggs, then sell on day 3\n• Days 4-6: Collect eggs, then sell on day 6\n• Day 7: Only the eggs from day 7 remain!\n\nWhat does the chicken lay on day 7?",
    explanation: "📊 Day-by-day breakdown:\n\n• Day 1: Lays 1 egg → Total: 1 egg\n• Day 2: Lays 2 eggs → Total: 3 eggs\n• Day 3: Lays 4 eggs → Total: 7 eggs → 🛒 SELLS ALL at market → Total: 0 eggs\n\n• Day 4: Lays 8 eggs → Total: 8 eggs\n• Day 5: Lays 16 eggs → Total: 24 eggs\n• Day 6: Lays 32 eggs → Total: 56 eggs → 🛒 SELLS ALL at market → Total: 0 eggs\n\n• Day 7: Lays 64 eggs → Total: 64 eggs ✓\n\n🎯 Answer: 64 eggs\n\n📐 Pattern: Each day doubles (2^n), but selling every 3 days resets the count!"
  },
  {
    question: "A magical tree grows apples:\n\n• Day 1: 2 apples\n• Day 2: 4 apples\n• Day 3: 8 apples\n• Doubles each day\n\nA merchant buys all apples every 4 days. On day 9, how many apples on the tree?",
    answer: 256,
    hint: "💡 Merchant buys on days 4 and 8. Day 9 is fresh: 2^8 = 256",
    explanation: "Pattern: 2^n apples on day n\n\n🍎 Days 1-4: 2,4,8,16 → Sold on day 4 → 0\n🍎 Days 5-8: 32,64,128,256 → Sold on day 8 → 0\n🍎 Day 9: 2^8 = 256 apples (fresh)\n\n✅ Answer: 256"
  },
  {
    question: "A magic plant grows berries:\n\n• Hour 1: 3 berries\n• Hour 2: 6 berries\n• Hour 3: 12 berries\n• Doubles each hour\n\nA bird eats all berries every 3 hours. At hour 8, how many berries?",
    answer: 384,
    hint: "💡 Bird eats at hours 3,6. Hour 7: 3×2^6=192. Hour 8: 192×2=384",
    explanation: "Pattern: 3×2^(n-1) berries at hour n\n\n🫐 Hours 1-3: 3,6,12 → Eaten at hour 3 → 0\n🫐 Hours 4-6: 24,48,96 → Eaten at hour 6 → 0\n🫐 Hour 7: 3×2^6 = 192 berries\n🫐 Hour 8: 192×2 = 384 berries\n\n✅ Answer: 384"
  }],
  6: [{
    question: "A magical garden has flowers that grow in a special pattern:\n\n• Week 1: 3 flowers bloom\n• Week 2: 7 flowers bloom (3 + 4)\n• Week 3: 15 flowers bloom (7 + 8)\n• Week 4: 31 flowers bloom (15 + 16)\n\nEach week, the number of new flowers equals the previous week's total plus a power of 2.\n\nHow many flowers bloom in Week 5?",
    answer: 63,
    hint: "💡 Pattern: add 4, then 8, then 16, then 32. So 31 + 32 = 63",
    explanation: "Looking at the pattern:\n\n🌸 Week 1: 3 flowers\n🌸 Week 2: 3 + 4 = 7 flowers (added 2²)\n🌸 Week 3: 7 + 8 = 15 flowers (added 2³)\n🌸 Week 4: 15 + 16 = 31 flowers (added 2⁴)\n🌸 Week 5: 31 + 32 = 63 flowers (added 2⁵)\n\nAlternatively, notice: 3=2²-1, 7=2³-1, 15=2⁴-1, 31=2⁵-1, 63=2⁶-1\n\n✅ Answer: 63 flowers"
  },
  {
    question: "A crystal grows in powers of 3:\n\n• Day 1: 2 units\n• Day 2: 5 units (2+3)\n• Day 3: 14 units (5+9)\n• Day 4: 41 units (14+27)\n\nEach day adds 3^n. What size on Day 6?",
    answer: 365,
    hint: "💡 Day 5: 41+81=122. Day 6: 122+243=365",
    explanation: "Pattern: add 3^n each day\n\n💎 Day 1: 2\n💎 Day 2: 2+3 = 5 (added 3^1)\n💎 Day 3: 5+9 = 14 (added 3^2)\n💎 Day 4: 14+27 = 41 (added 3^3)\n💎 Day 5: 41+81 = 122 (added 3^4)\n💎 Day 6: 122+243 = 365 (added 3^5)\n\n✅ Answer: 365"
  },
  {
    question: "A magical pond has lily pads:\n\n• Week 1: 4 pads\n• Week 2: 12 pads (4+8)\n• Week 3: 28 pads (12+16)\n• Week 4: 60 pads (28+32)\n\nAdding powers of 2. How many in Week 6?",
    answer: 252,
    hint: "💡 Week 5: 60+64=124. Week 6: 124+128=252",
    explanation: "Pattern: add 2^(n+2)\n\n🪷 Week 1: 4\n🪷 Week 2: 4+8 = 12 (added 2^3)\n🪷 Week 3: 12+16 = 28 (added 2^4)\n🪷 Week 4: 28+32 = 60 (added 2^5)\n🪷 Week 5: 60+64 = 124 (added 2^6)\n🪷 Week 6: 124+128 = 252 (added 2^7)\n\n✅ Answer: 252"
  }],
  7: [{
    question: "A treasure chest has 4 locks. Each lock has a 3-digit code:\n\n• Lock 1 code: The sum of digits equals 15, and all digits are different\n• Lock 2 code: The product of digits equals 24\n• Lock 3 code: The middle digit is the average of the first and last digits\n• Lock 4 code: All three digits form an arithmetic sequence with difference 2\n\nIf Lock 1 is 159, Lock 2 is 346, Lock 3 is 135, what is Lock 4?\n\n(Enter the 3-digit code for Lock 4)",
    answer: 246,
    hint: "💡 Arithmetic sequence with difference 2: Could be 135, 246, 357, 468, etc. Which one makes sense?",
    explanation: "Lock 4 requires an arithmetic sequence with difference 2.\n\nPossible sequences:\n🔒 135: 1, 3, 5 (difference of 2) ✓\n🔒 246: 2, 4, 6 (difference of 2) ✓\n🔒 357: 3, 5, 7 (difference of 2) ✓\n🔒 468: 4, 6, 8 (difference of 2) ✓\n\nSince Lock 3 is already 135, and we need a different code for Lock 4, the next logical sequence is 246.\n\n✅ Answer: 246"
  },
  {
    question: "A safe has 4 locks with 3-digit codes:\n\n• Lock 1: Digits sum to 12, all different\n• Lock 2: Product of digits = 36\n• Lock 3: Middle digit = average of outer digits\n• Lock 4: Arithmetic sequence, difference 3\n\nIf Lock 1=147, Lock 2=226, Lock 3=246, what's Lock 4?",
    answer: 369,
    hint: "💡 Difference 3: 147, 258, 369, 147... Lock 3 is 246, so Lock 4 could be 369",
    explanation: "Lock 4 needs arithmetic sequence with difference 3:\n\n🔐 147: 1,4,7 (diff 3) ✓\n🔐 258: 2,5,8 (diff 3) ✓\n🔐 369: 3,6,9 (diff 3) ✓\n\nLock 3 is 246 (not arithmetic), so Lock 4 = 369\n\n✅ Answer: 369"
  },
  {
    question: "A vault has 4 combination locks:\n\n• Lock 1: Sum = 18, all different\n• Lock 2: Product = 48\n• Lock 3: Digits form geometric sequence (×2)\n• Lock 4: Arithmetic sequence, difference 1\n\nIf Lock 1=369, Lock 2=346, Lock 3=124, what's Lock 4?",
    answer: 345,
    hint: "💡 Difference 1: 123, 234, 345, 456... Lock 3 is 124, so Lock 4 = 345",
    explanation: "Lock 4 needs arithmetic sequence with difference 1:\n\n🔒 123: 1,2,3 (diff 1) ✓\n🔒 234: 2,3,4 (diff 1) ✓\n🔒 345: 3,4,5 (diff 1) ✓\n\nLock 3 is 124 (geometric), so Lock 4 = 345\n\n✅ Answer: 345"
  }],
  8: [{
    question: "A scientist has 3 beakers with magical liquids:\n\n• Beaker A starts with 100ml\n• Beaker B starts with 50ml\n• Beaker C starts with 25ml\n\nShe performs these operations:\n1. Pour half of Beaker A into Beaker B\n2. Pour one-third of Beaker B into Beaker C\n3. Pour 20ml from Beaker C back into Beaker A\n\nHow much liquid is in Beaker B now? (Round to nearest ml)",
    answer: 67,
    hint: "💡 Step by step: A=100→50, B=50→100→67, C=25→58→38",
    explanation: "Initial state:\n🧪 Beaker A: 100ml\n🧪 Beaker B: 50ml\n🧪 Beaker C: 25ml\n\nOperation 1 - Pour half of A into B:\n🧪 Beaker A: 100 - 50 = 50ml\n🧪 Beaker B: 50 + 50 = 100ml\n🧪 Beaker C: 25ml\n\nOperation 2 - Pour one-third of B into C:\n🧪 Beaker A: 50ml\n🧪 Beaker B: 100 - 33.33 = 66.67ml\n🧪 Beaker C: 25 + 33.33 = 58.33ml\n\nOperation 3 - Pour 20ml from C into A:\n🧪 Beaker A: 50 + 20 = 70ml\n🧪 Beaker B: 66.67ml\n🧪 Beaker C: 58.33 - 20 = 38.33ml\n\n✅ Beaker B rounded: 67ml"
  },
  {
    question: "A chemist has 3 flasks:\n\n• Flask X: 80ml\n• Flask Y: 60ml\n• Flask Z: 40ml\n\nOperations:\n1. Pour 1/4 of X into Y\n2. Pour 1/2 of Y into Z\n3. Pour 15ml from Z into X\n\nHow much in Flask Y? (Round to nearest ml)",
    answer: 40,
    hint: "💡 X=80→60→75, Y=60→80→40, Z=40→80→65",
    explanation: "Initial:\n🧪 X: 80ml, Y: 60ml, Z: 40ml\n\nOp1 - 1/4 of X to Y:\n🧪 X: 80-20=60ml\n🧪 Y: 60+20=80ml\n🧪 Z: 40ml\n\nOp2 - 1/2 of Y to Z:\n🧪 X: 60ml\n🧪 Y: 80-40=40ml\n🧪 Z: 40+40=80ml\n\nOp3 - 15ml Z to X:\n🧪 X: 60+15=75ml\n🧪 Y: 40ml (unchanged)\n🧪 Z: 80-15=65ml\n\n✅ Answer: 40ml"
  },
  {
    question: "A lab has 3 containers:\n\n• Container 1: 120ml\n• Container 2: 80ml\n• Container 3: 40ml\n\nSteps:\n1. Pour 1/3 of Container 1 into 2\n2. Pour 1/4 of Container 2 into 3\n3. Pour 25ml from 3 to 1\n\nHow much in Container 2? (Round)",
    answer: 90,
    hint: "💡 C1=120→80, C2=80→120→90, C3=40→70→45",
    explanation: "Initial:\n⚗️ C1: 120ml, C2: 80ml, C3: 40ml\n\nStep1 - 1/3 C1 to C2:\n⚗️ C1: 120-40=80ml\n⚗️ C2: 80+40=120ml\n⚗️ C3: 40ml\n\nStep2 - 1/4 C2 to C3:\n⚗️ C1: 80ml\n⚗️ C2: 120-30=90ml\n⚗️ C3: 40+30=70ml\n\nStep3 - 25ml C3 to C1:\n⚗️ C1: 80+25=105ml\n⚗️ C2: 90ml\n⚗️ C3: 70-25=45ml\n\n✅ Answer: 90ml"
  }],
  9: [{
    question: "A time traveler visits 6 different years. In each year, she collects coins:\n\n• Year 1: She collects 5 coins\n• Year 2: She collects 11 coins (5 + 6)\n• Year 3: She collects 23 coins (11 + 12)\n• Year 4: She collects 47 coins (23 + 24)\n\nThe pattern continues: each year she collects the previous total plus double the year number.\n\nHow many coins does she collect in Year 6?",
    answer: 191,
    hint: "💡 Year 5: 47 + 48 = 95. Year 6: 95 + 96 = 191",
    explanation: "Following the pattern:\n\n🪙 Year 1: 5 coins\n🪙 Year 2: 5 + 6 = 11 coins (added 2×3)\n🪙 Year 3: 11 + 12 = 23 coins (added 2×6)\n🪙 Year 4: 23 + 24 = 47 coins (added 2×12)\n🪙 Year 5: 47 + 48 = 95 coins (added 2×24)\n🪙 Year 6: 95 + 96 = 191 coins (added 2×48)\n\nThe pattern shows we're adding double the previous addition each time.\n\n✅ Answer: 191 coins"
  },
  {
    question: "An explorer visits 5 islands collecting gems:\n\n• Island 1: 7 gems\n• Island 2: 15 gems (7+8)\n• Island 3: 31 gems (15+16)\n• Island 4: 63 gems (31+32)\n\nPattern: add double previous addition. How many on Island 6?",
    answer: 255,
    hint: "💡 Island 5: 63+64=127. Island 6: 127+128=255",
    explanation: "Pattern analysis:\n\n💎 Island 1: 7\n💎 Island 2: 7+8=15 (added 8)\n💎 Island 3: 15+16=31 (added 16)\n💎 Island 4: 31+32=63 (added 32)\n💎 Island 5: 63+64=127 (added 64)\n💎 Island 6: 127+128=255 (added 128)\n\nAlternatively: 2^n - 1\n\n✅ Answer: 255"
  },
  {
    question: "A wizard collects crystals over 6 days:\n\n• Day 1: 3 crystals\n• Day 2: 9 crystals (3+6)\n• Day 3: 21 crystals (9+12)\n• Day 4: 45 crystals (21+24)\n\nAdding double previous addition. Day 6 total?",
    answer: 189,
    hint: "💡 Day 5: 45+48=93. Day 6: 93+96=189",
    explanation: "Pattern:\n\n🔮 Day 1: 3\n🔮 Day 2: 3+6=9 (added 6)\n🔮 Day 3: 9+12=21 (added 12)\n🔮 Day 4: 21+24=45 (added 24)\n🔮 Day 5: 45+48=93 (added 48)\n🔮 Day 6: 93+96=189 (added 96)\n\n✅ Answer: 189"
  }],
  10: [{
    question: "A carpenter enters a house with 4 rooms to repair the walls. He carries a certain number of new wood pieces with him.\n\nHe has a magical rule: Every time he enters a room, he removes exactly as many old wood pieces from the wall as the number of new pieces he is currently carrying (this effectively doubles his wood supply).\n\nIn each of the 4 rooms, he uses exactly 100 pieces to repair the wall. After finishing the 4th room, he walks out with exactly zero pieces left.\n\nHow many wood pieces did he start with? (You can use decimals if needed)",
    answer: 93.75,
    hint: "💡 Think backwards! Start from the end:\n• After room 4: 0 pieces\n• Before using 100 in room 4: 0 + 100 = 100 pieces\n• Before doubling in room 4: 100 ÷ 2 = 50 pieces\n\nNow continue this pattern backwards through rooms 3, 2, and 1...",
    explanation: "Working backwards from the end:\n\n🔙 Room 4:\n• After room 4: 0 pieces\n• Before using 100: 0 + 100 = 100 pieces\n• Before doubling: 100 ÷ 2 = 50 pieces\n\n🔙 Room 3:\n• Before using 100: 50 + 100 = 150 pieces\n• Before doubling: 150 ÷ 2 = 75 pieces\n\n🔙 Room 2:\n• Before using 100: 75 + 100 = 175 pieces\n• Before doubling: 175 ÷ 2 = 87.5 pieces\n\n🔙 Room 1:\n• Before using 100: 87.5 + 100 = 187.5 pieces\n• Before doubling: 187.5 ÷ 2 = 93.75 pieces\n\n✅ Answer: 93.75 pieces\n\nVerification (forward):\n93.75 → ×2 → 187.5 → -100 → 87.5\n87.5 → ×2 → 175 → -100 → 75\n75 → ×2 → 150 → -100 → 50\n50 → ×2 → 100 → -100 → 0 ✓"
  },
  {
    question: "A builder enters 5 floors with bricks.\n\nRule: On each floor, he finds as many bricks as he's carrying (doubles supply).\n\nHe uses 50 bricks per floor. After floor 5, he has 0 bricks left.\n\nHow many did he start with?",
    answer: 46.875,
    hint: "💡 Work backwards: Floor 5: 0→50→25. Floor 4: 25→75→37.5. Continue...",
    explanation: "Working backwards:\n\n🔙 Floor 5:\n• After: 0 bricks\n• Before using 50: 50 bricks\n• Before doubling: 25 bricks\n\n🔙 Floor 4:\n• Before using 50: 75 bricks\n• Before doubling: 37.5 bricks\n\n🔙 Floor 3:\n• Before using 50: 87.5 bricks\n• Before doubling: 43.75 bricks\n\n🔙 Floor 2:\n• Before using 50: 93.75 bricks\n• Before doubling: 46.875 bricks\n\n🔙 Floor 1:\n• Before using 50: 96.875 bricks\n• Before doubling: 48.4375 bricks\n\nWait - we need to go back ONE more step!\n\n🔙 Start (before floor 1):\n• Before using 50: 96.875 bricks\n• Before doubling: 48.4375 bricks\n\nActually, let me recalculate properly:\nStart → double → use 50 → double → use 50 → double → use 50 → double → use 50 → double → use 50 → 0\n\nBackwards: 0 ← 50 ← 25 ← 75 ← 37.5 ← 87.5 ← 43.75 ← 93.75 ← 46.875\n\n✅ Answer: 46.875"
  },
  {
    question: "A painter enters 3 rooms with paint cans.\n\nRule: Each room has as many cans as she's carrying (doubles).\n\nShe uses 80 cans per room. After room 3, she has 0 left.\n\nHow many cans did she start with?",
    answer: 70,
    hint: "💡 Backwards: Room 3: 0→80→40. Room 2: 40→120→60. Room 1: 60→140→70",
    explanation: "Working backwards:\n\n🔙 Room 3:\n• After: 0 cans\n• Before using 80: 80 cans\n• Before doubling: 40 cans\n\n🔙 Room 2:\n• Before using 80: 120 cans\n• Before doubling: 60 cans\n\n🔙 Room 1:\n• Before using 80: 140 cans\n• Before doubling: 70 cans\n\n✅ Answer: 70 cans"
  }]
}

// Select a random puzzle variation for the given level
const getPuzzleForLevel = (level: number): Puzzle => {
  const variations = puzzleVariations[level] || puzzleVariations[1]
  const randomIndex = Math.floor(Math.random() * variations.length)
  return variations[randomIndex]
}

const LogicPuzzles = ({ level }: LogicPuzzlesProps): JSX.Element => {
  // Generate a random puzzle for this level on component mount
  const [puzzle, setPuzzle] = useState<Puzzle>(() => getPuzzleForLevel(level))
  const [input, setInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [feedback, setFeedback] = useState<string>('')
  const saved = useRef(false)

  useEffect(() => {
    // Generate new random puzzle when level changes
    setPuzzle(getPuzzleForLevel(level))
    setInput('')
    setShowHint(false)
    setShowExplanation(false)
    setAttempts(0)
    setCompleted(false)
    setFeedback('')
    saved.current = false
  }, [level])

  const submit = (): void => {
    const val = Number(input)
    setAttempts(prev => prev + 1)

    if (isNaN(val)) {
      setFeedback('Please enter a valid number!')
      return
    }

    // Check if answer matches (with tolerance for floating point)
    const isCorrect = Math.abs(val - puzzle.answer) < 0.01
    
    if (isCorrect) {
      setFeedback('🎉 Correct! Brilliant thinking!')
      setCompleted(true)
      setShowExplanation(true)
      
      if (!saved.current) {
        const score = Math.max(50, 100 - (attempts * 10))
        markGameCompletedLevel('logic-puzzles', level, score, 100)
        saved.current = true
      }
    } else {
      const diff = Math.abs(val - puzzle.answer)
      if (diff <= 5) {
        setFeedback('🔥 Very close! Try again!')
      } else if (diff <= 20) {
        setFeedback('🤔 Getting warmer... Think it through!')
      } else {
        setFeedback('❌ Not quite. Try using the hint!')
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit()
    }
  }

  return (
    <>
      <CelebrationAnimation show={completed} />
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-8 rounded-2xl shadow-xl max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-purple-700 flex items-center justify-center gap-3">
            🧩 Logic Puzzle Challenge
            <span className="text-2xl bg-purple-100 px-4 py-1 rounded-full">Level {level}</span>
          </h2>
          <p className="text-lg text-slate-600 mt-2">Think carefully and solve the puzzle! 🤔</p>
        </div>

        <div className="mb-8 p-8 bg-white rounded-2xl shadow-lg border-4 border-purple-200">
          <div className="text-lg leading-relaxed text-slate-800 whitespace-pre-line">
            {puzzle.question}
          </div>
        </div>

        {!completed && puzzle.hint && (
          <div className="mb-6">
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-lg font-bold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
            >
              {showHint ? '🙈 Hide Hint' : '💡 Show Hint'}
            </button>
            {showHint && (
              <div className="mt-4 p-6 bg-yellow-50 border-4 border-yellow-300 rounded-xl">
                <div className="text-lg text-yellow-900">
                  <strong>💡 Hint:</strong> {puzzle.hint}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 items-center justify-center mb-6">
          <input
            className="text-4xl font-bold text-center border-4 border-purple-400 p-4 rounded-xl w-64 focus:ring-4 focus:ring-purple-300 focus:outline-none shadow-lg disabled:bg-gray-100"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Your answer"
            autoFocus
            disabled={completed}
            type="number"
          />
          <button
            onClick={submit}
            disabled={completed}
            className="px-8 py-4 bg-gradient-to-r from-green-400 to-green-500 text-white text-2xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            ✓ Submit
          </button>
        </div>

        {feedback && (
          <div className={`mb-6 p-6 rounded-xl shadow-lg text-center text-xl font-bold ${
            completed 
              ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-4 border-emerald-300'
              : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-4 border-blue-300'
          }`}>
            {feedback}
          </div>
        )}

        <div className="text-center mb-6">
          <div className="inline-block bg-white px-8 py-4 rounded-xl shadow-md">
            <span className="text-2xl font-bold text-purple-700">Attempts: </span>
            <span className="text-4xl font-black text-orange-600">{attempts}</span>
          </div>
        </div>

        {showExplanation && (
          <div className="mb-6 p-6 bg-blue-50 border-4 border-blue-300 rounded-xl">
            <div className="text-lg text-blue-900 whitespace-pre-line">
              <strong>📚 Explanation:</strong><br/><br/>
              {puzzle.explanation}
            </div>
          </div>
        )}
        
        {completed && (
          <div className="mt-6 p-6 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-xl shadow-lg border-4 border-emerald-300">
            <div className="text-3xl font-bold text-center mb-4">
              🎉 Excellent! Level {level} completed! 🎉
            </div>
            <div className="text-center text-lg mb-2">
              You solved it in {attempts} attempt{attempts !== 1 ? 's' : ''}!
            </div>
            <div className="text-center text-2xl font-bold mb-4">
              ✅ Correct Answer: <span className="text-green-700">{puzzle.answer}</span>
            </div>
            <div className="flex justify-center">
              <NextLevelButton currentLevel={level} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default LogicPuzzles

// Made with Bob
