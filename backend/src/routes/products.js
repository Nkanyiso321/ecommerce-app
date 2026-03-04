/**
 * Product Routes
 */

const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', ProductController.getAllProducts);
router.get('/trending', ProductController.getTrendingProducts);
router.get('/search', ProductController.searchProducts);
router.get('/:id', ProductController.getProduct);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, ProductController.createProduct);
router.put('/:id', authMiddleware, adminMiddleware, ProductController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, ProductController.deleteProduct);

module.exports = router;
