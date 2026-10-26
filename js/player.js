/* Speler: speelt de partituur af met echte drumopnames, volgt mee op de PDF
   en laat je op een maat klikken om daarheen te springen.
   Data: score/<stuk>.json (gemaakt met tools/mscz2json.py en tools/pdfmaten.py)
   Geluid: audio/drums.wav + audio/drums.json (tools/samples.py, CC0-opnames uit VCSL) */
(function(){
'use strict';

var NAMES = {snare:'snare', bas:'basdrum', tenor:'veldtrommel'};
var LOOK = 0.15;                      // zoveel seconden vooruit inplannen
var store = {get:function(k,d){try{var v=localStorage.getItem(k);return v===null?d:v}catch(e){return d}}, set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
var shared = {ctx:null, buf:null, map:null, loading:null, scores:{}};

function ctx(){
  if(!shared.ctx){
    var AC = window.AudioContext || window.webkitAudioContext, c = new AC();
    var comp = c.createDynamicsCompressor(), out = c.createGain();
    comp.threshold.value = -10; comp.knee.value = 6; comp.ratio.value = 6; comp.attack.value = .002; comp.release.value = .12;
    out.gain.value = .9; out.connect(comp); comp.connect(c.destination);
    shared.ctx = c; shared.out = out;
  }
  return shared.ctx;
}
function loadSamples(){
  if(shared.loading) return shared.loading;
  shared.loading = Promise.all([
    fetch('audio/drums.json').then(function(r){return r.json()}),
    fetch('audio/drums.wav').then(function(r){return r.arrayBuffer()})
  ]).then(function(res){
    shared.map = res[0];
    return new Promise(function(ok, bad){ ctx().decodeAudioData(res[1], ok, bad) });
  }).then(function(buf){ shared.buf = buf; });
  shared.loading.catch(function(){ shared.loading = null; });
  return shared.loading;
}
function loadScore(url){
  if(!shared.scores[url]) shared.scores[url] = fetch(url).then(function(r){ if(!r.ok) throw r; return r.json() });
  return shared.scores[url];
}

var PLAY = '<svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg><svg class="i-stop" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2.5"/></svg>';

function Player(opts){
  var P = this;
  P.o = opts; P.voice = opts.voice; P.pdf = opts.pdf;
  P.bpm = parseInt(store.get('pl-bpm-'+opts.id, String(opts.bpm || 90)), 10) || 90;
  P.all = store.get('pl-all', '0') === '1';
  P.click = store.get('pl-click', '0') === '1';
  P.loop = false;
  P.running = false; P.pos = 0; P.q = []; P.srcs = []; P.rr = 0; P.raf = 0; P.timer = 0;
  P.el = opts.bar; P.layers = [];
  P.render();
  loadScore(opts.score).then(function(d){
    if(P.dead) return;
    P.d = d; P.boxes = d.boxes[P.pdf] || null; P.nm = d.measures.length;
    P.pages.forEach(function(pg){ P.decorate(pg) });
    P.paintPos(0, 0);
  }).catch(function(){ P.msg('Laden mislukt', 'Herlaad de pagina') });
}

Player.prototype.render = function(){
  var P = this, other = P.voice === 'snare' ? 'snare' : NAMES[P.voice];
  var steps = [60,70,80,90,100,110,120];
  if(P.o.goal) P.o.goal.forEach(function(g){ if(steps.indexOf(g)<0) steps.push(g) });
  steps.sort(function(a,b){return a-b});
  P.el.innerHTML =
    '<div class="mx-row">'+
      '<button type="button" class="mx-play" data-pl="go" aria-label="Afspelen">'+PLAY+'</button>'+
      '<div class="mx-tempo">'+
        '<button type="button" class="mx-step" data-pl="minus" aria-label="Trager">−</button>'+
        '<div class="mx-bpm"><b data-pl="bpm">'+P.bpm+'</b><small>bpm</small></div>'+
        '<button type="button" class="mx-step" data-pl="plus" aria-label="Sneller">+</button>'+
      '</div>'+
      '<div class="pl-where" aria-live="polite"><b data-pl="where">Maat 1</b><small data-pl="where2"></small></div>'+
    '</div>';
  P.set = P.o.set;
  P.set.innerHTML =
    '<div class="mx-chiprow"><div class="mx-chips" data-pl="chips" role="group" aria-label="Tempo kiezen">'+
      steps.map(function(b){ var g = P.o.goal && P.o.goal.indexOf(b)>-1;
        return '<button type="button" class="mx-chip'+(g?' goal':'')+'" data-bpmv="'+b+'" aria-pressed="false">'+b+(g?'<small>doel</small>':'')+'</button>' }).join('')+
    '</div></div>'+
    '<div class="pl-opts">'+
      '<div class="pl-seg" role="group" aria-label="Wat hoor je">'+
        '<button type="button" data-mix="0" aria-pressed="'+(!P.all)+'">Alleen '+esc(P.o.partName)+'</button>'+
        '<button type="button" data-mix="1" aria-pressed="'+P.all+'">Alles samen</button>'+
      '</div>'+
      '<button type="button" class="pl-tog" data-pl="click" aria-pressed="'+P.click+'">Metronoom</button>'+
      '<button type="button" class="pl-tog" data-pl="loop" aria-pressed="false">Lijn herhalen</button>'+
    '</div>'+
    '<p class="pl-hint">Tik op een maat in de partituur om daar te beginnen.</p>';
  var q = function(s){ return P.el.querySelector(s) || P.set.querySelector(s) };
  var qa = function(s){ return Array.prototype.slice.call(P.el.querySelectorAll(s)).concat(Array.prototype.slice.call(P.set.querySelectorAll(s))) };
  q('[data-pl="go"]').onclick = function(){ P.toggle() };
  P.hold(q('[data-pl="minus"]'), -1); P.hold(q('[data-pl="plus"]'), 1);
  qa('[data-bpmv]').forEach(function(b){ b.onclick = function(){ P.setBpm(+b.dataset.bpmv) } });
  qa('[data-mix]').forEach(function(b){ b.onclick = function(){
    P.all = b.dataset.mix === '1'; store.set('pl-all', P.all?'1':'0');
    qa('[data-mix]').forEach(function(x){ x.setAttribute('aria-pressed', String(x===b)) });
    P.reschedule();
  }});
  q('[data-pl="click"]').onclick = function(){ P.click = !P.click; store.set('pl-click', P.click?'1':'0'); this.setAttribute('aria-pressed', String(P.click)); P.reschedule() };
  q('[data-pl="loop"]').onclick = function(){ P.loop = !P.loop; this.setAttribute('aria-pressed', String(P.loop)); P.reschedule() };
  P.chips = q('[data-pl="chips"]');
  P.chips.addEventListener('scroll', function(){ P.fade() }, {passive:true});
  P.pages = [];
  P.setBpm(P.bpm, true);
};
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

Player.prototype.msg = function(t, t2){
  var w = this.el.querySelector('[data-pl="where"]'), w2 = this.el.querySelector('[data-pl="where2"]');
  if(w) w.textContent = t; if(w2) w2.textContent = t2 || '';
};

Player.prototype.hold = function(btn, delta){
  var P = this, t1 = 0, t2 = 0;
  function end(){ clearTimeout(t1); clearInterval(t2) }
  btn.addEventListener('pointerdown', function(e){
    e.preventDefault(); P.setBpm(P.bpm + delta);
    t1 = setTimeout(function(){ t2 = setInterval(function(){ P.setBpm(P.bpm + delta) }, 90) }, 450);
  });
  ['pointerup','pointerleave','pointercancel'].forEach(function(ev){ btn.addEventListener(ev, end) });
  btn.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); P.setBpm(P.bpm + delta) } });
};

