# SESAAN — Noleggio e allestimenti

Pagina web statica dedicata al servizio di **noleggio arredi e allestimenti**, spin-off del sito principale [sesaan.com](https://sesaan.com).

## Struttura

- `index.html` — pagina unica (hero, per chi, cosa noleggiamo, come funziona, contatti)
- `assets/css/style.css` — stili (palette e tipografia riprese dal sito principale: Playfair Display + Inter, #222222 / #39482D)
- `assets/js/main.js` — menu mobile e animazioni di scroll con GSAP ScrollTrigger (CDN)
- `assets/img/` — immagini e logo provenienti dal sito WordPress originale

## Sviluppo locale

Nessuna build necessaria: è HTML/CSS/JS puro.

```bash
python3 -m http.server 8000
# poi apri http://localhost:8000
```

## Pubblicazione

Pensata per GitHub Pages (branch `main`, root).
