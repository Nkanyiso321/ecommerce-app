/**
 * Order Routes
 */

const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, OrderController.getUserOrders);
router.get('/:id', authMiddleware, OrderController.getOrder);
router.post('/payment-intent', authMiddleware, OrderController.createPaymentIntent);
router.post('/checkout', authMiddleware, OrderController.completeCheckout);
router.put('/:id/status', authMiddleware, adminMiddleware, OrderController.updateOrderStatus);
router.post('/:id/refund', authMiddleware, OrderController.requestRefund);

module.exports = router;
