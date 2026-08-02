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
     - wallpaper: placeholder hasta que subas los wallpapers reales
     ------------------------------------------------ */
  const SECTIONS = [
    { id: 1, title: "TONE",  colorVar: "--neon-cyan",    thumb: "assets/1-TONE.png",  wallpaper: "https://picsum.photos/seed/motorola-wp-1/1920/1080" },
    { id: 2, title: "DANU",  colorVar: "--neon-purple",  thumb: "assets/2-DANU.png",  wallpaper: "https://picsum.photos/seed/motorola-wp-2/1920/1080" },
    { id: 3, title: "VALE",  colorVar: "--neon-magenta", thumb: "assets/3-VALE.png",  wallpaper: "https://picsum.photos/seed/motorola-wp-3/1920/1080" },
    { id: 4, title: "EUGE",  colorVar: "--neon-cyan",    thumb: "assets/4-EUGE.png",  wallpaper: "https://picsum.photos/seed/motorola-wp-4/1920/1080" },
    { id: 5, title: "BELU",  colorVar: "--neon-pink",    thumb: "assets/5-BELU.png",  wallpaper: "https://picsum.photos/seed/motorola-wp-5/1920/1080" },
    { id: 6, title: "ALEJO", colorVar: "--neon-magenta", thumb: "assets/6-ALEJO.png", wallpaper: "https://picsum.photos/seed/motorola-wp-6/1920/1080" },
    { id: 7, title: "CARO",  colorVar: "--neon-purple",  thumb: "assets/7-CARO.png",  wallpaper: "https://picsum.photos/seed/motorola-wp-7/1920/1080" },
    { id: 8, title: "MARTU", colorVar: "--neon-cyan",    thumb: "assets/8-MARTU.png", wallpaper: "https://picsum.photos/seed/motorola-wp-8/1920/1080" },
    { id: 9, title: "ARI",   colorVar: "--neon-pink",    thumb: "assets/9-ARI.png",   wallpaper: "https://picsum.photos/seed/motorola-wp-9/1920/1080" },
  ];

  const NEON_CLASS = {
    "--neon-cyan": "neon-cyan",
    "--neon-purple": "neon-purple",
    "--neon-magenta": "neon-magenta",
    "--neon-pink": "neon-magenta",
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

    // Gentle orbital drift: recompute each node's position every frame
    // (text stays upright because nodes are translated, never rotated)
    let drift = 0;
    const animate = () => {
      drift += 0.04;
      nodes.forEach((node, i) => {
        const angleDeg = drift + (i / count) * 360;
        const angleRad = (angleDeg - 90) * (Math.PI / 180);
        const x = Math.cos(angleRad) * radius;
        const y = Math.sin(angleRad) * radius;
        // calc(-50%) centers the (responsive-size) button on its orbital point
        node.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
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
    const title = frame.querySelector(".wallpaper-title");
    const meta = frame.querySelector(".wallpaper-meta");
    const spinner = document.getElementById("spinner");
    const sectionIdEl = document.getElementById("section-id");
    const downloadBtn = document.querySelector(".btn-download");

    if (title) title.textContent = section.title;
    if (meta) meta.textContent = `Sección ${section.id} · ${section.title}`;
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
      downloadBtn.download = `${section.title}.png`;
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
     ACCESSIBILITY — toggle texto grande (presbicia)
     ------------------------------------------------ */
  function initAccessibilityToggle() {
    let enabled = false;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "a11y-toggle";
    btn.setAttribute("aria-label", "Alternar texto grande");
    btn.setAttribute("aria-pressed", "false");
    btn.textContent = "A";
    btn.addEventListener("click", () => {
      enabled = !enabled;
      document.documentElement.classList.toggle("big-text", enabled);
      btn.classList.toggle("active", enabled);
      btn.setAttribute("aria-pressed", String(enabled));
    });
    document.body.appendChild(btn);
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
     Init
     ------------------------------------------------ */
  function init() {
    positionOrbitalNodes();
    initWallpaperPage();
    initCosmicPopup();
    initAccessibilityToggle();
    initCursorSparkle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.__CONSTELLATION__ = { SECTIONS, wallpaperUrl };
})();