Player.prototype.setBpm = function(v, quiet){
  var P = this;
  P.bpm = Math.max(40, Math.min(160, Math.round(v)));
  store.set('pl-bpm-'+P.o.id, String(P.bpm));
  P.el.querySelector('[data-pl="bpm"]').textContent = P.bpm;
  var now = null;
  Array.prototype.forEach.call(P.chips.children, function(c){ var on = +c.dataset.bpmv === P.bpm; c.classList.toggle('now', on); c.setAttribute('aria-pressed', String(on)); if(on) now = c });
  if(now && P.chips.clientWidth){
    var l = now.offsetLeft - P.chips.offsetLeft, r = l + now.offsetWidth;
    if(l < P.chips.scrollLeft || r > P.chips.scrollLeft + P.chips.clientWidth) P.chips.scrollLeft = l - (P.chips.clientWidth - now.offsetWidth)/2;
  }
  P.fade();
  if(!quiet) P.reschedule();
};
Player.prototype.fade = function(){
  var c = this.chips; if(!c.clientWidth) return;
  c.classList.toggle('more', c.scrollLeft + c.clientWidth < c.scrollWidth - 4);
  c.classList.toggle('less', c.scrollLeft > 4);
};

/* ---- partituur: klikbare maten en meelopende markering ---- */
Player.prototype.page = function(holder){
  this.pages.push(holder);
  if(this.d) this.decorate(holder);
};
Player.prototype.decorate = function(holder){
  var P = this;
  if(!P.boxes || holder.querySelector('.pl-layer')) return;
  var n = +holder.dataset.n - 1, layer = document.createElement('div');
  layer.className = 'pl-layer';
  P.boxes.forEach(function(b, k){
    if(b[0] !== n) return;
    var m = document.createElement('button');
    m.type = 'button'; m.className = 'pl-m'; m.dataset.m = k % P.nm;
    m.setAttribute('aria-label', 'Speel vanaf maat '+(k % P.nm + 1));
    m.style.left = (b[1]*100)+'%'; m.style.top = (b[2]*100)+'%';
    m.style.width = ((b[3]-b[1])*100)+'%'; m.style.height = ((b[4]-b[2])*100)+'%';
    m.onclick = function(){ P.jump(+m.dataset.m) };
    layer.appendChild(m);
  });
  holder.appendChild(layer); P.layers.push(layer);
  P.cur = null; P.paintPos(P.pos, 0);
};

