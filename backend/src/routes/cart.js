/**
 * Cart Routes
 */

const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, CartController.getCart);
router.post('/add', authMiddleware, CartController.addToCart);
router.post('/remove', authMiddleware, CartController.removeFromCart);
router.post('/update', authMiddleware, CartController.updateCartItem);
router.delete('/', authMiddleware, CartController.clearCart);

module.exports = router;
