import { Router } from 'express';
import { createProductDetails, getProductList } from '../controllers/product.controller.js';
const router = Router();

router.get('/', getProductList);
router.post('/', createProductDetails);

export default router;