/* waar staan we: index in de afspeelvolgorde (seq) */
Player.prototype.where = function(i){
  var d = this.d, m = d.seq[i], pass = 0, mark = '';
  for(var k=0;k<=i;k++) if(d.seq[k]===m) pass++;
  for(var j=m;j>=0;j--) if(d.measures[j].mark){ mark = d.measures[j].mark; break }
  return {m:m, pass:pass, mark:mark};
};
Player.prototype.paintPos = function(i, frac){
  var P = this; if(!P.d) return;
  var w = P.where(i);
  var rep = P.d.seq.indexOf(w.m) !== P.d.seq.lastIndexOf(w.m);
  var t = 'Maat '+(w.m+1), t2 = (w.mark ? 'Deel '+w.mark : '')+(rep ? (w.mark?' · ':'')+(w.pass===1?'1e keer':'2e keer') : '');
  if(P._where !== t+t2){ P._where = t+t2; P.msg(t, t2) }
  if(P.cur !== w.m){
    P.cur = w.m;
    P.layers.forEach(function(L){ Array.prototype.forEach.call(L.children, function(e){ e.classList.toggle('cur', +e.dataset.m === w.m) }) });
    if(P.running) P.follow();
  }
  P.layers.forEach(function(L){ Array.prototype.forEach.call(L.querySelectorAll('.cur'), function(e){ e.style.setProperty('--p', (frac*100).toFixed(1)+'%') }) });
};
Player.prototype.follow = function(){
  var e = null;
  this.layers.some(function(L){ e = L.querySelector('.cur'); return !!e });
  if(!e) return;
  var r = e.getBoundingClientRect(), bar = this.el.getBoundingClientRect();
  var top = Math.max(0, bar.bottom) + 12, vh = window.innerHeight;
  if(r.top < top || r.bottom > vh - 24){
    window.scrollTo({top: window.scrollY + r.top - top - 40, behavior:'smooth'});
  }
};

