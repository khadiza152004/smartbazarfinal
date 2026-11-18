/* ============================================================
   SmartBazaar Tracker — main JavaScript
   Clean structure so you can edit one section without breaking others.

   EDIT GUIDE (when ma'am asks to change something):
   1. PRODUCTS + PRICES     → Section A  (const P)
   2. PRODUCT IMAGES        → Section B  (const PH)
   3. MARKETS               → Section C  (const M)
   4. ENGLISH / BANGLA TEXT → Section D  (const T)
   5. COLORS                → css/style.css  (:root variables)
   ============================================================ */

/* ---------- helpers ---------- */
const $ = (s) => document.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
let L = "en"; // current language: "en" or "bn"

/* ---------- Backend API helper (full-stack) ---------- */
const API = "/api";
async function api(path, opts = {}) {
  try {
    const res = await fetch(API + path, {
      headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
      ...opts,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || res.statusText);
    return data;
  } catch (err) {
    console.warn("API:", err.message);
    throw err;
  }
}



/* ============================================================
   SECTION A — PRODUCTS & PRICES (edit this most often)
   Format of each item:
   [ id, English name, Bangla name, emoji, unit, price BDT, gradient, category ]
   Categories: st = Staples, ve = Vegetables, pr = Protein, dy = Dairy
   Prices = Dhaka kitchen-market mid points (Oct 2026)
   ============================================================ */
const P = [
  // --- Staples (মুদি) ---  [id, English, বাংলা, emoji, unit, price৳, gradient, category]
  ["rice",    "Rice (Miniket)",  "মিনিকেট চাল",   "🍚", "kg",     75, "#fff3cf,#f0cf75", "st"],
  ["oil",     "Soybean oil",     "সয়াবিন তেল",   "🫙", "L",     192, "#fff1a8,#f2c744", "st"],

  // --- Vegetables (সবজি) ---
  ["potato",  "Potato",          "আলু",           "🥔", "kg",     30, "#f3e2c8,#cf9f66", "ve"],
  ["onion",   "Onion",           "পেঁয়াজ",       "🧅", "kg",     60, "#f7dbe6,#d98aa8", "ve"],
  ["tomato",  "Tomato",          "টমেটো",         "🍅", "kg",    160, "#ffd9d2,#ee7d6c", "ve"],
  ["chili",   "Green chili",     "কাঁচা মরিচ",    "🌶️", "kg",    130, "#dcf2c9,#7cc06a", "ve"],

  // --- Protein (প্রোটিন) ---
  ["egg",     "Egg",             "ডিম",           "🥚", "dozen", 145, "#f5eee2,#dccbb0", "pr"],
  ["chicken", "Broiler chicken", "ব্রয়লার মুরগি", "🍗", "kg",    185, "#ffe4cf,#e7975a", "pr"],
  ["fish",    "Rui fish",        "রুই মাছ",       "🐟", "kg",    420, "#d3ecfa,#71b5e0", "pr"],
  ["ilish",   "Ilish (Hilsa)",   "ইলিশ মাছ",      "🐠", "kg",   1500, "#d4eefc,#5a9fc9", "pr"],

  // --- Dairy (দুধ) ---
  ["milk",    "Milk",            "দুধ",           "🥛", "L",      90, "#e6f1fb,#a9c9ea", "dy"],
];

/* Category labels: [English, Bangla] */
const C = {
  st: ["Staples", "মুদি"],
  ve: ["Vegetables", "সবজি"],
  pr: ["Protein", "প্রোটিন"],
  dy: ["Dairy", "দুধ"],
};

/* ============================================================
   SECTION B — PRODUCT IMAGES
   Put your photos in the /image folder with these file names.
   Or paste any https:// image URL instead.
   ============================================================ */
const PH = {
  // ORIGINAL images — put files in image/ folder with these exact names
  rice:    "image/rice.jpg",
  oil:     "image/oil.jpg",
  potato:  "image/potato.jpg",
  onion:   "image/onion.jpg",
  tomato:  "image/tomato.jpg",
  chili:   "image/chili.jpg",
  egg:     "image/egg.jpg",
  chicken: "image/chicken.jpg",
  fish:    "image/fish.jpg",
  ilish:   "image/ilish.jpg",
  milk:    "image/milk.jpg",
};

/* Market photos (optional — same idea) */
const MK = [
  // Local market images (put files in /image/markets folder)
  "image/markets/karwan.jpg",
  "image/markets/new-market.jpg",
  "image/markets/shantinagar.jpg",
  "image/markets/chawkbazar.jpg",
];

/* If image fails to load, hide it so emoji/gradient shows underneath */
window.fb = (el) => { el.style.display = "none"; };

/* ============================================================
   SECTION C — MARKETS
   [ English name, Bangla name, price multiplier, emoji, gradient ]
   0.95 = 5% cheaper, 1.04 = 4% costlier than base price
   ============================================================ */
const M = [
  ["Karwan Bazar",  "কারওয়ান বাজার", 0.95, "🏬", "#cfe8d5,#7fc79a"],
  ["New Market",    "নিউ মার্কেট",     1.04, "🛍️", "#e3d7f5,#a98fdc"],
  ["Shantinagar",   "শান্তিনগর",       1.00, "🏪", "#d5e6fb,#7fb0ea"],
  ["Chawkbazar",    "চকবাজার",         0.98, "🕌", "#fbe0cf,#eea67a"],
];

/* ============================================================
   SECTION D — LANGUAGE TEXT (English + Bangla)
   Change any button / heading text here.
   ============================================================ */
const T = {
  en: {
    nP: "Prices", nC: "Compare", nT: "Trends", nS: "Smart Buy", nJ: "Contribute",
    upd: "Prices updated today", tbCol: "Become a data collector",
    login: "Log in", reg: "Register",
    hh: "Know the price before you leave home.",
    hp: "Daily grocery prices from four Dhaka markets, side by side, with trends and a budget planner.",
    search: "Search",
    hP: "Today's market prices", pP: "Lowest price found across all markets. Prices in ৳ per unit.",
    hC: "Compare markets", pC: "Pick a product and see which bazaar sells it cheapest today.",
    hT: "Price trend, last 7 days", pT: "See whether a price is rising or falling before you buy.",
    hS: "Smart recommendation", pS: "Set a budget and quantities. We find the cheapest market for each item.",
    hJ: "Add a price or set an alert", pJ: "Collectors submit prices for admin review. Anyone can ask to be told when a price drops.",
    hCo: "Submit a price", hAl: "Price alert",
    lProd: "Product", lMk: "Market", lPr: "Price (৳)", lDt: "Date", lNm: "Full name",
    lEm: "Email", lPh: "Mobile", lPhO: "Mobile (optional)",
    lTg: "Alert me when the price falls to (৳)", lBud: "Budget (৳)",
    lQty: "Quantity of each item (kg / L / dozen)", lPw: "Password", lCp: "Confirm password",
    lRole: "I am a", rU: "General user", rC: "Data collector", agree: "I agree to the terms",
    calc: "Find best plan", sub: "Send for review", setA: "Set alert",
    all: "All items", sN: "Name", sL: "Lowest price", sH: "Highest price", cmp: "Compare markets",
    none: "No products match your search.", cheap: "Cheapest", from: "at", rng: "Range",
    day: "Item", qty: "Qty", mk: "Market", cost: "Cost", tot: "Estimated total",
    ok: "Within budget. You keep ৳", over: "Over budget by ৳", tip: "Try reducing",
    oneM: "Buying everything at one market (",
  },
  bn: {
    nP: "বাজারদর", nC: "তুলনা", nT: "মূল্যধারা", nS: "স্মার্ট সুপারিশ", nJ: "অবদান",
    upd: "আজকের দাম হালনাগাদ", tbCol: "ডেটা কালেক্টর হোন",
    login: "লগইন", reg: "নিবন্ধন",
    hh: "বাড়ি থেকে বের হওয়ার আগেই দাম জানুন।",
    hp: "ঢাকার চারটি বাজারের দৈনিক দাম, তুলনা, ট্রেন্ড আর বাজেট পরিকল্পনা—এক জায়গায়।",
    search: "খুঁজুন",
    hP: "আজকের বাজারদর", pP: "সব বাজারের মধ্যে সর্বনিম্ন দাম। দাম ৳ প্রতি একক।",
    hC: "বাজার তুলনা", pC: "পণ্য বেছে দেখুন কোন বাজারে আজ সবচেয়ে সস্তা।",
    hT: "গত ৭ দিনের দামের ধারা", pT: "কেনার আগে দেখুন দাম বাড়ছে না কমছে।",
    hS: "স্মার্ট সুপারিশ", pS: "বাজেট ও পরিমাণ দিন, প্রতিটি পণ্যের সস্তা বাজার আমরা খুঁজে দেব।",
    hJ: "দাম জমা দিন বা অ্যালার্ট সেট করুন", pJ: "ডেটা কালেক্টর দাম জমা দেন, অ্যাডমিন যাচাই করেন। দাম কমলে জানতে অ্যালার্ট দিন।",
    hCo: "দাম জমা দিন", hAl: "প্রাইস অ্যালার্ট",
    lProd: "পণ্য", lMk: "বাজার", lPr: "দাম (৳)", lDt: "তারিখ", lNm: "পূর্ণ নাম",
    lEm: "ইমেইল", lPh: "মোবাইল", lPhO: "মোবাইল (ঐচ্ছিক)",
    lTg: "দাম কত হলে জানাব (৳)", lBud: "বাজেট (৳)",
    lQty: "প্রতিটি পণ্যের পরিমাণ (কেজি / লিটার / ডজন)", lPw: "পাসওয়ার্ড", lCp: "পাসওয়ার্ড নিশ্চিত করুন",
    lRole: "আমি একজন", rU: "সাধারণ ব্যবহারকারী", rC: "ডেটা কালেক্টর", agree: "আমি শর্তে সম্মত",
    calc: "সেরা পরিকল্পনা দেখুন", sub: "যাচাইয়ের জন্য পাঠান", setA: "অ্যালার্ট সেট করুন",
    all: "সব পণ্য", sN: "নাম", sL: "সর্বনিম্ন দাম", sH: "সর্বোচ্চ দাম", cmp: "বাজার তুলনা",
    none: "কোনো পণ্য পাওয়া যায়নি।", cheap: "সবচেয়ে সস্তা", from: "—", rng: "সীমা",
    day: "পণ্য", qty: "পরিমাণ", mk: "বাজার", cost: "খরচ", tot: "আনুমানিক মোট",
    ok: "বাজেটের মধ্যে। বাঁচবে ৳", over: "বাজেট ছাড়িয়েছে ৳", tip: "কমিয়ে দেখুন",
    oneM: "একই বাজারে সব কিনলে (",
  },
};

/* Form validation messages */
const E = {
  en: {
    req: "This field is required.",
    email: "Enter a valid email like name@example.com.",
    phone: "Enter a Bangladeshi mobile number, e.g. 01712345678.",
    pass: "Use 8+ characters with a letter and a number.",
    match: "Passwords do not match.",
    future: "Date cannot be in the future.",
    name: "Use letters only (2+ characters).",
    range: (a, b) => `Enter a value between ${a} and ${b}.`,
    items: "Choose at least one item with a quantity above 0.",
  },
  bn: {
    req: "এই ঘরটি পূরণ করুন।",
    email: "সঠিক ইমেইল দিন, যেমন name@example.com।",
    phone: "বাংলাদেশি মোবাইল নম্বর দিন, যেমন 01712345678।",
    pass: "কমপক্ষে ৮ অক্ষর, একটি অক্ষর ও একটি সংখ্যা দিন।",
    match: "পাসওয়ার্ড মিলছে না।",
    future: "ভবিষ্যতের তারিখ দেওয়া যাবে না।",
    name: "শুধু অক্ষর ব্যবহার করুন (কমপক্ষে ২টি)।",
    range: (a, b) => `${a} থেকে ${b} এর মধ্যে মান দিন।`,
    items: "অন্তত একটি পণ্যের পরিমাণ ০ এর বেশি দিন।",
  },
};

const t = (k) => T[L][k] || k;
const nm = (p) => (L === "bn" ? p[2] : p[1]);
const mn = (m) => (L === "bn" ? m[1] : m[0]);

/* Price for product i at market j */
const pr = (i, j) =>
  Math.round(P[i][5] * M[j][2] * (1 + (((i * 7 + j * 13) % 9) - 4) / 100));

/* 7-day series for charts */
const ser = (i, j) =>
  [...Array(7)].map((_, d) =>
    d === 6
      ? pr(i, j)
      : Math.round(pr(i, j) * (1 + 0.05 * Math.sin(d * 1.2 + i) - (6 - d) * 0.003))
  );

const best = (i) => {
  let b = 0;
  M.forEach((_, j) => {
    if (pr(i, j) < pr(i, b)) b = j;
  });
  return b;
};

const slug = (s) => s.toLowerCase().replace(/\s+/g, "-");

/* Build product / market image HTML */
const img = (g, e, src, alt) =>
  `<span class="pic" style="background:linear-gradient(140deg,${g})">` +
  `<svg viewBox="0 0 100 100" aria-hidden="true">` +
  `<circle cx="80" cy="20" r="28" fill="#fff" opacity=".3"/>` +
  `<circle cx="14" cy="92" r="26" fill="#fff" opacity=".18"/>` +
  `<text x="50" y="67" font-size="50" text-anchor="middle">${e}</text></svg>` +
  `<img src="${src}" alt="${alt}" loading="lazy" onerror="fb(this)"></span>`;

const pi = (i) => img(P[i][6], P[i][3], PH[P[i][0]] || "", P[i][1]);
const mi = (j) => img(M[j][4], M[j][3], MK[j] || "", M[j][0]);

const opts = (a, f) => a.map((x, i) => `<option value="${i}">${f(x)}</option>`).join("");

function fillSelects() {
  ["#cp", "#tp", "#cP", "#aP"].forEach((s) => {
    const e = $(s);
    const v = e.value;
    e.innerHTML = (s === "#cP" || s === "#aP" ? '<option value="">—</option>' : "") + opts(P, nm);
    e.value = v;
  });
  ["#tm"].forEach((s) => {
    const e = $(s);
    const v = e.value;
    e.innerHTML = opts(M, mn);
    e.value = v || 0;
  });
  const e = $("#cM");
  const v = e.value;
  e.innerHTML = '<option value="">—</option>' + opts(M, mn);
  e.value = v;
  const sort = $("#sort");
  const sv = sort.value;
  sort.innerHTML =
    `<option value="n">${t("sN")}</option>` +
    `<option value="l">${t("sL")}</option>` +
    `<option value="h">${t("sH")}</option>`;
  sort.value = sv || "n";
  const cat = $("#cat");
  const cv = cat.value;
  cat.innerHTML =
    `<option value="">${t("all")}</option>` +
    Object.entries(C)
      .map(([k, v]) => `<option value="${k}">${v[L === "bn" ? 1 : 0]}</option>`)
      .join("");
  cat.value = cv || "";
}

/* ---------- Home hero ---------- */
function hero() {
  // Change these numbers to show different products on the home mosaic
  $("#mos").innerHTML = [2, 4, 9, 7, 3, 8]
    .map((i) => {
      const b = best(i);
      return `<div class="t">${pi(i)}<b>৳${pr(i, b)}</b><small>${nm(P[i])}</small></div>`;
    })
    .join("");
  $("#chips").innerHTML = [2, 3, 4]
    .map((i) => `<button class="chip" data-q="${i}">${pi(i)}${nm(P[i])}</button>`)
    .join("");
}

/* ---------- Price grid ---------- */
function prices() {
  const q = ($("#q").value || "").toLowerCase().trim();
  const cat = $("#cat").value;
  const sort = $("#sort").value;
  let list = P.map((p, i) => i).filter((i) => {
    if (cat && P[i][7] !== cat) return false;
    if (!q) return true;
    return nm(P[i]).toLowerCase().includes(q) || P[i][1].toLowerCase().includes(q) || P[i][2].includes(q);
  });
  if (sort === "l") list.sort((a, b) => pr(a, best(a)) - pr(b, best(b)));
  if (sort === "h") list.sort((a, b) => pr(b, best(b)) - pr(a, best(a)));
  if (sort === "n") list.sort((a, b) => nm(P[a]).localeCompare(nm(P[b]), L === "bn" ? "bn" : "en"));
  $("#pg").innerHTML = list.length
    ? list
        .map((i) => {
          const b = best(i);
          const lo = pr(i, b);
          const hi = Math.max(...M.map((_, j) => pr(i, j)));
          return (
            `<article class="pc">` +
            `${pi(i)}<h3>${nm(P[i])}</h3>` +
            `<div class="u">${P[i][4]}</div>` +
            `<div class="pr"><b>৳${lo}</b><span class="dn">↓</span></div>` +
            `<div class="bm">${t("from")} ${mn(M[b])} · ${t("rng")} ৳${lo}–${hi}</div>` +
            `<button class="btn ghost" data-c="${i}">${t("cmp")}</button></article>`
          );
        })
        .join("")
    : `<p style="color:var(--mute)">${t("none")}</p>`;
}

/* ---------- Compare ---------- */
function compare() {
  const i = +$("#cp").value || 0;
  const o = M.map((_, j) => j).sort((a, b) => pr(i, a) - pr(i, b));
  const mx = pr(i, o[o.length - 1]);
  $("#cpic").innerHTML = pi(i);
  $("#cbars").innerHTML = o
    .map(
      (j, k) =>
        `<div class="row ${k ? "" : "best"}">${mi(j)}` +
        `<div><b style="font:600 16px 'Hind Siliguri'">${mn(M[j])}` +
        `${k ? "" : `<span class="tag">${t("cheap")}</span>`}</b>` +
        `<div class="bar"><i style="width:${(pr(i, j) / mx) * 100}%"></i></div></div>` +
        `<b>৳${pr(i, j)}</b></div>`
    )
    .join("");
}

/* ---------- Trend chart ---------- */
function trend() {
  const i = +$("#tp").value || 0;
  const j = +$("#tm").value || 0;
  const s = ser(i, j);
  const W = 700, H = 260, pad = 36;
  const min = Math.min(...s) * 0.96, max = Math.max(...s) * 1.04;
  const x = (d) => pad + (d / 6) * (W - pad * 2);
  const y = (v) => H - pad - ((v - min) / (max - min || 1)) * (H - pad * 2);
  const days =
    L === "bn"
      ? ["শনি", "রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র"]
      : ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  const pts = s.map((v, d) => `${x(d)},${y(v)}`).join(" ");
  $("#chart").innerHTML =
    `<polyline fill="none" stroke="var(--brand)" stroke-width="3" points="${pts}"/>` +
    s
      .map(
        (v, d) =>
          `<circle cx="${x(d)}" cy="${y(v)}" r="5" fill="var(--card)" stroke="var(--brand)" stroke-width="3">` +
          `<title>${days[d]}: ৳${v}</title></circle>` +
          `<text x="${x(d)}" y="${H - 14}" text-anchor="middle">${days[d]}</text>` +
          (d === 6 || v === Math.max(...s)
            ? `<text x="${x(d)}" y="${y(v) - 12}" text-anchor="middle" style="fill:var(--ink);font-weight:600">৳${v}</text>`
            : "")
      )
      .join("");
}

/* ---------- Smart basket ---------- */
function qtyGrid() {
  const old = $$("#rc input").map((e) => e.value);
  $("#rc").innerHTML = P.map(
    (p, i) =>
      `<label class="it">${pi(i)}` +
      `<span>${nm(p)}<br><small style="color:var(--mute)">${p[4]}</small></span>` +
      `<input type="number" min="0" max="50" step="0.5" value="${old[i] ?? ({ 2: 2, 3: 1, 4: 1 }[i] || 0)}" aria-label="${p[1]}"></label>`
  ).join("");
}

function reco() {
  const b = +$("#bud").value;
  const its = $$("#rc input")
    .map((e, i) => [i, +e.value || 0])
    .filter((x) => x[1] > 0);
  let tot = 0;
  const rows = its.map(([i, q]) => {
    const j = best(i);
    const c = pr(i, j) * q;
    tot += c;
    return { i, q, j, c };
  });
  const one = M.map((_, j) => [j, its.reduce((s, [i, q]) => s + pr(i, j) * q, 0)]).sort(
    (a, b) => a[1] - b[1]
  )[0];
  const ok = tot <= b;
  const top = [...rows].sort((a, b) => b.c - a.c)[0];
  $("#res").innerHTML =
    `<table>${rows
      .map(
        (r) =>
          `<tr><td>${pi(r.i)}</td><td>${nm(P[r.i])}<br>` +
          `<small style="color:var(--mute)">${r.q} ${P[r.i][4]} · ${mn(M[r.j])}</small></td>` +
          `<td>৳${r.c.toFixed(0)}</td></tr>`
      )
      .join("")}` +
    `<tr><td></td><td><b>${t("tot")}</b></td><td style="font-size:20px">৳${tot.toFixed(0)}</td></tr></table>` +
    `<div class="verdict ${ok ? "ok" : "no"}">` +
    (ok
      ? t("ok") + (b - tot).toFixed(0)
      : t("over") + (tot - b).toFixed(0) + ". " + t("tip") + " " + nm(P[top.i])) +
    `</div>` +
    `<p style="color:var(--mute);font-size:14px">${t("oneM")}${mn(M[one[0]])}): ৳${one[1].toFixed(0)}</p>`;
}

/* ---------- Validation ---------- */
const V = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),
  phone: (v) => /^(\+?88)?01[3-9]\d{8}$/.test(v.replace(/[\s-]/g, "")),
  pass: (v) => /^(?=.*\d)(?=.*[A-Za-z]).{8,}$/.test(v),
  name: (v) => /^[\p{L}\s.'-]{2,}$/u.test(v.trim()),
  match: (v) => v === $("#pw").value,
  date: (v) => new Date(v) <= new Date(),
};

