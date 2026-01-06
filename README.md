# brain-development-games

# Under development

The Mind Arcade — A collection of cognitive training games implemented with React + Vite + TypeScript + Tailwind.

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Dev server:

```bash
npm run dev
```

3. Run tests:

```bash
npm test
```

## Project Structure

- `src/pages` - Home and game pages
- `src/games` - Game components and logic

## Games (implemented / scaffolding)

1. Water Jugs (implemented skeleton + gameplay)
2. Tower of Hanoi (scaffold)
3. N-Back (scaffold)
4. Stroop Test (scaffold)
5. Mental Rotation (scaffold)
6. Schulte Table (scaffold)
7. Pathway / Maze (scaffold)
8. Pattern Matrix (scaffold)
9. Quick Math (scaffold)
10. Word Scramble (scaffold)

Each game accepts a `level` (1-10) via the query string (e.g. `/games/water-jugs?level=3`) and scales difficulty accordingly.

## Notes

- All components are written in TypeScript and typed.
- Tailwind is used for simple full-size design.

## Persistence

Game progress (best level/completions) is saved to your browser's `localStorage` so each player can continue progress on the same device/browser. You can reset progress from the Home page using the "Reset Progress" button.

## Leaderboard & Sharing

A lightweight local leaderboard records notable performances (score, level, time) and is visible on the Home page. Entries are stored in `localStorage` and can be reset from the leaderboard UI. After completing a game, you can share your result using the built-in Share/Tweet/Copy link buttons (native share is used when available).

## Deployment (GitHub Pages)

A GitHub Pages deployment is supported by building the site into the `docs/` folder and publishing the `main` branch `docs/` folder in your repository settings.

Live demo (once deployed): https://sojinantony01.github.io/brain-development-games

Steps to publish:

1. In `vite.config.ts` the `base` is set to `/brain-development-games/` and `build.outDir` is `docs` so running `npm run build` will populate `docs/`.
2. Push the `main` branch to GitHub and in the repository Settings → Pages, set the source to `main` branch and the `/docs` folder. The site will be available at the URL above.

You can automate deploys using the `gh-pages` package (included). Run `npm run deploy` locally to build and publish to GitHub Pages, or add a GitHub Actions workflow to publish on every push to `main` (example workflow included in `.github/workflows/deploy.yml`).



set of games that could help/develop practice, thinking, calculate, memory and skills
