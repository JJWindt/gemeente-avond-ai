/*
  Motor voor de slides van de gemeenteavond.
  De inhoud staat in inhoud/*.js: elk bestand voegt zijn slides toe aan window.SLIDES.
  Een presentatie laadt eerst één of meer inhoudsbestanden en daarna dit bestand; zo plakken we de delen aan elkaar.
  Openen via de lokale server (.claude/launch.json → "slides"), anders kunnen de visualisaties niet laden.

  Bediening: → / spatie / PageDown / klik = volgende, ← / PageUp = vorige,
  F = volledig scherm, O = overzicht (met spreektekst), Home / End = begin / eind.
*/
const BASE_VARS = {
  'bg': 'transparent', 'box-fill': '#ffffff', 'box-stroke': '#c8d5ea', 'box-glow': '#1d5fe0',
  'label': '#5d6d8e', 'output-text': '#0a1b3d',
  'font': '"Instrument Sans", -apple-system, system-ui, sans-serif',
};
const VIS = {
  ai: { file: '../visualisaties/1-3-ai-model.html', name: 'Visualisatie 1–3',
        vars: { 'noise': '#c3cfe3', 'cat-a': '#0b2a6e', 'cat-b': '#1d5fe0', 'cat-c': '#86b2ff' } },
  agent: { file: '../visualisaties/4-agent-loop.html', name: 'Visualisatie 4',
        vars: { 'chip-fill': '#ffffff', 'human': '#0a1b3d', 'model': '#1d5fe0', 'world': '#d97706' } },
  computer: { file: '../visualisaties/5-computer-use.html', name: 'Visualisatie 5',
        vars: { 'screen': '#eaf0f9', 'window': '#ffffff', 'app-code': '#1d5fe0', 'app-sheet': '#0b2a6e', 'app-doc': '#86b2ff' } },
};


// Woord voor woord, net als het taalmodel zelf.
const words = (text, accent) => text.split(' ').map((w, i) => {
  const bare = w.replace(/[.,?!]$/, '');
  return `<span data-a style="--d:${i}">${bare === accent ? `<em>${bare}</em>${w.slice(bare.length)}` : w}</span>`;
}).join(' ');

const LADDER = [['Chatbots', 36], ['Tekst', 42], ['Code', 48], ['Agent', 54], ['Computer use', 60]];

// ---------- Tijdlijn: van nu terug naar de jaren zeventig ----------
const TL = { from: 1960, to: 2026, end: 1970, x0: 180, x1: 1740, y: 660 };
const tlx = yr => TL.x0 + (yr - TL.from) / (TL.to - TL.from) * (TL.x1 - TL.x0);
function setTimeline(el, yr) {
  const x = tlx(yr).toFixed(1);
  el.querySelector('.tl-run').setAttribute('x1', x);
  el.querySelector('.tl-dot').setAttribute('cx', x);
  const now = el.querySelector('.tl-now');
  now.setAttribute('x', x);
  now.textContent = Math.round(yr);
  el.querySelectorAll('.tl-year').forEach(t => t.classList.toggle('passed', +t.dataset.y >= yr - 0.5));
}
function runTimeline(el) {
  const dur = 3600, delay = 700, ease = t => t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
  setTimeline(el, TL.to);
  const t0 = performance.now() + delay;
  const tick = t => {
    if (!el.isConnected) return;
    const p = Math.max(0, Math.min(1, (t - t0) / dur));
    setTimeline(el, TL.to - (TL.to - TL.end) * ease(p));
    if (p < 1) requestAnimationFrame(tick); else el.classList.add('tl-done');
  };
  requestAnimationFrame(tick);
}