function chk(el) {
  const v = el.type === "checkbox" ? (el.checked ? "1" : "") : el.value;
  let e = "";
  for (const r of el.dataset.v.split(",")) {
    if (r === "req") {
      if (!v.trim()) {
        e = "req";
        break;
      }
      continue;
    }
    if (!v.trim()) break;
    if (r === "num") {
      const n = +v;
      if (isNaN(n) || n < +el.min || n > +el.max) {
        e = E[L].range(el.min, el.max);
        break;
      }
    } else if (!V[r](v)) {
      e = E[L][r];
      break;
    }
  }
  const f = el.closest(".f");
  f.classList.toggle("bad", !!e);
  f.querySelector(".err").textContent = e === "req" ? E[L].req : e;
  el.setAttribute("aria-invalid", !!e);
  return !e;
}

function validate(form) {
  let bad = null;
  $$("[data-v]", form).forEach((el) => {
    if (el.closest("[hidden]")) return;
    if (!chk(el) && !bad) bad = el;
  });
  if (bad) bad.focus();
  return !bad;
}

document.addEventListener("focusout", (e) => {
  if (e.target.dataset && e.target.dataset.v && !e.target.closest("[hidden]")) chk(e.target);
});
document.addEventListener("change", (e) => {
  if (e.target.dataset && e.target.dataset.v) chk(e.target);
});

