// Egenritade illustrationer (SVG). Kort: viewBox 0 0 100 100.
function starPts(cx, cy, R, r, n = 5) {
  const p = [];
  for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, d = i % 2 ? r : R; p.push((cx + d * Math.cos(a)).toFixed(1) + ',' + (cy + d * Math.sin(a)).toFixed(1)); }
  return p.join(' ');
}
const star = (cx, cy, R, c = '#fff') => `<polygon points="${starPts(cx, cy, R, R * .45)}" fill="${c}"/>`;
const face = (cx, cy, s = 1) => `<circle cx="${cx - 6 * s}" cy="${cy - 3 * s}" r="${2.6 * s}" fill="#3e2723"/><circle cx="${cx + 6 * s}" cy="${cy - 3 * s}" r="${2.6 * s}" fill="#3e2723"/><path d="M${cx - 6 * s} ${cy + 4 * s} Q${cx} ${cy + 10 * s} ${cx + 6 * s} ${cy + 4 * s}" stroke="#3e2723" stroke-width="${2.2 * s}" fill="none" stroke-linecap="round"/>`;
const bg = c => `<rect width="100" height="100" fill="${c}"/>`;
const rays = (cx, cy, r1, r2, from, to, step, c, w = 4) => { let s = ''; for (let a = from; a <= to; a += step) { const t = a * Math.PI / 180; s += `<line x1="${(cx + r1 * Math.cos(t)).toFixed(1)}" y1="${(cy + r1 * Math.sin(t)).toFixed(1)}" x2="${(cx + r2 * Math.cos(t)).toFixed(1)}" y2="${(cy + r2 * Math.sin(t)).toFixed(1)}"/>`; } return `<g stroke="${c}" stroke-width="${w}" stroke-linecap="round">${s}</g>`; };
const moonPath = (x, y, s, c = '#fff59d') => `<path d="M${x} ${y} a${12 * s} ${12 * s} 0 1 0 ${12 * s} ${16 * s} a${9 * s} ${9 * s} 0 1 1 ${-12 * s} ${-16 * s}z" fill="${c}"/>`;
const carShape = c => `<path d="M10 66 V52 Q10 46 18 45 L30 30 Q34 26 40 26 H62 Q68 26 72 31 L82 45 Q92 46 92 54 V66Z" fill="${c}"/><path d="M34 44 L41 32 H50 V44Z M55 44 V32 H63 Q66 32 68 35 L74 44Z" fill="#b3e5fc"/><circle cx="30" cy="68" r="10" fill="#37474f"/><circle cx="30" cy="68" r="4" fill="#cfd8dc"/><circle cx="72" cy="68" r="10" fill="#37474f"/><circle cx="72" cy="68" r="4" fill="#cfd8dc"/>`;
const kid = (cx, skin, hair, shirt) => `<path d="M${cx - 18} 96 Q${cx - 18} 68 ${cx} 68 Q${cx + 18} 68 ${cx + 18} 96Z" fill="${shirt}"/><circle cx="${cx}" cy="50" r="16" fill="${skin}"/><path d="M${cx - 16} 48 Q${cx - 16} 32 ${cx} 32 Q${cx + 16} 32 ${cx + 16} 48 Q${cx + 8} 38 ${cx} 40 Q${cx - 8} 38 ${cx - 16} 48Z" fill="${hair}"/>` + face(cx, 52, .8);
const HEART = 'M50 86 C20 66 8 50 8 34 C8 20 18 12 30 12 C40 12 46 18 50 26 C54 18 60 12 70 12 C82 12 92 20 92 34 C92 50 80 66 50 86Z';
const GLASS = 'M22 20 C22 65 54 80 56 100 C54 120 22 135 22 180 L98 180 C98 135 66 120 64 100 C66 80 98 65 98 20Z';

