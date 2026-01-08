# 🧠 Brain Development Games

> **Sharpen your mind with 19 scientifically-inspired cognitive training games**

<div align="center">

## 🎮 [**PLAY NOW →**](https://sojinantony01.github.io/brain-development-games)

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://sojinantony01.github.io/brain-development-games)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8)](https://tailwindcss.com/)

</div>

A collection of engaging cognitive training games built with React, TypeScript, and Tailwind CSS. Challenge your memory, enhance your problem-solving skills, and track your progress across 10 levels of increasing difficulty in each of the 19 games.

---

## 🎮 All 19 Games

### 🧩 Logic & Problem Solving
- **💧 Water Jugs** - Master resource management and logical thinking
- **🗼 Tower of Hanoi** - Perfect your recursive planning skills
- **🌀 Pathway Maze** - Navigate complex mazes with strategic forecasting
- **🔗 Trail Making** - Connect nodes in sequence (numbers and letters)

### 🧠 Memory & Attention
- **🔢 N-Back** - Train your working memory with sequence matching
- **🎨 Stroop Test** - Improve inhibition control and focus
- **🔲 Pattern Matrix** - Enhance visual memory recognition
- **📊 Schulte Table** - Boost peripheral vision and processing speed
- **🎵 Simon Says** - Remember and repeat color sequences
- **🃏 Card Matching** - Classic concentration game with increasing difficulty
- **🧩 Working Memory Grid** - Remember positions on a grid

### 🎯 Cognitive Flexibility & Speed
- **🔄 Mental Rotation** - Develop spatial reasoning abilities
- **➕ Quick Math** - Sharpen numerical agility under pressure
- **📝 Word Scramble** - Enhance verbal fluency and pattern recognition
- **⚡ Reaction Time** - Test and improve your reflexes
- **🔍 Visual Search** - Find target shapes among distractors
- **🔢 Number Sequence** - Identify patterns in number sequences
- **🎯 Anagram Solver** - Unscramble words under time pressure

### 🧪 Advanced Cognitive Skills
- **🎭 Dual Task Challenge** - Multitask with simultaneous shape counting and math

---

## ✨ Features

- 🎯 **10 Levels Per Game** - Progressive difficulty scaling
- 💾 **Progress Tracking** - Automatic save to browser localStorage
- 🏆 **Local Leaderboard** - Track your best performances
- 📱 **Responsive Design** - Play on any device
- 🚀 **Fast & Lightweight** - Built with Vite for optimal performance
- 🎨 **Modern UI** - Clean interface with Tailwind CSS
- 📊 **Performance Metrics** - Score tracking and completion times
- 🔗 **Share Results** - Share your achievements on social media

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/sojinantony01/brain-development-games.git

# Navigate to project directory
cd brain-development-games

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/brain-development-games/` to start playing!

---

## 🎯 How to Play

1. **Select a Game** - Choose from 19 different cognitive challenges
2. **Pick Your Level** - Start at Level 1 or jump to any unlocked level
3. **Complete Challenges** - Solve puzzles, match patterns, or beat the clock
4. **Track Progress** - Your best scores are automatically saved
5. **Level Up** - Click "Next Level" after completing each challenge
6. **Compete** - Check the leaderboard to see your rankings

---

## 🏗️ Project Structure

```
brain-development-games/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── LeaderBoard.tsx
│   │   ├── LevelSelector.tsx
│   │   ├── NextLevelButton.tsx
│   │   └── ShareButtons.tsx
│   ├── games/           # Game implementations
│   │   ├── WaterJugs.tsx
│   │   ├── TowerOfHanoi.tsx
│   │   ├── NBack.tsx
│   │   └── ... (7 more games)
│   ├── pages/           # Page components
│   │   ├── Home.tsx
│   │   └── games/       # Individual game pages
│   ├── lib/             # Utilities
│   │   ├── progress.ts  # Progress tracking
│   │   └── leaderboard.ts
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── .github/
│   └── workflows/       # CI/CD automation
└── docs/                # Built files for GitHub Pages
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

---

## 📦 Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

The build output will be in the `docs/` directory, ready for deployment.

---

## 🌐 Deployment

This project is configured for GitHub Pages deployment:

1. **Automatic Deployment** - Push to `main` branch triggers automatic deployment
2. **Manual Deployment** - Run `npm run deploy` locally
3. **GitHub Actions** - Configured workflow in `.github/workflows/deploy.yml`

### GitHub Pages Setup
1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to main branch to trigger deployment

---

## 🎨 Customization

### Adding New Games

1. Create game component in `src/games/YourGame.tsx`
2. Create page component in `src/pages/games/YourGamePage.tsx`
3. Add route in `src/App.tsx`
4. Add game metadata in `src/pages/Home.tsx`

See `GAME_SUGGESTIONS.md` for ideas on new games to implement!

### Styling

The project uses Tailwind CSS v4. Customize styles in:
- `src/main.css` - Global styles
- Component files - Inline Tailwind classes

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. 🐛 **Report Bugs** - Open an issue with details
2. 💡 **Suggest Features** - Share your ideas
3. 🔧 **Submit PRs** - Fix bugs or add features
4. 📖 **Improve Docs** - Help others understand the project

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- Inspired by cognitive psychology research
- Built with modern web technologies
- Designed for accessibility and performance

---

## 📞 Contact

- **GitHub**: [@sojinantony01](https://github.com/sojinantony01)

---

<div align="center">

## 🎮 [**PLAY NOW →**](https://sojinantony01.github.io/brain-development-games)

**⭐ Star this repo if you find it helpful!**

Made with ❤️ for cognitive development

</div>
