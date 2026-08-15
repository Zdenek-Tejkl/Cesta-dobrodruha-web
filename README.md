# CA Cesta dobrodruha · Maroko 2026

Landing page výpravy „Maroko 2026" postavená podle grafického návrhu „Maroko Landing v3" (Claude Design) a brand manuálu v1.0.

## Struktura

- `index.html` – celá stránka (jedna page, sekce pod sebou, kotvy `#program`, `#cena`, `#zaloha`, `#otazky`, `#formular`)
- `css/styles.css` – design tokeny značky (Písek, Uhel, Terakota, Hlubina, Kámen) a styly sekcí
- `js/main.js` – navigace, kreslení trasy při scrollu, akordeon otázek, validace formulářů, sticky lišta na mobilu; dotazník a e-maily na program se ukládají do Supabase (projekt `cesta-dobrodruha`, RPC `podat_prihlasku` + tabulka `zajemci_pdf`)
- `assets/` – fotografie z vlastní cesty

## Spuštění

Statická stránka bez build kroku. Stačí otevřít `index.html`, případně:

```
python3 -m http.server 8000
```

a otevřít http://localhost:8000.

## Před spuštěním doplnit

- pořádající cestovní kancelář a její pojištění pro případ úpadku (placeholdery `[DOPLNIT]` v patičce, ve `vop.html` a v `ochrana-osobnich-udaju.html`; web běží v režimu cestovní agentury, IČO 19804962)
- fotky obou průvodců (medailonky už jsou doplněné)
- číslo účtu pro zálohu (placeholder `[DOPLNIT]` v platebních údajích po odeslání dotazníku a ve `vop.html`)
- odkazy na Instagram a Facebook
- právní texty (`vop.html`, `ochrana-osobnich-udaju.html`) jsou pracovní návrh; před spuštěním nechat zkontrolovat právníkem