const ART = {
  bad: () => bg('#b3e5fc') + `<g fill="#fff"><circle cx="26" cy="44" r="10"/><circle cx="40" cy="38" r="12"/><circle cx="56" cy="42" r="10"/><circle cx="72" cy="46" r="8"/></g><circle cx="82" cy="22" r="5" fill="none" stroke="#fff" stroke-width="2"/><circle cx="18" cy="22" r="3.5" fill="none" stroke="#fff" stroke-width="2"/><circle cx="66" cy="16" r="3" fill="none" stroke="#fff" stroke-width="2"/>
    <g transform="translate(58 30)"><ellipse cx="0" cy="12" rx="13" ry="8" fill="#ffd54f"/><circle cx="7" cy="2" r="7" fill="#ffd54f"/><path d="M13 1 l7 2 l-7 3z" fill="#ff8f00"/><circle cx="9" cy="0" r="1.5" fill="#3e2723"/></g>
    <path d="M10 52 H90 Q88 80 70 80 H30 Q12 80 10 52Z" fill="#eceff1" stroke="#90a4ae" stroke-width="3"/><rect x="8" y="48" width="84" height="8" rx="4" fill="#cfd8dc"/><rect x="28" y="80" width="6" height="8" rx="2" fill="#90a4ae"/><rect x="66" y="80" width="6" height="8" rx="2" fill="#90a4ae"/>`,
  smorj: () => bg('#f8bbd0') + `<rect x="30" y="34" width="34" height="54" rx="10" fill="#fff" stroke="#ec407a" stroke-width="3"/><rect x="38" y="22" width="18" height="14" rx="3" fill="#ec407a"/><rect x="44" y="12" width="22" height="6" rx="3" fill="#ec407a"/><rect x="44" y="12" width="5" height="12" fill="#ec407a"/>
    <path d="M47 70 C38 63 36 59 36 56 C36 52 39 50 42 50 C44.5 50 46 51.5 47 53.5 C48 51.5 49.5 50 52 50 C55 50 58 52 58 56 C58 59 56 63 47 70Z" fill="#f48fb1"/>
    <path d="M76 36 q7 10 0 13 q-7 -3 0 -13z" fill="#fff"/><path d="M82 58 q6 8 0 11 q-6 -3 0 -11z" fill="#fff"/>` + star(20, 26, 7) + star(80, 84, 5),
  pyjamas: () => bg('#c5cae9') + `<path d="M30 18 L42 14 Q50 22 58 14 L70 18 L90 34 L80 46 L72 40 L72 86 L28 86 L28 40 L20 46 L10 34 Z" fill="url(#pj)" stroke="#3949ab" stroke-width="3" stroke-linejoin="round"/><line x1="50" y1="22" x2="50" y2="86" stroke="#3949ab" stroke-width="2"/><circle cx="55" cy="36" r="2.5" fill="#3949ab"/><circle cx="55" cy="52" r="2.5" fill="#3949ab"/><circle cx="55" cy="68" r="2.5" fill="#3949ab"/>` + moonPath(36, 28, .6),
  tander: () => bg('#e0f7fa') + `<g transform="translate(-4 2) scale(.84)"><path d="M28 22 Q38 14 50 22 Q62 14 72 22 Q82 34 74 52 Q70 64 68 80 Q66 88 60 82 Q56 64 50 64 Q44 64 40 82 Q34 88 32 80 Q30 64 26 52 Q18 34 28 22Z" fill="#fff" stroke="#80deea" stroke-width="3"/>${face(50, 40, 1)}</g>` + star(82, 16, 7, '#4dd0e1') + star(14, 72, 5, '#4dd0e1') +
    `<g transform="rotate(-40 78 74)"><rect x="56" y="70" width="44" height="8" rx="4" fill="#42a5f5"/><rect x="58" y="60" width="16" height="10" rx="2" fill="#fff" stroke="#90caf9" stroke-width="2"/><path d="M61 61 v8 M65 61 v8 M69 61 v8" stroke="#90caf9" stroke-width="1.5"/></g>`,
  sang: () => bg('#283593') + star(22, 18, 5) + star(44, 28, 4) + star(52, 10, 3) + moonPath(70, 12, 1) + `<rect x="10" y="40" width="10" height="48" rx="3" fill="#8d6e63"/><rect x="80" y="56" width="10" height="32" rx="3" fill="#8d6e63"/><rect x="16" y="60" width="70" height="16" rx="4" fill="#fff"/><rect x="20" y="50" width="24" height="13" rx="6" fill="#e3f2fd"/><path d="M40 60 Q62 52 84 58 V76 H40Z" fill="url(#quilt)"/><rect x="16" y="76" width="70" height="6" fill="#a1887f"/>`,
  vakna: () => bg('#fff3e0') + rays(50, 58, 30, 40, -170, -10, 20, '#ffb300') + `<circle cx="50" cy="58" r="22" fill="#ffca28"/>` + face(50, 58, 1.1) + `<path d="M0 72 Q50 58 100 72 V100 H0Z" fill="#81c784"/>`,
  tv: () => bg('#d1c4e9') + `<path d="M40 24 L30 10 M60 24 L70 10" stroke="#5d4037" stroke-width="3" stroke-linecap="round"/><rect x="12" y="24" width="76" height="56" rx="10" fill="#6d4c41"/><rect x="20" y="31" width="52" height="42" rx="6" fill="#4fc3f7"/><circle cx="80" cy="40" r="3.5" fill="#ffd54f"/><circle cx="80" cy="52" r="3.5" fill="#ffd54f"/><rect x="26" y="80" width="6" height="8" fill="#5d4037"/><rect x="68" y="80" width="6" height="8" fill="#5d4037"/>` + face(46, 52, 1),
  bloja: () => bg('#dcedc8') + `<path d="M14 28 H86 V44 Q86 80 50 82 Q14 80 14 44Z" fill="#fff" stroke="#9ccc65" stroke-width="3"/><rect x="10" y="26" width="16" height="12" rx="3" fill="#aed581"/><rect x="74" y="26" width="16" height="12" rx="3" fill="#aed581"/>` + star(38, 50, 6, '#ffd54f') + star(60, 56, 6, '#81d4fa') + star(48, 68, 5, '#f48fb1'),
  klader: () => bg('#ffe0b2') + `<path d="M24 14 L36 10 Q42 18 48 10 L60 14 L72 26 L64 34 L58 30 V52 H26 V30 L20 34 L12 26Z" fill="#ef5350" stroke="#c62828" stroke-width="2.5" stroke-linejoin="round"/>` + star(42, 32, 7) + `<path d="M40 56 H84 L86 92 H68 L62 70 L56 92 H38Z" fill="#42a5f5" stroke="#1565c0" stroke-width="2.5" stroke-linejoin="round"/>`,
  ytter: () => bg('#b2dfdb') + `<path d="M34 42 Q50 36 66 42 L84 52 L80 90 L70 88 V95 H30 V88 L20 90 L16 52Z" fill="#ffa726" stroke="#e65100" stroke-width="2.5" stroke-linejoin="round"/><line x1="50" y1="40" x2="50" y2="95" stroke="#e65100" stroke-width="2.5"/><path d="M36 34 Q36 12 50 12 Q64 12 64 34Z" fill="#e53935"/><rect x="34" y="28" width="32" height="8" rx="4" fill="#fff"/><circle cx="50" cy="11" r="5" fill="#fff"/>`,
  forskola: () => bg('#c8e6c9') + `<rect x="18" y="44" width="64" height="44" fill="#fff3e0" stroke="#8d6e63" stroke-width="2.5"/><path d="M10 46 L50 16 L90 46Z" fill="#e53935" stroke="#b71c1c" stroke-width="2.5" stroke-linejoin="round"/><rect x="42" y="62" width="16" height="26" rx="3" fill="#8d6e63"/><rect x="24" y="54" width="14" height="12" fill="#81d4fa" stroke="#8d6e63" stroke-width="2"/><rect x="62" y="54" width="14" height="12" fill="#81d4fa" stroke="#8d6e63" stroke-width="2"/><line x1="50" y1="16" x2="50" y2="4" stroke="#5d4037" stroke-width="2"/><path d="M50 4 L62 7 L50 10Z" fill="#ffd54f"/>`,
  park: () => bg('#dcedc8') + `<rect x="0" y="88" width="100" height="12" fill="#a5d6a7"/><path d="M16 90 L28 16 L40 90 M60 90 L72 16 L84 90" stroke="#8d6e63" stroke-width="5" fill="none" stroke-linejoin="round"/><rect x="22" y="13" width="56" height="6" rx="3" fill="#6d4c41"/><path d="M42 18 V64 M58 18 V64" stroke="#795548" stroke-width="2"/><rect x="38" y="62" width="24" height="7" rx="3" fill="#ef5350"/>`,
  mormor: () => bg('#f3e5f5') + `<path d="M14 96 Q14 66 34 66 Q54 66 54 96Z" fill="#ab47bc"/><circle cx="34" cy="46" r="16" fill="#ffe0b2"/><path d="M18 44 Q18 28 34 28 Q50 28 50 44 Q44 34 34 34 Q24 34 18 44Z" fill="#e0e0e0"/><circle cx="34" cy="24" r="7" fill="#e0e0e0"/>` + face(34, 48, .8) + `<g fill="none" stroke="#5d4037" stroke-width="1.5"><circle cx="29.2" cy="45.6" r="4"/><circle cx="38.8" cy="45.6" r="4"/></g>
    <path d="M48 96 Q48 64 68 64 Q88 64 88 96Z" fill="#5c6bc0"/><circle cx="68" cy="44" r="16" fill="#ffe0b2"/><path d="M53 42 Q53 30 60 29 M83 42 Q83 30 76 29" stroke="#e0e0e0" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M56 52 Q68 68 80 52 Q74 58 68 58 Q62 58 56 52Z" fill="#eeeeee"/>` + face(68, 44, .8),
  simning: () => bg('#81d4fa') + `<circle cx="50" cy="40" r="24" fill="none" stroke="#ef5350" stroke-width="12" stroke-dasharray="18.85 18.85"/><circle cx="50" cy="40" r="24" fill="none" stroke="#fff" stroke-width="12" stroke-dasharray="18.85 18.85" stroke-dashoffset="18.85"/><path d="M0 64 q12.5 -8 25 0 t25 0 t25 0 t25 0 V100 H0Z" fill="#29b6f6"/><path d="M0 80 q12.5 -8 25 0 t25 0 t25 0 t25 0 V100 H0Z" fill="#0288d1"/>`,
  handla: () => bg('#fff9c4') + `<path d="M28 34 H88 L80 64 H33Z" fill="#cfd8dc"/><circle cx="48" cy="28" r="9" fill="#e53935"/><path d="M48 19 q3 -5 7 -5" stroke="#5d4037" stroke-width="2" fill="none"/><rect x="60" y="16" width="16" height="20" rx="3" fill="#66bb6a"/><path d="M8 22 H22 L32 66 H80 L88 34 H26" fill="none" stroke="#546e7a" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/><circle cx="38" cy="80" r="7" fill="#37474f"/><circle cx="74" cy="80" r="7" fill="#37474f"/>`,
  bil: () => bg('#e1f5fe') + `<rect x="0" y="78" width="100" height="22" fill="#90a4ae"/><path d="M8 89 H24 M40 89 H56 M72 89 H88" stroke="#fff" stroke-width="3"/>` + carShape('#e53935'),
  buss: () => bg('#e3f2fd') + `<rect x="0" y="82" width="100" height="18" fill="#90a4ae"/><rect x="8" y="24" width="84" height="50" rx="8" fill="#fbc02d"/>` + [14, 32, 50, 68].map(x => `<rect x="${x}" y="31" width="14" height="16" rx="2" fill="#b3e5fc"/>`).join('') + `<rect x="8" y="56" width="84" height="5" fill="#f57f17"/><circle cx="28" cy="76" r="9" fill="#37474f"/><circle cx="72" cy="76" r="9" fill="#37474f"/>`,
  cykel: () => bg('#f1f8e9') + `<circle cx="26" cy="62" r="17" fill="none" stroke="#37474f" stroke-width="4"/><circle cx="74" cy="62" r="17" fill="none" stroke="#37474f" stroke-width="4"/><path d="M26 62 L42 38 H66 L74 62 M42 38 L52 62 L66 38 M52 62 H26" stroke="#43a047" stroke-width="4" fill="none" stroke-linejoin="round"/><path d="M36 32 H48 M66 38 L62 26 H72" stroke="#37474f" stroke-width="4" stroke-linecap="round" fill="none"/>`,
  bok: () => bg('#ffecb3') + `<path d="M50 30 Q32 20 10 24 V80 Q32 76 50 86Z" fill="#fff" stroke="#8d6e63" stroke-width="3" stroke-linejoin="round"/><path d="M50 30 Q68 20 90 24 V80 Q68 76 50 86Z" fill="#fff" stroke="#8d6e63" stroke-width="3" stroke-linejoin="round"/><path d="M18 38 Q30 35 42 40 M18 48 Q30 45 42 50 M18 58 Q30 55 42 60" stroke="#bcaaa4" stroke-width="2" fill="none"/>` + star(70, 50, 13, '#ffb300'),
  leka: () => bg('#e8eaf6') + `<rect x="12" y="56" width="28" height="28" rx="4" fill="#ef5350"/><rect x="40" y="56" width="28" height="28" rx="4" fill="#42a5f5"/><rect x="26" y="28" width="28" height="28" rx="4" fill="#ffca28"/><g font-family="sans-serif" font-weight="bold" font-size="18" fill="#fff" text-anchor="middle"><text x="26" y="77">A</text><text x="54" y="77">B</text><text x="40" y="49">C</text></g><circle cx="82" cy="72" r="13" fill="#66bb6a"/><path d="M69 72 H95 M82 59 Q74 72 82 85" stroke="#fff" stroke-width="2.5" fill="none"/>`,
  middag: () => bg('#ffe0b2') + `<circle cx="50" cy="52" r="32" fill="#fff" stroke="#bdbdbd" stroke-width="2"/><circle cx="50" cy="52" r="23" fill="none" stroke="#eeeeee" stroke-width="2"/><circle cx="42" cy="46" r="7" fill="#8d6e63"/><circle cx="55" cy="44" r="7" fill="#8d6e63"/><circle cx="60" cy="60" r="4" fill="#66bb6a"/><circle cx="51" cy="63" r="4" fill="#66bb6a"/><rect x="34" y="56" width="10" height="4" rx="2" fill="#ff7043" transform="rotate(30 39 58)"/><path d="M8 26 V82 M4 26 V38 Q8 44 12 38 V26" stroke="#90a4ae" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M92 26 Q84 40 92 52 V82" stroke="#90a4ae" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  kompis: () => bg('#fce4ec') + kid(30, '#ffcc80', '#5d4037', '#42a5f5') + kid(70, '#d7a17a', '#212121', '#ef5350') + `<path d="M50 22 C50 16 42 14 42 20 C42 24 50 28 50 30 C50 28 58 24 58 20 C58 14 50 16 50 22Z" fill="#e91e63"/>`,
  doktor: () => bg('#e0f2f1') + `<path d="M38 34 V26 Q38 20 44 20 H56 Q62 20 62 26 V34" fill="none" stroke="#5d4037" stroke-width="5"/><rect x="14" y="32" width="72" height="52" rx="10" fill="#8d6e63"/><circle cx="50" cy="58" r="17" fill="#fff"/><rect x="45" y="47" width="10" height="22" fill="#e53935"/><rect x="39" y="53" width="22" height="10" fill="#e53935"/>`,
  kalas: () => bg('#f3e5f5') + `<rect x="20" y="50" width="60" height="36" rx="6" fill="#f48fb1"/><path d="M20 60 q7.5 8 15 0 t15 0 t15 0 t15 0" fill="none" stroke="#fff" stroke-width="4"/><rect x="14" y="84" width="72" height="6" rx="3" fill="#bdbdbd"/>` + [34, 50, 66].map(x => `<rect x="${x - 3}" y="34" width="6" height="16" fill="#81d4fa"/><path d="M${x} 22 q5 6 0 10 q-5 -4 0 -10z" fill="#ffb300"/>`).join(''),
  vila: () => bg('#efebe9') + `<rect x="18" y="28" width="64" height="28" rx="10" fill="#9fa8da"/><rect x="10" y="44" width="80" height="30" rx="10" fill="#7986cb"/><rect x="6" y="40" width="16" height="36" rx="7" fill="#5c6bc0"/><rect x="78" y="40" width="16" height="36" rx="7" fill="#5c6bc0"/><rect x="26" y="32" width="22" height="16" rx="6" fill="#ffcc80" transform="rotate(-10 37 40)"/><rect x="14" y="76" width="6" height="8" fill="#5d4037"/><rect x="80" y="76" width="6" height="8" fill="#5d4037"/>`,
};
ART.imorgon = () => bg('#ede7f6') + `<rect x="8" y="46" width="26" height="30" rx="5" fill="#fff" stroke="#9575cd" stroke-width="2"/><rect x="37" y="46" width="26" height="30" rx="5" fill="#fff" stroke="#9575cd" stroke-width="2"/><rect x="66" y="46" width="26" height="30" rx="5" fill="#fff" stroke="#9575cd" stroke-width="2"/><circle cx="21" cy="61" r="7" fill="#ffca28"/><rect x="43" y="56" width="14" height="12" rx="2" fill="#42a5f5"/><path d="M71 70 L79 56 L87 70Z" fill="#ef5350"/><circle cx="30" cy="24" r="10" fill="#ffca28"/>${rays(30, 24, 13, 18, 0, 315, 45, '#ffb300', 3)}<path d="M74 14 A12 12 0 1 0 84 32 A9.5 9.5 0 1 1 74 14Z" fill="#fff59d"/>`;
const artSvg = id => `<svg viewBox="0 0 100 100">${(ART[id] || ART.leka)()}</svg>`;

// ---------- Djur (lokala koordinater, huvud i 0,0 med radie ~26) ----------
const ANIMALS = [
  { id: 'kanin', n: 'kaninen', c: '#eceff1', d: '#b0bec5', e: '#f8bbd0', b: '#fff' },
  { id: 'bjorn', n: 'björnen', c: '#a1887f', d: '#6d4c41', e: '#d7ccc8', b: '#d7ccc8' },
  { id: 'katt', n: 'katten', c: '#ffb74d', d: '#ef6c00', e: '#fff3e0', b: '#fff3e0' },
  { id: 'uggla', n: 'ugglan', c: '#8d6e63', d: '#5d4037', e: '#ffe0b2', b: '#ffe0b2' },
  { id: 'elefant', n: 'elefanten', c: '#90a4ae', d: '#607d8b', e: '#f8bbd0', b: '#b0bec5' },
  { id: 'rav', n: 'räven', c: '#ff7043', d: '#d84315', e: '#fff', b: '#fff' },
];
function eyes(sleep, dx = 10, y = -2, r = 3.6) {
  return sleep
    ? `<path d="M${-dx - 5} ${y} q5 4 10 0 M${dx - 5} ${y} q5 4 10 0" stroke="#3e2723" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
    : `<circle cx="${-dx}" cy="${y}" r="${r}" fill="#3e2723"/><circle cx="${dx}" cy="${y}" r="${r}" fill="#3e2723"/><circle cx="${-dx + 1.2}" cy="${y - 1.3}" r="1.2" fill="#fff"/><circle cx="${dx + 1.2}" cy="${y - 1.3}" r="1.2" fill="#fff"/>`;
}
const cheeks = `<circle cx="-17" cy="9" r="4.5" fill="#f48fb1" opacity=".6"/><circle cx="17" cy="9" r="4.5" fill="#f48fb1" opacity=".6"/>`;
const smile = (y = 10) => `<path d="M-5 ${y} q5 4 10 0" stroke="#3e2723" stroke-width="2" fill="none" stroke-linecap="round"/>`;
function head(a, sleep) {
  const { c, d, e } = a;
  switch (a.id) {
    case 'kanin': return `<ellipse cx="-10" cy="-38" rx="7" ry="22" fill="${c}" stroke="${d}" stroke-width="2"/><ellipse cx="-10" cy="-38" rx="3.5" ry="16" fill="${e}"/><ellipse cx="10" cy="-38" rx="7" ry="22" fill="${c}" stroke="${d}" stroke-width="2"/><ellipse cx="10" cy="-38" rx="3.5" ry="16" fill="${e}"/><circle r="26" fill="${c}" stroke="${d}" stroke-width="2"/>` + eyes(sleep) + `<ellipse cx="0" cy="6" rx="3.5" ry="2.6" fill="#f06292"/>` + smile(10) + cheeks;
    case 'bjorn': return `<circle cx="-19" cy="-19" r="10" fill="${c}"/><circle cx="-19" cy="-19" r="5" fill="${d}"/><circle cx="19" cy="-19" r="10" fill="${c}"/><circle cx="19" cy="-19" r="5" fill="${d}"/><circle r="26" fill="${c}"/><ellipse cx="0" cy="9" rx="11" ry="8.5" fill="${e}"/>` + eyes(sleep) + `<ellipse cx="0" cy="5" rx="4" ry="3" fill="#3e2723"/>` + smile(10) + cheeks;
    case 'katt': return `<path d="M-24 -6 L-20 -32 L-4 -22Z M24 -6 L20 -32 L4 -22Z" fill="${c}" stroke="${d}" stroke-width="2" stroke-linejoin="round"/><path d="M-19 -12 L-18 -26 L-9 -21Z M19 -12 L18 -26 L9 -21Z" fill="#f8bbd0"/><circle r="26" fill="${c}"/><path d="M-6 -24 L-4 -15 M0 -25 V-15 M6 -24 L4 -15" stroke="${d}" stroke-width="2.5" stroke-linecap="round"/>` + eyes(sleep) + `<path d="M-3 4 h6 l-3 3z" fill="#f06292"/>` + smile(8) + `<path d="M-10 7 H-28 M-10 10 L-26 15 M10 7 H28 M10 10 L26 15" stroke="${d}" stroke-width="1.3"/>` + cheeks;
    case 'uggla': return `<path d="M-22 -14 L-20 -32 L-8 -22Z M22 -14 L20 -32 L8 -22Z" fill="${d}"/><circle r="26" fill="${c}"/><circle cx="-10" cy="-2" r="10" fill="${e}"/><circle cx="10" cy="-2" r="10" fill="${e}"/>` + eyes(sleep) + `<path d="M-4 8 L4 8 L0 15Z" fill="#ffb300"/>` + cheeks;
    case 'elefant': return `<ellipse cx="-26" cy="-2" rx="15" ry="19" fill="${c}"/><ellipse cx="-26" cy="-2" rx="9" ry="13" fill="${e}"/><ellipse cx="26" cy="-2" rx="15" ry="19" fill="${c}"/><ellipse cx="26" cy="-2" rx="9" ry="13" fill="${e}"/><circle r="24" fill="${c}"/><path d="M-6 6 Q-7 22 -2 30 Q2 34 6 30 Q2 22 6 6Z" fill="${c}" stroke="${d}" stroke-width="1.5"/>` + eyes(sleep) + cheeks;
    case 'rav': return `<path d="M-24 -4 L-20 -34 L-4 -22Z M24 -4 L20 -34 L4 -22Z" fill="${c}"/><path d="M-19 -12 L-18 -28 L-9 -21Z M19 -12 L18 -28 L9 -21Z" fill="#3e2723"/><circle r="26" fill="${c}"/><path d="M-26 2 Q-14 4 0 22 Q14 4 26 2 Q24 20 0 26 Q-24 20 -26 2Z" fill="#fff"/>` + eyes(sleep) + `<ellipse cx="0" cy="18" rx="3.5" ry="2.6" fill="#3e2723"/>` + cheeks;
  }
  return '';
}
function body(a, pj) {
  const f = pj ? 'url(#pj)' : a.c;
  const st = a.id === 'kanin' && !pj ? `stroke="${a.d}" stroke-width="2"` : '';
  let tail = '';
  if (a.id === 'katt') tail = `<path d="M18 44 Q44 38 36 12" stroke="${a.c}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  if (a.id === 'rav') tail = `<path d="M16 46 Q48 48 42 14 Q30 22 16 36Z" fill="${a.c}"/><path d="M42 14 Q38 22 33 25 Q40 23 44 20Z" fill="#fff"/>`;
  if (a.id === 'kanin') tail = `<circle cx="21" cy="46" r="7" fill="#fff" stroke="${a.d}" stroke-width="1.5"/>`;
  const arms = a.id === 'uggla'
    ? `<path d="M-21 14 Q-34 34 -17 48Z M21 14 Q34 34 17 48Z" fill="${pj ? f : a.d}"/>`
    : `<ellipse cx="-22" cy="26" rx="7" ry="13" fill="${f}" transform="rotate(20 -22 26)"/><ellipse cx="22" cy="26" rx="7" ry="13" fill="${f}" transform="rotate(-20 22 26)"/>`;
  const feet = a.id === 'uggla'
    ? `<path d="M-12 56 l-4 6 M-8 56 v7 M-4 56 l4 6 M4 56 l-4 6 M8 56 v7 M12 56 l4 6" stroke="#ffb300" stroke-width="3" stroke-linecap="round"/>`
    : `<ellipse cx="-11" cy="57" rx="10" ry="6" fill="${a.c}"/><ellipse cx="11" cy="57" rx="10" ry="6" fill="${a.c}"/>`;
  return tail + `<ellipse cx="0" cy="32" rx="22" ry="26" fill="${f}" ${st}/>` + (pj ? '' : `<ellipse cx="0" cy="36" rx="13" ry="16" fill="${a.b}"/>`) + arms + feet;
}
const animalG = (a, o = {}) => body(a, o.pj) + head(a, o.sleep);
const animalSvg = (a, o = {}) => `<svg viewBox="-50 -64 100 132">${animalG(a, o)}</svg>`;
const headSvg = (a, sleep) => `<svg viewBox="-44 -64 88 96">${head(a, sleep)}</svg>`;

// ---------- Klistermärken ----------
const STICKERS = {
  stjarna: () => `<polygon points="${starPts(50, 54, 44, 20)}" fill="#ffd54f" stroke="#f9a825" stroke-width="3" stroke-linejoin="round"/>` + face(50, 58, 1.1),
  hjarta: () => `<path d="${HEART}" fill="#ef5350"/><ellipse cx="28" cy="30" rx="7" ry="5" fill="#fff" opacity=".6" transform="rotate(-30 28 30)"/>`,
  mane: () => `<g transform="translate(-6 -2)">${moonPath(56, 12, 3.2, '#fff176')}</g><circle cx="30" cy="50" r="3" fill="#3e2723"/><path d="M24 62 q6 5 12 0" stroke="#3e2723" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  sol: () => rays(50, 50, 32, 46, 0, 330, 30, '#ffb300', 6) + `<circle cx="50" cy="50" r="28" fill="#ffca28"/>` + face(50, 52, 1.4),
  blomma: () => [0, 60, 120, 180, 240, 300].map(a => { const t = a * Math.PI / 180; return `<circle cx="${(50 + 24 * Math.cos(t)).toFixed(1)}" cy="${(50 + 24 * Math.sin(t)).toFixed(1)}" r="16" fill="#f48fb1"/>`; }).join('') + `<circle cx="50" cy="50" r="16" fill="#ffd54f"/>` + face(50, 52, .9),
  regnbage: () => [[40, '#ef5350'], [33, '#ffa726'], [26, '#ffee58'], [19, '#66bb6a'], [12, '#42a5f5']].map(([r, c]) => `<path d="M${50 - r} 72 A${r} ${r} 0 0 1 ${50 + r} 72" stroke="${c}" stroke-width="7.5" fill="none"/>`).join('') + `<g fill="#fff"><circle cx="12" cy="74" r="9"/><circle cx="22" cy="78" r="8"/><circle cx="88" cy="74" r="9"/><circle cx="78" cy="78" r="8"/></g>`,
  bil: () => `<g transform="translate(0 6)">${carShape('#42a5f5')}</g>`,
  fisk: () => `<path d="M70 50 L94 30 V70Z" fill="#ff7043"/><ellipse cx="46" cy="50" rx="32" ry="22" fill="#ffa726"/><circle cx="30" cy="44" r="6" fill="#fff"/><circle cx="29" cy="44" r="3" fill="#3e2723"/><path d="M52 34 q8 16 0 32" stroke="#ff7043" stroke-width="3" fill="none"/><path d="M18 56 q4 3 8 0" stroke="#3e2723" stroke-width="2" fill="none"/>`,
  ballong: () => `<path d="M50 74 Q44 84 52 94" stroke="#78909c" stroke-width="2" fill="none"/><ellipse cx="50" cy="40" rx="26" ry="32" fill="#ab47bc"/><path d="M46 75 L54 75 L50 70Z" fill="#8e24aa"/><ellipse cx="40" cy="28" rx="6" ry="10" fill="#fff" opacity=".45"/>`,
  bat: () => `<path d="M50 12 V62" stroke="#5d4037" stroke-width="3"/><path d="M53 14 L82 58 H53Z" fill="#fff" stroke="#90a4ae" stroke-width="2"/><path d="M47 24 L24 58 H47Z" fill="#ef5350"/><path d="M14 64 H86 L76 80 H24Z" fill="#8d6e63"/><path d="M6 88 q11 -6 22 0 t22 0 t22 0 t22 0" stroke="#4fc3f7" stroke-width="4" fill="none"/>`,
  nyckelpiga: () => `<circle cx="50" cy="24" r="12" fill="#37474f"/><circle cx="50" cy="56" r="32" fill="#e53935"/><path d="M50 26 V88" stroke="#37474f" stroke-width="3"/><circle cx="36" cy="46" r="6" fill="#37474f"/><circle cx="64" cy="46" r="6" fill="#37474f"/><circle cx="34" cy="68" r="5" fill="#37474f"/><circle cx="66" cy="68" r="5" fill="#37474f"/><circle cx="45" cy="20" r="2.5" fill="#fff"/><circle cx="55" cy="20" r="2.5" fill="#fff"/>`,
  raket: () => `<path d="M38 62 Q50 98 62 62Z" fill="#ffa726"/><path d="M44 62 Q50 84 56 62Z" fill="#ffee58"/><path d="M32 46 L18 70 L32 66Z M68 46 L82 70 L68 66Z" fill="#ef5350"/><path d="M50 6 Q70 22 68 64 H32 Q30 22 50 6Z" fill="#eceff1" stroke="#90a4ae" stroke-width="2"/><circle cx="50" cy="34" r="8" fill="#4fc3f7" stroke="#90a4ae" stroke-width="2"/>`,
};
const stickerSvg = id => `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill="#fff" stroke="#ffe0b2" stroke-width="3"/><g transform="translate(12 12) scale(.76)">${(STICKERS[id] || STICKERS.stjarna)()}</g></svg>`;

