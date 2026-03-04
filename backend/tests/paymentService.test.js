/**
 * Unit Tests for Payment Service
 */

const PaymentService = require('../../src/services/paymentService');

describe('PaymentService', () => {
  describe('createPaymentIntent', () => {
    it('should create payment intent', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const orderData = {
        amount: 99.99,
        currency: 'usd',
        description: 'Test order'
      };

      const result = await PaymentService.createPaymentIntent(userId, orderData);

      expect(result).toBeDefined();
      expect(result.clientSecret).toBeDefined();
      expect(result.paymentIntentId).toBeDefined();
      expect(result.fraudScore).toBeGreaterThanOrEqual(0);
    });
  });
});
