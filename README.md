# SESAAN — Noleggio e allestimenti

Pagina web statica dedicata al servizio di **noleggio arredi e allestimenti**, spin-off del sito principale [sesaan.com](https://sesaan.com).

## Struttura

- `index.html` — pagina unica (hero, per chi, catalogo, come funziona, contatti)
- `assets/css/style.css` — stili (palette e tipografia riprese dal sito principale: Geometos + Playfair Display + Inter, #222222 / #39482D)
- `assets/js/main.js` — rendering e filtri del catalogo, animazioni di scroll con GSAP ScrollTrigger (CDN)
- `assets/img/` — immagini e logo provenienti dal sito WordPress originale
- `assets/data/products.json` — catalogo noleggio (generato, non modificare a mano)
- `scripts/aggiorna-catalogo.py` — rigenera il catalogo dai prodotti WooCommerce di sesaan.com

## Aggiornare il catalogo

Quando i prodotti su WordPress cambiano:

```bash
python3 scripts/aggiorna-catalogo.py
git add -A && git commit -m "Aggiorna catalogo" && git push
```

## Sviluppo locale

Nessuna build necessaria: è HTML/CSS/JS puro.

```bash
python3 -m http.server 8000
# poi apri http://localhost:8000
```

## Pubblicazione

Pensata per GitHub Pages (branch `main`, root).
