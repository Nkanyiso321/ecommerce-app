/**
 * Product Controller - Handles product operations
 */

const { Product, Review } = require('../models');
const AIService = require('../services/aiService');

class ProductController {
  /**
   * Get all products with filters
   */
  static async getAllProducts(req, res, next) {
    try {
      const { category, search, sortBy = 'createdAt', page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      let where = { isActive: true };
      
      if (category) where.category = category;
      if (search) {
        where[require('sequelize').Op.or] = [
          { name: { [require('sequelize').Op.iLike]: `%${search}%` } },
          { description: { [require('sequelize').Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows } = await Product.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [[sortBy, 'DESC']]
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
   * Get single product
   */
  static async getProduct(req, res, next) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id, {
        include: [{ model: Review, include: ['User'] }]
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create product (Admin only)
   */
  static async createProduct(req, res, next) {
    try {
      const { name, description, price, stock, category, subcategory, images, sku, manufacturer } = req.body;

      // Generate AI description if not provided
      let aiDescription = description;
      if (!description || description.trim() === '') {
        aiDescription = await AIService.generateProductDescription(name, category, price);
      }

      const product = await Product.create({
        name,
        description: description || aiDescription,
        aiGeneratedDescription: aiDescription,
        price,
        stock,
        category,
        subcategory,
        images,
        sku,
        manufacturer
      });

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update product (Admin only)
   */
  static async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      await product.update(updates);

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete product (Admin only)
   */
  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      await product.update({ isActive: false });

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
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

  /**
   * Search products
   */
  static async searchProducts(req, res, next) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const { Op } = require('sequelize');
      const products = await Product.findAll({
        where: {
          isActive: true,
          [Op.or]: [
            { name: { [Op.iLike]: `%${q}%` } },
            { description: { [Op.iLike]: `%${q}%` } },
            { tags: { [Op.contains]: [q] } }
          ]
        }
      });

      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