const toast = (m) => {
  const e = $("#toast");
  e.textContent = m;
  e.classList.add("show");
  setTimeout(() => e.classList.remove("show"), 3200);
};

$("#fS").onsubmit = async (e) => {
  e.preventDefault();
  const a = validate(e.target);
  const has = $$("#rc input").some((x) => +x.value > 0);
  $("#rcErr").textContent = has ? "" : E[L].items;
  if (!(a && has)) {
    $("#res").innerHTML = "";
    return;
  }
  // Try backend recommend API first; fallback to local reco()
  const items = $$("#rc input")
    .map((el, i) => ({ productId: P[i][0], qty: +el.value || 0 }))
    .filter((x) => x.qty > 0);
  try {
    const data = await api("/recommend", {
      method: "POST",
      body: JSON.stringify({ budget: +$("#bud").value, items }),
    });
    const ok = data.withinBudget;
    $("#res").innerHTML =
      `<table>${data.rows
        .map(
          (r) =>
            `<tr><td></td><td>${r.name}<br><small style="color:var(--mute)">${r.qty} ${r.unit} · ${r.market}</small></td>` +
            `<td>৳${r.cost.toFixed(0)}</td></tr>`
        )
        .join("")}` +
      `<tr><td></td><td><b>${t("tot")}</b></td><td style="font-size:20px">৳${data.total.toFixed(0)}</td></tr></table>` +
      `<div class="verdict ${ok ? "ok" : "no"}">` +
      (ok
        ? t("ok") + data.remaining.toFixed(0)
        : t("over") + Math.abs(data.remaining).toFixed(0)) +
      `</div>` +
      `<p style="color:var(--mute);font-size:13px">✓ ${L === "bn" ? "সার্ভার থেকে হিসাব" : "Calculated by server API"}</p>`;
  } catch {
    reco(); // local fallback if server down
  }
};