// ---------- Ikoner ----------
const ICON = {
  sun: `<svg viewBox="0 0 100 100">${rays(50, 50, 32, 44, 0, 330, 30, '#ffb300', 6)}<circle cx="50" cy="50" r="26" fill="#ffca28"/>${face(50, 52, 1.2)}</svg>`,
  moon: `<svg viewBox="0 0 100 100">${moonPath(46, 12, 3, '#fff59d')}${star(80, 22, 8)}${star(86, 56, 5)}</svg>`,
  book: `<svg viewBox="0 0 100 100"><rect x="18" y="12" width="66" height="78" rx="8" fill="#8e24aa"/><rect x="18" y="12" width="12" height="78" rx="4" fill="#6a1b9a"/>${star(58, 50, 20, '#ffd54f')}</svg>`,
  plan: `<svg viewBox="0 0 100 100"><rect x="6" y="40" width="26" height="26" rx="5" fill="#fff"/><rect x="37" y="40" width="26" height="26" rx="5" fill="#fff"/><rect x="68" y="40" width="26" height="26" rx="5" fill="#fff"/>${rays(50, 20, 10, 16, 0, 330, 45, '#ffb300', 3)}<circle cx="50" cy="20" r="8" fill="#ffca28"/></svg>`,
  paw: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="64" rx="22" ry="18" fill="#1e88e5"/><ellipse cx="24" cy="40" rx="9" ry="11" fill="#1e88e5"/><ellipse cx="40" cy="24" rx="9" ry="11" fill="#1e88e5"/><ellipse cx="60" cy="24" rx="9" ry="11" fill="#1e88e5"/><ellipse cx="76" cy="40" rx="9" ry="11" fill="#1e88e5"/></svg>`,
  heart: on => `<svg viewBox="0 0 100 100"><path d="${HEART}" fill="${on ? '#ec407a' : 'none'}" stroke="#ec407a" stroke-width="6" ${on ? '' : 'stroke-dasharray="10 8"'}/>${on ? '<path d="M30 46 L44 60 L70 34" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' : ''}</svg>`,
  hourglass: `<svg viewBox="0 0 120 200"><path d="${GLASS}" fill="#e1f5fe" stroke="#80deea" stroke-width="6"/><path d="M40 62 H80 L63 96 H57Z" fill="#ffb300"/><path d="M32 178 Q60 140 88 178Z" fill="#ffb300"/><rect x="6" y="4" width="108" height="20" rx="8" fill="#6d4c41"/><rect x="6" y="176" width="108" height="20" rx="8" fill="#6d4c41"/></svg>`,
  star: `<svg viewBox="0 0 100 100"><polygon points="${starPts(50, 52, 46, 20)}" fill="#ffd54f" stroke="#f9a825" stroke-width="5" stroke-linejoin="round"/></svg>`,
};

// ---------- Sovrummet (viewBox 0 0 360 440) ----------
function sceneSvg(a, pj) {
  return `<svg viewBox="0 0 360 440" preserveAspectRatio="xMidYMid meet">
  <rect width="360" height="300" fill="#5c6bc0"/><rect y="300" width="360" height="140" fill="#3949ab"/>
  <ellipse cx="200" cy="392" rx="150" ry="34" fill="#7986cb"/>
  <rect x="40" y="40" width="110" height="96" rx="8" fill="#1a237e" stroke="#c5cae9" stroke-width="6"/>
  ${moonPath(112, 52, 1.3)}${star(62, 62, 6)}${star(78, 114, 5)}${star(132, 118, 4)}${star(96, 74, 3)}
  <path d="M95 40 V136 M40 88 H150" stroke="#c5cae9" stroke-width="4"/>
  <rect x="112" y="190" width="18" height="140" rx="6" fill="#8d6e63"/><rect x="322" y="246" width="16" height="84" rx="6" fill="#8d6e63"/>
  <rect x="124" y="262" width="204" height="34" rx="8" fill="#fff"/><rect x="124" y="294" width="204" height="14" fill="#a1887f"/>
  <rect x="134" y="242" width="64" height="30" rx="14" fill="#e3f2fd"/>
  <g id="bedAnimal" class="hide"><ellipse cx="248" cy="272" rx="60" ry="16" fill="${pj ? 'url(#pj)' : a.c}"/><g id="bedHead" transform="translate(168 244) scale(.9)" data-tap="kiss"></g></g>
  <path id="blanketOn" class="hide" d="M206 260 Q266 246 330 256 V304 H206 Q196 282 206 260Z" fill="url(#quilt)" stroke="#e57373" stroke-width="3"/>
  <g id="blanketFold" data-tap="blanket"><g id="foldHint"><rect x="282" y="256" width="46" height="46" rx="8" fill="url(#quilt)" stroke="#e57373" stroke-width="3"/><path d="M286 270 H324" stroke="#e57373" stroke-width="3"/></g></g>
  <rect id="dim" width="360" height="440" fill="#0d0b2e" opacity="0" pointer-events="none"/>
  <circle id="glow" cx="64" cy="216" r="150" fill="url(#glowGrad)" opacity="0" pointer-events="none"/>
  <rect x="28" y="252" width="72" height="78" rx="6" fill="#8d6e63"/><rect x="36" y="276" width="56" height="8" rx="4" fill="#6d4c41"/>
  <g id="lamp" data-tap="lamp"><g id="lampHint"><rect x="58" y="214" width="10" height="38" fill="#cfd8dc"/><ellipse cx="63" cy="252" rx="20" ry="6" fill="#b0bec5"/><path id="lampShade" d="M42 220 L50 190 H76 L84 220Z" fill="#9575cd"/></g></g>
  <g id="floorAnimal" data-tap="floor" transform="translate(206 356) scale(.82)"><g id="floorHint">${animalG(a, { pj })}</g></g>
  <g id="zzz" class="hide"><text class="z" x="200" y="214">z</text><text class="z z2" x="212" y="200">z</text><text class="z z3" x="224" y="186">Z</text></g>
  </svg>`;
}

// ---------- Potta ----------
const pottyShape = (cx, cy, s = 1) => `<g transform="translate(${cx} ${cy}) scale(${s})"><ellipse cx="0" cy="0" rx="40" ry="9" fill="#f8bbd0" stroke="#ec407a" stroke-width="3"/><ellipse cx="0" cy="0" rx="30" ry="5" fill="#ad1457" opacity=".35"/><path d="M-40 0 Q-38 46 0 48 Q38 46 40 0 Q0 16 -40 0Z" fill="#f06292"/></g>`;
const PANTS = (y, c = '#42a5f5') => `<path d="M28 ${y} H72 L70 ${y + 40} H54 L50 ${y + 18} L46 ${y + 40} H30Z" fill="${c}"/><rect x="26" y="${y - 4}" width="48" height="9" rx="3" fill="#1e88e5"/>`;
const ARROW = (up, c) => `<path d="${up ? 'M50 36 V8 M37 20 L50 7 L63 20' : 'M50 6 V34 M37 22 L50 35 L63 22'}" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const DROPS = `<g fill="#4fc3f7"><path d="M36 10 Q42 22 36 26 Q30 22 36 10Z"/><path d="M52 2 Q59 16 52 20 Q45 16 52 2Z"/><path d="M66 12 Q72 24 66 28 Q60 24 66 12Z"/></g>`;
const BUBBLES = `<g fill="#fff" stroke="#81d4fa" stroke-width="2"><circle cx="30" cy="40" r="10"/><circle cx="50" cy="30" r="13"/><circle cx="70" cy="42" r="9"/><circle cx="58" cy="54" r="7"/></g>`;
const POTTY_ICON = {
  ner: `<svg viewBox="0 0 100 100">${ARROW(false, '#ef5350')}${PANTS(52)}<circle cx="27" cy="52" r="6" fill="#ffeb3b" stroke="#f9a825" stroke-width="2"/><circle cx="73" cy="52" r="6" fill="#ffeb3b" stroke="#f9a825" stroke-width="2"/></svg>`,
  sitta: `<svg viewBox="0 0 100 100">${pottyShape(50, 48, .95)}</svg>`,
  kissa: `<svg viewBox="0 0 100 100">${DROPS}${pottyShape(50, 52, .95)}</svg>`,
  upp: `<svg viewBox="0 0 100 100">${ARROW(true, '#43a047')}${PANTS(52)}</svg>`,
  tvatta: `<svg viewBox="0 0 100 100"><path d="M60 20 V10 H36" stroke="#90a4ae" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="30" y="66" width="40" height="8" rx="4" fill="#4fc3f7"/>${BUBBLES}<path d="M14 72 H86 Q82 94 50 94 Q18 94 14 72Z" fill="#eceff1" stroke="#b0bec5" stroke-width="3"/></svg>`,
};
ART.potta = () => bg('#e0f7fa') + DROPS.replace('<g ', '<g transform="translate(0 6)" ') + pottyShape(50, 56, .95);
ICON.potty = `<svg viewBox="0 0 100 100">${DROPS}${pottyShape(50, 52, .95)}</svg>`;

// Figur för pottaövning: kroppen, tummar (bakom byxorna), byxor och armar styrs från app.js.
function pottyKid(a) {
  const st = `stroke="${a.d}" stroke-width="2"`;
  return `<g id="pk">
    ${a.id === 'kanin' ? `<circle cx="21" cy="46" r="7" fill="#fff" ${st}/>` : ''}
    <ellipse cx="0" cy="32" rx="22" ry="26" fill="${a.c}" ${a.id === 'kanin' ? st : ''}/><ellipse cx="0" cy="34" rx="13" ry="14" fill="${a.b}"/>
    <ellipse cx="-11" cy="57" rx="10" ry="6" fill="${a.c}" ${st}/><ellipse cx="11" cy="57" rx="10" ry="6" fill="${a.c}" ${st}/>
    <g id="pkThumbs" fill="${a.c}" ${st}><ellipse id="thL" rx="3" ry="5"/><ellipse id="thR" rx="3" ry="5"/></g>
    <g id="pkPants"><path d="M-23 36 H23 L22 60 H3 L0 50 L-3 60 H-22Z" fill="#42a5f5"/><rect x="-24" y="33" width="48" height="6" rx="2" fill="#1e88e5"/></g>
    <g stroke-linecap="round"><line id="arL0" stroke="${a.d}" stroke-width="12"/><line id="arR0" stroke="${a.d}" stroke-width="12"/><line id="arL" stroke="${a.c}" stroke-width="9"/><line id="arR" stroke="${a.c}" stroke-width="9"/></g>
    <circle id="haL" r="6" fill="${a.c}" ${st}/><circle id="haR" r="6" fill="${a.c}" ${st}/>
    <g id="thGlow" fill="none" stroke="#ffeb3b" stroke-width="3"><circle id="glL" r="10" class="hint"/><circle id="glR" r="10" class="hint"/></g>
    <g transform="translate(0 -2)">${head(a)}</g>
  </g>`;
}
function pottyScene(a) {
  let tiles = '';
  for (let x = 0; x <= 360; x += 30) tiles += `<line x1="${x}" y1="0" x2="${x}" y2="230"/>`;
  for (let y = 0; y <= 230; y += 30) tiles += `<line x1="0" y1="${y}" x2="360" y2="${y}"/>`;
  return `<svg viewBox="0 0 360 300" id="psvg">
    <rect width="360" height="300" fill="#e0f7fa"/><g stroke="#b2ebf2" stroke-width="2">${tiles}</g>
    <rect y="230" width="360" height="70" fill="#80cbc4"/>
    <rect x="302" y="210" width="18" height="26" fill="#eceff1" stroke="#b0bec5" stroke-width="2"/>
    <path d="M326 186 V168 H306" stroke="#90a4ae" stroke-width="7" fill="none" stroke-linecap="round"/>
    <rect id="water" x="303" y="172" width="6" height="22" rx="3" fill="#4fc3f7" class="hide"/>
    <path d="M268 186 H352 Q348 214 310 214 Q272 214 268 186Z" fill="#fff" stroke="#b0bec5" stroke-width="3"/>
    <g data-ptap="1"><ellipse cx="175" cy="236" rx="40" ry="9" fill="#f8bbd0" stroke="#ec407a" stroke-width="3"/><ellipse cx="175" cy="236" rx="30" ry="5" fill="#ad1457" opacity=".35"/></g>
    <g data-ptap="1">${pottyKid(a)}</g>
    <path data-ptap="1" d="M135 236 Q137 282 175 284 Q213 282 215 236 Q175 252 135 236Z" fill="#f06292"/>
    <g id="fx"></g>
  </svg>`;
}
