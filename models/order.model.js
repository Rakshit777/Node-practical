import pool from "../db/config.js";
export function createOrder(conn, userId, total) {
  return conn.query(
    'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, "COMPLETED")',
    [userId, total]
  );
}

export function createOrderItem(conn, orderId, productId, qty, price) {
  return conn.query(
    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
    [orderId, productId, qty, price]
  );
}

export function getOrderForUpdate(conn, orderId) {
  return conn.query(
    'SELECT * FROM orders WHERE id = ? FOR UPDATE',
    [orderId]
  );
}

export function getOrderItems(conn, orderId) {
  return conn.query(
    'SELECT * FROM order_items WHERE order_id = ?',
    [orderId]
  );
}

export function cancelOrder(conn, orderId) {
  return conn.query(
    'UPDATE orders SET status = "CANCELLED" WHERE id = ?',
    [orderId]
  );
};