$("#fC").onsubmit = async (e) => {
  e.preventDefault();
  if (!validate(e.target)) return;
  const productIdx = +$("#cP").value;
  const marketIdx = +$("#cM").value;
  const marketIds = ["karwan", "newmarket", "shantinagar", "chawkbazar"];
  const body = {
    productId: P[productIdx] ? P[productIdx][0] : null,
    marketId: marketIds[marketIdx] || null,
    price: +$("#cPr").value,
    date: $("#cD").value,
    name: e.target.querySelector('input[autocomplete="name"]')?.value,
  };
  try {
    await api("/submissions", { method: "POST", body: JSON.stringify(body) });
    e.target.reset();
    toast(L === "bn" ? "ধন্যবাদ! সার্ভারে জমা হয়েছে।" : "Thanks! Saved on the server for review.");
  } catch (err) {
    toast(L === "bn" ? "সার্ভার চালু আছে কি? npm start চালান।" : "Is the server running? Use npm start.");
  }
};

$("#fA").onsubmit = async (e) => {
  e.preventDefault();
  if (!validate(e.target)) return;
  const productIdx = +$("#aP").value;
  const inputs = [...e.target.querySelectorAll("input,select")];
  const body = {
    productId: P[productIdx] ? P[productIdx][0] : null,
    targetPrice: +inputs.find((x) => x.type === "number")?.value,
    email: inputs.find((x) => x.type === "email")?.value,
    phone: inputs.find((x) => x.placeholder && x.placeholder.includes("017"))?.value || null,
  };
  try {
    await api("/alerts", { method: "POST", body: JSON.stringify(body) });
    e.target.reset();
    toast(L === "bn" ? "অ্যালার্ট সার্ভারে সেভ হয়েছে।" : "Alert saved on the server.");
  } catch (err) {
    toast(L === "bn" ? "সার্ভার চালু আছে কি? npm start চালান।" : "Is the server running? Use npm start.");
  }
};

