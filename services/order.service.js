import pool from '../db/config.js';
import * as productModel from '../models/product.model.js';
import * as orderModel from '../models/order.model.js';
import cron from "node-cron";

export const createOrder = async (userId, items) => {
    const conn = await pool.getConnection();

    try {
        // await conn.beginTransaction();

        let total = 0;
        for (let item of items) {
            const [rows] = await productModel.getProductForUpdate(conn, item.product_id);
            if (!rows.length) throw new Error('Product not found');

            const product = rows[0];
            if (product.stock < item.quantity) {
                throw new Error('Insufficient stock');
            }

            total += product.price * item.quantity;
        }

        for (let item of items) {
            const [result] = await productModel.updateStock(
                conn,
                item.product_id,
                item.quantity
            );

            if (result.affectedRows === 0) {
                throw new Error('Stock update failed');
            }
        }

        const [orderRes] = await orderModel.createOrder(conn, userId, total);
        const orderId = orderRes.insertId;

        for (let item of items) {
            const [rows] = await productModel.getProductForUpdate(conn, item.product_id);
            const price = rows[0].price;

            await orderModel.createOrderItem(
                conn,
                orderId,
                item.product_id,
                item.quantity,
                price
            );
        }

        return orderId;
        // await conn.commit();

    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        // conn.release();
    }
};

export const cancelOrder = async (orderId) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [orders] = await orderModel.getOrderForUpdate(conn, orderId);
    if (!orders.length) throw new Error('Order not found');
    
    if (orders[0].status === 'CANCELLED') {
      throw new Error('Already cancelled');
    }

    const [items] = await orderModel.getOrderItems(conn, orderId);

    for (let item of items) {
      await productModel.restoreStock(conn, item.product_id, item.quantity);
    }

    await orderModel.cancelOrder(conn, orderId);

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const getOrders = async (page, limit) => {
  const offset = (page - 1) * limit;

  const [orders] = await pool.query(
    `SELECT id, user_id, total_amount, status, created_at
     FROM orders
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const [[countResult]] = await pool.query(
    `SELECT COUNT(*) as total FROM orders`
  );

  const total = countResult.total;

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: orders
  };
};

export function updateStatusCron() {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const [result] = await pool.execute(`
        UPDATE orders
        SET status = 'COMPLETED'
        WHERE status = 'PENDING'
          AND created_at <= NOW() - INTERVAL 5 MINUTE
      `);

      console.log(`Updated ${result.affectedRows} orders`);
    } catch (err) {
      console.error("Cron Error:", err.message);
    }
  });
}