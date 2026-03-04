/**
 * OpenAI configuration for AI features
 * Used for chatbot, product descriptions, and recommendations
 */

const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = openai;
