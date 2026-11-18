/**
 * SmartBazaar Tracker – Backend
 * Simple Express API that powers the frontend (recommend, submissions, alerts, auth).
 * Data is kept in memory + optional JSON file persistence so it works offline / for viva.
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

// ---------- Seed data (same as frontend) ----------
const PRODUCTS = [
  { id: "rice",    nameEn: "Rice (Miniket)",  nameBn: "মিনিকেট চাল",   unit: "kg",     basePrice: 75,  category: "st" },
  { id: "oil",     nameEn: "Soybean oil",     nameBn: "সয়াবিন তেল",   unit: "L",     basePrice: 192, category: "st" },
  { id: "potato",  nameEn: "Potato",          nameBn: "আলু",           unit: "kg",     basePrice: 30,  category: "ve" },
  { id: "onion",   nameEn: "Onion",           nameBn: "পেঁয়াজ",       unit: "kg",     basePrice: 60,  category: "ve" },
  { id: "tomato",  nameEn: "Tomato",          nameBn: "টমেটো",         unit: "kg",     basePrice: 160, category: "ve" },
  { id: "chili",   nameEn: "Green chili",     nameBn: "কাঁচা মরিচ",    unit: "kg",     basePrice: 130, category: "ve" },
  { id: "egg",     nameEn: "Egg",             nameBn: "ডিম",           unit: "dozen",  basePrice: 145, category: "pr" },
  { id: "chicken", nameEn: "Broiler chicken", nameBn: "ব্রয়লার মুরগি", unit: "kg",     basePrice: 185, category: "pr" },
  { id: "fish",    nameEn: "Rui fish",        nameBn: "রুই মাছ",       unit: "kg",     basePrice: 420, category: "pr" },
  { id: "ilish",   nameEn: "Ilish (Hilsa)",   nameBn: "ইলিশ মাছ",      unit: "kg",     basePrice: 1500,category: "pr" },
  { id: "milk",    nameEn: "Milk",            nameBn: "দুধ",           unit: "L",      basePrice: 90,  category: "dy" },
];

const MARKETS = [
  { id: "karwan",     nameEn: "Karwan Bazar",  nameBn: "কারওয়ান বাজার",  multiplier: 0.95 },
  { id: "newmarket",  nameEn: "New Market",    nameBn: "নিউ মার্কেট",     multiplier: 1.04 },
  { id: "shantinagar",nameEn: "Shantinagar",   nameBn: "শান্তিনগর",       multiplier: 1.00 },
  { id: "chawkbazar", nameEn: "Chawkbazar",    nameBn: "চকবাজার",         multiplier: 0.98 },
];

// ---------- In-memory store ----------
let store = {
  users: [],
  submissions: [],
  alerts: [],
};

// Load / save helpers
function loadStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (fs.existsSync(DATA_FILE)) {
      store = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
      console.log("Loaded store from disk");
    }
  } catch (e) {
    console.warn("Could not load store:", e.message);
  }
}

function saveStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
  } catch (e) {
    console.warn("Could not save store:", e.message);
  }
}

loadStore();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Serve frontend static files
const publicDir = path.join(__dirname, "..");
app.use(express.static(publicDir));

// ---------- Helpers ----------
function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function findMarket(id) {
  return MARKETS.find((m) => m.id === id);
}

function priceAtMarket(productId, marketId) {
  const p = findProduct(productId);
  const m = findMarket(marketId);
  if (!p || !m) return null;
  return Math.round(p.basePrice * m.multiplier);
}

// ---------- API Routes ----------

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "SmartBazaar API is running",
    products: PRODUCTS.length,
    markets: MARKETS.length,
    users: store.users.length,
    submissions: store.submissions.length,
    alerts: store.alerts.length,
  });
});

// List products (optional – frontend already has them)
app.get("/api/products", (req, res) => {
  res.json(PRODUCTS);
});

// List markets
app.get("/api/markets", (req, res) => {
  res.json(MARKETS);
});

// GET current prices matrix
app.get("/api/prices", (req, res) => {
  const matrix = PRODUCTS.map((p) => ({
    id: p.id,
    nameEn: p.nameEn,
    nameBn: p.nameBn,
    unit: p.unit,
    prices: MARKETS.map((m) => ({
      marketId: m.id,
      marketName: m.nameEn,
      price: Math.round(p.basePrice * m.multiplier),
    })),
  }));
  res.json(matrix);
});

/**
 * POST /api/recommend
 * Body: { budget: number, items: [{ productId, qty }] }
 * Returns cheapest combination across markets
 */