// ---------- Achtergrondtekeningen bij chatbots, tekst en code ----------
// Rechterhelft van de slide; tussen y 310 en 590 blijft alles leeg, daar staat de uitleg.
const ART = {
  chat: () => {
    const B = [[0, 70, 560, 2], [1, 214, 420, 1], [0, 616, 640, 3], [1, 808, 480, 2], [0, 960, 420, 1]];
    return `<svg class="ladder-art" viewBox="0 0 960 1080">${B.map(([me, y, w, n], i) => {
      const x = me ? 960 - 70 - w : 60, h = 84 + (n - 1) * 40;
      const bars = Array.from({ length: n }, (_, k) => {
        const bw = (w - 80) * (k === n - 1 && n > 1 ? .55 : k ? .9 : 1);
        return `<rect x="${x + 40}" y="${y + 34 + k * 40}" width="${bw}" height="16" rx="8" fill="${me ? '#a9c3f2' : '#d5e0f0'}"/>`;
      }).join('');
      return `<g class="art-in" style="--d:${i}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="32"
        fill="${me ? 'var(--tint)' : '#fff'}" stroke="${me ? 'none' : 'var(--line)'}" stroke-width="2.5"/>${bars}</g>`;
    }).join('')}</svg>`;
  },
  text: () => {
    // Twee alinea's boven de uitleg, twee eronder; de uitleg staat zelf op het papier.
    const P = [[130, [1, .96, .98, .5]], [626, [1, .94, 1, .4]], [850, [1, .9, .62]]];
    let k = 0, bars = '', last = null;
    for (const [y0, para] of P) para.forEach((f, j) => {
      const y = y0 + j * 46;
      bars += `<rect class="type-in" style="--d:${k++}" x="100" y="${y}" width="${700 * f}" height="16" rx="8" fill="#d5e0f0"/>`;
      last = [100 + 700 * f, y];
    });
    return `<svg class="ladder-art" viewBox="0 0 960 1080">
      <rect class="art-in" x="40" y="60" width="820" height="960" rx="26" fill="#fff" stroke="var(--line)" stroke-width="2.5"/>
      ${bars}<rect class="cursor" style="--cd:${(k * .11 + .9).toFixed(2)}s" x="${last[0] + 12}" y="${last[1] - 12}" width="5" height="40" fill="var(--accent)"/>
    </svg>`;
  },
  code: () => {
    const C = { n: '#0b2a6e', a: '#1d5fe0', l: '#86b2ff', g: '#c8d5ea' };
    // [regel-y, inspringing, stukjes]: drie regels boven de uitleg, de rest eronder.
    const L = [
      [170, 0, [[90, 'a'], [160, 'n'], [60, 'g']]], [222, 1, [[70, 'a'], [120, 'l'], [200, 'g']]], [274, 1, [[110, 'n'], [90, 'g']]],
      [620, 2, [[60, 'a'], [180, 'n'], [80, 'l']]], [672, 2, [[140, 'g'], [70, 'l']]], [724, 1, [[40, 'g']]],
      [776, 1, [[90, 'a'], [150, 'n']]], [828, 0, [[40, 'g']]], [910, 0, [[90, 'a'], [130, 'n'], [60, 'g']]],
      [962, 1, [[120, 'l'], [160, 'g']]],
    ];
    const lines = L.map(([y, ind, segs], i) => {
      let x = 100 + ind * 50;
      return `<g class="type-in" style="--d:${i}">${segs.map(([w, c]) => {
        const r = `<rect x="${x}" y="${y}" width="${w}" height="18" rx="9" fill="${C[c]}"/>`; x += w + 14; return r; }).join('')}</g>`;
    }).join('');
    return `<svg class="ladder-art" viewBox="0 0 960 1080">
      <g class="art-in"><rect x="40" y="60" width="880" height="1000" rx="24" fill="#fff" stroke="var(--line)" stroke-width="2.5"/>
      ${[0, 1, 2].map(d => `<circle cx="${82 + d * 28}" cy="100" r="8" fill="var(--line)"/>`).join('')}
      <line x1="40" x2="920" y1="136" y2="136" stroke="var(--line)" stroke-width="2"/></g>
      ${lines}
    </svg>`;
  },
};

// Paden vanaf de pagina; een url() in een CSS-variabele zou anders vanuit engine/ worden opgezocht.
const asset = path => new URL(path, document.baseURI).href;

