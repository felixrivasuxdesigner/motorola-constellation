/* ==========================================
   MOTOROLA CONSTELLATION - main.js
   Astral ring positioning, navigation & wallpaper
   ========================================== */

(function () {
  "use strict";

  /* ------------------------------------------------
     Configuration: the 9 sections / wallpapers
     ------------------------------------------------ */
   /* ------------------------------------------------
      Configuration: the 9 sections
      - thumb:    imagen numerada que gira alrededor del sol (botón orbital)
      - wallpaper: path del wallpaper real (local)
      ------------------------------------------------ */
    const SECTIONS = [
      { id: 1, title: "TONE",  colorVar: "--neon-cyan",    thumb: "assets/1-TONE.png",  wallpaper: "assets/wallpapers/1-TONE-wallp.jpg", subtitle: "El orden no es suerte, es liderazgo ✨" },
      { id: 2, title: "DANU",  colorVar: "--neon-purple",  thumb: "assets/2-DANU.png",  wallpaper: "assets/wallpapers/2-DANU-wallp.jpg", subtitle: "Organiza, planifica, siente, dramatiza y hace que todo suceda ✨" },
      { id: 3, title: "VALE",  colorVar: "--neon-magenta", thumb: "assets/3-VALE.png",  wallpaper: "assets/wallpapers/3-VALE-wallp.jpg", subtitle: "Toda constelación necesita una estrella que marque el rumbo ✨" },
      { id: 4, title: "EUGE",  colorVar: "--neon-cyan",    thumb: "assets/4-EUGE.png",  wallpaper: "assets/wallpapers/4-EUGE-wallp.jpg", subtitle: "Convierte noticias en historias que conectan ✨" },
      { id: 5, title: "BELU",  colorVar: "--neon-pink",    thumb: "assets/5-BELU.png",  wallpaper: "assets/wallpapers/5-BELU-wallp.jpg", subtitle: "Mil ideas, mil pendientes, una energía imparable ✨" },
      { id: 6, title: "ALEJO", colorVar: "--neon-magenta", thumb: "assets/6-ALEJO.png", wallpaper: "assets/wallpapers/6-ALEJO-wallp.jpg", subtitle: "Donde hay un plan, hay un reporte ✨" },
      { id: 7, title: "CARO",  colorVar: "--neon-purple",  thumb: "assets/7-CARO.png",  wallpaper: "assets/wallpapers/7-CARO-wallp.jpg", subtitle: "Donde la naturaleza inspira, las ideas florecen 🍃" },
      { id: 8, title: "MARTU", colorVar: "--neon-cyan",    thumb: "assets/8-MARTU.png", wallpaper: "assets/wallpapers/8-MARTU-wallp.jpg", subtitle: "Cada generación, tiene su propia magia ✨" },
      { id: 9, title: "ARI",   colorVar: "--neon-pink",    thumb: "assets/9-ARI.png",   wallpaper: "assets/wallpapers/9-ARI-wallp.jpg", subtitle: "La constelación no se guía por estrellas... se guía por sus carcajadas ✨" },
      { id: 10, title: "RE",   colorVar: "--neon-gold",    thumb: "assets/10-RE.png",   wallpaper: "assets/wallpapers/10-RE-wallp.jpg", subtitle: "Conecta personas, ideas y horizontes ✨" },
    ];

  const NEON_CLASS = {
    "--neon-cyan": "neon-cyan",
    "--neon-purple": "neon-purple",
    "--neon-magenta": "neon-magenta",
    "--neon-pink": "neon-magenta",
    "--neon-gold": "neon-gold",
  };

  /* ------------------------------------------------
     Helpers
     ------------------------------------------------ */
  function wallpaperUrl(section) {
    return section.wallpaper;
  }

  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  // Responsive orbital radius: fits the ring container so buttons never overflow
  function computeOrbitalRadius(ring, nodes) {
    const ringRect = ring.getBoundingClientRect();
    const nodeW = (nodes[0] && nodes[0].getBoundingClientRect().width) || 150;
    const maxRadius = Math.min(280, ringRect.width / 2 - nodeW / 2 - 12);
    return Math.max(120, Math.floor(maxRadius));
  }

  /* ------------------------------------------------
     RING POSITIONING (orbital buttons on index page)
     ------------------------------------------------ */
  function positionOrbitalNodes() {
    const ring = document.querySelector(".astral-ring");
    if (!ring) return;

    const nodes = ring.querySelectorAll(".orbit-node");
    const count = nodes.length;

    // Responsive orbital radius: keeps buttons inside the ring on any screen size
    let radius = computeOrbitalRadius(ring, nodes);
    window.addEventListener("resize", () => {
      radius = computeOrbitalRadius(ring, nodes);
    });

    // Assign color + click handler once, and place the numbered image on each button
    nodes.forEach((node, i) => {
      const section = SECTIONS[i] || SECTIONS[i % SECTIONS.length];
      const label = node.querySelector(".node-label");
      if (label) {
        label.className = "node-label";

        // Render the numbered image as the button (instead of plain number text)
        label.innerHTML = "";
        const img = document.createElement("img");
        img.src = section.thumb;
        img.alt = section.title;
        img.className = "orbit-thumb";
        label.appendChild(img);

        label.addEventListener("click", (e) => {
          e.preventDefault();
          window.location.href = `wallpaper.html?id=${section.id}`;
        });
      }
    });

    // Central sun: clickable → open the cosmic thank-you popup (no navigation)
    const hub = document.querySelector(".ring-hub");
    if (hub) {
      hub.style.cursor = "pointer";
      hub.addEventListener("click", () => openCosmicPopup());
    }

    // First-visit pulse: guides the eye to click the orbit nodes
    // Plays once per session (sessionStorage guard), with staggered delay per node
    if (!sessionStorage.getItem("constellationIntroSeen")) {
      const STAGGER = 0.18; // seconds between each node
      nodes.forEach((node, i) => {
        const label = node.querySelector(".node-label");
        if (label) {
          setTimeout(() => label.classList.add("pulse-intro"), i * STAGGER * 1000);
        }
      });
      sessionStorage.setItem("constellationIntroSeen", "true");
    }

    // 3D Helical Solar System trajectory animation loop
    let drift = 0;
    const TILT_ANGLE = (25 * Math.PI) / 180; // 25 degree axial tilt
    const animate = () => {
      drift += 0.04;
      nodes.forEach((node, i) => {
        const angleDeg = drift + (i / count) * 360;
        const angleRad = (angleDeg - 90) * (Math.PI / 180);

        // Helical z-wave phase modulation (floating spiral vortex effect)
        const zWave = Math.sin(drift * 0.08 + i * 0.6) * 0.15;

        // Parametric 3D coords with tilted orbital plane
        const rx = radius;
        const ry = radius * Math.cos(TILT_ANGLE);
        const x = Math.cos(angleRad) * rx;
        const y = Math.sin(angleRad) * ry;

        // Depth coordinate Z normalized from -1 (far behind) to +1 (near front)
        const zVal = Math.sin(angleRad) + zWave;
        const normZ = Math.max(-1, Math.min(1, zVal / 1.15));

        // Depth scaling: scale down when behind, scale up when in front
        const scale = 0.72 + (normZ + 1) * 0.20; // 0.72x to 1.12x
        const opacity = 0.55 + (normZ + 1) * 0.225; // 0.55 to 1.0

        // Z-index depth layering: Hub is at z-index 25
        // Nodes pass behind hub when z < 0 (z-index 10-24) and in front when z > 0 (z-index 26-40)
        const zIndex = Math.floor(10 + (normZ + 1) * 15);

        node.style.zIndex = zIndex;
        node.style.opacity = opacity.toFixed(3);
        node.style.transform = `translate(calc(${x.toFixed(1)}px - 50%), calc(${y.toFixed(1)}px - 50%)) scale(${scale.toFixed(3)})`;
      });
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  /* ------------------------------------------------
     WALLPAPER PAGE LOGIC
     ------------------------------------------------ */
  function initWallpaperPage() {
    const frame = document.querySelector(".wallpaper-frame");
    if (!frame) return;

    let id = getQueryParam("id");
    if (!id || isNaN(id)) id = "1";

    const numId = Number(id);
    const section = SECTIONS.find((s) => s.id === numId) || SECTIONS[0];
    const url = wallpaperUrl(section);

    const img = frame.querySelector(".wallpaper-image");
    const hero = document.querySelector(".wallpaper-hero");
    const title = hero ? hero.querySelector(".wallpaper-title") : null;
    const subtitle = hero ? hero.querySelector(".wallpaper-subtitle") : null;
    const spinner = document.getElementById("spinner");
    const sectionIdEl = document.getElementById("section-id");
    const downloadBtn = document.querySelector(".btn-download");

    if (title) title.textContent = section.title;
    if (subtitle) subtitle.textContent = section.subtitle || "Sin subtítulo";
    if (sectionIdEl) sectionIdEl.textContent = String(section.id);

    if (img) {
      img.src = url;
      img.onload = () => {
        if (spinner) spinner.style.display = "none";
        img.style.opacity = "1";
      };
    }
    if (downloadBtn) {
      downloadBtn.href = url;
       downloadBtn.download = `${section.title}.jpg`;
    }
  }

  /* ------------------------------------------------
     COSMIC POPUP (thank-you modal triggered by the sun)
     ------------------------------------------------ */
  function initCosmicPopup() {
    const popup = document.getElementById("cosmic-popup");
    if (!popup) return;

    const closeBtn = popup.querySelector(".cosmic-popup__close");
    const backdrop = popup.querySelector(".cosmic-popup__backdrop");

    window.openCosmicPopup = function () {
      popup.classList.add("is-open");
      popup.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    window.closeCosmicPopup = function () {
      popup.classList.remove("is-open");
      popup.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    closeBtn?.addEventListener("click", closeCosmicPopup);
    backdrop?.addEventListener("click", closeCosmicPopup);
    popup.addEventListener("click", (e) => {
      if (e.target === popup) closeCosmicPopup();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && popup.classList.contains("is-open")) closeCosmicPopup();
    });
  }

  /* ------------------------------------------------
     Cursor magical sparkle (constellation page only)
     ------------------------------------------------ */
  function initCursorSparkle() {
    let pending = false, cx = 0, cy = 0;

    document.addEventListener("mousemove", (e) => {
      cx = e.clientX;
      cy = e.clientY;
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        emitSparkle(cx, cy);
      });
    });

    function emitSparkle(x, y) {
      const el = document.createElement("div");
      el.className = "sparkle";
      const size = 4 + Math.random() * 4;
      el.style.width = el.style.height = size + "px";
      el.style.left = x + "px";
      el.style.top = y + "px";
      el.style.background = Math.random() > .55 ? "var(--neon-white)" : "var(--star-white)";
      el.addEventListener("animationend", () => el.remove());
      document.body.appendChild(el);
    }
  }

  /* ------------------------------------------------
     Twinkling stars (background)
     ------------------------------------------------ */
  function initTwinklingStars() {
    const container = document.createElement("div");
    container.className = "twinkling-stars";
    document.body.appendChild(container);

    const STAR_COLORS = [
      "var(--star-white)",
      "var(--neon-purple)",
    ];

    const COUNT = 350;
    for (let i = 0; i < COUNT; i++) {
      const star = document.createElement("div");
      star.className = "twinkling-star";

      const size = Math.random() * 2 + 0.5; // 0.5–2.5px
      star.style.width = star.style.height = `${size}px`;

      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;

      const delay = Math.random() * 5; // 0–5s
      const duration = Math.random() * 4 + 2; // 2–6s
      star.style.animationDelay = `${delay}s`;
      star.style.animationDuration = `${duration}s`;

      star.style.background = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];

      if (size > 1.5) {
        star.style.boxShadow = `0 0 ${size * 2}px ${size}px ${star.style.background}`;
      }

      container.appendChild(star);
    }
  }

  /* ------------------------------------------------
     Init
     ------------------------------------------------ */
  function init() {
    positionOrbitalNodes();
    initWallpaperPage();
    initCosmicPopup();
    initCursorSparkle();
    initTwinklingStars();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.__CONSTELLATION__ = { SECTIONS, wallpaperUrl };
})();
