/**
 * Stripe payment gateway configuration
 * Handles payment processing and refunds
 */

const Stripe = require('stripe');
require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
