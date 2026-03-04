# Quick Start Guide

Get your AI-powered eCommerce application up and running in 15 minutes!

## Prerequisites

- Node.js 14+ ([Download](https://nodejs.org))
- PostgreSQL 12+ ([Download](https://www.postgresql.org/download/))
- Git

## 5-Minute Setup

### 1. Clone or Initialize Project
```bash
cd "c:\Ecommerce app"
```

### 2. Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env with your PostgreSQL credentials
# Then create database
createdb ecommerce_db

# Start the server
npm run dev
```

✅ Backend running at `http://localhost:5000`

### 3. Frontend Setup (5 minutes)

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Start development server
npm start
```

✅ Frontend running at `http://localhost:3000`

## Test the Application

### 1. Create an Account
```bash
# Visit http://localhost:3000
# Click "Sign Up"
# Fill in details and submit
```

### 2. Test Features

**Browse Products:**
- Click "Products" in navigation
- Search for items
- View product details

**Use AI Chatbot:**
- Click the 💬 button in bottom-right
- Ask questions like "What's your return policy?"

**Add to Cart:**
- Click "Add to Cart" on any product
- View cart in header

**Checkout:**
- Click cart icon
- Click "Checkout"
- Fill in shipping address
- Complete purchase

## Key Endpoints to Test

```bash
# Get all products
curl http://localhost:5000/api/products

# Get AI recommendations (requires login)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/ai/recommendations

# Test chatbot
curl -X POST http://localhost:5000/api/ai/chatbot \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Can I return items?"}'
```

## Get API Keys (Optional but Recommended)

### OpenAI API Key
1. Go to https://platform.openai.com/signup
2. Sign up/login
3. Go to API Keys → Create new secret key
4. Copy key to backend `.env`:
   ```env
   OPENAI_API_KEY=sk_...
   ```

### Stripe Test Keys
1. Go to https://dashboard.stripe.com/register
2. Sign up/login
3. Go to Developers → API Keys
4. Use test keys (start with `pk_test_` and `sk_test_`)
5. Copy to `.env`:
   ```env
   STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

## Environment Variables Reference

**Backend `.env`:**
```env
# Database (required)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=password

# JWT (create random string)
JWT_SECRET=your_random_secret_key_here
JWT_EXPIRE=7d

# Optional - AI Features
OPENAI_API_KEY=sk_...

# Optional - Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

# Server
PORT=5000
NODE_ENV=development
```

**Frontend `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
```

## Project Structure

```
├── backend/              # Express.js API
│   ├── src/
│   │   ├── models/      # Database models
│   │   ├── controllers/ # Route handlers
│   │   ├── services/    # Business logic (AI, Payment)
│   │   ├── routes/      # API endpoints
│   │   └── index.js     # Server entry
│   └── tests/           # Unit tests
│
├── frontend/            # React.js App
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page views
│   │   ├── context/     # State management
│   │   └── services/    # API client
│   └── public/          # Static files
│
└── docs/                # Documentation
    ├── README.md        # Full documentation
    ├── SETUP.md        # Setup instructions
    ├── API_DOCUMENTATION.md
    ├── DEPLOYMENT.md
    └── TESTING_GUIDE.md
```

## Common Commands

### Backend
```bash
npm run dev          # Start in development mode
npm test             # Run unit tests
npm test -- --watch # Watch mode testing
npm test -- --coverage # See coverage report
```

### Frontend
```bash
npm start            # Start development server
npm run build        # Create production build
npm test             # Run tests
```

## Database Setup

### Using PostgreSQL CLI

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ecommerce_db;

# Exit
\q
```

### Create Tables Automatically

Tables are created automatically when the server starts (via Sequelize)

## Features Included

✅ **Core eCommerce:**
- Product catalog with search & filters
- Shopping cart & checkout
- Order management
- User authentication

✅ **AI Features:**
- Personalized recommendations
- AI chatbot (24/7 support)
- Fraud detection
- Auto product descriptions

✅ **Security:**
- JWT authentication
- Password hashing with bcrypt
- Secure payment processing (Stripe)

✅ **Responsive Design:**
- Mobile-friendly interface
- Adaptive layouts
- Touch-friendly buttons

## Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=5001
```

### Database Connection Error
```bash
# Verify PostgreSQL is running
# Check credentials in .env
# Ensure database exists
createdb ecommerce_db
```

### npm install Fails
```bash
# Clear npm cache
npm cache clean --force
# Remove node_modules
rm -rf node_modules
# Reinstall
npm install
```

### CORS Error
- Check frontend `.env` has correct `REACT_APP_API_URL`
- Backend should have CORS enabled (already configured)

## Next Steps

1. **Explore the Code:**
   - Check out backend API routes
   - Review React components
   - Study service layer

2. **Read Documentation:**
   - [Full README](./README.md)
   - [API Documentation](./API_DOCUMENTATION.md)
   - [Deployment Guide](./DEPLOYMENT.md)

3. **Run Tests:**
   ```bash
   cd backend && npm test
   cd ../frontend && npm test
   ```

4. **Deploy:**
   See [Deployment Guide](./DEPLOYMENT.md)

## File Locations

| Purpose | Location |
|---------|----------|
| Backend API | `backend/src/` |
| Frontend App | `frontend/src/` |
| Tests | `backend/tests/`, `frontend/src/` |
| Styles | `frontend/src/styles/` |
| Components | `frontend/src/components/` |
| API Models | `backend/src/models/` |
| Services | `backend/src/services/` |

## Documentation Index

- **README.md** - Full project documentation
- **SETUP.md** - Detailed setup instructions
- **API_DOCUMENTATION.md** - Complete API reference
- **DEPLOYMENT.md** - Production deployment guide
- **TESTING_GUIDE.md** - Testing strategies and examples
- **This file** - Quick start guide

## Support & Help

### Check Logs
```bash
# Backend logs appear in terminal
# Frontend logs appear in browser console
# Check browser DevTools (F12) for errors
```

### Common Issues
- CORS errors: Check API URL in frontend `.env`
- Auth errors: Ensure JWT_SECRET is set
- Database errors: Verify PostgreSQL is running

### Resources
- [Express Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Stripe Docs](https://stripe.com/docs)

## What's Next?

1. ✅ Get the app running locally
2. Create sample products
3. Test checkout flow
4. Set up payment keys
5. Enable AI features
6. Deploy to production

---

**Congratulations! Your eCommerce app is ready to use! 🎉**

For detailed information, see [README.md](./README.md)
