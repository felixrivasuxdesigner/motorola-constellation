# AGENTS.md — The Motorola Constellation

## Project overview

A single-page static site: an interactive cosmic constellation that is a thank-you
gift from Nanna to the Motorola team. **No build system, no tests, no framework.**
Vanilla HTML + CSS + JS. Open `index.html` directly or serve with any HTTP server.

## Key commands

| Action | Command |
|---|---|
| Serve locally | `npx serve .` or `python3 -m http.server` |
| Open directly | `open index.html` |
| Commit + push | `git add -A && git commit -m "..." && git push` (user expects commit after every change) |
| Generate favicon | `sips -s format ico assets/logo-nanna.png -z 32 32 --out assets/favicon.ico` |

No build step, linter, typecheck, or test runner exists.

## Architecture

```
index.html       — main page: orbital ring + cosmic popup
wallpaper.html   — individual wallpaper (SPA via ?id=N, 1–9)
css/style.css    — all styling + responsive breakpoints
js/main.js       — all logic (IIFE, `requestAnimationFrame` orbital animation)
manifest.json    — PWA config (display: fullscreen)
```

### Data flow
- `js/main.js:17` — `SECTIONS` array defines all 9 team members (thumb, wallpaper, color, subtitle)
- `wallpaper.html?id=N` — `initWallpaperPage()` reads query param, populates title/subtitle/image/download
- Navigation: clicking an orbit node → `wallpaper.html?id=N`; clicking sun → opens popup

## Responsive system

Mobile-first. Breakpoints: `400px` → `600px` → `768px` → desktop.

- Typography: `clamp()` with `vw` units (fluid scaling)
- Height: `100dvh` (not `100vh` — handles mobile address bar)
- Mobile: `viewport-fit=cover` + `env(safe-area-inset-*)` for notch/home-indicator
- PWA: `apple-mobile-web-app-capable=yes` + `manifest display: fullscreen` for home-screen launch

### Layout rules
- **Back link**: fixed top-left on mobile (`max-width: 768px`), bottom-left on desktop
- **Wallpaper page mobile**: column layout, back-link top-left, download button centered below text, footer in flow (not fixed)
- **Orbit nodes**: `min(150px, 20vmin)` — auto-scales; JS `computeOrbitalRadius()` keeps buttons inside ring

## Asset conventions

| File pattern | Purpose |
|---|---|
| `assets/N-NAME.png` | Orbit node thumbnail (1-9) |
| `assets/wallpapers/N-NAME-wallp.jpg` | Full-res wallpaper for section N |
| `assets/logo-nanna.png` | Fixed bottom-right badge |
| `assets/motorola.png` | Central sun logo |
| `assets/BG-The-Motorola-Constellation.webp` | Page background (NOT the SVG — was deleted) |

Adding a new section: add entry to `SECTIONS` array + add thumb + add wallpaper file.

## CSS convention notes

- CSS variables in `:root` define the neon palette (`--neon-cyan`, `--neon-purple`, `--neon-magenta`, `--neon-gold`, `--gold-glow`, etc.)
- `.neon-*` classes apply color + text-shadow
- `.glow-*` classes apply box-shadow glow
- Keep cosmic neon aesthetic — don't flatten colors
- `box-shadow` uses `rgba()` with low opacity for subtle glow
