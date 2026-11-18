# SmartBazaar Tracker

**Know the price before you leave home.**

A full-stack web application that shows daily grocery prices from four major Dhaka markets (Karwan Bazar, New Market, Shantinagar, Chawkbazar), lets users compare prices, plan a budget, submit new prices, and set price alerts.

## Features

- Price listing – Lowest price across markets for each product
- Market comparison – Side-by-side prices for any product
- Smart Buy / Budget planner – Enter quantities + budget → server finds the cheapest combination
- Community submissions – Users can report prices (saved on server)
- Price alerts – Get notified when a product drops below a target price
- Login / Register – Simple auth (collector vs normal user role)
- Bilingual – English + Bangla (বাংলা)

## Tech Stack

- Frontend: HTML, CSS, Vanilla JS
- Backend: Node.js + Express
- Storage: In-memory + JSON file
- Deployment: Netlify (static) / local Node

## Project Structure

```
smartbazaar/
├── css/style.css
├── image/                  # Product & market photos
├── js/app.js
├── server/index.js         # Express API
├── index.html
├── package.json
├── README.md
├── DOCUMENTATION.md
├── PRESENTATION.md
└── VIVA_CHEATSHEET.md
```

## How to Run Locally

```bash
npm install
npm start
```

Open **http://localhost:3000**

## API Endpoints

| Method | Path                  | Description                    |
|--------|-----------------------|--------------------------------|
| GET    | /api/health           | Server status                  |
| GET    | /api/products         | List of products               |
| GET    | /api/markets          | List of markets                |
| GET    | /api/prices           | Full price matrix              |
| POST   | /api/recommend        | Budget recommendation engine   |
| POST   | /api/submissions      | Submit a price report          |
| POST   | /api/alerts           | Create a price alert           |
| POST   | /api/auth/register    | Create account                 |
| POST   | /api/auth/login       | Login                          |

Made for academic project / viva demonstration.
