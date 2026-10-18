const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- Kort ----------
const CARDS = [
  { id: 'bad', l: 'Bad', s: 'bada', eve: 1 },
  { id: 'smorj', l: 'Smörja', s: 'smörja in oss', eve: 1 },
  { id: 'pyjamas', l: 'Pyjamas', s: 'ta på pyjamasen', eve: 1 },
  { id: 'tander', l: 'Tänder', s: 'borsta tänderna', eve: 1, timer: 1 },
  { id: 'sang', l: 'Säng', s: 'hoppa i säng', eve: 1 },
  { id: 'imorgon', l: 'Imorgon', s: 'göra morgondagens schema', eve: 1, plan: 1 },
  { id: 'vakna', l: 'Vakna', s: 'vakna' },
  { id: 'tv', l: 'Lite tv', s: 'titta på lite tv' },
  { id: 'bloja', l: 'Blöja', s: 'byta blöja' },
  { id: 'klader', l: 'Kläder', s: 'klä på oss' },
  { id: 'ytter', l: 'Ytterkläder', s: 'ta på ytterkläderna' },
  { id: 'forskola', l: 'Förskola', s: 'gå till förskolan' },
  { id: 'park', l: 'Lekplats', s: 'gå till lekplatsen' },
  { id: 'mormor', l: 'Mormor & morfar', s: 'träffa mormor och morfar' },
  { id: 'simning', l: 'Simma', s: 'simma' },
  { id: 'handla', l: 'Handla', s: 'handla' },
  { id: 'bil', l: 'Åka bil', s: 'åka bil' },
  { id: 'buss', l: 'Åka buss', s: 'åka buss' },
  { id: 'cykel', l: 'Cykla', s: 'cykla' },
  { id: 'bok', l: 'Läsa bok', s: 'läsa en bok' },
  { id: 'leka', l: 'Leka', s: 'leka' },
  { id: 'middag', l: 'Äta', s: 'äta' },
  { id: 'kompis', l: 'Kompis', s: 'träffa en kompis' },
  { id: 'doktor', l: 'Doktorn', s: 'gå till doktorn' },
  { id: 'kalas', l: 'Kalas', s: 'gå på kalas' },
  { id: 'vila', l: 'Vila hemma', s: 'vila hemma' },
];
const card = id => CARDS.find(c => c.id === id) || { id, l: id, s: id };
const lbl = id => S.labels[id] || card(id).l;
const spoken = id => S.labels[id] ? S.labels[id].toLowerCase() : card(id).s;
const PRAISE = ['Bra jobbat!', 'Toppen!', 'Snyggt!', 'Jättebra!', 'Härligt!'];
const praise = () => PRAISE[Math.floor(Math.random() * PRAISE.length)];

// ---------- Data ----------
const KEY = 'bildschema-v1';
const DEF = { parent: 'mamma', evening: ['bad', 'tander', 'smorj', 'pyjamas', 'sang', 'imorgon'],
  morning: ['vakna', 'tv', 'bloja', 'klader', 'ytter', 'forskola'], lullaby: 3, timerMin: 2, speech: true, sound: true,
  labels: {}, animal: 'kanin', stickers: [], plans: {}, days: {} };
let S;
try { S = Object.assign(JSON.parse(JSON.stringify(DEF)), JSON.parse(localStorage.getItem(KEY)) || {}); }
catch (e) { S = JSON.parse(JSON.stringify(DEF)); }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
if ((S.ver || 0) < 3) {
  const e = S.evening;
  if (!e.includes('imorgon')) { const i = e.indexOf('sang'); e.splice(i < 0 ? e.length : i + 1, 0, 'imorgon'); }
  if (e.includes('bad') && e.includes('tander')) { e.splice(e.indexOf('tander'), 1); e.splice(e.indexOf('bad') + 1, 0, 'tander'); }
  S.ver = 3; save();
}
const pad = n => String(n).padStart(2, '0');
const keyOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
// Dygnet byter klockan 04, så att en sen kväll räknas till samma dag.
const dkey = () => keyOf(new Date(Date.now() - 4 * 3600e3));
const tomorrowKey = () => keyOf(new Date(Date.now() + 20 * 3600e3));
const WD = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'];
const wdOf = k => WD[new Date(k + 'T12:00').getDay()];
function dayRec() { const k = dkey(); return S.days[k] || (S.days[k] = {}); }
function prune() {
  const cut = keyOf(new Date(Date.now() - 21 * 864e5));
  for (const o of [S.days, S.plans]) for (const k of Object.keys(o)) if (k < cut) delete o[k];
}
const unlocked = () => ANIMALS.slice(0, Math.min(ANIMALS.length, 1 + Math.floor(S.stickers.length / 7)));
const curAnimal = () => unlocked().find(a => a.id === S.animal) || ANIMALS[0];

