# CA Cesta dobrodruha · Maroko 2026

Landing page výpravy „Maroko 2026" postavená podle grafického návrhu „Maroko Landing v3" (Claude Design) a brand manuálu v1.0.

## Struktura

- `index.html` – hlavní stránka (sekce pod sebou, kotvy `#program`, `#cena`, `#zaloha`, `#otazky`, `#formular`); dole formulář „Zavolejte mi" pro dotazy
- `chci-jet.html` – samostatná stránka s přihláškou (dotazník + platební údaje k záloze), vedou na ni všechna tlačítka Chci jet
- `css/styles.css` – design tokeny značky (Písek, Uhel, Terakota, Hlubina, Kámen) a styly sekcí
- `js/main.js` – navigace, kreslení trasy při scrollu, akordeon otázek, validace formulářů, sticky lišta na mobilu; formuláře se ukládají do Supabase (projekt `cesta-dobrodruha`): přihláška přes RPC `podat_prihlasku`, dotazy do tabulky `dotazy`, e-maily na program do `zajemci_pdf`
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