// ---------- Kleurveld voor een openingsslide (grad: true) ----------
// Paper Shaders (Apache-2.0), lokaal in engine/vendor zodat het ook zonder internet werkt.
const MESH = {
  colors: ['#f2f6fc', '#a9c5f5', '#5b8def', '#1d5fe0', '#0b2a6e'],
  distortion: .85, swirl: .25, grainOverlay: .18, speed: .22,
};
let meshMount = null;
// Gewoon <script> in plaats van import(): dat werkt ook als de pagina als bestand (file://) is geopend.
const paper = new Promise((resolve, reject) => {
  const tag = document.createElement('script');
  tag.src = asset('engine/vendor/paper-shaders-0.0.82.classic.js');
  tag.onload = () => resolve(window.PaperShaders);
  tag.onerror = reject;
  document.head.appendChild(tag);
});
function mountMesh(el) {
  paper.then(P => {
    if (!el.isConnected) return;
    meshMount = new P.ShaderMount(el, P.meshGradientFragmentShader, {
      u_colors: MESH.colors.map(P.getShaderColorFromString), u_colorsCount: MESH.colors.length,
      u_distortion: MESH.distortion, u_swirl: MESH.swirl, u_grainMixer: 0, u_grainOverlay: MESH.grainOverlay,
      u_fit: P.ShaderFitOptions.cover, u_scale: 1, u_rotation: 0, u_originX: .5, u_originY: .5,
      u_offsetX: 0, u_offsetY: 0, u_worldWidth: 0, u_worldHeight: 0,
    }, undefined, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : MESH.speed, 0, 1);
    el.style.background = 'none';
  });
}

// ---------- Dalende koerslijn achter het verlies ----------
// Een grillige lijn die van linksboven naar rechtsonder zakt; vaste 'willekeur' zodat hij elke keer gelijk is.
const LOSS_LINE = (() => {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const pts = [];
  for (let x = -20; x <= 1960; x += 28) {
    const t = Math.max(0, x) / 1920;
    const y = 170 + Math.pow(t, 1.5) * 760 + (rnd() - .5) * 70 + (rnd() < .12 ? -40 * rnd() : 0);
    pts.push([x, Math.min(1040, y)]);
  }
  const d = 'M' + pts.map(p => p.map(v => v.toFixed(1)).join(' ')).join(' L');
  return `<svg class="art loss-line" viewBox="0 0 1920 1080" preserveAspectRatio="none">
    <defs><linearGradient id="lossFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e0464b" stop-opacity=".16"/><stop offset="1" stop-color="#e0464b" stop-opacity="0"/></linearGradient>
      <clipPath id="lossReveal"><rect class="loss-wipe" x="0" y="0" width="1920" height="1080"/></clipPath></defs>
    <g clip-path="url(#lossReveal)"><path class="loss-area" d="${d} L1960 1080 L-20 1080 Z" fill="url(#lossFill)"/></g>
    <path class="loss-path" pathLength="1" d="${d}"/></svg>`;
})();

