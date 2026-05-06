import pool from '../db/config.js';
import * as productModel from '../models/product.model.js';

export const createProduct = async (name, price, stock) => {
    if (!name || price == null || stock == null) {
        throw new Error('All fields are required');
    }

    if (price < 0) {
        throw new Error('Price cannot be negative');
    }

    if (stock < 0) {
        throw new Error('Stock cannot be negative');
    }

    const result = await productModel.createProduct(name, price, stock);

    return {
        id: result[0].insertId,
        name,
        price,
        stock
    };
};

export const getProducts = async (page, limit) => {
  const offset = (page - 1) * limit;

  const [products] = await pool.query(
    `SELECT *
     FROM products
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const [[countResult]] = await pool.query(
    `SELECT COUNT(*) as total FROM products`
  );

  const total = countResult.total;

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: products
  }
}