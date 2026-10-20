// Draws clean, consistent SVG illustrations of shark teeth.
// Every tooth lives in a 120 x 140 box: crown points up, root at the bottom.

const TOOTH_SHAPES = {
  meg:       { w: 38, apex: 8,  lean: 0,   bL: 5,  bR: 5,  serr: 1.1, root: "wide", bourlette: true },
  gw:        { w: 32, apex: 16, lean: 0,   bL: 3,  bR: 3,  serr: 1.9, root: "wide" },
  otodus:    { w: 28, apex: 10, lean: 0,   bL: 4,  bR: 4,  serr: 0,   root: "wide", cusplets: 9 },
  angust:    { w: 29, apex: 10, lean: 0,   bL: 3,  bR: 3,  serr: 1.2, root: "wide", cusplets: 8, bourlette: true },
  mako:      { w: 24, apex: 10, lean: 2,   bL: 4,  bR: 3,  serr: 0,   root: "lobed", rootW: 30 },
  tiger:     { w: 34, apex: 46, lean: -20, bL: -2, bR: 7,  serr: 1.6, root: "wide" },
  bull:      { w: 28, apex: 26, lean: 0,   bL: -3, bR: -3, serr: 1,   root: "wide" },
  sandtiger: { w: 9,  apex: 6,  lean: 4,   bL: 1,  bR: 1,  serr: 0,   root: "lobed", rootW: 22, cusplets: 6 },
  hemi:      { w: 22, apex: 18, lean: 18,  bL: 8,  bR: -5, serr: 2.1, root: "wide", serrStop: 0.72 },
  lemon:     { w: 9,  apex: 20, lean: 0,   bL: -1, bR: -1, serr: 0,   root: "flat", rootW: 32 },
};

const TOOTH_COLORS = {
  black:    { hi: "#55555e", lo: "#1d1d22", root: "#3e3630" },
  gray:     { hi: "#a5abb3", lo: "#5c626b", root: "#857b6e" },
  tan:      { hi: "#ecd29f", lo: "#ad8550", root: "#c7aa7f" },
  brown:    { hi: "#b0805a", lo: "#673f22", root: "#8d6b4c" },
  bluegray: { hi: "#9cb1c3", lo: "#4b6072", root: "#7c8182" },
  cream:    { hi: "#fffbf2", lo: "#ddd0b6", root: "#eadcc2" },
};

let toothUid = 0;

function rootBottom(s) {
  return s.root === "lobed" ? 126 : s.root === "flat" ? 109 : 117;
}

function edgePoints(a, b, bulge, n) {
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
  const nx = dy / len, ny = -dx / len; // outward normal when tracing left -> apex -> right
  const c = [(a[0] + b[0]) / 2 + nx * bulge, (a[1] + b[1]) / 2 + ny * bulge];
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t;
    pts.push({ x: u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], y: u * u * a[1] + 2 * u * t * c[1] + t * t * b[1], nx, ny, t });
  }
  return pts;
}

function serrate(pts, s, fromBase) {
  if (!s.serr) return pts;
  const stop = s.serrStop || 0.94;
  return pts.map((p, i) => {
    const along = fromBase ? p.t : 1 - p.t; // 0 at base, 1 at apex
    if (i === 0 || i === pts.length - 1 || along > stop || along < 0.04 || i % 2) return p;
    return { ...p, x: p.x + p.nx * s.serr, y: p.y + p.ny * s.serr };
  });
}

function rootPath(s) {
  const r = s.rootW || s.w + 5;
  const L = 60 - r, R = 60 + r;
  if (s.root === "lobed") {
    return `M${L} 89 C${L - 3} 106 ${L + 2} 124 ${L + 8} 126 C${L + 14} 126 55 104 60 100 C65 104 ${R - 14} 126 ${R - 8} 126 C${R - 2} 124 ${R + 3} 106 ${R} 89Z`;
  }
  if (s.root === "flat") {
    return `M${L} 90 C${L - 2} 100 ${L + 2} 108 ${L + 8} 109 L56 109 Q60 104 64 109 L${R - 8} 109 C${R - 2} 108 ${R + 2} 100 ${R} 90Z`;
  }
  return `M${L} 89 C${L - 4} 104 ${L + 4} 116 ${L + 10} 117 C50 117 54 108 60 108 C66 108 70 117 ${R - 10} 117 C${R - 4} 116 ${R + 4} 104 ${R} 89Z`;
}

