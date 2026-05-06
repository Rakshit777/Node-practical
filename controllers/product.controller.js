import {
  createProduct,
  getProducts
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

export async function getProductList(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await getProducts(page, limit);

        res.json(result);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};