// ---------- Opmaak per soort slide ----------
const R = {
  title: s => `${s.grad ? '<div class="mesh"></div>' : ''}<div class="content">
      ${s.sub ? `<p class="sub" data-a style="--d:0">${s.sub}</p>` : ''}
      <${s.huge ? 'h1 class="huge"' : s.h1 ? 'h1' : 'h2'} data-a style="--d:1">${s.h}</${s.huge || s.h1 ? 'h1' : 'h2'}>
      ${s.tagline ? `<p class="tagline" data-a style="--d:2">${s.tagline}</p>` : ''}
    </div>`,
  statement: s => `<div class="content">
      ${s.sub ? `<p class="sub" data-a style="--d:0">${s.sub}</p>` : ''}
      <p class="statement"${s.maxw ? ` style="max-width:${s.maxw}px"` : ''}>${words(s.text, s.accent)}</p>
    </div>`,
  number: s => `<div class="content">
      <div class="number" data-a style="--d:0" data-count="${s.n}">${s.n}</div>
      <p class="caption" data-a style="--d:2">${s.caption}</p>
    </div>`,
  placeholder: s => `<div class="content"><p class="placeholder" data-a>${s.text}</p></div>`,
  timeline: s => {
    let ticks = '', years = '';
    for (let yr = TL.from; yr <= TL.to; yr++) {
      const dec = yr % 10 === 0, x = tlx(yr).toFixed(1), h = dec ? 24 : 11;
      ticks += `<line class="tl-tick${dec ? ' dec' : ''}" x1="${x}" x2="${x}" y1="${TL.y - h}" y2="${TL.y + h}"/>`;
      if (dec) years += `<text class="tl-year" data-y="${yr}" x="${x}" y="${TL.y + 84}">${yr}</text>`;
    }
    const xn = tlx(TL.to).toFixed(1);
    return `<svg class="art" viewBox="0 0 1920 1080">
        <line class="tl-axis" x1="${TL.x0 - 40}" x2="${xn}" y1="${TL.y}" y2="${TL.y}"/>
        ${ticks}${years}
        <line class="tl-run" x1="${xn}" x2="${xn}" y1="${TL.y}" y2="${TL.y}"/>
        <circle class="tl-dot" cx="${xn}" cy="${TL.y}" r="17"/>
        <text class="tl-now" x="${xn}" y="${TL.y - 70}">${TL.to}</text>
      </svg>
      <div class="content"><p class="statement tl-msg">${s.text}</p></div>`;
  },
  uses: s => `<div class="content">
      <p class="sub" data-a style="--d:0">${s.sub}</p>
      <div class="uses">${s.items.map(([img, h, p], i) => `<div data-a style="--d:${1 + i * .6}">
        <img src="fotos/${img}" alt=""><h3>${h}</h3><p>${p}</p></div>`).join('')}</div>
    </div>
    ${s.credit ? `<p class="credit">${s.credit}</p>` : ''}`,
  ladder: s => `${s.art ? ART[s.art]() : ''}
    <div class="ladder-main${s.art ? ' with-art' : ''}">
      <h2 data-a style="--d:0">${s.h}</h2>
      ${s.caption ? `<p class="caption" data-a style="--d:1">${s.caption}</p>` : ''}
    </div>
    <div class="ladder">${LADDER.slice(0, s.i + 1).map(([t, px], i) => i < s.i
      ? `<span class="done" style="font-size:${px}px">${t}</span>`
      : `<span class="cur" data-a style="--d:2;font-size:${px}px">${t}</span>`).join('')}</div>`,
  players: s => `<div class="content">
      <p class="sub" data-a style="--d:0">${s.sub}</p>
      <div class="pl-big">${s.big.map(([n, m, logo], i) => `<div class="pl" data-a style="--d:${1 + i * .5}">
        <i class="logo" style="--logo:url(${asset(`logos/${logo}.svg`)})"></i><b>${n}</b><span>${m}</span></div>`).join('')}</div>
      <div class="pl-small" data-a style="--d:3">${s.small.map(([n, logo]) => `<div class="pl">
        <i class="logo" style="--logo:url(${asset(`logos/${logo}.svg`)})"></i><b>${n}</b></div>`).join('')}</div>
    </div>`,
  // Nieuwskoppen: drie kolommen, ze komen een voor een op.
  headlines: s => `<div class="content">
      <p class="sub" data-a style="--d:0">${s.sub}</p>
      <div class="heads">${s.items.map(([tag, h, src], i) => `<div class="head" data-a style="--d:${1 + i}">
        <span class="tag">${tag}</span><b>“${h}”</b><span class="src">${src}</span></div>`).join('')}</div>
    </div>`,
  // Twee getallen naast elkaar; het tweede komt bij een klik.
  compare: s => `<div class="content"><div class="cmp">${s.items.map(([label, num, unit, cap], i) =>
      `<div class="cmp-col${i ? '' : ' hi'}" ${i ? `data-b="${i}"` : 'data-a style="--d:0"'}>
        <span class="cmp-label">${label}</span><b class="cmp-num">${num}</b><span class="cmp-unit">${unit}</span><span class="cmp-cap">${cap}</span></div>`).join('')}</div></div>`,
  // Verlies: groot getal met een dalende koerslijn op de achtergrond (optioneel een teller per seconde).
  loss: s => `<div class="content loss-text">
      <p class="sub" data-a style="--d:0">${s.sub}</p>
      <div class="loss-num" data-a style="--d:1">−<span data-count="${s.n}">${s.n}</span></div>
      <p class="loss-unit" data-a style="--d:2">${s.unit}</p>
      <p class="loss-cap" data-a style="--d:3">${s.caption}</p>
    </div>
    ${LOSS_LINE}
    ${s.ticker ? `<p class="ticker" data-a style="--d:5">${s.ticker} <b class="tick" data-rate="${s.rate}">−$ 0</b></p>` : ''}`,
  // Wie zijn wij, alle drie op één slide: een balk in de bedrijfskleur veegt over de regel en onthult de naam;
  // baan en toelichting schuiven in, daarna de tegel in de bedrijfskleur met het logo. De eerste staat er meteen, de rest komt per klik.
  team2: s => `<div class="content"><div class="t2-wipe">${s.items.map((p, i) => `<div class="w-row" data-b="${i}" style="--b:${p.brand}">
      <h3 class="w-name"><span>${p.h}</span></h3>
      <div class="w-meta"><p class="w-role">${p.role}</p><p class="w-note">${p.note}</p></div>
      <div class="w-tile"><img src="${asset('logos/' + p.logoInk)}" alt="" style="height:${p.logoInkH}px"></div></div>`).join('')}</div></div>`,
  agenda: s => `<div class="content">
      <p class="sub" data-a style="--d:0">${s.sub}</p>
      <div class="agenda">${s.items.map(([lab, t, d, dur], i) => `<div class="ag-row${t ? '' : ' quiet'}" data-a style="--d:${1 + i * .6}">
        <span class="ag-lab">${lab}</span><div>${t ? `<b>${t}</b>` : ''}${d ? `<span>${d}</span>` : ''}</div><span class="ag-dur">${dur}</span></div>`).join('')}</div>
    </div>`,
  vis: s => s.caption ? `<p class="vis-cap">${words(s.caption, s.accent)}</p>` : '',
  // AI is een groot veld; generatieve AI en LLM's zijn er een klein hoekje van.
  field: () => `
    <p class="field-msg" data-b="2">Een klein hoekje van een groot veld.</p>
    <svg class="art" viewBox="0 0 1920 1080">
      <g data-b="0">
        <circle class="area" cx="960" cy="580" r="380"/>
        <text class="area-title" x="960" y="318">Kunstmatige intelligentie</text>
        <text class="area-item" x="770" y="430">Schaken</text>
        <text class="area-item" x="1150" y="430">Aanbevelingen</text>
        <text class="area-item" x="960" y="490">Beeldherkenning</text>
        <text class="area-item" x="692" y="650">Robotica</text>
        <text class="area-item" x="1230" y="650">Protheses</text>
      </g>
      <g data-b="1">
        <circle class="area" cx="960" cy="745" r="215"/>
        <text class="area-sub" x="960" y="610">Generatieve AI</text>
      </g>
      <g data-b="2">
        <circle class="llm" cx="960" cy="860" r="100"/>
        <text class="llm-t" x="960" y="877">LLM</text>
      </g>
    </svg>`,
  chart: s => {
    const X0 = 270, X1 = 1700, Y0 = 880, Y1 = 270, MAXMIN = 18 * 60, T0 = 2022, T1 = 2026.5;
    const yr = d => { const [y, m, dd] = d.split('-').map(Number); return y + (m - 1) / 12 + (dd - 1) / 365; };
    const px = s.data.map(([d, min]) => [X0 + (yr(d) - T0) / (T1 - T0) * (X1 - X0), Y0 - min / MAXMIN * (Y0 - Y1)]);
    // Puntjes verschijnen zodra de lijn ze bereikt.
    const seg = px.map((p, i) => i ? Math.hypot(p[0] - px[i - 1][0], p[1] - px[i - 1][1]) : 0);
    const total = seg.reduce((a, b) => a + b, 0);
    let acc = 0;
    const dots = px.map((p, i) => { acc += seg[i]; return `<circle class="dot" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="11" style="animation-delay:${(0.5 + 2.8 * acc / total).toFixed(2)}s"/>`; }).join('');
    const grid = [0, 4, 8, 12, 16].map(h => { const y = Y0 - h * 60 / MAXMIN * (Y0 - Y1);
      return `<line class="grid-line" x1="${X0 - 20}" x2="${X1 + 40}" y1="${y}" y2="${y}"/><text class="axis-t" x="${X0 - 40}" y="${y + 10}" text-anchor="end">${h ? h + ' uur' : '0'}</text>`; }).join('');
    const years = [2022, 2023, 2024, 2025, 2026].map(t => `<text class="axis-t" x="${X0 + (t - T0) / (T1 - T0) * (X1 - X0)}" y="${Y0 + 62}" text-anchor="middle">${t}</text>`).join('');
    const [fx, fy] = px[0], [lx, ly] = px[px.length - 1];
    return `<div class="content"><p class="sub" data-a style="--d:0">${s.sub}</p></div>
      <svg class="art" viewBox="0 0 1920 1080">
        ${grid}${years}
        <path class="line" pathLength="1" d="M${px.map(p => p.map(v => v.toFixed(1)).join(' ')).join(' L')}"/>
        ${dots}
        <text class="start-t" x="${fx - 10}" y="${fy - 40}" data-a style="--d:1">36 seconden</text>
        <text class="end-t late" x="${lx - 40}" y="${ly + 22}" text-anchor="end">± 17 uur</text>
        <text class="source" x="${X1 + 40}" y="1030">Bron: METR · het beste model per moment, taken die het in de helft van de gevallen zelfstandig afmaakt</text>
      </svg>`;
  },
};