// Returns the inner SVG markup (a <g>) for one tooth.
function toothGroup(speciesKey, colorKey, transform = "") {
  const s = TOOTH_SHAPES[speciesKey] || TOOTH_SHAPES.meg;
  const c = TOOTH_COLORS[colorKey] || TOOTH_COLORS.gray;
  const id = "t" + (++toothUid);
  const L = [60 - s.w, 92], A = [60 + s.lean, s.apex], R = [60 + s.w, 92];
  const n = s.serr ? 34 : 16;
  const left = serrate(edgePoints(L, A, s.bL, n), s, true);
  const right = serrate(edgePoints(A, R, s.bR, n), s, false);
  const crown = "M" + [...left, ...right.slice(1)].map(p => p.x.toFixed(1) + " " + p.y.toFixed(1)).join(" L") + "Z";

  let cusps = "";
  if (s.cusplets) {
    const k = s.cusplets, lx = 60 - s.w - 1, rx = 60 + s.w + 1;
    cusps = `<path d="M${lx - k * .8} 95 L${lx - k * .15} ${93 - k * 1.7} L${lx + k * .9} 93Z M${rx + k * .8} 95 L${rx + k * .15} ${93 - k * 1.7} L${rx - k * .9} 93Z" fill="url(#${id}c)"/>`;
  }
  const bourlette = s.bourlette
    ? `<path d="M${62 - s.w} 93 Q60 ${93 - s.w * .42} ${58 + s.w} 93 Q60 ${93 - s.w * .12} ${62 - s.w} 93Z" fill="#000" opacity=".28"/>`
    : "";
  // soft highlight running up the blade
  const midX = (60 - s.w * .35 + A[0]) / 2, midY = (92 + s.apex) / 2 + 6;
  const ang = Math.atan2(A[0] - (60 - s.w * .35), 92 - s.apex) * 180 / Math.PI;
  const shine = `<ellipse cx="${midX.toFixed(1)}" cy="${midY.toFixed(1)}" rx="${Math.max(2, s.w * .13).toFixed(1)}" ry="${((92 - s.apex) * .3).toFixed(1)}" transform="rotate(${ang.toFixed(1)} ${midX.toFixed(1)} ${midY.toFixed(1)})" fill="#fff" opacity=".17"/>`;

  return `<g transform="${transform}">
    <defs>
      <linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.hi}"/><stop offset="1" stop-color="${c.lo}"/></linearGradient>
      <linearGradient id="${id}r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.root}"/><stop offset="1" stop-color="${c.root}" stop-opacity=".8"/></linearGradient>
    </defs>
    <path d="${rootPath(s)}" fill="url(#${id}r)" stroke="rgba(0,0,0,.22)" stroke-width="1.2"/>
    ${cusps}
    <path d="${crown}" fill="url(#${id}c)" stroke="rgba(0,0,0,.25)" stroke-width="1.1" stroke-linejoin="round"/>
    ${bourlette}${shine}
  </g>`;
}

