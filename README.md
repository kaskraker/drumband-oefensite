# Oefensite Drumband Ingelmunster

Statische site, geen build nodig. Zet de hoofdmap online (Netlify, Cloudflare Pages of GitHub Pages).

- `index.html`: pagina met PDF-lezer en metronoom
- `data.js`: de lijst met stukken, partijen, video's en oefeningen
- `css/`, `js/`: stijl en logica
- `files/`: partituren (PDF), per stuk
- `video/`: oefenvideo's
- `fonts/`, `img/`: lettertypen en logo's uit de huisstijl (Lulo Clean, TT Commons)
- `vendor/`: pdf.js (toont de PDF's op de site)

Een stuk toevoegen: zet de PDF's in `files/<stuk>/` en voeg het stuk toe in `data.js`
met `status` `actueel`, `classic` of `archief`.

Een partij enkel voor één groep tonen: geef die partij in `data.js` een `levels`-lijst,
bv. `"levels": ["gevorderd"]`. Partijen zonder `levels` ziet iedereen die het stuk ziet.

## Afspelen met meelopende partituur

Voor stukken met een MuseScore-bestand kan de site de partituur zelf afspelen, met echte
drumopnames, in elk tempo, met een markering die meeloopt op de PDF. Klik op een maat om
daar te beginnen. Marsvaardig Junior werkt zo.

Een stuk toevoegen:

1. Zet de speeldata om (notenbalk-nummer na de `:` als één bestand meerdere partijen heeft):
   `python3 tools/mscz2json.py score/<stuk>.json snare=STUK.mscz bas=STUK_bas.mscz:1 tenor=STUK_bas.mscz:2`
2. Voeg de maatposities van elke PDF toe (zie hoe `score/marsvaardig-junior.json` het doet,
   met `tools/pdfmaten.py`). Werkt met PDF's die rechtstreeks uit MuseScore komen.
3. Geef het stuk in `data.js` `"score": "score/<stuk>.json"` en elke partij een `"voice"`
   (`snare`, `bas` of `tenor`).

Het geluid (`audio/drums.wav`) komt uit de Versilian Community Sample Library (CC0),
gebouwd met `tools/samples.py`.
