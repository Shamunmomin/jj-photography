# JJ Photography

A professional photography portfolio website built with React, featuring an immersive editorial-style gallery, dark/light theme, and seamless user experience.

## Features

- **Editorial-Style Gallery** — Dynamic magazine-inspired layouts (hero, grids, splits) that adapt to each photo album
- **Zoom Lightbox** — Pinch-to-zoom, pan, and navigate through images with keyboard and navigation controls
- **Dark / Light Theme** — Toggle between themes with persistent preference via `localStorage`
- **Portfolio Filtering** — Browse by category (Weddings, Portraits, Fashion, Travel) with animated transitions
- **Responsive Design** — Fully responsive across mobile, tablet, and desktop
- **Contact Form** — Integrated WhatsApp-based inquiry form
- **Lazy Loading** — Code-split pages and lazy-loaded images for optimal performance
- **Smooth Animations** — Framer Motion animations throughout
- **Custom Cursor** — Aesthetic custom cursor with mix-blend-mode effect
- **Automated Deployment** — CI/CD pipeline via GitHub Actions

## Built With

- [React 19](https://react.dev/)
- [Vite 8](https://vite.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide React](https://lucide.dev/)
- [gh-pages](https://github.com/tschaub/gh-pages)
- [GitHub Actions](https://github.com/features/actions)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

| Command             | Description                            |
|---------------------|----------------------------------------|
| `npm run dev`       | Start development server (Vite)        |
| `npm run build`     | Build for production to `dist/`        |
| `npm run preview`   | Preview production build locally       |
| `npm run deploy`    | Deploy to GitHub Pages via `gh-pages`  |

## Deployment

Pushes to the `main` branch trigger an automated build and deploy to GitHub Pages via GitHub Actions (see `.github/workflows/deploy.yml`).

Manual deployment:

```bash
npm run deploy
```

The site is published at `https://Shamunmomin.github.io/jj-photography/`.

## Gallery Data

Photo albums are defined in `src/data/`:
- `weddings.js`, `portraits.js`, `fashion.js`, `travel.js`
- Shared assets and social links in `images.js`
- Each album generates an editorial layout with mixed section types

## Project Structure

```
src/
  App.jsx             — Root component with page routing & theme toggle
  App.css             — All application styles
  main.jsx            — Entry point
  index.css           — Global base styles
  components/
    Icons.jsx         — Custom SVG icons (Instagram, Facebook)
  data/
    images.js         — Hero images, social links, photographer info
    weddings.js       — Wedding photo album
    portraits.js      — Portrait photo album
    fashion.js        — Fashion photo album
    travel.js         — Travel photo album
  pages/
    HomePage.jsx      — Landing page with portfolio, about, services, contact
    GalleryPage.jsx   — Category gallery with editorial layout & zoom lightbox
```

## License

All rights reserved. Photos and content are for demonstration purposes.
