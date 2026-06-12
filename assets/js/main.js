/* SESAAN — Noleggio: animazioni di scroll (GSAP ScrollTrigger) */

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
