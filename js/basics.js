/* Pagina "De basics" voor starters, gebaseerd op de cursus "Van Pam tot roffel" */
window.BASICS_HTML = `
<div class="basics">
  <p class="lead">Vier stappen om goed te starten. Twijfel je? Vraag het gerust aan je instructeur.</p>

  <section class="step">
    <h2><span class="n">1</span>Zo sta je</h2>
    <figure class="art">
      <svg viewBox="0 0 440 400" role="img" aria-label="Zijaanzicht: rechte rug, ellebogen iets van het lijf, trommel op middelhoogte">
        <line x1="10" y1="240" x2="430" y2="240" class="guide"/>
        <text x="10" y="230" class="t muted">middel</text>
        <line x1="112" y1="70" x2="112" y2="260" class="guide red"/>
        <text x="98" y="160" text-anchor="end" class="t red">Rechte</text>
        <text x="98" y="184" text-anchor="end" class="t red">rug</text>
        <line x1="20" y1="380" x2="420" y2="380" stroke="var(--line)" stroke-width="4" stroke-linecap="round"/>
        <!-- standaard -->
        <path d="M330 312 L300 378 M330 312 V378 M330 312 L360 378" fill="none" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/>
        <!-- trommel -->
        <rect x="262" y="240" width="136" height="64" fill="var(--red)"/>
        <path d="M292 244 V300 M330 244 V300 M368 244 V300" stroke="var(--bone)" stroke-width="3" opacity=".7"/>
        <rect x="258" y="234" width="144" height="10" rx="4" fill="var(--ink)"/>
        <rect x="258" y="300" width="144" height="10" rx="4" fill="var(--ink)"/>
        <!-- lichaam -->
        <circle cx="160" cy="44" r="28" fill="var(--ink)"/>
        <line x1="150" y1="108" x2="150" y2="222" stroke="var(--ink)" stroke-width="54" stroke-linecap="round"/>
        <line x1="148" y1="252" x2="148" y2="370" stroke="var(--ink)" stroke-width="34" stroke-linecap="round"/>
        <line x1="148" y1="372" x2="186" y2="372" stroke="var(--ink)" stroke-width="16" stroke-linecap="round"/>
        <!-- arm en stok -->
        <path d="M158 116 L188 198 L250 214" fill="none" stroke="var(--paper)" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M158 116 L188 198 L250 214" fill="none" stroke="var(--ink)" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="236" y1="207" x2="326" y2="232" stroke="var(--ink)" stroke-width="11" stroke-linecap="round"/>
        <line x1="236" y1="207" x2="326" y2="232" stroke="var(--wood)" stroke-width="6" stroke-linecap="round"/>
        <circle cx="254" cy="214" r="13" fill="var(--ink)" stroke="var(--paper)" stroke-width="4"/>
        <!-- label elleboog -->
        <path d="M232 126 L196 186" class="lead-line"/>
        <circle cx="194" cy="190" r="5" fill="var(--red)"/>
        <text x="232" y="100" class="t red">Ellebogen iets</text>
        <text x="232" y="124" class="t red">van je lijf</text>
      </svg>
    </figure>
    <ul class="ticks">
      <li class="yes"><i></i><span><b>Rechte rug</b>, schouders laag en los.</span></li>
      <li class="yes"><i></i><span>Armen natuurlijk naast je lijf, <b>ellebogen iets van je lijf</b>.</span></li>
      <li class="yes"><i></i><span>De trommel staat of hangt ongeveer op <b>middelhoogte</b>.</span></li>
      <li class="yes"><i></i><span>Je beweegt vooral met je <b>pols en onderarm</b>, niet met je schouder.</span></li>
    </ul>
  </section>

  <section class="step">
    <h2><span class="n">2</span>Zo pak je de stokken</h2>
    <div class="arts">
      <figure class="art">
        <svg viewBox="0 0 600 150" role="img" aria-label="De stok vastnemen op ongeveer 12 centimeter van het achterste uiteinde" style="--fs:28px">
        <text x="182" y="30" text-anchor="middle" class="t red">duim + wijsvinger</text>
        <path d="M28 61 H380 L545 66 V74 L380 79 H28 A9 9 0 0 1 28 61 Z" fill="var(--wood)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
        <ellipse cx="557" cy="70" rx="14" ry="9" fill="var(--wood)" stroke="var(--ink)" stroke-width="3"/>
        <line x1="182" y1="44" x2="182" y2="96" stroke="var(--red)" stroke-width="5" stroke-linecap="round"/>
        <circle cx="182" cy="70" r="15" fill="var(--red)" stroke="var(--paper)" stroke-width="4"/>
        <path d="M22 116 H180 M22 106 v20 M180 106 v20" stroke="var(--muted)" stroke-width="3"/>
        <text x="101" y="146" text-anchor="middle" class="t muted">± 12 cm</text>
        <text x="572" y="112" text-anchor="end" class="t muted">kop</text>
      </svg>
        <figcaption>Waar je de stok vastneemt</figcaption>
      </figure>
      <figure class="art">
        <svg viewBox="0 0 420 330" role="img" aria-label="Bovenaanzicht: de stokken vormen een V en raken het midden van het vel">
        <circle cx="210" cy="140" r="118" fill="var(--paper)" stroke="var(--ink)" stroke-width="6"/>
        <circle cx="210" cy="140" r="104" fill="none" stroke="var(--line)" stroke-width="2"/>
        <rect x="317.6" y="182.5" width="14" height="10" rx="3" fill="var(--ink)" transform="rotate(112.5 324.6 187.5)"/><rect x="250.5" y="249.6" width="14" height="10" rx="3" fill="var(--ink)" transform="rotate(157.5 257.5 254.6)"/><rect x="155.5" y="249.6" width="14" height="10" rx="3" fill="var(--ink)" transform="rotate(202.5 162.5 254.6)"/><rect x="88.4" y="182.5" width="14" height="10" rx="3" fill="var(--ink)" transform="rotate(247.5 95.4 187.5)"/><rect x="88.4" y="87.5" width="14" height="10" rx="3" fill="var(--ink)" transform="rotate(292.5 95.4 92.5)"/><rect x="155.5" y="20.4" width="14" height="10" rx="3" fill="var(--ink)" transform="rotate(337.5 162.5 25.4)"/><rect x="250.5" y="20.4" width="14" height="10" rx="3" fill="var(--ink)" transform="rotate(382.5 257.5 25.4)"/><rect x="317.6" y="87.5" width="14" height="10" rx="3" fill="var(--ink)" transform="rotate(427.5 324.6 92.5)"/>
        <circle cx="210" cy="146" r="34" class="guide red" fill="none"/>
        <text x="210" y="96" text-anchor="middle" class="t red">midden</text>
        <line x1="87" y1="268" x2="20" y2="360" stroke="var(--ink)" stroke-width="30" stroke-linecap="round"/>
        <line x1="333" y1="268" x2="400" y2="360" stroke="var(--ink)" stroke-width="30" stroke-linecap="round"/>
        <line x1="44" y1="314" x2="196" y2="150" stroke="var(--ink)" stroke-width="14" stroke-linecap="round"/>
        <line x1="44" y1="314" x2="196" y2="150" stroke="var(--wood)" stroke-width="8" stroke-linecap="round"/>
        <line x1="376" y1="314" x2="224" y2="150" stroke="var(--ink)" stroke-width="14" stroke-linecap="round"/>
        <line x1="376" y1="314" x2="224" y2="150" stroke="var(--wood)" stroke-width="8" stroke-linecap="round"/>
        <circle cx="196" cy="150" r="7" fill="var(--wood)" stroke="var(--ink)" stroke-width="3"/>
        <circle cx="224" cy="150" r="7" fill="var(--wood)" stroke="var(--ink)" stroke-width="3"/>
        <ellipse cx="88" cy="267" rx="30" ry="21" fill="var(--ink)" transform="rotate(-47 88 267)"/>
        <ellipse cx="332" cy="267" rx="30" ry="21" fill="var(--ink)" transform="rotate(47 332 267)"/>
        <text x="210" y="318" text-anchor="middle" class="t">V-vorm, elk ± 45°</text>
      </svg>
        <figcaption>Van bovenaf gezien</figcaption>
      </figure>
    </div>
    <ul class="ticks">
      <li class="yes"><i></i><span>Neem de stok vast op <b>± 12 cm</b> van het achterste uiteinde.</span></li>
      <li class="yes"><i></i><span>Hou hem tussen <b>duim en wijsvinger</b>, met je duim óp de stok.</span></li>
      <li class="yes"><i></i><span>Je andere vingers liggen <b>los</b> rond de stok en bewegen mee.</span></li>
      <li class="yes"><i></i><span>Handpalmen naar beneden, licht naar binnen gedraaid. De stokken vormen een <b>V</b>.</span></li>
      <li class="no"><i></i><span>Niet knijpen! Dan kan de stok niet veren en doet je hand pijn.</span></li>
    </ul>
  </section>

  <section class="step">
    <h2><span class="n">3</span>Zo sla je</h2>
    <figure class="art stroke-anim">
      <svg viewBox="0 0 470 240" role="img" aria-label="Animatie: de stok gaat omhoog, valt op het vel en veert terug omhoog">
        <line x1="70" y1="150" x2="18" y2="196" stroke="var(--ink)" stroke-width="28" stroke-linecap="round"/>
        <line x1="70" y1="150" x2="308" y2="23" class="ghost"/>
        <path d="M362 30 V172 M352 30 h20 M352 172 h20" stroke="var(--muted)" stroke-width="3"/>
        <text x="376" y="108" class="t muted">± 30 cm</text>
        <rect x="214" y="180" width="236" height="48" fill="var(--red)"/>
        <path d="M254 184 V224 M332 184 V224 M410 184 V224" stroke="var(--bone)" stroke-width="3" opacity=".7"/>
        <rect x="208" y="174" width="248" height="10" rx="4" fill="var(--ink)"/>
        <rect x="208" y="224" width="248" height="10" rx="4" fill="var(--ink)"/>
        <ellipse class="ripple" cx="336" cy="176" rx="30" ry="7" fill="none" stroke="var(--red)" stroke-width="4"/>
        <g class="swing">
          <line x1="40" y1="150" x2="336" y2="150" stroke="var(--ink)" stroke-width="13" stroke-linecap="round"/>
          <line x1="40" y1="150" x2="336" y2="150" stroke="var(--wood)" stroke-width="7" stroke-linecap="round"/>
          <ellipse cx="342" cy="150" rx="10" ry="7" fill="var(--wood)" stroke="var(--ink)" stroke-width="3"/>
        </g>
        <circle cx="70" cy="150" r="20" fill="var(--ink)" stroke="var(--paper)" stroke-width="4"/>
      </svg>
      <ol class="phases" aria-hidden="true"><li class="p1">Omhoog</li><li class="p2">Laten vallen</li><li class="p3">Terugveren</li></ol>
    </figure>
    <ul class="ticks">
      <li class="yes"><i></i><span>Begin met de stok omhoog, zo'n <b>30 cm</b> boven het vel bij trage oefeningen.</span></li>
      <li class="yes"><i></i><span><b>Laat de stok vallen</b> en laat hem terugveren naar waar hij begon. Niet in het vel duwen.</span></li>
      <li class="yes"><i></i><span>Sla in het <b>midden</b> van het vel. Zoals met een hamer, maar dan losjes.</span></li>
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
