# AI-Powered eCommerce Application

A full-stack eCommerce platform with advanced AI features including personalized recommendations, AI chatbot, fraud detection, and automated product descriptions.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Deployment](#deployment)

## ✨ Features

### Core eCommerce Features
- 🛍️ **Product Catalog** - Browse and search products with filters
- 🛒 **Shopping Cart** - Add/remove items, view cart summary
- 💳 **Secure Checkout** - Multi-step checkout with address validation
- 📦 **Order Management** - Track orders, view order history
- 👤 **User Accounts** - Registration, login, profile management

### AI-Powered Features
- 🤖 **Personalized Recommendations** - ML-based product suggestions based on user behavior
- 💬 **AI Chatbot** - 24/7 customer support using OpenAI's GPT
- 📝 **Auto Product Descriptions** - Generate engaging product descriptions with AI
- 🛡️ **Fraud Detection** - Advanced transaction analysis and fraud scoring

### Payment & Security
- 💰 **Stripe Integration** - Secure payment processing
- 🔐 **JWT Authentication** - Secure user sessions
- 🔒 **Fraud Prevention** - Real-time fraud analysis
- 📊 **Order Tracking** - Real-time order status updates

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL with Sequelize ORM
- **Authentication:** JWT (JSON Web Tokens)
- **Payment:** Stripe API
- **AI/ML:** OpenAI API, LangChain
- **Caching:** Redis
- **Testing:** Jest, Supertest

### Frontend
- **Framework:** React 18
- **State Management:** Zustand
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Payment:** Stripe.js
- **Styling:** CSS3 with CSS Variables
- **Icons:** React Icons

### DevOps & Tools
- **Version Control:** Git/GitHub
- **Package Manager:** npm/yarn
- **Environment:** dotenv
- **Code Quality:** ESLint, Jest
- **API Testing:** Postman/Thunder Client

## 📁 Project Structure

```
ecommerce-app/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files (DB, Stripe, OpenAI)
│   │   ├── models/          # Database models (User, Product, Order, etc.)
│   │   ├── controllers/     # Route controllers
│   │   ├── services/        # Business logic (Auth, AI, Payment)
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, error handling
│   │   └── index.js         # Server entry point
│   ├── tests/               # Unit tests
│   ├── package.json
│   ├── .env.example
│   └── jest.config.js
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components (Header, ProductCard, etc.)
│   │   ├── pages/           # Page components (Home, Checkout, Login)
│   │   ├── context/         # Zustand stores (Auth, Cart)
│   │   ├── services/        # API client
│   │   ├── styles/          # Global styles and CSS modules
│   │   ├── utils/           # Helper functions
│   │   ├── App.js           # Main App component
│   │   └── index.js         # React entry point
│   ├── public/
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
└── README.md                # Main project documentation
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js v14+
- PostgreSQL v12+
- npm or yarn
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   Edit `.env` with your settings:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ecommerce_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   
   STRIPE_SECRET_KEY=your_stripe_key
   STRIPE_PUBLIC_KEY=your_stripe_public_key
   
   OPENAI_API_KEY=your_openai_api_key
   
   PORT=5000
   NODE_ENV=development
   ```

5. **Create PostgreSQL database:**
   ```bash
   createdb ecommerce_db
   ```

6. **Run the server:**
   ```bash
   npm run dev
   ```

   Server will start at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

5. **Start development server:**
   ```bash
   npm start
   ```

   App will open at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
PUT  /api/auth/profile
```

### Product Endpoints

```
GET    /api/products                  # Get all products
GET    /api/products/:id              # Get single product
GET    /api/products/trending         # Get trending products
GET    /api/products/search?q=query   # Search products
POST   /api/products                  # Create product (Admin)
PUT    /api/products/:id              # Update product (Admin)
DELETE /api/products/:id              # Delete product (Admin)
```

### Cart Endpoints

```
GET    /api/cart              # Get user cart
POST   /api/cart/add          # Add item to cart
POST   /api/cart/remove       # Remove item from cart
POST   /api/cart/update       # Update cart item
DELETE /api/cart              # Clear cart
```

### Order Endpoints

```
GET    /api/orders                    # Get user orders
GET    /api/orders/:id                # Get order details
POST   /api/orders/payment-intent     # Create payment intent
POST   /api/orders/checkout           # Complete checkout
PUT    /api/orders/:id/status         # Update order status (Admin)
POST   /api/orders/:id/refund         # Request refund
```

### AI Endpoints

```
GET    /api/ai/recommendations       # Get personalized recommendations
POST   /api/ai/chatbot               # Chat with AI assistant
POST   /api/ai/generate-description  # Generate product description
POST   /api/ai/fraud-check           # Check transaction for fraud
GET    /api/ai/trending              # Get trending products
```

## 📖 Frontend Components

### Key Components

- **Header** - Navigation bar with search and cart
- **ProductCard** - Product card with image, price, rating
- **Chatbot** - AI customer support widget
- **Cart** - Shopping cart display and management
- **Checkout** - Multi-step checkout form

### Key Pages

- **Home** - Landing page with hero and trending products
- **Products** - Product listing with filters
- **ProductDetail** - Detailed product information
- **Cart** - Shopping cart page
- **Checkout** - Checkout process
- **Orders** - Order history
- **Login** - User login
- **Register** - User registration
- **Profile** - User profile management

## ⚙️ Configuration

### Database Models

**User Model:**
- UUID, firstName, lastName, email, password
- phone, address, profileImage, role
- isEmailVerified, lastLogin

**Product Model:**
- UUID, name, description, aiGeneratedDescription
- price, discount, stock, category, images
- rating, reviews, tags, sku, manufacturer

**Order Model:**
- UUID, userId, orderNumber, items
- totalPrice, discountAmount, shipping, tax, finalAmount
- status, paymentStatus, fraudScore, isFraudulent
- trackingNumber, shippingAddress, billingAddress

**Cart Model:**
- UUID, userId, items (JSON), totalPrice

**Review Model:**
- UUID, productId, userId, rating, title, comment
- helpful, verified

## 🧪 Running Tests

### Backend Tests

```bash
cd backend
npm test                  # Run all tests
npm test -- --coverage   # Run with coverage
npm test -- --watch      # Watch mode
```

### Frontend Tests

```bash
cd frontend
npm test                  # Run tests
npm test -- --coverage   # Run with coverage
```

## 🎯 Key Features Implementation

### AI Recommendations
The system analyzes user purchase history and recommends products from similar categories with the highest ratings.

### Fraud Detection
Analyzes transaction patterns:
- Unusually high amounts
- Address mismatches
- Rapid consecutive orders
- New customer risk assessment
- Unverified payment methods

### AI Chatbot
Powered by OpenAI's GPT-3.5-turbo, provides instant customer support for:
- Product inquiries
- Order status
- Shipping information
- Return policies

### Payment Processing
Integrates with Stripe for:
- Secure payment processing
- Payment intent creation
- Refund processing
- Transaction tracking

## 📝 Environment Variables Reference

**Backend `.env`:**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLIC_KEY=pk_test_xxx

# OpenAI
OPENAI_API_KEY=sk-xxx

# Redis
REDIS_URL=redis://localhost:6379

# Server
PORT=5000
NODE_ENV=development
```

**Frontend `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_xxx
```

## 🚢 Deployment

### Backend Deployment (Heroku example)

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key
heroku config:set STRIPE_SECRET_KEY=your_key

# Deploy
git push heroku main
```

### Frontend Deployment (Netlify example)

```bash
# Build production bundle
npm run build

# Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

## 📞 Support

For issues and questions:
1. Check the API documentation
2. Review error logs
3. Test with Postman/Thunder Client
4. Check JWT tokens are properly sent

## 📄 License

MIT License - Feel free to use this project for learning and development.

## 🙏 Contributing

Contributions are welcome! Please follow the code style and add tests for new features.

---

**Happy Coding! 🎉**