let mode = 'eve';
const stepIds = () => mode === 'eve' ? S.evening : (S.plans[dkey()] || S.morning);
function steps(m = mode) {
  const rec = dayRec(), ids = m === 'eve' ? S.evening : (S.plans[dkey()] || S.morning), sig = ids.join(',');
  if (!rec[m] || rec[m].sig !== sig) rec[m] = { sig, st: ids.map(() => 0) };
  return rec[m];
}
const pjDone = () => { const p = steps('eve'); return S.evening.some((id, i) => id === 'pyjamas' && p.st[i] === 2); };

// ---------- Ljud & tal ----------
let AC = null;
function ac() {
  if (!AC) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; AC = new C(); }
  if (AC.state === 'suspended') AC.resume();
  return AC;
}
function tone(dest, f, t, dur, vol) {
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = 'sine'; o.frequency.value = f;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.05);
}
function bell(dest, f, t, vol = .18, dur = 1.2) { tone(dest, f, t, dur, vol); tone(dest, f * 2, t, dur * .5, vol * .22); tone(dest, f * 3.01, t, dur * .25, vol * .07); }
function chime(kind) {
  if (!S.sound) return; const a = ac(); if (!a) return; const t = a.currentTime + .02;
  const seq = { tap: [784], ok: [659, 988], done: [523, 659, 784, 1047], soft: [523, 784] }[kind] || [784];
  seq.forEach((f, i) => bell(a.destination, f, t + i * .13, .16, 1.0));
}
// Blinka lilla stjärna som speldosa
const N = { C3: 130.81, F3: 174.61, G3: 196, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880 };
const MEL = 'C5 C5 G5 G5 A5 A5 G5:2 F5 F5 E5 E5 D5 D5 C5:2 G5 G5 F5 F5 E5 E5 D5:2 G5 G5 F5 F5 E5 E5 D5:2 C5 C5 G5 G5 A5 A5 G5:2 F5 F5 E5 E5 D5 D5 C5:2';
const BASS = 'C3 C3 F3 C3 F3 C3 G3 C3 C3 F3 C3 G3 C3 F3 C3 G3 C3 C3 F3 C3 F3 C3 G3 C3';
let lull = null;
function startLullaby(sec) {
  const a = ac(); if (!a) return;
  stopLullaby();
  const master = a.createGain(); master.connect(a.destination);
  const beat = 0.7, mel = MEL.split(' ').map(x => { const [n, d] = x.split(':'); return [N[n], +(d || 1)]; });
  const bass = BASS.split(' ').map(n => N[n]), loopLen = 48 * beat;
  const t0 = a.currentTime + .3, end = t0 + sec;
  master.gain.setValueAtTime(.9, t0); master.gain.setValueAtTime(.9, Math.max(t0, end - 30)); master.gain.linearRampToValueAtTime(0.0001, end);
  lull = { master, timer: null }; const me = lull;
  let ls = t0;
  const sched = () => {
    if (lull !== me || ls >= end) return;
    let t = ls;
    mel.forEach(([f, d]) => { if (t < end - 1) bell(master, f, t, .13, 1.8 * d); t += d * beat; });
    bass.forEach((f, i) => { const tb = ls + i * 2 * beat; if (tb < end - 1) { tone(master, f, tb, 2.6, .06); tone(master, f * 1.5, tb + beat, 1.8, .03); } });
    ls += loopLen;
    me.timer = setTimeout(sched, Math.max(0, (ls - a.currentTime - 3) * 1000));
  };
  sched();
}
function stopLullaby() {
  if (!lull) return; const m = lull.master; clearTimeout(lull.timer); lull = null;
  try { m.gain.cancelScheduledValues(AC.currentTime); m.gain.setTargetAtTime(0, AC.currentTime, .15); setTimeout(() => m.disconnect(), 1500); } catch (e) {}
}
function say(t) {
  if (!S.speech || !('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t); u.lang = 'sv-SE'; u.rate = .9; u.pitch = 1.15;
    const v = speechSynthesis.getVoices().find(v => v.lang && v.lang.toLowerCase().startsWith('sv')); if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch (e) {}
}
let wakeLock = null;
async function keepAwake() { try { if (navigator.wakeLock && !wakeLock) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); } } catch (e) {} }
function releaseWake() { try { wakeLock && wakeLock.release(); } catch (e) {} wakeLock = null; }

