import pool from "../db/config.js";

export function createProduct(name, price, stock) {
  return pool.query(
    'INSERT INTO products (name, price, stock) VALUES (?, ?, ?)',
    [name, price, stock]
  );
}

export function getProductForUpdate(conn, productId) {
  return conn.query(
    'SELECT id, price, stock FROM products WHERE id = ? FOR UPDATE',
    [productId]
  );
};

export function updateStock(conn, productId, qty) {
  return conn.query(
    'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
    [qty, productId, qty]
  );
};

export function restoreStock(conn, productId, qty) {
  return conn.query(
    'UPDATE products SET stock = stock + ? WHERE id = ?',
    [qty, productId]
  );
}