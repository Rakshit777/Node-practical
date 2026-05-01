import { Router } from 'express';
import { createProductDetails } from '../controllers/product.controller.js';
const router = Router();

router.post('/', createProductDetails);

export default router;