// ---------- De slides uit inhoud/*.js ----------
// Een visualisatie-slide heeft 'steps': de eerste stap bij binnenkomst, elke klik de volgende.
const DECK = window.SLIDES || [];
for (const s of DECK) if (s.type === 'vis') s.builds = s.steps.length - 1;
for (const s of DECK) if (s.type === 'compare' || s.type === 'team2') s.builds = s.items.length - 1;

// ---------- Opbouw ----------
document.body.insertAdjacentHTML('afterbegin', `
  <div id="viewport"><div id="vis"></div><div id="deck"></div></div>
  <div id="overview">
    <header><h1>${document.title}</h1><p>Klik op een slide om erheen te gaan · <b>O</b> sluit</p></header>
    <div class="ov-grid" id="ov-grid"></div>
  </div>`);
const viewport = document.getElementById('viewport');
const deck = document.getElementById('deck');
const visLayer = document.getElementById('vis');
let cur = 0, build = 0;

function makeSlide(s, still) {
  const el = document.createElement('div');
  el.className = `slide t-${s.type}${s.center ? ' center' : ''}${s.grad ? ' grad' : ''}${s.layout ? ' ' + s.layout : ''}${still ? ' still' : ''}`;
  el.innerHTML = s.type === 'vis' && still
    ? `<div class="vis-thumb">${VIS[s.vis].name}<br>stap ${s.steps.join(' → ')}</div>${R.vis(s)}`
    : R[s.type](s);
  if (still && s.type === 'timeline') { setTimeline(el, TL.end); el.classList.add('tl-done'); }
  return el;
}

