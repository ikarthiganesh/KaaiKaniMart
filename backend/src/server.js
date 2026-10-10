import express from "express";
import cors from "cors";
import helmet from "helmet";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import db from "./db.js";
import { villages } from "./seed.js";

const app = express();
const PORT = Number(process.env.PORT || 5000);
const SECRET =
  process.env.JWT_SECRET ||
  "development-only-secret-change-before-deployment";

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "100kb" }));

// Helpers
const setting = (key) =>
  Number(
    db.prepare("SELECT value FROM settings WHERE key = ?").get(key)?.value || 0
  );

const publicProduct = (product) => ({
  ...product,
  available: Boolean(product.available),
});

// Admin authentication
function auth(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");

  try {
    if (!token) throw new Error("Missing token");
    req.admin = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Please log in as admin." });
  }
}

const statuses = [
  "Placed",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "KaaiKaniMart API" });
});

// Get products
app.get("/api/products", (req, res) => {
  const { category, search, sort } = req.query;

  let sql = "SELECT * FROM products WHERE available = 1";
  const args = [];

  if (["fruit", "vegetable"].includes(category)) {
    sql += " AND category = ?";
    args.push(category);
  }

  if (search) {
    sql += " AND (name LIKE ? OR tamil LIKE ?)";
    const term = "%" + String(search).slice(0, 80) + "%";
    args.push(term, term);
  }

  if (sort === "price-asc") {
    sql += " ORDER BY price ASC";
  } else if (sort === "price-desc") {
    sql += " ORDER BY price DESC";
  } else {
    sql += " ORDER BY id ASC";
  }

  res.json(db.prepare(sql).all(...args).map(publicProduct));
});

// Get store settings and delivery villages
app.get("/api/settings", (req, res) => {
  res.json({
    deliveryFee: setting("delivery_fee"),
    minimumOrder: setting("minimum_order"),
    villages: db
      .prepare(
        "SELECT name FROM delivery_areas WHERE active = 1 ORDER BY id"
      )
      .all()
      .map((area) => area.name),
  });
});

