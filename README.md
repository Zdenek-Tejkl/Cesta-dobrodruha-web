# CK Cesta dobrodruha · Maroko 2026

Landing page výpravy „Maroko 2026" postavená podle grafického návrhu „Maroko Landing v3" (Claude Design) a brand manuálu v1.0.

## Struktura

- `index.html` – celá stránka (jedna page, sekce pod sebou, kotvy `#program`, `#cena`, `#zaloha`, `#otazky`, `#formular`)
- `css/styles.css` – design tokeny značky (Písek, Uhel, Terakota, Hlubina, Kámen) a styly sekcí
- `js/main.js` – navigace, kreslení trasy při scrollu, akordeon otázek, validace formulářů, sticky lišta na mobilu
- `assets/` – fotografie z vlastní cesty

## Spuštění

Statická stránka bez build kroku. Stačí otevřít `index.html`, případně:

```
python3 -m http.server 8000
```

a otevřít http://localhost:8000.

## Před spuštěním doplnit

- IČO, pojišťovna a číslo pojistky v patičce (placeholdery `[DOPLNIT]`)
- jména, medailonky a fotky obou průvodců
- fotka „ruce s kladívkem a fosilií" v sekci Dobrodruzi, ne turisté
- odkazy: doklad o pojištění (PDF), VOP, ochrana osobních údajů, Instagram, Facebook
- napojení formulářů na backend nebo formulářovou službu (`js/main.js`, dnes ukládají odeslání jen do `localStorage`)