/* ---- geluid ---- */
Player.prototype.mdur = function(i){ return this.d.measures[this.d.seq[i]].len * 60 / this.bpm };
Player.prototype.next = function(i){
  var d = this.d;
  if(this.loop && this.range){ return i+1 > this.range[1] ? this.range[0] : i+1 }
  return i+1 < d.seq.length ? i+1 : -1;
};
Player.prototype.sectionRange = function(i){
  var d = this.d, mk = function(k){ var m = d.seq[k]; for(var j=m;j>=0;j--) if(d.measures[j].mark) return j; return 0 };
  var s = mk(i), a = i, b = i;
  while(a>0 && mk(a-1)===s) a--;
  while(b<d.seq.length-1 && mk(b+1)===s) b++;
  return [a, b];
};
Player.prototype.hit = function(name, t, gain){
  var c = ctx(), map = shared.map, s = map[name]; if(!s) return;
  var src = c.createBufferSource(), g = c.createGain();
  src.buffer = shared.buf; g.gain.value = gain;
  src.connect(g); g.connect(shared.out);
  src.start(Math.max(t, c.currentTime), s[0], s[1]);
  this.srcs.push({s:src, e:t + s[1]});
};
Player.prototype.tick = function(t, accent){
  var c = ctx(), o = c.createOscillator(), g = c.createGain();
  o.type = 'sine'; o.frequency.value = accent ? 1568 : 1046;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(accent ? .5 : .35, t + .002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + .06);
  o.connect(g); g.connect(shared.out); o.start(t); o.stop(t + .08);
  this.srcs.push({s:o, e:t + .08});
};
Player.prototype.note = function(voice, n, t, mine){
  var v = n[1], rr = (this.rr = (this.rr + 1) % 2), name;
  var vol = (.18 + .82 * v * v) * (mine ? 1 : .42);
  t += (Math.random() - .5) * .006;                     // klein beetje menselijk
  vol *= .94 + Math.random() * .12;
  if(voice === 'snare'){
    if(n[2] === 'r'){ name = 'rim'; vol *= 1.1 }
    else name = v < .5 ? (rr ? 'snare1a' : 'snare1b') : v < .78 ? 'snare2a' : (rr ? 'snare3a' : 'snare3b');
  } else if(voice === 'tenor'){
    name = v < .7 ? 'tenor1a' : (rr ? 'tenor2a' : 'tenor2b'); vol *= .9;
  } else {
    name = v < .5 ? 'bass1a' : v < .8 ? 'bass2a' : 'bass3a'; vol *= 1.15;
  }
  this.hit(name, t, vol * .8);
};
Player.prototype.measure = function(i, t, from){
  var P = this, d = P.d, m = d.seq[i], q = 60 / P.bpm, len = d.measures[m].len;
  var voices = P.all ? Object.keys(d.parts) : [P.voice];
  voices.forEach(function(v){
    d.parts[v][m].forEach(function(n){ if(n[0] >= from - 1e-6) P.note(v, n, t + (n[0] - from) * q, v === P.voice) });
  });
  if(P.click) for(var b = Math.ceil(from - 1e-6); b < len; b++) P.tick(t + (b - from) * q, b === 0);
};
Player.prototype.sched = function(){
  var P = this, c = ctx();
  while(P.nextI >= 0 && P.nextT < c.currentTime + LOOK){
    var d = P.mdur(P.nextI) * (1 - P.nextFrom / P.d.measures[P.d.seq[P.nextI]].len);
    P.measure(P.nextI, P.nextT, P.nextFrom);
    P.q.push({i:P.nextI, t:P.nextT - P.nextFrom * 60 / P.bpm, d:P.mdur(P.nextI)});
    P.nextT += d; P.nextFrom = 0;
    P.nextI = P.next(P.nextI);
  }
  if(P.nextI < 0 && c.currentTime > P.nextT + .3) P.stop(true);
  var now = c.currentTime;
  P.srcs = P.srcs.filter(function(x){ return x.e > now - .5 });
};
Player.prototype.frame = function(){
  var P = this, now = ctx().currentTime;
  while(P.q.length > 1 && P.q[1].t <= now) P.q.shift();
  var e = P.q[0];
  if(e && e.t <= now){ P.pos = e.i; P.paintPos(e.i, Math.min(1, (now - e.t) / e.d)) }
  P.raf = requestAnimationFrame(function(){ P.frame() });
};
Player.prototype.silence = function(){
  var now = ctx().currentTime;
  this.srcs.forEach(function(x){ try{ x.s.stop(now) }catch(e){} });
  this.srcs = []; this.q = [];
};
/* (her)beginnen vanaf seq-index i, op een fractie van de maat */
Player.prototype.startAt = function(i, frac, countIn){
  var P = this, c = ctx(), q = 60 / P.bpm, len = P.d.measures[P.d.seq[i]].len;
  P.silence();
  var t0 = c.currentTime + .08;
  if(countIn){
    for(var b = 0; b < len; b++) P.tick(t0 + b * q, b === 0);
    t0 += len * q;
    P.msg('Aftellen…'); P._where = '';
  }
  P.range = P.sectionRange(i);
  P.nextI = i; P.nextFrom = frac * len; P.nextT = t0;
  P.sched();
};
Player.prototype.reschedule = function(){
  var P = this;
  if(!P.running || !P.d) return;
  var now = ctx().currentTime, e = P.q.filter(function(x){ return x.t <= now }).pop() || P.q[0];
  if(!e){ return }
  var frac = e.t > now ? 0 : Math.min(.999, (now - e.t) / e.d);
  P.startAt(e.i, frac, false);
};
Player.prototype.play = function(){
  var P = this;
  if(P.running || !P.d) return;
  var c = ctx(); c.resume();
  P.el.querySelector('[data-pl="go"]').classList.add('busy');
  loadSamples().then(function(){
    if(P.dead) return;
    P.el.querySelector('[data-pl="go"]').classList.remove('busy');
    P.running = true; P.setUi();
    P.startAt(P.pos, 0, true);
    P.timer = setInterval(function(){ P.sched() }, 25);
    P.frame(); P.follow();
    if(navigator.wakeLock && navigator.wakeLock.request) navigator.wakeLock.request('screen').then(function(w){ P.wake = w }).catch(function(){});
  }).catch(function(){
    P.el.querySelector('[data-pl="go"]').classList.remove('busy');
    P.msg('Geen geluid', 'Herlaad de pagina');
  });
};
Player.prototype.stop = function(atEnd){
  var P = this;
  if(!P.running) return;
  P.running = false; clearInterval(P.timer); cancelAnimationFrame(P.raf);
  P.silence(); P.setUi();
  if(atEnd){ P.pos = 0 }
  P.paintPos(P.pos, 0);
  if(P.wake){ try{ P.wake.release() }catch(e){} P.wake = null }
};
Player.prototype.toggle = function(){ this.running ? this.stop() : this.play() };
Player.prototype.setUi = function(){
  var b = this.el.querySelector('[data-pl="go"]');
  b.classList.toggle('on', this.running); b.setAttribute('aria-label', this.running ? 'Stoppen' : 'Afspelen');
  this.el.classList.toggle('playing', this.running); this.set.classList.toggle('playing', this.running);
};
/* naar maat m springen (0-gebaseerd) */
Player.prototype.jump = function(m){
  var P = this, d = P.d; if(!d) return;
  var occ = []; d.seq.forEach(function(x, k){ if(x === m) occ.push(k) });
  if(!occ.length) return;
  var cur = P.where(P.pos), i = occ[0];
  if(occ.length > 1 && cur.pass === 2 && P.sectionRange(occ[1])[0] === P.sectionRange(P.pos)[0]) i = occ[1];
  P.pos = i;
  if(P.running){ P.startAt(i, 0, false) }
  else { P.cur = null; P.paintPos(i, 0); P.play() }
};
Player.prototype.destroy = function(){
  this.stop(); this.dead = true;
  this.layers.forEach(function(L){ if(L.parentNode) L.parentNode.removeChild(L) });
};

window.Player = Player;
})();
