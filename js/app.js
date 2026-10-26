(function(){
'use strict';
var DATA = window.DATA;
var $ = function(s){return document.querySelector(s)};
var each = function(sel, fn){Array.prototype.forEach.call(document.querySelectorAll(sel), fn)};
var esc = function(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var enc = function(p){return p.split('/').map(encodeURIComponent).join('/')};
var stem = function(p){return p.split('/').pop().replace(/\.[^.]+$/,'')};
var store = {get:function(k,d){try{var v=localStorage.getItem(k);return v===null?d:v}catch(e){return d}}, set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
var ICON_DL = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg>';
var ICON_DL_S = ICON_DL.replace(/width="22" height="22"/,'width="18" height="18"');

var level = store.get('level','gevorderd'); if(level!=='starter' && level!=='gevorderd') level='gevorderd';
var inLevel = function(x){return x.levels.indexOf(level)>-1};
var video = {tempo:'snel', letter:'intro', rate:1, loop:true};
var current = {piece:null, part:null, single:false, basics:false, view:''};
var inlineMount = null;

function findPiece(id){return DATA.pieces.filter(function(p){return p.id===id})[0]}

/* ---------- pagina's ---------- */
function dlLink(file, label){
  return '<a class="dl" href="'+enc(file)+'" download="'+esc(label)+'.pdf" aria-label="Download '+esc(label)+'">'+ICON_DL+'</a>';
}

function home(){
  var tiles = function(list, cls){return '<div class="tiles">'+list.map(function(p){
    return '<a class="tile '+cls+'" href="#'+p.id+'"><h3>'+esc(p.title)+'</h3></a>'}).join('')+'</div>'};
  var by = function(st){return DATA.pieces.filter(function(p){return p.status===st && inLevel(p)})};
  var now = by('actueel'), cls = by('classic'), arch = by('archief');
  var h = '';
  if(level==='starter') h += '<section class="block"><h2>Voor je begint</h2><div class="tiles"><a class="tile" href="#basics"><h3>De basics</h3></a></div></section>';
  if(now.length) h += '<section class="block"><h2>Nu aan de beurt</h2>'+tiles(now,'')+'</section>';
  if(cls.length) h += '<section class="block"><h2>Classics</h2>'+tiles(cls,'light')+'</section>';
  var groups = {}, order = [];
  DATA.oefeningen.filter(inLevel).forEach(function(d){ if(!groups[d.group]){groups[d.group]=[];order.push(d.group)} groups[d.group].push(d) });
  if(order.length){
    h += '<section class="block"><h2>Oefeningen</h2>';
    order.forEach(function(g){
      h += '<p class="groupname">'+esc(g)+'</p><ul class="list">'+groups[g].map(function(d){
        return '<li><button type="button" class="open" data-go="oefeningen/'+stem(d.file)+'">'+esc(d.title)+'</button>'+dlLink(d.file,d.title)+'</li>'}).join('')+'</ul>';
    });
    h += '</section>';
  }
  if(arch.length) h += '<section class="block archive"><h2>Archief</h2><ul class="list">'+arch.map(function(p){
    return '<li><a class="open" style="display:block;text-decoration:none" href="#'+p.id+'">'+esc(p.title)+'</a></li>'}).join('')+'</ul></section>';
  return h;
}


/* ---------- de basics (starters) ---------- */
function basicsPage(){
  return '<a class="back" href="#">← Terug</a><div class="piece-head"><h1>De basics</h1></div>'+window.BASICS_HTML;
}

/* stap 1: instrument kiezen */
function choosePage(p){
  return '<a class="back" href="#">← Terug</a><div class="piece-head"><h1>'+esc(p.title)+'</h1></div>'+
    '<section class="sec"><h2>Kies je instrument</h2><div class="picks">'+p.parts.map(function(x){
      return '<a class="pick" href="#'+p.id+'/'+stem(x.file)+'">'+esc(x.name)+'</a>'}).join('')+'</div></section>';
}

/* stap 2: video en partituur voor dat instrument */
function instrumentPage(p, part, single){
  var h = '<a class="back" href="#'+(single?'':p.id)+'">← '+(single?'Terug':esc(p.title))+'</a>'+
    '<div class="piece-head"><h1>'+esc(part.name)+'</h1>'+(single?'':'<span class="of">'+esc(p.title)+'</span>')+'</div>';
  if(part.videos) h += videoSection(part);
  h += '<section class="sec"><div class="sechead"><h2>Partituur</h2>'+
    '<a class="btn" href="'+enc(part.file)+'" download="'+esc(p.title+' - '+part.name)+'.pdf">'+ICON_DL_S+'<span>Download</span></a></div>'+
    '<div class="scorewrap"><div id="mini-slot"></div><div id="inline-pdf" class="inline-pdf"></div></div></section>';
  return h;
}

/* bij 0.5x/0.75x de versie met 60 beelden per seconde (vloeiender), als die bestaat */
function slowSrc(src){return video.rate<1 && HAS60 ? src.replace(/\.mp4$/,'-60.mp4') : src}
var HAS60 = true;
function videoSection(part){
  var letters = part.videos.letters;
  var L = letters.filter(function(l){return l.letter===video.letter})[0] || letters[0];
  video.letter = L.letter;
  if(!L.video[video.tempo]) video.tempo = L.video.snel ? 'snel' : 'traag';
  var src = L.video[video.tempo];
  return '<section class="sec"><h2>Oefenvideo</h2><div class="lesson">'+
   '<div class="ctl"><div class="seg" role="group" aria-label="Tempo">'+
      '<button type="button" data-tempo="traag" aria-pressed="'+(video.tempo==='traag')+'"'+(L.video.traag?'':' disabled')+'>Traag 65</button>'+
      '<button type="button" data-tempo="snel" aria-pressed="'+(video.tempo==='snel')+'"'+(L.video.snel?'':' disabled')+'>Snel 110</button></div></div>'+
   '<div class="letters" role="group" aria-label="Letter">'+letters.map(function(l){
      return '<button type="button" class="rm" data-letter="'+l.letter+'" aria-pressed="'+(l.letter===L.letter)+'">'+(l.letter==='intro'?'Intro':l.letter)+'</button>'}).join('')+'</div>'+
   '<div class="opts"><label class="chk"><input type="checkbox" id="loop"'+(video.loop?' checked':'')+'> Herhalen</label>'+
     '<label class="chk">Snelheid <select id="rate"><option value="0.5">0,5×</option><option value="0.75">0,75×</option><option value="1">1×</option></select></label></div>'+
   '<div class="stage"><video id="vid" controls playsinline preload="metadata" src="'+enc(slowSrc(src))+'"></video></div></div></section>';
}

function draw(){
  unmount(inlineMount); inlineMount = null;
  if(mini.parentNode !== document.body) document.body.appendChild(mini);
  var c = current;
  $('#main').innerHTML = c.basics ? basicsPage() : c.part ? instrumentPage(c.piece, c.part, c.single) : c.piece ? choosePage(c.piece) : home();
  each('[data-metro]', function(b){b.onclick=function(){setBpm(+b.dataset.metro); start(); setPanel(true)}});
  var v = $('#vid');
  if(v){
    v.loop = video.loop; v.playbackRate = video.rate; $('#rate').value = String(video.rate);
    v.addEventListener('loadedmetadata', function(){v.playbackRate = video.rate});
    v.addEventListener('error', function(){ if(/-60\.mp4/.test(v.currentSrc||v.src)){ HAS60=false; v.src=v.src.replace('-60.mp4','.mp4'); v.load() } });
    $('#loop').onchange = function(e){video.loop = e.target.checked; v.loop = video.loop};
    $('#rate').onchange = function(e){
      video.rate = parseFloat(e.target.value);
      var base = v.getAttribute('src').replace('-60.mp4','.mp4'), want = slowSrc(decodeURI(base)), cur = decodeURI(v.getAttribute('src'));
      if(want !== cur){ var t=v.currentTime, was=!v.paused; v.src=enc(want); v.addEventListener('loadedmetadata', function f(){v.removeEventListener('loadedmetadata',f); v.currentTime=t; v.playbackRate=video.rate; if(was) v.play()}); }
      v.playbackRate = video.rate; };
  }
  each('[data-tempo]', function(b){b.onclick=function(){video.tempo=b.dataset.tempo; draw()}});
  each('[data-letter]', function(b){b.onclick=function(){video.letter=b.dataset.letter; draw()}});
  if(c.part) inlineMount = mountPdf($('#inline-pdf'), c.part.file, null);
  updatePresets(); updateMini();
}

/* ---------- routing ---------- */
document.addEventListener('click', function(e){
  var g = e.target.closest('[data-go]');
  if(g){ e.preventDefault(); location.hash = g.dataset.go; }
});
function syncLevel(){ each('[data-level]', function(b){ b.setAttribute('aria-pressed', String(b.dataset.level===level)) }); }
each('[data-level]', function(b){
  b.onclick = function(){
    level = b.dataset.level; store.set('level', level);
    if(location.hash) location.hash = '';
    current.view = ''; route();
  };
});
function route(){
  var parts = decodeURIComponent(location.hash.slice(1)).split('/');
  var first = parts[0], second = parts[1];
  if(first==='starters' || first==='gevorderden'){ level = first==='starters' ? 'starter' : 'gevorderd'; store.set('level', level); first = ''; second = ''; }
  var piece = null, part = null, doc = null, single = false, basics = (first==='basics');
  if(first==='oefeningen'){
    if(second) doc = DATA.oefeningen.filter(function(d){return stem(d.file)===second})[0];
  } else if(first){
    piece = findPiece(first) || null;
    if(piece){
      if(piece.parts.length===1){ part = piece.parts[0]; single = true; }
      else if(second){ part = piece.parts.filter(function(x){return stem(x.file)===second})[0] || null; }
    }
  }
  syncLevel();
  var view = basics ? 'basics' : piece ? piece.id+'/'+(part?stem(part.file):'') : 'home-'+level;
  if(view !== current.view){
    current.view = view; current.piece = piece; current.part = part; current.single = single; current.basics = basics;
    video.letter = 'intro'; draw(); window.scrollTo(0,0);
  }
  if(doc) openViewer(doc.file, doc.title, doc.title); else closeViewer();
}
window.addEventListener('hashchange', route);

/* ---------- PDF tonen (pdf.js) ---------- */
if(window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';
function unmount(m){ if(m){ m.dead = true; if(m.io) m.io.disconnect(); } }
function mountPdf(box, file, root){
  var m = {dead:false, io:null};
  box.innerHTML = '<p class="vmsg">Laden…</p>';
  if(!window.pdfjsLib){ box.innerHTML = '<p class="vmsg">De lezer kon niet laden. Gebruik de knop Download.</p>'; return m; }
  pdfjsLib.getDocument(enc(file)).promise.then(function(pdf){
    if(m.dead) return;
    box.innerHTML = '';
    var holders = [];
    for(var i=1;i<=pdf.numPages;i++){
      var d = document.createElement('div'); d.className='vpage'; d.dataset.n=i; d.style.minHeight='300px';
      box.appendChild(d); holders.push(d);
    }
    m.io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting && !en.target.dataset.done){ en.target.dataset.done='1'; renderPage(pdf, en.target, m) } });
    }, {root:root, rootMargin:'800px 0px'});
    holders.forEach(function(h){m.io.observe(h)});
  }).catch(function(){
    if(!m.dead) box.innerHTML = '<p class="vmsg">Dit bestand kon niet getoond worden. Gebruik de knop Download.</p>';
  });
  return m;
}
function renderPage(pdf, holder, m){
  pdf.getPage(+holder.dataset.n).then(function(page){
    if(m.dead) return;
    var base = page.getViewport({scale:1});
    var cssW = Math.min(holder.clientWidth || 900, 920);
    var dpr = Math.min(window.devicePixelRatio||1, 2.5);
    var vp = page.getViewport({scale:(cssW*dpr)/base.width});
    var c = document.createElement('canvas'); c.width=Math.floor(vp.width); c.height=Math.floor(vp.height);
    return page.render({canvasContext:c.getContext('2d'), viewport:vp}).promise.then(function(){
      if(m.dead) return; holder.style.minHeight=''; holder.appendChild(c);
    });
  });
}

