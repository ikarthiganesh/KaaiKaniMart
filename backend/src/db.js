import { DatabaseSync } from "node:sqlite";
import bcrypt from "bcryptjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { allProducts, villages } from "./seed.js";
import "dotenv/config";

// Uses Node.js' built-in SQLite driver, so npm does not need to compile native addons.
const here = path.dirname(fileURLToPath(import.meta.url));
const nativeDb = new DatabaseSync(path.resolve(here, "../../database/kaaikanimart.db"));
nativeDb.exec("PRAGMA foreign_keys = ON;");
nativeDb.exec("PRAGMA journal_mode = WAL;");

// Keep a small better-sqlite3-compatible surface for the existing API code.
const db = {
  exec(sql) {
    return nativeDb.exec(sql);
  },
  prepare(sql) {
    const statement = nativeDb.prepare(sql);
    return {
      get(...args) {
        return statement.get(...args);
      },
      all(...args) {
        return statement.all(...args);
      },
      run(...args) {
        const result = statement.run(...args);
        return {
          changes: Number(result.changes),
          lastInsertRowid: Number(result.lastInsertRowid),
        };
      },
    };
  },
  transaction(callback) {
    return (...args) => {
      nativeDb.exec("BEGIN IMMEDIATE");
      try {
        const result = callback(...args);
        nativeDb.exec("COMMIT");
        return result;
      } catch (error) {
        try { nativeDb.exec("ROLLBACK"); } catch {}
        throw error;
      }
    };
  },
};

nativeDb.exec(`
CREATE TABLE IF NOT EXISTS products (
 id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, tamil TEXT NOT NULL,
 category TEXT NOT NULL CHECK(category IN ('fruit','vegetable')), price REAL NOT NULL CHECK(price>=0),
 unit TEXT NOT NULL, image TEXT NOT NULL, stock INTEGER NOT NULL DEFAULT 0 CHECK(stock>=0),
 available INTEGER NOT NULL DEFAULT 1, created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS delivery_areas (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL, active INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS orders (
 id INTEGER PRIMARY KEY AUTOINCREMENT, order_number TEXT UNIQUE NOT NULL, customer_name TEXT NOT NULL,
 phone TEXT NOT NULL, village TEXT NOT NULL, address TEXT NOT NULL, instructions TEXT DEFAULT '',
 subtotal REAL NOT NULL, delivery_fee REAL NOT NULL, total REAL NOT NULL, payment_method TEXT NOT NULL DEFAULT 'COD',
 status TEXT NOT NULL DEFAULT 'Placed', created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS order_items (
 id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
 product_id INTEGER NOT NULL REFERENCES products(id), product_name TEXT NOT NULL, tamil_name TEXT NOT NULL,
 unit TEXT NOT NULL, price REAL NOT NULL, quantity INTEGER NOT NULL, line_total REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS admins (
 id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_orders_number_phone ON orders(order_number, phone);
`);

const count = db.prepare("SELECT COUNT(*) AS n FROM products").get().n;
if (!count) {
  const insert = db.prepare("INSERT INTO products(name,tamil,category,price,unit,image,stock,available) VALUES(@name,@tamil,@category,@price,@unit,@image,@stock,@available)");
  db.transaction((rows) => rows.forEach((product) => insert.run(product)))(allProducts);
}

const areaCount = db.prepare("SELECT COUNT(*) AS n FROM delivery_areas").get().n;
if (!areaCount) {
  const insertArea = db.prepare("INSERT INTO delivery_areas(name) VALUES(?)");
  villages.forEach((village) => insertArea.run(village));
}

const defaults = { delivery_fee: "20", minimum_order: "100" };
for (const [key, value] of Object.entries(defaults)) {
  db.prepare("INSERT OR IGNORE INTO settings(key,value) VALUES(?,?)").run(key, value);
}

if (!db.prepare("SELECT COUNT(*) AS n FROM admins").get().n) {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  db.prepare("INSERT INTO admins(username,password_hash) VALUES(?,?)")
    .run(username, bcrypt.hashSync(password, 12));
  console.log(`Initial admin created: ${username}. Change the demo password before public deployment.`);
}

export default db;
