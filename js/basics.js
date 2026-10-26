/* Pagina "De basics" voor starters: kort en duidelijk */
window.BASICS_HTML = `
<div class="basics">
  <p class="lead">Vier stappen om goed te starten. Twijfel je? Vraag het gerust aan je instructeur.</p>

  <section class="step">
    <h2><span class="n">1</span>Zo sta je</h2>
    <ul class="ticks">
      <li class="yes"><i></i><span>Sta <b>rechtop</b>, schouders laag en los.</span></li>
      <li class="yes"><i></i><span>Voeten even ver uit elkaar als je schouders.</span></li>
      <li class="yes"><i></i><span>De trommel hangt ongeveer op de hoogte van je <b>middel</b>.</span></li>
      <li class="yes"><i></i><span>Ellebogen losjes naast je lijf, niet naar buiten.</span></li>
    </ul>
  </section>

  <section class="step">
    <h2><span class="n">2</span>Zo pak je de stokken</h2>
    <figure class="grip">
      <svg viewBox="0 0 600 156" role="img" aria-label="Een stok met het draaipunt op een derde van het achterste uiteinde">
        <text x="200" y="34" text-anchor="middle" class="t red">duim + wijsvinger</text>
        <rect x="20" y="72" width="530" height="18" rx="9" fill="var(--ink)"/>
        <ellipse cx="560" cy="81" rx="16" ry="13" fill="var(--ink)"/>
        <line x1="200" y1="50" x2="200" y2="112" stroke="var(--red)" stroke-width="6" stroke-linecap="round"/>
        <circle cx="200" cy="81" r="18" fill="var(--red)" stroke="var(--bone)" stroke-width="4"/>
        <path d="M22 140 H196 M22 130 v20 M196 130 v20" stroke="var(--muted)" stroke-width="3"/>
        <text x="109" y="134" text-anchor="middle" class="t muted">⅓</text>
        <text x="576" y="134" text-anchor="end" class="t muted">kop</text>
      </svg>
    </figure>
    <ul class="ticks">
      <li class="yes"><i></i><span>Pak de stok vast op ongeveer <b>een derde</b> van het achterste uiteinde.</span></li>
      <li class="yes"><i></i><span><b>Duim en wijsvinger</b> houden de stok vast. Dat is het draaipunt.</span></li>
      <li class="yes"><i></i><span>Je andere vingers liggen <b>los</b> rond de stok.</span></li>
      <li class="yes"><i></i><span>Rug van je hand naar boven. Links en rechts hetzelfde.</span></li>
      <li class="no"><i></i><span>Niet knijpen! Dan kan de stok niet veren en doet je hand pijn.</span></li>
    </ul>
  </section>

  <section class="step">
    <h2><span class="n">3</span>Zo sla je</h2>
    <ul class="ticks">
      <li class="yes"><i></i><span>Begin met de stok omhoog, zo'n <b>15 cm</b> boven het vel.</span></li>
      <li class="yes"><i></i><span><b>Laat de stok vallen</b> en laat hem terugveren naar waar hij begon. Niet in het vel duwen.</span></li>
      <li class="yes"><i></i><span>Sla in het <b>midden</b> van het vel.</span></li>
      <li class="yes"><i></i><span>Links en rechts even hoog, dan klinken ze even luid.</span></li>
    </ul>
  </section>

  <section class="step">
    <h2><span class="n">4</span>Oefen mee</h2>
    <p>Speel op elke tik van de metronoom één slag. Het oplichtende vakje zegt welke hand.</p>
    <div class="seg" role="group" aria-label="Oefening">
      <button type="button" data-pat="RLRLRLRL" aria-pressed="true">Om de beurt</button>
      <button type="button" data-pat="RRLLRRLL" aria-pressed="false">Telkens twee</button>
    </div>
    <div class="rl" id="rl" aria-hidden="true">
      <b>R</b><b>L</b><b>R</b><b>L</b><b>R</b><b>L</b><b>R</b><b>L</b>
    </div>
    <div class="rlbar">
      <button type="button" class="btn rlgo" id="rl-go">Start</button>
      <span class="rltempo" role="group" aria-label="Tempo">
        <button type="button" class="chip" data-rlbpm="60">60</button>
        <button type="button" class="chip" data-rlbpm="70">70</button>
        <button type="button" class="chip" data-rlbpm="80">80</button>
      </span>
    </div>
    <p class="small">Lukt het rustig en gelijk? Zet het tempo een tikje hoger. Liever traag en juist dan snel en slordig.</p>
  </section>
</div>`;
