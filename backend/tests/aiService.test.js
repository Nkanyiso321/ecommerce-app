/**
 * Unit Tests for AI Service
 */

const AIService = require('../../src/services/aiService');

describe('AIService', () => {
  describe('generateProductDescription', () => {
    it('should generate a product description', async () => {
      const description = await AIService.generateProductDescription(
        'Wireless Headphones',
        'Electronics',
        99.99,
        ['Bluetooth 5.0', 'Noise Cancellation', 'Quick Charge']
      );

      expect(description).toBeDefined();
      expect(typeof description).toBe('string');
      expect(description.length).toBeGreaterThan(50);
    });
  });

  describe('detectFraud', () => {
    it('should analyze transaction for fraud', async () => {
      const orderData = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        amount: 1500,
        billingAddress: { street: '123 Main St', city: 'New York' },
        shippingAddress: { street: '123 Main St', city: 'New York' },
        paymentMethod: 'verified_card'
      };

      const result = await AIService.detectFraud(orderData);

      expect(result).toBeDefined();
      expect(result.fraudScore).toBeGreaterThanOrEqual(0);
      expect(result.fraudScore).toBeLessThanOrEqual(1);
      expect(typeof result.isFraudulent).toBe('boolean');
      expect(Array.isArray(result.flags)).toBe(true);
    });

    it('should detect high-risk transactions', async () => {
      const orderData = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        amount: 50000, // Very high amount
        billingAddress: { street: '123 Main St', city: 'New York' },
        shippingAddress: { street: '456 Other St', city: 'Los Angeles' }, // Different address
        paymentMethod: 'unverified_card'
      };

      const result = await AIService.detectFraud(orderData);

      expect(result.fraudScore).toBeGreaterThan(0);
    });
  });

  describe('chatbotResponse', () => {
    it('should generate chatbot response', async () => {
      const message = 'What is your return policy?';

      const response = await AIService.chatbotResponse(message);

      expect(response).toBeDefined();
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(10);
    });
  });

  describe('getTrendingProducts', () => {
    it('should return trending products', async () => {
      const products = await AIService.getTrendingProducts(5);

      expect(Array.isArray(products)).toBe(true);
    });
  });
});
