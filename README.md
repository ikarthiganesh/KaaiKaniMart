# KaaiKaniMart — local fruits & vegetables store

A runnable local-first shopping website built with **React + Vite**, **Node.js + Express**, and **SQLite**. SQLite is an SQL database stored in a local file, using Node.js’ built-in `node:sqlite` driver. No native database addon or Visual Studio C++ build tools are needed.

## Requirements
- Node.js 22 LTS (includes npm; this project uses the built-in `node:sqlite` driver)
- Windows 10/11

## Run it

**Important:** Use the `KaaiKaniMart-Images-Fixed` project folder and Node.js 22 LTS. This version does not depend on `better-sqlite3`.

### 1. Start the backend
Open PowerShell in the project folder:

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run dev
```

Backend runs at `http://localhost:5000`. On first start it creates `database/kaaikanimart.db`, creates the tables and seeds 100 products.

### 2. Start the frontend
Open a **second** PowerShell window:

```powershell
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (normally `http://localhost:5173`).

## Admin
- Open the Admin link at the bottom of the website.
- First-run demo credentials: `admin` / `ChangeMe123!`
- Change `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `JWT_SECRET` in `backend/.env` before real use. The default account is created only when the database has no admin account. Passwords are bcrypt-hashed in SQLite.
- This is a local development starter. Before public production deployment, use HTTPS, a strong unique JWT secret, backups, rate limiting, and a managed hosting/database setup.

## Features
- 50 fruit and 50 vegetable products, Tamil + English names, editable sample prices, stock and availability.
- Tamil/English toggle (Tamil default), search and category browsing.
- Cart saved in browser local storage; checkout verifies stock and prices on the server.
- Checkout restricted in both frontend and backend to Chettikulam, Perumanel, Srirenganarayanapuram, AnuVijay Township, Pudumanai.
- Cash on Delivery only; no fake online payment flow.
- Order lookup requires both order number and the same mobile number used at checkout.
- Admin can view orders, update order status, edit prices/stock/availability and shop settings.
- Orders and products persist in a local SQLite database.

## Notes
- Prices and stock are illustrative sample values, not live market rates.
- Product photos use stable Unsplash image URLs and may require an internet connection. If a remote photo fails, a colored product fallback is shown.
- The API and UI are configured for local development. Do not expose the demo credentials or local database publicly.