/* lezer voor losse oefenbladen */
var viewer = $('#viewer'), vpages = $('#vpages'), viewMount = null, lastFocus = null;
function openViewer(file, title, dlName){
  if(!viewer.hidden && viewer.dataset.file===file) return;
  lastFocus = document.activeElement;
  viewer.dataset.file = file; viewer.hidden = false; document.body.classList.add('lock');
  $('#vtitle').textContent = title;
  var a = $('#vdl'); a.href = enc(file); a.setAttribute('download', dlName+'.pdf');
  vpages.scrollTop = 0; unmount(viewMount); viewMount = mountPdf(vpages, file, vpages);
  updateMini(); $('#vclose').focus();
}
function closeViewer(){
  if(viewer.hidden) return;
  viewer.hidden = true; viewer.dataset.file=''; document.body.classList.remove('lock');
  unmount(viewMount); viewMount = null; vpages.innerHTML='';
  updateMini();
  if(lastFocus && lastFocus.focus) try{lastFocus.focus()}catch(e){}
}
$('#vclose').onclick = function(){ location.hash = current.piece ? current.piece.id : ''; };
document.addEventListener('keydown', function(e){
  if(e.key==='Escape'){
    if(!$('#mpanel').hidden) setPanel(false);
    else if(!viewer.hidden) $('#vclose').click();
  }
});

