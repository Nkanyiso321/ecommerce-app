/**
 * AI Features Routes
 */

const express = require('express');
const router = express.Router();
const AIController = require('../controllers/aiController');
const { authMiddleware } = require('../middleware/auth');

router.get('/recommendations', authMiddleware, AIController.getRecommendations);
router.post('/chatbot', authMiddleware, AIController.chatbot);
router.post('/generate-description', authMiddleware, AIController.generateDescription);
router.post('/fraud-check', authMiddleware, AIController.checkFraud);
router.get('/trending', AIController.getTrendingProducts);

module.exports = router;
