/**
 * Cart Controller - Handles shopping cart operations
 */

const { Cart, Product } = require('../models');

class CartController {
  /**
   * Get user cart
   */
  static async getCart(req, res, next) {
    try {
      let cart = await Cart.findOne({ where: { userId: req.user.id } });

      if (!cart) {
        cart = await Cart.create({
          userId: req.user.id,
          items: []
        });
      }

      res.status(200).json({
        success: true,
        data: cart
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add item to cart
   */
  static async addToCart(req, res, next) {
    try {
      const { productId, quantity = 1 } = req.body;

      if (!productId || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Invalid product or quantity'
        });
      }

      // Check if product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      let cart = await Cart.findOne({ where: { userId: req.user.id } });

      if (!cart) {
        cart = await Cart.create({
          userId: req.user.id,
          items: [{ productId, quantity, price: product.price }]
        });
      } else {
        const existingItem = cart.items.find(item => item.productId === productId);

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({ productId, quantity, price: product.price });
        }

        // Calculate total
        cart.totalPrice = cart.items.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);

        await cart.save();
      }

      res.status(200).json({
        success: true,
        message: 'Item added to cart',
        data: cart
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove item from cart
   */
  static async removeFromCart(req, res, next) {
    try {
      const { productId } = req.body;

      const cart = await Cart.findOne({ where: { userId: req.user.id } });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }

      cart.items = cart.items.filter(item => item.productId !== productId);

      if (cart.items.length === 0) {
        await cart.destroy();
        return res.status(200).json({
          success: true,
          message: 'Item removed from cart',
          data: null
        });
      }

      // Recalculate total
      cart.totalPrice = cart.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      await cart.save();

      res.status(200).json({
        success: true,
        message: 'Item removed from cart',
        data: cart
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update cart item quantity
   */
  static async updateCartItem(req, res, next) {
    try {
      const { productId, quantity } = req.body;

      if (quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be at least 1'
        });
      }

      const cart = await Cart.findOne({ where: { userId: req.user.id } });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }

      const item = cart.items.find(i => i.productId === productId);
      if (item) {
        item.quantity = quantity;

        // Recalculate total
        cart.totalPrice = cart.items.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);

        await cart.save();
      }

      res.status(200).json({
        success: true,
        message: 'Cart updated',
        data: cart
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Clear cart
   */
  static async clearCart(req, res, next) {
    try {
      await Cart.destroy({ where: { userId: req.user.id } });

      res.status(200).json({
        success: true,
        message: 'Cart cleared'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartController;
