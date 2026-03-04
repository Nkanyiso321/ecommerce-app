# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token"
  }
}
```

### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "token": "jwt_token"
  }
}
```

### Get Profile
```
GET /auth/profile
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": "123 Main St",
    "role": "user"
  }
}
```

### Update Profile
```
PUT /auth/profile
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890",
  "address": "123 Main St"
}
```

---

## Product Endpoints

### Get All Products
```
GET /products?category=electronics&sortBy=rating&page=1&limit=20
```

**Query Parameters:**
- `category` - Filter by category
- `search` - Search query
- `sortBy` - Sort field (default: createdAt)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "pages": 5,
    "currentPage": 1
  }
}
```

### Get Single Product
```
GET /products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Wireless Headphones",
    "description": "High-quality wireless headphones",
    "price": 99.99,
    "discount": 10,
    "stock": 50,
    "category": "Electronics",
    "rating": 4.5,
    "reviews": 120,
    "images": [...],
    "tags": ["wireless", "audio"]
  }
}
```

### Get Trending Products
```
GET /products/trending?limit=10
```

### Search Products
```
GET /products/search?q=headphones
```

### Create Product (Admin)
```
POST /products
Headers: Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "Wireless Headphones",
  "description": "High-quality audio",
  "price": 99.99,
  "stock": 50,
  "category": "Electronics",
  "images": ["url1", "url2"],
  "sku": "WH001"
}
```

---

## Cart Endpoints

### Get Cart
```
GET /cart
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "items": [
      {
        "productId": "uuid",
        "quantity": 2,
        "price": 99.99
      }
    ],
    "totalPrice": 199.98
  }
}
```

### Add to Cart
```
POST /cart/add
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "uuid",
  "quantity": 2
}
```

### Remove from Cart
```
POST /cart/remove
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "uuid"
}
```

### Update Cart Item
```
POST /cart/update
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "uuid",
  "quantity": 5
}
```

### Clear Cart
```
DELETE /cart
Headers: Authorization: Bearer <token>
```

---

## Order Endpoints

### Get User Orders
```
GET /orders?status=pending&page=1&limit=10
Headers: Authorization: Bearer <token>
```

**Query Parameters:**
- `status` - Filter by status (pending, processing, shipped, delivered)
- `page` - Page number
- `limit` - Items per page

### Get Order Details
```
GET /orders/:id
Headers: Authorization: Bearer <token>
```

### Create Payment Intent
```
POST /orders/payment-intent
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "USA"
  },
  "billingAddress": {...}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx",
    "paymentIntentId": "pi_xxx",
    "fraudScore": 0.2,
    "orderSummary": {
      "subtotal": 199.98,
      "tax": 20,
      "shipping": 10,
      "total": 229.98
    }
  }
}
```

### Complete Checkout
```
POST /orders/checkout
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxx",
  "shippingAddress": {...},
  "billingAddress": {...}
}
```

### Update Order Status (Admin)
```
PUT /orders/:id/status
Headers: Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRACK123"
}
```

### Request Refund
```
POST /orders/:id/refund
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 99.99,
  "reason": "Item defective"
}
```

---

## AI Endpoints

### Get Recommendations
```
GET /ai/recommendations?limit=5
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "price": 99.99,
      "rating": 4.5
    }
  ]
}
```

### Chatbot
```
POST /ai/chatbot
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "message": "What is your return policy?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userMessage": "What is your return policy?",
    "aiResponse": "We offer 30-day returns..."
  }
}
```

### Generate Product Description
```
POST /ai/generate-description
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productName": "Wireless Headphones",
  "category": "Electronics",
  "price": 99.99,
  "features": ["Bluetooth 5.0", "Noise Cancellation", "30hr Battery"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "description": "Experience premium audio with our wireless headphones..."
  }
}
```

### Check Fraud Score
```
POST /ai/fraud-check
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 1500,
  "currency": "USD",
  "billingAddress": {...},
  "shippingAddress": {...},
  "paymentMethod": "card"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fraudScore": 0.25,
    "isFraudulent": false,
    "flags": ["Unusual amount for new customer"],
    "timestamp": "2024-03-04T10:30:00Z"
  }
}
```

### Get Trending Products
```
GET /ai/trending?limit=10
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "status": 400
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

API requests are limited to:
- 100 requests per minute per IP
- 1000 requests per hour per IP

---

## Pagination

Paginated endpoints return:
```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "pages": 5,
    "currentPage": 1
  }
}
```

---

## Timestamps

All timestamps are in ISO 8601 format:
```
2024-03-04T10:30:00.000Z
```

---

For more information, visit the main [README.md](./README.md)
