/* SESAAN — Noleggio: catalogo + animazioni di scroll (GSAP ScrollTrigger) */

/* --- Catalogo: prodotti da assets/data/products.json (generato da
       scripts/aggiorna-catalogo.py a partire dal WooCommerce del sito) --- */
(function () {
  const grid = document.getElementById("cat-grid");
  const filters = document.getElementById("cat-filters");
  const empty = document.getElementById("cat-empty");
  if (!grid) return;

  const esc = (s) =>
    s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const card = (p) => `
    <article class="cat-card">
      <figure><img src="${esc(p.img)}" alt="${esc(p.nome)}" loading="lazy" width="300" height="300"></figure>
      <h3>${esc(p.nome)}</h3>
      ${p.designer ? `<p class="cat-designer">${esc(p.designer)}</p>` : ""}
      ${p.descrizione ? `<p class="cat-desc">${esc(p.descrizione)}</p>` : ""}
      <div class="cat-links">
        <a href="mailto:info@sesaan.it?subject=${encodeURIComponent("Noleggio — " + p.nome)}">Richiedi</a>
        <a class="cat-scheda" href="${esc(p.scheda)}" target="_blank" rel="noopener">Scheda</a>
      </div>
    </article>`;

  fetch("assets/data/products.json")
    .then((r) => r.json())
    .then((prodotti) => {
      const gruppi = ["Tutti", ...new Set(prodotti.map((p) => p.gruppo))];

      const render = (gruppo) => {
        const visibili =
          gruppo === "Tutti" ? prodotti : prodotti.filter((p) => p.gruppo === gruppo);
        grid.innerHTML = visibili.map(card).join("");
        empty.hidden = visibili.length > 0;
        if (typeof gsap !== "undefined" &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          gsap.from(".cat-card", { opacity: 0, y: 20, duration: 0.5, stagger: 0.03, ease: "power2.out" });
        }
      };

      filters.innerHTML = gruppi
        .map((g) => `<button type="button" aria-pressed="${g === "Tutti"}">${esc(g)}</button>`)
        .join("");

      filters.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        filters.querySelectorAll("button").forEach((b) =>
          b.setAttribute("aria-pressed", String(b === btn)));
        render(btn.textContent);
      });

      render("Tutti");
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    })
    .catch(() => {
      empty.hidden = false;
      empty.textContent = "Catalogo momentaneamente non disponibile.";
    });
})();

(function () {
  // --- Animazioni di scroll ---
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || typeof gsap === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  // Stato iniziale nascosto solo se il JS è attivo (niente pagina vuota senza JS)
  gsap.set(".reveal", { opacity: 0 });
  gsap.set(".reveal-img", { opacity: 0 });

  // Testi: fade-up, in sequenza quando più elementi entrano insieme
  ScrollTrigger.batch(".reveal", {
    start: "top 88%",
    once: true,
    onEnter: (els) =>
      gsap.fromTo(
        els,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out" }
      ),
  });

  // Immagini: leggero scale-down + fade
  ScrollTrigger.batch(".reveal-img", {
    start: "top 88%",
    once: true,
    onEnter: (els) =>
      gsap.fromTo(
        els,
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 1.1, stagger: 0.1, ease: "power2.out" }
      ),
  });

  // Parallasse leggera sull'immagine hero full-width
  gsap.to(".hero-banner img", {
    yPercent: 10,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-banner",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
})();
