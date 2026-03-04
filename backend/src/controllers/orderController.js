/**
 * Order Controller - Handles order operations and checkout
 */

const { Order, Cart, Product, User } = require('../models');
const PaymentService = require('../services/paymentService');
const AIService = require('../services/aiService');

class OrderController {
  /**
   * Get user orders
   */
  static async getUserOrders(req, res, next) {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      let where = { userId: req.user.id };
      if (status) where.status = status;

      const { count, rows } = await Order.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: rows,
        pagination: {
          total: count,
          pages: Math.ceil(count / limit),
          currentPage: parseInt(page)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get order details
   */
  static async getOrder(req, res, next) {
    try {
      const { id } = req.params;

      const order = await Order.findByPk(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Check ownership
      if (order.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create payment intent for checkout
   */
  static async createPaymentIntent(req, res, next) {
    try {
      const { shippingAddress, billingAddress, discountCode } = req.body;

      // Get user cart
      const cart = await Cart.findOne({ where: { userId: req.user.id } });

      if (!cart || !cart.items || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cart is empty'
        });
      }

      // Calculate totals
      let total = 0;
      let tax = 0;
      const shipping = 10; // Fixed shipping cost

      for (const item of cart.items) {
        const product = await Product.findByPk(item.productId);
        if (product) {
          const itemTotal = product.price * item.quantity;
          total += itemTotal;
        }
      }

      tax = total * 0.1; // 10% tax
      const finalAmount = total + tax + shipping;

      // Create payment intent
      const paymentData = await PaymentService.createPaymentIntent(req.user.id, {
        amount: finalAmount,
        currency: 'usd',
        description: `Order from eCommerce App`
      });

      res.status(200).json({
        success: true,
        data: {
          ...paymentData,
          orderSummary: {
            subtotal: total,
            tax,
            shipping,
            total: finalAmount
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Complete checkout and create order
   */
  static async completeCheckout(req, res, next) {
    try {
      const { paymentIntentId, shippingAddress, billingAddress } = req.body;

      // Get user cart
      const cart = await Cart.findOne({ where: { userId: req.user.id } });

      if (!cart || !cart.items || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cart is empty'
        });
      }

      // Calculate totals
      let totalPrice = 0;
      const shipping = 10;
      const itemsData = [];

      for (const item of cart.items) {
        const product = await Product.findByPk(item.productId);
        if (product) {
          const itemTotal = product.price * item.quantity;
          totalPrice += itemTotal;
          itemsData.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: item.quantity
          });
        }
      }

      const tax = totalPrice * 0.1;
      const finalAmount = totalPrice + tax + shipping;

      // Confirm payment
      const order = await PaymentService.confirmPayment(req.user.id, paymentIntentId, {
        items: itemsData,
        totalPrice,
        discountAmount: 0,
        shipping,
        tax,
        shippingAddress,
        billingAddress
      });

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update order status (Admin only)
   */
  static async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, trackingNumber } = req.body;

      const order = await Order.findByPk(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      if (status) order.status = status;
      if (trackingNumber) order.trackingNumber = trackingNumber;

      await order.save();

      res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Request refund
   */
  static async requestRefund(req, res, next) {
    try {
      const { id } = req.params;
      const { amount, reason } = req.body;

      const order = await Order.findByPk(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      if (order.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const refund = await PaymentService.processRefund(id, amount, reason);

      res.status(200).json({
        success: true,
        message: 'Refund processed successfully',
        data: refund
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
