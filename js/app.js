// Shared header/footer, the demo cart, and per-page behavior.

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const money = n => "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
const byId = id => PRODUCTS.find(p => p.id === id);
const sizeText = p => p.sizeLabel || `${p.size}″`;
const speciesName = p => (p.species && SPECIES[p.species] && !p.kind ? SPECIES[p.species].name : p.kind === "replica" ? "Megalodon (replica)" : "Gift");

/* ---------- Cart (stored in this browser only) ---------- */
const Cart = {
  key: "btt-cart",
  read() { try { return JSON.parse(localStorage.getItem(this.key)) || {}; } catch { return {}; } },
  write(c) { try { localStorage.setItem(this.key, JSON.stringify(c)); } catch {} updateCartCount(); },
  add(id, qty = 1) { const c = this.read(); c[id] = (c[id] || 0) + qty; this.write(c); },
  set(id, qty) { const c = this.read(); if (qty <= 0) delete c[id]; else c[id] = qty; this.write(c); },
  clear() { this.write({}); },
  count() { return Object.values(this.read()).reduce((a, b) => a + b, 0); },
};

function updateCartCount() {
  $$(".cart-count").forEach(el => (el.textContent = Cart.count()));
}

function toast(msg) {
  let t = $(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- Header & footer ---------- */
function renderChrome() {
  const page = document.body.dataset.page;
  const links = [["index.html", "Home", "home"], ["shop.html", "Shop", "shop"], ["guide.html", "Tooth Guide", "guide"], ["about.html", "About", "about"], ["visit.html", "Visit", "visit"]];
  $("#site-header").outerHTML = `
    <div class="demo-strip">Demo website · Braden Tooth &amp; Tide is a concept shop. No real orders or payments are processed.</div>
    <header class="site-header"><div class="wrap">
      <a class="brand" href="index.html">${logoSVG()}<span><b>Braden</b> Tooth &amp; Tide</span></a>
      <button class="nav-toggle" aria-label="Open menu" aria-expanded="false">☰</button>
      <nav class="site-nav">
        ${links.map(([href, label, key]) => `<a href="${href}" class="${key === page ? "active" : ""}">${label}</a>`).join("")}
        <a href="cart.html" class="cart-link ${page === "cart" ? "active" : ""}">Cart <span class="cart-count">0</span></a>
      </nav>
    </div></header>`;
  $("#site-footer").outerHTML = `
    <footer class="site-footer"><div class="wrap">
      <div class="footer-grid">
        <div>
          <a class="brand" href="index.html">${logoSVG()}<span>Tooth &amp; Tide</span></a>
          <p>Fossils from the Carolina Coast. Hand-picked, honestly graded shark teeth from Oak Island, North Carolina.</p>
        </div>
        <div><h4>Shop</h4><a href="shop.html">All teeth</a><a href="shop.html?species=meg">Megalodon</a><a href="shop.html?species=gw">Great White</a><a href="shop.html?gifts=1">Grab bags &amp; gifts</a></div>
        <div><h4>Learn</h4><a href="guide.html">Tooth ID guide</a><a href="guide.html#hunt">Hunting on Oak Island</a><a href="guide.html#quiz">Tooth quiz</a><a href="about.html">Our story</a></div>
        <div><h4>Visit</h4><p>214 Sandpiper Way<br>Oak Island, NC 28465</p><a href="visit.html">Hours &amp; directions</a></div>
      </div>
      <div class="footer-bottom">© ${new Date().getFullYear()} Braden Tooth &amp; Tide · Braden Dowling, Owner &amp; CEO<br>
        This is a demo website. The address, reviews and prices are examples, and nothing here is for sale.</div>
    </div></footer>`;

  const toggle = $(".nav-toggle"), nav = $(".site-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  updateCartCount();
}

function addBubbles() {
  $$(".bubbles").forEach(box => {
    const n = +box.dataset.count || 14;
    for (let i = 0; i < n; i++) {
      const b = document.createElement("span");
      const size = 6 + Math.random() * 18;
      b.className = "bubble";
      b.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;animation-duration:${8 + Math.random() * 10}s;animation-delay:${-Math.random() * 18}s`;
      box.appendChild(b);
    }
  });
}

/* ---------- Product cards ---------- */
function cardHTML(p) {
  const badges = [
    p.pick ? `<span class="badge pick">Braden’s Pick</span>` : "",
    p.soldOut ? `<span class="badge sold">Sold out</span>` : "",
    `<span class="badge grade-${p.grade}">${p.grade}</span>`,
  ].join("");
  return `<article class="card">
    <a class="card-art" href="tooth.html?id=${p.id}"><div class="badges">${badges}</div>${productArt(p)}</a>
    <div class="card-body">
      <h3><a href="tooth.html?id=${p.id}">${p.name}</a></h3>
      <p class="meta">${speciesName(p)} · ${sizeText(p)} · ${p.origin}</p>
      <div class="card-foot">
        <span class="price">${money(p.price)}</span>
        <button class="btn-add" data-add="${p.id}" ${p.soldOut ? "disabled" : ""}>${p.soldOut ? "Sold" : "Add to cart"}</button>
      </div>
    </div>
  </article>`;
}

document.addEventListener("click", e => {
  const btn = e.target.closest("[data-add]");
  if (!btn) return;
  const p = byId(btn.dataset.add);
  const qty = +(btn.dataset.qty || 1);
  Cart.add(p.id, qty);
  toast(`Added ${qty > 1 ? qty + " × " : ""}${p.name} to your cart`);
});

/* ---------- Home ---------- */
function initHome() {
  $("#hero-tooth").innerHTML = toothSVG("meg", "gray", { label: "Megalodon tooth" });
  $("#featured").innerHTML = PRODUCTS.filter(p => p.featured || p.id === "meg-serrated-4").slice(0, 4).map(cardHTML).join("");

  // Tooth of the Week rotates through Braden's Picks
  const picks = PRODUCTS.filter(p => p.pick && !p.soldOut && !p.kind);
  const week = Math.floor(Date.now() / (7 * 24 * 3600 * 1000));
  const t = picks[week % picks.length];
  const sp = SPECIES[t.species];
  $("#totw-art").innerHTML = productArt(t);
  $("#totw-info").innerHTML = `
    <p class="eyebrow">Tooth of the Week</p>
    <h2>${t.name}</h2>
    <p>${t.desc}</p>
    <ul class="facts">
      <li><b>Species</b>${sp.name}</li><li><b>Size</b>${sizeText(t)}</li>
      <li><b>Age</b>${sp.era}</li><li><b>Found</b>${t.origin}</li>
    </ul>
    <div class="hero-actions"><span class="price">${money(t.price)}</span>
      <button class="btn btn-coral" data-add="${t.id}">Add to cart</button>
      <a class="btn btn-light" href="tooth.html?id=${t.id}">Details</a></div>`;

  initCompare();

  $("#reviews").innerHTML = REVIEWS.map(r => `<div class="review"><div class="stars">${"★".repeat(r.stars)}</div><p>“${r.text}”</p><cite>${r.by}</cite></div>`).join("");
}

function initCompare() {
  const a = $("#cmp-a"), b = $("#cmp-b"), stage = $("#stage");
  const opts = Object.entries(SPECIES).map(([k, s]) => `<option value="${k}">${s.name} (${s.typical}″)</option>`).join("");
  a.innerHTML = opts; b.innerHTML = opts;
  a.value = "meg"; b.value = "sandtiger";
  const colors = { meg: "gray", gw: "tan", otodus: "gray", angust: "black", mako: "bluegray", tiger: "black", bull: "brown", sandtiger: "black", hemi: "bluegray", lemon: "black" };

  function draw() {
    const ppi = window.innerWidth < 600 ? 34 : 46; // pixels per inch
    const item = (name, inches, art) => `<div class="item"><span>${name}<br><small>${inches}″</small></span>${art}</div>`;
    const tooth = k => {
      const s = SPECIES[k];
      return item(s.name, s.typical, toothSVG(k, colors[k], { crop: true, label: s.name }).replace("<svg", `<svg style="height:${s.typical * ppi}px;width:auto"`));
    };
    const ticks = Array.from({ length: 8 }, (_, i) => `<span style="bottom:${i * ppi}px">${i}″</span>`).join("");
    stage.style.height = 7.2 * ppi + 60 + "px";
    stage.innerHTML = `<div class="ruler" style="height:${7 * ppi}px">${ticks}</div>` + tooth(a.value) + tooth(b.value) +
      item("Quarter", 0.96, `<div class="quarter" style="width:${0.955 * ppi}px"></div>`);
  }
  a.addEventListener("change", draw);
  b.addEventListener("change", draw);
  window.addEventListener("resize", draw);
  draw();
}

/* ---------- Shop ---------- */
function initShop() {
  const params = new URLSearchParams(location.search);
  const state = {
    species: new Set(params.get("species") ? [params.get("species")] : []),
    gifts: params.get("gifts") === "1",
    grade: "all", max: 1200, q: "", sort: "featured",
  };

  $("#species-chips").innerHTML =
    Object.entries(SPECIES).map(([k, s]) => `<button class="chip" data-sp="${k}">${s.name}</button>`).join("") +
    `<button class="chip" data-sp="gifts">Bags &amp; gifts</button>`;

  const syncChips = () => $$("#species-chips .chip").forEach(c =>
    c.classList.toggle("on", c.dataset.sp === "gifts" ? state.gifts : state.species.has(c.dataset.sp)));

  $("#species-chips").addEventListener("click", e => {
    const c = e.target.closest(".chip");
    if (!c) return;
    if (c.dataset.sp === "gifts") state.gifts = !state.gifts;
    else state.species.has(c.dataset.sp) ? state.species.delete(c.dataset.sp) : state.species.add(c.dataset.sp);
    render();
  });
  $("#grade").addEventListener("change", e => { state.grade = e.target.value; render(); });
  $("#sort").addEventListener("change", e => { state.sort = e.target.value; render(); });
  $("#search").addEventListener("input", e => { state.q = e.target.value.trim().toLowerCase(); render(); });
  $("#max").addEventListener("input", e => { state.max = +e.target.value; $("#max-label").textContent = money(state.max); render(); });
  document.addEventListener("click", e => {
    if (!e.target.closest("[data-reset]")) return;
    Object.assign(state, { species: new Set(), gifts: false, grade: "all", max: 1200, q: "" });
    $("#grade").value = "all"; $("#search").value = ""; $("#max").value = 1200; $("#max-label").textContent = money(1200);
    render();
  });

  function render() {
    syncChips();
    const anySpecies = state.species.size || state.gifts;
    let list = PRODUCTS.filter(p => {
      const isGift = !!p.kind;
      if (anySpecies && !((isGift && state.gifts) || (!isGift && state.species.has(p.species)))) return false;
      if (state.grade !== "all" && p.grade !== state.grade) return false;
      if (p.price > state.max) return false;
      if (state.q && !`${p.name} ${speciesName(p)} ${p.origin} ${p.desc}`.toLowerCase().includes(state.q)) return false;
      return true;
    });
    const sorters = {
      featured: (a, b) => (b.pick ? 1 : 0) - (a.pick ? 1 : 0) || (a.soldOut ? 1 : 0) - (b.soldOut ? 1 : 0),
      low: (a, b) => a.price - b.price,
      high: (a, b) => b.price - a.price,
      size: (a, b) => (b.size || 0) - (a.size || 0),
    };
    list = list.slice().sort(sorters[state.sort]);
    $("#count").textContent = `${list.length} ${list.length === 1 ? "item" : "items"}`;
    $("#products").innerHTML = list.length
      ? list.map(cardHTML).join("")
      : `<div class="empty"><h3>No teeth match those filters</h3><p>Try a wider price range or <button class="link-btn" data-reset style="color:var(--sun)">reset the filters</button>.</p></div>`;
  }
  render();
}

/* ---------- Product page ---------- */
function initTooth() {
  const p = byId(new URLSearchParams(location.search).get("id"));
  const main = $("#product");
  if (!p) {
    main.innerHTML = `<div style="text-align:center"><h2>Tooth not found</h2><p>That one may have washed back out to sea.</p><br><a class="btn btn-coral" href="shop.html">Back to the shop</a></div>`;
    return;
  }
  document.title = `${p.name} · Braden Tooth & Tide`;
  const sp = p.species && !p.kind ? SPECIES[p.species] : null;
  let qty = 1;
  const rows = [
    ["Species", sp ? `<a href="guide.html#${p.species}">${sp.name}</a>` : speciesName(p)],
    sp ? ["Scientific name", `<i>${sp.sci}</i>`] : null,
    ["Size", sizeText(p)],
    ["Grade", `${p.grade}${GRADES[p.grade] ? ` · <small>${GRADES[p.grade]}</small>` : ""}`],
    sp ? ["Fossil age", sp.era] : null,
    ["Found at", p.origin],
  ].filter(Boolean);

  main.innerHTML = `
    <div class="product">
      <div class="product-art">${productArt(p)}</div>
      <div>
        <p class="crumbs"><a href="shop.html">Shop</a> / ${sp ? `<a href="shop.html?species=${p.species}">${sp.name}</a>` : `<a href="shop.html?gifts=1">Bags &amp; gifts</a>`} / ${p.name}</p>
        <div class="badges">${p.pick ? `<span class="badge pick">Braden’s Pick</span>` : ""}${p.soldOut ? `<span class="badge sold">Sold out</span>` : ""}<span class="badge grade-${p.grade}">${p.grade}</span></div>
        <h1 style="font-size:clamp(2rem,4.5vw,3rem)">${p.name}</h1>
        <span class="price">${money(p.price)}</span>
        <p>${p.desc}</p><br>
        <div class="buy-row">
          <div class="qty"><button data-q="-1" aria-label="Fewer">−</button><span id="qty">1</span><button data-q="1" aria-label="More">+</button></div>
          <button class="btn btn-coral" id="buy" data-add="${p.id}" data-qty="1" ${p.soldOut ? "disabled" : ""}>${p.soldOut ? "Sold out" : "Add to cart"}</button>
        </div>
        <table class="spec-table">${rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</table>
        ${sp ? `<div class="note"><b>How to ID it:</b> ${sp.id}</div>` : ""}
      </div>
    </div>`;

  $$(".qty button").forEach(b => b.addEventListener("click", () => {
    qty = Math.min(9, Math.max(1, qty + +b.dataset.q));
    $("#qty").textContent = qty;
    $("#buy").dataset.qty = qty;
  }));

  const related = PRODUCTS.filter(x => x.id !== p.id && (p.kind ? x.kind : x.species === p.species && !x.kind));
  const more = related.length ? related : PRODUCTS.filter(x => x.pick && x.id !== p.id);
  $("#related-title").textContent = related.length ? (sp ? `More ${sp.name} teeth` : "More bags & gifts") : "Braden’s Picks";
  $("#related").innerHTML = more.slice(0, 4).map(cardHTML).join("");
}

/* ---------- Cart page ---------- */
function initCart() {
  const SHIP = 6.95, FREE_OVER = 75, TAX = 0.0675;
  function render() {
    const items = Object.entries(Cart.read()).map(([id, qty]) => ({ p: byId(id), qty })).filter(i => i.p);
    if (!items.length) {
      $("#cart").innerHTML = `<div class="empty"><h2>Your cart is empty</h2><p>Plenty of teeth in the sea.</p><br><a class="btn btn-coral" href="shop.html">Start shopping</a></div>`;
      return;
    }
    const sub = items.reduce((s, i) => s + i.p.price * i.qty, 0);
    const ship = sub >= FREE_OVER ? 0 : SHIP;
    const tax = Math.round(sub * TAX * 100) / 100;
    $("#cart").innerHTML = `<div class="cart-layout">
      <div class="cart-list">${items.map(({ p, qty }) => `
        <div class="cart-row">
          ${productArt(p)}
          <div><h3><a href="tooth.html?id=${p.id}">${p.name}</a></h3><p class="meta" style="margin:2px 0">${speciesName(p)} · ${sizeText(p)}</p>
            <button class="remove" data-remove="${p.id}">Remove</button></div>
          <div class="qty"><button data-id="${p.id}" data-d="-1" aria-label="Fewer">−</button><span>${qty}</span><button data-id="${p.id}" data-d="1" aria-label="More">+</button></div>
          <span class="line">${money(p.price * qty)}</span>
        </div>`).join("")}
      </div>
      <aside class="summary">
        <h3>Order summary</h3><br>
        <div><span>Subtotal</span><span>${money(sub)}</span></div>
        <div><span>Shipping</span><span>${ship ? money(ship) : "Free"}</span></div>
        <div><span>NC sales tax (est.)</span><span>${money(tax)}</span></div>
        <div class="total"><span>Total</span><span>${money(sub + ship + tax)}</span></div>
        <button class="btn btn-coral" id="checkout">Checkout</button>
        <small>${sub < FREE_OVER ? `Add ${money(FREE_OVER - sub)} more for free shipping.` : "You’ve got free shipping!"}</small>
      </aside>
    </div>`;
  }
  $("#cart").addEventListener("click", e => {
    const d = e.target.closest("[data-d]"), r = e.target.closest("[data-remove]");
    if (d) { const c = Cart.read(); Cart.set(d.dataset.id, Math.min(9, (c[d.dataset.id] || 0) + +d.dataset.d)); render(); }
    if (r) { Cart.set(r.dataset.remove, 0); render(); }
    if (e.target.id === "checkout") $("#modal").classList.add("open");
  });
  $("#modal").addEventListener("click", e => {
    if (e.target.id === "clear-cart") { Cart.clear(); render(); }
    if (e.target.closest("[data-close]") || e.target.id === "modal") $("#modal").classList.remove("open");
  });
  render();
}

/* ---------- Guide ---------- */
function initGuide() {
  const colors = { meg: "black", gw: "gray", otodus: "gray", angust: "brown", mako: "bluegray", tiger: "black", bull: "brown", sandtiger: "black", hemi: "bluegray", lemon: "tan" };
  $("#species-grid").innerHTML = Object.entries(SPECIES).map(([k, s]) => `
    <article class="species" id="${k}">
      ${toothSVG(k, colors[k], { label: s.name })}
      ${s.oakIsland ? `<span class="tag">Found on Oak Island</span>` : ""}
      <h3>${s.name}</h3><p class="sci">${s.sci}</p>
      <dl><dt>Lived</dt><dd>${s.era}</dd><dt>Size</dt><dd>${s.max}</dd></dl>
      <p>${s.id}</p>
      <a class="btn btn-sm btn-ghost" href="shop.html?species=${k}">Shop ${s.name}</a>
    </article>`).join("");

  $("#grades").innerHTML = Object.entries(GRADES).map(([g, d]) => `<div><span class="badge grade-${g}">${g}</span><p>${d}</p></div>`).join("");

  // Quiz
  const keys = Object.keys(SPECIES), palette = Object.keys(TOOTH_COLORS).filter(c => c !== "cream");
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  let score = 0, total = 0, answer = null;
  function next() {
    answer = pick(keys);
    const opts = new Set([answer]);
    while (opts.size < 3) opts.add(pick(keys));
    $("#quiz-art").innerHTML = toothSVG(answer, pick(palette), { label: "Mystery tooth" });
    $("#quiz-options").innerHTML = [...opts].sort(() => Math.random() - .5).map(k => `<button data-k="${k}">${SPECIES[k].name}</button>`).join("");
    $("#quiz-feedback").textContent = "";
    $("#quiz-next").hidden = true;
  }
  $("#quiz-options").addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b || b.disabled) return;
    total++;
    const right = b.dataset.k === answer;
    if (right) score++;
    $$("#quiz-options button").forEach(x => { x.disabled = true; if (x.dataset.k === answer) x.classList.add("right"); });
    if (!right) b.classList.add("wrong");
    $("#quiz-feedback").innerHTML = (right ? "🦈 Nice eye! " : `Not quite. That’s a <b>${SPECIES[answer].name}</b>. `) + SPECIES[answer].id;
    $("#quiz-score").textContent = `${score} / ${total}`;
    $("#quiz-next").hidden = false;
  });
  $("#quiz-next").addEventListener("click", next);
  next();
}

/* ---------- About / Visit ---------- */
function initVisit() {
  $("#contact-form").addEventListener("submit", e => {
    e.preventDefault();
    e.target.reset();
    $("#form-msg").textContent = "Thanks! This is a demo site, so your message wasn’t actually sent.";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderChrome();
  addBubbles();
  const init = { home: initHome, shop: initShop, tooth: initTooth, cart: initCart, guide: initGuide, visit: initVisit }[document.body.dataset.page];
  if (init) init();
});
