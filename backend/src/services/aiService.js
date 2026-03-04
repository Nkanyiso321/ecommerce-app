/**
 * AI Service - Handles all AI-powered features
 * Includes: Recommendations, Chatbot, Product Descriptions, Fraud Detection
 */

const openai = require('../config/openai');
const { Product, Order, User, Review } = require('../models');
const { Op } = require('sequelize');

class AIService {
  /**
   * Generate personalized product recommendations
   * Based on user purchase history and browsing behavior
   */
  static async getPersonalizedRecommendations(userId, limit = 5) {
    try {
      // Get user's purchase history
      const userOrders = await Order.findAll({
        where: { userId },
        include: ['items'],
        limit: 10
      });

      // Extract product categories from purchases
      const purchasedCategories = new Set();
      userOrders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            purchasedCategories.add(item.category);
          });
        }
      });

      // Get products from similar categories
      let recommendations = await Product.findAll({
        where: {
          category: { [Op.in]: Array.from(purchasedCategories) },
          isActive: true
        },
        limit: limit,
        order: [['rating', 'DESC']]
      });

      // If not enough recommendations, add popular products
      if (recommendations.length < limit) {
        const popularProducts = await Product.findAll({
          where: { isActive: true },
          limit: limit - recommendations.length,
          order: [['rating', 'DESC']]
        });
        recommendations = [...recommendations, ...popularProducts];
      }

      return recommendations.slice(0, limit);
    } catch (error) {
      console.error('Error in getPersonalizedRecommendations:', error);
      throw error;
    }
  }

  /**
   * AI Chatbot - Respond to customer queries using OpenAI
   */
  static async chatbotResponse(message, context = {}) {
    try {
      const systemPrompt = `You are a helpful e-commerce customer support assistant. 
      You help customers with product inquiries, order status, returns, shipping, and general shopping questions.
      Be friendly, concise, and professional. If you don't know something, offer to connect them with human support.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error in chatbotResponse:', error);
      // Fallback response
      return 'Sorry, I cannot process your request at the moment. Please try again or contact our support team.';
    }
  }

  /**
   * Generate AI-powered product description
   */
  static async generateProductDescription(productName, category, price, features = []) {
    try {
      const prompt = `Generate a compelling and professional e-commerce product description for:
      Product Name: ${productName}
      Category: ${category}
      Price: $${price}
      Key Features: ${features.join(', ')}
      
      The description should be 150-200 words, engaging, SEO-friendly, and highlight key benefits.
      Start directly with the description without any prefix.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error in generateProductDescription:', error);
      return `High-quality ${productName} at an excellent price of $${price}. Perfect for your needs.`;
    }
  }

  /**
   * Fraud Detection System
   * Analyzes transaction patterns and returns fraud risk score (0-1)
   */
  static async detectFraud(orderData) {
    try {
      const {
        userId,
        amount,
        currency = 'USD',
        billingAddress,
        shippingAddress,
        paymentMethod,
        userEmail
      } = orderData;

      let fraudScore = 0;
      const flags = [];

      // Get user's historical data
      const user = await User.findByPk(userId);
      const previousOrders = await Order.findAll({
        where: { userId },
        limit: 20
      });

      // Check 1: Unusually high amount
      if (previousOrders.length > 0) {
        const avgOrderAmount = previousOrders.reduce((sum, order) => sum + parseFloat(order.finalAmount), 0) / previousOrders.length;
        if (amount > avgOrderAmount * 3) {
          fraudScore += 0.2;
          flags.push('Unusually high order amount');
        }
      }

      // Check 2: Billing and shipping address mismatch
      if (billingAddress && shippingAddress &&
        JSON.stringify(billingAddress) !== JSON.stringify(shippingAddress)) {
        fraudScore += 0.1;
        flags.push('Billing and shipping address mismatch');
      }

      // Check 3: Rapid consecutive orders
      if (previousOrders.length > 0) {
        const lastOrder = previousOrders[0];
        const timeDiff = (new Date() - new Date(lastOrder.createdAt)) / (1000 * 60); // in minutes
        if (timeDiff < 10) {
          fraudScore += 0.15;
          flags.push('Rapid consecutive orders');
        }
      }

      // Check 4: New customer risk
      if (previousOrders.length === 0) {
        fraudScore += 0.05;
        flags.push('New customer');
      }

      // Check 5: Suspicious payment method
      if (paymentMethod === 'unverified_card') {
        fraudScore += 0.15;
        flags.push('Unverified payment method');
      }

      return {
        fraudScore: Math.min(fraudScore, 1),
        isFraudulent: fraudScore > 0.5,
        flags,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error in detectFraud:', error);
      return {
        fraudScore: 0,
        isFraudulent: false,
        flags: [],
        timestamp: new Date()
      };
    }
  }

  /**
   * Get trending products based on sales and reviews
   */
  static async getTrendingProducts(limit = 10) {
    try {
      return await Product.findAll({
        where: { isActive: true },
        limit,
        order: [
          ['rating', 'DESC'],
          ['reviews', 'DESC']
        ]
      });
    } catch (error) {
      console.error('Error in getTrendingProducts:', error);
      throw error;
    }
  }
}

module.exports = AIService;
