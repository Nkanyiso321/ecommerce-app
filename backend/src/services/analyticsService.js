/**
 * Advanced Analytics Service - For AI-powered insights
 */

const { Order, Product, User, Review } = require('../models');
const { Op } = require('sequelize');

class AnalyticsService {
  /**
   * Get user purchase history analysis
   */
  static async getUserPurchaseAnalysis(userId) {
    try {
      const orders = await Order.findAll({
        where: { userId, paymentStatus: 'completed' },
        order: [['createdAt', 'DESC']],
        limit: 50
      });

      const analysis = {
        totalOrderValue: 0,
        totalOrders: orders.length,
        averageOrderValue: 0,
        favoriteCategories: [],
        lastPurchaseDate: null,
        purchaseFrequency: 0,
        productPreferences: []
      };

      const categoryMap = {};

      orders.forEach((order, index) => {
        analysis.totalOrderValue += parseFloat(order.finalAmount);

        if (index === 0) {
          analysis.lastPurchaseDate = order.createdAt;
        }

        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            categoryMap[item.category] = (categoryMap[item.category] || 0) + 1;
          });
        }
      });

      if (orders.length > 0) {
        analysis.averageOrderValue = analysis.totalOrderValue / orders.length;
      }

      // Get favorite categories
      analysis.favoriteCategories = Object.entries(categoryMap)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return analysis;
    } catch (error) {
      console.error('Error in getUserPurchaseAnalysis:', error);
      throw error;
    }
  }

  /**
   * Get product performance metrics
   */
  static async getProductPerformance(productId) {
    try {
      const product = await Product.findByPk(productId);
      const reviews = await Review.findAll({
        where: { productId },
        attributes: ['rating', 'createdAt']
      });

      const orders = await Order.findAll({
        where: { items: { [Op.contains]: [{ productId }] } }
      });

      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      return {
        productId,
        name: product.name,
        totalSales: orders.length,
        revenue: orders.reduce((sum, o) => sum + parseFloat(o.finalAmount), 0),
        averageRating: avgRating,
        reviewCount: reviews.length,
        currentStock: product.stock,
        stockTurnover: orders.length / (product.stock + orders.length) * 100,
        trendingScore: (avgRating * 0.4) + ((reviews.length / 100) * 0.3) + ((orders.length / 100) * 0.3)
      };
    } catch (error) {
      console.error('Error in getProductPerformance:', error);
      throw error;
    }
  }

  /**
   * Get sales analytics for dashboard
   */
  static async getSalesAnalytics(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const orders = await Order.findAll({
        where: {
          paymentStatus: 'completed',
          createdAt: { [Op.gte]: startDate }
        },
        order: [['createdAt', 'DESC']]
      });

      const analytics = {
        totalRevenue: 0,
        totalOrders: orders.length,
        averageOrderValue: 0,
        dailyRevenue: {},
        topProducts: [],
        topCategories: [],
        conversionRate: 0
      };

      const productMap = {};
      const categoryMap = {};

      orders.forEach(order => {
        analytics.totalRevenue += parseFloat(order.finalAmount);

        // Daily revenue
        const dateKey = order.createdAt.toISOString().split('T')[0];
        analytics.dailyRevenue[dateKey] = (analytics.dailyRevenue[dateKey] || 0) + parseFloat(order.finalAmount);

        // Product and category tracking
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            productMap[item.productId] = (productMap[item.productId] || 0) + item.quantity;
            categoryMap[item.category] = (categoryMap[item.category] || 0) + 1;
          });
        }
      });

      if (orders.length > 0) {
        analytics.averageOrderValue = analytics.totalRevenue / orders.length;
      }

      // Top products
      analytics.topProducts = Object.entries(productMap)
        .map(([id, count]) => ({ productId: id, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Top categories
      analytics.topCategories = Object.entries(categoryMap)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return analytics;
    } catch (error) {
      console.error('Error in getSalesAnalytics:', error);
      throw error;
    }
  }

  /**
   * Get customer segmentation
   */
  static async getCustomerSegmentation() {
    try {
      const users = await User.findAll();
      const segments = {
        premium: [],
        loyal: [],
        occasional: [],
        newCustomers: []
      };

      for (const user of users) {
        const orders = await Order.findAll({
          where: { userId: user.id, paymentStatus: 'completed' }
        });

        const totalSpent = orders.reduce((sum, o) => sum + parseFloat(o.finalAmount), 0);
        const orderCount = orders.length;
        const daysSinceFirstOrder = orders.length > 0
          ? Math.floor((Date.now() - new Date(orders[0].createdAt)) / (1000 * 60 * 60 * 24))
          : 0;

        // Segmentation logic
        if (totalSpent > 1000) {
          segments.premium.push({
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            totalSpent,
            orderCount
          });
        } else if (orderCount >= 5) {
          segments.loyal.push({
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            totalSpent,
            orderCount
          });
        } else if (orderCount > 0) {
          segments.occasional.push({
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            totalSpent,
            orderCount
          });
        } else {
          segments.newCustomers.push({
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            createdDaysAgo: daysSinceFirstOrder
          });
        }
      }

      return segments;
    } catch (error) {
      console.error('Error in getCustomerSegmentation:', error);
      throw error;
    }
  }

  /**
   * Get inventory insights
   */
  static async getInventoryInsights() {
    try {
      const products = await Product.findAll({
        where: { isActive: true }
      });

      const insights = {
        lowStock: [],
        overstock: [],
        totalInventoryValue: 0,
        averageStockLevel: 0,
        slowMovingProducts: []
      };

      let totalStock = 0;

      for (const product of products) {
        const salesCount = await Order.count({
          where: {
            items: { [Op.contains]: [{ productId: product.id }] }
          }
        });

        const inventoryValue = product.price * product.stock;
        insights.totalInventoryValue += inventoryValue;
        totalStock += product.stock;

        // Low stock
        if (product.stock < 10) {
          insights.lowStock.push({
            id: product.id,
            name: product.name,
            stock: product.stock
          });
        }

        // Overstock
        if (product.stock > 500 && salesCount < 5) {
          insights.overstock.push({
            id: product.id,
            name: product.name,
            stock: product.stock,
            monthlySales: salesCount
          });
        }

        // Slow moving
        if (salesCount < 2 && product.stock > 20) {
          insights.slowMovingProducts.push({
            id: product.id,
            name: product.name,
            stock: product.stock,
            salesCount
          });
        }
      }

      if (products.length > 0) {
        insights.averageStockLevel = totalStock / products.length;
      }

      return insights;
    } catch (error) {
      console.error('Error in getInventoryInsights:', error);
      throw error;
    }
  }

  /**
   * Get fraud statistics
   */
  static async getFraudStatistics(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const orders = await Order.findAll({
        where: {
          createdAt: { [Op.gte]: startDate }
        }
      });

      const fraudOrders = orders.filter(o => o.isFraudulent);

      return {
        totalOrders: orders.length,
        fraudulentOrders: fraudOrders.length,
        fraudRate: (fraudOrders.length / orders.length * 100).toFixed(2) + '%',
        averageFraudScore: fraudOrders.length > 0
          ? (fraudOrders.reduce((sum, o) => sum + parseFloat(o.fraudScore), 0) / fraudOrders.length).toFixed(2)
          : 0,
        topFraudFlags: this._getTopFraudFlags(fraudOrders),
        fraudAmountBlocked: fraudOrders.reduce((sum, o) => sum + parseFloat(o.finalAmount), 0)
      };
    } catch (error) {
      console.error('Error in getFraudStatistics:', error);
      throw error;
    }
  }

  /**
   * Helper to get top fraud flags
   */
  static _getTopFraudFlags(fraudOrders) {
    const flagMap = {};

    fraudOrders.forEach(order => {
      order.fraudScore > 0.5 && (flagMap['high_amount'] = (flagMap['high_amount'] || 0) + 1);
    });

    return Object.entries(flagMap)
      .map(([flag, count]) => ({ flag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}

module.exports = AnalyticsService;
