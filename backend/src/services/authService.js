/**
 * Authentication service - User signup, login, and token management
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

class AuthService {
  /**
   * Generate JWT token
   */
  static generateToken(userId, userRole = 'user') {
    return jwt.sign(
      { id: userId, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  }

  /**
   * Register new user
   */
  static async register(firstName, lastName, email, password) {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      const error = new Error('Email already registered');
      error.status = 400;
      throw error;
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password
    });

    const token = this.generateToken(user.id, user.role);
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  /**
   * Login user
   */
  static async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    const token = this.generateToken(user.id, user.role);
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    return user;
  }
}

module.exports = AuthService;