// Place an order
app.post("/api/orders", (req, res) => {
  const {
    name,
    phone,
    village,
    address,
    instructions = "",
    items,
  } = req.body || {};

  // Accept Indian mobile numbers with optional +91, spaces or hyphens.
  const normalizedPhone = String(phone || "").replace(/[\s-]/g, "");
  const validPhone = /^(?:\+91)?[6-9]\d{9}$/.test(normalizedPhone);

  const validVillage =
    typeof village === "string" && villages.includes(village);

  if (
    typeof name !== "string" ||
    !name.trim() ||
    !validPhone ||
    !validVillage ||
    typeof address !== "string" ||
    !address.trim() ||
    address.trim().length < 5
  ) {
    return res.status(400).json({
      error:
        "Enter your name, a valid mobile number, full address and choose an approved village.",
    });
  }

  if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
    return res.status(400).json({
      error: "Your cart is empty or invalid.",
    });
  }

  let transactionStarted = false;

  try {
    // Start a SQLite transaction.
    db.exec("BEGIN");
    transactionStarted = true;

    const subtotalItems = [];
    let subtotal = 0;

    for (const item of items) {
      const id = Number(item.id);
      const qty = Number(item.quantity);

      if (
        !Number.isInteger(id) ||
        !Number.isInteger(qty) ||
        qty < 1 ||
        qty > 50
      ) {
        throw new Error("Invalid product quantity.");
      }

      const product = db
        .prepare("SELECT * FROM products WHERE id = ?")
        .get(id);

      if (!product || !product.available) {
        throw new Error(
          `${product?.name || "A product"} is currently unavailable.`
        );
      }

      if (product.stock < qty) {
        throw new Error(
          `Only ${product.stock} ${product.unit} available for ${product.name}.`
        );
      }

      const lineTotal = product.price * qty;
      subtotal += lineTotal;

      subtotalItems.push({
        ...product,
        quantity: qty,
        lineTotal,
      });
    }

    const minimumOrder = setting("minimum_order");

    if (subtotal < minimumOrder) {
      throw new Error(`Minimum order value is ₹${minimumOrder}.`);
    }

    const fee = setting("delivery_fee");
    const total = Math.round((subtotal + fee) * 100) / 100;

    const orderNumber =
      "KKM" +
      Date.now().toString().slice(-9) +
      Math.floor(Math.random() * 90 + 10);

    const orderInfo = db
      .prepare(`
        INSERT INTO orders (
          order_number,
          customer_name,
          phone,
          village,
          address,
          instructions,
          subtotal,
          delivery_fee,
          total,
          payment_method
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Cash on Delivery')
      `)
      .run(
        orderNumber,
        name.trim().slice(0, 100),
        normalizedPhone,
        village,
        address.trim().slice(0, 500),
        String(instructions).slice(0, 500),
        subtotal,
        fee,
        total
      );

    const insertItem = db.prepare(`
      INSERT INTO order_items (
        order_id,
        product_id,
        product_name,
        tamil_name,
        unit,
        price,
        quantity,
        line_total
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const product of subtotalItems) {
      const changed = db
        .prepare(`
          UPDATE products
          SET stock = stock - ?
          WHERE id = ? AND stock >= ? AND available = 1
        `)
        .run(product.quantity, product.id, product.quantity);

      if (changed.changes !== 1) {
        throw new Error(
          `Stock changed for ${product.name}; please try again.`
        );
      }

      insertItem.run(
        orderInfo.lastInsertRowid,
        product.id,
        product.name,
        product.tamil,
        product.unit,
        product.price,
        product.quantity,
        product.lineTotal
      );
    }

    db.exec("COMMIT");
    transactionStarted = false;

    return res.status(201).json({
      orderNumber,
      total,
      deliveryFee: fee,
      message: "Order placed successfully. Pay cash on delivery.",
    });
  } catch (error) {
    if (transactionStarted) {
      try {
        db.exec("ROLLBACK");
      } catch (rollbackError) {
        console.error("Rollback error:", rollbackError);
      }
    }

    console.error("Order error:", error);

    return res.status(400).json({
      error: error.message || "Unable to place order.",
    });
  }
});

// Look up an order
app.post("/api/orders/lookup", (req, res) => {
  const { orderNumber, phone } = req.body || {};

  if (!orderNumber || !phone) {
    return res.status(400).json({
      error: "Enter your order number and checkout mobile number.",
    });
  }

  const normalizedPhone = String(phone).replace(/[\s-]/g, "");

  const order = db
    .prepare(`
      SELECT
        id,
        order_number,
        customer_name,
        phone,
        village,
        address,
        instructions,
        subtotal,
        delivery_fee,
        total,
        payment_method,
        status,
        created_at
      FROM orders
      WHERE order_number = ? AND phone = ?
    `)
    .get(String(orderNumber).trim(), normalizedPhone);

  if (!order) {
    return res.status(404).json({
      error:
        "No order matched those details. Check the order number and mobile number.",
    });
  }

  order.items = db
    .prepare(`
      SELECT
        product_name AS name,
        tamil_name AS tamil,
        unit,
        price,
        quantity,
        line_total AS lineTotal
      FROM order_items
      WHERE order_id = ?
    `)
    .all(order.id);

  delete order.id;
  delete order.phone;

  res.json(order);
});

// Admin login
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};

    const admin = db
      .prepare("SELECT * FROM admins WHERE username = ?")
      .get(String(username || ""));

    if (
      !admin ||
      !(await bcrypt.compare(
        String(password || ""),
        admin.password_hash
      ))
    ) {
      return res.status(401).json({
        error: "Incorrect username or password.",
      });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token, username: admin.username });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Unable to log in." });
  }
});

// Admin: get all orders
app.get("/api/admin/orders", auth, (req, res) => {
  const orders = db
    .prepare("SELECT * FROM orders ORDER BY datetime(created_at) DESC")
    .all();

  res.json(
    orders.map((order) => ({
      ...order,
      items: db
        .prepare(`
          SELECT
            product_name AS name,
            tamil_name AS tamil,
            unit,
            price,
            quantity,
            line_total AS lineTotal
          FROM order_items
          WHERE order_id = ?
        `)
        .all(order.id),
    }))
  );
});

// Admin: update order status
app.patch("/api/admin/orders/:id", auth, (req, res) => {
  const { status } = req.body || {};

  if (!statuses.includes(status)) {
    return res.status(400).json({
      error: "Invalid order status.",
    });
  }

  const result = db
    .prepare("UPDATE orders SET status = ? WHERE id = ?")
    .run(status, Number(req.params.id));

  if (!result.changes) {
    return res.status(404).json({
      error: "Order not found.",
    });
  }

  res.json({ ok: true });
});

// Admin: get products
app.get("/api/admin/products", auth, (req, res) => {
  const products = db
    .prepare("SELECT * FROM products ORDER BY category, id")
    .all();

  res.json(products.map(publicProduct));
});

// Admin: update product price, stock and availability
app.patch("/api/admin/products/:id", auth, (req, res) => {
  const product = db
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(Number(req.params.id));

  if (!product) {
    return res.status(404).json({
      error: "Product not found.",
    });
  }

  const price = Number(req.body.price ?? product.price);
  const stock = Number(req.body.stock ?? product.stock);
  const available = Number(
    Boolean(req.body.available ?? product.available)
  );

  if (
    !Number.isFinite(price) ||
    price < 0 ||
    !Number.isInteger(stock) ||
    stock < 0 ||
    stock > 100000
  ) {
    return res.status(400).json({
      error: "Enter a valid price and stock quantity.",
    });
  }

  db.prepare(`
    UPDATE products
    SET price = ?, stock = ?, available = ?
    WHERE id = ?
  `).run(price, stock, available, product.id);

  const updatedProduct = db
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(product.id);

  res.json(publicProduct(updatedProduct));
});

// Admin: update store settings
app.patch("/api/admin/settings", auth, (req, res) => {
  const fee = Number(req.body.deliveryFee);
  const minimumOrder = Number(req.body.minimumOrder);

  if (
    !Number.isFinite(fee) ||
    fee < 0 ||
    !Number.isFinite(minimumOrder) ||
    minimumOrder < 0
  ) {
    return res.status(400).json({
      error: "Enter valid delivery and minimum order values.",
    });
  }

  const upsert = db.prepare(`
    INSERT INTO settings (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `);

  upsert.run("delivery_fee", String(fee));
  upsert.run("minimum_order", String(minimumOrder));

  res.json({
    deliveryFee: fee,
    minimumOrder,
  });
});

// Admin: list delivery areas
app.get("/api/admin/areas", auth, (req, res) => {
  res.json(
    db.prepare("SELECT * FROM delivery_areas ORDER BY id").all()
  );
});

// Admin: enable or disable an approved delivery area
app.patch("/api/admin/areas/:id", auth, (req, res) => {
  const area = db
    .prepare("SELECT * FROM delivery_areas WHERE id = ?")
    .get(Number(req.params.id));

  if (!area) {
    return res.status(404).json({
      error: "Village not found.",
    });
  }

  if (!villages.includes(area.name)) {
    return res.status(400).json({
      error: "Unsupported village.",
    });
  }

  db.prepare("UPDATE delivery_areas SET active = ? WHERE id = ?").run(
    req.body.active ? 1 : 0,
    area.id
  );

  res.json({ ok: true });
});

// Handle unexpected errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Unexpected server error.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`KaaiKaniMart API running at http://localhost:${PORT}`);
});