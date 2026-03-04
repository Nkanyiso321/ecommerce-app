/**
 * Unit Tests for Auth Controller
 */

const AuthService = require('../../src/services/authService');
const { User } = require('../../src/models');

describe('AuthService', () => {
  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const result = await AuthService.register(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password
      );

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.token).toBeDefined();
    });

    it('should throw error for duplicate email', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        password: 'password123'
      };

      // Create first user
      await AuthService.register(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password
      );

      // Try to create duplicate
      await expect(
        AuthService.register(
          userData.firstName,
          userData.lastName,
          userData.email,
          userData.password
        )
      ).rejects.toThrow('Email already registered');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'login@example.com',
        password: 'password123'
      };

      // Register user first
      const registered = await AuthService.register(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password
      );

      // Login
      const result = await AuthService.login(userData.email, userData.password);

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.token).toBeDefined();
    });

    it('should throw error for invalid credentials', async () => {
      await expect(
        AuthService.login('nonexistent@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('generateToken', () => {
    it('should generate valid JWT token', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const token = AuthService.generateToken(userId, 'user');

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });
});
