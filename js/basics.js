/* Pagina "De basics" voor starters: illustraties en animaties in SVG */
window.BASICS_HTML = `
<div class="basics">
  <p class="lead">Wil je een echte trommelaar worden? Dit zijn de vier dingen die je moet weten.</p>

  <section class="step">
    <h2><span class="n">1</span>Zo sta je</h2>
    <figure class="art">
      <svg viewBox="0 0 520 380" role="img" aria-label="Een kind staat rechtop achter een trommel die op taillehoogte staat">
        <line class="o" x1="40" y1="352" x2="490" y2="352"/>
        <!-- standaard -->
        <path class="o" d="M400 292 L362 352 M400 292 L400 352 M400 292 L440 352" fill="none"/>
        <!-- benen en schoen -->
        <rect class="o" x="200" y="212" width="44" height="128" rx="14" fill="var(--ink)"/>
        <path class="o" d="M196 340 h62 a12 12 0 0 1 0 12 h-74 a8 8 0 0 1 12 -12z" fill="var(--red)"/>
        <!-- lijf -->
        <rect class="o" x="188" y="104" width="76" height="130" rx="26" fill="var(--red)"/>
        <!-- hoofd -->
        <circle class="o" cx="228" cy="66" r="34" fill="var(--bone)"/>
        <path class="o" d="M194 62 a34 34 0 0 1 68 0 z" fill="var(--ink)"/>
        <circle cx="244" cy="70" r="3.5" fill="var(--ink)"/>
        <path class="o" d="M238 82 q8 7 16 0" fill="none"/>
        <!-- arm -->
        <path class="o" d="M228 128 L232 190 L306 206" fill="none" stroke-width="26"/>
        <path d="M228 128 L232 190 L306 206" fill="none" stroke="var(--bone)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
        <circle class="o" cx="310" cy="206" r="13" fill="var(--bone)"/>
        <!-- stok -->
        <path class="o" d="M288 216 L412 160" fill="none" stroke-width="11"/>
        <path d="M288 216 L412 160" fill="none" stroke="var(--bone)" stroke-width="5" stroke-linecap="round"/>
        <circle class="o" cx="414" cy="159" r="7" fill="#fff"/>
        <!-- trommel -->
        <rect class="o" x="330" y="244" width="140" height="52" rx="8" fill="var(--red)"/>
        <ellipse class="o" cx="400" cy="244" rx="70" ry="11" fill="#fff"/>
        <!-- nummers -->
        <g class="pin"><circle cx="228" cy="22" r="14"/><text x="228" y="28" text-anchor="middle">1</text></g>
        <g class="pin"><circle cx="262" cy="118" r="14"/><text x="262" y="124" text-anchor="middle">2</text></g>
        <g class="pin"><circle cx="160" cy="190" r="14"/><text x="160" y="196" text-anchor="middle">3</text></g>
        <g class="pin"><circle cx="400" cy="214" r="14"/><text x="400" y="220" text-anchor="middle">4</text></g>
        <g class="pin"><circle cx="300" cy="332" r="14"/><text x="300" y="338" text-anchor="middle">5</text></g>
        <path d="M176 190 h20" stroke="var(--red)" stroke-width="3" stroke-linecap="round"/>
      </svg>
    </figure>
    <ol class="legend">
      <li>Hoofd recht, kijk vooruit</li>
      <li>Schouders laag en los</li>
      <li>Ellebogen dicht bij je lijf</li>
      <li>Trommel ongeveer ter hoogte van je middel</li>
      <li>Voeten even ver uit elkaar als je schouders</li>
    </ol>
    <p class="small">Zit je? Zit rechtop, niet helemaal vooraan op de stoel. Heb je een draagriem? Vraag een begeleider om hem af te stellen.</p>
  </section>

  <section class="step">
    <h2><span class="n">2</span>Zo pak je de stokken</h2>
    <figure class="art">
      <svg viewBox="0 0 520 250" role="img" aria-label="Een trommelstok met het draaipunt op een derde van het dikke einde">
        <!-- afstand -->
        <path d="M34 218 H183 M183 218 H490" stroke="var(--ink)" stroke-width="2" fill="none"/>
        <path d="M34 210 v16 M183 210 v16 M490 210 v16" stroke="var(--ink)" stroke-width="2"/>
        <text class="t" x="108" y="244" text-anchor="middle">⅓</text>
        <text class="t" x="336" y="244" text-anchor="middle">⅔</text>
        <!-- losse vingers -->
        <g class="o" fill="var(--bone)">
          <rect x="56" y="124" width="30" height="62" rx="15"/>
          <rect x="92" y="124" width="30" height="66" rx="15"/>
          <rect x="128" y="124" width="30" height="58" rx="15"/>
        </g>
        <!-- stok die kan draaien -->
        <g class="wob">
          <rect class="o" x="26" y="96" width="470" height="24" rx="12" fill="var(--bone)"/>
          <circle class="o" cx="486" cy="108" r="13" fill="#fff"/>
          <path d="M60 108 H470" stroke="var(--ink)" stroke-opacity=".18" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/>
        </g>
        <!-- duim en wijsvinger -->
        <g class="o" fill="var(--red)">
          <rect x="164" y="42" width="30" height="70" rx="15" transform="rotate(18 179 77)"/>
          <rect x="166" y="104" width="30" height="64" rx="15" transform="rotate(-14 181 136)"/>
        </g>
        <circle cx="183" cy="108" r="30" fill="none" stroke="var(--red)" stroke-width="3" stroke-dasharray="6 6"/>
        <text class="t red" x="183" y="26" text-anchor="middle">draaipunt</text>
        <text class="t" x="96" y="108" text-anchor="middle" transform="translate(0 -22)">stok</text>
        <text class="t" x="102" y="206" text-anchor="middle" style="display:none"> </text>
      </svg>
    </figure>
    <ul class="ticks">
      <li class="yes"><i></i><span>Duim en wijsvinger knijpen <b>zachtjes</b> samen. Dat is het draaipunt.</span></li>
      <li class="yes"><i></i><span>Je andere vingers liggen <b>los</b> om de stok.</span></li>
      <li class="yes"><i></i><span>De rug van je hand wijst naar boven.</span></li>
      <li class="no"><i></i><span>Niet knijpen! Dan kan de stok niet bewegen en krijg je pijn in je hand.</span></li>
    </ul>
  </section>

  <section class="step">
    <h2><span class="n">3</span>Zo sla je</h2>
    <p>Laat de stok vallen en laat hem terugspringen. Je hoeft hem niet in het vel te duwen. Raak het midden van het vel, recht naar beneden en recht omhoog.</p>
    <div class="strokes">
      STROKES
    </div>
  </section>

  <section class="step">
    <h2><span class="n">4</span>Nu jij!</h2>
    <p>Speel rechts, links, rechts, links. Doe mee met de lichtjes en blijf rustig.</p>
    <div class="rl" aria-hidden="true">
      <b style="--i:0">R</b><b style="--i:1">L</b><b style="--i:2">R</b><b style="--i:3">L</b><b style="--i:4">R</b><b style="--i:5">L</b><b style="--i:6">R</b><b style="--i:7">L</b>
    </div>
    <div class="mrow wrap">
      <button type="button" class="chip" data-metro="60">Metronoom op 60</button>
      <button type="button" class="chip" data-metro="80">Metronoom op 80</button>
    </div>
  </section>

  <p class="src">Gebaseerd op uitleg van <a href="https://percussion.org/basic-snare-drum-technique/" target="_blank" rel="noopener">Percussive Arts Society</a>, <a href="https://www.thomann.de/be/onlineexpert_page_snare_drums_rudiments_and_basic_strokes.html" target="_blank" rel="noopener">Thomann</a>, <a href="https://drumstars.co.uk/how-to-hold-your-drumsticks-matched-trad-grip" target="_blank" rel="noopener">Drumstars</a> en <a href="https://www.musicindustryhowto.com/set-up-drum-throne-drums/" target="_blank" rel="noopener">Music Industry How-To</a> (Engelstalig).</p>
</div>`.replace('STROKES', (function(){
  var item = function(cls, title, text){
    return '<figure class="stroke">'+
      '<svg viewBox="0 0 260 170" role="img" aria-label="'+title+'">'+
        '<rect class="o" x="104" y="136" width="146" height="22" rx="6" fill="var(--red)"/>'+
        '<line x1="104" y1="136" x2="250" y2="136" stroke="#fff" stroke-width="6" stroke-linecap="round"/>'+
        '<path class="o" d="M0 150 L30 100" fill="none" stroke-width="22"/>'+
        '<path d="M0 150 L30 100" fill="none" stroke="var(--bone)" stroke-width="14" stroke-linecap="round"/>'+
        '<g transform="translate(30 98)"><g class="stk '+cls+'">'+
          '<line x1="-6" y1="0" x2="152" y2="0" stroke="var(--ink)" stroke-width="9" stroke-linecap="round"/>'+
          '<line x1="-6" y1="0" x2="152" y2="0" stroke="var(--bone)" stroke-width="4.5" stroke-linecap="round"/>'+
          '<circle cx="152" cy="0" r="6.5" fill="#fff" stroke="var(--ink)" stroke-width="2.5"/>'+
        '</g></g>'+
        '<circle class="o" cx="30" cy="98" r="11" fill="var(--bone)"/>'+
        '<circle class="flash f-'+cls+'" cx="176" cy="136" r="20" fill="var(--red)"/>'+
      '</svg>'+
      '<figcaption><b>'+title+'</b><span>'+text+'</span></figcaption></figure>';
  };
  return item('full','Volle slag','Hoog, slaan en weer hoog. De gewone slag.')+
         item('down','Neerslag','Hoog, slaan en laag blijven. Voor luid gevolgd door zacht.')+
         item('up','Opslag','Laag beginnen en omhoog gaan. Voor zacht gevolgd door luid.')+
         item('tap','Tikslag','Kleine slagen dicht bij het vel. Voor zachte noten.');
})());
