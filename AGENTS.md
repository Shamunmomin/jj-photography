# AGENTS.md — Photography

## Project Overview
React 19 SPA (JavaScript/JSX) — photography portfolio. Built with Vite 8. No TypeScript.

## Key Commands
- `npm run dev` — Start dev server with HMR
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview production build locally
- `npm run deploy` — Deploy to GitHub Pages

## Linting
- ESLint 9 flat config (`eslint.config.js`). Run: `npx eslint src/`
- No Prettier, no EditorConfig, no testing framework

## Tech Stack
- **React 19** with hooks (useState, useEffect, useRef, useCallback)
- **framer-motion** for animations (variants defined as objects outside components)
- **lucide-react** for icons (plus custom SVG icons in `src/components/Icons.jsx`)
- **Plain CSS** in `src/App.css` (~1770 lines, single file). CSS custom properties for light/dark theming (`[data-theme]`).
- **No React Router** — custom page routing via state variable in `App.jsx`
- **Lazy loading** via `React.lazy()` + `Suspense` for pages
- **Data** hardcoded in `src/data/*.js` files (named exports, arrays of objects with `{ id, src, title, description, location }`)

## Coding Conventions
- **Components**: `src/pages/` for route-level, `src/components/` for reusable. One component per `.jsx` file.
- **Export pattern**: `export default function ComponentName(props)` (function declarations, not arrow functions). Destructure props inline.
- **Data modules**: Named exports only (`export const`), `.js` extension.
- **Imports order**: React hooks → external libraries → internal components → internal data → CSS
- **Naming**: PascalCase for components, camelCase for data exports and utilities
- **Animations**: motion variants defined as plain objects outside the component, not inline
- **Styling**: BEM-like class naming (e.g., `.hero-section`, `.hero-slider`). Responsive breakpoints at 1200, 1000, 900, 768, 600, 500px.
- **Theme**: Light/dark via `data-theme` attribute on `<html>`, persisted to `localStorage`

## Routing
- Pages: `'home'` → `<HomePage />`, any other string → `<GalleryPage category={page} />`
- Navigation via `onNavigate` prop passed down from `App.jsx`

## Git
- Active branch: `demo` (not `main`)
- Deploy from `main` (GitHub Actions)
- Convention: short imperative commit messages (e.g., "Update home page layout", "Add fashion gallery data")
