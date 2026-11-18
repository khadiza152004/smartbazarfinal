# SmartBazaar – Viva Cheatsheet

**What is it?** Full-stack grocery price comparison for 4 Dhaka markets + budget planner + community features. Bilingual.

**Why full-stack?** To persist submissions, alerts and user accounts. Frontend alone cannot do that reliably.

**Tech?** HTML/CSS/Vanilla JS + Node/Express. Data in memory + store.json.

**Smart Buy?** Frontend POSTs to /api/recommend. Server picks cheapest market per item. Falls back to local calculation if server down.

**Markets?** Karwan (0.95), New Market (1.04), Shantinagar (1.00), Chawkbazar (0.98).

**How to run?** npm install && npm start → localhost:3000

**Main files?** js/app.js (frontend), server/index.js (API)

**Limitations?** No real DB, plain-text passwords (demo only), static prices.

**Strengths?** Real problem, clean code, bilingual, easy demo.