// A standalone tooth SVG. With crop: true the viewBox hugs the tooth so its height equals its real size.
function toothSVG(speciesKey, colorKey, { crop = false, shadow = false, label = "" } = {}) {
  const s = TOOTH_SHAPES[speciesKey] || TOOTH_SHAPES.meg;
  const top = s.apex - 2, bottom = rootBottom(s) + 1;
  const vb = crop ? `0 ${top} 120 ${bottom - top}` : "0 0 120 140";
  const shadowEl = shadow ? `<ellipse cx="60" cy="134" rx="${(s.rootW || s.w + 5) * .9}" ry="3.5" fill="#000" opacity=".13"/>` : "";
  return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${shadowEl}${toothGroup(speciesKey, colorKey)}</svg>`;
}

function bagSVG(label) {
  return `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
    <ellipse cx="60" cy="133" rx="36" ry="4" fill="#000" opacity=".13"/>
    ${toothGroup("sandtiger", "black", "translate(22 6) rotate(-18 60 70) scale(.36)")}
    ${toothGroup("meg", "gray", "translate(38 0) scale(.4)")}
    ${toothGroup("bull", "brown", "translate(60 14) rotate(16 60 70) scale(.33)")}
    ${toothGroup("tiger", "black", "translate(70 6) rotate(24 60 70) scale(.3)")}
    <path d="M40 50 Q60 42 80 50 L84 62 Q60 56 36 62Z" fill="#b8925a" stroke="#7d5d32" stroke-width="1.5"/>
    <path d="M34 62 Q60 56 86 62 Q104 110 86 128 L34 128 Q16 110 34 62Z" fill="#cfab70" stroke="#7d5d32" stroke-width="1.5"/>
    <path d="M38 76 Q60 72 82 76 M34 96 Q60 92 86 96 M36 114 Q60 110 84 114" stroke="#a9874f" stroke-width="1.2" fill="none" stroke-dasharray="3 3"/>
    <rect x="36" y="58" width="48" height="7" rx="3.5" fill="#c4503a"/>
    <rect x="40" y="84" width="40" height="20" rx="4" fill="#f7eedb" stroke="#7d5d32"/>
    <text x="60" y="97.5" text-anchor="middle" font-family="Lilita One, sans-serif" font-size="8" fill="#1b2a35">OAK ISLAND</text>
  </svg>`;
}

function necklaceSVG(sp, color, label) {
  return `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
    <path d="M14 6 Q60 120 106 6" fill="none" stroke="#6b4b2a" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="60" cy="74" r="4" fill="none" stroke="#c9a14a" stroke-width="2.5"/>
    ${toothGroup(sp, color, "translate(30 66) scale(.5)")}
  </svg>`;
}

function boxSVG(sp, color, label) {
  return `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
    <ellipse cx="60" cy="133" rx="46" ry="4" fill="#000" opacity=".13"/>
    <rect x="12" y="12" width="96" height="118" rx="8" fill="#6b4529" stroke="#4a2f1b" stroke-width="2"/>
    <rect x="20" y="20" width="80" height="102" rx="4" fill="#123d5c"/>
    ${toothGroup(sp, color, "translate(24 20) scale(.6)")}
    <path d="M20 20 L58 20 L20 70Z" fill="#fff" opacity=".12"/>
    <rect x="40" y="108" width="40" height="9" rx="2" fill="#c9a14a"/>
  </svg>`;
}

// Picks the right illustration for a catalog product.
function productArt(p, opts = {}) {
  const label = p.name;
  if (p.kind === "bag") return bagSVG(label);
  if (p.kind === "necklace") return necklaceSVG(p.species, p.color, label);
  if (p.kind === "box") return boxSVG(p.species, p.color, label);
  return toothSVG(p.species, p.color, { shadow: true, label, ...opts });
}

function logoSVG() {
  return `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="24" cy="24" r="23" fill="#138a8a"/>
    <path d="M1 30 Q8 26 14 30 T26 30 T38 30 T48 30 V36 Q40 47 24 47 Q8 47 1 36Z" fill="#1e9db1"/>
    <path d="M14 30 L24 8 L34 30 Q24 27 14 30Z" fill="#f7eedb" stroke="#1b2a35" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M14 30 Q24 27 34 30 Q31 36 24 34 Q17 36 14 30Z" fill="#f2745a" stroke="#1b2a35" stroke-width="1.6"/>
  </svg>`;
}
