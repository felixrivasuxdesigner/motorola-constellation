# The Motorola Constellation

## Descripción

Una constelación cósmica interactiva creada por **Nanna** como un regalo de agradecimiento para el equipo de **Motorola**. Cada miembro del equipo — Tone, Danu, Vale, Euge, Belu, Alejo, Caro, Martu y Ari — es una estrella que orbita alrededor del sol Motorola.

> *"Como soy de las que cree que las personas con las que hacemos sinergia dejan una huella clara, quise agradecerles de una forma que se parezca a cómo les recuerdo: cada uno con una energía distinta, pero formando parte de la misma constelación."*

Haz click en el logo de Motorola para leer el mensaje completo, o haz click en cada planeta para descubrir el wallpaper personalizado de cada miembro del equipo.

## Características

- **Anillo de órbita interactivo**: 9 botones que orbitan suavemente alrededor del logo de Motorola
- **Wallpapers personalizados**: Cada miembro del equipo tiene su propia sección con wallpaper de alta resolución
- **Tema cósmico neon**: Fondo espacial con partículas estelares, nebulas animadas y efectos de glow
- **Modal de agradecimiento**: Mensaje personal de Nanna al equipo
- **100% responsive**: Diseñado mobile-first con breakpoints para móvil, tablet y desktop
- **PWA-ready**: Instalable como app en el home screen con modo fullscreen
- **Tipografía fluida**: Escala automáticamente con `clamp()` y unidades `vw`/`dvh`

## Tecnologías

- **HTML5** — estructura semántica
- **CSS3 puro** — animaciones con `@keyframes`, efectos neon, grids flexivas, `clamp()` para tipografía fluida
- **JavaScript vanilla** — posicionamiento orbital con `requestAnimationFrame`, navegación SPA, popup modal
- **Fonts**: Cinzel Decorative (títulos) + Cormorant Garamond (cuerpo)

## Estructura de archivos

```
motorola-constellation/
├── index.html          # Página principal: constelación interactiva
├── wallpaper.html      # Página de wallpaper individual (SPA via query params)
├── manifest.json       # PWA: abre a pantalla completa desde home screen
├── css/style.css       # Tema cosmico neon + sistema responsive
├── js/main.js          # Lógica: órbitas, navegación, popups, sparkles
└── assets/
    ├── BG-The-Motorola-Constellation.webp   # Background cósmico
    ├── motorola.png                          # Logo central (el sol)
    ├── logo-nanna.png                        # Logo de Nanna (badge fixed)
    ├── favicon.ico / favicon-192.png         # Favicons
    ├── 1-TONE.png … 9-ARI.png               # Wallpapers de cada miembro
    └── (eliminados)                          # SVG de fondo no usado
```

## Equipo

| # | Nombre | Energía |
|---|--------|---------|
| 1 | Tone  | Cian neón |
| 2 | Danu  | Púrpura cósmico |
| 3 | Vale  | Magenta vibrante |
| 4 | Euge  | Cian neón |
| 5 | Belu  | Rosa neón |
| 6 | Alejo | Magenta vibrante |
| 7 | Caro  | Púrpura cósmico |
| 8 | Martu | Cian neón |
| 9 | Ari   | Rosa neón |

## Cómo ejecutar

```bash
# Open in browser (no build step needed)
open index.html

# Or serve with a simple HTTP server
npx serve .
```

## Responsive

El sitio usa un sistema de breakpoints mobile-first:

| Breakpoint | Dispositivo |
|---|---|
| ≤ 400px | Ultra-small mobile |
| ≤ 600px | Mobile |
| ≤ 768px | Tablet |
| > 768px | Desktop |

- Tipografía fluida con `clamp()` responsive a `vw`
- `100dvh` en vez de `100vh` para ocupar toda la pantalla (sin address bar)
- `viewport-fit=cover` + `safe-area-inset` para notch/home-indicator
- PWA `display: fullscreen` en manifest para abrir sin UI de navegador

## Favicon

El favicon se generó a partir de `logo-nanna.png`:

```bash
sips -s format ico assets/logo-nanna.png -z 32 32 --out assets/favicon.ico
sips -s format png assets/logo-nanna.png -z 192 192 --out assets/favicon-192.png
```

---

✨ **¡Un abrazo enorme! Gracias, gracias, gracias.** — Nanna @ Nannagrafia, 2026
