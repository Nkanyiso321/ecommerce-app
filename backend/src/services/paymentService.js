/**
 * Payment Service - Handles Stripe integration and payment processing
 */

const stripe = require('../config/stripe');
const { Order, Cart, Product } = require('../models');
const AIService = require('./aiService');
require('dotenv').config();

class PaymentService {
  /**
   * Create payment intent for checkout
   */
  static async createPaymentIntent(userId, orderData) {
    try {
      const { amount, currency = 'usd', description } = orderData;

      // Perform fraud detection before payment
      const fraudAnalysis = await AIService.detectFraud({
        userId,
        amount: parseFloat(amount),
        billingAddress: orderData.billingAddress,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: 'card'
      });

      if (fraudAnalysis.isFraudulent) {
        const error = new Error('Transaction failed: Potential fraud detected');
        error.status = 403;
        throw error;
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(amount) * 100), // Convert to cents
        currency,
        description,
        metadata: {
          userId,
          fraudScore: fraudAnalysis.fraudScore
        }
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        fraudScore: fraudAnalysis.fraudScore
      };
    } catch (error) {
      console.error('Error in createPaymentIntent:', error);
      throw error;
    }
  }

  /**
   * Confirm payment and create order
   */
  static async confirmPayment(userId, paymentIntentId, orderData) {
    try {
      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        const error = new Error('Payment not completed');
        error.status = 400;
        throw error;
      }

      // Create order in database
      const order = await Order.create({
        userId,
        orderNumber: `ORD-${Date.now()}`,
        items: orderData.items,
        totalPrice: orderData.totalPrice,
        discountAmount: orderData.discountAmount || 0,
        shipping: orderData.shipping || 0,
        tax: orderData.tax || 0,
        finalAmount: parseFloat(paymentIntent.amount) / 100,
        paymentStatus: 'completed',
        status: 'processing',
        paymentMethod: 'stripe',
        stripePaymentId: paymentIntent.id,
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress || orderData.shippingAddress
      });

      // Clear user's cart
      await Cart.destroy({ where: { userId } });

      // Update product stock
      for (const item of orderData.items) {
        await Product.decrement('stock', {
          by: item.quantity,
          where: { id: item.productId }
        });
      }

      return order;
    } catch (error) {
      console.error('Error in confirmPayment:', error);
      throw error;
    }
  }

  /**
   * Process refund
   */
  static async processRefund(orderId, amount, reason) {
    try {
      const order = await Order.findByPk(orderId);

      if (!order || !order.stripePaymentId) {
        const error = new Error('Order not found or not paid via Stripe');
        error.status = 404;
        throw error;
      }

      const refund = await stripe.refunds.create({
        payment_intent: order.stripePaymentId,
        amount: Math.round(parseFloat(amount) * 100),
        reason: reason || 'requested_by_customer'
      });

      // Update order status
      await order.update({
        status: 'refunded',
        paymentStatus: 'refunded',
        notes: `Refund processed: ${reason}`
      });

      return refund;
    } catch (error) {
      console.error('Error in processRefund:', error);
      throw error;
    }
  }
}

module.exports = PaymentService;
