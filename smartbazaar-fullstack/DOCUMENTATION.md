# SmartBazaar – Technical Documentation

## 1. Overview
SmartBazaar is a full-stack web application for checking daily grocery prices across four major Dhaka markets. It combines a bilingual frontend with a lightweight Node.js backend.

## 2. Architecture
Browser (index.html + js/app.js)  <-->  Express Server (server/index.js)
- Static files + JSON API on the same origin
- In-memory store + optional JSON file persistence

## 3. Data Model
- Products: id, English/Bangla name, unit, base price, category
- Markets: id, name, price multiplier (0.95 – 1.04)
- Users, Submissions, Alerts stored on server

## 4. Recommendation Engine
POST /api/recommend receives {budget, items: [{productId, qty}]}
For each item it picks the cheapest market, calculates total and remaining budget.

## 5. Frontend Structure (js/app.js)
- Section A: Products + prices
- Section B: Product images
- Section C: Markets
- Section D: Language strings (EN + BN)
- api() helper for all backend calls
- Graceful fallback if server is offline

## 6. Security Notes
Passwords stored in plain text for academic demo only. Production should use bcrypt + JWT.

## 7. Running
npm install && npm start → http://localhost:3000
