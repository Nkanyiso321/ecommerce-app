/**
 * AI Controller - Handles AI-powered features
 */

const AIService = require('../services/aiService');

class AIController {
  /**
   * Get personalized recommendations
   */
  static async getRecommendations(req, res, next) {
    try {
      const { limit = 5 } = req.query;

      const recommendations = await AIService.getPersonalizedRecommendations(
        req.user.id,
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: recommendations
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Chatbot endpoint
   */
  static async chatbot(req, res, next) {
    try {
      const { message } = req.body;

      if (!message || message.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Message is required'
        });
      }

      const response = await AIService.chatbotResponse(message);

      res.status(200).json({
        success: true,
        data: {
          userMessage: message,
          aiResponse: response
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate product description
   */
  static async generateDescription(req, res, next) {
    try {
      const { productName, category, price, features } = req.body;

      if (!productName || !category) {
        return res.status(400).json({
          success: false,
          message: 'Product name and category are required'
        });
      }

      const description = await AIService.generateProductDescription(
        productName,
        category,
        price || 0,
        features || []
      );

      res.status(200).json({
        success: true,
        data: {
          description
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check fraud score
   */
  static async checkFraud(req, res, next) {
    try {
      const orderData = {
        userId: req.user.id,
        amount: req.body.amount,
        currency: req.body.currency || 'USD',
        billingAddress: req.body.billingAddress,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod
      };

      const fraudAnalysis = await AIService.detectFraud(orderData);

      res.status(200).json({
        success: true,
        data: fraudAnalysis
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get trending products
   */
  static async getTrendingProducts(req, res, next) {
    try {
      const { limit = 10 } = req.query;

      const products = await AIService.getTrendingProducts(parseInt(limit));

      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AIController;
