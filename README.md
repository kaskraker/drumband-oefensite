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
