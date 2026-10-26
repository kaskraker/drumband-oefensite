(function(){
'use strict';
var DATA = window.DATA;
var $ = function(s){return document.querySelector(s)};
var esc = function(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var enc = function(p){return p.split('/').map(encodeURIComponent).join('/')};
var stem = function(p){return p.split('/').pop().replace(/\.[^.]+$/,'')};
var store = {get:function(k,d){try{var v=localStorage.getItem(k);return v===null?d:v}catch(e){return d}}, set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
var ICON_DL = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg>';

/* ---------- gegevens opzoeken ---------- */
function findPiece(id){return DATA.pieces.filter(function(p){return p.id===id})[0]}
function pieceFiles(p){
  var f=[]; if(p.score) f.push({id:'partituur', name:'Partituur', file:p.score});
  p.parts.forEach(function(x){f.push({id:stem(x.file), name:x.name, file:x.file})});
  return f;
}

/* ---------- pagina's ---------- */
var video = {vi:0, tempo:'snel', letter:'intro', rate:1, loop:true};
var current = {piece:null, landing:false, view:''};
var level = store.get('level',''); if(level!=='starter' && level!=='gevorderd') level='';
var inLevel = function(x){return x.levels.indexOf(level||'gevorderd')>-1};
var LEVELNAME = {starter:'Starters', gevorderd:'Gevorderden'};

function dlLink(file, label){
  return '<a class="dl" href="'+enc(file)+'" download="'+esc(label)+'.pdf" aria-label="Download '+esc(label)+'">'+ICON_DL+'</a>';
}

function landing(){
  return '<section class="block choose"><h1>Kies je groep</h1><div class="tiles two">'+
    '<a class="tile" href="#starters"><h3>Starters</h3></a><a class="tile" href="#gevorderden"><h3>Gevorderden</h3></a></div></section>';
}

function home(){
  var tiles = function(list, cls){return '<div class="tiles">'+list.map(function(p){
    return '<a class="tile '+cls+'" href="#'+p.id+'"><h3>'+esc(p.title)+'</h3></a>'}).join('')+'</div>'};
  var now = DATA.pieces.filter(function(p){return p.status==='actueel' && inLevel(p)});
  var cls = DATA.pieces.filter(function(p){return p.status==='classic' && inLevel(p)});
  var arch = DATA.pieces.filter(function(p){return p.status==='archief' && inLevel(p)});
  var h = '<div class="level-line"><strong>'+LEVELNAME[level||'gevorderd']+'</strong><a href="#kies">Andere groep kiezen</a></div>';
  if(now.length) h += '<section class="block"><h2>Nu aan de beurt</h2>'+tiles(now,'')+'</section>';
  if(cls.length) h += '<section class="block"><h2>Classics</h2>'+tiles(cls,'light')+'</section>';
  var groups = {}; var order=[];
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

function piecePage(p){
  var h = '<a class="back" href="#">← Terug</a><div class="piece-head"><h1>'+esc(p.title)+'</h1>';
  if(p.score) h += '<button type="button" class="btn" data-go="'+p.id+'/partituur">Volledige partituur</button>';
  h += '</div>';
  if(p.videos) h += videoSection(p);
  if(p.parts.length){
    h += '<section class="sec"><h2>Partijen</h2><ul class="list">'+p.parts.map(function(x){
      return '<li><button type="button" class="open" data-go="'+p.id+'/'+stem(x.file)+'">'+esc(x.name)+'</button>'+dlLink(x.file,p.title+' - '+x.name)+'</li>'}).join('')+'</ul></section>';
  }
  return h;
}

function videoSection(p){
  var ins = p.videos.instruments, cur = ins[video.vi]||ins[0];
  var L = cur.letters.filter(function(l){return l.letter===video.letter})[0] || cur.letters[0];
  video.letter = L.letter;
  if(!L.video[video.tempo]) video.tempo = L.video.snel ? 'snel' : 'traag';
  var src = L.video[video.tempo];
  return '<section class="sec"><h2>Oefenvideo</h2><div class="lesson">'+
   '<div class="ctl"><div class="seg" role="group" aria-label="Instrument">'+ins.map(function(x,i){
      return '<button type="button" data-vi="'+i+'" aria-pressed="'+(i===video.vi)+'">'+esc(x.name)+'</button>'}).join('')+'</div>'+
   '<div class="seg" role="group" aria-label="Tempo">'+
      '<button type="button" data-tempo="traag" aria-pressed="'+(video.tempo==='traag')+'"'+(L.video.traag?'':' disabled')+'>Traag 65</button>'+
      '<button type="button" data-tempo="snel" aria-pressed="'+(video.tempo==='snel')+'"'+(L.video.snel?'':' disabled')+'>Snel 110</button></div></div>'+
   '<div class="letters" role="group" aria-label="Letter">'+cur.letters.map(function(l){
      return '<button type="button" class="rm" data-letter="'+l.letter+'" aria-pressed="'+(l.letter===L.letter)+'">'+(l.letter==='intro'?'Intro':l.letter)+'</button>'}).join('')+'</div>'+
   '<div class="opts"><label class="chk"><input type="checkbox" id="loop"'+(video.loop?' checked':'')+'> Herhalen</label>'+
     '<label class="chk">Snelheid <select id="rate"><option value="0.5">0,5×</option><option value="0.75">0,75×</option><option value="1">1×</option></select></label></div>'+
   '<div class="stage"><video id="vid" controls playsinline preload="metadata" src="'+enc(src)+'"></video></div></div></section>';
}

function bindPage(){
  var v = $('#vid');
  if(v){
    v.loop = video.loop; v.playbackRate = video.rate; $('#rate').value = String(video.rate);
    v.addEventListener('loadedmetadata', function(){v.playbackRate = video.rate});
    $('#loop').onchange = function(e){video.loop = e.target.checked; v.loop = video.loop};
    $('#rate').onchange = function(e){video.rate = parseFloat(e.target.value); v.playbackRate = video.rate};
  }
  each('[data-vi]', function(b){b.onclick=function(){video.vi=+b.dataset.vi; draw()}});
  each('[data-tempo]', function(b){b.onclick=function(){video.tempo=b.dataset.tempo; draw()}});
  each('[data-letter]', function(b){b.onclick=function(){video.letter=b.dataset.letter; draw()}});
}
function each(sel, fn){Array.prototype.forEach.call(document.querySelectorAll(sel), fn)}

function draw(){
  var m = $('#main');
  m.innerHTML = current.landing ? landing() : current.piece ? piecePage(current.piece) : home();
  bindPage();
  updatePresets();
}

/* ---------- routing ---------- */
document.addEventListener('click', function(e){
  var g = e.target.closest('[data-go]');
  if(g){ e.preventDefault(); location.hash = g.dataset.go; }
});
function route(){
  var parts = decodeURIComponent(location.hash.slice(1)).split('/');
  var first = parts[0], second = parts[1];
  if(first==='starters' || first==='gevorderden'){ level = first==='starters' ? 'starter' : 'gevorderd'; store.set('level', level); first = ''; second = ''; }
  var piece = null, doc = null;
  if(first==='oefeningen'){
    if(second) doc = DATA.oefeningen.filter(function(d){return stem(d.file)===second})[0];
  } else if(first){
    piece = findPiece(first) || null;
  }
  var isLanding = first==='kies' || (!level && !piece && first!=='oefeningen');
  var view = isLanding ? 'kies' : (piece ? piece.id : 'home-'+(level||'gevorderd'));
  if(view !== current.view){
    current.view = view; current.landing = isLanding; current.piece = isLanding ? null : piece;
    video.vi = 0; video.letter = 'intro'; draw();
    if(!doc && !second) window.scrollTo(0,0);
  }
  if(piece && second){
    var f = pieceFiles(piece).filter(function(x){return x.id===second})[0];
    if(f) openViewer(f.file, piece.title+' – '+f.name, piece.title+' - '+f.name); else closeViewer();
  } else if(doc){
    openViewer(doc.file, doc.title, doc.title);
  } else closeViewer();
}
window.addEventListener('hashchange', route);

/* ---------- PDF-lezer ---------- */
var viewer = $('#viewer'), vpages = $('#vpages'), viewToken = 0, io = null;
var lastFocus = null;
if(window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';

function openViewer(file, title, dlName){
  if(!viewer.hidden && viewer.dataset.file===file) return;
  lastFocus = document.activeElement;
  viewer.dataset.file = file; viewer.hidden = false; document.body.classList.add('lock');
  $('#vtitle').textContent = title;
  var a = $('#vdl'); a.href = enc(file); a.setAttribute('download', dlName+'.pdf');
  vpages.innerHTML = '<p class="vmsg">Laden…</p>'; vpages.scrollTop = 0;
  var token = ++viewToken;
  if(io){io.disconnect(); io=null}
  if(!window.pdfjsLib){ vpages.innerHTML = '<p class="vmsg">De lezer kon niet laden. Gebruik de knop Download.</p>'; return; }
  pdfjsLib.getDocument(enc(file)).promise.then(function(pdf){
    if(token!==viewToken) return;
    vpages.innerHTML = '';
    var holders = [];
    for(var i=1;i<=pdf.numPages;i++){
      var d = document.createElement('div'); d.className='vpage'; d.dataset.n=i; d.style.minHeight='300px';
      vpages.appendChild(d); holders.push(d);
    }
    io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting && !en.target.dataset.done){ en.target.dataset.done='1'; renderPage(pdf, en.target, token) } });
    }, {root:vpages, rootMargin:'800px 0px'});
    holders.forEach(function(h){io.observe(h)});
  }).catch(function(){
    if(token===viewToken) vpages.innerHTML = '<p class="vmsg">Dit bestand kon niet getoond worden. Gebruik de knop Download.</p>';
  });
  $('#vclose').focus();
}
function renderPage(pdf, holder, token){
  pdf.getPage(+holder.dataset.n).then(function(page){
    if(token!==viewToken) return;
    var base = page.getViewport({scale:1});
    var cssW = Math.min(holder.clientWidth || 900, 920);
    var dpr = Math.min(window.devicePixelRatio||1, 2.5);
    var scale = (cssW*dpr)/base.width;
    var vp = page.getViewport({scale:scale});
    var c = document.createElement('canvas'); c.width=Math.floor(vp.width); c.height=Math.floor(vp.height);
    return page.render({canvasContext:c.getContext('2d'), viewport:vp}).promise.then(function(){
      if(token!==viewToken) return; holder.style.minHeight=''; holder.appendChild(c);
    });
  });
}
function closeViewer(){
  if(viewer.hidden) return;
  viewer.hidden = true; viewer.dataset.file=''; document.body.classList.remove('lock');
  viewToken++; vpages.innerHTML=''; if(io){io.disconnect(); io=null}
  if(lastFocus && lastFocus.focus) try{lastFocus.focus()}catch(e){}
}
$('#vclose').onclick = function(){
  var p = current.piece; location.hash = p ? p.id : '';
};
document.addEventListener('keydown', function(e){
  if(e.key==='Escape'){
    if(!viewer.hidden) $('#vclose').click();
    else if(!$('#mpanel').hidden) setPanel(false);
  }
});

/* ---------- metronoom ---------- */
var M = {bpm:parseInt(store.get('bpm','90'),10)||90, beats:4, running:false, ctx:null, next:0, beat:0, timer:null, queue:[], raf:0, wake:null};
var panel = $('#mpanel'), mbtn = $('#mbtn');
function setPanel(open){
  panel.hidden = !open; mbtn.setAttribute('aria-expanded', String(open));
  if(open) $('#mgo').focus();
}
mbtn.onclick = function(){setPanel(panel.hidden)};
$('#vmetro').onclick = function(){setPanel(panel.hidden)};
$('#mclose').onclick = function(){setPanel(false)};
function clampBpm(v){return Math.max(30, Math.min(220, Math.round(v)))}
function setBpm(v){
  M.bpm = clampBpm(v); $('#bpmv').textContent = M.bpm; $('#mrange').value = M.bpm; store.set('bpm', String(M.bpm));
  mbtn.querySelector('.lbl').textContent = M.running ? M.bpm+' bpm' : 'Metronoom';
}
function buildDots(){
  var d = $('#dots'); d.innerHTML=''; for(var i=0;i<M.beats;i++){d.appendChild(document.createElement('i'))}
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
  var now = M.ctx.currentTime, dots = $('#dots').children;
  while(M.queue.length && M.queue[0].t <= now){
    var q = M.queue.shift();
    Array.prototype.forEach.call(dots, function(d,i){d.className = i===q.b ? 'hit'+(q.b===0?' first':'') : ''});
  }
  M.raf = requestAnimationFrame(paint);
}
function start(){
  if(M.running) return;
  var AC = window.AudioContext || window.webkitAudioContext; if(!AC) return;
  if(!M.ctx) M.ctx = new AC();
  M.ctx.resume();
  M.running = true; M.beat = 0; M.queue = []; M.next = M.ctx.currentTime + 0.08;
  M.timer = setInterval(scheduler, 25); scheduler(); M.raf = requestAnimationFrame(paint);
  $('#mgo').textContent='Stop'; $('#mgo').classList.add('on'); mbtn.classList.add('on'); $('#vmetro').classList.add('on'); setBpm(M.bpm);
  if(navigator.wakeLock && navigator.wakeLock.request){ navigator.wakeLock.request('screen').then(function(w){M.wake=w}).catch(function(){}) }
}
function stop(){
  if(!M.running) return;
  M.running=false; clearInterval(M.timer); cancelAnimationFrame(M.raf); M.queue=[];
  Array.prototype.forEach.call($('#dots').children, function(d){d.className=''});
  $('#mgo').textContent='Start'; $('#mgo').classList.remove('on'); mbtn.classList.remove('on'); $('#vmetro').classList.remove('on'); setBpm(M.bpm);
  if(M.wake){try{M.wake.release()}catch(e){} M.wake=null}
}
$('#mgo').onclick = function(){ M.running ? stop() : start() };
$('#mminus').onclick = function(){setBpm(M.bpm-1)};
$('#mminus5').onclick = function(){setBpm(M.bpm-5)};
$('#mplus').onclick = function(){setBpm(M.bpm+1)};
$('#mplus5').onclick = function(){setBpm(M.bpm+5)};
$('#mrange').oninput = function(e){setBpm(+e.target.value)};
$('#mbeats').onchange = function(e){M.beats = +e.target.value; M.beat=0; buildDots()};
var taps = [];
$('#mtap').onclick = function(){
  var n = performance.now();
  if(taps.length && n - taps[taps.length-1] > 2000) taps = [];
  taps.push(n); if(taps.length>5) taps.shift();
  if(taps.length>=2){ setBpm(60000 / ((taps[taps.length-1]-taps[0])/(taps.length-1))) }
};
function updatePresets(){
  var box = $('#mpresets'), p = current.piece;
  if(p && p.bpm && p.bpm.length){
    box.innerHTML = p.bpm.map(function(b){return '<button type="button" class="chip" data-bpm="'+b+'">'+b+' bpm</button>'}).join('');
    each('#mpresets [data-bpm]', function(c){c.onclick=function(){setBpm(+c.dataset.bpm)}});
  } else box.innerHTML = '';
}
document.addEventListener('visibilitychange', function(){
  if(document.visibilityState==='visible' && M.running && navigator.wakeLock){ navigator.wakeLock.request('screen').then(function(w){M.wake=w}).catch(function(){}) }
});

buildDots(); setBpm(M.bpm); route();
})();