/* ---------- Login modal ---------- */
let reg = false;
const mode = (r) => {
  reg = r;
  $("#tL").setAttribute("aria-pressed", !r);
  $("#tR").setAttribute("aria-pressed", r);
  $$(".rg").forEach((x) => (x.hidden = !r));
  $("#pw").autocomplete = r ? "new-password" : "current-password";
  $("#dgo").textContent = t(r ? "reg" : "login");
  $("#dt").textContent =
    L === "bn" ? (r ? "অ্যাকাউন্ট খুলুন" : "স্বাগতম") : r ? "Create your account" : "Welcome back";
  $$(".err", $("#fL")).forEach((x) => (x.textContent = ""));
  $$(".bad").forEach((x) => x.classList.remove("bad"));
};
$("#openLogin").onclick = () => {
  mode(false);
  $("#dlg").showModal();
};
$("#cx").onclick = () => $("#dlg").close();
$("#tL").onclick = () => mode(false);
$("#tR").onclick = () => mode(true);
$("#fL").onsubmit = async (e) => {
  e.preventDefault();
  if (!validate(e.target)) return;
  const email = e.target.querySelector('input[type="email"]')?.value;
  const password = $("#pw")?.value;
  try {
    if (reg) {
      const nameInput = e.target.querySelector(".rg input[data-v*=\"name\"], .rg input[autocomplete=\"name\"]");
      const phoneInput = e.target.querySelector(".rg input[data-v*=\"phone\"]");
      const roleSelect = e.target.querySelector(".rg select");
      const name = nameInput?.value || "";
      const phone = phoneInput?.value || "";
      const role = roleSelect && roleSelect.selectedIndex === 1 ? "collector" : "user";
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, phone, password, role }),
      });
      toast(L === "bn" ? "অ্যাকাউন্ট সার্ভারে তৈরি হয়েছে!" : "Account created on server!");
    } else {
      await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      toast(L === "bn" ? "লগইন সফল!" : "You are logged in.");
    }
    $("#dlg").close();
    e.target.reset();
  } catch (err) {
    toast(err.message || (L === "bn" ? "লগইন ব্যর্থ — সার্ভার চালু আছে কি?" : "Login failed — is the server running?"));
  }
};

