# Testing Guide

## Overview

This document provides comprehensive testing strategies for the eCommerce application.

## Table of Contents
1. [Backend Testing](#backend-testing)
2. [Frontend Testing](#frontend-testing)
3. [Integration Testing](#integration-testing)
4. [End-to-End Testing](#end-to-end-testing)
5. [Performance Testing](#performance-testing)

---

## Backend Testing

### Unit Tests with Jest

**Run tests:**
```bash
cd backend
npm test
npm test -- --coverage
npm test -- --watch
```

### Testing Services

**Example: Auth Service Test**
```javascript
describe('AuthService', () => {
  it('should register user with valid data', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      password: 'password123'
    };

    const result = await AuthService.register(
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.password
    );

    expect(result.user.email).toBe(userData.email);
    expect(result.token).toBeDefined();
  });

  it('should throw error for duplicate email', async () => {
    await expect(
      AuthService.register('John', 'Doe', 'existing@test.com', 'password')
    ).rejects.toThrow('Email already registered');
  });
});
```

### Testing Controllers

**Example: Product Controller Test**
```javascript
describe('ProductController', () => {
  it('should get all products', async () => {
    const req = { query: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await ProductController.getAllProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});
```

### Test Coverage Goals

- **Statements:** 80%+
- **Branches:** 75%+
- **Functions:** 80%+
- **Lines:** 80%+

---

## Frontend Testing

### Unit Tests with Jest

**Run tests:**
```bash
cd frontend
npm test
npm test -- --coverage
npm test -- --watch
```

### Component Testing

**Example: ProductCard Component Test**
```javascript
import { render, screen } from '@testing-library/react';
import ProductCard from '../components/ProductCard';

describe('ProductCard', () => {
  it('should render product information', () => {
    const product = {
      id: '1',
      name: 'Test Product',
      price: 99.99,
      discount: 10,
      rating: 4.5,
      reviews: 100,
      stock: 50,
      images: ['image.jpg']
    };

    render(<ProductCard product={product} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$89.99')).toBeInTheDocument();
  });

  it('should show out of stock message', () => {
    const product = {
      ...product,
      stock: 0
    };

    render(<ProductCard product={product} />);

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });
});
```

### Testing Hooks (Zustand Store)

```javascript
import { useAuthStore } from '../context/authStore';

describe('Auth Store', () => {
  it('should login user', async () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.login('test@test.com', 'password123');
    });

    await waitFor(() => {
      expect(result.current.user).toBeDefined();
      expect(result.current.authToken).toBeDefined();
    });
  });
});
```

---

## Integration Testing

### API Integration Tests

**Using Supertest:**

```javascript
const request = require('supertest');
const app = require('../../src/index');

describe('Auth API', () => {
  it('should register and login user', async () => {
    // Register
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        password: 'password123',
        confirmPassword: 'password123'
      });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.data.token).toBeDefined();

    // Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john@test.com',
        password: 'password123'
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data.token).toBeDefined();
  });

  it('should get user profile with valid token', async () => {
    const token = 'valid_jwt_token';

    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBeDefined();
  });
});
```

---

## End-to-End Testing

### User Flow Testing

**Test signup → browse → add to cart → checkout:**

```javascript
describe('End-to-End: Complete Purchase Flow', () => {
  it('should complete purchase from signup to checkout', async () => {
    // 1. Register user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'flow@test.com',
        password: 'password123',
        confirmPassword: 'password123'
      });

    const token = registerRes.body.data.token;
    const userId = registerRes.body.data.user.id;

    // 2. Get products
    const productsRes = await request(app)
      .get('/api/products');

    expect(productsRes.body.data.length).toBeGreaterThan(0);
    const productId = productsRes.body.data[0].id;

    // 3. Add to cart
    const cartRes = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 1 });

    expect(cartRes.status).toBe(200);

    // 4. Create payment intent
    const paymentRes = await request(app)
      .post('/api/orders/payment-intent')
      .set('Authorization', `Bearer ${token}`)
      .send({
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'USA'
        }
      });

    expect(paymentRes.status).toBe(200);
    expect(paymentRes.body.data.clientSecret).toBeDefined();
  });
});
```

---

## Performance Testing

### Load Testing with Artillery

**Install:**
```bash
npm install -g artillery
```

**Config file (load-test.yml):**
```yaml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Ramp up"
    - duration: 60
      arrivalRate: 100
      name: "Sustained load"

scenarios:
  - name: "Get Products"
    flow:
      - get:
          url: "/api/products"
      - think: 5

  - name: "Search Products"
    flow:
      - get:
          url: "/api/products/search?q=headphones"
      - think: 10
```

**Run test:**
```bash
artillery run load-test.yml
```

### Database Performance Testing

```javascript
describe('Database Performance', () => {
  it('should retrieve 1000 products in < 100ms', async () => {
    const start = Date.now();
    
    await Product.findAll({ limit: 1000 });
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
  });

  it('should handle concurrent order queries', async () => {
    const promises = [];
    for (let i = 0; i < 100; i++) {
      promises.push(Order.findAll({ limit: 10 }));
    }

    const start = Date.now();
    await Promise.all(promises);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(5000);
  });
});
```

---

## Manual Testing

### Browsers to Test

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile: iOS Safari, Chrome mobile

### Test Scenarios

**Authentication:**
- [ ] User registration
- [ ] Email validation
- [ ] Password validation
- [ ] Login success/failure
- [ ] Password reset
- [ ] Token expiration

**Products:**
- [ ] Browse all products
- [ ] Search functionality
- [ ] Filter by category
- [ ] Sort by price/rating
- [ ] View product details
- [ ] Product images load correctly

**Shopping:**
- [ ] Add to cart
- [ ] Update cart quantities
- [ ] Remove from cart
- [ ] Clear cart
- [ ] Cart total calculation
- [ ] Apply discount codes

**Checkout:**
- [ ] Enter shipping address
- [ ] Enter billing address
- [ ] Select shipping method
- [ ] Review order
- [ ] Process payment
- [ ] Order confirmation

**AI Features:**
- [ ] Get recommendations
- [ ] Chat with AI assistant
- [ ] Fraud detection
- [ ] Product description generation

---

## Testing Best Practices

1. **Test isolation:** Each test should be independent
2. **Clean up:** Use `beforeEach` and `afterEach` for setup/teardown
3. **Mocking:** Mock external services (Stripe, OpenAI)
4. **Assertions:** Use specific, meaningful assertions
5. **Test data:** Use factories or fixtures
6. **Error cases:** Test both success and failure paths
7. **Coverage:** Aim for 80%+ code coverage
8. **Speed:** Keep unit tests fast (<100ms)

## Continuous Integration

**GitHub Actions workflow:**
```yaml
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - run: |
          cd backend
          npm install
          npm test -- --coverage
      
      - run: |
          cd frontend
          npm install
          npm test -- --coverage
```

---

## Debugging

### Backend Debugging

**VS Code launch configuration (.vscode/launch.json):**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Backend",
      "program": "${workspaceFolder}/backend/src/index.js",
      "cwd": "${workspaceFolder}/backend"
    }
  ]
}
```

### Frontend DevTools

- React DevTools browser extension
- Redux DevTools for state inspection
- Network tab for API debugging
- Console for errors

---

For more information, see [README.md](./README.md)
