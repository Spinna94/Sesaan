#!/usr/bin/env python3
"""Rigenera il catalogo noleggio dai prodotti WooCommerce di sesaan.com.

Scarica i prodotti dall'API pubblica Store di WooCommerce, le miniature
in assets/img/catalogo/ e scrive assets/data/products.json usato dalla
pagina. Da rilanciare quando i prodotti su WordPress cambiano:

    python3 scripts/aggiorna-catalogo.py
"""

import html
import json
import re
import urllib.request
from pathlib import Path

API = "https://sesaan.com/wp-json/wc/store/v1/products?per_page=100"
ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "assets" / "img" / "catalogo"
DATA_FILE = ROOT / "assets" / "data" / "products.json"

# Mappa categorie WooCommerce -> filtri della pagina (il primo che
# combacia vince; "Ambiente" e "Outlet" sono trasversali e si ignorano)
GRUPPI = [
    ("Sedute", {"Sedie e sgabelli", "Poltrone", "Sedie e poltrone", "Divani e pouf"}),
    ("Tavoli e tavolini", {"Tavoli e tavolini", "Tavolini", "Tavoli"}),
    ("Illuminazione", {"Illuminazione"}),
    ("Specchi", {"Specchi"}),
    ("Mobili e credenze", {"Mobili", "Credenze", "Cucina"}),
    ("Complementi e decorazioni", {"Complemento d’arredo", "Complemento d'arredo",
                                   "Decorazioni", "Decorazioni da parete",
                                   "Soprammobili", "Vasi", "Esterni"}),
]


def pulisci(testo: str) -> str:
    testo = re.sub(r"<[^>]+>", " ", testo or "")
    testo = html.unescape(testo)
    return re.sub(r"\s+", " ", testo).strip()


def gruppo_di(categorie: list[str]) -> str:
    for nome, insieme in GRUPPI:
        if insieme & set(categorie):
            return nome
    return "Complementi e decorazioni"


def main() -> None:
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)

    with urllib.request.urlopen(API) as r:
        prodotti = json.load(r)

    catalogo = []
    for p in prodotti:
        if not p["is_in_stock"] or not p["images"]:
            continue

        nome = pulisci(p["name"])
        designer = ""
        if "–" in nome:
            nome, designer = (s.strip() for s in nome.split("–", 1))

        url_img = p["images"][0]["thumbnail"] or p["images"][0]["src"]
        estensione = Path(url_img.split("?")[0]).suffix or ".png"
        file_img = f"{p['slug']}{estensione}"
        destinazione = IMG_DIR / file_img
        if not destinazione.exists():
            urllib.request.urlretrieve(url_img, destinazione)

        # la descrizione breve dell'ecommerce è spesso un placeholder di
        # spedizione, o contiene solo il nome del designer
        breve = pulisci(p["short_description"])
        if breve.lower().startswith(("spedizione", "disponibile per il noleggio")):
            breve = ""
        if breve and not designer and len(breve) < 35 and len(breve.split()) <= 4:
            designer, breve = breve, ""

        descrizione = breve or pulisci(p["description"])
        if len(descrizione) > 160:
            descrizione = descrizione[:157].rsplit(" ", 1)[0] + "…"

        categorie = [pulisci(c["name"]) for c in p["categories"]]
        catalogo.append({
            "nome": nome,
            "designer": designer,
            "gruppo": gruppo_di(categorie),
            "descrizione": descrizione,
            "img": f"assets/img/catalogo/{file_img}",
            "scheda": p["permalink"],
        })

    catalogo.sort(key=lambda x: (x["gruppo"], x["nome"]))
    DATA_FILE.write_text(
        json.dumps(catalogo, ensure_ascii=False, indent=1) + "\n", encoding="utf-8"
    )
    print(f"{len(catalogo)} prodotti in {DATA_FILE.relative_to(ROOT)}")
    print(f"immagini in {IMG_DIR.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