/* ---------- Navigation menus ---------- */
const BK = {
  b1: { bud: 1000, q: { 2: 2, 3: 1, 4: 1 } },
  b2: { bud: 3000, q: { 0: 5, 1: 1, 2: 2, 3: 1, 6: 1, 7: 1 } },
};

function menus() {
  const bn = L === "bn";
  const s = (a, b) => (bn ? b : a);
  const em = (e, a, b) =>
    `<button class="mi" data-act="${a}"><em>${e}</em><span>${b}</span></button>`;
  $("#mPr").innerHTML = Object.entries(C)
    .map(
      ([k, v]) =>
        `<div class="mc"><button class="mh" data-cat="${k}">${v[+bn]}</button>` +
        P.map((p, i) =>
          p[7] === k
            ? `<button class="mi" data-pi="${i}">${pi(i)}<span>${nm(p)}<small>৳${pr(i, best(i))} / ${p[4]}</small></span></button>`
            : ""
        ).join("") +
        `</div>`
    )
    .join("");
  $("#mCm").innerHTML = [2, 3, 4, 0, 9, 7]
    .map(
      (i) =>
        `<button class="mi" data-cmp="${i}">${pi(i)}<span>${nm(P[i])}<small>${s("Best", "সেরা")} ৳${pr(i, best(i))}</small></span></button>`
    )
    .join("");
  $("#mTr").innerHTML = M.map(
    (m, j) =>
      `<button class="mi" data-tm="${j}">${mi(j)}<span>${mn(m)}<small>${s("7-day trend", "৭ দিনের ধারা")}</small></span></button>`
  ).join("");
  $("#mSm").innerHTML =
    em("🧮", "sm", s("Budget planner", "বাজেট প্ল্যানার")) +
    em("🥔", "b1", s("Quick basket, ৳1,000", "দ্রুত ঝুড়ি, ৳১,০০০")) +
    em("🧺", "b2", s("Family basket, ৳3,000", "পারিবারিক ঝুড়ি, ৳৩,০০০"));
  $("#mJn").innerHTML =
    em("📝", "sp", s("Submit a price", "দাম জমা দিন")) +
    em("🔔", "sa", s("Set a price alert", "প্রাইস অ্যালার্ট")) +
    em("👤", "reg", s("Create an account", "অ্যাকাউন্ট খুলুন"));
}

