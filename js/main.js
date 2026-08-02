/* ==========================================
   MOTOROLA CONSTELLATION - main.js
   Astral ring positioning, navigation & wallpaper
   ========================================== */

(function () {
  "use strict";

  /* ------------------------------------------------
     Configuration: the 9 sections / wallpapers
     ------------------------------------------------ */
  // 👇 Reemplaza los placeholders por las rutas de tus wallpapers reales:
  //    "assets/wallpapers/nombre.jpg"  (alta resolución 1920×1080 o superior)
  const SECTIONS = [
    { id: 1, title: "Amanecer Cósmico", colorVar: "--neon-cyan", wallpaper: "https://picsum.photos/seed/motorola-wp-1/1920/1080" },
    { id: 2, title: "Nebulosa Violeta", colorVar: "--neon-purple", wallpaper: "https://picsum.photos/seed/motorola-wp-2/1920/1080" },
    { id: 3, title: "Constelación Írida", colorVar: "--neon-magenta", wallpaper: "https://picsum.photos/seed/motorola-wp-3/1920/1080" },
    { id: 4, title: "Horizonte Galáctico", colorVar: "--neon-cyan", wallpaper: "https://picsum.photos/seed/motorola-wp-4/1920/1080" },
    { id: 5, title: "Agujero de Gusano", colorVar: "--neon-pink", wallpaper: "https://picsum.photos/seed/motorola-wp-5/1920/1080" },
    { id: 6, title: "Supernova", colorVar: "--neon-magenta", wallpaper: "https://picsum.photos/seed/motorola-wp-6/1920/1080" },
    { id: 7, title: "Andrómeda", colorVar: "--neon-purple", wallpaper: "https://picsum.photos/seed/motorola-wp-7/1920/1080" },
    { id: 8, title: "Pulsar", colorVar: "--neon-cyan", wallpaper: "https://picsum.photos/seed/motorola-wp-8/1920/1080" },
    { id: 9, title: "Vía Láctea", colorVar: "--neon-pink", wallpaper: "https://picsum.photos/seed/motorola-wp-9/1920/1080" },
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

  /* ------------------------------------------------
     RING POSITIONING (orbital buttons on index page)
     ------------------------------------------------ */
  function positionOrbitalNodes() {
    const ring = document.querySelector(".astral-ring");
    if (!ring) return;

    const nodes = ring.querySelectorAll(".orbit-node");
    const count = nodes.length;
    const radius = 190; // px from hub center

    // Assign color + click handler once
    nodes.forEach((node, i) => {
      const section = SECTIONS[i] || SECTIONS[i % SECTIONS.length];
      const label = node.querySelector(".node-label");
      if (label) {
        label.className = "node-label " + (NEON_CLASS[section.colorVar] || "neon-magenta");
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
        node.style.transform = `translate(${x}px, ${y}px)`;
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
    if (meta) meta.textContent = `Sección ${section.id} · Resolución 1920×1080`;
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
      downloadBtn.download = `motorola-constellation-${section.id}.jpg`;
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
     Init
     ------------------------------------------------ */
  function init() {
    positionOrbitalNodes();
    initWallpaperPage();
    initCosmicPopup();
    initAccessibilityToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.__CONSTELLATION__ = { SECTIONS, wallpaperUrl };
})();
