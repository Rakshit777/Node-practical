import { Router } from 'express';
import { cancelOrderById, createOrderDetails, getOrderList } from '../controllers/order.controller.js';

const router = Router();

router.post('/', createOrderDetails);
router.patch('/:id/cancel', cancelOrderById);
router.get('/', getOrderList);

export default router;