function sub() {
  const c = $("#cat").value;
  const bn = L === "bn";
  $("#subc").innerHTML = [
    ["", t("all"), 0, P.length],
    ...Object.entries(C).map(([k, v], n) => [
      k,
      v[+bn],
      [0, 2, 6, 10][n],
      P.filter((p) => p[7] === k).length,
    ]),
  ]
    .map(
      ([k, n, i, ct]) =>
        `<button class="sc${k === c ? " on" : ""}" data-sc="${k}">` +
        `${k ? pi(i) : "<em>🧺</em>"}<span>${n}</span><small>${ct}</small></button>`
    )
    .join("");
}

function tbd() {
  $("#tbd").textContent = new Date().toLocaleDateString(L === "bn" ? "bn-BD" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

const closeAll = () => {
  $$(".dd").forEach((d) => d.classList.add("shut"));
  $$(".dd.open").forEach((d) => {
    d.classList.remove("open");
    d.querySelector(".cb").setAttribute("aria-expanded", false);
  });
  $("#links").classList.remove("open");
  $("#burger").textContent = "☰";
  $("#burger").setAttribute("aria-expanded", false);
  if (document.activeElement) document.activeElement.blur();
};

/* ---------- Page navigation (no long scroll) ---------- */
const PAGES = ["home", "prices", "compare", "trends", "smart", "join"];

function goPage(id) {
  if (!id || id === "top") id = "home";
  id = id.replace(/^#/, "");
  if (!PAGES.includes(id)) id = "home";
  $$(".page").forEach((p) => p.classList.toggle("active", p.id === "page-" + id));
  $$(".links a.tl").forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + id));
  const subEl = $("#subc");
  if (subEl) subEl.style.display = id === "prices" ? "flex" : "none";
  window.scrollTo({ top: 0, behavior: "instant" });
  history.replaceState(null, "", "#" + id);
}

$("#links").addEventListener("click", (e) => {
  const b = e.target.closest("button,a");
  if (!b) return;
  const d = b.dataset;
  let go = null;
  if (b.classList.contains("cb")) {
    const dd = b.closest(".dd");
    const o = !dd.classList.contains("open");
    $$(".dd.open").forEach((x) => x.classList.remove("open"));
    dd.classList.toggle("open", o);
    b.setAttribute("aria-expanded", o);
    return;
  }
  if (d.cat !== undefined) {
    $("#cat").value = d.cat;
    $("#q").value = "";
    prices();
    sub();
    go = "#prices";
  } else if (d.pi) {
    $("#cat").value = "";
    $("#q").value = nm(P[d.pi]);
    prices();
    sub();
    go = "#prices";
  } else if (d.cmp) {
    $("#cp").value = d.cmp;
    compare();
    go = "#compare";
  } else if (d.tm) {
    $("#tm").value = d.tm;
    trend();
    go = "#trends";
  } else if (d.act === "reg") {
    mode(true);
    $("#dlg").showModal();
  } else if (d.act === "sm") go = "#smart";
  else if (d.act && BK[d.act]) {
    const k = BK[d.act];
    $("#bud").value = k.bud;
    $$("#rc input").forEach((x, i) => (x.value = k.q[i] || 0));
    $("#fS").requestSubmit();
    go = "#smart";
  } else if (d.act) {
    go = "#join";
    setTimeout(() => $(d.act === "sp" ? "#cP" : "#aP").focus({ preventScroll: true }), 500);
  }
  if (go) goPage(go);
  if (go || d.act || b.tagName === "A") closeAll();
});

$$(".dd").forEach((d) => d.addEventListener("mouseleave", () => d.classList.remove("shut")));
document.addEventListener("click", (e) => {
  if (!e.target.closest(".dd")) $$(".dd.open").forEach((d) => d.classList.remove("open"));
});

$("#subc").onclick = (e) => {
  const b = e.target.closest("[data-sc]");
  if (b) {
    $("#cat").value = b.dataset.sc;
    $("#q").value = "";
    prices();
    sub();
    goPage("prices");
  }
};
$("#cat").addEventListener("input", sub);

/* ---------- Language switch ---------- */
function setL(l) {
  L = l;
  document.documentElement.lang = l === "bn" ? "bn" : "en";
  $("#bE").setAttribute("aria-pressed", l === "en");
  $("#bB").setAttribute("aria-pressed", l === "bn");
  $$("[data-t]").forEach((e) => {
    if (e.id === "dgo") return;
    e.textContent = t(e.dataset.t);
  });
  $("#hs").placeholder = $("#q").placeholder =
    l === "bn" ? "আলু, potato…" : "Search potato, আলু…";
  fillSelects();
  hero();
  prices();
  compare();
  trend();
  qtyGrid();
  menus();
  sub();
  tbd();
  if ($("#res").innerHTML) reco();
  mode(reg);
}
$("#bE").onclick = () => setL("en");
$("#bB").onclick = () => setL("bn");

/* ---------- Event wiring ---------- */
["q", "cat", "sort"].forEach((k) => $("#" + k).addEventListener("input", prices));
["cp"].forEach((k) => ($("#" + k).onchange = compare));
["tp", "tm"].forEach((k) => ($("#" + k).onchange = trend));

$("#pg").onclick = (e) => {
  const b = e.target.closest("[data-c]");
  if (b) {
    $("#cp").value = b.dataset.c;
    $("#tp").value = b.dataset.c;
    compare();
    trend();
    goPage("compare");
  }
};

const goSearch = () => {
  $("#q").value = $("#hs").value;
  prices();
  goPage("prices");
};
$("#hgo").onclick = goSearch;
$("#hs").onkeydown = (e) => e.key === "Enter" && goSearch();
$("#chips").onclick = (e) => {
  const c = e.target.closest("[data-q]");
  if (c) {
    $("#q").value = nm(P[c.dataset.q]);
    prices();
    goPage("prices");
  }
};
$("#burger").onclick = () => {
  const o = $("#links").classList.toggle("open");
  $("#burger").setAttribute("aria-expanded", o);
  $("#burger").textContent = o ? "✕" : "☰";
};

/* ---------- Start app ---------- */
$("#cD").max = new Date().toISOString().slice(0, 10);
setL("en");
reco();

document.querySelector(".logo").addEventListener("click", (e) => {
  e.preventDefault();
  goPage("home");
});
const hm = document.querySelector(".hm");
if (hm)
  hm.addEventListener("click", (e) => {
    e.preventDefault();
    goPage("join");
  });
$$(".links a.tl").forEach((a) =>
  a.addEventListener("click", (e) => {
    e.preventDefault();
    goPage(a.getAttribute("href"));
  })
);
goPage((location.hash || "#home").slice(1) || "home");
window.addEventListener("hashchange", () =>
  goPage((location.hash || "#home").slice(1) || "home")
);
