import {
  createProduct
} from "../services/product.service.js";

export async function createProductDetails(req, res) {
  try {
    const {
      name,
      price,
      stock
    } = req.body;

    const result = await createProduct(name, price, stock);

    res.status(201).json({
      message: "Add product successfully"
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}