/* ---------- metronoom ---------- */
var M = {bpm:parseInt(store.get('bpm','90'),10)||90, beats:4, running:false, ctx:null, next:0, beat:0, timer:null, queue:[], raf:0, wake:null};
var panel = $('#mpanel'), mbtn = $('#mbtn'), mini = $('#vmini');
function updateMini(){
  var inViewer = !viewer.hidden, slot = inViewer ? $('#vslot') : $('#mini-slot');
  if(slot && (inViewer || current.part)){
    if(mini.parentNode !== slot) slot.appendChild(mini);
    mini.classList.add('inline'); mini.classList.toggle('stuck', !inViewer); mini.hidden = false;
  } else {
    if(mini.parentNode !== document.body) document.body.appendChild(mini);
    mini.classList.add('inline'); mini.hidden = true;
  }
  document.body.classList.remove('has-mini');
}
function setPanel(open){
  panel.hidden = !open; mbtn.setAttribute('aria-expanded', String(open));
  if(open) $('#mgo').focus();
}
mbtn.onclick = function(){setPanel(panel.hidden)};
$('#vm-bpm').onclick = function(){setPanel(panel.hidden)};
$('#mclose').onclick = function(){setPanel(false)};
function clampBpm(v){return Math.max(30, Math.min(220, Math.round(v)))}
function setBpm(v){
  M.bpm = clampBpm(v); $('#bpmv').textContent = M.bpm; $('#mrange').value = M.bpm; store.set('bpm', String(M.bpm));
  mbtn.querySelector('.lbl').textContent = M.running ? M.bpm+' bpm' : 'Metronoom';
  $('#vm-bpm b').textContent = M.bpm; $('#vm-range').value = M.bpm;
}
var DOTS = ['#dots','#vm-dots'];
function buildDots(){
  DOTS.forEach(function(s){var d=$(s); d.innerHTML=''; for(var i=0;i<M.beats;i++){d.appendChild(document.createElement('i'))}});
}
function tick(time, accent){
  var o = M.ctx.createOscillator(), g = M.ctx.createGain();
  o.type='sine'; o.frequency.value = accent ? 1568 : 1046;
  g.gain.setValueAtTime(0.0001, time);
  g.gain.exponentialRampToValueAtTime(accent?1:0.7, time+0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, time+0.07);
  o.connect(g); g.connect(M.ctx.destination); o.start(time); o.stop(time+0.09);
}
function scheduler(){
  while(M.next < M.ctx.currentTime + 0.12){
    tick(M.next, M.beat===0);
    M.queue.push({t:M.next, b:M.beat});
    M.next += 60/M.bpm; M.beat = (M.beat+1)%M.beats;
  }
}
function paint(){
  var now = M.ctx.currentTime;
  while(M.queue.length && M.queue[0].t <= now){
    var q = M.queue.shift();
    DOTS.forEach(function(s){ Array.prototype.forEach.call($(s).children, function(d,i){d.className = i===q.b ? 'hit'+(q.b===0?' first':'') : ''}) });
  }
  M.raf = requestAnimationFrame(paint);
}
function setRunUi(on){
  ['#mgo','#vm-go'].forEach(function(s){ $(s).textContent = on?'Stop':'Start'; $(s).classList.toggle('on', on) });
  mbtn.classList.toggle('on', on); setBpm(M.bpm);
}
function start(){
  if(M.running) return;
  var AC = window.AudioContext || window.webkitAudioContext; if(!AC) return;
  if(!M.ctx) M.ctx = new AC();
  M.ctx.resume();
  M.running = true; M.beat = 0; M.queue = []; M.next = M.ctx.currentTime + 0.08;
  M.timer = setInterval(scheduler, 25); scheduler(); M.raf = requestAnimationFrame(paint);
  setRunUi(true);
  if(navigator.wakeLock && navigator.wakeLock.request){ navigator.wakeLock.request('screen').then(function(w){M.wake=w}).catch(function(){}) }
}
function stop(){
  if(!M.running) return;
  M.running=false; clearInterval(M.timer); cancelAnimationFrame(M.raf); M.queue=[];
  DOTS.forEach(function(s){ Array.prototype.forEach.call($(s).children, function(d){d.className=''}) });
  setRunUi(false);
  if(M.wake){try{M.wake.release()}catch(e){} M.wake=null}
}
function toggle(){ M.running ? stop() : start() }
$('#mgo').onclick = toggle; $('#vm-go').onclick = toggle;
function hold(btn, delta){
  var t1=0, t2=0;
  function end(){clearTimeout(t1); clearInterval(t2)}
  btn.addEventListener('pointerdown', function(e){
    e.preventDefault(); setBpm(M.bpm+delta);
    t1=setTimeout(function(){ t2=setInterval(function(){setBpm(M.bpm+delta)}, 90) }, 450);
  });
  ['pointerup','pointerleave','pointercancel'].forEach(function(ev){btn.addEventListener(ev,end)});
  btn.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); setBpm(M.bpm+delta) } });
}
hold($('#mminus'),-1); hold($('#mplus'),1); hold($('#vm-minus'),-1); hold($('#vm-plus'),1);
$('#mminus5').onclick = function(){setBpm(M.bpm-5)};
$('#mplus5').onclick = function(){setBpm(M.bpm+5)};
$('#mrange').oninput = function(e){setBpm(+e.target.value)};
$('#vm-range').oninput = function(e){setBpm(+e.target.value)};
$('#vm-m5').onclick = function(){setBpm(M.bpm-5)}; $('#vm-p5').onclick = function(){setBpm(M.bpm+5)};
function setBeats(n){M.beats=n; M.beat=0; $('#mbeats').value=String(n); $('#vm-beats').value=String(n); buildDots()}
$('#mbeats').onchange = function(e){setBeats(+e.target.value)};
$('#vm-beats').onchange = function(e){setBeats(+e.target.value)};
var taps = [];
$('#mtap').onclick = $('#vm-tap').onclick = function(){
  var n = performance.now();
  if(taps.length && n - taps[taps.length-1] > 2000) taps = [];
  taps.push(n); if(taps.length>5) taps.shift();
  if(taps.length>=2){ setBpm(60000 / ((taps[taps.length-1]-taps[0])/(taps.length-1))) }
};
function updatePresets(){
  var p = current.piece;
  ['#mpresets','#vm-presets'].forEach(function(s){
    var box = $(s);
    if(p && p.bpm && p.bpm.length){
      box.innerHTML = p.bpm.map(function(b){return '<button type="button" class="chip" data-bpm="'+b+'">'+b+' bpm</button>'}).join('');
      each(s+' [data-bpm]', function(c){c.onclick=function(){setBpm(+c.dataset.bpm)}});
    } else box.innerHTML = '';
  });
}
document.addEventListener('visibilitychange', function(){
  if(document.visibilityState==='visible' && M.running && navigator.wakeLock){ navigator.wakeLock.request('screen').then(function(w){M.wake=w}).catch(function(){}) }
});

buildDots(); setBpm(M.bpm); route();
})();