app.post("/api/recommend", (req, res) => {
  try {
    const { budget = 0, items = [] } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items array is required" });
    }

    const rows = [];
    let total = 0;

    for (const item of items) {
      const product = findProduct(item.productId);
      if (!product || !item.qty || item.qty <= 0) continue;

      // Find cheapest market for this product
      let bestMarket = null;
      let bestPrice = Infinity;

      for (const m of MARKETS) {
        const price = Math.round(product.basePrice * m.multiplier);
        if (price < bestPrice) {
          bestPrice = price;
          bestMarket = m;
        }
      }

      const cost = bestPrice * item.qty;
      total += cost;

      rows.push({
        productId: product.id,
        name: product.nameEn,
        qty: item.qty,
        unit: product.unit,
        market: bestMarket ? bestMarket.nameEn : "—",
        unitPrice: bestPrice,
        cost,
      });
    }

    const remaining = budget - total;
    const withinBudget = remaining >= 0;

    res.json({
      withinBudget,
      total: Math.round(total * 100) / 100,
      remaining: Math.round(remaining * 100) / 100,
      rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Recommendation failed" });
  }
});

/**
 * POST /api/submissions
 * Community price reports
 */
app.post("/api/submissions", (req, res) => {
  try {
    const { productId, marketId, price, date, name } = req.body || {};
    if (!productId || !marketId || price == null) {
      return res.status(400).json({ error: "productId, marketId and price are required" });
    }

    const entry = {
      id: uuidv4(),
      productId,
      marketId,
      price: Number(price),
      date: date || new Date().toISOString().slice(0, 10),
      name: name || "Anonymous",
      createdAt: new Date().toISOString(),
    };

    store.submissions.push(entry);
    saveStore();

    res.status(201).json({ ok: true, message: "Submission received", id: entry.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save submission" });
  }
});

// List submissions (for admin / demo)
app.get("/api/submissions", (req, res) => {
  res.json(store.submissions.slice(-50).reverse());
});

/**
 * POST /api/alerts
 * Price drop alerts
 */
app.post("/api/alerts", (req, res) => {
  try {
    const { productId, targetPrice, email } = req.body || {};
    if (!productId || targetPrice == null) {
      return res.status(400).json({ error: "productId and targetPrice are required" });
    }

    const entry = {
      id: uuidv4(),
      productId,
      targetPrice: Number(targetPrice),
      email: email || null,
      createdAt: new Date().toISOString(),
      active: true,
    };

    store.alerts.push(entry);
    saveStore();

    res.status(201).json({ ok: true, message: "Alert saved", id: entry.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save alert" });
  }
});

app.get("/api/alerts", (req, res) => {
  res.json(store.alerts.filter((a) => a.active));
});

/**
 * Auth – very simple (no real hashing for student demo)
 * In a real project use bcrypt + JWT.
 */
app.post("/api/auth/register", (req, res) => {
  try {
    const { name, email, phone, password, role = "user" } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    if (store.users.find((u) => u.email === email.toLowerCase())) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const user = {
      id: uuidv4(),
      name: name || "",
      email: email.toLowerCase(),
      phone: phone || "",
      password, // demo only – do NOT store plain text in production
      role: role === "collector" ? "collector" : "user",
      createdAt: new Date().toISOString(),
    };

    store.users.push(user);
    saveStore();

    res.status(201).json({
      ok: true,
      message: "Account created",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = store.users.find(
      (u) => u.email === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Fake token for demo
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");

    res.json({
      ok: true,
      message: "Logged in",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Catch-all → serve index.html (for SPA-style routing if needed)
app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`\n🚀 SmartBazaar running at  http://localhost:${PORT}`);
  console.log(`   API health:              http://localhost:${PORT}/api/health`);
  console.log(`   Frontend + API together\n`);
});