function applyBuild(el, b) {
  el.querySelectorAll('[data-b]').forEach(n => {
    const on = +n.dataset.b <= b, was = n.classList.contains('in');
    n.classList.toggle('in', on);
    if (on && !was && !el.classList.contains('still')) n.querySelectorAll('[data-count]').forEach(c => setTimeout(() => countUp(c), 450));
  });
}

// Telt op van 0 naar data-count, met data-dec decimalen, in Nederlandse notatie.
function countUp(n) {
  const target = +n.dataset.count, dec = +(n.dataset.dec || 0), dur = 1500;
  const fmt = v => v.toLocaleString('nl-NL', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const t0 = performance.now();
  const tick = t => {
    const p = Math.min(1, (t - t0) / dur);
    n.textContent = fmt((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1 && n.isConnected) requestAnimationFrame(tick);
  };
  n.textContent = fmt(0);
  requestAnimationFrame(tick);
}

// Loopt op met een vast bedrag per seconde, zolang de slide in beeld is.
function runTicker(node) {
  const rate = +node.dataset.rate, t0 = performance.now() + 1200;
  const tick = t => {
    if (!node.isConnected) return;
    const sec = Math.max(0, (t - t0) / 1000);
    node.textContent = '−$ ' + Math.round(sec * rate).toLocaleString('nl-NL');
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function play(el) {
  el.classList.add('play');
  const mesh = el.querySelector('.mesh');
  if (mesh) mountMesh(mesh);
  const tick = el.querySelector('.tick');
  if (tick) runTicker(tick);
  if (el.classList.contains('t-timeline')) runTimeline(el);
  // Getallen tellen op; die in een opbouwstap pas als die stap verschijnt (zie applyBuild).
  el.querySelectorAll('[data-count]').forEach(n => { if (!n.closest('[data-b]')) setTimeout(() => countUp(n), 200); });
}

// Elke visualisatie wordt één keer geladen en blijft leven, zodat opeenvolgende stappen vloeiend overlopen.
const frames = {};
const fontsTag = document.getElementById('fonts').outerHTML;
for (const [key, v] of Object.entries(VIS).filter(([key]) => DECK.some(s => s.vis === key))) {
  const f = document.createElement('iframe');
  f.tabIndex = -1;
  f.title = v.name;
  visLayer.appendChild(f);
  frames[key] = {
    el: f,
    ready: fetch(v.file).then(r => r.text()).then(src => new Promise(resolve => {
      const vars = Object.entries({ ...BASE_VARS, ...v.vars }).map(([k, val]) => `--${k}: ${val};`).join(' ');
      // In een srcdoc mag de visualisatie zijn #stap niet in de URL zetten; dat negeren we stil.
      const inject = `${fontsTag}<style>:root { ${vars} }</style>` +
        `<script>{ const rs = history.replaceState.bind(history); history.replaceState = (...a) => { try { rs(...a); } catch (e) {} }; }` +
        `document.fonts.load('500 40px "Instrument Sans"'); document.fonts.load('600 40px "Instrument Sans"');<\/script>`;
      f.addEventListener('load', () => resolve(f.contentWindow), { once: true });
      f.srcdoc = src.replace('</head>', inject + '</head>');
    })),
  };
}

// Toon de juiste visualisatie op de stap die bij deze slide en deze klik hoort.
function syncVis() {
  const s = DECK[cur];
  for (const [key, f] of Object.entries(frames)) f.el.classList.toggle('on', s.vis === key);
  if (!s.vis) return;
  const shown = cur, step = s.steps[Math.min(build, s.steps.length - 1)];
  frames[s.vis].ready.then(win => { if (cur === shown) win.scene.setStep(step); });
}

function go(i, atEnd = false) {
  cur = Math.max(0, Math.min(DECK.length - 1, i));
  const s = DECK[cur];
  build = atEnd ? (s.builds || 0) : 0;
  const el = makeSlide(s);
  if (meshMount) { meshMount.dispose(); meshMount = null; }
  deck.replaceChildren(el);
  // Opbouwstappen pas aanzetten nadat de slide eenmaal getekend is, zodat ook de eerste stap inschuift.
  requestAnimationFrame(() => {
    void el.offsetWidth;
    play(el);
    if (deck.firstElementChild === el) applyBuild(el, build);
  });
  syncVis();

  history.replaceState(null, '', '#' + (cur + 1));
}

function rebuild(b) {
  build = b;
  applyBuild(deck.firstElementChild, build);
  syncVis();
}
function next() {
  if (build < (DECK[cur].builds || 0)) rebuild(build + 1);
  else if (cur < DECK.length - 1) go(cur + 1);
}
function prev() {
  if (build > 0) rebuild(build - 1);
  else if (cur > 0) go(cur - 1, true);
}

function fit() {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  const w = 1920 * s, h = 1080 * s;
  Object.assign(viewport.style, { width: w + 'px', height: h + 'px', left: (innerWidth - w) / 2 + 'px', top: (innerHeight - h) / 2 + 'px' });
  deck.style.transform = `scale(${s})`;
}

// ---------- Overzicht met spreektekst, om te oefenen ----------
const overview = document.getElementById('overview');
const ovGrid = document.getElementById('ov-grid');
const ro = new ResizeObserver(es => { for (const e of es) e.target.style.setProperty('--s', e.contentRect.width / 1920); });
function buildOverview() {
  if (ovGrid.childElementCount) return;
  DECK.forEach((s, i) => {
    const item = document.createElement('div');
    item.className = 'ov-item';
    item.innerHTML = `<div class="thumb"></div><div class="meta"><b>${i + 1}</b>${s.notes || ''}</div>`;
    const thumb = item.firstElementChild;
    const el = makeSlide(s, true);
    applyBuild(el, s.builds || 0);
    thumb.appendChild(el);
    ro.observe(thumb);
    item.addEventListener('click', () => { toggleOverview(false); go(i); });
    ovGrid.appendChild(item);
  });
}
function toggleOverview(open = !overview.classList.contains('open')) {
  if (open) {
    buildOverview();
    [...ovGrid.children].forEach((n, i) => n.classList.toggle('cur', i === cur));
    overview.classList.add('open');
    ovGrid.children[cur].scrollIntoView({ block: 'center' });
  } else overview.classList.remove('open');
}

// ---------- Bediening ----------
document.addEventListener('keydown', e => {
  const k = e.key;
  if (k === 'o' || k === 'O') return toggleOverview();
  if (overview.classList.contains('open')) { if (k === 'Escape') toggleOverview(false); return; }
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) next();
  else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) prev();
  else if (k === 'Home') go(0);
  else if (k === 'End') go(DECK.length - 1);
  else if (k === 'f' || k === 'F') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }
  else return;
  e.preventDefault();
});
viewport.addEventListener('click', next);

let idleTimer;
addEventListener('mousemove', () => {
  document.body.classList.remove('idle');
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => document.body.classList.add('idle'), 2000);
});

addEventListener('resize', fit);
fit();
go((parseInt(location.hash.slice(1), 10) || 1) - 1);