// ---------- Hjälpare ----------
let curScreen = 'home';
function show(id) { $$('.screen').forEach(s => s.classList.toggle('active', s.id === id)); curScreen = id; $('#' + id).scrollTop = 0; }
function holdable(el, ms, onDone) {
  let raf = 0, t0 = 0;
  if (!el.querySelector(':scope > .fill')) { const f = document.createElement('i'); f.className = 'fill'; el.appendChild(f); }
  const cancel = () => { cancelAnimationFrame(raf); raf = 0; el.style.setProperty('--p', 0); };
  el.addEventListener('pointerdown', () => {
    t0 = performance.now(); cancelAnimationFrame(raf);
    const step = now => { const p = Math.min(1, (now - t0) / ms); el.style.setProperty('--p', p); if (p >= 1) { cancel(); onDone(); } else raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => el.addEventListener(ev, cancel));
  el.addEventListener('contextmenu', e => e.preventDefault());
}
function flyStar(from, toEl, done) {
  const s = document.createElement('div'); s.className = 'flystar'; s.innerHTML = ICON.star;
  s.style.left = (from.left + from.width / 2 - 22) + 'px'; s.style.top = (from.top + from.height / 2 - 22) + 'px'; s.style.transform = 'scale(1.6)';
  document.body.appendChild(s);
  const r = toEl.getBoundingClientRect();
  requestAnimationFrame(() => requestAnimationFrame(() => { s.style.left = (r.left + r.width / 2 - 22) + 'px'; s.style.top = (r.top + r.height / 2 - 22) + 'px'; s.style.transform = 'scale(.8) rotate(360deg)'; }));
  setTimeout(() => { s.remove(); done && done(); }, 750);
}

// ---------- Hem ----------
function renderHome() {
  prune(); save();
  const h = new Date().getHours(), eveNow = h >= 16 || h < 4;
  $('#dayArt').innerHTML = ICON.sun; $('#eveArt').innerHTML = ICON.moon; $('#bookArt').innerHTML = ICON.book;
  const d = steps('day'), e = steps('eve');
  $('#daySub').textContent = `${d.st.filter(x => x === 2).length} av ${d.st.length} ⭐`;
  $('#eveSub').textContent = `${e.st.filter(x => x === 2).length} av ${e.st.length} ⭐`;
  $('#bookSub').textContent = `${S.stickers.length} klistermärken`;
  $('#goDay').classList.toggle('now', !eveNow); $('#goEve').classList.toggle('now', eveNow);
}
function goHome() { stopNight(); closeTimer(); $$('.overlay').forEach(o => o.classList.remove('show')); renderHome(); show('home'); }

// ---------- Rutin (Idag / Ikväll) ----------
function openRoutine(m) {
  mode = m; show('routine'); renderRoutine();
  const p = steps(), ids = stepIds(), cur = p.st.findIndex(s => s < 2);
  if (m === 'eve' && unlocked().length > 1 && !dayRec().chosen && cur >= 0) openChooser();
  else if (m === 'eve' && cur >= 0) say(`Ikväll! Först ska vi ${spoken(ids[cur])}.`);
  else if (m === 'day' && cur >= 0) say(`Idag ska vi ${ids.map(spoken).join(', ')}.`);
}
function renderRoutine(pending = -1) {
  const ids = stepIds(), p = steps(), eve = mode === 'eve';
  $('#routine').className = 'screen active ' + mode;
  $('#rTitle').innerHTML = eve ? ICON.moon + 'Ikväll' : ICON.sun + 'Idag';
  const cur = eve ? p.st.findIndex(s => s < 2) : -1;
  $('#path').innerHTML = ids.map((id, i) => `<svg class="st ${p.st[i] === 2 && i !== pending ? 'on' : ''}" data-i="${i}" viewBox="0 0 100 100"><polygon points="${starPts(50, 52, 46, 20)}"/></svg>`).join('')
    + (eve ? `<span class="goal">${headSvg(curAnimal(), true)}</span>` : '');
  $('#steps').innerHTML = ids.map((id, i) => {
    const s = p.st[i], c = card(id);
    const cls = ['step', s === 2 ? 'ok' : '', i === cur ? 'cur' : '', eve && cur >= 0 && i > cur ? 'later' : '', s === 1 ? 'waiting' : ''].join(' ');
    return `<div class="${cls}" data-i="${i}">
      <div class="pic" data-say="${i}"><div class="art">${artSvg(id)}</div><div class="lbl">${esc(lbl(id))}</div>${c.timer ? `<button class="tbtn" data-timer="${i}" aria-label="Timglas">${ICON.hourglass}</button>` : ''}</div>
      <button class="kbox ${s >= 1 ? 'done' : ''}" data-k="${i}" aria-label="Klar">${ICON.paw}</button>
      <button class="pbox ${s === 2 ? 'done' : ''}" data-p="${i}" aria-label="Godkänn (håll in)">${ICON.heart(s === 2)}</button>
    </div>`;
  }).join('');
  $$('#steps .pbox').forEach(b => holdable(b, 900, () => parentHold(+b.dataset.p)));
  $$('#steps .kbox').forEach(b => { const i = +b.dataset.k; if (p.st[i] === 1) holdable(b, 900, () => kidUndo(i)); });
  renderBuddy();
  const rec = dayRec(), nb = $('#rNext'), all = p.st.every(s => s === 2);
  nb.style.display = eve && all ? 'flex' : 'none';
  if (eve && all) nb.innerHTML = !rec.planned && !S.evening.includes('imorgon') ? `${ICON.plan} Imorgon` : !rec.natta ? `${headSvg(curAnimal())} Natta` : '🌙 Sov gott';
  if (cur >= 0) { const el = $(`.step[data-i="${cur}"]`); el && setTimeout(() => el.scrollIntoView({ block: 'center', behavior: 'smooth' }), 50); }
}
$('#steps').addEventListener('click', e => {
  const t = e.target.closest('[data-timer],[data-k],[data-say]'); if (!t || Date.now() - undoAt < 700) return;
  if (t.dataset.timer != null) return openTimer();
  if (t.dataset.k != null) return kidTap(+t.dataset.k);
  if (t.dataset.say != null) { const i = +t.dataset.say, id = stepIds()[i]; if (card(id).plan && mode === 'eve') return planStep(i); say(lbl(id)); }
});
function nudge(i) { const el = $(`.step[data-i="${i}"]`); if (!el) return; el.classList.remove('nudge'); void el.offsetWidth; el.classList.add('nudge'); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
let undoAt = 0;
function kidUndo(i) {
  const p = steps(); if (p.st[i] !== 1) return;
  p.st[i] = 0; save(); undoAt = Date.now(); chime('soft'); renderRoutine();
}
function planStep(i) {
  const p = steps(), cur = p.st.findIndex(s => s < 2);
  if (i !== cur) { say(`Först ska vi ${spoken(stepIds()[cur])}.`); nudge(cur); return; }
  openPlan('step');
}
function kidTap(i) {
  const p = steps(), ids = stepIds(), eve = mode === 'eve', cur = eve ? p.st.findIndex(s => s < 2) : i;
  if (p.st[i] >= 1) { if (p.st[i] === 1) say(`Nu får ${S.parent} titta.`); return; }
  if (eve && i !== cur) { say(`Först ska vi ${spoken(ids[cur])}.`); nudge(cur); return; }
  if (eve && card(ids[i]).plan && !dayRec().planned) { planStep(i); return; }
  p.st[i] = 1; save(); chime('tap'); say(`Klar! Nu får ${S.parent} titta.`); renderRoutine();
}
function parentHold(i) {
  const p = steps(), ids = stepIds(), eve = mode === 'eve';
  if (p.st[i] === 2) { if (confirm(`Ångra godkännandet av ”${lbl(ids[i])}”?`)) { p.st[i] = 1; save(); renderRoutine(); } return; }
  const cur = eve ? p.st.findIndex(s => s < 2) : i;
  if (eve && i !== cur) { nudge(cur); return; }
  const from = $(`.pbox[data-p="${i}"]`).getBoundingClientRect();
  p.st[i] = 2; save(); chime('ok');
  renderRoutine(i);
  const to = $(`#path .st[data-i="${i}"]`);
  flyStar(from, to, () => to.classList.add('on'));
  buddyPop(ids[i]);
  const next = p.st.findIndex(s => s < 2);
  if (next < 0) {
    setTimeout(() => chime('done'), 700);
    if (eve) say(`${praise()} Alla stjärnor! ` + (S.evening.includes('imorgon') || dayRec().planned ? `Nu ska vi natta ${curAnimal().n}.` : 'Nu ska vi göra morgondagens schema.'));
    else { setTimeout(confetti, 700); say('Jättebra! Alla stjärnor idag!'); }
  } else say(eve ? `${praise()} Nu ska vi ${spoken(ids[next])}.` : praise());
}
$('#rNext').addEventListener('click', () => {
  const rec = dayRec();
  if (!rec.planned && !S.evening.includes('imorgon')) openPlan('natta');
  else if (!rec.natta || !rec.sticker) openNatta();
  else { openNatta(); startNight(); }
});
function renderBuddy() {
  const b = $('#buddy');
  if (mode !== 'eve') { b.style.display = 'none'; return; }
  b.style.display = ''; b.innerHTML = animalSvg(curAnimal(), { pj: pjDone() });
}
function buddyPop(id) {
  if (mode !== 'eve') return;
  const b = $('#buddy'); renderBuddy(); b.classList.remove('hop'); void b.offsetWidth; b.classList.add('hop');
  const c = document.createElement('div'); c.className = 'popcard'; c.innerHTML = artSvg(id); b.appendChild(c); setTimeout(() => c.remove(), 1800);
}
$('#buddy').addEventListener('click', () => { if (unlocked().length > 1 && !dayRec().natta) openChooser(); else say(`Hej! Jag är ${curAnimal().n}.`); });
function openChooser() {
  $('#chooseList').innerHTML = unlocked().map(a => `<button class="a" data-a="${a.id}">${animalSvg(a)}</button>`).join('');
  $('#chooseOv').classList.add('show'); say('Vem ska du natta ikväll?');
}
$('#chooseList').addEventListener('click', e => {
  const b = e.target.closest('[data-a]'); if (!b) return;
  S.animal = b.dataset.a; dayRec().chosen = true; save(); $('#chooseOv').classList.remove('show'); chime('tap');
  renderRoutine(); const p = steps(), cur = p.st.findIndex(s => s < 2);
  say(`Ikväll nattar vi ${curAnimal().n}.` + (cur >= 0 ? ` Först ska vi ${spoken(S.evening[cur])}.` : ''));
});

// ---------- Planera morgondagen ----------
let planFlow = false, planSel = -1, planAdded = -1;
function openPlan(flow) {
  planFlow = flow; planSel = -1; const k = tomorrowKey();
  if (!S.plans[k]) { S.plans[k] = S.morning.slice(); save(); }
  show('plan'); renderPlan();
  if (flow) say('Vad ska vi göra imorgon?');
}
function renderPlan() {
  const k = tomorrowKey(), list = S.plans[k];
  $('#pTitle').innerHTML = `${ICON.sun}Imorgon, ${wdOf(k)}`;
  $('#planRow').innerHTML = list.map((id, i) => `<button class="pcard ${i === planSel ? 'sel' : ''} ${i === planAdded ? 'added' : ''}" data-i="${i}"><span class="num">${i + 1}</span><div class="art">${artSvg(id)}</div><div class="lbl">${esc(lbl(id))}</div></button>`).join('')
    || '<div class="empty">Tryck på bilderna nedanför</div>';
  planAdded = -1;
  $('#planTools').style.visibility = planSel >= 0 ? 'visible' : 'hidden';
  $('#planLib').innerHTML = CARDS.filter(c => !c.eve).map(c => `<button class="pcard" data-id="${c.id}"><div class="art">${artSvg(c.id)}</div><div class="lbl">${esc(lbl(c.id))}</div></button>`).join('');
  $('#planDone').innerHTML = planFlow === 'natta' ? `${headSvg(curAnimal())} Klar` : '👍 Klar';
}
$('#planLib').addEventListener('click', e => {
  const b = e.target.closest('[data-id]'); if (!b) return;
  const list = S.plans[tomorrowKey()]; list.push(b.dataset.id); planAdded = list.length - 1; planSel = -1; save(); chime('tap'); say(lbl(b.dataset.id)); renderPlan();
});
$('#planRow').addEventListener('click', e => {
  const b = e.target.closest('[data-i]'); if (!b) return;
  const i = +b.dataset.i; planSel = planSel === i ? -1 : i; if (planSel >= 0) say(lbl(S.plans[tomorrowKey()][i])); renderPlan();
});
function planMove(d) {
  const list = S.plans[tomorrowKey()], j = planSel + d; if (planSel < 0 || j < 0 || j >= list.length) return;
  [list[planSel], list[j]] = [list[j], list[planSel]]; planSel = j; save(); renderPlan();
}
$('#pLeft').onclick = () => planMove(-1);
$('#pRight').onclick = () => planMove(1);
$('#pDel').onclick = () => { if (planSel < 0) return; S.plans[tomorrowKey()].splice(planSel, 1); planSel = -1; save(); renderPlan(); };
$('#planDone').onclick = () => {
  if (!planFlow) { renderSettings(); show('settings'); return; }
  dayRec().planned = true; save(); chime('ok');
  if (planFlow === 'step') { mode = 'eve'; show('routine'); renderRoutine(); say('Klart! Tryck på din ruta.'); }
  else openNatta();
};

// ---------- Natta djuret ----------
let nStep = 0, pendingSticker = null;
function openNatta() {
  const rec = dayRec(), a = curAnimal();
  show('natta'); $('#nTitle').textContent = 'Natta ' + a.n;
  $('#scene').innerHTML = sceneSvg(a, pjDone());
  nStep = rec.natta ? 4 : 0; applyScene();
  if (!rec.natta) say(`Nu ska vi natta ${a.n}. Tryck på ${a.n}!`);
  else if (!rec.sticker) setTimeout(showSticker, 600);
}
function applyScene() {
  const q = id => document.getElementById(id);
  q('floorAnimal').classList.toggle('hide', nStep >= 1);
  q('bedAnimal').classList.toggle('hide', nStep < 1);
  q('blanketFold').classList.toggle('hide', nStep >= 2);
  q('blanketOn').classList.toggle('hide', nStep < 2);
  q('lampShade').setAttribute('fill', nStep >= 3 ? '#fff59d' : '#9575cd');
  q('glow').style.opacity = nStep >= 3 ? 1 : 0; q('dim').style.opacity = nStep >= 3 ? .45 : 0;
  q('zzz').classList.toggle('hide', nStep < 4);
  q('bedHead').innerHTML = head(curAnimal(), nStep >= 4);
  ['floorHint', 'foldHint', 'lampHint'].forEach((h, i) => q(h).classList.toggle('hint', nStep === i));
  $('#kissBtn').style.display = nStep === 3 ? 'flex' : 'none';
  $('#sleepBtn').style.display = nStep >= 4 && dayRec().sticker ? 'flex' : 'none';
}
$('#scene').addEventListener('click', e => {
  const t = e.target.closest('[data-tap]'); if (!t) return;
  const a = curAnimal(), what = t.dataset.tap;
  if (what === 'floor' && nStep === 0) {
    nStep = 1; applyScene(); document.getElementById('bedAnimal').classList.add('bedin'); chime('tap'); say(`Hopp! Nu ligger ${a.n} i sängen. Dra på filten!`);
  } else if (what === 'blanket' && nStep === 1) {
    nStep = 2; applyScene(); chime('tap'); say('Mysigt och varmt. Tänd nattlampan!');
  } else if (what === 'lamp' && nStep === 2) {
    nStep = 3; applyScene(); chime('soft'); say(`Ge ${a.n} en godnattpuss!`);
  } else if (what === 'kiss' && nStep === 3) kiss();
});
$('#kissBtn').onclick = () => { if (nStep === 3) kiss(); };
function kiss() {
  const a = curAnimal(); nStep = 4; applyScene(); chime('soft'); hearts();
  say(`Puss! Sov gott, ${a.n}.`);
  dayRec().natta = true; save();
  setTimeout(showSticker, 2800);
}
function hearts() {
  const r = document.getElementById('bedHead').getBoundingClientRect();
  for (let i = 0; i < 6; i++) {
    const h = document.createElement('div'); h.className = 'heartfly'; h.textContent = '❤️';
    h.style.left = (r.left + r.width / 2 - 17 + (Math.random() - .5) * 40) + 'px'; h.style.top = (r.top + r.height / 3) + 'px';
    h.style.setProperty('--dx', ((Math.random() - .5) * 120) + 'px'); h.style.animationDelay = (i * .15) + 's';
    document.body.appendChild(h); setTimeout(() => h.remove(), 2800);
  }
}
function showSticker() {
  if (curScreen !== 'natta' || dayRec().sticker) return;
  const keys = Object.keys(STICKERS), last = S.stickers.length ? S.stickers[S.stickers.length - 1].s : null;
  let s; do { s = keys[Math.floor(Math.random() * keys.length)]; } while (s === last);
  pendingSticker = s; $('#stBig').innerHTML = stickerSvg(s); $('#stickerOv').classList.add('show'); chime('done');
  say('Du har fått ett klistermärke! Tryck på det, så sätter vi in det i samlarboken.');
}
$('#stBig').onclick = () => {
  const rec = dayRec();
  if (!rec.sticker) { S.stickers.push({ d: dkey(), s: pendingSticker }); rec.sticker = pendingSticker; save(); }
  $('#stickerOv').classList.remove('show'); openBook(true, true);
};
$('#sleepBtn').onclick = () => startNight();

// ---------- Samlarbok ----------
let bookPage = 0, bookFlow = false;
function openBook(flow, fresh) {
  bookFlow = flow; const n = S.stickers.length;
  bookPage = Math.floor(Math.max(0, n - 1) / 7);
  show('book'); renderBook(fresh ? n - 1 : -1);
  $('#bookSleep').style.display = flow ? 'flex' : 'none';
  if (!fresh) return;
  const done = n % 7 === 0, newA = done ? ANIMALS[n / 7] : null;
  if (newA) setTimeout(() => unlockCelebrate(newA), 1300);
  else if (done) { setTimeout(confetti, 900); say('Snyggt! Hela sidan är full!'); }
  else if (n / 7 < ANIMALS.length - 1) { const left = 7 - n % 7; say(`Snyggt! ${left} till, så får du ett nytt djur att natta.`); }
  else say('Snyggt!');
}
function renderBook(fresh = -1) {
  const n = S.stickers.length, pages = Math.max(1, Math.ceil(n / 7)), p = Math.min(bookPage, pages - 1);
  let html = '';
  for (let i = 0; i < 7; i++) {
    const idx = p * 7 + i, st = S.stickers[idx];
    html += `<div class="slot ${idx === fresh ? 'fresh' : ''}">${st ? stickerSvg(st.s) + `<span class="d">${wdOf(st.d).slice(0, 3)}</span>` : ''}</div>`;
  }
  const prize = ANIMALS[p + 1];
  html += `<div class="slot prize ${n >= (p + 1) * 7 ? 'won' : ''}">${prize ? animalSvg(prize) : ICON.star}</div>`;
  $('#page').innerHTML = html;
  $('#pageNo').textContent = `Sida ${p + 1} av ${pages}`;
  $('#prevPage').style.visibility = p > 0 ? 'visible' : 'hidden';
  $('#nextPage').style.visibility = p < pages - 1 ? 'visible' : 'hidden';
  const un = unlocked(), cur = curAnimal();
  $('#zoo').innerHTML = ANIMALS.map(a => `<button class="a ${un.includes(a) ? '' : 'locked'} ${a === cur ? 'chosen' : ''}" data-a="${a.id}">${animalSvg(a)}</button>`).join('');
}
$('#prevPage').onclick = () => { bookPage = Math.max(0, bookPage - 1); renderBook(); };
$('#nextPage').onclick = () => { bookPage++; renderBook(); };
$('#zoo').addEventListener('click', e => {
  const b = e.target.closest('[data-a]'); if (!b) return;
  const a = ANIMALS.find(x => x.id === b.dataset.a);
  if (!unlocked().includes(a)) { say('Fyll en sida i samlarboken, så kommer ett nytt djur!'); return; }
  if (dayRec().natta) { say(`Det är ${a.n}!`); return; }
  S.animal = a.id; save(); chime('tap'); say(`Ikväll nattar vi ${a.n}.`); renderBook();
});
function unlockCelebrate(a) {
  $('#unlockMsg').textContent = `Ny kompis: ${a.n[0].toUpperCase() + a.n.slice(1)}!`;
  $('#unlockArt').innerHTML = animalSvg(a); $('#unlockOv').classList.add('show');
  confetti(); chime('done'); say(`Hurra! Sidan är full! Nu kan du natta ${a.n} också.`);
}
$('#unlockOk').onclick = () => { $('#unlockOv').classList.remove('show'); renderBook(); };
$('#bookSleep').onclick = () => { openNatta(); startNight(); };

// ---------- Natt (vaggvisa + skärmen dimmas) ----------
let nightTimer = null;
function startNight() {
  const sec = (S.lullaby || 1) * 60, n = $('#night');
  $('#nightMoon').innerHTML = ICON.moon;
  n.classList.remove('done'); n.classList.add('on');
  n.style.transition = 'none'; n.style.opacity = 0; void n.offsetWidth;
  n.style.transition = `opacity ${sec}s linear`; n.style.opacity = .94;
  if (S.lullaby) startLullaby(sec);
  say(''); keepAwake();
  clearTimeout(nightTimer);
  nightTimer = setTimeout(() => { n.style.transition = 'opacity 3s'; n.style.opacity = 1; n.classList.add('done'); releaseWake(); }, sec * 1000);
}
function stopNight() {
  clearTimeout(nightTimer); stopLullaby(); releaseWake();
  const n = $('#night'); n.classList.remove('on', 'done'); n.style.transition = 'none'; n.style.opacity = 0;
}
holdable($('#nightExit'), 1000, goHome);

// ---------- Timglas ----------
let tm = null;
function openTimer() {
  closeTimer();
  const dur = S.timerMin * 60000, t0 = performance.now(); let half = false;
  $('#timerOv').classList.add('show'); $('#timerMsg').textContent = ''; $('#timerDone').style.display = 'none';
  chime('soft'); say('Nu borstar vi tänderna tills sanden har runnit ner.'); keepAwake();
  tm = { raf: 0 };
  const step = now => {
    const t = Math.min(1, (now - t0) / dur); setSand(t);
    const left = Math.ceil((dur - (now - t0)) / 1000);
    $('#timerTime').textContent = left > 0 ? `${Math.floor(left / 60)}:${pad(left % 60)}` : '';
    if (!half && t >= .5) { half = true; say('Halvvägs! Glöm inte tänderna längst bak.'); }
    if (t < 1) tm.raf = requestAnimationFrame(step); else timerDone();
  };
  tm.raf = requestAnimationFrame(step);
}
function setSand(t) {
  const top = $('#sandTop'), bot = $('#sandBot'), str = $('#stream'), by = 180 - 64 * t;
  top.setAttribute('y', 40 + 60 * t); top.setAttribute('height', Math.max(0, 60 * (1 - t)));
  bot.setAttribute('y', by); bot.setAttribute('height', 180 - by);
  str.setAttribute('height', Math.max(0, by - 98)); str.style.display = t > 0 && t < 1 ? '' : 'none';
}
function timerDone() {
  chime('done'); confetti(); say('Klart! Nu är tänderna jätterena!');
  $('#timerMsg').textContent = 'Klart!'; $('#timerDone').style.display = 'flex'; releaseWake();
}
function closeTimer() { if (tm) cancelAnimationFrame(tm.raf); tm = null; $('#timerOv').classList.remove('show'); setSand(0); }
$('#timerClose').onclick = closeTimer;
$('#timerDone').onclick = () => { closeTimer(); if (curScreen === 'routine') say('Tryck på din ruta!'); };

// ---------- Inställningar ----------
function seg(sel, opts, get, set) {
  const el = $(sel);
  el.innerHTML = opts.map(([v, t]) => `<button data-v="${v}" class="${get() === v ? 'on' : ''}">${t}</button>`).join('');
  el.onclick = e => { const b = e.target.closest('[data-v]'); if (!b) return; const o = opts.find(x => String(x[0]) === b.dataset.v); set(o[0]); save(); renderSettings(); };
}
function editList(sel, arr, pool) {
  const el = $(sel);
  el.innerHTML = arr.map((id, i) => `<div class="erow"><div class="art">${artSvg(id)}</div><span>${esc(lbl(id))}</span><button data-act="up" data-i="${i}">▲</button><button data-act="down" data-i="${i}">▼</button><button data-act="del" data-i="${i}">✕</button></div>`).join('')
    + `<div class="erow"><select><option value="">+ Lägg till…</option>${pool.map(c => `<option value="${c.id}">${esc(lbl(c.id))}</option>`).join('')}</select></div>`;
  el.onclick = e => {
    const b = e.target.closest('button[data-act]'); if (!b) return; const i = +b.dataset.i;
    if (b.dataset.act === 'up' && i > 0) [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    if (b.dataset.act === 'down' && i < arr.length - 1) [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
    if (b.dataset.act === 'del' && arr.length > 1) arr.splice(i, 1);
    save(); renderSettings();
  };
  el.querySelector('select').onchange = e => { if (e.target.value) { arr.push(e.target.value); save(); renderSettings(); } };
}
function renderSettings() {
  $('#sParent').value = S.parent;
  editList('#sEve', S.evening, CARDS);
  editList('#sMorn', S.morning, CARDS.filter(c => !c.eve));
  seg('#sTimer', [[1, '1 min'], [2, '2 min'], [3, '3 min']], () => S.timerMin, v => S.timerMin = v);
  seg('#sLull', [[0, 'Ingen musik'], [2, '2 min'], [3, '3 min'], [5, '5 min']], () => S.lullaby, v => S.lullaby = v);
  seg('#sSound', [['speech', `Uppläsning: ${S.speech ? 'på' : 'av'}`], ['sound', `Ljudeffekter: ${S.sound ? 'på' : 'av'}`]], () => '', v => S[v] = !S[v]);
  $('#sLabels').innerHTML = CARDS.map(c => `<div class="erow"><div class="art">${artSvg(c.id)}</div><input type="text" data-id="${c.id}" value="${esc(lbl(c.id))}" placeholder="${esc(c.l)}"></div>`).join('');
}
$('#sParent').onchange = e => { S.parent = e.target.value.trim() || 'mamma'; save(); };
$('#sLabels').addEventListener('change', e => {
  const id = e.target.dataset.id; if (!id) return; const v = e.target.value.trim();
  if (!v || v === card(id).l) delete S.labels[id]; else S.labels[id] = v; save();
});
$('#sPlan').onclick = () => openPlan(false);
$('#rEve').onclick = () => {
  if (!confirm('Börja om kvällen? Kvällens stjärnor, planering och nattning nollställs.')) return;
  const rec = dayRec();
  if (rec.sticker) { const i = S.stickers.map(s => s.d).lastIndexOf(dkey()); if (i >= 0) S.stickers.splice(i, 1); }
  ['eve', 'planned', 'natta', 'sticker', 'chosen'].forEach(k => delete rec[k]); save(); alert('Klart!');
};
$('#rDay').onclick = () => { if (confirm('Börja om dagens schema?')) { delete dayRec().day; save(); alert('Klart!'); } };
$('#rAll').onclick = () => { if (confirm('Radera allt, även samlarboken?')) { localStorage.removeItem(KEY); location.reload(); } };

// ---------- Konfetti ----------
const cv = $('#confetti'), cx = cv.getContext('2d'); let parts = [], cOn = false;
function confetti() {
  cv.width = innerWidth; cv.height = innerHeight;
  const cols = ['#ef5350', '#ffca28', '#66bb6a', '#42a5f5', '#ab47bc', '#ff7043'];
  for (let i = 0; i < 120; i++) parts.push({ x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * .5, vx: (Math.random() - .5) * 3, vy: 2 + Math.random() * 3, r: Math.random() * 6.28, vr: (Math.random() - .5) * .3, c: cols[i % cols.length], s: 6 + Math.random() * 6 });
  if (!cOn) { cOn = true; requestAnimationFrame(tick); }
}
function tick() {
  cx.clearRect(0, 0, cv.width, cv.height);
  parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.r += p.vr; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c; cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); cx.restore(); });
  parts = parts.filter(p => p.y < cv.height + 20);
  if (parts.length) requestAnimationFrame(tick); else { cOn = false; cx.clearRect(0, 0, cv.width, cv.height); }
}

// ---------- Start ----------
$$('[data-home]').forEach(b => b.addEventListener('click', goHome));
$('#goDay').onclick = () => openRoutine('day');
$('#goEve').onclick = () => openRoutine('eve');
$('#goBook').onclick = () => openBook(false, false);
holdable($('#gearBtn'), 1000, () => { renderSettings(); show('settings'); });
if ('speechSynthesis' in window) speechSynthesis.getVoices();
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && (lull || tm)) keepAwake(); });
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
renderHome();
