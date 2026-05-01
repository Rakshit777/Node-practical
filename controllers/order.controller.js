import {
    cancelOrder,
    createOrder,
    getOrders
} from "../services/order.service.js";

export async function createOrderDetails(req, res) {
    try {
        const orderId = await createOrder(
            req.body.user_id,
            req.body.items
        );

        res.json({
            orderId
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
}


export async function cancelOrderById(req, res) {
    try {
        await cancelOrder(req.params.id);
        res.json({
            message: 'Order Cancelled'
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

export async function getOrderList(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await getOrders(page, limit);

        res.json(result);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};