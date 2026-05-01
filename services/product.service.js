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